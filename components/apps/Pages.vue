<template>
  <AppWindow 
    :title="'Pages'"
    :is-open="isOpen"
    :force-focus="forceFocus"
    :initial-width="1000"
    :initial-height="700"
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
  background: #1e1e1e;
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
  margin: 0 auto 30px;
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
  font-size: 42px;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 12px 0;
  letter-spacing: -0.5px;
}

.pages-subtitle {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 50px 0;
}

.pages-options {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 40px;
}

.pages-option {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  padding: 24px;
  background: #252525;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.pages-option:hover {
  background: #2d2d2d;
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.option-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #007AFF;
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
  color: #ffffff;
  margin: 0 0 8px 0;
}

.option-subtitle {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  line-height: 1.5;
}
</style>
