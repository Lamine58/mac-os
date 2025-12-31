<template>
  <div class="desktop" :class="{ 'theme-dark': isDark, 'theme-light': !isDark }" :style="{ '--base-url': baseURL }">
    <div class="background-content"></div>

    <MenuBar @open-app="openApp" />

    <div class="widgets-container">
      <CalendarWidget />
    </div>

    <FinderWindow 
      v-if="apps.finder"
      :current-folder="currentFolder"
      :is-open="apps.finder"
      :force-focus="forceFocusCounters.finder"
      @close="closeApp('finder')"
      @change-folder="changeFolder"
      @open-pdf="openPDF"
      @open-text="openTextFile"
    />

    <PDFViewer 
      v-if="pdfViewer.open"
      :file="pdfViewer.file"
      :name="pdfViewer.name"
      @close="closePDFViewer"
    />

    <TextViewer 
      v-if="textViewer.open"
      :file="textViewer.file"
      :name="textViewer.name"
      @close="closeTextViewer"
    />

    <!-- Applications -->
    <AppsHome v-if="apps.home" :is-open="apps.home" :force-focus="forceFocusCounters.home" @close="closeApp('home')" />
    <AppsSafari v-if="apps.safari" :is-open="apps.safari" :force-focus="forceFocusCounters.safari" @close="closeApp('safari')" />
    <AppsMusic v-if="apps.music" :is-open="apps.music" :force-focus="forceFocusCounters.music" @close="closeApp('music')" />
    <AppsMessages v-if="apps.messages" :is-open="apps.messages" :force-focus="forceFocusCounters.messages" @close="closeApp('messages')" />
    <AppsMail v-if="apps.mail" :is-open="apps.mail" :force-focus="forceFocusCounters.mail" @close="closeApp('mail')" />
    <AppsMaps v-if="apps.maps" :is-open="apps.maps" :force-focus="forceFocusCounters.maps" @close="closeApp('maps')" />
    <AppsPhotos v-if="apps.photos" :is-open="apps.photos" :force-focus="forceFocusCounters.photos" @close="closeApp('photos')" />
    <AppsFaceTime v-if="apps.facetime" :is-open="apps.facetime" :force-focus="forceFocusCounters.facetime" @close="closeApp('facetime')" />
    <AppsContacts v-if="apps.contacts" :is-open="apps.contacts" :force-focus="forceFocusCounters.contacts" @close="closeApp('contacts')" />
    <AppsCalculator v-if="apps.calculator" :is-open="apps.calculator" :force-focus="forceFocusCounters.calculator" @close="closeApp('calculator')" />
    <AppsTerminal v-if="apps.terminal" :is-open="apps.terminal" :force-focus="forceFocusCounters.terminal" @close="closeApp('terminal')" />
    <AppsNotes v-if="apps.notes" :is-open="apps.notes" :force-focus="forceFocusCounters.notes" @close="closeApp('notes')" />
    <AppsKeynote v-if="apps.keynote" :is-open="apps.keynote" :force-focus="forceFocusCounters.keynote" @close="closeApp('keynote')" />
    <AppsAppStore v-if="apps.appStore" :is-open="apps.appStore" :force-focus="forceFocusCounters.appStore" @close="closeApp('appStore')" />
    <AppsSystemPreferences v-if="apps.systemPreferences" :is-open="apps.systemPreferences" :force-focus="forceFocusCounters.systemPreferences" @close="closeApp('systemPreferences')" />
    <AppsXcode v-if="apps.xcode" :is-open="apps.xcode" :force-focus="forceFocusCounters.xcode" @close="closeApp('xcode')" />
    <AppsKeychain v-if="apps.keychain" :is-open="apps.keychain" :force-focus="forceFocusCounters.keychain" @close="closeApp('keychain')" />
    <AppsPages v-if="apps.pages" :is-open="apps.pages" :force-focus="forceFocusCounters.pages" @close="closeApp('pages')" />
    <AppsNumbers v-if="apps.numbers" :is-open="apps.numbers" :force-focus="forceFocusCounters.numbers" @close="closeApp('numbers')" />

    <Dock :active-apps="apps" @open-app="openApp" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  pageTransition: {
    name: 'page',
    mode: 'out-in'
  }
})

const currentFolder = ref('')
const config = useRuntimeConfig()
const baseURL = config.public.baseURL || '/mac-os/'
const { isDark } = useTheme()

const apps = ref({
  finder: false,
  safari: false,
  home: false,
  messages: false,
  mail: false,
  maps: false,
  photos: false,
  facetime: false,
  contacts: false,
  music: false,
  keynote: false,
  appStore: false,
  systemPreferences: false,
  terminal: false,
  xcode: false,
  keychain: false,
  notes: false,
  pages: false,
  numbers: false,
  calculator: false
})

// Compteurs pour forcer le focus de chaque fenêtre
const forceFocusCounters = ref({
  finder: 0,
  home: 0,
  safari: 0,
  music: 0,
  messages: 0,
  mail: 0,
  maps: 0,
  photos: 0,
  facetime: 0,
  contacts: 0,
  calculator: 0,
  terminal: 0,
  notes: 0,
  keynote: 0,
  appStore: 0,
  systemPreferences: 0,
  xcode: 0,
  keychain: 0,
  pages: 0,
  numbers: 0
})

const openApp = (appName: string) => {
  console.log('Opening app:', appName)
  if (appName === 'finder') {
    currentFolder.value = ''
  }
  const appKey = appName as keyof typeof apps.value
  if (appKey in apps.value) {
    // Si la fenêtre est déjà ouverte, forcer le focus
    if (apps.value[appKey]) {
      const counterKey = appName as keyof typeof forceFocusCounters.value
      if (counterKey in forceFocusCounters.value) {
        // Forcer la réactivité en créant un nouvel objet
        const newCounters = { ...forceFocusCounters.value }
        newCounters[counterKey] = (newCounters[counterKey] || 0) + 1
        forceFocusCounters.value = newCounters
        console.log(`[home.vue] Force focus for ${appName}: counter = ${newCounters[counterKey]}`)
      }
    } else {
      // Sinon, ouvrir la fenêtre normalement
      apps.value[appKey] = true
    }
    console.log('App opened:', appName, apps.value[appKey])
  } else {
    console.error('App not found:', appName)
  }
}

const closeApp = (appName: string) => {
  apps.value[appName as keyof typeof apps.value] = false
}

const changeFolder = (folderName: string) => {
  currentFolder.value = folderName
}

const pdfViewer = ref({
  open: false,
  file: '',
  name: ''
})

const openPDF = (file: string, name: string) => {
  pdfViewer.value = {
    open: true,
    file,
    name
  }
  document.body.style.overflow = 'hidden'
}

const closePDFViewer = () => {
  pdfViewer.value.open = false
  document.body.style.overflow = ''
}

const textViewer = ref({
  open: false,
  file: '',
  name: ''
})

const openTextFile = (file: string, name: string) => {
  textViewer.value = {
    open: true,
    file,
    name
  }
  document.body.style.overflow = 'hidden'
}

const closeTextViewer = () => {
  textViewer.value.open = false
  document.body.style.overflow = ''
}
</script>

