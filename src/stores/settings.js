// src/stores/settings.js
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import walpapper from '@/assets/HomeIcon/Header/walpapper.png'
import HeroCover from '@/assets/HomeIcon/Hero/HeroCover.png'

export const useSettingsStore = defineStore('settings', () => {
  // Default (headerWallpaper يمكن أن يبقى فارغاً حتى يمرر المكون مسار الصورة)
  const defaultColor = {
   primary: '#c67913',
    light: '#F0B100',
    hover: '#A65F00',
    headerWallpaper: walpapper,
    heroWallpaper: HeroCover // سيُستبدل بصيغة URL عند الضغط من SettingsPage
  }

  const getInitialColor = () => {
    const stored = localStorage.getItem('primaryColor')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (parsed && typeof parsed === 'object' && parsed.primary) return parsed
      } catch (e) {
        // فشل التحليل -> استخدم الافتراضي
      }
    }
    return defaultColor
  }

  const primaryColor = ref(getInitialColor())
  const currency = ref(localStorage.getItem('currency') || '$')
  const language = ref(localStorage.getItem('language') || 'en')

  // دالة مساعدة تطبّق اللون والخلفية على DOM
  function applyColorToDOM(color) {
    if (typeof document === 'undefined') return

    const root = document.documentElement
    if (color.primary) {
      root.style.setProperty('--color-primary', color.primary)
      root.style.setProperty('--color-light', color.light || '')
      root.style.setProperty('--color-hover', color.hover || '')
    }

    const header = document.getElementById('header')
    if (header) {
      if (color.headerWallpaper) {
        // نستخدم background shorthand مع important لتجاوز أي قاعدة CSS خارجية

        header.style.setProperty(
          'background',
          `url("${color.headerWallpaper}") center/cover no-repeat`,
          'important'
        )
      } else {
        // لو لا يوجد wallpaper نزيل الخلفية
        header.style.removeProperty('background')
      }
    }
    const hero = document.querySelector('.hero')
    if (hero) {
      hero.style.setProperty('--background-image', `url("${color.heroWallpaper}")`)
    }
  }

  // طبق الإعداد المحفوظ فور إنشاء الـ store
  applyColorToDOM(primaryColor.value)

  // احفظ أي تغيير في localStorage وطبق التغييرات على DOM
  watch(primaryColor, (newColor) => {
    localStorage.setItem('primaryColor', JSON.stringify(newColor))
    applyColorToDOM(newColor)
  }, { deep: true })

  watch(currency, (val) => localStorage.setItem('currency', val))
  watch(language, (val) => localStorage.setItem('language', val))

  function setPrimaryColor(newColor) {
    if (newColor && typeof newColor === 'object' && newColor.primary) {
      // ندمج لضمان عدم فقدان خصائص أخرى (مثل headerWallpaper)
      primaryColor.value = { ...primaryColor.value, ...newColor }
      // applyColorToDOM سيُنفّذ عبر الـ watcher أعلاه
    }
  }

  function setCurrency(newCurrency) { currency.value = newCurrency }
  function setLanguage(newLanguage) { language.value = newLanguage }

  return {
    primaryColor,
    currency,
    language,
    setPrimaryColor,
    setCurrency,
    setLanguage
  }
})
