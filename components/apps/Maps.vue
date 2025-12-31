<template>
  <AppWindow 
    :title="'Plans'"
    :is-open="isOpen"
    :force-focus="forceFocus"
    @close="$emit('close')"
  >
    <div class="maps-content">
      <div class="maps-search">
        <input 
          type="text" 
          v-model="searchQuery"
          placeholder="Rechercher un lieu..."
          class="maps-search-input"
        >
        <button class="search-btn">
          <i class="bi bi-search"></i>
        </button>
      </div>
      <div class="maps-view">
        <div class="maps-placeholder">
          <img :src="getAssetPath('files/maps-2023-05-19.webp')" alt="Plans" class="maps-icon">
          <h2>Plans</h2>
          <p>Recherchez un lieu ou une adresse</p>
          <div v-if="searchQuery" class="search-results">
            <p>Recherche : {{ searchQuery }}</p>
            <button class="open-maps-btn" @click="openInGoogleMaps">
              Ouvrir dans Google Maps
            </button>
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
const searchQuery = ref('')

const openInGoogleMaps = () => {
  const query = encodeURIComponent(searchQuery.value)
  window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank')
}
</script>

<style scoped>
.maps-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.maps-search {
  display: flex;
  gap: 10px;
  padding: 15px;
  background: var(--bg-sidebar);
  border-bottom: 1px solid var(--border-color);
}

.maps-search-input {
  flex: 1;
  padding: 10px 15px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background: var(--hover-bg);
  transition: background-color 0.3s ease, border-color 0.3s ease;
  color: var(--text-color);
  font-size: 14px;
  outline: none;
}

.search-btn {
  background: #007aff;
  border: none;
  width: 40px;
  border-radius: 8px;
  color: #ffffff;
  cursor: pointer;
  transition: background 0.2s;
}

.search-btn:hover {
  background: #0056b3;
}

.maps-view {
  flex: 1;
  position: relative;
  background: var(--bg-window-content);
  transition: background-color 0.3s ease;
}

.maps-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--text-color-secondary);
  text-align: center;
  padding: 40px;
}

.maps-icon {
  width: 128px;
  height: 128px;
  margin-bottom: 20px;
  object-fit: contain;
}

.maps-placeholder h2 {
  margin: 0 0 10px 0;
  font-size: 32px;
  font-weight: 300;
  color: var(--text-color);
}

.search-results {
  margin-top: 30px;
}

.open-maps-btn {
  margin-top: 15px;
  padding: 10px 20px;
  background: #007aff;
  border: none;
  border-radius: 8px;
  color: #ffffff;
  cursor: pointer;
  font-size: 14px;
  font-weight: 200;
  transition: background 0.2s;
}

.open-maps-btn:hover {
  background: #0056b3;
}
</style>


