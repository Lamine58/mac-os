export interface Message {
  id: string
  text: string
  sent: boolean
  time: string
  timestamp: number
  recipient?: string
  phone?: string
}

const JSONBIN_BIN_ID = 'YOUR_BIN_ID_HERE' // À remplacer par votre bin ID
const JSONBIN_API_KEY = '$2b$10$YOUR_API_KEY_HERE' // À remplacer par votre API key
const JSONBIN_BASE_URL = 'https://api.jsonbin.io/v3/b'

export const useMessagesStorage = () => {
  const loadMessages = async (conversationId: string): Promise<Message[]> => {
    try {
      if (!JSONBIN_BIN_ID || JSONBIN_BIN_ID === 'YOUR_BIN_ID_HERE') {
        // Fallback sur localStorage si JSONBin n'est pas configuré
        const stored = localStorage.getItem(`messages_${conversationId}`)
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
        throw new Error('Failed to load messages')
      }

      const data = await response.json()
      const allMessages = data.record?.messages || {}
      return allMessages[conversationId] || []
    } catch (error) {
      console.error('Error loading messages:', error)
      // Fallback sur localStorage
      const stored = localStorage.getItem(`messages_${conversationId}`)
      return stored ? JSON.parse(stored) : []
    }
  }

  const saveMessages = async (conversationId: string, messages: Message[]): Promise<boolean> => {
    try {
      if (!JSONBIN_BIN_ID || JSONBIN_BIN_ID === 'YOUR_BIN_ID_HERE') {
        // Fallback sur localStorage si JSONBin n'est pas configuré
        localStorage.setItem(`messages_${conversationId}`, JSON.stringify(messages))
        return true
      }

      // Charger les messages existants
      let allMessages: Record<string, Message[]> = {}
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
          allMessages = data.record?.messages || {}
        }
      } catch (error) {
        console.error('Error loading existing messages:', error)
      }

      // Mettre à jour les messages de cette conversation
      allMessages[conversationId] = messages

      // Sauvegarder
      const response = await fetch(`${JSONBIN_BASE_URL}/${JSONBIN_BIN_ID}`, {
        method: 'PUT',
        headers: {
          'X-Master-Key': JSONBIN_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ messages: allMessages })
      })

      if (!response.ok) {
        throw new Error('Failed to save messages')
      }

      // Sauvegarder aussi dans localStorage comme backup
      localStorage.setItem(`messages_${conversationId}`, JSON.stringify(messages))
      return true
    } catch (error) {
      console.error('Error saving messages:', error)
      // Fallback sur localStorage
      localStorage.setItem(`messages_${conversationId}`, JSON.stringify(messages))
      return false
    }
  }

  return {
    loadMessages,
    saveMessages
  }
}


