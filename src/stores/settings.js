import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import apiService from '@/services/api';
import { useToast } from 'vue-toastification';
import i18n from '@/i18n';

// Import images
import walpapper from '@/assets/HomeIcon/Header/walpapper.png';
import walpappergreen from '@/assets/HomeIcon/Header/walpappergreen.png';
import walpapperRed from '@/assets/HomeIcon/Header/walpapperRed.png';
import HeroCover from '@/assets/HomeIcon/Hero/HeroCover.png';
import HeroCoverGreen from '@/assets/HomeIcon/Hero/HeroCoverGreen.png';
import HeroCoverRed from '@/assets/HomeIcon/Hero/HeroCoverRed.png';

const primaryColors = [
  { name: 'Yellow', hex: { primary: '#c67913', light: '#F0B100', hover: '#A65F00', headerWallpaper: walpapper, heroWallpaper: HeroCover }},
  { name: 'Green', hex: { primary: '#16A34A', light: '#4ADE80', hover: '#15803D', headerWallpaper: walpappergreen, heroWallpaper: HeroCoverGreen }},
  { name: 'Red', hex: { primary: '#DC2626', light: '#FCA5A5', hover: '#B91C1C', headerWallpaper: walpapperRed, heroWallpaper: HeroCoverRed }}
];

// Helper to get settings from localStorage safely
function getStoredSettings() {
  try {
    const settings = localStorage.getItem('settings');
    return settings ? JSON.parse(settings) : {};
  } catch (e) {
    console.error("Failed to parse settings from localStorage", e);
    return {};
  }
}

// Helper to save settings to localStorage
function storeSettings(settings) {
  try {
    localStorage.setItem('settings', JSON.stringify(settings));
  } catch (e) {
    console.error("Failed to save settings to localStorage", e);
  }
}

export const useSettingsStore = defineStore('settings', () => {
  const toast = useToast();
  const storedSettings = getStoredSettings();

  const colorName = ref(storedSettings.color_name || 'Yellow');
  const language = ref(storedSettings.language || 'en');

  const selectedColor = primaryColors.find(c => c.name.toLowerCase() === colorName.value.toLowerCase()) || primaryColors[0];
  const primaryColor = ref(selectedColor.hex);

  const currency = ref('$'); // Currency is not part of the localStorage settings for now
  const loading = ref(false);

  function applyColorToDOM(color) {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    if (color.primary) {
      root.style.setProperty('--color-primary', color.primary);
      root.style.setProperty('--color-light', color.light || '');
      root.style.setProperty('--color-hover', color.hover || '');
    }
     const header = document.getElementById('header');
    if (header) {
      if (color.headerWallpaper) {
        header.style.setProperty('background', `url("${color.headerWallpaper}") center/cover no-repeat`, 'important');
      } else {
        header.style.removeProperty('background');
      }
    }
    const hero = document.querySelector('.hero');
    if (hero) {
      hero.style.setProperty('--background-image', `url("${color.heroWallpaper}")`);
    }
  }

  watch(primaryColor, (newColor) => {
    applyColorToDOM(newColor);
  }, { deep: true, immediate: true });

  function applyLanguage(lang) {
    i18n.global.locale.value = lang;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }

  watch(language, (newLang) => {
      applyLanguage(newLang);
  }, { immediate: true });


  async function fetchSettings() {
    loading.value = true;
    try {
      const response = await apiService.publicResources.settings();
      const serverSettings = response.data.data;
      if (serverSettings) {
        // Update state and localStorage from server data
        if (serverSettings.color_name) {
            colorName.value = serverSettings.color_name;
            const colorObject = primaryColors.find(c => c.name.toLowerCase() === serverSettings.color_name.toLowerCase());
            if (colorObject) primaryColor.value = colorObject.hex;
        }
        if (serverSettings.language_signal) {
            language.value = serverSettings.language_signal;
        }
        if (serverSettings.currency) {
            currency.value = serverSettings.currency;
        }
        // Update localStorage with fresh data from server
        storeSettings({
            color_name: colorName.value,
            language: language.value
        });
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      // Don't toast here, as it might be annoying on initial load failure
    } finally {
      loading.value = false;
    }
  }

  async function updateSettingOnServer(key, value) {
    try {
      await apiService.admin.settings.update({ [key]: value });
      toast.success(`${key.replace('_', ' ')} updated successfully!`);
    } catch (error) {
      console.error(`Failed to update ${key}:`, error);
      toast.error(`Failed to update ${key}.`);
      throw error; // Re-throw to allow components to handle it
    }
  }

  async function setPrimaryColor(newColorName) {
    const colorObject = primaryColors.find(c => c.name.toLowerCase() === newColorName.toLowerCase());
    if (colorObject) {
      primaryColor.value = colorObject.hex;
      colorName.value = newColorName;

      const currentSettings = getStoredSettings();
      storeSettings({ ...currentSettings, color_name: newColorName });

      await updateSettingOnServer('color_name', newColorName);
    }
  }

  async function setCurrency(newCurrency) {
    currency.value = newCurrency;
    await updateSettingOnServer('currency', newCurrency);
  }

  async function setLanguage(newLanguage) {
    language.value = newLanguage;

    const currentSettings = getStoredSettings();
    storeSettings({ ...currentSettings, language: newLanguage });

    await updateSettingOnServer('language_signal', newLanguage);
  }

  return {
    primaryColor,
    currency,
    language,
    loading,
    primaryColors,
    applyLanguage,
    setPrimaryColor,
    setCurrency,
    setLanguage,
    fetchSettings
  };
});
