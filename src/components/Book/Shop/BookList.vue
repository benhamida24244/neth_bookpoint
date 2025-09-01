<script setup>
import { computed } from 'vue';
import BookItems from './BookItems.vue';
import { useBooksStore } from '@/stores/Books';

// Access the books store
const booksStore = useBooksStore();

// Get all books from the store using the allBooks getter
const allBooks = computed(() => booksStore.allBooks);

// Get the loading state from the store
const isLoading = computed(() => booksStore.isLoading);
</script>

<template>
  <div class="relative flex flex-wrap justify-center w-full max-w-6xl mx-auto px-4">
    <!-- Show a loading message while fetching data -->
    <div v-if="isLoading" class="text-center py-10">
      <p class="text-lg text-gray-500">{{ $t('shop.loading') }}</p>
    </div>
    <!-- Show a message if there are no books -->
    <div v-else-if="allBooks.length === 0" class="text-center py-10">
      <p class="text-lg text-gray-500">{{ $t('shop.noBooks') }}</p>
    </div>
    <!-- Display the list of books -->
    <template v-else>
      <BookItems v-for="book in allBooks" :book="book" :key="book.id" />
    </template>
  </div>
</template>
