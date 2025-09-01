import { defineStore } from 'pinia'
import { ref } from 'vue'
import apiService from '@/services/api.js'
import { useLanguageStore } from '@/stores/language' // Import language store
import walpapperGreen from '@/assets/HomeIcon/Header/walpappergreen.png'
import heroCoverGreen from '@/assets/HomeIcon/Hero/HeroCoverGreen.png'
import walpapperRed from '@/assets/HomeIcon/Header/walpapperRed.png'
import heroCoverRed from '@/assets/HomeIcon/Hero/HeroCoverRed.png'


export const useSettingsStore = defineStore('settings', () => {
  // Default values
  const defaultColor = {}


  const primaryColor = ref(defaultColor)
  const currency = ref('$')
  const languageStore = useLanguageStore() // Get language store instance

  // Apply color to DOM
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
        header.style.setProperty(
          'background',
          `url("${color.headerWallpaper}") center/cover no-repeat`,
          'important'
        )
      } else {
        header.style.removeProperty('background')
      }
    }

    const hero = document.querySelector('.hero')
    if (hero) {
      hero.style.setProperty('--background-image', `url("${color.heroWallpaper}")`)
    }
  }

  // ========== Backend Integration ==========

  // جلب الإعدادات من API
  async function fetchSettings() {
  try {
    const res = await apiService.publicResources.settings()
    const data = res.data.data // الآن Object مش Array
  console.log('Primary color after fetch:', data)


    if (data) {
      setPrimaryColorByName(data.color_name)
      currency.value = data.currency || '$'
      if (data.language) {
        await languageStore.setLanguage(data.language) // Set language using language store
      }
    }

    applyColorToDOM(primaryColor.value)
  } catch (err) {
    console.error('Failed to fetch settings:', err)
  }
}


  // تحديث الإعدادات في API
  async function updateSettings() {
    try {
      await apiService.admin.settings.update({
        color_name: getColorNameByHex(primaryColor.value.primary),
        currency: currency.value,
        language_signal: languageStore.language // Get language from language store
      })
    } catch (err) {
      console.error('Failed to update settings:', err)
    }
  }

  // ========== Local mutations ==========

  function setPrimaryColor(newColor) {
    if (newColor && typeof newColor === 'object' && newColor.primary) {
      primaryColor.value = { ...primaryColor.value, ...newColor }
      applyColorToDOM(primaryColor.value)
      updateSettings() // مزامنة مع الباك أند
    }
  }

  function setCurrency(newCurrency) {
    currency.value = newCurrency
    updateSettings()
  }

  // ========== Helpers ==========

  // أسماء الألوان مثل ما تستعملها في SettingsPage
  const colorsMap = {
  Yellow: defaultColor,
  Green: {
    primary: '#16A34A',
    light: '#4ADE80',
    hover: '#15803D',
    headerWallpaper: walpapperGreen,
    heroWallpaper: heroCoverGreen
  },
  Red: {
    primary: '#DC2626',
    light: '#FCA5A5',
    hover: '#B91C1C',
    headerWallpaper: walpapperRed,
    heroWallpaper: heroCoverRed
  }
}


  function setPrimaryColorByName(name) {
    if (colorsMap[name]) {
      primaryColor.value = colorsMap[name]
      applyColorToDOM(primaryColor.value)
    }
  }

  function getColorNameByHex(hex) {
    const entry = Object.entries(colorsMap).find(
      ([, color]) => color.primary === hex
    )
    return entry ? entry[0] : 'Yellow'
  }

  // ========== Return ==========

  return {
    primaryColor,
    currency,
    setPrimaryColor,
    setCurrency,
    fetchSettings,
    updateSettings
  }
})