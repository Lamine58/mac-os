import { ref, watch } from 'vue'

const dockSize = ref(100)
const dockAutoHide = ref(false)
const dockMagnification = ref(true)

// Charger depuis localStorage au démarrage
if (process.client) {
  const savedSize = localStorage.getItem('dockSize')
  const savedAutoHide = localStorage.getItem('dockAutoHide')
  const savedMagnification = localStorage.getItem('dockMagnification')
  
  if (savedSize) dockSize.value = parseInt(savedSize)
  if (savedAutoHide) dockAutoHide.value = savedAutoHide === 'true'
  if (savedMagnification) dockMagnification.value = savedMagnification === 'true'
}

// Sauvegarder dans localStorage quand les valeurs changent
watch(dockSize, (newValue) => {
  if (process.client) {
    localStorage.setItem('dockSize', newValue.toString())
  }
})

watch(dockAutoHide, (newValue) => {
  if (process.client) {
    localStorage.setItem('dockAutoHide', newValue.toString())
  }
})

watch(dockMagnification, (newValue) => {
  if (process.client) {
    localStorage.setItem('dockMagnification', newValue.toString())
  }
})

export function useDockSettings() {
  return {
    dockSize,
    dockAutoHide,
    dockMagnification
  }
}


