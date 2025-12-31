export interface Email {
  id: string
  subject: string
  body: string
  sent: boolean
  time: string
  timestamp: number
  recipient?: string
  email?: string
}

const JSONBIN_BIN_ID = 'YOUR_BIN_ID_HERE' // À remplacer par votre bin ID
const JSONBIN_API_KEY = '$2b$10$YOUR_API_KEY_HERE' // À remplacer par votre API key
const JSONBIN_BASE_URL = 'https://api.jsonbin.io/v3/b'

export const useMailStorage = () => {
  const loadEmails = async (conversationId: string): Promise<Email[]> => {
    try {
      if (!JSONBIN_BIN_ID || JSONBIN_BIN_ID === 'YOUR_BIN_ID_HERE') {
        // Fallback sur localStorage si JSONBin n'est pas configuré
        const stored = localStorage.getItem(`emails_${conversationId}`)
        return stored ? JSON.parse(stored) : []
      }

      const response = await fetch(`${JSONBIN_BASE_URL}/${JSONBIN_BIN_ID}/latest`, {
        method: 'GET',
        headers: {
          'X-Master-Key': JSONBIN_API_KEY,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to load emails')
      }

      const data = await response.json()
      const allEmails = data.record?.emails || {}
      return allEmails[conversationId] || []
    } catch (error) {
      console.error('Error loading emails:', error)
      // Fallback sur localStorage
      const stored = localStorage.getItem(`emails_${conversationId}`)
      return stored ? JSON.parse(stored) : []
    }
  }

  const saveEmails = async (conversationId: string, emails: Email[]): Promise<boolean> => {
    try {
      if (!JSONBIN_BIN_ID || JSONBIN_BIN_ID === 'YOUR_BIN_ID_HERE') {
        // Fallback sur localStorage si JSONBin n'est pas configuré
        localStorage.setItem(`emails_${conversationId}`, JSON.stringify(emails))
        return true
      }

      // Charger les emails existants
      let allEmails: Record<string, Email[]> = {}
      try {
        const response = await fetch(`${JSONBIN_BASE_URL}/${JSONBIN_BIN_ID}/latest`, {
          method: 'GET',
          headers: {
            'X-Master-Key': JSONBIN_API_KEY,
            'Content-Type': 'application/json'
          }
        })
        if (response.ok) {
          const data = await response.json()
          allEmails = data.record?.emails || {}
        }
      } catch (error) {
        console.error('Error loading existing emails:', error)
      }

      // Mettre à jour les emails de cette conversation
      allEmails[conversationId] = emails

      // Sauvegarder
      const response = await fetch(`${JSONBIN_BASE_URL}/${JSONBIN_BIN_ID}`, {
        method: 'PUT',
        headers: {
          'X-Master-Key': JSONBIN_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ emails: allEmails })
      })

      if (!response.ok) {
        throw new Error('Failed to save emails')
      }

      // Sauvegarder aussi dans localStorage comme backup
      localStorage.setItem(`emails_${conversationId}`, JSON.stringify(emails))
      return true
    } catch (error) {
      console.error('Error saving emails', error)
      // Fallback sur localStorage
      localStorage.setItem(`emails_${conversationId}`, JSON.stringify(emails))
      return false
    }
  }

  return {
    loadEmails,
    saveEmails
  }
}




