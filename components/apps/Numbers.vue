<template>
  <AppWindow 
    :title="'Numbers'"
    :is-open="isOpen"
    :force-focus="forceFocus"
    :initial-width="1000"
    :initial-height="700"
    @close="$emit('close')"
  >
    <div class="numbers-content">
      <div class="numbers-welcome">
        <div class="numbers-icon">
          <img :src="getAssetPath('files/numbers-2021-11-15.webp')" alt="Numbers">
        </div>
        <h1 class="numbers-title">Bienvenue dans Numbers</h1>
        <p class="numbers-subtitle">Créez de magnifiques feuilles de calcul</p>

        <div class="numbers-options">
          <div class="numbers-option" @click="createNewSpreadsheet">
            <div class="option-icon">
              <i class="bi bi-table"></i>
            </div>
            <div class="option-content">
              <h3 class="option-title">Nouvelle feuille de calcul</h3>
              <p class="option-subtitle">Créez une feuille de calcul vierge</p>
            </div>
          </div>

          <div class="numbers-option" @click="openTemplate">
            <div class="option-icon">
              <i class="bi bi-file-earmark-spreadsheet"></i>
            </div>
            <div class="option-content">
              <h3 class="option-title">Choisir un modèle</h3>
              <p class="option-subtitle">Parcourez les modèles prédéfinis</p>
            </div>
          </div>

          <div class="numbers-option" @click="openSpreadsheet">
            <div class="option-icon">
              <i class="bi bi-folder"></i>
            </div>
            <div class="option-content">
              <h3 class="option-title">Ouvrir une feuille de calcul</h3>
              <p class="option-subtitle">Ouvrir une feuille de calcul existante</p>
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

const createNewSpreadsheet = () => {
  console.log('Create new spreadsheet')
}

const openTemplate = () => {
  console.log('Open template')
}

const openSpreadsheet = () => {
  console.log('Open spreadsheet')
}
</script>

<style scoped>
.numbers-content {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: #1e1e1e;
  padding: 40px;
}

.numbers-welcome {
  max-width: 600px;
  width: 100%;
  text-align: center;
}

.numbers-icon {
  width: 120px;
  height: 120px;
  margin: 0 auto 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.numbers-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.numbers-title {
  font-size: 42px;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 12px 0;
  letter-spacing: -0.5px;
}

.numbers-subtitle {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 50px 0;
}

.numbers-options {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 40px;
}

.numbers-option {
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

.numbers-option:hover {
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
