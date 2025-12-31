<template>
  <AppWindow 
    :title="'Messages'"
    :is-open="isOpen"
    :force-focus="forceFocus"
    @close="$emit('close')"
  >
    <div class="messages-content">
      <!-- Sidebar avec liste de conversations -->
      <div class="messages-sidebar">
        <div class="sidebar-header">
          <input 
            type="text" 
            placeholder="Rechercher" 
            class="search-input"
            v-model="searchQuery"
          >
        </div>
        <div class="conversations-list">
          <div 
            class="conversation-item"
            :class="{ active: selectedConversation === 'lamine' }"
            @click="selectConversation('lamine')"
          >
            <div class="conversation-avatar">
              <img :src="getAssetPath('files/image-2ce6dbd2-3849-4bee-b436-50efd717a9e0.png')" alt="Lamine Ishola" class="avatar-image">
            </div>
            <div class="conversation-info">
              <div class="conversation-name">{{ conversationName }}</div>
              <div class="conversation-preview">{{ lastMessage }}</div>
            </div>
            <div class="conversation-time">{{ lastMessageTime }}</div>
          </div>
        </div>
      </div>

      <!-- Zone de conversation principale -->
      <div class="messages-main">
        <div v-if="selectedConversation" class="conversation-view">
          <!-- En-tête de conversation -->
          <div class="conversation-header">
            <div class="header-avatar">
              <img :src="getAssetPath('files/image-2ce6dbd2-3849-4bee-b436-50efd717a9e0.png')" alt="Lamine Ishola" class="avatar-image">
            </div>
            <div class="header-info">
              <div class="header-name">{{ conversationName }}</div>
              <div class="header-phone">{{ formatPhoneNumber(conversationPhone) }}</div>
            </div>
          </div>

          <!-- Messages -->
          <div class="messages-list" ref="messagesList">
            <div 
              v-for="(message, index) in messages" 
              :key="index"
              class="message-wrapper"
              :class="{ 'sent': message.sent, 'received': !message.sent }"
            >
              <div class="message-bubble" :class="{ 'sent': message.sent, 'received': !message.sent }">
                <div class="message-text">{{ message.text }}</div>
                <div class="message-time">{{ message.time }}</div>
                <button 
                  @click.stop="deleteMessage(index)" 
                  class="delete-message-btn"
                  title="Supprimer"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Zone de saisie -->
          <div class="message-input-area">
            <div class="input-container">
              <textarea
                v-model="newMessage"
                @keydown.enter.exact.prevent="sendMessage"
                @keydown.shift.enter.exact="newMessage += '\n'"
                placeholder="Tapez votre message..."
                class="message-input"
                rows="1"
                ref="messageInput"
              ></textarea>
              <button 
                @click="sendMessage" 
                class="send-button"
                :disabled="!newMessage.trim() || isSaving"
              >
                <i class="bi bi-arrow-up-circle-fill"></i>
              </button>
            </div>
            <div v-if="saveStatus" class="save-status">{{ saveStatus }}</div>
          </div>
        </div>

        <div v-else class="no-conversation">
          <i class="bi bi-chat-dots" style="font-size: 64px; color: var(--text-color-secondary); opacity: 0.3;"></i>
          <p>Sélectionnez une conversation</p>
        </div>
      </div>
    </div>
  </AppWindow>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch, onMounted } from 'vue'
import type { Message } from '~/composables/useMessagesStorage'

const props = defineProps<{
  forceFocus?: number
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const { getAssetPath } = useAssetPath()
const { loadMessages, saveMessages } = useMessagesStorage()

const selectedConversation = ref<string | null>('lamine')
const searchQuery = ref('')
const newMessage = ref('')
const messagesList = ref<HTMLElement | null>(null)
const messageInput = ref<HTMLTextAreaElement | null>(null)
const messages = ref<Message[]>([])
const saveStatus = ref('')
const isSaving = ref(false)

const conversationPhone = '+2250172560115'
const conversationName = 'Lamine Ishola'
const conversationId = 'lamine'

const lastMessage = computed(() => {
  if (messages.value.length === 0) return 'Aucun message'
  const last = messages.value[messages.value.length - 1]
  return last.text
})

const lastMessageTime = computed(() => {
  if (messages.value.length === 0) return ''
  return messages.value[messages.value.length - 1].time
})

const selectConversation = (id: string) => {
  selectedConversation.value = id
}

const formatPhoneNumber = (phone: string): string => {
  // Enlever le + s'il existe déjà
  let cleaned = phone.replace(/^\+/, '')
  // Formater: +225 01 72 56 01 15
  if (cleaned.startsWith('225')) {
    const rest = cleaned.substring(3)
    if (rest.length >= 10) {
      return `+225 ${rest.substring(0, 2)} ${rest.substring(2, 4)} ${rest.substring(4, 6)} ${rest.substring(6, 8)} ${rest.substring(8)}`
    }
  }
  return phone
}

const sendMessage = async () => {
  if (!newMessage.value.trim()) return

  const now = new Date()
  const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`

  const message: Message = {
    id: Date.now().toString(),
    text: newMessage.value.trim(),
    sent: true,
    time: time,
    timestamp: Date.now(),
    recipient: conversationName,
    phone: conversationPhone
  }

  messages.value.push(message)
  newMessage.value = ''

  // Scroll vers le bas
  nextTick(() => {
    if (messagesList.value) {
      messagesList.value.scrollTop = messagesList.value.scrollHeight
    }
  })

  // Sauvegarder le message
  isSaving.value = true
  saveStatus.value = 'Enregistrement...'
  const saved = await saveMessages(conversationId, messages.value)
  if (saved) {
    saveStatus.value = 'Enregistré'
    setTimeout(() => {
      saveStatus.value = ''
    }, 2000)
  } else {
    saveStatus.value = 'Erreur d\'enregistrement'
  }
  isSaving.value = false

  // Ouvrir le lien SMS
  const smsLink = `sms:${conversationPhone}?body=${encodeURIComponent(message.text)}`
  window.open(smsLink, '_blank')

  // Simuler une réponse après 2 secondes
  setTimeout(() => {
    const responseMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: 'Message reçu ! Merci pour votre message.',
      sent: false,
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now()
    }
    messages.value.push(responseMessage)
    
    // Sauvegarder la réponse aussi
    saveMessages(conversationId, messages.value)
    
    nextTick(() => {
      if (messagesList.value) {
        messagesList.value.scrollTop = messagesList.value.scrollHeight
      }
    })
  }, 2000)
}

const deleteMessage = async (index: number) => {
  messages.value.splice(index, 1)
  
  // Sauvegarder après suppression
  isSaving.value = true
  saveStatus.value = 'Suppression...'
  const saved = await saveMessages(conversationId, messages.value)
  if (saved) {
    saveStatus.value = 'Message supprimé'
    setTimeout(() => {
      saveStatus.value = ''
    }, 2000)
  } else {
    saveStatus.value = 'Erreur de suppression'
  }
  isSaving.value = false
}

// Auto-scroll quand de nouveaux messages arrivent
watch(messages, () => {
  nextTick(() => {
    if (messagesList.value) {
      messagesList.value.scrollTop = messagesList.value.scrollHeight
    }
  })
}, { deep: true })

// Charger les messages au montage
onMounted(async () => {
  if (selectedConversation.value) {
    const loadedMessages = await loadMessages(conversationId)
    if (loadedMessages.length > 0) {
      messages.value = loadedMessages
    } else {
      // Messages par défaut si aucun message sauvegardé
      messages.value = [
        {
          id: '1',
          text: 'Bonjour ! Comment allez-vous ?',
          sent: false,
          time: '10:30',
          timestamp: Date.now() - 3600000
        },
        {
          id: '2',
          text: 'Bonjour ! Je vais très bien, merci. Et vous ?',
          sent: true,
          time: '10:32',
          timestamp: Date.now() - 3300000,
          recipient: conversationName,
          phone: conversationPhone
        }
      ]
      await saveMessages(conversationId, messages.value)
    }
  }
})

// Focus sur l'input quand la fenêtre s'ouvre
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    nextTick(() => {
      if (messageInput.value) {
        messageInput.value.focus()
      }
    })
  }
})
</script>

<style scoped>
.messages-content {
  display: flex;
  height: 100%;
  background: var(--bg-window-content);
  transition: background-color 0.3s ease;
}

/* Sidebar */
.messages-sidebar {
  width: 280px;
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  background: var(--bg-sidebar);
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.sidebar-header {
  padding: 12px;
  border-bottom: 1px solid var(--border-color);
}

.search-input {
  width: 100%;
  padding: 8px 12px;
  background: var(--hover-bg);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-color);
  font-size: 14px;
  outline: none;
}

.search-input::placeholder {
  color: var(--text-color-secondary);
}

.conversations-list {
  flex: 1;
  overflow-y: auto;
}

.conversation-item {
  display: flex;
  align-items: center;
  padding: 12px;
  cursor: pointer;
  border-bottom: 1px solid var(--border-color);
  transition: background 0.2s;
}

.conversation-item:hover {
  background: var(--hover-bg);
}

.conversation-item.active {
  background: rgba(0, 122, 255, 0.2);
}

.conversation-avatar {
  margin-right: 12px;
}

.avatar-circle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-color);
  font-weight: 600;
  font-size: 18px;
}

.avatar-image {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.conversation-info {
  flex: 1;
  min-width: 0;
}

.conversation-name {
  font-weight: 600;
  font-size: 15px;
  color: var(--text-color);
  margin-bottom: 4px;
}

.conversation-preview {
  font-size: 13px;
  color: var(--text-color-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.conversation-time {
  font-size: 12px;
  color: var(--text-color-secondary);
  margin-left: 8px;
}

/* Zone principale */
.messages-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--bg-window-content);
}

.conversation-view {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.conversation-header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-sidebar);
}

.header-avatar {
  margin-right: 12px;
}

.header-info {
  flex: 1;
}

.header-name {
  font-weight: 600;
  font-size: 15px;
  color: var(--text-color);
  margin-bottom: 2px;
}

.header-phone {
  font-size: 13px;
  color: var(--text-color-secondary);
}

.messages-list {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.message-wrapper {
  display: flex;
  width: 100%;
}

.message-wrapper.sent {
  justify-content: flex-end;
}

.message-wrapper.received {
  justify-content: flex-start;
}

.message-bubble {
  max-width: 70%;
  padding: 10px 14px;
  border-radius: 18px;
  position: relative;
}

.message-bubble.sent {
  background: #007AFF;
  color: #ffffff;
  border-bottom-right-radius: 4px;
}

.message-bubble.received {
  background: var(--hover-bg);
  color: var(--text-color);
  border-bottom-left-radius: 4px;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.message-text {
  font-size: 14px;
  line-height: 1.4;
  word-wrap: break-word;
  margin-bottom: 4px;
}

.message-time {
  font-size: 11px;
  opacity: 0.7;
  text-align: right;
  margin-top: 4px;
}

.message-bubble.received .message-time {
  text-align: left;
}

.delete-message-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(0, 0, 0, 0.3);
  border: none;
  border-radius: 4px;
  color: var(--text-color-secondary);
  cursor: pointer;
  padding: 4px 6px;
  font-size: 12px;
  opacity: 0;
  transition: opacity 0.2s, background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.message-bubble {
  position: relative;
}

.message-bubble:hover .delete-message-btn {
  opacity: 1;
}

.delete-message-btn:hover {
  background: rgba(0, 0, 0, 0.6);
  color: var(--text-color);
}

.message-input-area {
  padding: 12px 16px;
  border-top: 1px solid var(--border-color);
  background: var(--bg-sidebar);
}

.input-container {
  display: flex;
  align-items: flex-end;
  gap: 8px;
}

.message-input {
  flex: 1;
  padding: 10px 14px;
  background: var(--hover-bg);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  color: var(--text-color);
  font-size: 14px;
  font-family: inherit;
  resize: none;
  outline: none;
  max-height: 120px;
  overflow-y: auto;
}

.message-input::placeholder {
  color: var(--text-color-secondary);
}

.send-button {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #007AFF;
  border: none;
  color: #ffffff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  transition: background 0.2s;
  flex-shrink: 0;
}

.send-button:hover:not(:disabled) {
  background: #0056b3;
}

.send-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.save-status {
  font-size: 11px;
  color: var(--text-color-secondary);
  margin-top: 4px;
  text-align: center;
}

.no-conversation {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-color-secondary);
}

.no-conversation p {
  margin-top: 16px;
  font-size: 16px;
}
</style>
