<template>
  <div class="text-viewer-overlay" @click="close">
    <div 
      ref="contentElement"
      class="text-viewer-content" 
      :style="{ left: position.x + 'px', top: position.y + 'px' }"
      @click.stop
    >
      <div class="text-viewer-header" @mousedown.stop="handleHeaderMouseDown">
        <div class="text-viewer-traffic-lights">
          <span class="text-viewer-close-btn" style="background-color: #ff5f56;" title="Fermer" @click.stop="close"></span>
          <span class="text-viewer-minimize-btn" style="background-color: #ffbd2e;" title="Réduire"></span>
          <span class="text-viewer-maximize-btn" style="background-color: #27c93f;" title="Agrandir"></span>
        </div>
        <div class="text-viewer-title">{{ props.name }}</div>
      </div>
      <div class="text-viewer-body">
        <div v-if="loading" class="text-viewer-loading">
          <i class="bi bi-arrow-repeat"></i> Chargement...
        </div>
        <pre v-else-if="content" class="text-viewer-text">{{ content }}</pre>
        <div v-else class="text-viewer-error">
          <i class="bi bi-exclamation-triangle"></i>
          <p>Impossible de charger le fichier.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  file: string
  name: string
}>()

const emit = defineEmits<{
  close: []
}>()

const content = ref('')
const loading = ref(true)
const contentElement = ref<HTMLElement | null>(null)
const isDragging = ref(false)
const windowOffsetX = ref(0)
const windowOffsetY = ref(0)
const position = ref({ x: 0, y: 0 })

const close = () => {
  emit('close')
}

const handleHeaderMouseDown = (e: MouseEvent) => {
  if (!contentElement.value) return
  isDragging.value = true
  const rect = contentElement.value.getBoundingClientRect()
  windowOffsetX.value = e.clientX - rect.left
  windowOffsetY.value = e.clientY - rect.top
  contentElement.value.style.cursor = 'grabbing'
  e.preventDefault()
}

onMounted(async () => {
  // Charger le fichier
  try {
    const response = await fetch(props.file)
    if (response.ok) {
      content.value = await response.text()
    }
  } catch (error) {
    console.error('Erreur lors du chargement du fichier:', error)
  } finally {
    loading.value = false
  }

  // Centrer le modal initialement
  nextTick(() => {
    if (contentElement.value) {
      const rect = contentElement.value.getBoundingClientRect()
      position.value = {
        x: (window.innerWidth - rect.width) / 2,
        y: (window.innerHeight - rect.height) / 2
      }
    }
  })

  // Fermer avec Escape et gérer le drag
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      close()
    }
  }
  
  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging.value && contentElement.value) {
      const rect = contentElement.value.getBoundingClientRect()
      const modalWidth = rect.width
      const modalHeight = rect.height
      const minVisibleTop = 200 // Minimum 200px du haut visible
      
      // Calculer les nouvelles positions
      let newX = e.clientX - windowOffsetX.value
      let newY = e.clientY - windowOffsetY.value
      
      // Contraintes pour Y : le haut doit toujours être visible (min 200px)
      // et le bas ne doit pas sortir complètement de l'écran
      const maxNegativeY = -(modalHeight - minVisibleTop)
      const maxPositiveY = window.innerHeight - minVisibleTop // Au moins 200px du bas visible
      newY = Math.max(maxNegativeY, Math.min(maxPositiveY, newY))
      
      // Contraintes pour X : le modal ne doit pas sortir complètement à gauche ou à droite
      // Au moins 50px doivent rester visibles de chaque côté
      const minVisibleSide = 50
      const maxNegativeX = -(modalWidth - minVisibleSide)
      const maxPositiveX = window.innerWidth - minVisibleSide
      newX = Math.max(maxNegativeX, Math.min(maxPositiveX, newX))
      
      position.value = {
        x: newX,
        y: newY
      }
    }
  }
  
  const handleMouseUp = () => {
    if (isDragging.value && contentElement.value) {
      isDragging.value = false
      contentElement.value.style.cursor = ''
    }
  }
  
  document.addEventListener('keydown', handleEscape)
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
  
  onUnmounted(() => {
    document.removeEventListener('keydown', handleEscape)
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  })
})
</script>

<style scoped>
.text-viewer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  max-width: 100vw;
  max-height: 100vh;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(20px);
  z-index: 10000;
  animation: fadeInMac 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.text-viewer-content {
  position: absolute;
  width: 80%;
  max-width: min(900px, calc(100vw - 40px));
  height: 80%;
  max-height: calc(100vh - 120px);
  background: var(--bg-window);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: zoomInMac 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  transition: background-color 0.3s ease, border-color 0.3s ease;
  cursor: default;
}

.text-viewer-header {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  background: var(--bg-window-header);
  border-bottom: 1px solid var(--border-color);
  position: relative;
  flex-shrink: 0;
  cursor: grab;
  transition: background-color 0.3s ease, border-color 0.3s ease;
  user-select: none;
}

.text-viewer-header:active {
  cursor: grabbing;
}

.text-viewer-traffic-lights {
  display: flex;
  gap: 8px;
}

.text-viewer-close-btn,
.text-viewer-minimize-btn,
.text-viewer-maximize-btn {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.2s;
  display: inline-block;
  position: relative;
  z-index: 10002;
  pointer-events: auto;
}

.text-viewer-close-btn:hover {
  background-color: #f24b43 !important;
}

.text-viewer-minimize-btn:hover {
  background-color: #e5ac47 !important;
}

.text-viewer-maximize-btn:hover {
  background-color: #55c851 !important;
}

.text-viewer-title {
  color: var(--text-color);
  font-size: 14px;
  font-weight: 500;
  flex: 1;
  text-align: center;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  transition: color 0.3s ease;
}

.text-viewer-body {
  flex: 1;
  overflow: auto;
  padding: 30px;
  background: var(--bg-window-content);
  color: var(--text-color);
  transition: background-color 0.3s ease, color 0.3s ease;
}

.text-viewer-text {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-wrap: break-word;
  margin: 0;
  color: var(--text-color);
  transition: color 0.3s ease;
}

.text-viewer-loading,
.text-viewer-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--text-color-secondary);
  text-align: center;
  transition: color 0.3s ease;
}

.text-viewer-loading i {
  font-size: 32px;
  margin-bottom: 15px;
  animation: spin 1s linear infinite;
  color: var(--text-color-secondary);
  transition: color 0.3s ease;
}

.text-viewer-error i {
  font-size: 48px;
  margin-bottom: 15px;
  color: var(--text-color-secondary);
  opacity: 0.6;
  transition: color 0.3s ease;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes fadeInMac {
  from {
    opacity: 0;
    backdrop-filter: blur(0px);
  }
  to {
    opacity: 1;
    backdrop-filter: blur(20px);
  }
}

@keyframes zoomInMac {
  from {
    transform: scale(0.85) translateY(20px);
    opacity: 0;
  }
  to {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}
</style>

