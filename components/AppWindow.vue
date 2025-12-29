<template>
    <div 
      class="app-window"
      :class="{ open: isOpen, maximized: isMaximized }"
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
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string
  isOpen: boolean
  initialX?: number
  initialY?: number
}>()

const emit = defineEmits<{
  close: []
  minimize: []
  maximize: []
}>()

const { getNextZIndex } = useWindowFocus()

const position = ref({ 
  x: props.initialX || 150, 
  y: props.initialY || 100 
})
const windowWidth = ref(800)
const windowHeight = ref(600)
const originalPosition = ref({ x: props.initialX || 150, y: props.initialY || 100 })
const originalSize = ref({ width: 800, height: 600 })
const zIndex = ref(5000)
const isWindowDragging = ref(false)
const windowOffsetX = ref(0)
const windowOffsetY = ref(0)
const isMinimized = ref(false)
const isMaximized = ref(false)

const focusWindow = () => {
  zIndex.value = getNextZIndex()
}

// Mettre automatiquement au premier plan quand la fenêtre s'ouvre
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    nextTick(() => {
      focusWindow()
    })
  }
})

const close = () => {
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

onMounted(() => {
  const handleMouseMove = (e: MouseEvent) => {
    if (!isWindowDragging.value || isMaximized.value) return
    position.value.x = e.clientX - windowOffsetX.value
    position.value.y = e.clientY - windowOffsetY.value
  }
  
  const handleMouseUp = () => {
      if (isWindowDragging.value) {
        isWindowDragging.value = false
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
  transition: transform 0.2s ease-out, opacity 0.2s ease-out, width 0.3s ease-out, height 0.3s ease-out;
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
</style>

