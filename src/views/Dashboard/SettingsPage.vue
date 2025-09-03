<template>
  <div class="p-6 max-w-xl mx-auto space-y-8">
    <h1 class="text-2xl font-bold">{{ translations.dashboard?.settings?.title }}</h1>

    <!-- Primary Color Selection -->
    <div class="space-y-4">
      <h2 class="text-xl font-semibold">{{ translations.dashboard?.settings?.primaryColor }}</h2>
      <p class="text-gray-600">
        {{ translations.dashboard?.settings?.primaryColorSubtext }}
      </p>
      <div class="flex items-center space-x-4">
        <button
          v-for="color in primaryColors"
          :key="color.name"
          @click="settingsStore.setPrimaryColor(color.hex)"
          class="flex items-center p-2 border-2 rounded-lg transition-all duration-200"
          :class="{
            'border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]':
              settingsStore.primaryColor.primary === color.hex.primary,
            'border-transparent': settingsStore.primaryColor.primary !== color.hex.primary
          }"
        >
          <span class="w-6 h-6 rounded-md" :style="{ backgroundColor: color.hex.primary }"></span>
          <span class="ml-2 font-medium">{{ color.name }}</span>
        </button>
      </div>
    </div>

    <!-- Live Preview -->
    <div class="space-y-4">
      <h2 class="text-xl font-semibold">{{ translations.dashboard?.settings?.livePreview }}</h2>
      <ExampleComponent />
    </div>

    <!-- Localization -->
    <div class="space-y-4">
      <h2 class="text-xl font-semibold">{{ translations.dashboard?.settings?.localization }}</h2>

      <!-- Currency -->
      <label class="block font-medium">{{ translations.dashboard?.settings?.currency }}</label>
      <select v-model="settingsStore.currency" class="w-full p-2 border rounded">
        <option value="$">💵 USD</option>
        <option value="€">💶 EUR</option>
        <option value="DA">🇩🇿 DZD</option>
      </select>

      <!-- Language -->
      <label class="block font-medium">{{ translations.dashboard?.settings?.language }}</label>
      <select
        v-model="settingsStore.language"
        @change="languageStore.setLanguage($event.target.value)"
        class="w-full p-2 border rounded"
      >
        <option value="en">🇺🇸 English</option>
        <option value="fr">🇫🇷 French</option>
        <option value="ar">🇩🇿 Arabic</option>
      </select>
    </div>
  </div>
</template>

<script setup>
import { useSettingsStore } from '@/stores/settings'
import ExampleComponent from '@/components/Theme/ExampleComponent.vue'
import { ref, computed } from 'vue'
import walpapper from '@/assets/HomeIcon/Header/walpapper.png'
import walpappergreen from '@/assets/HomeIcon/Header/walpappergreen.png'
import walpapperRed from '@/assets/HomeIcon/Header/walpapperRed.png'
import HeroCover from '@/assets/HomeIcon/Hero/HeroCover.png'
import HeroCoverGreen from '@/assets/HomeIcon/Hero/HeroCoverGreen.png'
import HeroCoverRed from '@/assets/HomeIcon/Hero/HeroCoverRed.png'
import { useLanguageStore } from '@/stores/language'

const languageStore = useLanguageStore()
const translations = computed(() => languageStore.translations)
const primaryColors = ref([
  { name: 'Yellow', hex: {
    primary: '#c67913',
    light: '#F0B100',
    hover: '#A65F00',
    headerWallpaper: walpapper,
    heroWallpaper: HeroCover
  }},
  { name: 'Green', hex: {
    primary: '#16A34A',
    light: '#4ADE80',
    hover: '#15803D',
    headerWallpaper: walpappergreen,
    heroWallpaper: HeroCoverGreen
  }},
  { name: 'Red', hex: {
    primary: '#DC2626',
    light: '#FCA5A5',
    hover: '#B91C1C',
    headerWallpaper: walpapperRed,
    heroWallpaper: HeroCoverRed
  }}
])
const settingsStore = useSettingsStore()
</script>
