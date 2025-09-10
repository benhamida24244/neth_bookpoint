<template>
  <div class="p-6 max-w-xl mx-auto space-y-8">
    <h1 class="text-2xl font-bold">{{ t('dashboard.settings.title') }}</h1>

    <!-- Primary Color Selection -->
    <div class="space-y-4">
      <h2 class="text-xl font-semibold">{{ t('dashboard.settings.primaryColor') }}</h2>
      <p class="text-gray-600">{{ t('dashboard.settings.primaryColorSubtext') }}</p>
      <div class="flex items-center space-x-4">
        <button
          v-for="color in settingsStore.primaryColors"
          :key="color.name"
          @click="settingsStore.setPrimaryColor(color.name)"
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
      <h2 class="text-xl font-semibold">{{ t('dashboard.settings.livePreview') }}</h2>
      <ExampleComponent />
    </div>

    <!-- Localization -->
    <div class="space-y-4">
      <h2 class="text-xl font-semibold">{{ t('dashboard.settings.localization') }}</h2>

      <!-- Currency -->
      <label class="block font-medium">{{ t('dashboard.settings.currency') }}</label>
      <select
        :value="settingsStore.currency"
        @change="handleCurrencyChange"
        class="w-full p-2 border rounded"
      >
        <option value="$">{{ t('dashboard.settings.currencies.usd') }}</option>
        <option value="€">{{ t('dashboard.settings.currencies.eur') }}</option>
        <option value="DA">{{ t('dashboard.settings.currencies.dzd') }}</option>
      </select>

      <!-- Language -->
      <label class="block font-medium">{{ t('dashboard.settings.language') }}</label>
      <select
        :value="settingsStore.language"
        @change="handleLanguageChange"
        class="w-full p-2 border rounded"
      >
        <option value="en">{{ t('dashboard.settings.languages.en') }}</option>
        <option value="fr">{{ t('dashboard.settings.languages.fr') }}</option>
        <option value="ar">{{ t('dashboard.settings.languages.ar') }}</option>
      </select>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useSettingsStore } from '@/stores/settings'
import ExampleComponent from '@/components/Theme/ExampleComponent.vue'

const { t } = useI18n()
const settingsStore = useSettingsStore()

const handleCurrencyChange = (event) => {
  settingsStore.setCurrency(event.target.value)
}

const handleLanguageChange = (event) => {
  settingsStore.setLanguage(event.target.value)
}
</script>
