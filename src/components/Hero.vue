<script setup>
import { useSettingsStore } from '@/stores/settings'
import { useI18n } from 'vue-i18n'
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
import { useBooksStore } from '@/stores/Books'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

const { t } = useI18n()
const settingsStore = useSettingsStore()
const booksStore = useBooksStore()
const router = useRouter()

const searchQuery = ref('')
const showResults = ref(false)
const { searchResults, isSearchLoading } = storeToRefs(booksStore)
const { searchBooks } = booksStore

const searchInputContainer = ref(null)
const dropdownStyle = ref({})

const updateDropdownPosition = () => {
  if (searchInputContainer.value) {
    const rect = searchInputContainer.value.getBoundingClientRect()
    dropdownStyle.value = {
      position: 'absolute',
      top: `${rect.bottom + window.scrollY + 5}px`,
      left: `${rect.left + window.scrollX}px`,
      width: `${rect.width}px`,
      zIndex: 1000
    }
  }
}

onMounted(() => {
  window.addEventListener('resize', updateDropdownPosition)
  updateDropdownPosition()
})

onUnmounted(() => {
  window.removeEventListener('resize', updateDropdownPosition)
})

watch(searchQuery, (newQuery) => {
  updateDropdownPosition()
  if (newQuery.length > 2) {
    showResults.value = true
    booksStore.searchBooks(newQuery)
  } else {
    showResults.value = false
  }
})

const selectBook = (book) => {
  router.push(`/book/${book.id}`)
  showResults.value = false
  searchQuery.value = ''
}

const search = () => {
  if (searchQuery.value.trim()) {
    router.push(`/shop?search=${searchQuery.value.trim()}`)
  }
}

// Dynamic background image from the store
const heroBackground = computed(() => {
  const wallpaper = settingsStore.primaryColor.heroWallpaper || ''
  return wallpaper ? `url("${wallpaper}")` : ''
})

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';
</script>
<template>
  <!-- Hero -->
  <div
    class="hero bg-no-repeat bg-cover bg-center h-[85vh] relative overflow-hidden"
    :style="{ backgroundImage: heroBackground }"
    @click.self="showResults = false"
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
              {{ t('hero.title') }}
            </h1>
          </div>
          <!-- End Title -->

          <div class="mt-5 max-w-3xl">
            <p class="text-lg text-gray-300 font-BonaRegular">
              {{ t('hero.subtitle') }}
            </p>
          </div>

          <!-- Buttons -->
          <div class="mt-8 gap-3 flex justify-center">
            <div ref="searchInputContainer" class="relative w-full max-w-md">
              <form @submit.prevent="search" class="relative w-full">
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
                    v-model="searchQuery"
                    class="block w-full p-4 ps-10 text-sm text-white border border-[var(--color-primary)] rounded-full bg-black/30 backdrop-blur-sm focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] placeholder-gray-400"
                    :placeholder="t('hero.searchPlaceholder')"
                    required
                    autocomplete="off"
                    @focus="showResults = true"
                  />
                  <button
                    type="submit"
                    class="text-white absolute end-2.5 bottom-2.5 bg-[var(--color-primary)] hover:bg-[var(--color-hover)] focus:ring-4 focus:outline-none focus:ring-[var(--color-light)] font-medium rounded-full text-sm px-4 py-2"
                  >
                    {{ t('hero.searchButton') }}
                  </button>
                </div>
              </form>
              <!-- Enhanced Results Dropdown -->
              <Teleport to="body">
                <transition
                  enter-active-class="transition duration-200 ease-out"
                  enter-from-class="transform scale-95 opacity-0"
                  enter-to-class="transform scale-100 opacity-100"
                  leave-active-class="transition duration-150 ease-in"
                  leave-from-class="transform scale-100 opacity-100"
                  leave-to-class="transform scale-95 opacity-0"
                >
                  <div
                    v-if="showResults"
                    :style="dropdownStyle"
                    class="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl max-h-96 overflow-hidden border border-gray-200/50"
                  >
                    <!-- Loading State -->
                    <div v-if="isSearchLoading" class="p-8 text-center">
                      <div class="inline-block animate-spin rounded-full h-10 w-10 border-4 border-[var(--color-primary)] border-t-transparent"></div>
                      <p class="mt-3 text-gray-600 font-medium">جاري البحث...</p>
                    </div>

                    <!-- No Results -->
                    <div v-else-if="!searchResults.length && searchQuery.length > 2" class="p-8 text-center">
                      <i class="pi pi-inbox text-5xl text-gray-300 mb-3"></i>
                      <p class="text-gray-600 font-medium">لم يتم العثور على نتائج</p>
                      <p class="text-gray-400 text-sm mt-1">حاول استخدام كلمات مفتاحية مختلفة</p>
                    </div>

                    <!-- Results List -->
                    <ul v-else class="overflow-auto max-h-96 divide-y divide-gray-100">
                      <li
                        v-for="book in searchResults"
                        :key="book.id"
                        @click="selectBook(book)"
                        class="p-4 hover:bg-gradient-to-r hover:from-[var(--color-primary)]/5 hover:to-transparent cursor-pointer transition-all duration-300 group"
                      >
                        <div class="flex items-center gap-4">
                          <!-- Book Cover with Hover Effect -->
                          <div class="relative flex-shrink-0 w-16 h-20 rounded-lg overflow-hidden shadow-md group-hover:shadow-xl transition-shadow duration-300">
                            <img
                              :src="`${apiBaseUrl}${book.cover}`"
                              :alt="book.title"
                              class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                            />
                            <div class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          </div>

                          <!-- Book Info -->
                          <div class="flex-1 min-w-0 text-right">
                            <h3 class="font-bold text-gray-900 truncate group-hover:text-[var(--color-primary)] transition-colors duration-300 text-base">
                              {{ book.title }}
                            </h3>
                            <p class="text-sm text-gray-500 mt-1 flex items-center justify-end gap-1">
                              <span>{{ book.author.name }}</span>
                              <i class="pi pi-user text-xs"></i>
                            </p>
                          </div>

                          <!-- Arrow Icon -->
                          <div class="flex-shrink-0 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                            <i class="pi pi-angle-left text-[var(--color-primary)] text-xl"></i>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </transition>
              </Teleport>
            </div>
          </div>
          <!-- End Buttons -->
        </div>
      </div>
    </div>
  </div>
  <!-- End Hero -->
</template>
