<script setup>
import { useBooksStore } from '@/stores/Books';
import { useLanguageStore } from '@/stores/language';
import { onMounted, computed } from 'vue';
import { storeToRefs } from 'pinia';

const bookStore = useBooksStore()
const { RecentBooks } = storeToRefs(bookStore)
const languageStore = useLanguageStore()
const translations = computed(() => languageStore.translations)
const apiBaseurl = import.meta.env.VITE_API_BASE_URL
onMounted(() => {
  bookStore.fetchBooks()
})
</script>

<template>
  <div class="bg-white p-6 rounded-2xl shadow-md">
    <h2 class="text-xl font-bold text-[var(--color-primary)] font-BonaRegular mb-4">
      📚 Recent Books
    </h2>
    <!-- Empty State -->
        <div v-if="RecentBooks.length === 0" class="p-12 text-center">
          <div
            class="mx-auto w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4"
          >
            <i class="far fa-file-alt text-gray-400 text-3xl"></i>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-1">{{ translations.dashboard?.recentBooks?.emptyHeader }}</h3>

        </div>
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      <div
        v-for="book in RecentBooks"
        :key="book.id"
        class="bg-gray-50 rounded-xl p-3 shadow-sm hover:shadow-lg transition cursor-pointer"
      >
        <img
          :src="`${apiBaseurl}${book.cover}`"
          alt="book cover"
          class="w-full h-48 object-cover rounded-lg mb-2"
        />
        <h3 class="font-semibold text-slate-800 text-sm truncate">{{ book.title }}</h3>
        <p class="text-xs text-gray-500 italic">Published: {{ book.date }}</p>
      </div>
    </div>
  </div>
</template>
