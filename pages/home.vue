<template>
  <div class="desktop">
    <div class="background-content"></div>

    <MenuBar />

    <div class="widgets-container">
      <CalendarWidget />
    </div>

    <FinderWindow 
      v-if="apps.finder"
      :current-folder="currentFolder"
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
    <AppsHome v-if="apps.home" :is-open="apps.home" @close="closeApp('home')" />
    <AppsSafari v-if="apps.safari" :is-open="apps.safari" @close="closeApp('safari')" />
    <AppsMusic v-if="apps.music" :is-open="apps.music" @close="closeApp('music')" />
    <AppsMessages v-if="apps.messages" :is-open="apps.messages" @close="closeApp('messages')" />
    <AppsMail v-if="apps.mail" :is-open="apps.mail" @close="closeApp('mail')" />
    <AppsMaps v-if="apps.maps" :is-open="apps.maps" @close="closeApp('maps')" />
    <AppsPhotos v-if="apps.photos" :is-open="apps.photos" @close="closeApp('photos')" />
    <AppsFaceTime v-if="apps.facetime" :is-open="apps.facetime" @close="closeApp('facetime')" />
    <AppsContacts v-if="apps.contacts" :is-open="apps.contacts" @close="closeApp('contacts')" />
    <AppsCalculator v-if="apps.calculator" :is-open="apps.calculator" @close="closeApp('calculator')" />
    <AppsTerminal v-if="apps.terminal" :is-open="apps.terminal" @close="closeApp('terminal')" />
    <AppsNotes v-if="apps.notes" :is-open="apps.notes" @close="closeApp('notes')" />
    <AppsKeynote v-if="apps.keynote" :is-open="apps.keynote" @close="closeApp('keynote')" />
    <AppsAppStore v-if="apps.appStore" :is-open="apps.appStore" @close="closeApp('appStore')" />
    <AppsSystemPreferences v-if="apps.systemPreferences" :is-open="apps.systemPreferences" @close="closeApp('systemPreferences')" />
    <AppsXcode v-if="apps.xcode" :is-open="apps.xcode" @close="closeApp('xcode')" />
    <AppsKeychain v-if="apps.keychain" :is-open="apps.keychain" @close="closeApp('keychain')" />
    <AppsPages v-if="apps.pages" :is-open="apps.pages" @close="closeApp('pages')" />
    <AppsNumbers v-if="apps.numbers" :is-open="apps.numbers" @close="closeApp('numbers')" />

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

const openApp = (appName: string) => {
  console.log('Opening app:', appName)
  if (appName === 'finder') {
    currentFolder.value = ''
  }
  const appKey = appName as keyof typeof apps.value
  if (appKey in apps.value) {
    apps.value[appKey] = true
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

