export const useWindowFocus = () => {
  let zIndexCounter = 5000
  const maxZIndex = 10000

  const getNextZIndex = () => {
    zIndexCounter++
    if (zIndexCounter > maxZIndex) {
      zIndexCounter = 5000
    }
    return zIndexCounter
  }

  return {
    getNextZIndex
  }
}

