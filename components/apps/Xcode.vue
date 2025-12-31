<template>
  <AppWindow 
    :title="'Xcode'"
    :is-open="isOpen"
    :force-focus="forceFocus"
    :initial-width="728"
    :initial-height="599"
    @close="$emit('close')"
  >
    <div class="xcode-content">
      <div class="xcode-welcome">
        <div class="xcode-icon">
          <img :src="getAssetPath('files/xcode-2025-09-18.webp')" alt="Xcode">
        </div>
        <h1 class="xcode-title">Welcome to Xcode</h1>
        <p class="xcode-version">Version 12.5 (12E262)</p>

        <div class="xcode-options">
          <div class="xcode-option" @click="createNewProject">
            <div class="option-icon">
              <i class="bi bi-plus-square"></i>
            </div>
            <div class="option-content">
              <h3 class="option-title">Create a new Xcode project</h3>
              <p class="option-subtitle">Create an app for iPhone, iPad, Mac, Apple Watch, or Apple TV.</p>
            </div>
          </div>

          <div class="xcode-option" @click="cloneProject">
            <div class="option-icon">
              <i class="bi bi-files"></i>
            </div>
            <div class="option-content">
              <h3 class="option-title">Clone an existing project</h3>
              <p class="option-subtitle">Start working on something from a Git repository.</p>
            </div>
          </div>

          <div class="xcode-option" @click="openProject">
            <div class="option-icon">
              <i class="bi bi-folder"></i>
            </div>
            <div class="option-content">
              <h3 class="option-title">Open a project or file</h3>
              <p class="option-subtitle">Open an existing project or file on your Mac.</p>
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

const createNewProject = () => {
  // TODO: Implémenter la création de projet
  console.log('Create new project')
}

const cloneProject = () => {
  // TODO: Implémenter le clonage de projet
  console.log('Clone project')
}

const openProject = () => {
  // TODO: Implémenter l'ouverture de projet
  console.log('Open project')
}
</script>

<style scoped>
.xcode-content {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: var(--bg-window-content);
  padding: 40px;
}

.xcode-welcome {
  max-width: 600px;
  width: 100%;
  text-align: center;
}

.xcode-icon {
  width: 120px;
  height: 120px;
  margin: 0 auto 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.xcode-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.xcode-title {
  font-size: 32px;
  font-weight: 600;
  color: var(--text-color);
  margin: 0 0 12px 0;
  letter-spacing: -0.5px;
  transition: color 0.3s ease;
}

.xcode-version {
  font-size: 16px;
  color: var(--text-color-secondary);
  margin: 0;
}

.xcode-options {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
}

.xcode-option {
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

.xcode-option:hover {
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
  background: #007AFF;
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
