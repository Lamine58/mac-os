<template>
  <AppWindow 
    :title="'iPhone 16 Pro de Lamine'"
    :is-open="isOpen"
    :force-focus="forceFocus"
    :hide-maximize="true"
    :initial-width="328"
    :initial-height="662"
    :min-width="328"
    :min-height="662"
    @close="$emit('close')"
  >
    <div class="home-content">
      <img :src="getAssetPath('files/app-home.png')" alt="Accueil" class="home-image">
    </div>
  </AppWindow>
</template>

<script setup lang="ts">
const props = defineProps<{
  isOpen: boolean
  forceFocus?: number
}>()

const emit = defineEmits<{
  close: []
}>()

const { getAssetPath } = useAssetPath()
</script>

<style scoped>
.home-content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
  overflow: hidden;
  padding: 20px;
}

.home-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  border-radius: 40px;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.8);
}
</style>

