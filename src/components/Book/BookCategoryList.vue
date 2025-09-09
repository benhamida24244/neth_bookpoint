<script setup>
import { ref, onMounted, watch } from 'vue'
import { useBooksStore } from '@/stores/Books'
import BookItemsCategory from './BookItemsCategory.vue'
import Pagination from '../Pagination.vue'
const props = defineProps({
  category: { type: Number, required: true }
})

const booksStore = useBooksStore()
const BestSellerBook = ref([])
const currentPage = ref(1);

const handlePageChange = (page) => {
  currentPage.value = page
  fetchBooks(page)
}

const fetchBooks = async (page = 1) => {
  await booksStore.fetchBooks({
    page,
    category_id: props.category,
    limit: 20
  })
  BestSellerBook.value = booksStore.books
}

onMounted(() => {
  fetchBooks()
})

// Watch for category changes and reset pagination
watch(() => props.category, () => {
  currentPage.value = 1
  fetchBooks()
})
  </script>

<template>
  <div class="relative flex flex-wrap justify-center w-full max-w-6xl mx-auto px-4">
    <BookItemsCategory v-for="book in BestSellerBook" :book="book" :key="book.id" />
    <div class="w-full">
      <Pagination
      v-if="booksStore.pagination"
      :current-page="currentPage"
      :last-page="booksStore.pagination.last_page"
      :total-items="booksStore.pagination.total"
      @page-changed="handlePageChange"
    />
    </div>

    <p v-if="!BestSellerBook.length">No books found in this category.</p>
  </div>
</template>
