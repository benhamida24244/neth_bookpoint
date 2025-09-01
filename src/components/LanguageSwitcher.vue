<template>
  <div class="language-switcher">
    <select v-model="selectedLanguage" @change="switchLanguage">
      <option v-for="lang in availableLanguages" :key="lang.code" :value="lang.code">
        {{ lang.name }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useLanguageStore } from '@/stores/language'

const languageStore = useLanguageStore()
const selectedLanguage = ref(languageStore.currentLanguage)

const availableLanguages = [
  { code: 'en', name: 'English' },
  { code: 'ar', name: 'العربية' },
  { code: 'fr', name: 'Français' }
]

const switchLanguage = () => {
  languageStore.setLanguage(selectedLanguage.value)
}
</script>

<style scoped>
.language-switcher {
  position: relative;
  display: inline-block;
}

select {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fff;
  cursor: pointer;
}
</style>