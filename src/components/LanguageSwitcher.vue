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
const selectedLanguage = ref(languageStore.language)

const availableLanguages = [
  { code: 'en', name: 'English' },
  { code: 'ar', name: 'العربية' },
  { code: 'fr', name: 'Français' }
]

const switchLanguage = () => {
  languageStore.setLanguage(selectedLanguage.value)
}
</script>

<template>
  <div class="relative">
    <div class="flex items-center">
      <button
        @click="showMenu = !showMenu"
        class="px-4 py-2 text-sm rounded-full font-medium font-BonaRegular cursor-pointer tracking-wide text-white border border-gray-400 bg-transparent hover:bg-gray-50 hover:text-black transition-all"
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
