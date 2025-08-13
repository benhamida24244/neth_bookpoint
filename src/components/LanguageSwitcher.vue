<script setup>
import { useLanguageStore } from '@/stores/language'
import { computed, ref } from 'vue'

const languageStore = useLanguageStore()
const showMenu = ref(false)

// Define the available languages
const languages = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'ar', name: 'العربية' },
]

// Computed property to get the current language
const currentLanguage = computed(() => {
  return languages.find((lang) => lang.code === languageStore.language)
})

// Function to change the language
const setLanguage = (lang) => {
  languageStore.setLanguage(lang)
  showMenu.value = false
}
</script>

<template>
  <div class="relative">
    <div class="flex items-center">
      <button
        @click="showMenu = !showMenu"
        class="px-4 py-2 text-sm rounded-full font-medium cursor-pointer tracking-wide text-white border border-gray-400 bg-transparent hover:bg-gray-50 hover:text-black transition-all"
      >
        {{ currentLanguage.name }}
      </button>
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
