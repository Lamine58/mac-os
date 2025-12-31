<template>
  <AppWindow 
    :title="'Pages'"
    :is-open="isOpen"
    :force-focus="forceFocus"
    :initial-width="728"
    :initial-height="599"
    @close="$emit('close')"
  >
    <div class="pages-content">
      <div class="pages-welcome">
        <div class="pages-icon">
          <img :src="getAssetPath('files/pages-2021-11-15.webp')" alt="Pages">
        </div>
        <h1 class="pages-title">Bienvenue dans Pages</h1>
        <p class="pages-subtitle">Créez de magnifiques documents</p>

        <div class="pages-options">
          <div class="pages-option" @click="createNewDocument">
            <div class="option-icon">
              <i class="bi bi-file-earmark-plus"></i>
            </div>
            <div class="option-content">
              <h3 class="option-title">Nouveau document</h3>
              <p class="option-subtitle">Créez un document vierge</p>
            </div>
          </div>

          <div class="pages-option" @click="openTemplate">
            <div class="option-icon">
              <i class="bi bi-file-earmark-text"></i>
            </div>
            <div class="option-content">
              <h3 class="option-title">Choisir un modèle</h3>
              <p class="option-subtitle">Parcourez les modèles prédéfinis</p>
            </div>
          </div>

          <div class="pages-option" @click="openDocument">
            <div class="option-icon">
              <i class="bi bi-folder"></i>
            </div>
            <div class="option-content">
              <h3 class="option-title">Ouvrir un document</h3>
              <p class="option-subtitle">Ouvrir un document existant</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppWindow>
</template>

<script setup lang="ts">
const props = defineProps<{
  forceFocus?: number
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const { getAssetPath } = useAssetPath()

const createNewDocument = () => {
  console.log('Create new document')
}

const openTemplate = () => {
  console.log('Open template')
}

const openDocument = () => {
  console.log('Open document')
}
</script>

<style scoped>
.pages-content {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: var(--bg-window-content);
  padding: 40px;
}

.pages-welcome {
  max-width: 600px;
  width: 100%;
  text-align: center;
}

.pages-icon {
  width: 120px;
  height: 120px;
  margin: 0 auto 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pages-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.pages-title {
  font-size: 32px;
  font-weight: 600;
  color: var(--text-color);
  margin: 0 0 12px 0;
  letter-spacing: -0.5px;
  transition: color 0.3s ease;
}

.pages-subtitle {
  font-size: 18px;
  color: var(--text-color-secondary);
  margin: 0;
}

.pages-options {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
}

.pages-option {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  padding: 15px;
  background: var(--bg-sidebar);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.pages-option:hover {
  background: var(--hover-bg);
  border-color: var(--border-color);
  transform: translateY(-2px);
  transition: background-color 0.3s ease, transform 0.2s;
}

.option-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #FD9F24;
  border-radius: 10px;
  flex-shrink: 0;
}

.option-icon i {
  font-size: 24px;
  color: white;
}

.option-content {
  flex: 1;
}

.option-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-color);
  margin: 0 0 8px 0;
  transition: color 0.3s ease;
}

.option-subtitle {
  font-size: 14px;
  color: var(--text-color-secondary);
  margin: 0;
  line-height: 1.5;
}
</style>
