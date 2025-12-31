<template>
  <AppWindow 
    :title="'FaceTime'"
    :is-open="isOpen"
    :force-focus="forceFocus"
    @close="$emit('close')"
  >
    <div class="facetime-content">
      <!-- Sidebar avec liste de contacts/appels -->
      <div class="facetime-sidebar">
        <div class="sidebar-header">
          <button class="new-call-button" @click="showNewCall = true">
            <i class="bi bi-plus-circle"></i> Nouvel appel
          </button>
        </div>
        <div class="calls-list">
          <div 
            v-for="(call, index) in calls" 
            :key="call.id || index"
            class="call-item"
            :class="{ active: selectedCall?.id === call.id }"
            @click="selectCall(call)"
          >
            <div class="call-avatar">
              <img 
                v-if="(call.name || 'Contact').includes('Lamine')" 
                :src="getAssetPath('files/image-2ce6dbd2-3849-4bee-b436-50efd717a9e0.png')" 
                alt="Lamine Ishola" 
                class="avatar-image"
              >
              <div v-else class="avatar-circle">{{ getInitials(call.name || 'Contact') }}</div>
            </div>
            <div class="call-info">
              <div class="call-name">{{ call.name || 'Contact' }}</div>
              <div class="call-type">{{ call.type === 'video' ? 'Vidéo' : 'Audio' }}</div>
            </div>
            <div class="call-time">{{ call.time }}</div>
          </div>
        </div>
      </div>

      <!-- Zone principale -->
      <div class="facetime-main">
        <!-- Vue de nouvel appel -->
        <div v-if="showNewCall" class="new-call-view">
          <div class="new-call-header">
            <span class="new-call-title">Nouvel appel</span>
            <button class="close-new-call" @click="showNewCall = false">
              <i class="bi bi-x"></i>
            </button>
          </div>
          <div class="new-call-form">
            <div class="facetime-logo-container">
              <img :src="getAssetPath('files/facetime-2021-04-30.webp')" alt="FaceTime" class="facetime-logo">
            </div>
            <div class="call-field">
              <label>Nom ou numéro</label>
              <div class="input-wrapper">
                <i class="bi bi-person input-icon"></i>
                <input 
                  type="text" 
                  v-model="newCallInput" 
                  placeholder="Entrez un nom ou un numéro"
                  class="call-input"
                  @keydown.enter="startCall"
                  ref="callInput"
                >
              </div>
            </div>
            <div class="call-actions">
              <button 
                @click="startCall" 
                class="start-call-button video"
                :disabled="!newCallInput.trim()"
              >
                <i class="bi bi-camera-video"></i> Appel vidéo
              </button>
              <button 
                @click="startAudioCall" 
                class="start-call-button audio"
                :disabled="!newCallInput.trim()"
              >
                <i class="bi bi-telephone"></i> Appel audio
              </button>
            </div>
          </div>
        </div>

        <!-- Vue d'appel actif -->
        <div v-else-if="activeCall" class="active-call-view">
          <div class="call-video-area">
            <div class="video-placeholder">
              <div class="video-avatar">
                <img 
                  v-if="(activeCall.name || 'Contact').includes('Lamine')" 
                  :src="getAssetPath('files/image-2ce6dbd2-3849-4bee-b436-50efd717a9e0.png')" 
                  alt="Lamine Ishola" 
                  class="avatar-image large"
                >
                <div v-else class="avatar-circle large">{{ getInitials(activeCall.name || 'Contact') }}</div>
              </div>
              <div class="call-status">{{ activeCall.name || 'Contact' }}</div>
              <div class="call-duration">{{ callDuration }}</div>
            </div>
          </div>
          <div class="call-controls">
            <button class="control-button mute" @click="toggleMute">
              <i :class="isMuted ? 'bi bi-mic-mute-fill' : 'bi bi-mic-fill'"></i>
            </button>
            <button class="control-button video-toggle" @click="toggleVideo">
              <i :class="isVideoOn ? 'bi bi-camera-video-fill' : 'bi bi-camera-video-off-fill'"></i>
            </button>
            <button class="control-button end-call" @click="endCall">
              <i class="bi bi-telephone-fill"></i>
            </button>
          </div>
        </div>

        <!-- Vue vide -->
        <div v-else class="no-call">
          <img :src="getAssetPath('files/facetime-2021-04-30.webp')" alt="FaceTime" class="facetime-logo-empty">
          <p>Sélectionnez un appel ou composez un nouveau numéro</p>
        </div>
      </div>
    </div>
  </AppWindow>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch, onMounted, onUnmounted } from 'vue'

interface Call {
  id: string
  name: string
  phone?: string
  type: 'video' | 'audio'
  time: string
  timestamp: number
}

const props = defineProps<{
  forceFocus?: number
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const { getAssetPath } = useAssetPath()

const showNewCall = ref(false)
const selectedCall = ref<Call | null>(null)
const activeCall = ref<Call | null>(null)
const calls = ref<Call[]>([])
const newCallInput = ref('')
const callInput = ref<HTMLInputElement | null>(null)
const isMuted = ref(false)
const isVideoOn = ref(true)
const callStartTime = ref<Date | null>(null)
const callDuration = ref('00:00')
let callTimer: NodeJS.Timeout | null = null

const getInitials = (name: string): string => {
  const parts = name.split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

const selectCall = (call: Call) => {
  selectedCall.value = call
  showNewCall.value = false
}

const startCall = () => {
  if (!newCallInput.value.trim()) return

  const now = new Date()
  const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`

  const call: Call = {
    id: Date.now().toString(),
    name: newCallInput.value.trim(),
    type: 'video',
    time: time,
    timestamp: Date.now()
  }

  calls.value.unshift(call)
  activeCall.value = call
  callStartTime.value = new Date()
  showNewCall.value = false
  newCallInput.value = ''

  // Ouvrir le lien facetime
  const facetimeLink = `facetime://${call.name.replace(/\s+/g, '')}`
  const link = document.createElement('a')
  link.href = facetimeLink
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  // Démarrer le timer d'appel
  startCallTimer()
}

const startAudioCall = () => {
  if (!newCallInput.value.trim()) return

  const now = new Date()
  const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`

  const call: Call = {
    id: Date.now().toString(),
    name: newCallInput.value.trim(),
    type: 'audio',
    time: time,
    timestamp: Date.now()
  }

  calls.value.unshift(call)
  activeCall.value = call
  callStartTime.value = new Date()
  showNewCall.value = false
  newCallInput.value = ''

  // Ouvrir le lien facetime audio
  const facetimeLink = `facetime-audio://${call.name.replace(/\s+/g, '')}`
  const link = document.createElement('a')
  link.href = facetimeLink
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  // Démarrer le timer d'appel
  startCallTimer()
}

const startCallTimer = () => {
  if (callTimer) clearInterval(callTimer)
  callTimer = setInterval(() => {
    if (callStartTime.value) {
      const now = new Date()
      const diff = Math.floor((now.getTime() - callStartTime.value.getTime()) / 1000)
      const minutes = Math.floor(diff / 60)
      const seconds = diff % 60
      callDuration.value = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }
  }, 1000)
}

const endCall = () => {
  activeCall.value = null
  callStartTime.value = null
  callDuration.value = '00:00'
  if (callTimer) {
    clearInterval(callTimer)
    callTimer = null
  }
}

const toggleMute = () => {
  isMuted.value = !isMuted.value
}

const toggleVideo = () => {
  isVideoOn.value = !isVideoOn.value
}

// Charger les appels au montage
onMounted(() => {
  // Appels par défaut
  calls.value = [
    {
      id: '1',
      name: 'Lamine Ishola',
      type: 'video',
      time: '10:30',
      timestamp: Date.now() - 3600000
    }
  ]
})

onUnmounted(() => {
  if (callTimer) {
    clearInterval(callTimer)
  }
})

// Focus sur l'input quand on compose
watch(showNewCall, (isComposing) => {
  if (isComposing) {
    nextTick(() => {
      if (callInput.value) {
        callInput.value.focus()
      }
    })
  }
})

// Focus sur l'input quand la fenêtre s'ouvre
watch(() => props.isOpen, (isOpen) => {
  if (isOpen && showNewCall.value) {
    nextTick(() => {
      if (callInput.value) {
        callInput.value.focus()
      }
    })
  }
})
</script>

<style scoped>
.facetime-content {
  display: flex;
  height: 100%;
  background: var(--bg-window-content);
}

/* Sidebar */
.facetime-sidebar {
  width: 280px;
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  background: var(--bg-sidebar);
}

.sidebar-header {
  padding: 12px;
  border-bottom: 1px solid var(--border-color);
}

.new-call-button {
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

.new-call-button:hover {
  background: #0056b3;
}

.calls-list {
  flex: 1;
  overflow-y: auto;
}

.call-item {
  display: flex;
  align-items: center;
  padding: 12px;
  cursor: pointer;
  border-bottom: 1px solid var(--border-color);
  transition: background 0.2s;
}

.call-item:hover {
  background: var(--hover-bg);
}

.call-item.active {
  background: rgba(0, 122, 255, 0.2);
}

.call-avatar {
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
  font-weight: 200;
  font-size: 18px;
}

.avatar-circle.large {
  width: 120px;
  height: 120px;
  font-size: 48px;
}

.avatar-image {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-image.large {
  width: 120px;
  height: 120px;
}

.call-info {
  flex: 1;
  min-width: 0;
}

.call-name {
  font-weight: 200;
  font-size: 15px;
  color: var(--text-color);
  margin-bottom: 4px;
}

.call-type {
  font-size: 13px;
  color: var(--text-color-secondary);
}

.call-time {
  font-size: 12px;
  color: var(--text-color-secondary);
  margin-left: 8px;
  white-space: nowrap;
}

/* Zone principale */
.facetime-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--bg-window-content);
}

/* Vue de nouvel appel */
.new-call-view {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.new-call-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-sidebar);
}

.new-call-title {
  font-weight: 200;
  font-size: 15px;
  color: var(--text-color);
}

.close-new-call {
  background: none;
  border: none;
  color: var(--text-color-secondary);
  font-size: 20px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background 0.2s;
}

.close-new-call:hover {
  background: var(--hover-bg);
}

.new-call-form {
  flex: 1;
  padding: 60px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 40px;
  background: linear-gradient(180deg, var(--bg-window-content) 0%, var(--bg-sidebar) 100%);
  transition: background 0.3s ease;
}

.facetime-logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.facetime-logo {
  width: 120px;
  height: 120px;
  object-fit: contain;
}

.call-field {
  width: 100%;
  max-width: 450px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.call-field label {
  font-size: 14px;
  font-weight: 200;
  color: var(--text-color);
  text-align: left;
  width: 100%;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

.input-icon {
  position: absolute;
  left: 16px;
  color: var(--text-color-secondary);
  font-size: 18px;
  z-index: 1;
}

.call-input {
  width: 100%;
  padding: 16px 16px 16px 48px;
  background: var(--hover-bg);
  border: 2px solid var(--border-color);
  border-radius: 12px;
  color: var(--text-color);
  font-size: 16px;
  font-family: inherit;
  outline: none;
  transition: all 0.3s ease;
}

.call-input::placeholder {
  color: var(--text-color-secondary);
}

.call-input:focus {
  border-color: #007AFF;
  background: var(--hover-bg);
}

.call-actions {
  display: flex;
  gap: 16px;
  width: 100%;
  max-width: 450px;
  margin-top: 10px;
}

.start-call-button {
  flex: 1;
  padding: 16px 24px;
  border: none;
  border-radius: 12px;
  color: #ffffff;
  font-size: 15px;
  font-weight: 200;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s ease;
}

.start-call-button.video {
  background: #007AFF;
}

.start-call-button.video:hover:not(:disabled) {
  background: #0056b3;
}

.start-call-button.audio {
  background: #34C759;
}

.start-call-button.audio:hover:not(:disabled) {
  background: #28a745;
}

.start-call-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Vue d'appel actif */
.active-call-view {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.call-video-area {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
  position: relative;
}

.video-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.call-status {
  font-size: 24px;
  font-weight: 200;
  color: var(--text-color);
}

.call-duration {
  font-size: 18px;
  color: var(--text-color-secondary);
  font-variant-numeric: tabular-nums;
}

.call-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 30px;
  background: rgba(0, 0, 0, 0.5);
}

.control-button {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: none;
  color: var(--text-color);
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.control-button.mute {
  background: var(--hover-bg);
}

.control-button.mute:hover {
  background: var(--hover-bg);
}

.control-button.video-toggle {
  background: var(--hover-bg);
}

.control-button.video-toggle:hover {
  background: var(--hover-bg);
}

.control-button.end-call {
  background: #FF3B30;
  width: 64px;
  height: 64px;
}

.control-button.end-call:hover {
  background: #d32f2f;
}

.no-call {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-color-secondary);
  gap: 20px;
}

.facetime-logo-empty {
  width: 120px;
  height: 120px;
  object-fit: contain;
  opacity: 0.6;
}

.no-call p {
  font-size: 16px;
}
</style>
