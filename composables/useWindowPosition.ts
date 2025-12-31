// Composable pour gérer le positionnement des fenêtres et éviter les superpositions

const windowOffset = 100 // Décalage horizontal entre chaque fenêtre (en pixels) - augmenté pour plus de visibilité
const windowOffsetY = 80 // Décalage vertical entre chaque fenêtre (en pixels) - augmenté pour plus de visibilité
const baseX = 150
const baseY = 100
const windowWidth = 900 // Largeur maximale pour le Finder
const windowHeight = 700 // Hauteur maximale pour le Finder

// Suivre les fenêtres ouvertes avec leur position
const openWindows = new Map<string, { x: number; y: number }>()

export const useWindowPosition = () => {
  // Obtenir une position décalée pour une nouvelle fenêtre
  const getNextPosition = (windowId: string, forceNew: boolean = false): { x: number; y: number } => {
    // Si la fenêtre existe déjà et qu'on ne force pas une nouvelle position, retourner sa position actuelle
    if (!forceNew && openWindows.has(windowId)) {
      return openWindows.get(windowId)!
    }

    // Calculer la position pour la nouvelle fenêtre
    // Basé sur le nombre de fenêtres déjà ouvertes
    const windowCount = openWindows.size
    let x = baseX + (windowCount * windowOffset)
    let y = baseY + (windowCount * windowOffsetY)

    // Vérifier que la fenêtre ne dépasse pas l'écran
    const maxX = typeof window !== 'undefined' ? window.innerWidth - windowWidth - 20 : 1920 - windowWidth - 20
    const maxY = typeof window !== 'undefined' ? window.innerHeight - windowHeight - 20 : 1080 - windowHeight - 20

    // Si on dépasse, revenir au début avec un décalage vertical
    if (x > maxX) {
      const row = Math.floor(windowCount / 5) // 5 fenêtres par ligne
      x = baseX + ((windowCount % 5) * windowOffset)
      y = baseY + (row * windowOffsetY)
    }

    x = Math.max(20, Math.min(x, maxX))
    y = Math.max(20, Math.min(y, maxY))

    const position = { x, y }
    
    // Enregistrer la position de cette fenêtre
    openWindows.set(windowId, position)

    return position
  }

  // Retirer une fenêtre de la liste quand elle se ferme
  const removeWindow = (windowId: string) => {
    openWindows.delete(windowId)
  }

  // Réinitialiser les positions
  const reset = () => {
    openWindows.clear()
  }

  return {
    getNextPosition,
    removeWindow,
    reset
  }
}

