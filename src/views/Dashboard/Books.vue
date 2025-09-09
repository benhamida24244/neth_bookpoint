<script setup>
import { useBooksStore } from '@/stores/Books'
import { useSettingsStore } from '@/stores/settings'
import { ref, computed, onMounted, watch } from 'vue'
import { RouterLink } from 'vue-router'
import AddBookModal from '@/components/Dashboard/Modals/AddBookModal.vue'
import EditBookModal from '@/components/Dashboard/Modals/EditBookModal.vue'
import Pagination from '@/components/Pagination.vue'
import { useLanguageStore } from '@/stores/language'
import * as XLSX from 'xlsx'
import { useAuthorStore } from '@/stores/Authors'
import { usePublishingHouseStore } from '@/stores/PublishingHouses'
import { useCategoriesStore } from '@/stores/Categories'

const languageStore = useLanguageStore()
const translations = computed(() => languageStore.translations)

// الفلاتر
const activeFilter = ref('All Books')
const searchQuery = ref('')
const showAddBookModal = ref(false)
const showEditBookModal = ref(false)
const selectedBook = ref(null)

const filters = computed(() => [
  { label: translations.value.dashboard?.books?.filters?.all, value: 'All Books' },
  { label: translations.value.dashboard?.books?.filters?.published, value: 1 },
  { label: translations.value.dashboard?.books?.filters?.draft, value: 0 }
])

const settingStore = useSettingsStore()

// استدعاء الـ Store
const bookStore = useBooksStore()
const authorStore = useAuthorStore()
const publishingHouseStore = usePublishingHouseStore()
const categoriesStore = useCategoriesStore()

onMounted(async () => {
  await bookStore.fetchBooks({ page: 1 })
  await authorStore.fetchAuthors()
  await publishingHouseStore.fetchPublisher()
  await categoriesStore.fetchCategories()
})

// Current page state
const currentPage = ref(1)

// Watch for pagination updates
watch(() => bookStore.pagination, (newPagination) => {
  if (newPagination) {
    currentPage.value = newPagination.current_page
  }
}, { immediate: true })

// بيانات الكتب
const books = computed(() => bookStore.books || [])
const authors = computed(() => authorStore.authors)
const publishers = computed(() => publishingHouseStore.publishingHouses)
const categories = computed(() => categoriesStore.categories)

// 2. Get the API base URL from the .env file
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

const Deletebook = (book) => {
  if (confirm(`${translations.value.dashboard?.books?.deleteConfirm} "${book.title}"?`)) {
    bookStore.deleteBook(book.id)
  }
}

const exportData = () => {
  const data = filteredBooks.value.map(book => ({
    'ID': book.id,
    'Title': book.title,
    'Category': book.category.name,
    'Author': book.author.name,
    'Publisher': book.publisher.name,
    'Status': getStatusItem(book.status),
    'Price': book.price,
    'Date': book.publisherDate
  }))
  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Books')
  XLSX.writeFile(wb, 'books.xlsx')
}

const importData = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet);

      for (const book of json) {
        const author = authorStore.getAuthorById(book.author_id);
        const publisher = publishingHouseStore.getPublisherById(book.publisher_id);
        const category = categoriesStore.getCategoryById(book.category_id);

        if (!author || !publisher || !category || !book.title || !book.price) {
          console.warn(`Skipping book "${book.title}" due to missing required data.`);
          continue;
        }

        const formData = new FormData();
        formData.append('title', book.title);
        formData.append('author_id', author.id);
        formData.append('publisher_id', publisher.id);
        formData.append('category_id', category.id);
        formData.append('price', book.price);

        // Optional fields
        formData.append('description', book.description || '');
        formData.append('stock', book.stock || 0);
        formData.append('pages', book.pages || 0);
        formData.append('discount', book.discount || 0);
        formData.append('rating', book.rating || 0);
        formData.append('age_group', book.age_group || '');
        formData.append('language', book.language || '');
        formData.append('publisherDate', book.publisherDate || '');

        // Cover image
        // Cover image
if (book.cover) {
  try {
    // استخراج اسم الملف من المسار
    const fileName = book.cover.split('/').pop(); // "اسم الملف.jpg"

    // الوصول إلى الملف في مجلد public (الملف يجب أن يكون ضمن public/storage/cover)
    const fileInput = document.querySelector(`#coverInput[data-filename="${fileName}"]`);

    if (fileInput && fileInput.files.length > 0) {
      formData.append('cover', fileInput.files[0]); // إضافة الصورة مباشرة
    } else {
      console.warn(`⚠️ File not found for "${book.title}": ${fileName}`);
    }
  } catch (err) {
    console.warn(`⚠️ Failed to append cover for "${book.title}":`, err);
  }
}


console.log(formData);

        // Send to API
        await bookStore.addBook(formData);
      }

      alert('Data imported successfully!');
      event.target.value = '';
    } catch (error) {
      console.error('Error during data import:', error);
      alert('Failed to import data. Please check the console for more details.');

    }
  };

  reader.readAsArrayBuffer(file);
};



const triggerImport = () => {
  document.getElementById('import-input').click()
}

// الإحصائيات
const stats = computed(() => [
  {
    label: translations.value.dashboard?.books?.stats?.total,
    value: bookStore.stats.books?.toString() || '0',
    icon: 'fas fa-book text-blue-500',
    iconBg: 'bg-blue-50'
  },
  {
    label: translations.value.dashboard?.books?.stats?.authors,
    value: bookStore.stats.authors?.toString() || '0',
    icon: 'fas fa-user-pen text-green-500',
    iconBg: 'bg-green-50'
  },
  {
    label: translations.value.dashboard?.books?.stats?.publishers,
    value: bookStore.stats.publishers?.toString() || '0',
    icon: 'fas fa-building text-[var(--color-light)]',
    iconBg: 'bg-yellow-50'
  },
  {
    label: translations.value.dashboard?.books?.stats?.categories,
    value: bookStore.stats.categories?.toString() || '0',
    icon: 'fas fa-layer-group text-emerald-500',
    iconBg: 'bg-emerald-50'
  }
])

// تصفية البيانات
const filteredBooks = computed(() => {
  let filtered = books.value

  if (activeFilter.value !== 'All Books') {
    // Ensure book.status is a number for comparison
    filtered = filtered.filter((book) => Number(book.status) === activeFilter.value)
  }

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (book) =>
        (book.title || '').toLowerCase().includes(query) ||
        (book.author?.name || '').toLowerCase().includes(query) ||
        (book.publisher?.name || '').toLowerCase().includes(query)
    )
  }

  return filtered
})

// Watch for filter changes to reset pagination
watch([activeFilter, searchQuery], () => {
  currentPage.value = 1
  bookStore.fetchBooks({ page: 1, status: activeFilter.value !== 'All Books' ? activeFilter.value : undefined, search: searchQuery.value })
})

// تصنيف الحالة
const getStatusClass = (status) => {
  const numericStatus = Number(status)
  if (numericStatus === 1) {
    return 'bg-green-50 text-green-700' // Published
  } else if (numericStatus === 2) {
    return 'bg-yellow-50 text-yellow-700' // Pending
  } else if (numericStatus === 3) {
    return 'bg-red-50 text-red-700' // Draft
  } else {
    return 'bg-gray-50 text-gray-700' // Default
  }
}

const getStatusItem = (status) => {
  const numericStatus = Number(status)
  if (numericStatus === 1) {
    return translations.value.dashboard?.books?.status?.published
  } else if (numericStatus === 2) {
    return translations.value.dashboard?.books?.status?.pending
  } else if (numericStatus === 3) {
    return translations.value.dashboard?.books?.status?.draft
  } else {
    return translations.value.dashboard?.books?.status?.unknown
  }
}

const handleSaveBook = async (formData) => {
  const success = await bookStore.addBook(formData)
  showAddBookModal.value = false
  if (success) {
    alert(translations.value.dashboard?.books?.addSuccess)
  } else {
    alert(translations.value.dashboard?.books?.addFailed)
  }
}

const openEditModal = (book) => {
  selectedBook.value = book
  showEditBookModal.value = true
}

const handleUpdateBook = (updatedBook) => {
  bookStore.updateBook(updatedBook.id, updatedBook)
  showEditBookModal.value = false
  alert(translations.value.dashboard?.books?.updateSuccess)
}

const handlePageChange = (page) => {
  currentPage.value = page
  bookStore.fetchBooks({
    page,
    status: activeFilter.value !== 'All Books' ? activeFilter.value : undefined,
    search: searchQuery.value
  })
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
        <h1 class="text-2xl md:text-3xl font-bold text-gray-800">
          {{ translations.dashboard?.books?.title }}
        </h1>
        <p class="text-gray-600 mt-1">{{ translations.dashboard?.books?.subtitle }}</p>
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
      <div
        class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6"
      >
        <div class="flex flex-wrap gap-2">
          <button
            v-for="filter in filters"
            :key="filter.value"
            @click="activeFilter = filter.value"
            :class="[
              'px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium transition-all duration-200',
              activeFilter === filter.value
                ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                : 'hover:bg-gray-50'
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
              :placeholder="translations.dashboard?.books?.searchPlaceholder"
              class="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-light)] focus:border-[var(--color-light)]"
            />
            <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
          </div>
          <button
            @click="showAddBookModal = true"
            class="px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white font-medium hover:bg-[var(--color-hover)] transition-colors duration-200"
          >
            {{ translations.dashboard?.books?.addNew }}
          </button>
          <button @click="exportData" class="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium transition-all duration-200 bg-blue-500 text-white hover:bg-blue-600">
            Export Data
          </button>
          <input type="file" id="import-input" @change="importData" accept=".xlsx, .xls" style="display: none" />
          <button @click="triggerImport" class="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium transition-all duration-200 bg-green-500 text-white hover:bg-green-600">
            Import Data
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
                  {{ translations.dashboard?.books?.table?.id }}
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {{ translations.dashboard?.books?.table?.cover}}
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {{ translations.dashboard?.books?.table?.title }}
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {{ translations.dashboard?.books?.table?.category }}
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {{ translations.dashboard?.books?.table?.author }}
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {{ translations.dashboard?.books?.table?.publisher }}
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {{ translations.dashboard?.books?.table?.status }}
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {{ translations.dashboard?.books?.table?.price }}
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {{ translations.dashboard?.books?.table?.date }}
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {{ translations.dashboard?.books?.table?.action }}
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
                  <img
                    :src="`${apiBaseUrl}${book.cover}`"
                    alt="cover"
                    class="w-10 h-14 rounded shadow"
                  />
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{{ book.title }}</td>
                <td  class="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                  <RouterLink :to="`/dashboard/categories/${book.category.id}`">
                    {{ book.category.name }}
                  </RouterLink>

                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  <RouterLink :to="`/dashboard/authors/${book.author.id}`">
                    {{ book.author.name }}
                  </RouterLink>

                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  <RouterLink :to="`/dashboard/publishing-house/${book.publisher.id}`">
                     {{ book.publisher.name }}
                  </RouterLink>

                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="getStatusClass(book.status)"
                    class="px-3 py-1 rounded-full text-xs font-medium"
                  >
                    {{ getStatusItem(book.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {{ book.price + settingStore.currency }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {{ book.publisherDate }}
                </td>
                <td class="mt-3 px-6 py-4 whitespace-nowrap text-center text-sm flex gap-3">
                  <RouterLink
                    :to="`/dashboard/books/${book.id}`"
                    class="text-[var(--color-primary)] hover:text-[var(--color-primary)] flex items-center gap-1 text-sm font-medium"
                  >
                    <i class="far fa-eye"></i> {{ translations.dashboard?.books?.actions?.view }}
                  </RouterLink>
                  <button
                    @click="openEditModal(book)"
                    class="text-indigo-600 hover:text-indigo-900"
                  >
                    {{ translations.dashboard?.books?.actions?.edit }}
                  </button>
                  <button @click="Deletebook(book)" class="text-red-600 hover:text-red-900">
                    {{ translations.dashboard?.books?.actions?.delete }}
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
          <h3 class="text-lg font-medium text-gray-900 mb-1">
            {{ translations.dashboard?.books?.emptyHeader }}
          </h3>
          <p class="text-gray-500">
            {{ translations.dashboard?.books?.emptySubtext }}
          </p>
        </div>
      </div>
        <!-- pagination -->
    <Pagination
      v-if="bookStore.pagination"
      :current-page="currentPage"
      :last-page="bookStore.pagination.last_page"
      :total-items="bookStore.pagination.total"
      @page-changed="handlePageChange"
    />
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
