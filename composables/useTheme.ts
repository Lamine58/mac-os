import { ref, watch } from 'vue'

export type ThemeMode = 'light' | 'dark' | 'auto'

const STORAGE_KEY = 'macos-theme-mode'

// Fonction pour déterminer si on est en dark mode
const isDarkMode = (mode: ThemeMode): boolean => {
  if (mode === 'auto') {
    // Vérifier la préférence système
    if (process.client && typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return true // Par défaut dark si on ne peut pas détecter
  }
  return mode === 'dark'
}

// Par défaut: dark
const getInitialTheme = (): ThemeMode => {
  if (!process.client) return 'dark'
  const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null
  return stored || 'dark'
}

const themeMode = ref<ThemeMode>(getInitialTheme())
const isDark = ref<boolean>(isDarkMode(themeMode.value))

// Appliquer le thème au document
const applyTheme = (dark: boolean) => {
  if (!process.client || typeof document === 'undefined') return
  
  if (dark) {
    document.documentElement.classList.add('theme-dark')
    document.documentElement.classList.remove('theme-light')
  } else {
    document.documentElement.classList.add('theme-light')
    document.documentElement.classList.remove('theme-dark')
  }
}

// Initialiser le thème au chargement
if (process.client) {
  applyTheme(isDark.value)
  
  // Écouter les changements de préférence système pour le mode auto
  if (themeMode.value === 'auto') {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      if (themeMode.value === 'auto') {
        isDark.value = e.matches
        applyTheme(e.matches)
      }
    }
    
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange)
    } else {
      mediaQuery.addListener(handleChange)
    }
  }
}

// Sauvegarder dans localStorage quand les valeurs changent
watch(themeMode, (newMode) => {
  if (process.client) {
    localStorage.setItem(STORAGE_KEY, newMode)
    isDark.value = isDarkMode(newMode)
    applyTheme(isDark.value)
    
    // Réinitialiser l'écoute si on passe en mode auto
    if (newMode === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = (e: MediaQueryListEvent) => {
        if (themeMode.value === 'auto') {
          isDark.value = e.matches
          applyTheme(e.matches)
        }
      }
      
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange)
      } else {
        mediaQuery.addListener(handleChange)
      }
    }
  }
})

export const useTheme = () => {
  const setTheme = (mode: ThemeMode) => {
    themeMode.value = mode
  }

  return {
    themeMode,
    isDark,
    setTheme
  }
}

