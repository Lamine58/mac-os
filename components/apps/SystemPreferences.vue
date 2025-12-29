<template>
  <AppWindow 
    :title="'Préférences Système'"
    :is-open="isOpen"
    @close="$emit('close')"
  >
    <div class="app-simple">
      <div class="app-icon">
        <img :src="getAssetPath('files/system-preferences-2021-06-03.webp')" alt="Préférences Système">
      </div>
      <div class="app-name">Préférences Système</div>
    </div>
  </AppWindow>
</template>

<script setup lang="ts">
const props = defineProps<{
  isOpen: boolean
}>()


const emit = defineEmits<{

const { getAssetPath } = useAssetPath()
  close: []
}>()

</script>

<style scoped>
.app-simple {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: #1e1e1e;
  gap: 20px;
}

.app-icon {
  width: 128px;
  height: 128px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.app-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.app-name {
  font-size: 18px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
}
</style>
