import { defineStore } from 'pinia'

export const useLanguageStore = defineStore('language', {
  state: () => ({
    // Get the language from localStorage or default to 'en'
    language: localStorage.getItem('language') || 'en',
    translations: {},
  }),
  actions: {
    // Action to change the language
    async setLanguage(lang) {
      this.language = lang
      localStorage.setItem('language', lang)
      await this.loadTranslations()
    },
    // Action to load translations from a JSON file
    async loadTranslations() {
      try {
        const langModule = await import(`../locales/${this.language}.json`)
        this.translations = langModule.default
      } catch (error) {
        console.error('Failed to load translations:', error)
        // Fallback to English if the selected language file is not found
        const langModule = await import(`../locales/en.json`)
        this.translations = langModule.default
      }
    },
  },
})
