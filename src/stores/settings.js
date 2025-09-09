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

export const useSettingsStore = defineStore('settings', () => {
  const toast = useToast();
  const primaryColor = ref(primaryColors[0].hex); // Default color
  const currency = ref('$');
  const language = ref('en');
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
  }, { deep: true });

  function applyLanguage(lang) {
    i18n.global.locale.value = lang;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }

  async function fetchSettings() {
    loading.value = true;
    try {
      const response = await apiService.publicResources.settings();
      const settings = response.data.data;
      if (settings) {
        if (settings.color_name) {
            const colorObject = primaryColors.find(c => c.name.toLowerCase() === settings.color_name.toLowerCase());
            if (colorObject) {
                primaryColor.value = colorObject.hex;
            }
        }
        if (settings.currency) {
            currency.value = settings.currency;
        }
        if (settings.language_signal) {
            language.value = settings.language_signal;
            applyLanguage(settings.language_signal);
        }
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      toast.error('Failed to load settings.');
    } finally {
      loading.value = false;
    }
  }

  async function updateSetting(key, value, successMessage) {
    loading.value = true;
    try {
      await apiService.admin.settings.update({ [key]: value });
      toast.success(successMessage);
    } catch (error) {
      console.error(`Failed to update ${key}:`, error);
      toast.error(`Failed to update ${key}.`);
      throw error; // Re-throw to allow components to handle it
    } finally {
      loading.value = false;
    }
  }

  async function setPrimaryColor(newColorName) {
    const colorObject = primaryColors.find(c => c.name.toLowerCase() === newColorName.toLowerCase());
    if (colorObject) {
      await updateSetting('color_name', newColorName, 'Color updated successfully!');
      primaryColor.value = colorObject.hex;
    }
  }

  async function setCurrency(newCurrency) {
    await updateSetting('currency', newCurrency, 'Currency updated successfully!');
    currency.value = newCurrency;
  }

  async function setLanguage(newLanguage) {
    await updateSetting('language_signal', newLanguage, 'Language updated successfully!');
    language.value = newLanguage;
    applyLanguage(newLanguage);
  }

  return {
    primaryColor,
    currency,
    language,
    loading,
    primaryColors, // Expose for the settings page
    setPrimaryColor,
    setCurrency,
    setLanguage,
    fetchSettings
  };
});
