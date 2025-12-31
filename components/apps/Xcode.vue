<template>
  <AppWindow 
    :title="'Xcode'"
    :is-open="isOpen"
    :force-focus="forceFocus"
    :initial-width="900"
    :initial-height="700"
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
  background: #1e1e1e;
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
  margin: 0 auto 30px;
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
  font-size: 42px;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 12px 0;
  letter-spacing: -0.5px;
}

.xcode-version {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 50px 0;
}

.xcode-options {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 40px;
}

.xcode-option {
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

.xcode-option:hover {
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
