<template>
  <AppWindow 
    :title="'App Store'"
    :is-open="isOpen"
    :force-focus="forceFocus"
    :initial-width="1000"
    :initial-height="700"
    @close="$emit('close')"
  >
    <div class="appstore-content">
      <!-- Sidebar -->
      <div class="appstore-sidebar">
        <div class="sidebar-section">
          <div class="sidebar-item active">
            <i class="bi bi-house"></i>
            <span>Découvrir</span>
          </div>
        </div>
        <div class="sidebar-section">
          <div class="sidebar-label">Catégories</div>
          <div class="sidebar-item">
            <i class="bi bi-app"></i>
            <span>Productivité</span>
          </div>
          <div class="sidebar-item">
            <i class="bi bi-book"></i>
            <span>Éducation</span>
          </div>
          <div class="sidebar-item">
            <i class="bi bi-heart-pulse"></i>
            <span>Santé</span>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="appstore-main">
        <!-- Featured View -->
        <div v-if="!selectedApp" class="featured-view">
          <div class="featured-header">
            <h1>Découvrir</h1>
          </div>


          <!-- Apps Grid Section -->
          <div class="apps-section">
            <div class="apps-grid">
              <!-- BabyLearn Card -->
              <div class="app-card" @click="selectApp('babylearn')">
                <div class="app-card-icon">
                  <img :src="getAssetPath('image-store/logo-babylearn.webp')" alt="BabyLearn">
                </div>
                <div class="app-card-info">
                  <div class="app-card-name">{{ apps.babylearn.name }}</div>
                  <div class="app-card-category">{{ apps.babylearn.category }}</div>
                </div>
              </div>

              <!-- Santé+ Card -->
              <div class="app-card" @click="selectApp('sante')">
                <div class="app-card-icon">
                  <img :src="getAssetPath('image-store/logo-santé+.webp')" alt="Santé+">
                </div>
                <div class="app-card-info">
                  <div class="app-card-name">{{ apps.sante.name }}</div>
                  <div class="app-card-category">{{ apps.sante.category }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- App Detail View -->
        <div v-else class="app-detail-view">
          <div class="detail-header">
            <button class="back-btn" @click="selectedApp = null">
              <i class="bi bi-arrow-left"></i>
            </button>
            <h1>{{ currentAppData.name }}</h1>
          </div>

          <div class="detail-body">
            <div class="detail-top-section">
              <div class="detail-icon-large">
                <img :src="getAssetPath(`image-store/${currentAppData.icon}`)" :alt="currentAppData.name">
              </div>
              <div class="detail-info-section">
                <h2>{{ currentAppData.name }}</h2>
                <p class="detail-category-text">{{ currentAppData.category }}</p>
                <a :href="currentAppData.appStoreLink" target="_blank" class="get-button-large">
                  <i class="bi bi-arrow-down-circle"></i>
                  Obtenir
                </a>
              </div>
            </div>

            <div class="detail-screenshots-section">
              <h3>Captures d'écran</h3>
              <div class="screenshots-container">
                <img 
                  v-for="(screenshot, index) in currentAppData.screenshots" 
                  :key="index"
                  :src="getAssetPath(`image-store/${screenshot}`)" 
                  :alt="`Screenshot ${index + 1}`"
                  class="screenshot-item"
                  @click="openScreenshot(index)"
                >
              </div>
            </div>

            <div class="detail-description-section">
              <h3>Description</h3>
              <p>{{ currentAppData.description }}</p>
            </div>

            <div class="detail-info-cards">
              <div class="info-card-item">
                <div class="info-label-text">Développeur</div>
                <div class="info-value-text">{{ currentAppData.developer }}</div>
              </div>
              <div class="info-card-item">
                <div class="info-label-text">Catégorie</div>
                <div class="info-value-text">{{ currentAppData.category }}</div>
              </div>
              <div class="info-card-item">
                <div class="info-label-text">Compatibilité</div>
                <div class="info-value-text">{{ currentAppData.compatibility }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Screenshot Lightbox -->
      <div v-if="lightboxImage" class="lightbox" @click="closeLightbox">
        <img :src="lightboxImage" alt="Screenshot" class="lightbox-image">
        <button class="lightbox-close" @click="closeLightbox">
          <i class="bi bi-x"></i>
        </button>
      </div>
    </div>
  </AppWindow>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  forceFocus?: number
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const { getAssetPath } = useAssetPath()

const selectedApp = ref<string | null>(null)
const lightboxImage = ref<string | null>(null)

const apps = {
  babylearn: {
    name: 'BabyLearn',
    category: 'Éducation',
    rating: 4.5,
    reviews: '1.2K',
    icon: 'logo-babylearn.webp',
    description: 'BabyLearn est une application éducative amusante conçue pour les enfants. Elle propose des leçons interactives, des défis amusants et des activités de tracé pour aider les enfants à apprendre à lire, écrire et compter tout en s\'amusant. Avec des personnages locaux, des visuels engageants et une interface adaptée aux enfants, BabyLearn transforme chaque expérience d\'apprentissage en une aventure joyeuse et enrichissante.',
    developer: 'Lamine Ishola',
    compatibility: 'iOS 13.0+',
    appStoreLink: 'https://apps.apple.com/us/app/babylearn-app/id6754986579',
    screenshots: ['bb-1.webp', 'bb-2.webp', 'bb-3.webp', 'bb-4.webp']
  },
  sante: {
    name: 'Santé+',
    category: 'Santé et Fitness',
    rating: 4.8,
    reviews: '856',
    icon: 'logo-santé+.webp',
    description: 'Trouvez rapidement les prix des médicaments, les pharmacies de garde et les médecins disponibles près de chez vous. Possibilité de réserver des consultations en ligne et de participer à des consultations à distance. Recherchez des centres d\'examen et sélectionnez des médicaments pour voir le total approximatif.',
    developer: 'Lamine Ishola',
    compatibility: 'iOS 12.0+',
    appStoreLink: 'https://apps.apple.com/us/app/sant%C3%A9/id6743252600',
    screenshots: ['s-1.webp', 's-2.webp', 's-3.webp', 's-4.webp', 's-5.webp']
  }
}

const currentAppData = computed(() => {
  if (!selectedApp.value) return null
  return apps[selectedApp.value as keyof typeof apps]
})

const selectApp = (appId: string) => {
  selectedApp.value = appId
}

const openScreenshot = (index: number) => {
  if (currentAppData.value) {
    lightboxImage.value = getAssetPath(`image-store/${currentAppData.value.screenshots[index]}`)
  }
}

const closeLightbox = () => {
  lightboxImage.value = null
}
</script>

<style scoped>
.appstore-content {
  display: flex;
  height: 100%;
  background: var(--bg-window-content);
  transition: background-color 0.3s ease;
}

/* Sidebar */
.appstore-sidebar {
  width: 240px;
  background: var(--bg-sidebar);
  border-right: 1px solid var(--border-color);
  padding: 20px 0;
  overflow-y: auto;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.sidebar-section {
  margin-bottom: 24px;
  padding: 0 12px;
}

.sidebar-label {
  font-size: 11px;
  font-weight: 200;
  color: var(--text-color-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 8px 12px;
  margin-bottom: 4px;
}

.sidebar-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  color: var(--text-color-secondary);
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
}

.sidebar-item:hover {
  background: var(--hover-bg);
}

.sidebar-item.active {
  background: rgba(0, 122, 255, 0.2);
  color: #007AFF;
}

.sidebar-item i {
  font-size: 16px;
  width: 20px;
  text-align: center;
}

/* Main Content */
.appstore-main {
  flex: 1;
  overflow-y: auto;
  background: var(--bg-window-content);
}

.featured-view {
  padding: 0;
}

.featured-header {
  padding: 30px 40px 20px;
}

.featured-header h1 {
  font-size: 40px;
  font-weight: 700;
  color: var(--text-color);
  margin: 0;
}

/* Hero Card */
.hero-card {
  margin: 0 40px 40px;
  background: var(--bg-sidebar);
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  cursor: pointer;
  transition: transform 0.2s;
  border: 1px solid var(--border-color);
  height: 400px;
}

.hero-card:hover {
  transform: translateY(-2px);
}

.hero-image {
  width: 280px;
  height: 100%;
  overflow: hidden;
  background: var(--bg-window);
  flex-shrink: 0;
  transition: background-color 0.3s ease;
}

.hero-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-content {
  flex: 1;
  padding: 50px 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: var(--text-color);
}

.hero-badge {
  font-size: 11px;
  font-weight: 200;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-bottom: 20px;
  color: var(--text-color-secondary);
}

.hero-content h2 {
  font-size: 52px;
  font-weight: 700;
  margin: 0 0 20px 0;
  line-height: 1.1;
  letter-spacing: -0.5px;
}

.hero-description {
  font-size: 22px;
  margin: 0 0 28px 0;
  color: var(--text-color);
  line-height: 1.5;
}

.hero-rating {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 17px;
  margin-bottom: 28px;
  color: var(--text-color-secondary);
}

.hero-rating .stars {
  display: flex;
  gap: 3px;
}

.hero-rating .stars .bi-star-fill {
  color: var(--text-color-secondary); opacity: 0.3;
  font-size: 17px;
}

.hero-rating .stars .bi-star-fill.filled {
  color: #ffc107;
}

.hero-get-button {
  padding: 14px 32px;
  background: #007AFF;
  border: none;
  border-radius: 22px;
  color: #ffffff;
  font-size: 17px;
  font-weight: 200;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  width: fit-content;
  transition: all 0.2s;
}

.hero-get-button:hover {
  background: #0056b3;
}

/* Apps Section */
.apps-section {
  padding: 0 40px 40px;
}

.section-title {
  font-size: 32px;
  font-weight: 700;
  color: var(--text-color);
  margin: 0 0 24px 0;
}

.apps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.app-card {
  background: var(--bg-sidebar);
  border-radius: 16px;
  padding: 20px;
  cursor: pointer;
  transition: transform 0.2s, background 0.2s;
  border: 1px solid var(--border-color);
  display: flex;
  gap: 16px;
  align-items: center;
}

.app-card:hover {
  transform: translateY(-2px);
  background: var(--hover-bg);
  transition: transform 0.2s, background-color 0.3s ease;
}

.app-card-icon {
  width: 80px;
  height: 80px;
  border-radius: 18px;
  overflow: hidden;
  background: #1a1a1a;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.app-card-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.app-card-info {
  flex: 1;
  min-width: 0;
}

.app-card-name {
  font-size: 20px;
  font-weight: 200;
  color: var(--text-color);
  margin-bottom: 6px;
  letter-spacing: -0.3px;
}

.app-card-category {
  font-size: 15px;
  color: var(--text-color-secondary);
  margin-bottom: 8px;
}

.app-card-rating {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #ffc107;
  font-size: 15px;
  font-weight: 500;
}

/* App Detail View */
.app-detail-view {
  padding: 0;
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 40px;
  background: var(--bg-sidebar);
  border-bottom: 1px solid var(--border-color);
}

.back-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: var(--hover-bg);
  border-radius: 8px;
  color: var(--text-color-secondary);
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.back-btn:hover {
  background: var(--hover-bg);
  color: var(--text-color);
}

.detail-header h1 {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-color);
  margin: 0;
}

.detail-body {
  padding: 40px;
}

.detail-top-section {
  display: flex;
  gap: 30px;
  margin-bottom: 50px;
  padding-bottom: 40px;
  border-bottom: 1px solid var(--border-color);
}

.detail-icon-large {
  width: 140px;
  height: 140px;
  border-radius: 28px;
  overflow: hidden;
  background: #1a1a1a;
  flex-shrink: 0;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.detail-icon-large img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.detail-info-section {
  flex: 1;
}

.detail-info-section h2 {
  font-size: 40px;
  font-weight: 700;
  color: var(--text-color);
  margin: 0 0 8px 0;
}

.detail-category-text {
  font-size: 20px;
  color: var(--text-color-secondary);
  margin: 0 0 20px 0;
}

.detail-rating-section {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 30px;
}

.stars-large {
  display: flex;
  gap: 4px;
  color: var(--text-color-secondary); opacity: 0.3;
}

.stars-large .bi-star-fill.filled {
  color: #ffc107;
  font-size: 20px;
}

.rating-text-large {
  font-size: 18px;
  color: var(--text-color-secondary);
}

.get-button-large {
  padding: 10px 32px;
  background: #007AFF;
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 14px;
  font-weight: 200;
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}

.get-button-large:hover {
  background: #0056b3;
}

.detail-screenshots-section {
  margin-bottom: 50px;
}

.detail-screenshots-section h3 {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-color);
  margin: 0 0 24px 0;
}

.screenshots-container {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  padding-bottom: 10px;
  scrollbar-width: thin;
}

.screenshots-container::-webkit-scrollbar {
  height: 8px;
}

.screenshots-container::-webkit-scrollbar-track {
  background: var(--hover-bg);
  border-radius: 4px;
}

.screenshots-container::-webkit-scrollbar-thumb {
  background: var(--hover-bg);
  border-radius: 4px;
}

.screenshot-item {
  width: 220px;
  aspect-ratio: 9/16;
  border-radius: 16px;
  object-fit: cover;
  cursor: pointer;
  transition: transform 0.2s;
  flex-shrink: 0;
  background: #1a1a1a;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.screenshot-item:hover {
  transform: scale(1.05);
}

.detail-description-section {
  margin-bottom: 50px;
}

.detail-description-section h3 {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-color);
  margin: 0 0 20px 0;
}

.detail-description-section p {
  font-size: 18px;
  line-height: 1.7;
  color: var(--text-color-secondary);
  margin: 0;
}

.detail-info-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
}

.info-card-item {
  background: var(--bg-sidebar);
  border-radius: 12px;
  padding: 24px;
  border: 1px solid var(--border-color);
}

.info-label-text {
  font-size: 13px;
  font-weight: 200;
  color: var(--text-color-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 10px;
}

.info-value-text {
  font-size: 17px;
  font-weight: 500;
  color: var(--text-color);
}

/* Lightbox */
.lightbox {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  cursor: pointer;
}

.lightbox-image {
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
  border-radius: 12px;
}

.lightbox-close {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 44px;
  height: 44px;
  border: none;
  background: var(--hover-bg);
  border-radius: 50%;
  color: var(--text-color);
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.lightbox-close:hover {
  background: var(--hover-bg);
}
</style>
