<template>
  <div class="pdf-viewer-overlay" @click="close">
    <div class="pdf-viewer-content" @click.stop>
      <div class="pdf-viewer-header">
        <div class="pdf-viewer-traffic-lights">
          <span class="pdf-viewer-close-btn" style="background-color: #ff5f56;" title="Fermer" @click.stop="close"></span>
          <span class="pdf-viewer-minimize-btn" style="background-color: #ffbd2e;" title="Réduire"></span>
          <span class="pdf-viewer-maximize-btn" style="background-color: #27c93f;" title="Agrandir"></span>
        </div>
        <div class="pdf-viewer-title">{{ props.name }}</div>
      </div>
      <div class="pdf-viewer-body">
        <div class="pdf-viewer-actions">
          <a :href="props.file" target="_blank" class="pdf-action-btn" title="Ouvrir dans un nouvel onglet">
            <i class="bi bi-box-arrow-up-right"></i> Ouvrir
          </a>
          <a :href="props.file" :download="props.name" class="pdf-action-btn" title="Télécharger">
            <i class="bi bi-download"></i> Télécharger
          </a>
        </div>
        <iframe 
          :src="`${props.file}#toolbar=1&navpanes=1&scrollbar=1`" 
          class="pdf-iframe"
          frameborder="0"
          @error="handleError"
        ></iframe>
        <div v-if="hasError" class="pdf-error">
          <i class="bi bi-exclamation-triangle"></i>
          <p>Impossible de charger le PDF. Utilisez les boutons ci-dessus pour l'ouvrir ou le télécharger.</p>
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

const hasError = ref(false)

const close = () => {
  emit('close')
}

const handleError = () => {
  hasError.value = true
}

// Fermer avec Escape
onMounted(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      close()
    }
  }
  
  document.addEventListener('keydown', handleEscape)
  
  onUnmounted(() => {
    document.removeEventListener('keydown', handleEscape)
  })
})
</script>

<style scoped>
.pdf-viewer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(20px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  animation: fadeInMac 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.pdf-viewer-content {
  width: 90%;
  height: 90%;
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
}

.pdf-viewer-header {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  background: var(--bg-window-header);
  border-bottom: 1px solid var(--border-color);
  position: relative;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.pdf-viewer-traffic-lights {
  display: flex;
  gap: 8px;
}

.pdf-viewer-close-btn,
.pdf-viewer-minimize-btn,
.pdf-viewer-maximize-btn {
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

.pdf-viewer-close-btn:hover {
  background-color: #f24b43 !important;
}

.pdf-viewer-minimize-btn:hover {
  background-color: #e5ac47 !important;
}

.pdf-viewer-maximize-btn:hover {
  background-color: #55c851 !important;
}

.pdf-viewer-title {
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

.pdf-viewer-body {
  flex: 1;
  overflow: hidden;
  padding: 20px;
  display: flex;
  flex-direction: column;
  position: relative;
  background: var(--bg-window-content);
  transition: background-color 0.3s ease;
}

.pdf-viewer-actions {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  justify-content: center;
}

.pdf-action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: var(--bg-sidebar);
  backdrop-filter: blur(10px);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-color);
  text-decoration: none;
  font-size: 13px;
  transition: all 0.3s ease;
}

.pdf-action-btn:hover {
  background: var(--hover-bg);
  transform: translateY(-2px);
  border-color: var(--text-color-secondary);
}

.pdf-iframe {
  flex: 1;
  width: 100%;
  min-height: 0;
  border-radius: 8px;
  background: white;
}

.pdf-error {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: var(--text-color-secondary);
  padding: 20px;
  transition: color 0.3s ease;
}

.pdf-error i {
  font-size: 48px;
  margin-bottom: 15px;
  display: block;
  color: var(--text-color-secondary);
  opacity: 0.6;
  transition: color 0.3s ease;
}

.pdf-error p {
  margin: 0;
  font-size: 14px;
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

