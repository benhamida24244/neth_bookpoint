<script setup>
import { useRoute } from 'vue-router'
import { computed, onMounted } from 'vue'
import BookList from '@/components/Book/Shop/BookList.vue'
import { useAuthorStore } from '@/stores/Authors'
import { useLanguageStore } from '@/stores/language'
import { storeToRefs } from 'pinia'

const route = useRoute()
const authorId = computed(() => parseInt(route.params.id))
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

const authorStore = useAuthorStore()
const { authors } = storeToRefs(authorStore)

const languageStore = useLanguageStore()
const { translations } = storeToRefs(languageStore)

const selectedAuthor = computed(() => authors.value.find((a) => a.id === authorId.value))

const getTranslation = (key) => {
  const keys = key.split('.')
  let current = translations.value
  for (const k of keys) {
    if (current && typeof current === 'object' && k in current) {
      current = current[k]
    } else {
      return null
    }
  }
  return current
}


const authorDescription = computed(() => {
  if (selectedAuthor.value && selectedAuthor.value.descriptionKey) {
    return getTranslation(selectedAuthor.value.descriptionKey) || 'Description not available.'
  }
  return 'Description not available.'
})

onMounted(() => {
  window.scrollTo(0, 0)
})
</script>

<template>
  <div class="w-full min-h-screen bg-black">
    <!-- Hero Section -->
    <div class="relative bg-black py-16 px-4">
      <div class="absolute inset-0 bg-black/30"></div>
      <div class="relative max-w-6xl mx-auto">
        <div v-if="selectedAuthor" class="text-center mb-8">
          <!-- Decorative elements -->
          <div class="flex justify-center mb-6">
            <div
              class="h-px bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent w-24"
            ></div>
          </div>

          <div class="grid md:grid-cols-2 gap-12 items-center">
            <!-- Author Image -->
            <div class="flex justify-center">
              <div class="relative group">
                <div
                  class="absolute -inset-4 bg-gradient-to-r from-[var(--color-primary)] to-yellow-400 rounded-full blur opacity-25 group-hover:opacity-40 transition duration-300"
                ></div>
                <img
                  :src="`${apiBaseUrl}${selectedAuthor.img}`"
                  :alt="selectedAuthor.name"
                  class="relative w-64 h-64 object-cover rounded-full shadow-2xl ring-4 ring-[var(--color-primary)]/20 group-hover:ring-[var(--color-primary)]/40 transition-all duration-300"
                />
              </div>
            </div>

            <!-- Author Info -->
            <div class="text-white font-BonaRegular space-y-6">
              <div>
                <h1 class="text-4xl md:text-5xl font-bold text-[var(--color-primary)] mb-3 leading-tight">
                  {{ selectedAuthor.name }}
                </h1>
                <div class="h-1 bg-gradient-to-r from-[var(--color-primary)] to-transparent w-20 mb-6"></div>
              </div>

              <p class="text-gray-300 text-lg leading-relaxed italic">
                {{ authorDescription }}
              </p>

              <!-- Stats -->
              <div class="flex flex-wrap gap-6 items-center">
                <div
                  class="flex items-center gap-3 bg-gray-800/50 px-4 py-2 rounded-lg border border-gray-700"
                >
                  <span class="text-2xl">📚</span>
                  <div>
                    <p class="text-[var(--color-primary)] font-bold text-xl">{{ selectedAuthor.nmbBook }}</p>
                    <p class="text-gray-400 text-sm">Books</p>
                  </div>
                </div>

                <div
                  class="flex items-center gap-3 bg-gray-800/50 px-4 py-2 rounded-lg border border-gray-700"
                >
                  <span class="text-2xl">⭐</span>
                  <div>
                    <p class="text-[var(--color-primary)] font-bold text-xl">Author</p>
                    <p class="text-gray-400 text-sm">Featured</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Error State -->
        <div v-else class="text-center text-white py-16">
          <div class="max-w-md mx-auto">
            <div class="mb-6">
              <div
                class="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <svg
                  class="w-8 h-8 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <h2 class="text-2xl font-bold text-red-500 mb-2">Author Not Found!</h2>
              <p class="text-gray-400">Please check the URL or return to the authors list.</p>
            </div>

            <button
              @click="$router.go(-1)"
              class="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors duration-300"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                ></path>
              </svg>
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Books Section -->
    <div class="bg-black">
      <div class="max-w-6xl mx-auto px-4 py-8">
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold text-[var(--color-primary)] font-BonaRegular mb-4">
            Books by {{ selectedAuthor?.name }}
          </h2>
          <div
            class="h-px bg-gradient-to-r from-transparent via-[var(--color-primary)]/50 to-transparent w-32 mx-auto"
          ></div>
        </div>

        <BookList :author_id="selectedAuthor?.id" />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in-up {
  animation: fadeInUp 0.6s ease-out;
}

/* Custom scrollbar for better aesthetics */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #1a1a1a;
}

::-webkit-scrollbar-thumb {
  background: #d97706;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #f59e0b;
}
</style>
