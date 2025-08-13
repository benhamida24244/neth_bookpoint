<script setup>
import { useSettingsStore } from '@/stores/settings'
import { useLanguageStore } from '@/stores/language'
import { computed } from 'vue'

const settingsStore = useSettingsStore()
const languageStore = useLanguageStore()
const translations = computed(() => languageStore.translations)

// Dynamic background image from the store
const heroBackground = computed(() => {
  const wallpaper = settingsStore.primaryColor.heroWallpaper || ''
  return wallpaper ? `url("${wallpaper}")` : ''
})
</script>
<template>
  <!-- Hero -->
  <div
    class="hero bg-no-repeat bg-cover bg-center h-[85vh] relative overflow-hidden"
    :style="{ backgroundImage: heroBackground }"
  >
    <!-- Gradients -->
    <div aria-hidden="true" class="flex absolute -top-96 start-1/2 transform -translate-x-1/2">
      <div class="w-100 h-175 rotate-[-60deg] transform -translate-x-40"></div>
      <div class="w-[1440px] h-200 rounded-fulls origin-top-left -rotate-12 -translate-x-60"></div>
    </div>
    <!-- End Gradients -->

    <div class="relative z-10 items-center flex">
      <div class="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div class="max-w-4xl text-center mx-auto">
          <!-- Title -->
          <div class="mt-5 max-w-5xl">
            <h1 class="block font-bona text-[var(--color-light)] text-4xl md:text-5xl lg:text-5xl">
              {{ translations.hero?.title }}
            </h1>
          </div>
          <!-- End Title -->

          <div class="mt-5 max-w-3xl">
            <p class="text-lg text-gray-300 font-BonaRegular">
              {{ translations.hero?.subtitle }}
            </p>
          </div>

          <!-- Buttons -->
          <div class="mt-8 gap-3 flex justify-center">
            <form class="relative w-full max-w-md">
              <label
                for="search-input"
                class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
                >Search</label
              >
              <div class="relative">
                <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <i class="pi pi-search text-gray-400"></i>
                </div>
                <input
                  type="search"
                  id="search-input"
                  class="block w-full p-4 ps-10 text-sm text-white border border-[var(--color-primary)] rounded-full bg-black/30 backdrop-blur-sm focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] placeholder-gray-400"
                  :placeholder="translations.hero?.searchPlaceholder"
                  required
                />
                <button
                  type="submit"
                  class="text-white absolute end-2.5 bottom-2.5 bg-[var(--color-primary)] hover:bg-[var(--color-hover)] focus:ring-4 focus:outline-none focus:ring-[var(--color-light)] font-medium rounded-full text-sm px-4 py-2"
                >
                  {{ translations.hero?.searchButton }}
                </button>
              </div>
            </form>
          </div>
          <!-- End Buttons -->
        </div>
      </div>
    </div>
  </div>
  <!-- End Hero -->
</template>
