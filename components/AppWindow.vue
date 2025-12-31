<template>
    <div 
      ref="windowElement"
      class="app-window"
      :class="{ open: isOpen, maximized: isMaximized }"
      :data-window-id="windowId"
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
        <span 
          class="close-btn" 
          style="background-color: #ff5f56;" 
          title="Fermer" 
          @click.stop="close"
        ></span>
        <span 
          class="minimize-btn" 
          style="background-color: #ffbd2e;" 
          title="Réduire"
          @click.stop="minimize"
        ></span>
        <span 
          v-if="!hideMaximize"
          class="maximize-btn" 
          style="background-color: #27c93f;" 
          title="Agrandir"
          @click.stop="maximize"
        ></span>
      </div>
      <span class="window-title">{{ title }}</span>
    </div>
    <div class="window-content">
      <slot></slot>
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
  title: string
  isOpen: boolean
  initialX?: number
  initialY?: number
  windowId?: string // Identifiant unique pour la fenêtre
  forceFocus?: number // Compteur pour forcer le focus
  hideMaximize?: boolean // Masquer le bouton agrandir
  initialWidth?: number // Largeur initiale de la fenêtre
  initialHeight?: number // Hauteur initiale de la fenêtre
}>()

const emit = defineEmits<{
  close: []
  minimize: []
  maximize: []
}>()

const { getNextZIndex } = useWindowFocus()
const { getNextPosition, removeWindow } = useWindowPosition()

// Générer un ID unique pour cette fenêtre si non fourni
const windowId = computed(() => props.windowId || props.title.toLowerCase().replace(/\s+/g, '-'))

const windowWidth = ref(props.initialWidth || 800)
const windowHeight = ref(props.initialHeight || 600)
const position = ref({ 
  x: props.initialX || 150, 
  y: props.initialY || 100 
})
const originalPosition = ref({ x: props.initialX || 150, y: props.initialY || 100 })
const originalSize = ref({ width: props.initialWidth || 800, height: props.initialHeight || 600 })
// Initialiser avec un z-index bas, il sera mis à jour quand la fenêtre s'ouvre
const zIndex = ref(4000)
const isWindowDragging = ref(false)
const windowOffsetX = ref(0)
const windowOffsetY = ref(0)
const isMinimized = ref(false)
const isMaximized = ref(false)
const windowElement = ref<HTMLElement | null>(null)
const isResizing = ref(false)
const resizeDirection = ref<string>('')
const resizeStartX = ref(0)
const resizeStartY = ref(0)
const resizeStartWidth = ref(0)
const resizeStartHeight = ref(0)
const resizeStartLeft = ref(0)
const resizeStartTop = ref(0)

const focusWindow = () => {
  // Toujours obtenir un nouveau z-index pour passer au premier plan
  const newZIndex = getNextZIndex()
  zIndex.value = newZIndex
  
  // Forcer la mise à jour immédiate dans le DOM
  if (windowElement.value) {
    windowElement.value.style.zIndex = newZIndex.toString()
    console.log(`[AppWindow ${props.title}] Focus applied: z-index = ${newZIndex}`)
  } else {
    console.warn(`[AppWindow ${props.title}] windowElement is null!`)
  }
}

// Watch sur zIndex pour mettre à jour le DOM (sécurité)
watch(zIndex, (newZIndex) => {
  if (windowElement.value) {
    windowElement.value.style.zIndex = newZIndex.toString()
  }
}, { immediate: true })

// Watch pour forcer le focus quand forceFocus change (clic sur icône d'une fenêtre déjà ouverte)
watch(() => props.forceFocus, (newValue, oldValue) => {
  if (props.isOpen && newValue !== oldValue && newValue !== undefined) {
    console.log(`[AppWindow ${props.title}] forceFocus changed: ${oldValue} -> ${newValue}`)
    // Forcer le focus dans nextTick pour s'assurer que le DOM est prêt
    nextTick(() => {
      focusWindow()
    })
  }
}, { immediate: false })

// Watch pour mettre au premier plan quand la fenêtre s'ouvre
watch(() => props.isOpen, (isOpen, wasOpen) => {
  if (isOpen) {
    // Si la fenêtre vient de s'ouvrir (wasOpen est undefined ou false)
    if (wasOpen === false || wasOpen === undefined) {
      // Mettre au premier plan IMMÉDIATEMENT
      focusWindow()
      
      // Calculer la position ensuite
      nextTick(() => {
        if (props.initialX === undefined && props.initialY === undefined) {
          const newPosition = getNextPosition(windowId.value, true)
          position.value = newPosition
          originalPosition.value = { ...newPosition }
        } else {
          position.value = { x: props.initialX || 150, y: props.initialY || 100 }
          originalPosition.value = { x: props.initialX || 150, y: props.initialY || 100 }
        }
      })
    }
  } else {
    if (props.initialX === undefined && props.initialY === undefined) {
      removeWindow(windowId.value)
    }
    // Réinitialiser le z-index quand la fenêtre se ferme
    zIndex.value = 4000
  }
}, { immediate: true })

const close = () => {
  // Retirer la fenêtre de la liste seulement si elle n'a pas de position initiale
  if (props.initialX === undefined && props.initialY === undefined) {
    removeWindow(windowId.value)
  }
  emit('close')
}

const minimize = () => {
  isMinimized.value = true
  emit('minimize')
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
  emit('maximize')
}

const handleHeaderMouseDown = (e: MouseEvent) => {
  focusWindow()
  isWindowDragging.value = true
  windowOffsetX.value = e.clientX - position.value.x
  windowOffsetY.value = e.clientY - position.value.y
  e.preventDefault()
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

onMounted(() => {
  // Le focus est déjà géré par le watch sur isOpen, pas besoin de le refaire ici
  // Cela évite les appels multiples à focusWindow()
  
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
      position.value.x = e.clientX - windowOffsetX.value
      position.value.y = e.clientY - windowOffsetY.value
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
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  })
})
</script>

<style scoped>
.app-window {
  position: fixed;
  width: 800px;
  height: 600px;
  background-color: #2e2e2e;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  display: none;
  flex-direction: column;
  overflow: hidden;
  color: white;
  transform: scale(0.95);
  opacity: 0;
  transition: transform 0.2s ease-out, opacity 0.2s ease-out;
}

.app-window.open {
  display: flex !important;
  transform: scale(1);
  opacity: 1;
}

.app-window.maximized {
  border-radius: 0;
  left: 0 !important;
  top: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
}

.window-header {
  height: 40px;
  background-color: #2e2e2e;
  display: flex;
  align-items: center;
  padding: 0 10px;
  position: relative;
  user-select: none;
  cursor: grab;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.traffic-lights {
  display: flex;
  gap: 8px;
}

.close-btn, .minimize-btn, .maximize-btn {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.2s;
}

.close-btn:hover { background-color: #f24b43 !important; }
.minimize-btn:hover { background-color: #e5ac47 !important; }
.maximize-btn:hover { background-color: #55c851 !important; }

.window-title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-weight: 500;
  font-size: 14px;
  color: #ccc;
}

.window-content {
  flex: 1;
  overflow: auto;
  background: #1e1e1e;
  display: flex;
  flex-direction: column;
}

/* Bordures pour le redimensionnement */
.resize-handle {
  position: absolute;
  background: transparent;
  z-index: 10;
}

.resize-handle-top {
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  cursor: ns-resize;
}

.resize-handle-bottom {
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  cursor: ns-resize;
}

.resize-handle-left {
  top: 0;
  left: 0;
  bottom: 0;
  width: 4px;
  cursor: ew-resize;
}

.resize-handle-right {
  top: 0;
  right: 0;
  bottom: 0;
  width: 4px;
  cursor: ew-resize;
}

.resize-handle-top-left {
  top: 0;
  left: 0;
  width: 8px;
  height: 8px;
  cursor: nwse-resize;
}

.resize-handle-top-right {
  top: 0;
  right: 0;
  width: 8px;
  height: 8px;
  cursor: nesw-resize;
}

.resize-handle-bottom-left {
  bottom: 0;
  left: 0;
  width: 8px;
  height: 8px;
  cursor: nesw-resize;
}

.resize-handle-bottom-right {
  bottom: 0;
  right: 0;
  width: 8px;
  height: 8px;
  cursor: nwse-resize;
}

.app-window.maximized .resize-handle {
  display: none;
}
</style>

