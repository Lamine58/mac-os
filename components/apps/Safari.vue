<template>
  <AppWindow 
    :title="currentUrl || 'Safari'"
    :is-open="isOpen"
    @close="$emit('close')"
  >
    <div class="safari-content">
      <div class="safari-toolbar">
        <div class="safari-nav-buttons">
          <button class="nav-btn" @click="goBack" :disabled="!canGoBack" title="Précédent">
            <i class="bi bi-chevron-left"></i>
          </button>
          <button class="nav-btn" @click="goForward" :disabled="!canGoForward" title="Suivant">
            <i class="bi bi-chevron-right"></i>
          </button>
          <button class="nav-btn" @click="reload" title="Recharger">
            <i class="bi bi-arrow-clockwise"></i>
          </button>
        </div>
        <div class="safari-address-bar">
          <div class="address-bar-left">
            <i v-if="isValidUrl && currentUrl" class="bi bi-lock-fill" style="color: rgba(255,255,255,0.6); font-size: 12px;"></i>
          </div>
          <input 
            type="text" 
            v-model="currentUrl" 
            @keyup.enter="navigate"
            placeholder="Rechercher ou saisir une adresse web"
            class="address-input"
          >
          <div class="address-bar-right">
            <button class="refresh-btn" @click="reload" v-if="currentUrl">
              <i class="bi bi-arrow-clockwise"></i>
            </button>
          </div>
        </div>
        <div class="safari-actions">
          <button class="action-btn" title="Partager">
            <i class="bi bi-share"></i>
          </button>
          <button class="action-btn" title="Onglets">
            <i class="bi bi-square"></i>
          </button>
        </div>
      </div>
      <div class="safari-tabs">
        <div class="tab active">
          <span class="tab-title">{{ currentUrl ? getDomain(currentUrl) : 'Nouvel onglet' }}</span>
          <button class="tab-close" @click.stop="closeTab">×</button>
        </div>
        <div class="tab new-tab" @click="newTab">
          <i class="bi bi-plus"></i>
        </div>
      </div>
      <div class="safari-viewport">
        <iframe 
          v-if="currentUrl && isValidUrl"
          :src="currentUrl" 
          class="safari-iframe"
          frameborder="0"
        ></iframe>
        <div v-else class="safari-home">
          <img src="/files/icon_safari.png" alt="Safari Logo" width="100" style="margin-bottom: 20px;"> 
          <div class="safari-favorites">
            <h3>Favoris</h3>
            <div class="favorites-grid">
              <div 
                v-for="fav in favorites" 
                :key="fav.name"
                class="favorite-item"
                @click="navigateTo(fav.url)"
              >
                <div class="favorite-icon" :style="{ background: fav.color }">{{ fav.icon }}</div>
                <span>{{ fav.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppWindow>
</template>

<script setup lang="ts">
const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const currentUrl = ref('')
const history = ref<string[]>([])
const historyIndex = ref(-1)
const canGoBack = computed(() => historyIndex.value > 0)
const canGoForward = computed(() => historyIndex.value < history.value.length - 1)

const isValidUrl = computed(() => {
  if (!currentUrl.value) return false
  try {
    new URL(currentUrl.value.startsWith('http') ? currentUrl.value : `https://${currentUrl.value}`)
    return true
  } catch {
    return false
  }
})

const favorites = [
  { name: 'Rsm CI', url: 'https://www.rsm-ci.net', icon: 'R', color: '#4285F4' },
  { name: 'Mysoft', url: 'https://mysoft-c.com', icon: 'M', color: '#FF0000' },
  { name: 'Coriginal', url: 'https://coriginal.ci', icon: 'C', color: '#24292e' },
  { name: 'Lasersmedical', url: 'https://lasersmedical.fr', icon: 'L', color: '#0077B5' },
  { name: 'Paiement PRO', url: 'https://paiementpro.net', icon: 'P', color: '#0077B5' }
]

const getDomain = (url: string) => {
  try {
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`)
    return urlObj.hostname.replace('www.', '')
  } catch {
    return url
  }
}

const navigate = () => {
  if (!currentUrl.value) return
  let url = currentUrl.value
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`
  }
  currentUrl.value = url
  history.value = history.value.slice(0, historyIndex.value + 1)
  history.value.push(url)
  historyIndex.value = history.value.length - 1
}

const navigateTo = (url: string) => {
  currentUrl.value = url
  navigate()
}

const goBack = () => {
  if (canGoBack.value) {
    historyIndex.value--
    currentUrl.value = history.value[historyIndex.value]
  }
}

const goForward = () => {
  if (canGoForward.value) {
    historyIndex.value++
    currentUrl.value = history.value[historyIndex.value]
  }
}

const reload = () => {
  if (currentUrl.value) {
    navigate()
  }
}

const newTab = () => {
  currentUrl.value = ''
}

const closeTab = () => {
  currentUrl.value = ''
}
</script>

<style scoped>
.safari-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #1e1e1e;
}

.safari-toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #2e2e2e;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.safari-nav-buttons {
  display: flex;
  gap: 4px;
}

.nav-btn {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  width: 28px;
  height: 28px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
  font-size: 14px;
}

.nav-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.1);
}

.nav-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.safari-address-bar {
  flex: 1;
  display: flex;
  align-items: center;
  background: #3e3e3e;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0 12px;
  height: 32px;
  transition: box-shadow 0.2s;
}

.safari-address-bar:focus-within {
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.3);
  border-color: #007aff;
}

.address-bar-left, .address-bar-right {
  display: flex;
  align-items: center;
}

.address-input {
  flex: 1;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.9);
  font-size: 13px;
  outline: none;
  padding: 0 8px;
}

.refresh-btn {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  width: 20px;
  height: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

.safari-actions {
  display: flex;
  gap: 4px;
}

.action-btn {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  width: 28px;
  height: 28px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
  font-size: 14px;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.safari-tabs {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 0 8px;
  background: #252525;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  overflow-x: auto;
}

.tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px 8px 0 0;
  cursor: pointer;
  min-width: 120px;
  max-width: 200px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
}

.tab.active {
  background: #1e1e1e;
  color: rgba(255, 255, 255, 0.9);
}

.tab-title {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tab-close {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  width: 16px;
  height: 16px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  line-height: 1;
  padding: 0;
}

.tab-close:hover {
  background: rgba(255, 255, 255, 0.1);
}

.new-tab {
  min-width: 32px;
  max-width: 32px;
  padding: 6px;
  justify-content: center;
}

.safari-viewport {
  flex: 1;
  overflow: hidden;
  position: relative;
  background: #1e1e1e;
}

.safari-iframe {
  width: 100%;
  height: 100%;
  border: none;
  background: white;
}

.safari-home {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 40px;
  text-align: center;
  background: #1e1e1e;
}

.safari-logo {
  margin-bottom: 30px;
}

.safari-home h2 {
  margin: 0 0 10px 0;
  font-size: 32px;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.9);
}

.safari-favorites {
  width: 100%;
  max-width: 600px;
  margin-top: 40px;
}

.safari-favorites h3 {
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 20px;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 20px;
}

.favorite-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 10px;
  border-radius: 8px;
  transition: transform 0.2s;
}

.favorite-item:hover {
  transform: translateY(-2px);
}

.favorite-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 18px;
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.favorite-item span {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
}
</style>
