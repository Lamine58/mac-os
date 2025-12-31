<template>
  <AppWindow 
    :title="'Mail'"
    :is-open="isOpen"
    :force-focus="forceFocus"
    @close="$emit('close')"
  >
    <div class="mail-content">
      <!-- Sidebar avec liste d'emails -->
      <div class="mail-sidebar">
        <div class="sidebar-header">
          <button class="compose-button" @click="showCompose = true">
            <i class="bi bi-pencil-square"></i> Nouveau message
          </button>
        </div>
        <div class="emails-list">
          <div 
            v-for="(email, index) in emails" 
            :key="email.id || index"
            class="email-item"
            :class="{ active: selectedEmail?.id === email.id }"
            @click="selectEmail(email)"
          >
            <div class="email-avatar">
              <img 
                v-if="(email.recipient || 'Lamine').includes('Lamine')" 
                :src="getAssetPath('files/image-2ce6dbd2-3849-4bee-b436-50efd717a9e0.png')" 
                alt="Lamine Ishola" 
                class="avatar-image"
              >
              <div v-else class="avatar-circle">{{ getInitials(email.recipient || 'Lamine') }}</div>
            </div>
            <div class="email-info">
              <div class="email-from">{{ email.recipient || 'Lamine Ishola' }}</div>
              <div class="email-subject">{{ email.subject || '(Sans objet)' }}</div>
              <div class="email-preview">{{ email.body.substring(0, 50) }}{{ email.body.length > 50 ? '...' : '' }}</div>
            </div>
            <div class="email-time">{{ email.time }}</div>
            <button 
              @click.stop="deleteEmail(email.id || index.toString())" 
              class="delete-email-btn"
              title="Supprimer"
            >
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Zone principale -->
      <div class="mail-main">
        <!-- Vue de composition -->
        <div v-if="showCompose" class="compose-view">
          <div class="compose-header">
            <span class="compose-title">Nouveau message</span>
            <button class="close-compose" @click="showCompose = false">
              <i class="bi bi-x"></i>
            </button>
          </div>
          <div class="compose-form">
            <div class="compose-field">
              <label>À</label>
              <input 
                type="email" 
                v-model="newEmail.to" 
                readonly
                class="compose-input"
              >
            </div>
            <div class="compose-field">
              <label>Objet</label>
              <input 
                type="text" 
                v-model="newEmail.subject" 
                placeholder="Objet"
                class="compose-input"
              >
            </div>
            <div class="compose-field">
              <label>Message</label>
              <textarea
                v-model="newEmail.body"
                placeholder="Tapez votre message..."
                class="compose-textarea"
                rows="10"
                ref="emailBodyInput"
              ></textarea>
            </div>
            <div class="compose-actions">
              <button 
                @click="sendEmail" 
                class="send-email-button"
                :disabled="!newEmail.body.trim() || isSaving"
              >
                <i class="bi bi-send"></i> Envoyer
              </button>
              <div v-if="saveStatus" class="save-status">{{ saveStatus }}</div>
            </div>
          </div>
        </div>

        <!-- Vue de lecture d'email -->
        <div v-else-if="selectedEmail" class="email-view">
          <div class="email-header">
            <div class="email-header-top">
              <div class="email-header-avatar">
                <img 
                  v-if="(selectedEmail.recipient || 'Lamine').includes('Lamine')" 
                  :src="getAssetPath('files/image-2ce6dbd2-3849-4bee-b436-50efd717a9e0.png')" 
                  alt="Lamine Ishola" 
                  class="avatar-image"
                >
                <div v-else class="avatar-circle">{{ getInitials(selectedEmail.recipient || 'Lamine') }}</div>
              </div>
              <div class="email-header-info">
                <div class="email-header-from">{{ selectedEmail.recipient || 'Lamine Ishola' }}</div>
                <div class="email-header-to">{{ selectedEmail.email || recipientEmail }}</div>
              </div>
              <div class="email-header-time">{{ selectedEmail.time }}</div>
              <button 
                @click="deleteEmail(selectedEmail.id || '')" 
                class="delete-email-header-btn"
                title="Supprimer"
              >
                <i class="bi bi-trash"></i>
              </button>
            </div>
            <div class="email-header-subject">{{ selectedEmail.subject || '(Sans objet)' }}</div>
          </div>
          <div class="email-body">
            <div class="email-body-content">{{ selectedEmail.body }}</div>
          </div>
        </div>

        <!-- Vue vide -->
        <div v-else class="no-email">
          <i class="bi bi-envelope no-email-icon"></i>
          <p>Sélectionnez un email ou composez un nouveau message</p>
        </div>
      </div>
    </div>
  </AppWindow>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch, onMounted } from 'vue'
import type { Email } from '~/composables/useMailStorage'

const props = defineProps<{
  forceFocus?: number
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const { getAssetPath } = useAssetPath()
const { loadEmails, saveEmails } = useMailStorage()

const showCompose = ref(false)
const selectedEmail = ref<Email | null>(null)
const emails = ref<Email[]>([])
const saveStatus = ref('')
const isSaving = ref(false)
const emailBodyInput = ref<HTMLTextAreaElement | null>(null)

const recipientEmail = 'isholalamine41@gmail.com'
const recipientName = 'Lamine Ishola'
const conversationId = 'lamine'

const newEmail = ref({
  to: recipientEmail,
  subject: '',
  body: ''
})

const getInitials = (name: string): string => {
  const parts = name.split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

const selectEmail = (email: Email) => {
  selectedEmail.value = email
  showCompose.value = false
}

const deleteEmail = async (emailId: string) => {
  const index = emails.value.findIndex(e => (e.id || '') === emailId)
  if (index !== -1) {
    emails.value.splice(index, 1)
    
    // Si l'email supprimé était sélectionné, désélectionner
    if (selectedEmail.value?.id === emailId) {
      selectedEmail.value = null
    }
    
    // Sauvegarder après suppression
    isSaving.value = true
    saveStatus.value = 'Suppression...'
    const saved = await saveEmails(conversationId, emails.value)
    if (saved) {
      saveStatus.value = 'Email supprimé'
      setTimeout(() => {
        saveStatus.value = ''
      }, 2000)
    } else {
      saveStatus.value = 'Erreur de suppression'
    }
    isSaving.value = false
  }
}

const sendEmail = async () => {
  if (!newEmail.value.body.trim()) return

  const now = new Date()
  const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`

  const email: Email = {
    id: Date.now().toString(),
    subject: newEmail.value.subject || '(Sans objet)',
    body: newEmail.value.body.trim(),
    sent: true,
    time: time,
    timestamp: Date.now(),
    recipient: recipientName,
    email: recipientEmail
  }

  emails.value.unshift(email)

  // Réinitialiser le formulaire
  newEmail.value = {
    to: recipientEmail,
    subject: '',
    body: ''
  }
  showCompose.value = false

  // Sauvegarder l'email
  isSaving.value = true
  saveStatus.value = 'Enregistrement...'
  const saved = await saveEmails(conversationId, emails.value)
  if (saved) {
    saveStatus.value = 'Enregistré'
    setTimeout(() => {
      saveStatus.value = ''
    }, 2000)
  } else {
    saveStatus.value = 'Erreur d\'enregistrement'
  }
  isSaving.value = false

  // Ouvrir le lien mailto
  const subject = encodeURIComponent(email.subject)
  const body = encodeURIComponent(email.body)
  const mailtoLink = `mailto:${recipientEmail}?subject=${subject}&body=${body}`
  
  // Créer un lien et le cliquer pour ouvrir le client email (sans nouvel onglet)
  const link = document.createElement('a')
  link.href = mailtoLink
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Charger les emails au montage
onMounted(async () => {
  const loadedEmails = await loadEmails(conversationId)
  if (loadedEmails.length > 0) {
    emails.value = loadedEmails
  } else {
    // Emails par défaut si aucun email sauvegardé
    emails.value = [
      {
        id: '1',
        subject: 'Bienvenue',
        body: 'Bonjour ! Merci de m\'avoir contacté. Je vous répondrai dans les plus brefs délais.',
        sent: false,
        time: '10:30',
        timestamp: Date.now() - 3600000
      }
    ]
    await saveEmails(conversationId, emails.value)
  }
})

// Focus sur le textarea quand on compose
watch(showCompose, (isComposing) => {
  if (isComposing) {
    nextTick(() => {
      if (emailBodyInput.value) {
        emailBodyInput.value.focus()
      }
    })
  }
})

// Focus sur l'input quand la fenêtre s'ouvre
watch(() => props.isOpen, (isOpen) => {
  if (isOpen && showCompose.value) {
    nextTick(() => {
      if (emailBodyInput.value) {
        emailBodyInput.value.focus()
      }
    })
  }
})
</script>

<style scoped>
.mail-content {
  display: flex;
  height: 100%;
  background: var(--bg-window-content);
  transition: background-color 0.3s ease;
}

/* Sidebar */
.mail-sidebar {
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

.compose-button {
  width: 100%;
  padding: 10px;
  background: #007AFF;
  border: none;
  border-radius: 8px;
  color: #ffffff;
  font-size: 14px;
  font-weight: 200;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background 0.2s;
}

.compose-button:hover {
  background: #0056b3;
}

.folders-list {
  padding: 8px;
  border-bottom: 1px solid var(--border-color);
}

.folder-item {
  padding: 10px 12px;
  color: var(--text-color-secondary);
  font-size: 14px;
  cursor: pointer;
  border-radius: 6px;
  transition: color 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: background 0.2s;
  margin-bottom: 4px;
}

.folder-item:hover {
  background: var(--hover-bg);
}

.folder-item.active {
  background: rgba(0, 122, 255, 0.2);
  color: var(--text-color);
}

.emails-list {
  flex: 1;
  overflow-y: auto;
}

.email-item {
  display: flex;
  align-items: flex-start;
  padding: 12px;
  cursor: pointer;
  border-bottom: 1px solid var(--border-color);
  transition: background 0.2s;
  position: relative;
}

.email-item:hover {
  background: var(--hover-bg);
}

.email-item.active {
  background: rgba(0, 122, 255, 0.2);
}

.email-avatar {
  margin-right: 12px;
}

.avatar-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-color);
  font-weight: 200;
  font-size: 14px;
}

.avatar-image {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.email-info {
  flex: 1;
  min-width: 0;
}

.email-from {
  font-weight: 200;
  font-size: 14px;
  color: var(--text-color);
  margin-bottom: 4px;
}

.email-subject {
  font-weight: 500;
  font-size: 13px;
  color: var(--text-color);
  margin-bottom: 4px;
  transition: color 0.3s ease;
}

.email-preview {
  font-size: 12px;
  color: var(--text-color-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.email-time {
  font-size: 11px;
  color: var(--text-color-secondary);
  margin-left: 8px;
  white-space: nowrap;
  transition: color 0.3s ease;
}

.delete-email-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background: var(--hover-bg);
  border: none;
  border-radius: 4px;
  color: var(--text-color-secondary);
  cursor: pointer;
  padding: 6px 8px;
  font-size: 12px;
  opacity: 0;
  transition: opacity 0.2s, background 0.3s ease, color 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.email-item:hover .delete-email-btn {
  opacity: 1;
}

.delete-email-btn:hover {
  background: var(--hover-bg);
  color: var(--text-color);
}

/* Zone principale */
.mail-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--bg-window-content);
}

/* Vue de composition */
.compose-view {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.compose-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-sidebar);
}

.compose-title {
  font-weight: 200;
  font-size: 15px;
  color: var(--text-color);
}

.close-compose {
  background: none;
  border: none;
  color: var(--text-color-secondary);
  font-size: 20px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background 0.2s, color 0.3s ease;
}

.close-compose:hover {
  background: var(--hover-bg);
}

.compose-form {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.compose-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.compose-field label {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-color-secondary);
  transition: color 0.3s ease;
}

.compose-input,
.compose-textarea {
  padding: 10px 14px;
  background: var(--hover-bg);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-color);
  font-size: 14px;
  font-family: inherit;
  outline: none;
  transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
}

.compose-input:focus,
.compose-textarea:focus {
  border-color: #007AFF;
}

.compose-input[readonly] {
  background: var(--hover-bg);
  cursor: not-allowed;
}

.compose-textarea {
  resize: vertical;
  min-height: 200px;
}

.compose-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.send-email-button {
  padding: 10px 20px;
  background: #007AFF;
  border: none;
  border-radius: 8px;
  color: #ffffff;
  font-size: 14px;
  font-weight: 200;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.2s;
}

.send-email-button:hover:not(:disabled) {
  background: #0056b3;
}

.send-email-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.save-status {
  font-size: 12px;
  color: var(--text-color-secondary);
}

/* Vue de lecture */
.email-view {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.email-header {
  padding: 16px;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-sidebar);
}

.email-header-top {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.email-header-avatar {
  flex-shrink: 0;
}

.email-header-info {
  flex: 1;
}

.email-header-from {
  font-weight: 200;
  font-size: 15px;
  color: var(--text-color);
  margin-bottom: 4px;
}

.email-header-to {
  font-size: 13px;
  color: var(--text-color-secondary);
}

.email-header-time {
  font-size: 12px;
  color: var(--text-color-secondary);
  white-space: nowrap;
}

.delete-email-header-btn {
  background: var(--hover-bg);
  border: none;
  border-radius: 6px;
  color: var(--text-color-secondary);
  cursor: pointer;
  padding: 8px 12px;
  font-size: 14px;
  transition: background 0.3s ease, color 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.delete-email-header-btn:hover {
  background: var(--hover-bg);
  color: var(--text-color);
}

.email-header-subject {
  font-weight: 200;
  font-size: 16px;
  color: var(--text-color);
}

.email-body {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
}

.email-body-content {
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-color);
  white-space: pre-wrap;
  transition: color 0.3s ease;
}

.no-email {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-color-secondary);
}

.no-email-icon {
  font-size: 64px;
  color: var(--text-color-secondary);
  opacity: 0.3;
  transition: color 0.3s ease;
}

.no-email p {
  margin-top: 16px;
  font-size: 16px;
}
</style>
