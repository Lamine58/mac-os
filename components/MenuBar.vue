<template>
  <div class="menu-bar">
    <!-- Apple Menu -->
    <div class="menu-item-wrapper">
      <span class="menu-item bold apple-logo" style="font-size:23px" @click="toggleAppleMenu"></span>
      <div v-if="showAppleMenu" class="dropdown-menu apple-menu" @click.stop>
        <div class="menu-item-dropdown" @click="logout">
          <span>Quitter macOS...</span>
        </div>
      </div>
    </div>

    <!-- Finder Menu -->
    <div class="menu-item-wrapper">
      <span class="menu-item bold menu-left-item" @click="toggleFinderMenu">Finder</span>
      <div v-if="showFinderMenu" class="dropdown-menu" @click.stop>
        <div class="menu-item-dropdown">
          <span>À propos de Finder</span>
        </div>
        <div class="menu-separator"></div>
        <div class="menu-item-dropdown">
          <span>Préférences...</span>
          <span class="menu-shortcut">⌘,</span>
        </div>
        <div class="menu-separator"></div>
        <div class="menu-item-dropdown">
          <span>Vider la corbeille...</span>
        </div>
        <div class="menu-separator"></div>
        <div class="menu-item-dropdown" @click="logout">
          <span>Quitter Finder</span>
          <span class="menu-shortcut">⌘Q</span>
        </div>
      </div>
    </div>

    <!-- Fichier Menu -->
    <div class="menu-item-wrapper">
      <span class="menu-item menu-left-item" @click="toggleFileMenu">Fichier</span>
      <div v-if="showFileMenu" class="dropdown-menu" @click.stop>
        <div class="menu-item-dropdown">
          <span>Nouvelle fenêtre Finder</span>
          <span class="menu-shortcut">⌘N</span>
        </div>
        <div class="menu-item-dropdown">
          <span>Nouvel onglet</span>
          <span class="menu-shortcut">⌘T</span>
        </div>
        <div class="menu-separator"></div>
        <div class="menu-item-dropdown">
          <span>Nouveau dossier</span>
          <span class="menu-shortcut">⇧⌘N</span>
        </div>
        <div class="menu-separator"></div>
        <div class="menu-item-dropdown">
          <span>Ouvrir</span>
          <span class="menu-shortcut">⌘O</span>
        </div>
        <div class="menu-item-dropdown">
          <span>Fermer la fenêtre</span>
          <span class="menu-shortcut">⌘W</span>
        </div>
      </div>
    </div>

    <!-- Édition Menu -->
    <div class="menu-item-wrapper">
      <span class="menu-item menu-left-item" @click="toggleEditMenu">Édition</span>
      <div v-if="showEditMenu" class="dropdown-menu" @click.stop>
        <div class="menu-item-dropdown">
          <span>Annuler</span>
          <span class="menu-shortcut">⌘Z</span>
        </div>
        <div class="menu-item-dropdown">
          <span>Refaire</span>
          <span class="menu-shortcut">⇧⌘Z</span>
        </div>
        <div class="menu-separator"></div>
        <div class="menu-item-dropdown">
          <span>Couper</span>
          <span class="menu-shortcut">⌘X</span>
        </div>
        <div class="menu-item-dropdown">
          <span>Copier</span>
          <span class="menu-shortcut">⌘C</span>
        </div>
        <div class="menu-item-dropdown">
          <span>Coller</span>
          <span class="menu-shortcut">⌘V</span>
        </div>
        <div class="menu-item-dropdown">
          <span>Coller et adapter le style</span>
          <span class="menu-shortcut">⇧⌘V</span>
        </div>
        <div class="menu-separator"></div>
        <div class="menu-item-dropdown">
          <span>Tout sélectionner</span>
          <span class="menu-shortcut">⌘A</span>
        </div>
      </div>
    </div>

    <!-- Présentation Menu -->
    <div class="menu-item-wrapper">
      <span class="menu-item menu-left-item" @click="toggleViewMenu">Présentation</span>
      <div v-if="showViewMenu" class="dropdown-menu" @click.stop>
        <div class="menu-item-dropdown">
          <span>Comme icônes</span>
          <span class="menu-shortcut">⌘1</span>
        </div>
        <div class="menu-item-dropdown">
          <span>Comme liste</span>
          <span class="menu-shortcut">⌘2</span>
        </div>
        <div class="menu-item-dropdown">
          <span>Comme colonnes</span>
          <span class="menu-shortcut">⌘3</span>
        </div>
        <div class="menu-item-dropdown">
          <span>Comme galerie</span>
          <span class="menu-shortcut">⌘4</span>
        </div>
        <div class="menu-separator"></div>
        <div class="menu-item-dropdown">
          <span>Afficher la barre latérale</span>
          <span class="menu-shortcut">⌥⌘S</span>
        </div>
        <div class="menu-item-dropdown">
          <span>Afficher la barre d'outils</span>
          <span class="menu-shortcut">⌥⌘T</span>
        </div>
      </div>
    </div>

    <!-- Aller Menu -->
    <div class="menu-item-wrapper">
      <span class="menu-item menu-left-item" @click="toggleGoMenu">Aller</span>
      <div v-if="showGoMenu" class="dropdown-menu" @click.stop>
        <div class="menu-item-dropdown">
          <span>Bureau</span>
          <span class="menu-shortcut">⇧⌘D</span>
        </div>
        <div class="menu-item-dropdown">
          <span>Documents</span>
          <span class="menu-shortcut">⇧⌘O</span>
        </div>
        <div class="menu-item-dropdown">
          <span>Téléchargements</span>
          <span class="menu-shortcut">⇧⌘L</span>
        </div>
        <div class="menu-separator"></div>
        <div class="menu-item-dropdown">
          <span>Aller au dossier...</span>
          <span class="menu-shortcut">⇧⌘G</span>
        </div>
        <div class="menu-item-dropdown">
          <span>Se connecter au serveur...</span>
          <span class="menu-shortcut">⌘K</span>
        </div>
      </div>
    </div>

    <!-- Fenêtre Menu -->
    <div class="menu-item-wrapper">
      <span class="menu-item menu-left-item" @click="toggleWindowMenu">Fenêtre</span>
      <div v-if="showWindowMenu" class="dropdown-menu" @click.stop>
        <div class="menu-item-dropdown">
          <span>Réduire</span>
          <span class="menu-shortcut">⌘M</span>
        </div>
        <div class="menu-item-dropdown">
          <span>Zoom</span>
        </div>
        <div class="menu-separator"></div>
        <div class="menu-item-dropdown">
          <span>Placer toutes les fenêtres à gauche</span>
        </div>
        <div class="menu-item-dropdown">
          <span>Placer toutes les fenêtres à droite</span>
        </div>
        <div class="menu-separator"></div>
        <div class="menu-item-dropdown">
          <span>Fermer toutes les fenêtres</span>
          <span class="menu-shortcut">⌥⌘W</span>
        </div>
      </div>
    </div>

    <!-- Aide Menu -->
    <div class="menu-item-wrapper">
      <span class="menu-item menu-left-item" @click="toggleHelpMenu">Aide</span>
      <div v-if="showHelpMenu" class="dropdown-menu" @click.stop>
        <div class="menu-item-dropdown">
          <span>Aide Finder</span>
        </div>
      </div>
    </div>

    <!-- Right side menu items -->
    <div class="menu-right">
      <div class="menu-item-wrapper">
        <span class="menu-item" @click="openMusic">
          <i class="bi bi-play-circle left-icon float"></i>
        </span>
      </div>
      <div class="menu-item-wrapper">
        <span class="menu-item" @click="toggleBatteryMenu">
          <i style="font-size:23px" class="bi bi-battery-half left-icon"></i>
        </span>
        <div v-if="showBatteryMenu" class="dropdown-menu battery-menu" @click.stop>
          <div class="menu-item-dropdown">
            <span>État de la batterie</span>
          </div>
          <div class="menu-separator"></div>
          <div class="menu-item-dropdown">
            <span>Niveau de charge: 95%</span>
          </div>
        </div>
      </div>
      <div class="menu-item-wrapper">
        <span class="menu-item" @click="toggleWifiMenu">
          <i class="bi bi-wifi left-icon float" style="font-size: 20px;"></i>
        </span>
        <div v-if="showWifiMenu" class="dropdown-menu wifi-menu" @click.stop>
          <div class="menu-item-dropdown">
            <span>Wi‑Fi: Activé</span>
          </div>
          <div class="menu-separator"></div>
          <div class="menu-item-dropdown">
            <span>Réseau: MonRéseau</span>
          </div>
          <div class="menu-item-dropdown">
            <span>Ouvrir les préférences réseau...</span>
          </div>
        </div>
      </div>
      <div class="menu-item-wrapper">
        <span class="menu-item" @click="toggleSearchMenu">
          <i class="bi bi-search left-icon float"></i>
        </span>
        <div v-if="showSearchMenu" class="dropdown-menu search-menu" @click.stop>
          <div class="menu-item-dropdown">
            <span>Recherche Spotlight</span>
          </div>
          <div class="menu-separator"></div>
          <div class="menu-item-dropdown">
            <span>Ouvrir Spotlight...</span>
            <span class="menu-shortcut">⌘Space</span>
          </div>
          <div class="menu-item-dropdown">
            <span>Préférences Spotlight...</span>
          </div>
        </div>
      </div>
      <div class="menu-item-wrapper">
        <span class="menu-item" @click="toggleControlCenterMenu">
          <i class="bi bi-toggles left-icon float"></i>
        </span>
        <div v-if="showControlCenterMenu" class="dropdown-menu control-center-menu" @click.stop>
          <div class="menu-item-dropdown">
            <span>Ouvrir le Centre de contrôle</span>
          </div>
          <div class="menu-separator"></div>
          <div class="menu-item-dropdown">
            <span>Préférences Dock et menu...</span>
          </div>
        </div>
      </div>
      <span class="menu-item" id="dynamic-time" style="position: relative;top: -3px;">{{ currentTime }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  'open-app': [appName: string]
}>()

const currentTime = ref('')

const showAppleMenu = ref(false)
const showFinderMenu = ref(false)
const showFileMenu = ref(false)
const showEditMenu = ref(false)
const showViewMenu = ref(false)
const showGoMenu = ref(false)
const showWindowMenu = ref(false)
const showHelpMenu = ref(false)
const showBatteryMenu = ref(false)
const showWifiMenu = ref(false)
const showSearchMenu = ref(false)
const showControlCenterMenu = ref(false)

const logout = () => {
  navigateTo('/locked')
  closeAllMenus()
}

const openMusic = () => {
  emit('open-app', 'music')
  closeAllMenus()
}

const toggleAppleMenu = () => {
  closeAllMenus()
  showAppleMenu.value = !showAppleMenu.value
}

const toggleFinderMenu = () => {
  closeAllMenus()
  showFinderMenu.value = !showFinderMenu.value
}

const toggleFileMenu = () => {
  closeAllMenus()
  showFileMenu.value = !showFileMenu.value
}

const toggleEditMenu = () => {
  closeAllMenus()
  showEditMenu.value = !showEditMenu.value
}

const toggleViewMenu = () => {
  closeAllMenus()
  showViewMenu.value = !showViewMenu.value
}

const toggleGoMenu = () => {
  closeAllMenus()
  showGoMenu.value = !showGoMenu.value
}

const toggleWindowMenu = () => {
  closeAllMenus()
  showWindowMenu.value = !showWindowMenu.value
}

const toggleHelpMenu = () => {
  closeAllMenus()
  showHelpMenu.value = !showHelpMenu.value
}

const toggleBatteryMenu = () => {
  closeAllMenus()
  showBatteryMenu.value = !showBatteryMenu.value
}

const toggleWifiMenu = () => {
  closeAllMenus()
  showWifiMenu.value = !showWifiMenu.value
}

const toggleSearchMenu = () => {
  closeAllMenus()
  showSearchMenu.value = !showSearchMenu.value
}

const toggleControlCenterMenu = () => {
  closeAllMenus()
  showControlCenterMenu.value = !showControlCenterMenu.value
}

const closeAllMenus = () => {
  showAppleMenu.value = false
  showFinderMenu.value = false
  showFileMenu.value = false
  showEditMenu.value = false
  showViewMenu.value = false
  showGoMenu.value = false
  showWindowMenu.value = false
  showHelpMenu.value = false
  showBatteryMenu.value = false
  showWifiMenu.value = false
  showSearchMenu.value = false
  showControlCenterMenu.value = false
}

const updateTime = () => {
  const now = new Date()
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: false
  }
  const formattedDate = now.toLocaleString('fr-FR', options)
  currentTime.value = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)
}

// Mettre à jour immédiatement
updateTime()

onMounted(() => {
  // Mettre à jour toutes les minutes (60000ms)
  const intervalId = setInterval(updateTime, 60000)
  
  // Fermer les menus quand on clique ailleurs
  document.addEventListener('click', (e) => {
    if (!(e.target as HTMLElement).closest('.menu-item-wrapper') && 
        !(e.target as HTMLElement).closest('.dropdown-menu')) {
      closeAllMenus()
    }
  })
  
  // Nettoyer l'intervalle lors du démontage
  onUnmounted(() => {
    clearInterval(intervalId)
  })
})
</script>

<style scoped>
.menu-item-wrapper {
  position: relative;
  display: inline-block;
}

/* Dropdown Menu - Dark Mode */
.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background: rgba(30, 30, 30, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1);
  padding: 4px 0;
  min-width: 200px;
  margin-top: 4px;
  z-index: 10000;
  animation: fadeIn 0.15s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.apple-menu {
  left: 0;
  min-width: 180px;
}

.battery-menu,
.wifi-menu,
.search-menu,
.control-center-menu {
  right: 0;
  min-width: 220px;
}

.menu-item-dropdown {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 20px 6px 12px;
  cursor: pointer;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.9);
  transition: background 0.1s;
  white-space: nowrap;
}

.menu-item-dropdown:hover {
  background: rgba(255, 255, 255, 0.1);
}

.menu-item-dropdown:active {
  background: rgba(255, 255, 255, 0.15);
}

.menu-shortcut {
  color: rgba(255, 255, 255, 0.5);
  font-size: 11px;
  margin-left: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Mono', Monaco, monospace;
}

.menu-separator {
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 4px 0;
}
</style>
