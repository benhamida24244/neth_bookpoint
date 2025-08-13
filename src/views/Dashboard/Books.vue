<script setup>
import { useBooksStore } from '@/stores/Books'
import { useSettingsStore } from '@/stores/settings'
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import AddBookModal from '@/components/Dashboard/Modals/AddBookModal.vue'
import EditBookModal from '@/components/Dashboard/Modals/EditBookModal.vue'

// الفلاتر
const activeFilter = ref('All Books')
const searchQuery = ref('')
const showAddBookModal = ref(false)
const showEditBookModal = ref(false)
const selectedBook = ref(null)

const filters = ref([
  { label: 'All Books', value: 'All Books' },
  { label: 'Published', value: 'published' },
  { label: 'Pending', value: 'pending' },
  { label: 'Draft', value: 'draft' },
])

const settingStore = useSettingsStore()

// استدعاء الـ Store
const bookStore = useBooksStore()

// بيانات الكتب
const books = computed(() => bookStore.books || [])

// الإحصائيات
const stats = computed(() => [
  {
    label: 'Total Books',
    value: books.value.length.toString(),
    icon: 'fas fa-book text-blue-500',
    iconBg: 'bg-blue-50',
  },
  {
    label: 'Total Authors',
    value: (bookStore.getTotalAuthors || []).length.toString(),
    icon: 'fas fa-user-pen text-green-500',
    iconBg: 'bg-green-50',
  },
  {
    label: 'Total Publishers',
    value: (bookStore.getTotalPublishedBooks || []).length.toString(),
    icon: 'fas fa-building text-[var(--color-light)]',
    iconBg: 'bg-yellow-50',
  },
  {
    label: 'Total Categories',
    value: (bookStore.getTotalCategories || []).length.toString(),
    icon: 'fas fa-layer-group text-emerald-500',
    iconBg: 'bg-emerald-50',
  },
])

// تصفية البيانات
const filteredBooks = computed(() => {
  let filtered = books.value

  if (activeFilter.value !== 'All Books') {
    filtered = filtered.filter((book) => book.status === activeFilter.value)
  }

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (book) =>
        (book.title || '').toLowerCase().includes(query) ||
        (book.author || '').toLowerCase().includes(query) ||
        (book.publishingHouse || '').toLowerCase().includes(query),
    )
  }

  return filtered
})

// تصنيف الحالة
const getStatusClass = (status) => {
  const statusClasses = {
    published: 'bg-green-50 text-green-700',
    pending: 'bg-yellow-50 text-[var(--color-primary)]',
    draft: 'bg-red-50 text-red-700',
  }
  return statusClasses[status] || 'bg-gray-50 text-gray-700'
}

const handleSaveBook = (newBook) => {
  bookStore.addBook(newBook)
  showAddBookModal.value = false
  alert('Book added successfully!')
}

const openEditModal = (book) => {
  selectedBook.value = book
  showEditBookModal.value = true
}

const handleUpdateBook = (updatedBook) => {
  bookStore.updateBook(updatedBook)
  showEditBookModal.value = false
  alert('Book updated successfully!')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <AddBookModal
      :show="showAddBookModal"
      @close="showAddBookModal = false"
      @save="handleSaveBook"
    />
    <EditBookModal
      :show="showEditBookModal"
      :book="selectedBook"
      @close="showEditBookModal = false"
      @save="handleUpdateBook"
    />
    <div class="w-full px-4 md:px-6 py-8">
      <div class="max-w-7xl mx-auto mb-8 font-BonaRegular">
        <h1 class="text-2xl md:text-3xl font-bold text-gray-800">Books Dashboard</h1>
        <p class="text-gray-600 mt-1">Track and manage all your books efficiently</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100"
        >
          <div :class="stat.iconBg" class="p-3 rounded-lg">
            <i :class="stat.icon" class="text-lg"></i>
          </div>
          <div>
            <p class="text-sm text-gray-500">{{ stat.label }}</p>
            <p class="text-lg font-semibold text-gray-800">{{ stat.value }}</p>
          </div>
        </div>
      </div>

      <!-- Filters and Search -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div class="flex flex-wrap gap-2">
          <button
            v-for="filter in filters"
            :key="filter.value"
            @click="activeFilter = filter.value"
            :class="[
              'px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium transition-all duration-200',
              activeFilter === filter.value
                ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                : 'hover:bg-gray-50',
            ]"
          >
            {{ filter.label }}
          </button>
        </div>

        <div class="flex items-center gap-4">
          <div class="relative w-full md:w-auto">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search books..."
              class="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-light)] focus:border-[var(--color-light)]"
            />
            <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
          </div>
          <button
            @click="showAddBookModal = true"
            class="px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white font-medium hover:bg-[var(--color-primary-dark)] transition-colors duration-200"
          >
            Add New Book
          </button>
        </div>
      </div>

      <!-- Books Table -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Id
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Cover
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Title
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Category
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Author
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Publisher
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Price
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr
                v-for="book in filteredBooks"
                :key="book.id"
                class="hover:bg-gray-50 transition-colors duration-200"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{{ book.id }}</td>

                <td class="px-6 py-4 whitespace-nowrap">
                  <img :src="book.cover" alt="cover" class="w-10 h-14 rounded shadow" />
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{{ book.title }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                  {{ book.category }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ book.author }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {{ book.publishingHouse }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="getStatusClass(book.status)"
                    class="px-3 py-1 rounded-full text-xs font-medium"
                  >
                    {{ book.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ book.price + settingStore.currency}}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {{ book.publisherDate }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center text-sm">
                  <button
                    @click="openEditModal(book)"
                    class="text-indigo-600 hover:text-indigo-900"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-if="filteredBooks.length === 0" class="p-12 text-center">
          <div
            class="mx-auto w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4"
          >
            <i class="far fa-file-alt text-gray-400 text-3xl"></i>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-1">No books found</h3>
          <p class="text-gray-500">
            Try adjusting your search or filter to find what you're looking for.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

body {
  font-family: 'Inter', sans-serif;
}
</style>
