// i18n.js
import { createI18n } from 'vue-i18n'

function getInitialLocale() {
  let locale = 'ar'; // Default locale
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const storedSettings = localStorage.getItem('settings');
      if (storedSettings) {
        locale = JSON.parse(storedSettings).language || 'ar';
      }
    } catch (e) {
      console.error("Failed to parse settings from localStorage for initial locale", e);
      // Fallback to default
      locale = 'ar';
    }
  }
  return locale;
}

const initialLocale = getInitialLocale();

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: initialLocale,
  fallbackLocale: 'en',
  // Messages are now loaded asynchronously
  messages: {}
})

export default i18n
