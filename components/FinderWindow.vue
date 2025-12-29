<template>
  <div 
    class="finder-window open"
    :class="{ maximized: isMaximized }"
    :style="{ 
      left: position.x + 'px', 
      top: position.y + 'px', 
      width: windowWidth + 'px',
      height: windowHeight + 'px',
      zIndex: zIndex 
    }"
    @mousedown="focusWindow"
  >
    <div class="window-header" @mousedown.stop="handleHeaderMouseDown">
      <div class="traffic-lights">
        <span class="close-btn" style="background-color: #ff5f56;" title="Fermer" @click.stop="$emit('close')"></span>
        <span class="minimize-btn" style="background-color: #ffbd2e;" title="Réduire" @click.stop="minimize"></span>
        <span class="maximize-btn" style="background-color: #27c93f;" title="Agrandir" @click.stop="maximize"></span>
      </div>
      <span class="hamburger-menu" @click.stop="toggleSidebar" v-if="isMobile">☰</span>
      <span class="window-title">{{ windowTitle }}</span>
    </div>
    
    <div class="window-toolbar">
      <span 
        class="toolbar-item" 
        :class="{ disabled: !props.currentFolder }"
        @click="goBack"
        title="Retour"
      >
        <i class="bi bi-chevron-left"></i>
      </span>
      <span class="toolbar-item" title="Avancer"><i class="bi bi-chevron-right"></i></span>
      <div class="toolbar-right">
        <input 
          type="text" 
          placeholder="Rechercher" 
          class="search-input"
          v-model="searchQuery"
        >
      </div>
    </div>
    
    <div class="window-content">
      <div class="sidebar" :class="{ 'sidebar-open': sidebarOpen }">
        <div class="sidebar-section">
          <div class="sidebar-header">Favoris</div>
          <div 
            v-for="folder in folders" 
            :key="folder"
            class="sidebar-item"
            :class="{ active: folder === props.currentFolder }"
            @click="changeFolder(folder)"
          >
            <i class="bi bi-folder-fill" style="color: #66b2ff;"></i>
            <span>{{ folder }}</span>
          </div>
        </div>
      </div>
      <div v-if="sidebarOpen && isMobile" class="sidebar-overlay" @click="toggleSidebar"></div>
      
      <div class="main-content">
        <!-- Vue liste des répertoires -->
        <div v-if="!props.currentFolder" class="folders-view">
          <div 
            v-for="folder in filteredFolders" 
            :key="folder"
            class="folder-item"
            @click="selectFolder(folder)"
          >
            <div class="folder-icon-large">
              <i class="bi bi-folder-fill" style="color: #66b2ff; font-size: 64px;"></i>
            </div>
            <div class="folder-name">{{ folder }}</div>
          </div>
          <div v-if="filteredFolders.length === 0 && searchQuery" class="no-results">
            <p style="text-align: center; padding: 40px; color: rgba(255, 255, 255, 0.6);">
              Aucun résultat trouvé pour "{{ searchQuery }}"
            </p>
          </div>
        </div>
        
        <!-- Vue contenu du répertoire -->
        <div v-else>
          <PrestationsTable 
            v-if="props.currentFolder === 'Prestations'" 
            :search-query="searchQuery"
          />
          <MobileAppsTable 
            v-else-if="props.currentFolder === 'Applications mobiles'" 
            :search-query="searchQuery"
          />
          <WebSitesTable 
            v-else-if="props.currentFolder === 'Sites et Applications'" 
            :search-query="searchQuery"
          />
          <FileListTable 
            v-else 
            :folder="props.currentFolder" 
            :search-query="searchQuery"
            @open-pdf="openPDF"
            @open-text="openTextFile"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  currentFolder: string
}>()

const emit = defineEmits<{
  close: []
  'change-folder': [folder: string]
  'open-pdf': [file: string, name: string]
  'open-text': [file: string, name: string]
}>()

const { getNextZIndex } = useWindowFocus()

const folders = ['Parcours', 'Prestations', 'Sites et Applications', 'Applications mobiles']
const position = ref({ x: 150, y: 100 })
const windowWidth = ref(900)
const windowHeight = ref(700)
const originalPosition = ref({ x: 150, y: 100 })
const originalSize = ref({ width: 900, height: 700 })
const zIndex = ref(5000)
const isWindowDragging = ref(false)
const windowOffsetX = ref(0)
const windowOffsetY = ref(0)
const searchQuery = ref('')
const isMaximized = ref(false)
const sidebarOpen = ref(false)
const isMobile = ref(false)

const focusWindow = () => {
  zIndex.value = getNextZIndex()
}

const windowTitle = computed(() => {
  return props.currentFolder || 'Répertoires'
})

const filteredFolders = computed(() => {
  if (!searchQuery.value) return folders
  const query = searchQuery.value.toLowerCase()
  return folders.filter(folder => folder.toLowerCase().includes(query))
})

const changeFolder = (folderName: string) => {
  emit('change-folder', folderName)
  if (isMobile.value) {
    sidebarOpen.value = false // Fermer le sidebar sur mobile après sélection
  }
}

const selectFolder = (folderName: string) => {
  emit('change-folder', folderName)
}

const goBack = () => {
  if (props.currentFolder) {
    emit('change-folder', '')
  }
}

const openPDF = (file: string, name: string) => {
  emit('open-pdf', file, name)
}

const openTextFile = (file: string, name: string) => {
  emit('open-text', file, name)
}

const minimize = () => {
  emit('close') // Fermer la fenêtre pour simuler la minimisation
}

const maximize = () => {
  isMaximized.value = !isMaximized.value
  if (isMaximized.value) {
    // Sauvegarder la position et taille d'origine
    originalPosition.value = { ...position.value }
    originalSize.value = { width: windowWidth.value, height: windowHeight.value }
    // Agrandir en plein écran
    position.value = { x: 0, y: 0 }
    windowWidth.value = window.innerWidth
    windowHeight.value = window.innerHeight
  } else {
    // Restaurer la position et taille d'origine
    position.value = { ...originalPosition.value }
    windowWidth.value = originalSize.value.width
    windowHeight.value = originalSize.value.height
  }
}

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768
}

const handleHeaderMouseDown = (e: MouseEvent) => {
  if (!isMaximized.value) {
    focusWindow()
    isWindowDragging.value = true
    windowOffsetX.value = e.clientX - position.value.x
    windowOffsetY.value = e.clientY - position.value.y
    e.preventDefault()
  }
}

onMounted(() => {
  // Mettre automatiquement au premier plan quand la fenêtre s'ouvre
  nextTick(() => {
    focusWindow()
  })
  
  // Détecter si on est sur mobile
  checkMobile()
  window.addEventListener('resize', checkMobile)
  
  const handleMouseMove = (e: MouseEvent) => {
    if (!isWindowDragging.value || isMaximized.value) return
    position.value.x = e.clientX - windowOffsetX.value
    position.value.y = e.clientY - windowOffsetY.value
  }
  
  const handleMouseUp = () => {
    isWindowDragging.value = false
  }
  
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
  
  onUnmounted(() => {
    window.removeEventListener('resize', checkMobile)
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  })
})
</script>

