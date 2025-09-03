<script setup>
import { useLanguageStore } from '@/stores/language'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n' // أضف هذا السطر

const languageStore = useLanguageStore()
const showMenu = ref(false)
const { locale } = useI18n() // أضف هذا السطر

const languages = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'ar', name: 'العربية' },
]

const currentLanguage = computed(() => {
  return languages.find((lang) => lang.code === languageStore.language)
})

const setLanguage = (lang) => {
  languageStore.setLanguage(lang)
  locale.value = lang // أضف هذا السطر لتغيير لغة i18n
  showMenu.value = false
}
</script>

<template>
  <div class="relative">
    <div class="flex items-center">
     
      <div
        v-if="showMenu"
        class="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50"
      >
        <ul>
          <li
            v-for="lang in languages"
            :key="lang.code"
            @click="setLanguage(lang.code)"
            class="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black"
          >
            {{ lang.name }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
