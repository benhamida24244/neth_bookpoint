<script setup>
import { RouterView } from 'vue-router'
import { useSettingsStore } from './stores/settings'
import { useLanguageStore } from '@/stores/language'
import { onMounted } from 'vue'

const settingsStore = useSettingsStore()
const languageStore = useLanguageStore()

onMounted(async () => {
  // اجلب الإعدادات من DB
  await settingsStore.fetchSettings()

  // طبّق اللون الأساسي
  if (settingsStore.primaryColor) {
    settingsStore.setPrimaryColor(settingsStore.primaryColor)
  } else {
    // fallback لو ما فيه لون
    settingsStore.setPrimaryColor(settingsStore.defaultColor)
  }

  // ترجمات
  await languageStore.loadTranslations()
})
</script>

<template>
  <RouterView />
</template>
