export const useAssetPath = () => {
  // Récupérer le baseURL depuis la config Nuxt
  const config = useRuntimeConfig()
  const baseURL = config.public.baseURL || '/mac-os/'
  
  const getAssetPath = (path: string) => {
    // Si le chemin commence déjà par http ou https, le retourner tel quel
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path
    }
    
    // Enlever le slash initial si présent
    const cleanPath = path.startsWith('/') ? path.slice(1) : path
    
    // Ajouter le baseURL (en s'assurant qu'il se termine par /)
    const base = baseURL.endsWith('/') ? baseURL : `${baseURL}/`
    
    // Retourner le chemin complet
    return `${base}${cleanPath}`
  }
  
  return {
    getAssetPath
  }
}

