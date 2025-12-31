<template>
  <AppWindow 
    :title="'Paramètres'"
    :is-open="isOpen"
    :force-focus="forceFocus"
    :initial-width="1000"
    :initial-height="700"
    @close="$emit('close')"
  >
    <div class="settings-content">
      <!-- Sidebar -->
      <div class="settings-sidebar">
        <div class="sidebar-section">
          <div 
            v-for="category in categories" 
            :key="category.id"
            class="sidebar-item"
            :class="{ active: selectedCategory === category.id }"
            @click="selectedCategory = category.id"
          >
            <i :class="category.icon"></i>
            <span>{{ category.name }}</span>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="settings-main">
        <div class="settings-header">
          <h1>{{ currentCategory?.name }}</h1>
        </div>

        <div class="settings-body">
          <!-- Général -->
          <div v-if="selectedCategory === 'general'" class="settings-panel">
            <div class="settings-group">
              <h2>Apparence</h2>
              <div class="settings-option">
                <div class="option-label">
                  <span>Mode d'affichage</span>
                </div>
                <div class="option-control">
                  <div class="radio-group">
                    <label class="radio-option">
                      <input type="radio" name="appearance" value="light" checked>
                      <span>Clair</span>
                    </label>
                    <label class="radio-option">
                      <input type="radio" name="appearance" value="dark">
                      <span>Sombre</span>
                    </label>
                    <label class="radio-option">
                      <input type="radio" name="appearance" value="auto">
                      <span>Automatique</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div class="settings-group">
              <h2>Accent</h2>
              <div class="settings-option">
                <div class="option-label">
                  <span>Couleur d'accentuation</span>
                </div>
                <div class="option-control">
                  <div class="color-picker">
                    <div 
                      v-for="color in accentColors" 
                      :key="color"
                      class="color-option"
                      :class="{ active: selectedAccent === color }"
                      :style="{ backgroundColor: color }"
                      @click="selectedAccent = color"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Bureau et Dock -->
          <div v-if="selectedCategory === 'desktop'" class="settings-panel">
            <div class="settings-group">
              <h2>Dock</h2>
              <div class="settings-option">
                <div class="option-label">
                  <span>Taille du Dock</span>
                </div>
                <div class="option-control">
                  <div class="slider-container">
                    <input type="range" min="30" max="100" v-model="dockSize" class="slider">
                    <span class="slider-value">{{ dockSize }}%</span>
                  </div>
                </div>
              </div>
              <div class="settings-option">
                <div class="option-label">
                  <span>Masquer automatiquement le Dock</span>
                </div>
                <div class="option-control">
                  <label class="toggle-switch">
                    <input type="checkbox" v-model="dockAutoHide">
                    <span class="toggle-slider"></span>
                  </label>
                </div>
              </div>
              <div class="settings-option">
                <div class="option-label">
                  <span>Agrandir les icônes au survol</span>
                </div>
                <div class="option-control">
                  <label class="toggle-switch">
                    <input type="checkbox" v-model="dockMagnification" checked>
                    <span class="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Notifications -->
          <div v-if="selectedCategory === 'notifications'" class="settings-panel">
            <div class="settings-group">
              <h2>Notifications</h2>
              <div class="settings-option">
                <div class="option-label">
                  <span>Activer les notifications</span>
                </div>
                <div class="option-control">
                  <label class="toggle-switch">
                    <input type="checkbox" v-model="notificationsEnabled" checked>
                    <span class="toggle-slider"></span>
                  </label>
                </div>
              </div>
              <div class="settings-option">
                <div class="option-label">
                  <span>Style de notification</span>
                </div>
                <div class="option-control">
                  <select v-model="notificationStyle" class="select-input">
                    <option value="banners">Bannières</option>
                    <option value="alerts">Alertes</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- Confidentialité -->
          <div v-if="selectedCategory === 'privacy'" class="settings-panel">
            <div class="settings-group">
              <h2>Confidentialité</h2>
              <div class="settings-option">
                <div class="option-label">
                  <span>Services de localisation</span>
                </div>
                <div class="option-control">
                  <label class="toggle-switch">
                    <input type="checkbox" v-model="locationServices" checked>
                    <span class="toggle-slider"></span>
                  </label>
                </div>
              </div>
              <div class="settings-option">
                <div class="option-label">
                  <span>Partager les analyses d'utilisation</span>
                </div>
                <div class="option-control">
                  <label class="toggle-switch">
                    <input type="checkbox" v-model="analytics">
                    <span class="toggle-slider"></span>
                  </label>
                </div>
              </div>
              <div class="settings-option">
                <div class="option-label">
                  <span>Publicité ciblée</span>
                </div>
                <div class="option-control">
                  <label class="toggle-switch">
                    <input type="checkbox" v-model="advertising">
                    <span class="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Sécurité -->
          <div v-if="selectedCategory === 'security'" class="settings-panel">
            <div class="settings-group">
              <h2>Sécurité</h2>
              <div class="settings-option">
                <div class="option-label">
                  <span>Pare-feu</span>
                </div>
                <div class="option-control">
                  <label class="toggle-switch">
                    <input type="checkbox" v-model="firewall" checked>
                    <span class="toggle-slider"></span>
                  </label>
                </div>
              </div>
              <div class="settings-option">
                <div class="option-label">
                  <span>FileVault</span>
                </div>
                <div class="option-control">
                  <label class="toggle-switch">
                    <input type="checkbox" v-model="fileVault">
                    <span class="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Comptes -->
          <div v-if="selectedCategory === 'users'" class="settings-panel">
            <div class="settings-group">
              <h2>iCloud</h2>
              <div class="user-card">
                <div class="user-avatar">
                  <img :src="getAssetPath('files/image-2ce6dbd2-3849-4bee-b436-50efd717a9e0.png')" alt="Lamine Ishola">
                </div>
                <div class="user-info">
                  <div class="user-name">Lamine Ishola</div>
                  <div class="user-role">isholalamine41@gmail.com</div>
                  <div class="user-details">
                    <div class="user-detail-item">
                      <span class="detail-label">iCloud:</span>
                      <span class="detail-value">Connecté</span>
                    </div>
                    <div class="user-detail-item">
                      <span class="detail-label">Stockage:</span>
                      <span class="detail-value">5 Go utilisés sur 5 Go</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- À propos -->
          <div v-if="selectedCategory === 'about'" class="settings-panel">
            <div class="settings-group">
              <h2>À propos de ce Mac</h2>
              <div class="about-section">
                <div class="about-item">
                  <span class="about-label">Nom:</span>
                  <span class="about-value">Mac de Lamine</span>
                </div>
                <div class="about-item">
                  <span class="about-label">Système:</span>
                  <span class="about-value">macOS Ventura 13.0</span>
                </div>
                <div class="about-item">
                  <span class="about-label">Processeur:</span>
                  <span class="about-value">Apple M1</span>
                </div>
                <div class="about-item">
                  <span class="about-label">Mémoire:</span>
                  <span class="about-value">16 Go</span>
                </div>
                <div class="about-item">
                  <span class="about-label">Stockage:</span>
                  <span class="about-value">512 Go SSD</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppWindow>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  forceFocus?: number
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const { getAssetPath } = useAssetPath()
const { dockSize, dockAutoHide, dockMagnification } = useDockSettings()

const selectedCategory = ref('general')
const selectedAccent = ref('#007AFF')
const notificationsEnabled = ref(true)
const notificationStyle = ref('banners')
const locationServices = ref(true)
const analytics = ref(false)
const advertising = ref(false)
const firewall = ref(true)
const fileVault = ref(false)

const categories = [
  { id: 'general', name: 'Général', icon: 'bi bi-gear' },
  { id: 'desktop', name: 'Bureau et Dock', icon: 'bi bi-grid' },
  { id: 'notifications', name: 'Notifications', icon: 'bi bi-bell' },
  { id: 'privacy', name: 'Confidentialité', icon: 'bi bi-shield-lock' },
  { id: 'security', name: 'Sécurité', icon: 'bi bi-lock' },
  { id: 'users', name: 'Comptes', icon: 'bi bi-person' },
  { id: 'about', name: 'À propos', icon: 'bi bi-info-circle' }
]

const currentCategory = computed(() => {
  return categories.find(cat => cat.id === selectedCategory.value)
})

const accentColors = [
  '#007AFF', '#5856D6', '#AF52DE', '#FF2D55', '#FF3B30', 
  '#FF9500', '#FFCC00', '#34C759', '#5AC8FA', '#32D74B'
]
</script>

<style scoped>
.settings-content {
  display: flex;
  height: 100%;
  background: #1e1e1e;
}

/* Sidebar */
.settings-sidebar {
  width: 240px;
  background: #252525;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  padding: 20px 0;
  overflow-y: auto;
}

.sidebar-section {
  padding: 0 12px;
}

.sidebar-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  cursor: pointer;
  transition: background 0.15s;
  margin-bottom: 2px;
}

.sidebar-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.sidebar-item.active {
  background: rgba(0, 122, 255, 0.2);
  color: #007AFF;
  font-weight: 500;
}

.sidebar-item i {
  font-size: 17px;
  width: 24px;
  text-align: center;
}

/* Main Content */
.settings-main {
  flex: 1;
  overflow-y: auto;
  background: #1e1e1e;
}

.settings-header {
  padding: 30px 40px 20px;
  background: #252525;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.settings-header h1 {
  font-size: 28px;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
  letter-spacing: -0.3px;
}

.settings-body {
  padding: 30px 40px;
}

.settings-panel {
  max-width: 800px;
}

.settings-group {
  background: #252525;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.settings-group h2 {
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.3px;
  margin: 0 0 16px 0;
}

.settings-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.settings-option:last-child {
  border-bottom: none;
}

.option-label {
  flex: 1;
}

.option-label span {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 400;
}

.option-control {
  flex: 0 0 auto;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  min-width: 200px;
}

/* Radio Group */
.radio-group {
  display: flex;
  gap: 24px;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
}

.radio-option input[type="radio"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #007AFF;
}

/* Color Picker */
.color-picker {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.color-option {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.color-option:hover {
  transform: scale(1.1);
}

.color-option.active {
  border-color: rgba(0, 0, 0, 0.3);
  box-shadow: 0 0 0 2px #007AFF, 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* Toggle Switch */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 30px;
  cursor: pointer;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #d1d1d6;
  transition: 0.3s;
  border-radius: 30px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 22px;
  width: 22px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.toggle-switch input:checked + .toggle-slider {
  background-color: #34C759;
}

.toggle-switch input:checked + .toggle-slider:before {
  transform: translateX(20px);
}

/* Slider */
.slider-container {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.slider {
  flex: 1;
  height: 4px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.2);
  outline: none;
  accent-color: #007AFF;
  cursor: pointer;
}

.slider-value {
  color: rgba(255, 255, 255, 0.7);
  font-size: 13px;
  min-width: 45px;
  text-align: right;
}

/* Select */
.select-input {
  padding: 6px 10px;
  background: #1e1e1e;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  cursor: pointer;
  min-width: 150px;
  outline: none;
}

.select-input:focus {
  border-color: #007AFF;
}

/* User Card */
.user-card {
  background: #1e1e1e;
  border-radius: 10px;
  padding: 20px;
  display: flex;
  gap: 16px;
  align-items: flex-start;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.user-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-info {
  flex: 1;
}

.user-name {
  font-size: 17px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 4px;
}

.user-role {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 12px;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.user-detail-item {
  display: flex;
  gap: 8px;
  font-size: 13px;
}

.detail-label {
  color: rgba(255, 255, 255, 0.6);
}

.detail-value {
  color: rgba(255, 255, 255, 0.9);
}

/* About Section */
.about-section {
  background: #1e1e1e;
  border-radius: 10px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.about-item {
  display: flex;
  padding: 10px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.about-item:last-child {
  border-bottom: none;
}

.about-label {
  min-width: 120px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 13px;
}

.about-value {
  color: rgba(255, 255, 255, 0.9);
  font-size: 13px;
}
</style>
