<template>
  <div 
    ref="windowElement"
    class="finder-window"
    :class="{ open: props.isOpen !== false, maximized: isMaximized }"
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
        <span class="close-btn" style="background-color: #ff5f56;" title="Fermer" @click.stop="closeWindow"></span>
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
            <p class="no-results-text">
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
    
    <!-- Bordures pour le redimensionnement -->
    <div class="resize-handle resize-handle-top" @mousedown.stop="handleResizeStart($event, 'top')"></div>
    <div class="resize-handle resize-handle-bottom" @mousedown.stop="handleResizeStart($event, 'bottom')"></div>
    <div class="resize-handle resize-handle-left" @mousedown.stop="handleResizeStart($event, 'left')"></div>
    <div class="resize-handle resize-handle-right" @mousedown.stop="handleResizeStart($event, 'right')"></div>
    <div class="resize-handle resize-handle-top-left" @mousedown.stop="handleResizeStart($event, 'top-left')"></div>
    <div class="resize-handle resize-handle-top-right" @mousedown.stop="handleResizeStart($event, 'top-right')"></div>
    <div class="resize-handle resize-handle-bottom-left" @mousedown.stop="handleResizeStart($event, 'bottom-left')"></div>
    <div class="resize-handle resize-handle-bottom-right" @mousedown.stop="handleResizeStart($event, 'bottom-right')"></div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  currentFolder: string
  isOpen?: boolean
  forceFocus?: number
}>()

const emit = defineEmits<{
  close: []
  'change-folder': [folder: string]
  'open-pdf': [file: string, name: string]
  'open-text': [file: string, name: string]
}>()

const { getNextZIndex, getLowZIndex } = useWindowFocus()
const { getNextPosition, removeWindow } = useWindowPosition()

const folders = ['Parcours', 'Prestations', 'Sites et Applications', 'Applications mobiles']
const windowWidth = ref(900)
const windowHeight = ref(600)
// Position initiale sera calculée par getNextPosition
const position = ref({ x: 150, y: 100 })
const originalPosition = ref({ x: 150, y: 100 })
const originalSize = ref({ width: 900, height: 600 })
// Le Finder commence avec un z-index très bas pour rester en arrière-plan
// Il ne passera au premier plan que quand on clique dessus explicitement
const zIndex = ref(getLowZIndex())
const isWindowDragging = ref(false)
const windowOffsetX = ref(0)
const windowOffsetY = ref(0)
const searchQuery = ref('')
const isMaximized = ref(false)
const sidebarOpen = ref(false)
const isMobile = ref(false)
const windowId = 'finder'
const isResizing = ref(false)
const resizeDirection = ref<string>('')
const resizeStartX = ref(0)
const resizeStartY = ref(0)
const resizeStartWidth = ref(0)
const resizeStartHeight = ref(0)
const resizeStartLeft = ref(0)
const resizeStartTop = ref(0)

const windowElement = ref<HTMLElement | null>(null)

const focusWindow = () => {
  const newZIndex = getNextZIndex()
  zIndex.value = newZIndex
  // Forcer la mise à jour immédiate dans le DOM
  if (windowElement.value) {
    windowElement.value.style.zIndex = newZIndex.toString()
  }
}

// Watch sur zIndex pour mettre à jour le DOM (sécurité)
watch(zIndex, (newZIndex) => {
  if (windowElement.value) {
    windowElement.value.style.zIndex = newZIndex.toString()
  }
}, { immediate: true })

const closeWindow = () => {
  removeWindow(windowId)
  emit('close')
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

const handleResizeStart = (e: MouseEvent, direction: string) => {
  if (isMaximized.value) return
  
  focusWindow()
  isResizing.value = true
  resizeDirection.value = direction
  resizeStartX.value = e.clientX
  resizeStartY.value = e.clientY
  resizeStartWidth.value = windowWidth.value
  resizeStartHeight.value = windowHeight.value
  resizeStartLeft.value = position.value.x
  resizeStartTop.value = position.value.y
  e.preventDefault()
  e.stopPropagation()
}

// Watch pour forcer le focus quand forceFocus change
watch(() => props.forceFocus, (newValue, oldValue) => {
  if (props.isOpen && newValue !== oldValue && newValue !== undefined) {
    nextTick(() => {
      focusWindow()
    })
  }
}, { immediate: false })

// Watch pour détecter quand la fenêtre s'ouvre/ferme
watch(() => props.isOpen, (isOpen, wasOpen) => {
  if (isOpen) {
    // Mettre au premier plan IMMÉDIATEMENT
    focusWindow()
    
    nextTick(() => {
      // Toujours calculer une nouvelle position pour éviter les superpositions
      const newPosition = getNextPosition(windowId, true)
      position.value = newPosition
      originalPosition.value = { ...newPosition }
    })
  } else {
    // Retirer la fenêtre de la liste quand elle se ferme
    removeWindow(windowId)
    // Réduire le z-index pour qu'elle passe en arrière-plan
    zIndex.value = getLowZIndex()
  }
}, { immediate: true })

onMounted(() => {
  // Calculer la position quand la fenêtre s'ouvre
  if (props.isOpen !== false) {
    nextTick(() => {
      // Calculer une position décalée pour éviter les superpositions
      const newPosition = getNextPosition(windowId, true)
      position.value = newPosition
      originalPosition.value = { ...newPosition }
      // NE PAS mettre au premier plan automatiquement - le Finder reste en arrière-plan
      // Il passera au premier plan seulement quand on clique dessus
    })
  }
  
  // Détecter si on est sur mobile
  checkMobile()
  window.addEventListener('resize', checkMobile)
  
  const handleMouseMove = (e: MouseEvent) => {
    if (isResizing.value) {
      const deltaX = e.clientX - resizeStartX.value
      const deltaY = e.clientY - resizeStartY.value
      const minWidth = 728
      const minHeight = 499
      
      if (resizeDirection.value.includes('right')) {
        windowWidth.value = Math.max(minWidth, resizeStartWidth.value + deltaX)
      }
      if (resizeDirection.value.includes('left')) {
        const newWidth = Math.max(minWidth, resizeStartWidth.value - deltaX)
        if (newWidth > minWidth) {
          position.value.x = resizeStartLeft.value + (resizeStartWidth.value - newWidth)
          windowWidth.value = newWidth
        }
      }
      if (resizeDirection.value.includes('bottom')) {
        windowHeight.value = Math.max(minHeight, resizeStartHeight.value + deltaY)
      }
      if (resizeDirection.value.includes('top')) {
        const newHeight = Math.max(minHeight, resizeStartHeight.value - deltaY)
        if (newHeight > minHeight) {
          position.value.y = resizeStartTop.value + (resizeStartHeight.value - newHeight)
          windowHeight.value = newHeight
        }
      }
    } else if (isWindowDragging.value && !isMaximized.value) {
      const newX = e.clientX - windowOffsetX.value
      const newY = e.clientY - windowOffsetY.value
      
      // Contraintes pour empêcher la fenêtre de sortir de l'écran
      // Garder au moins 50px de la fenêtre visible de chaque côté
      const minVisible = 50
      const windowWidth = windowElement.value?.offsetWidth || 800
      const windowHeight = windowElement.value?.offsetHeight || 600
      
      // Limites pour X (côtés gauche et droit)
      // Si x est négatif, le bord gauche sort de l'écran, donc x >= -(windowWidth - 50)
      // Si x + windowWidth > window.innerWidth, le bord droit sort, donc x <= window.innerWidth - windowWidth - 50
      const minX = -(windowWidth - minVisible)
      const maxX = window.innerWidth - windowWidth - minVisible
      
      // Limites pour Y (haut et bas)
      // Le header (40px de haut) doit toujours rester visible, donc y >= 0
      // Le bord bas (y + windowHeight) doit être <= window.innerHeight - 50 pour garder 50px visibles en bas
      const headerHeight = 40
      const minY = 0 // Le header doit toujours être visible
      const maxY = window.innerHeight - windowHeight - minVisible
      
      // Appliquer les contraintes de manière stricte
      position.value.x = Math.max(minX, Math.min(maxX, newX))
      position.value.y = Math.max(minY, Math.min(maxY, newY))
      
      // Double vérification pour s'assurer que les valeurs sont bien contraintes
      if (position.value.y < minY) position.value.y = minY
      if (position.value.y > maxY) position.value.y = maxY
      if (position.value.x < minX) position.value.x = minX
      if (position.value.x > maxX) position.value.x = maxX
    }
  }
  
  const handleMouseUp = () => {
    if (isWindowDragging.value) {
      isWindowDragging.value = false
    }
    if (isResizing.value) {
      isResizing.value = false
      resizeDirection.value = ''
    }
  }
  
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
  
  onUnmounted(() => {
    window.removeEventListener('resize', checkMobile)
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
    removeWindow(windowId)
  })
})
</script>

