import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import fr from './locales/fr.json'
import ar from './locales/ar.json'

// تعيين اللغة الافتراضية مع حماية من غياب window/localStorage
let initialLocale = 'ar'
if (typeof window !== 'undefined' && window.localStorage) {
  initialLocale = localStorage.getItem('language') || 'ar'
}

const i18n = createI18n({
  legacy: false,
  globalInjection: true,   // مهم حتى يشتغل $t في كل الصفحات
  locale: initialLocale,
  fallbackLocale: 'en',
  messages: { en, fr, ar },
})

export default i18n
