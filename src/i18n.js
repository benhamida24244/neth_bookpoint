// i18n.js
import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import fr from './locales/fr.json'
import ar from './locales/ar.json'

let initialLocale = 'ar'
if (typeof window !== 'undefined' && window.localStorage) {
  initialLocale = localStorage.getItem('language') || 'ar'
}

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: initialLocale,
  fallbackLocale: 'en',
  messages: { en, fr, ar }
})

export default i18n
