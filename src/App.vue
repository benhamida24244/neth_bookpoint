<script setup>
import { useSettingsStore } from './stores/settings'
import { onMounted } from 'vue'

const settingsStore = useSettingsStore()

// This ensures that when the app is loaded, the primary color from the
// store (and localStorage) is applied as a CSS variable to the document.
onMounted(() => {
  settingsStore.setPrimaryColor(settingsStore.primaryColor)
})
</script>
<template>
<RouterView></RouterView>
</template>
