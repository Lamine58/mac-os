<template>
  <AppWindow 
    :title="'Numbers'"
    :is-open="isOpen"
    :force-focus="forceFocus"
    :initial-width="728"
    :initial-height="599"
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
  background: var(--bg-window-content);
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
  margin: 0 auto 10px;
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
  font-size: 32px;
  font-weight: 600;
  color: var(--text-color);
  margin: 0 0 12px 0;
  letter-spacing: -0.5px;
  transition: color 0.3s ease;
}

.numbers-subtitle {
  font-size: 18px;
  color: var(--text-color-secondary);
  margin: 0;
}

.numbers-options {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
}

.numbers-option {
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

.numbers-option:hover {
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
  background: #20c81c;
  border-radius: 10px;
  flex-shrink: 0;
}

.option-icon i {
  font-size: 24px;
  color: #ffffff;
  transition: color 0.3s ease;
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
