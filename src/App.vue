<script setup>
import { RouterView } from 'vue-router'
import { useSettingsStore } from './stores/settings'
import { onMounted } from 'vue'
import { useCustomerAuthStore } from '@/stores/customerAuth'

const settingsStore = useSettingsStore()
const authStore = useCustomerAuthStore()

// This ensures that when the app is loaded, the primary color from the
// store (and localStorage) is applied as a CSS variable to the document.
onMounted(async () => {
  // Attempt to log in the user automatically if a token exists
  await authStore.tryAutoLogin();

  await settingsStore.fetchSettings();
})
</script>
<template>
  <RouterView />
</template>
