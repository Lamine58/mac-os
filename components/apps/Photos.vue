<template>
  <AppWindow 
    :title="'Photos'"
    :is-open="isOpen"
    @close="$emit('close')"
  >
    <div class="photos-content">
      <div class="photos-sidebar">
        <div class="photos-section">
          <div class="section-title">Bibliothèque</div>
          <div class="section-item active">
            <i class="bi bi-images"></i> Toutes les photos
          </div>
          <div class="section-item">
            <i class="bi bi-heart"></i> Favoris
          </div>
          <div class="section-item">
            <i class="bi bi-camera"></i> Appareil photo
          </div>
        </div>
      </div>
      <div class="photos-main">
        <div class="photos-grid">
          <div 
            v-for="(photo, index) in photos" 
            :key="index"
            class="photo-item"
            @click="openPhoto(index)"
          >
            <img :src="photo" :alt="`Photo ${index + 1}`">
          </div>
        </div>
      </div>
    </div>

    <!-- Lightbox -->
    <div v-if="lightboxOpen" class="lightbox-overlay" @click.self="closeLightbox">
      <div class="lightbox-traffic-lights">
        <span 
          class="lightbox-close-btn" 
          style="background-color: #ff5f56;" 
          title="Fermer" 
          @click.stop="closeLightbox"
        ></span>
        <span 
          class="lightbox-minimize-btn" 
          style="background-color: #ffbd2e;" 
          title="Réduire"
        ></span>
        <span 
          class="lightbox-maximize-btn" 
          style="background-color: #27c93f;" 
          title="Agrandir"
        ></span>
      </div>
      <div class="lightbox-content" @click.self="closeLightbox">
        <img 
          :src="currentPhoto" 
          :alt="`Photo ${currentPhotoIndex + 1}`"
          class="lightbox-image"
        >
        <div class="lightbox-caption">
          Photo {{ currentPhotoIndex + 1 }} / {{ photos.length }}
        </div>
      </div>
    </div>
  </AppWindow>
</template>

<script setup lang="ts">
const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const { getAssetPath } = useAssetPath()

const photos = [
  getAssetPath('images/epis.png'),
  getAssetPath('images/agt.png'),
  getAssetPath('images/ict.png'),
  getAssetPath('images/sm.jpeg'),
  getAssetPath('images/push.jpg'),
  getAssetPath('images/ppro.png'),
  getAssetPath('images/ic.png')
]

const lightboxOpen = ref(false)
const currentPhoto = ref('')
const currentPhotoIndex = ref(0)

const openPhoto = (index: number) => {
  currentPhotoIndex.value = index
  currentPhoto.value = photos[index]
  lightboxOpen.value = true
  document.body.style.overflow = 'hidden'
}

const closeLightbox = () => {
  lightboxOpen.value = false
  document.body.style.overflow = ''
}

onMounted(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && lightboxOpen.value) {
      closeLightbox()
    }
  }
  
  document.addEventListener('keydown', handleEscape)
  
  onUnmounted(() => {
    document.removeEventListener('keydown', handleEscape)
    document.body.style.overflow = ''
  })
})
</script>

<style scoped>
.photos-content {
  display: flex;
  height: 100%;
  background: #1e1e1e;
}

.photos-sidebar {
  width: 200px;
  background: #252525;
  padding: 20px 0;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.section-title {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  padding: 10px 20px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.section-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: background 0.2s;
}

.section-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.section-item.active {
  background: rgba(0, 122, 255, 0.2);
  color: #007aff;
}

.photos-main {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: #1e1e1e;
}

.photos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 10px;
}

.photo-item {
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s;
}

.photo-item:hover {
  transform: scale(1.05);
}

.photo-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Lightbox styles */
.lightbox-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(30px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  animation: fadeInMac 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.lightbox-content {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  animation: zoomInMac 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  padding: 20px;
  box-sizing: border-box;
}

.lightbox-traffic-lights {
  position: absolute;
  top: 20px;
  left: 20px;
  display: flex;
  gap: 8px;
  z-index: 10002;
  pointer-events: auto;
}

.lightbox-close-btn,
.lightbox-minimize-btn,
.lightbox-maximize-btn {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.2s;
  display: inline-block;
  pointer-events: auto;
}

.lightbox-close-btn:hover {
  background-color: #f24b43 !important;
}

.lightbox-minimize-btn:hover {
  background-color: #e5ac47 !important;
}

.lightbox-maximize-btn:hover {
  background-color: #55c851 !important;
}

.lightbox-image {
  max-width: 90%;
  max-height: 90%;
  width: auto;
  height: auto;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
}

.lightbox-caption {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  padding: 10px 20px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(15px);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  z-index: 10001;
}

@keyframes fadeInMac {
  from {
    opacity: 0;
    backdrop-filter: blur(0px);
  }
  to {
    opacity: 1;
    backdrop-filter: blur(30px);
  }
}

@keyframes zoomInMac {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
