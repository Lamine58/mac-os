<template>
  <AppWindow 
    :title="'Plans'"
    :is-open="isOpen"
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
          <i class="bi bi-geo-alt" style="font-size: 64px; color: #007aff; margin-bottom: 20px;"></i>
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
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

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
  background: #252525;
  border-bottom: 1px solid #333;
}

.maps-search-input {
  flex: 1;
  padding: 10px 15px;
  border-radius: 8px;
  border: 1px solid #555;
  background: #3e3e3e;
  color: white;
  font-size: 14px;
  outline: none;
}

.search-btn {
  background: #007aff;
  border: none;
  width: 40px;
  border-radius: 8px;
  color: white;
  cursor: pointer;
}

.maps-view {
  flex: 1;
  position: relative;
  background: #1a1a1a;
}

.maps-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
  padding: 40px;
}

.maps-placeholder h2 {
  margin: 0 0 10px 0;
  font-size: 32px;
  font-weight: 300;
  color: white;
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
  color: white;
  cursor: pointer;
  font-size: 14px;
}
</style>

