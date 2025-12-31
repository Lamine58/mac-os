// Compteur global partagé entre toutes les instances
let zIndexCounter = 5000
const maxZIndex = 10000

export const useWindowFocus = () => {
  const getNextZIndex = () => {
    zIndexCounter++
    if (zIndexCounter > maxZIndex) {
      zIndexCounter = 5000
    }
    console.log(`[useWindowFocus] New z-index: ${zIndexCounter}`)
    return zIndexCounter
  }

  // Fonction pour obtenir un z-index bas (pour le Finder)
  const getLowZIndex = () => {
    return 4000
  }

  return {
    getNextZIndex,
    getLowZIndex
  }
}


