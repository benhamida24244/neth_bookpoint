import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
  // Renamed 'theme' to 'primaryColor' for clarity and set a default hex value.
  const primaryColor = ref(localStorage.getItem('primaryColor') || '#D97706') // Default to yellow-600
  const currency = ref(localStorage.getItem('currency') || '$')
  const language = ref(localStorage.getItem('language') || 'en')

  // This watcher persists the primary color choice to localStorage.
  watch(primaryColor, (newColor) => {
    localStorage.setItem('primaryColor', newColor)
  })

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
   * @param {string} newColor - The hex value of the new primary color.
   */
  function setPrimaryColor(newColor) {
    primaryColor.value = newColor
    // This is the key part for reactivity. We set the CSS variable here.
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--color-primary', newColor)
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
