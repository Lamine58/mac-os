<template>
  <AppWindow 
    :title="'Contacts'"
    :is-open="isOpen"
    :force-focus="forceFocus"
    @close="$emit('close')"
  >
    <div class="contacts-content">
      <!-- Sidebar avec liste de contacts -->
      <div class="contacts-sidebar">
        <div class="sidebar-header">
          <input 
            type="text" 
            placeholder="Rechercher" 
            class="search-input"
            v-model="searchQuery"
          >
        </div>
        <div class="contacts-list">
          <div 
            v-for="contact in filteredContacts" 
            :key="contact.id"
            class="contact-item"
            :class="{ active: selectedContact?.id === contact.id }"
            @click="selectContact(contact)"
          >
            <div class="contact-avatar">
              <div class="avatar-circle">
                <img :src="getAssetPath('files/image-2ce6dbd2-3849-4bee-b436-50efd717a9e0.png')" alt="Avatar" class="avatar-image">
              </div>
            </div>
            <div class="contact-info">
              <div class="contact-name">{{ contact.name }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Zone principale -->
      <div class="contacts-main">
        <div v-if="selectedContact" class="contact-view">
          <div class="contact-header">
            <div class="contact-header-avatar">
              <div class="avatar-circle large">
                <img :src="getAssetPath('files/image-2ce6dbd2-3849-4bee-b436-50efd717a9e0.png')" alt="Avatar" class="avatar-image large">
              </div>
            </div>
            <div class="contact-header-info">
              <div class="contact-header-name">{{ selectedContact.name }}</div>
            </div>
          </div>
          
          <div class="contact-details">
            <div class="detail-section">
              <div class="detail-label">Téléphone</div>
              <div class="detail-value">
                <a :href="`tel:${selectedContact.phone}`" class="phone-link">
                  {{ formatPhoneNumber(selectedContact.phone) }}
                </a>
              </div>
            </div>
            
            <div class="detail-section" v-if="selectedContact.email">
              <div class="detail-label">Email</div>
              <div class="detail-value">
                <a :href="`mailto:${selectedContact.email}`" class="email-link">
                  {{ selectedContact.email }}
                </a>
              </div>
            </div>
            
            <div class="contact-actions">
              <button class="action-button facetime" @click="startFaceTime">
                <i class="bi bi-camera-video"></i> FaceTime
              </button>
              <button class="action-button call" @click="startCall">
                <i class="bi bi-telephone"></i> Appeler
              </button>
              <button class="action-button message" @click="startMessage">
                <i class="bi bi-chat"></i> Message
              </button>
            </div>
          </div>
        </div>

        <div v-else class="no-contact">
          <i class="bi bi-person" style="font-size: 64px; color: rgba(255, 255, 255, 0.3);"></i>
          <p>Sélectionnez un contact</p>
        </div>
      </div>
    </div>
  </AppWindow>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Contact {
  id: string
  name: string
  phone: string
  email?: string
}

const props = defineProps<{
  forceFocus?: number
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const { getAssetPath } = useAssetPath()

const searchQuery = ref('')
const selectedContact = ref<Contact | null>(null)

const contacts = ref<Contact[]>([
  {
    id: '1',
    name: 'Lamine Ishola',
    phone: '+2250172560115',
    email: 'isholalamine41@gmail.com'
  }
])

const filteredContacts = computed(() => {
  if (!searchQuery.value.trim()) {
    return contacts.value
  }
  const query = searchQuery.value.toLowerCase()
  return contacts.value.filter(contact => 
    contact.name.toLowerCase().includes(query) ||
    contact.phone.includes(query) ||
    (contact.email && contact.email.toLowerCase().includes(query))
  )
})

const getInitials = (name: string): string => {
  const parts = name.split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

const formatPhoneNumber = (phone: string): string => {
  let cleaned = phone.replace(/^\+/, '')
  if (cleaned.startsWith('225')) {
    const rest = cleaned.substring(3)
    if (rest.length >= 10) {
      return `+225 ${rest.substring(0, 2)} ${rest.substring(2, 4)} ${rest.substring(4, 6)} ${rest.substring(6, 8)} ${rest.substring(8)}`
    }
  }
  return phone
}

const selectContact = (contact: Contact) => {
  selectedContact.value = contact
}

const startFaceTime = () => {
  if (selectedContact.value) {
    const facetimeLink = `facetime://${selectedContact.value.phone.replace(/\s+/g, '')}`
    const link = document.createElement('a')
    link.href = facetimeLink
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

const startCall = () => {
  if (selectedContact.value) {
    const telLink = `tel:${selectedContact.value.phone}`
    const link = document.createElement('a')
    link.href = telLink
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

const startMessage = () => {
  if (selectedContact.value) {
    const smsLink = `sms:${selectedContact.value.phone}`
    window.open(smsLink, '_blank')
  }
}

// Sélectionner le premier contact par défaut
if (contacts.value.length > 0) {
  selectedContact.value = contacts.value[0]
}
</script>

<style scoped>
.contacts-content {
  display: flex;
  height: 100%;
  background: #1e1e1e;
}

/* Sidebar */
.contacts-sidebar {
  width: 280px;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  background: #252525;
}

.sidebar-header {
  padding: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.search-input {
  width: 100%;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  font-size: 14px;
  outline: none;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.contacts-list {
  flex: 1;
  overflow-y: auto;
}

.contact-item {
  display: flex;
  align-items: center;
  padding: 12px;
  cursor: pointer;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  transition: background 0.2s;
}

.contact-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.contact-item.active {
  background: rgba(0, 122, 255, 0.2);
}

.contact-avatar {
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
  color: white;
  font-weight: 600;
  font-size: 18px;
  overflow: hidden;
}

.avatar-circle.large {
  width: 120px;
  height: 120px;
  font-size: 48px;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.contact-info {
  flex: 1;
  min-width: 0;
}

.contact-name {
  font-weight: 600;
  font-size: 15px;
  color: white;
}

/* Zone principale */
.contacts-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #1e1e1e;
}

.contact-view {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.contact-header {
  display: flex;
  align-items: center;
  padding: 30px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: #252525;
  gap: 20px;
}

.contact-header-avatar {
  flex-shrink: 0;
}

.contact-header-info {
  flex: 1;
}

.contact-header-name {
  font-weight: 600;
  font-size: 28px;
  color: white;
}

.contact-details {
  flex: 1;
  padding: 30px;
  overflow-y: auto;
}

.detail-section {
  margin-bottom: 30px;
}

.detail-label {
  font-size: 13px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-value {
  font-size: 18px;
  color: white;
}

.phone-link,
.email-link {
  color: #007AFF;
  text-decoration: none;
  transition: opacity 0.2s;
}

.phone-link:hover,
.email-link:hover {
  opacity: 0.8;
  text-decoration: underline;
}

.contact-actions {
  display: flex;
  gap: 12px;
  margin-top: 40px;
  padding-top: 30px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.action-button {
  flex: 1;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;
}

.action-button.facetime {
  background: #007AFF;
}

.action-button.facetime:hover {
  background: #0056b3;
}

.action-button.call {
  background: #34C759;
}

.action-button.call:hover {
  background: #28a745;
}

.action-button.message {
  background: #5856D6;
}

.action-button.message:hover {
  background: #4846c6;
}

.no-contact {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.5);
}

.no-contact p {
  margin-top: 16px;
  font-size: 16px;
}
</style>
