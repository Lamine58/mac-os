<template>
  <div 
    class="dock" 
    :class="{ 
      'dock-hidden': dockAutoHide && !isDockVisible,
      'dock-visible': dockAutoHide && isDockVisible
    }"
    :style="{
      '--dock-icon-size': `${dockIconSize}px`,
      '--dock-magnification': dockMagnification ? '1.2' : '1'
    }"
  >
    <div class="dock-separator"></div>
    <div class="dock-icon-group">
      <div 
        class="dock-icon" 
        :class="{ 'active-app': activeApps.finder }"
        @click="openApp('finder')"
        title="Finder"
      >
        <img :src="getAssetPath(`files/${dockIcons[0]}`)" :alt="dockIcons[0]">
      </div>
      <div 
        class="dock-icon" 
        :class="{ 'active-app': activeApps.safari }"
        @click="openApp('safari')"
        title="Safari"
      >
        <img :src="getAssetPath(`files/${dockIcons[1]}`)" :alt="dockIcons[1]">
      </div>
      <div 
        class="dock-icon"
        :class="{ 'active-app': activeApps.home }"
        @click="openApp('home')"
        title="Accueil"
      >
        <img :src="getAssetPath(`files/${dockIcons[2]}`)" :alt="dockIcons[2]">
      </div>
      <div 
        class="dock-icon" 
        :class="{ 'active-app': activeApps.messages }"
        @click="openApp('messages')"
        title="Messages"
      >
        <img :src="getAssetPath(`files/${dockIcons[3]}`)" :alt="dockIcons[3]">
      </div>
      <div 
        class="dock-icon" 
        :class="{ 'active-app': activeApps.mail }"
        @click="openApp('mail')"
        title="Mail"
      >
        <img :src="getAssetPath(`files/${dockIcons[4]}`)" :alt="dockIcons[4]">
      </div>
      <div 
        class="dock-icon" 
        :class="{ 'active-app': activeApps.maps }"
        @click="openApp('maps')"
        title="Plans"
      >
        <img :src="getAssetPath(`files/${dockIcons[5]}`)" :alt="dockIcons[5]">
      </div>
      <div 
        class="dock-icon" 
        :class="{ 'active-app': activeApps.photos }"
        @click="openApp('photos')"
        title="Photos"
      >
        <img :src="getAssetPath(`files/${dockIcons[6]}`)" :alt="dockIcons[6]">
      </div>
      <div 
        class="dock-icon" 
        :class="{ 'active-app': activeApps.facetime }"
        @click="openApp('facetime')"
        title="FaceTime"
      >
        <img :src="getAssetPath(`files/${dockIcons[7]}`)" :alt="dockIcons[7]">
      </div>
      <div 
        class="dock-icon" 
        :class="{ 'active-app': activeApps.contacts }"
        @click="openApp('contacts')"
        title="Contacts"
      >
        <img :src="getAssetPath(`files/${dockIcons[8]}`)" :alt="dockIcons[8]">
      </div>
      <div 
        class="dock-icon" 
        :class="{ 'active-app': activeApps.music }"
        @click="openApp('music')"
        title="Musique"
      >
        <img :src="getAssetPath(`files/${dockIcons[9]}`)" :alt="dockIcons[9]">
      </div>
      <div 
        class="dock-icon" 
        :class="{ 'active-app': activeApps.keynote }"
        @click="openApp('keynote')"
        title="Keynote"
      >
        <img :src="getAssetPath(`files/${dockIcons[10]}`)" :alt="dockIcons[10]">
      </div>
      <div 
        class="dock-icon" 
        :class="{ 'active-app': activeApps.appStore }"
        @click="openApp('appStore')"
        title="App Store"
      >
        <img :src="getAssetPath(`files/${dockIcons[11]}`)" :alt="dockIcons[11]">
      </div>
      <div 
        class="dock-icon" 
        :class="{ 'active-app': activeApps.systemPreferences }"
        @click="openApp('systemPreferences')"
        title="Préférences Système"
      >
        <img :src="getAssetPath(`files/${dockIcons[12]}`)" :alt="dockIcons[12]">
      </div>
      <div 
        class="dock-icon" 
        :class="{ 'active-app': activeApps.terminal }"
        @click="openApp('terminal')"
        title="Terminal"
      >
        <img :src="getAssetPath(`files/${dockIcons[13]}`)" :alt="dockIcons[13]">
      </div>
      <div 
        class="dock-icon" 
        :class="{ 'active-app': activeApps.xcode }"
        @click="openApp('xcode')"
        title="Xcode"
      >
        <img :src="getAssetPath(`files/${dockIcons[14]}`)" :alt="dockIcons[14]">
      </div>
      <div 
        class="dock-icon" 
        :class="{ 'active-app': activeApps.keychain }"
        @click="openApp('keychain')"
        title="Trousseau d'accès"
      >
        <img :src="getAssetPath(`files/${dockIcons[15]}`)" :alt="dockIcons[15]">
      </div>
      <div 
        class="dock-icon" 
        :class="{ 'active-app': activeApps.notes }"
        @click="openApp('notes')"
        title="Notes"
      >
        <img :src="getAssetPath(`files/${dockIcons[16]}`)" :alt="dockIcons[16]">
      </div>
      <div 
        class="dock-icon" 
        :class="{ 'active-app': activeApps.pages }"
        @click="openApp('pages')"
        title="Pages"
      >
        <img :src="getAssetPath(`files/${dockIcons[17]}`)" :alt="dockIcons[17]">
      </div>
      <div 
        class="dock-icon" 
        :class="{ 'active-app': activeApps.numbers }"
        @click="openApp('numbers')"
        title="Numbers"
      >
        <img :src="getAssetPath(`files/${dockIcons[18]}`)" :alt="dockIcons[18]">
      </div>
      <div 
        class="dock-icon" 
        :class="{ 'active-app': activeApps.calculator }"
        @click="openApp('calculator')"
        title="Calculatrice"
      >
        <img :src="getAssetPath(`files/${dockIcons[19]}`)" :alt="dockIcons[19]">
      </div>
    </div>
    <div class="dock-separator"></div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps<{
  activeApps: Record<string, boolean>
}>()

const emit = defineEmits<{
  'open-app': [appName: string]
}>()

const { getAssetPath } = useAssetPath()
const { dockSize, dockAutoHide, dockMagnification } = useDockSettings()

const isDockVisible = ref(true)
const mouseY = ref(0)
const hideTimeout = ref<NodeJS.Timeout | null>(null)

// Détecter la position de la souris
const handleMouseMove = (e: MouseEvent) => {
  mouseY.value = e.clientY
  const windowHeight = window.innerHeight
  const threshold = 80 // Zone en bas de l'écran (80px)
  
  if (dockAutoHide.value) {
    if (windowHeight - e.clientY <= threshold) {
      // La souris est proche du bas, afficher le dock immédiatement
      if (hideTimeout.value) {
        clearTimeout(hideTimeout.value)
        hideTimeout.value = null
      }
      isDockVisible.value = true
    } else {
      // La souris est loin du bas, masquer le dock après un délai plus long
      if (hideTimeout.value) {
        clearTimeout(hideTimeout.value)
      }
      hideTimeout.value = setTimeout(() => {
        isDockVisible.value = false
      }, 800) // Délai de 800ms avant de masquer
    }
  } else {
    // Si auto-hide est désactivé, toujours afficher
    isDockVisible.value = true
  }
}

// Surveiller les changements de dockAutoHide
watch(dockAutoHide, (newValue) => {
  if (newValue) {
    // Si auto-hide est activé, masquer par défaut
    isDockVisible.value = false
  } else {
    // Si auto-hide est désactivé, toujours afficher
    isDockVisible.value = true
    if (hideTimeout.value) {
      clearTimeout(hideTimeout.value)
      hideTimeout.value = null
    }
  }
}, { immediate: true })

onMounted(() => {
  if (process.client) {
    document.addEventListener('mousemove', handleMouseMove)
    // Initialiser l'état selon dockAutoHide
    if (dockAutoHide.value) {
      isDockVisible.value = false
    }
  }
})

onUnmounted(() => {
  if (process.client) {
    document.removeEventListener('mousemove', handleMouseMove)
    if (hideTimeout.value) {
      clearTimeout(hideTimeout.value)
    }
  }
})

// Calculer la taille des icônes basée sur le pourcentage (30-100% de 50px = 15px à 50px)
const dockIconSize = computed(() => {
  const minSize = 15
  const maxSize = 50
  return minSize + ((dockSize.value - 30) / 70) * (maxSize - minSize)
})

const dockIcons = [
  'Finder_Icon_macOS_Big_Sur.png',
  'icon_safari.png',
  'home-2021-05-03.webp',
  'icon_message.png',
  'mail-2021-05-25.webp',
  'maps-2023-05-19.webp',
  'photos-2021-05-28.webp',
  'facetime-2021-04-30.webp',
  'contacts-2021-04-30.webp',
  'music-2021-05-25.webp',
  'keynote-2021-11-15.webp',
  'app-store-2021-04-22.webp',
  'system-preferences-2021-06-03.webp',
  'terminal-2021-06-03.webp',
  'xcode-2025-09-18.webp',
  'keychain-access-2021-05-03.webp',
  'notes-2021-05-25.webp',
  'pages-2021-11-15.webp',
  'numbers-2021-11-15.webp',
  'calculator-2021-04-29.webp'
]

const openApp = (appName: string) => {
  emit('open-app', appName)
}
</script>

