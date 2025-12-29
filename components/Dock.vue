<template>
  <div class="dock">
    <div class="dock-separator"></div>
    <div class="dock-icon-group">
      <div 
        class="dock-icon" 
        :class="{ 'active-app': activeApps.finder }"
        @click="openApp('finder')"
        title="Finder"
      >
        <img :src="`/files/${dockIcons[0]}`" :alt="dockIcons[0]">
      </div>
      <div 
        class="dock-icon" 
        :class="{ 'active-app': activeApps.safari }"
        @click="openApp('safari')"
        title="Safari"
      >
        <img :src="`/files/${dockIcons[1]}`" :alt="dockIcons[1]">
      </div>
      <div 
        class="dock-icon"
        :class="{ 'active-app': activeApps.home }"
        @click="openApp('home')"
        title="Accueil"
      >
        <img :src="`/files/${dockIcons[2]}`" :alt="dockIcons[2]">
      </div>
      <div 
        class="dock-icon" 
        :class="{ 'active-app': activeApps.messages }"
        @click="openApp('messages')"
        title="Messages"
      >
        <img :src="`/files/${dockIcons[3]}`" :alt="dockIcons[3]">
      </div>
      <div 
        class="dock-icon" 
        :class="{ 'active-app': activeApps.mail }"
        @click="openApp('mail')"
        title="Mail"
      >
        <img :src="`/files/${dockIcons[4]}`" :alt="dockIcons[4]">
      </div>
      <div 
        class="dock-icon" 
        :class="{ 'active-app': activeApps.maps }"
        @click="openApp('maps')"
        title="Plans"
      >
        <img :src="`/files/${dockIcons[5]}`" :alt="dockIcons[5]">
      </div>
      <div 
        class="dock-icon" 
        :class="{ 'active-app': activeApps.photos }"
        @click="openApp('photos')"
        title="Photos"
      >
        <img :src="`/files/${dockIcons[6]}`" :alt="dockIcons[6]">
      </div>
      <div 
        class="dock-icon" 
        :class="{ 'active-app': activeApps.facetime }"
        @click="openApp('facetime')"
        title="FaceTime"
      >
        <img :src="`/files/${dockIcons[7]}`" :alt="dockIcons[7]">
      </div>
      <div 
        class="dock-icon" 
        :class="{ 'active-app': activeApps.contacts }"
        @click="openApp('contacts')"
        title="Contacts"
      >
        <img :src="`/files/${dockIcons[8]}`" :alt="dockIcons[8]">
      </div>
      <div 
        class="dock-icon" 
        :class="{ 'active-app': activeApps.music }"
        @click="openApp('music')"
        title="Musique"
      >
        <img :src="`/files/${dockIcons[9]}`" :alt="dockIcons[9]">
      </div>
      <div 
        class="dock-icon" 
        :class="{ 'active-app': activeApps.keynote }"
        @click="openApp('keynote')"
        title="Keynote"
      >
        <img :src="`/files/${dockIcons[10]}`" :alt="dockIcons[10]">
      </div>
      <div 
        class="dock-icon" 
        :class="{ 'active-app': activeApps.appStore }"
        @click="openApp('appStore')"
        title="App Store"
      >
        <img :src="`/files/${dockIcons[11]}`" :alt="dockIcons[11]">
      </div>
      <div 
        class="dock-icon" 
        :class="{ 'active-app': activeApps.systemPreferences }"
        @click="openApp('systemPreferences')"
        title="Préférences Système"
      >
        <img :src="`/files/${dockIcons[12]}`" :alt="dockIcons[12]">
      </div>
      <div 
        class="dock-icon" 
        :class="{ 'active-app': activeApps.terminal }"
        @click="openApp('terminal')"
        title="Terminal"
      >
        <img :src="`/files/${dockIcons[13]}`" :alt="dockIcons[13]">
      </div>
      <div 
        class="dock-icon" 
        :class="{ 'active-app': activeApps.xcode }"
        @click="openApp('xcode')"
        title="Xcode"
      >
        <img :src="`/files/${dockIcons[14]}`" :alt="dockIcons[14]">
      </div>
      <div 
        class="dock-icon" 
        :class="{ 'active-app': activeApps.keychain }"
        @click="openApp('keychain')"
        title="Trousseau d'accès"
      >
        <img :src="`/files/${dockIcons[15]}`" :alt="dockIcons[15]">
      </div>
      <div 
        class="dock-icon" 
        :class="{ 'active-app': activeApps.notes }"
        @click="openApp('notes')"
        title="Notes"
      >
        <img :src="`/files/${dockIcons[16]}`" :alt="dockIcons[16]">
      </div>
      <div 
        class="dock-icon" 
        :class="{ 'active-app': activeApps.pages }"
        @click="openApp('pages')"
        title="Pages"
      >
        <img :src="`/files/${dockIcons[17]}`" :alt="dockIcons[17]">
      </div>
      <div 
        class="dock-icon" 
        :class="{ 'active-app': activeApps.numbers }"
        @click="openApp('numbers')"
        title="Numbers"
      >
        <img :src="`/files/${dockIcons[18]}`" :alt="dockIcons[18]">
      </div>
      <div 
        class="dock-icon" 
        :class="{ 'active-app': activeApps.calculator }"
        @click="openApp('calculator')"
        title="Calculatrice"
      >
        <img :src="`/files/${dockIcons[19]}`" :alt="dockIcons[19]">
      </div>
    </div>
    <div class="dock-separator"></div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  activeApps: Record<string, boolean>
}>()

const emit = defineEmits<{
  'open-app': [appName: string]
}>()

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

