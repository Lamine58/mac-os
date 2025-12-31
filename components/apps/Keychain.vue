<template>
  <AppWindow 
    :title="'Trousseau d\'accès'"
    :is-open="isOpen"
    :force-focus="forceFocus"
    :initial-width="900"
    :initial-height="600"
    @close="$emit('close')"
  >
    <div class="keychain-content">
      <!-- Sidebar -->
      <div class="keychain-sidebar">
        <div class="sidebar-section">
          <div class="sidebar-item active">
            <i class="bi bi-key"></i>
            <span>Mots de passe</span>
          </div>
          <div class="sidebar-item">
            <i class="bi bi-shield-lock"></i>
            <span>Certificats</span>
          </div>
          <div class="sidebar-item">
            <i class="bi bi-key-fill"></i>
            <span>Clés</span>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="keychain-main">
        <div class="keychain-header">
          <div class="search-container">
            <i class="bi bi-search"></i>
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="Rechercher"
              class="search-input"
            >
          </div>
        </div>

        <div class="keychain-body">
          <div class="password-list">
            <div 
              v-for="item in filteredPasswords" 
              :key="item.id"
              class="password-item"
              @click="selectedPassword = item"
            >
              <div class="password-icon">
                <i :class="item.icon"></i>
              </div>
              <div class="password-info">
                <div class="password-name">{{ item.name }}</div>
                <div class="password-account">{{ item.account }}</div>
              </div>
            </div>
          </div>

          <!-- Password Detail View -->
          <div v-if="selectedPassword" class="password-detail">
            <div class="detail-header">
              <button class="back-btn" @click="selectedPassword = null">
                <i class="bi bi-arrow-left"></i>
              </button>
              <h2>{{ selectedPassword.name }}</h2>
            </div>
            <div class="detail-body">
              <div class="detail-field">
                <label>Nom du site web</label>
                <div class="field-value">{{ selectedPassword.name }}</div>
              </div>
              <div class="detail-field">
                <label>Nom d'utilisateur</label>
                <div class="field-value">{{ selectedPassword.account }}</div>
              </div>
              <div class="detail-field">
                <label>Mot de passe</label>
                <div class="password-field">
                  <input 
                    :type="showPassword ? 'text' : 'password'" 
                    :value="selectedPassword.password"
                    readonly
                    class="password-input"
                  >
                  <button class="toggle-password" @click="showPassword = !showPassword">
                    <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                  </button>
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

const searchQuery = ref('')
const selectedPassword = ref<any>(null)
const showPassword = ref(false)

const passwords = [
  {
    id: 1,
    name: 'Lamine Ishola',
    account: 'isholalamine41@gmail.com',
    password: 'azerty',
    icon: 'bi bi-person-circle'
  }
]

const filteredPasswords = computed(() => {
  if (!searchQuery.value) return passwords
  const query = searchQuery.value.toLowerCase()
  return passwords.filter(p => 
    p.name.toLowerCase().includes(query) || 
    p.account.toLowerCase().includes(query)
  )
})

// Sélectionner automatiquement le premier mot de passe si disponible
watch(() => props.isOpen, (isOpen) => {
  if (isOpen && passwords.length > 0 && !selectedPassword.value) {
    selectedPassword.value = passwords[0]
  }
}, { immediate: true })
</script>

<style scoped>
.keychain-content {
  display: flex;
  height: 100%;
  background: #1e1e1e;
}

/* Sidebar */
.keychain-sidebar {
  width: 200px;
  background: #252525;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  padding: 20px 0;
}

.sidebar-section {
  padding: 0 12px;
}

.sidebar-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
  margin-bottom: 4px;
}

.sidebar-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.sidebar-item.active {
  background: rgba(0, 122, 255, 0.2);
  color: #007AFF;
}

.sidebar-item i {
  font-size: 16px;
  width: 20px;
  text-align: center;
}

/* Main Content */
.keychain-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.keychain-header {
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.search-container {
  position: relative;
  max-width: 400px;
}

.search-container i {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.5);
  font-size: 16px;
}

.search-input {
  width: 100%;
  padding: 10px 12px 10px 40px;
  background: #252525;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  font-size: 14px;
  outline: none;
}

.search-input:focus {
  border-color: #007AFF;
}

.keychain-body {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.password-list {
  width: 300px;
  overflow-y: auto;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  background: #1e1e1e;
}

.password-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  cursor: pointer;
  transition: background 0.2s;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.password-item:hover {
  background: #252525;
}

.password-item:active {
  background: #2d2d2d;
}

.password-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #252525;
  border-radius: 8px;
  flex-shrink: 0;
}

.password-icon i {
  font-size: 20px;
  color: rgba(255, 255, 255, 0.7);
}

.password-info {
  flex: 1;
  min-width: 0;
}

.password-name {
  font-size: 15px;
  font-weight: 500;
  color: white;
  margin-bottom: 4px;
}

.password-account {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
}

/* Password Detail */
.password-detail {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #1e1e1e;
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.back-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  color: white;
}

.detail-header h2 {
  font-size: 24px;
  font-weight: 600;
  color: white;
  margin: 0;
}

.detail-body {
  padding: 30px;
  max-width: 600px;
}

.detail-field {
  margin-bottom: 30px;
}

.detail-field label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.field-value {
  font-size: 16px;
  color: white;
  padding: 12px;
  background: #252525;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.password-field {
  display: flex;
  gap: 8px;
}

.password-input {
  flex: 1;
  padding: 12px;
  background: #252525;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: white;
  font-size: 16px;
  font-family: 'Monaco', 'Menlo', monospace;
  outline: none;
}

.password-input:focus {
  border-color: #007AFF;
}

.toggle-password {
  width: 44px;
  height: 44px;
  border: none;
  background: #252525;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.toggle-password:hover {
  background: #2d2d2d;
  color: white;
}
</style>
