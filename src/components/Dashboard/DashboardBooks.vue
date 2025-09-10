<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import BookItems from '@/components/Dashboard/DashboardBookItem.vue'
import { useBooksStore } from '@/stores/Books'
import Pagination from '@/components/Pagination.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
// Define props to accept filters from the parent
const props = defineProps({
  filters: {
    type: Object,
    default: () => ({}),
  },
  author_id: {
    type: Number,
    default: null,
  },
  category_id: {
    type: Number,
    default: null,
  },
  publisher_id: {
    type: Number,
    default: null,
  },
})

// Access the books store
const booksStore = useBooksStore()
const currentPage = ref(1)
// Function to fetch books based on props
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

// Watch for changes in props and refetch books when they change
watch(
  () => [props.filters, props.author_id, props.category_id, props.publisher_id],
  fetchFilteredBooks,
  { immediate: true, deep: true }
)

// Get all books from the store using the allBooks getter
const allBooks = computed(() => booksStore.allBooks)

// Get the loading state from the store
const isLoading = computed(() => booksStore.isLoading)

// Check if any filters are active to show a more specific message
const hasActiveFilters = computed(() => {
  return Object.values(props.filters).some((value) => value !== null && value !== undefined && value !== '')
})

const handlePageChange = (page) => {
  currentPage.value = page
  fetchFilteredBooks(page)
}
onMounted(() => {
  fetchFilteredBooks()
})
</script>

<template>
  <div class="relative flex flex-wrap justify-center w-full max-w-6xl mx-auto px-4">
    <!-- Show a loading message while fetching data -->
    <div v-if="isLoading" class="text-center py-10">
      <p class="text-lg text-gray-500">{{ t('bookList.loading') }}</p>
    </div>
    <!-- Show a message if there are no books -->
    <div v-else-if="allBooks.length === 0" class="text-center py-10">
      <p v-if="hasActiveFilters" class="text-lg text-gray-500">
        {{ t('bookList.noMatch') }}
      </p>
      <p v-else class="text-lg text-gray-500">
        {{ t('bookList.noBooks') }}
      </p>
    </div>
    <!-- Display the list of books -->
    <template v-else>
      <BookItems v-for="book in allBooks" :book="book" :key="book.id" />
      <div class="w-full">
        <Pagination
          v-if="booksStore.pagination"
          :current-page="currentPage"
          :last-page="booksStore.pagination.last_page"
          :total-items="booksStore.pagination.total"
          @page-changed="handlePageChange"
        />
      </div>
    </template>
  </div>
</template>
