import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
  const theme = ref(localStorage.getItem('theme') || 'light')
  const currency = ref(localStorage.getItem('currency') || '$')
  const language = ref(localStorage.getItem('language') || 'en')

  watch(theme, (newTheme) => {
    localStorage.setItem('theme', newTheme)
  })

  watch(currency, (newCurrency) => {
    localStorage.setItem('currency', newCurrency)
  })

  watch(language, (newLanguage) => {
    localStorage.setItem('language', newLanguage)
  })

  function setTheme(newTheme) {
    theme.value = newTheme
  }

  function setCurrency(newCurrency) {
    currency.value = newCurrency
  }

  function setLanguage(newLanguage) {
    language.value = newLanguage
  }

  return {
    theme,
    currency,
    language,
    setTheme,
    setCurrency,
    setLanguage
  }
})
