export interface Note {
  id: string
  title: string
  preview: string
  content: string
  date: string
  author?: string
  timestamp: number
}

// ID du bin JSONBin.io - vous devrez créer un bin et remplacer cet ID
// Pour créer un bin : https://jsonbin.io/
// L'ID sera dans l'URL après avoir créé un bin
const JSONBIN_BIN_ID = 'YOUR_BIN_ID_HERE'
const JSONBIN_API_KEY = '$2b$10$YOUR_API_KEY_HERE' // Clé API publique (lecture/écriture)

// URL de base pour JSONBin.io
const JSONBIN_BASE_URL = 'https://api.jsonbin.io/v3/b'

export const useNotesStorage = () => {
  const config = useRuntimeConfig()
  const baseURL = config.public.baseURL || '/mac-os/'

  // Fonction pour charger les notes depuis JSONBin.io
  const loadNotes = async (): Promise<Note[]> => {
    try {
      // Si pas de bin ID configuré, utiliser localStorage comme fallback
      if (!JSONBIN_BIN_ID || JSONBIN_BIN_ID === 'YOUR_BIN_ID_HERE') {
        if (typeof window !== 'undefined') {
          const localNotes = localStorage.getItem('visitor-notes')
          if (localNotes) {
            return JSON.parse(localNotes)
          }
        }
        return []
      }

      const response = await fetch(`${JSONBIN_BASE_URL}/${JSONBIN_BIN_ID}/latest`, {
        method: 'GET',
        headers: {
          'X-Master-Key': JSONBIN_API_KEY,
          'X-Bin-Meta': 'false'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to load notes')
      }

      const data = await response.json()
      // JSONBin.io v3 retourne les données dans un objet avec une propriété "record"
      return data.record?.notes || data.notes || []
    } catch (error) {
      console.error('Error loading notes:', error)
      // Fallback sur localStorage
      if (typeof window !== 'undefined') {
        const localNotes = localStorage.getItem('visitor-notes')
        if (localNotes) {
          return JSON.parse(localNotes)
        }
      }
      return []
    }
  }

  // Fonction pour sauvegarder les notes sur JSONBin.io
  const saveNotes = async (notes: Note[]): Promise<boolean> => {
    try {
      // Sauvegarder aussi dans localStorage comme backup
      if (typeof window !== 'undefined') {
        localStorage.setItem('visitor-notes', JSON.stringify(notes))
      }

      // Si pas de bin ID configuré, on ne sauvegarde que dans localStorage
      if (!JSONBIN_BIN_ID || JSONBIN_BIN_ID === 'YOUR_BIN_ID_HERE') {
        return true
      }

      const response = await fetch(`${JSONBIN_BASE_URL}/${JSONBIN_BIN_ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': JSONBIN_API_KEY
        },
        body: JSON.stringify({ notes })
      })

      return response.ok
    } catch (error) {
      console.error('Error saving notes:', error)
      // Au moins sauvegarder dans localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('visitor-notes', JSON.stringify(notes))
      }
      return false
    }
  }

  // Fonction pour formater la date
  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) {
      return "Aujourd'hui"
    } else if (days === 1) {
      return 'Hier'
    } else if (days < 7) {
      return `Il y a ${days} jours`
    } else {
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    }
  }

  return {
    loadNotes,
    saveNotes,
    formatDate
  }
}

