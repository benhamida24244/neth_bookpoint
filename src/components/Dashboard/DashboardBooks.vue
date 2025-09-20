<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import BookItems from '@/components/Dashboard/DashboardBookItem.vue'
import { useBooksStore } from '@/stores/Books'
import Pagination from '@/components/Pagination.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  filters: { type: Object, default: () => ({}) },
  author_id: { type: Number, default: null },
  category_id: { type: Number, default: null },
  publisher_id: { type: Number, default: null },
})

const booksStore = useBooksStore()
const currentPage = ref(1)

const fetchFilteredBooks = async (page = 1) => {
  const params = { ...props.filters, page }
  if (props.author_id) {
    await booksStore.fetchBooksByAuthor(props.author_id, page)
  } else if (props.category_id) {
    await booksStore.fetchBooksByCategory(props.category_id, page)
  } else if (props.publisher_id) {
    await booksStore.fetchBooksByPublisher(props.publisher_id, page)
  } else {
    await booksStore.fetchBooks(params)
  }
}

watch(
  () => [props.filters, props.author_id, props.category_id, props.publisher_id],
  () => fetchFilteredBooks(), // Call without page to reset to 1
  { immediate: true, deep: true }
)

const allBooks = computed(() => booksStore.allBooks)
const isLoading = computed(() => booksStore.isLoading)

const hasActiveFilters = computed(() => {
  return Object.values(props.filters).some((value) => !!value)
})

const handlePageChange = (page) => {
  currentPage.value = page
  fetchFilteredBooks(page)
}

onMounted(() => {
  fetchFilteredBooks(currentPage.value)
})
</script>

<template>
  <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div v-if="isLoading" class="text-center py-10">
      <p class="text-lg text-gray-500">{{ t('bookList.loading') }}</p>
    </div>
    
    <div v-else-if="allBooks.length === 0" class="text-center py-10 bg-white rounded-lg shadow-sm">
        <i class="fas fa-book-open text-4xl text-gray-300 mb-4"></i>
        <p v-if="hasActiveFilters" class="text-lg text-gray-500">
            {{ t('bookList.noMatch') }}
        </p>
        <p v-else class="text-lg text-gray-500">
            {{ t('bookList.noBooks') }}
        </p>
    </div>

    <template v-else>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        <BookItems v-for="book in allBooks" :book="book" :key="book.id" />
      </div>
      <div class="w-full mt-8">
        <Pagination
          v-if="booksStore.pagination && booksStore.pagination.last_page > 1"
          :current-page="currentPage"
          :last-page="booksStore.pagination.last_page"
          :total-items="booksStore.pagination.total"
          @page-changed="handlePageChange"
        />
      </div>
    </template>
  </div>
</template>