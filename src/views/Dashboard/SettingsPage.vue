<!-- SettingsPage.vue -->
<template>
  <div class="p-6 max-w-xl mx-auto space-y-8">
    <h1 class="text-2xl font-bold">Settings</h1>

    <!-- Primary Color Selection -->
    <div class="space-y-4">
      <h2 class="text-xl font-semibold">Primary Color</h2>
      <p class="text-gray-600">Choose a primary color for the application theme. The change will be applied instantly.</p>
      <div class="flex items-center space-x-4">
        <button
          v-for="color in primaryColors"
          :key="color.name"
          @click="settingsStore.setPrimaryColor(color.hex)"
          class="flex items-center p-2 border-2 rounded-lg transition-all duration-200"          :class="{ 'border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]': settingsStore.primaryColor.primary === color.hex.primary, 'border-transparent': settingsStore.primaryColor.primary !== color.hex.primary }"
        >
          <span class="w-6 h-6 rounded-md" :style="{ backgroundColor: color.hex.primary }"></span>
          <span class="ml-2 font-medium">{{ color.name }}</span>
        </button>
      </div>
    </div>

    <!-- Live Preview -->
    <div class="space-y-4">
        <h2 class="text-xl font-semibold">Live Preview</h2>
        <ExampleComponent />
    </div>

    <!-- Localization -->
    <div class="space-y-4">
      <h2 class="text-xl font-semibold">Localization</h2>

      <!-- Currency -->
      <label class="block font-medium">Currency</label>
      <select v-model="settingsStore.currency" class="w-full p-2 border rounded">
        <option value="$">💵 USD</option>
        <option value="€">💶 EUR</option>
        <option value="DA">🇩🇿 DZD</option>
      </select>

      <!-- Language -->
      <label class="block font-medium">Language</label>
      <select v-model="settingsStore.language" class="w-full p-2 border rounded">
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
import { ref } from 'vue'

const settingsStore = useSettingsStore()

const primaryColors = ref([
  { name: 'Yellow', hex: {
    primary: '#c67913',
    light: '#F0B100',
    hover: '#A65F00'
  }}, // bg-yellow-600
  { name: 'Green', hex: {
    primary: '#16A34A',
    light: '#4ADE80',
    hover: '#15803D'
  }},  // bg-green-600
  { name: 'Red', hex: {
    primary: '#DC2626',
    light: '#FCA5A5',
    hover: '#B91C1C'
  }}    // bg-red-600
])

</script>
