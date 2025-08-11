<script setup>
import { useSettingsStore } from './stores/settings'
import { onMounted, watch } from 'vue'

const settingsStore = useSettingsStore()

onMounted(() => {
  document.documentElement.className = settingsStore.theme
})

watch(() => settingsStore.theme, (newTheme) => {
  document.documentElement.className = newTheme
})
</script>
<template>
<RouterView></RouterView>
</template>
