<template>
  <AppWindow 
    :title="'Keynote'"
    :is-open="isOpen"
    :force-focus="forceFocus"
    :initial-width="1000"
    :initial-height="700"
    @close="$emit('close')"
  >
    <div class="keynote-content">
      <!-- Zone principale -->
      <div class="keynote-main">
        <!-- Vue des présentations -->
        <div v-if="!currentPresentation" class="presentations-view">
          <div class="presentations-header">
            <h2>Présentations</h2>
          </div>
          <div class="presentations-grid">
            <div 
              v-for="presentation in presentations" 
              :key="presentation.id"
              class="presentation-card"
              @click="openPresentationDetail(presentation)"
            >
              <div class="presentation-thumbnail">
                <img :src="getAssetPath(`files/${presentation.thumbnail}`)" :alt="presentation.name">
              </div>
              <div class="presentation-info">
                <div class="presentation-name">{{ presentation.name }}</div>
                <div class="presentation-date">{{ presentation.date }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Vue de présentation -->
        <div v-else class="presentation-editor">
          <div class="editor-header">
            <div class="editor-title">{{ currentPresentation.name }}</div>
            <button class="close-editor" @click="closePresentation">
              <i class="bi bi-x"></i>
            </button>
          </div>
          <div class="editor-content">
            <!-- Afficher le PDF si disponible -->
            <div v-if="currentPresentation.pdfFile" class="pdf-viewer">
              <iframe 
                :src="`${getAssetPath('files/' + currentPresentation.pdfFile)}#toolbar=1&navpanes=1&scrollbar=1`" 
                class="pdf-iframe"
                frameborder="0"
              ></iframe>
            </div>
            <!-- Sinon afficher l'éditeur de slides -->
            <template v-else>
              <div class="slide-preview">
                <div class="slide">
                  <div class="slide-content">
                    <h1>{{ currentPresentation.title }}</h1>
                    <p>{{ currentPresentation.subtitle }}</p>
                  </div>
                </div>
              </div>
              <div class="slide-thumbnails">
                <div 
                  v-for="(slide, index) in currentPresentation.slides" 
                  :key="index"
                  class="slide-thumb"
                  :class="{ active: currentSlideIndex === index }"
                  @click="currentSlideIndex = index"
                >
                  <div class="thumb-number">{{ index + 1 }}</div>
                  <div class="thumb-content">{{ slide.title }}</div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </AppWindow>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Presentation {
  id: string
  name: string
  date: string
  thumbnail: string
  title?: string
  subtitle?: string
  slides?: Array<{ title: string }>
  pdfFile?: string
}


const props = defineProps<{
  forceFocus?: number
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const { getAssetPath } = useAssetPath()

const currentPresentation = ref<Presentation | null>(null)
const currentSlideIndex = ref(0)

const presentations = ref<Presentation[]>([
  {
    id: '1',
    name: 'Mon Portfolio App Mobile',
    date: 'Aujourd\'hui',
    thumbnail: 'keynot.png',
    title: 'Mon Portfolio',
    subtitle: 'Ishola Hasrafidine',
    slides: [
      { title: 'Portfolio' }
    ],
    pdfFile: 'Mon Portfolio App Mobile - Ishola Hasrafidine.pdf'
  }
])

const openPresentationDetail = (presentation: Presentation) => {
  currentPresentation.value = presentation
  currentSlideIndex.value = 0
}

const closePresentation = () => {
  currentPresentation.value = null
  currentSlideIndex.value = 0
}
</script>

<style scoped>
.keynote-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #1e1e1e;
}


/* Zone principale */
.keynote-main {
  flex: 1;
  overflow-y: auto;
  background: #1e1e1e;
}

/* Vue des présentations */
.presentations-view {
  padding: 30px;
}

.presentations-header {
  margin-bottom: 24px;
}

.presentations-header h2 {
  font-size: 24px;
  font-weight: 600;
  color: white;
  margin: 0;
}

.presentations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.presentation-card {
  background: #252525;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s;
}

.presentation-card:hover {
  background: #2d2d2d;
  transform: translateY(-2px);
}

.presentation-thumbnail {
  width: 100%;
  aspect-ratio: 16/9;
  background: #1a1a1a;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.presentation-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.presentation-info {
  padding: 12px;
}

.presentation-name {
  font-size: 14px;
  font-weight: 500;
  color: white;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.presentation-date {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
}


/* Éditeur de présentation */
.presentation-editor {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #1e1e1e;
}

.editor-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  background: #252525;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.editor-title {
  font-size: 15px;
  font-weight: 600;
  color: white;
}

.close-editor {
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.close-editor:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.editor-content {
  flex: 1;
  display: flex;
  gap: 20px;
  padding: 20px;
  overflow: hidden;
}

.slide-preview {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #252525;
  border-radius: 8px;
  padding: 40px;
}

.slide {
  width: 100%;
  max-width: 800px;
  aspect-ratio: 16/9;
  background: white;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.slide-content {
  text-align: center;
  padding: 40px;
}

.slide-content h1 {
  font-size: 48px;
  font-weight: 700;
  color: #1d1d1f;
  margin: 0 0 20px 0;
}

.slide-content p {
  font-size: 24px;
  color: #86868b;
  margin: 0;
}

.slide-thumbnails {
  width: 200px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
}

.slide-thumb {
  background: #252525;
  border-radius: 6px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid transparent;
}

.slide-thumb:hover {
  background: #2d2d2d;
}

.slide-thumb.active {
  background: rgba(0, 122, 255, 0.2);
  border-color: #007AFF;
}

.thumb-number {
  font-size: 11px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 6px;
}

.slide-thumb.active .thumb-number {
  color: #007AFF;
}

.thumb-content {
  font-size: 13px;
  color: white;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* PDF Viewer */
.pdf-viewer {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #252525;
  border-radius: 8px;
  overflow: hidden;
}

.pdf-iframe {
  width: 100%;
  height: 100%;
  min-height: 500px;
  background: white;
}
</style>
