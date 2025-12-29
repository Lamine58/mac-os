<template>
  <div class="menu-bar">
    <span class="menu-item bold apple-logo" style="font-size:23px" @click="logout"></span>
    <span class="menu-item bold menu-left-item">Finder</span>
    <span class="menu-item menu-left-item">Fichier</span>
    <span class="menu-item menu-left-item">Édition</span>
    <span class="menu-item menu-left-item">Présentation</span>
    <span class="menu-item menu-left-item">Aller</span>
    <span class="menu-item menu-left-item">Fenêtre</span>
    <span class="menu-item menu-left-item">Aide</span>
    <div class="menu-right">
      <span class="menu-item"><i class="bi bi-play-circle left-icon float"></i></span>
      <span class="menu-item"><i style="font-size:23px" class="bi bi-battery-half left-icon"></i></span>
      <span class="menu-item"><i class="bi bi-wifi left-icon float" style="font-size: 20px;"></i></span>
      <span class="menu-item"><i class="bi bi-search left-icon float"></i></span>
      <span class="menu-item"><i class="bi bi-toggles left-icon float"></i></span>
      <span class="menu-item" id="dynamic-time" style="position: relative;top: -3px;">{{ currentTime }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const currentTime = ref('')

const logout = () => {
  navigateTo('/locked')
}

const updateTime = () => {
  const now = new Date()
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: false
  }
  const formattedDate = now.toLocaleString('fr-FR', options)
  currentTime.value = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)
}

// Mettre à jour immédiatement
updateTime()

onMounted(() => {
  // Mettre à jour toutes les minutes (60000ms)
  const intervalId = setInterval(updateTime, 60000)
  
  // Nettoyer l'intervalle lors du démontage
  onUnmounted(() => {
    clearInterval(intervalId)
  })
})
</script>

