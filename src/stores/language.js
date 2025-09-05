import { defineStore } from 'pinia';
import apiService from '../services/api';
import i18n from '../i18n'; // Import i18n instance

export const useLanguageStore = defineStore('language', {
  state: () => ({
    language: localStorage.getItem('language') || 'en',
    translations: {},
  }),
  actions: {
    async setLanguage(lang) {
      this.language = lang;
      localStorage.setItem('language', lang);
      i18n.global.locale.value = lang; // Update i18n locale
      await this.loadTranslations();
      try {
        // Assuming the user is an admin to update settings
        await apiService.admin.settings.update({ language: lang });
      } catch (error) {
        console.error('Failed to save language to DB:', error);
      }
    },
    async loadTranslations() {
      try {
        const langModule = await import(`../locales/${this.language}.json`);
        this.translations = langModule.default;
      } catch (error) {
        console.error('Failed to load translations:', error);
        const langModule = await import(`../locales/en.json`);
        this.translations = langModule.default;
      }
    },
    async fetchLanguage() {
      try {
        const response = await apiService.publicResources.settings();
        const dbLang = response.data.language; // Adjust based on your API response
        if (dbLang && dbLang !== this.language) {
          this.setLanguage(dbLang);
        }
      } catch (error) {
        console.error('Failed to fetch language from DB:', error);
      }
    },
    // Initialize language from localStorage and then fetch from server
    async initializeLanguage() {
      const savedLang = localStorage.getItem('language');
      if (savedLang) {
        this.language = savedLang;
        i18n.global.locale.value = savedLang;
      }
      await this.loadTranslations();
      await this.fetchLanguage();
    },
  },
});
