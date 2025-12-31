<template>
  <div>
    <div v-if="filteredPrestations.length === 0 && props.searchQuery" class="no-results">
      <p class="no-results-text">Aucun résultat trouvé pour "{{ props.searchQuery }}"</p>
    </div>
    <table v-else id="prestation" class="prestations-table">
      <tbody>
        <tr>
          <td 
            v-for="prestation in filteredPrestations.slice(0, 5)" 
            :key="prestation.name" 
            class="prestation-cell"
            @click="openLightbox(prestation)"
          >
            <img :src="prestation.image" class="prestation-image" :alt="prestation.name">
            <div class="prestation-name"><small>{{ prestation.name }}</small></div>
          </td>
        </tr>
        <tr v-if="filteredPrestations.length > 5">
          <td 
            v-for="prestation in filteredPrestations.slice(5)" 
            :key="prestation.name" 
            class="prestation-cell"
            @click="openLightbox(prestation)"
          >
            <img :src="prestation.image" class="prestation-image" :alt="prestation.name">
            <div class="prestation-name"><small>{{ prestation.name }}</small></div>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Lightbox -->
    <div 
      v-if="selectedImage" 
      class="lightbox-overlay"
      @click="closeLightbox"
    >
      <div class="lightbox-content" @click.stop>
        <div class="lightbox-traffic-lights">
          <span class="lightbox-close-btn" style="background-color: #ff5f56;" title="Fermer" @click="closeLightbox"></span>
          <span class="lightbox-minimize-btn" style="background-color: #ffbd2e;" title="Réduire"></span>
          <span class="lightbox-maximize-btn" style="background-color: #27c93f;" title="Agrandir"></span>
        </div>
        <img :src="selectedImage.image" :alt="selectedImage.name" class="lightbox-image">
        <div class="lightbox-caption">{{ selectedImage.name }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  searchQuery?: string
}>()

type Prestation = {
  name: string
  image: string
}

const { getAssetPath } = useAssetPath()

const allPrestations: Prestation[] = [
  { name: 'Epistrophe.png', image: getAssetPath('images/epis.png') },
  { name: 'AGT.png', image: getAssetPath('images/agt.png') },
  { name: 'ICT4DEV.png', image: getAssetPath('images/ict.png') },
  { name: 'Smahiley.png', image: getAssetPath('images/sm.jpeg') },
  { name: 'Push.png', image: getAssetPath('images/push.jpg') },
  { name: 'Paiement PRO.png', image: getAssetPath('images/ppro.png') },
  { name: 'IC-Digital Tans.png', image: getAssetPath('images/ic.png') }
]

const filteredPrestations = computed(() => {
  if (!props.searchQuery) return allPrestations
  
  const query = props.searchQuery.toLowerCase()
  return allPrestations.filter(prestation => 
    prestation.name.toLowerCase().includes(query)
  )
})

const selectedImage = ref<Prestation | null>(null)

const openLightbox = (prestation: Prestation) => {
  selectedImage.value = prestation
  document.body.style.overflow = 'hidden'
}

const closeLightbox = () => {
  selectedImage.value = null
  document.body.style.overflow = ''
}

// Fermer avec la touche Escape
onMounted(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && selectedImage.value) {
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
  z-index: 10001;
}

.lightbox-close-btn,
.lightbox-minimize-btn,
.lightbox-maximize-btn {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.2s;
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
  max-width: 100%;
  max-height: 100%;
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

.no-results {
  text-align: center;
  padding: 40px;
  color: var(--text-color-secondary);
  font-size: 14px;
  transition: color 0.3s ease;
}

.prestations-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 15px;
}

.prestation-cell {
  width: 100px;
  cursor: pointer;
  padding: 10px;
  transition: all 0.3s ease;
  vertical-align: top;
  text-align: center;
}

.prestation-cell:hover {
  transform: translateY(-2px);
}

.prestation-image {
  width: 100px;
  height: auto;
  border-radius: 4px;
  border: 1px solid var(--border-color);
  transition: border-color 0.3s ease;
}

.prestation-cell:hover .prestation-image {
  border-color: var(--text-color-secondary);
}

.prestation-name {
  width: 100px;
  text-align: center;
  margin-top: 8px;
  color: var(--text-color);
  transition: color 0.3s ease;
}

.prestation-name small {
  font-size: 11px;
  color: var(--text-color-secondary);
  transition: color 0.3s ease;
}
</style>

