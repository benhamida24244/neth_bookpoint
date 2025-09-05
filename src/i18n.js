import { createI18n } from 'vue-i18n';
import en from './locales/en.json';
import fr from './locales/fr.json';
import ar from './locales/ar.json';

// Get initial language from localStorage or default to 'en'
const initialLocale = localStorage.getItem('language') || 'en';

const i18n = createI18n({
  legacy: false,
  locale: initialLocale, // set locale
  fallbackLocale: 'en', // set fallback locale
  messages: {
    en,
    fr,
    ar,
  },
});

export default i18n;
