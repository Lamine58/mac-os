<template>
  <div class="text-viewer-overlay" @click="close">
    <div class="text-viewer-content" @click.stop>
      <div class="text-viewer-header">
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

const close = () => {
  emit('close')
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

  // Fermer avec Escape
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
.text-viewer-overlay {
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

.text-viewer-content {
  width: 80%;
  max-width: 900px;
  height: 80%;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: zoomInMac 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.text-viewer-header {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  background: rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
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
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  font-weight: 500;
  flex: 1;
  text-align: center;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
}

.text-viewer-body {
  flex: 1;
  overflow: auto;
  padding: 30px;
  color: rgba(255, 255, 255, 0.9);
}

.text-viewer-text {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-wrap: break-word;
  margin: 0;
  color: rgba(255, 255, 255, 0.9);
}

.text-viewer-loading,
.text-viewer-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
}

.text-viewer-loading i {
  font-size: 32px;
  margin-bottom: 15px;
  animation: spin 1s linear infinite;
}

.text-viewer-error i {
  font-size: 48px;
  margin-bottom: 15px;
  color: rgba(255, 255, 255, 0.6);
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

