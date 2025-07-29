<!-- SettingsPage.vue -->
<template>
  <div class="p-6 max-w-xl mx-auto space-y-8">
    <h1 class="text-2xl font-bold">Settings</h1>

    <!-- Appearance -->
    <div class="space-y-4">
      <h2 class="text-xl font-semibold">Appearance</h2>
      <select v-model="theme" class="w-full p-2 border rounded">
        <option value="light">🌞 Light</option>
        <option value="dark">🌙 Dark</option>
        <option value="custom">🎨 Custom</option>
      </select>
    </div>

    <!-- Localization -->
    <div class="space-y-4">
      <h2 class="text-xl font-semibold">Localization</h2>

      <!-- Currency -->
      <label class="block font-medium">Currency</label>
      <select v-model="currency" class="w-full p-2 border rounded">
        <option value="USD">💵 USD</option>
        <option value="EUR">💶 EUR</option>
        <option value="DZD">🇩🇿 DZD</option>
      </select>

      <!-- Language -->
      <label class="block font-medium">Language</label>
      <select v-model="language" class="w-full p-2 border rounded">
        <option value="en">🇺🇸 English</option>
        <option value="fr">🇫🇷 French</option>
        <option value="ar">🇩🇿 Arabic</option>
      </select>
    </div>

    <!-- Save Button -->
    <button @click="saveSettings" class="mt-6 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700">
      Save Changes
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const theme = ref('light')
const currency = ref('USD')
const language = ref('en')

function saveSettings() {
  // Save to localStorage or API
  localStorage.setItem('theme', theme.value)
  localStorage.setItem('currency', currency.value)
  localStorage.setItem('language', language.value)
  alert('✅ Settings saved!')
}
</script>
