import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
  // Default color object, corresponds to yellow-600 theme.
  const defaultColor = { primary: '#c67913', light: '#F0B100', hover: '#A65F00' }

  const getInitialColor = () => {
    const storedColor = localStorage.getItem('primaryColor')
    if (storedColor) {
      try {
        const parsed = JSON.parse(storedColor)
        // Check if it's a valid color object
        if (parsed && typeof parsed === 'object' && parsed.primary) {
          return parsed
        }
      } catch (e) {
        // It might be the old string format, ignore and use default
      }
    }
    return defaultColor
  }

  const primaryColor = ref(getInitialColor())
  const currency = ref(localStorage.getItem('currency') || '$')
  const language = ref(localStorage.getItem('language') || 'en')

  // This watcher persists the primary color choice to localStorage.
  watch(primaryColor, (newColor) => {
    localStorage.setItem('primaryColor', JSON.stringify(newColor))
  }, { deep: true })

  watch(currency, (newCurrency) => {
    localStorage.setItem('currency', newCurrency)
  })

  watch(language, (newLanguage) => {
    localStorage.setItem('language', newLanguage)
  })

  /**
   * Sets the primary color for the application.
   * It updates the state, saves to localStorage (via watcher),
   * and applies the color as a CSS variable to the root element.
   * @param {object} newColor - The object with primary, light, and hover hex values.
   */
  function setPrimaryColor(newColor) {
    if (newColor && typeof newColor === 'object' && newColor.primary) {
      primaryColor.value = newColor
      // This is the key part for reactivity. We set the CSS variable here.
      if (typeof document !== 'undefined') {
        document.documentElement.style.setProperty('--color-primary', newColor.primary)
        document.documentElement.style.setProperty('--color-light', newColor.light)
        document.documentElement.style.setProperty('--color-hover', newColor.hover)
      }
    }
  }

  function setCurrency(newCurrency) {
    currency.value = newCurrency
  }

  function setLanguage(newLanguage) {
    language.value = newLanguage
  }

  return {
    primaryColor,
    currency,
    language,
    setPrimaryColor,
    setCurrency,
    setLanguage
  }
})
