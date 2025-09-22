<script setup>
import { useAuthorStore } from '@/stores/Authors'
import { ref, computed, onMounted } from 'vue'
import AddAuthorModal from '@/components/Dashboard/Modals/AddAuthorModal.vue'
import * as XLSX from 'xlsx'
import { useI18n } from 'vue-i18n'
import LoaderWithText from '@/components/LoaderWithText.vue'

const { t } = useI18n()
const addAuthorModal = ref(null)
const searchQuery = ref('')
const selectedCountry = ref('')
const sortBy = ref('name')
const sortOrder = ref('asc')
const authorsStore = useAuthorStore()

onMounted(async () => {
  await authorsStore.fetchAuthors()
})

const authors = computed(() => authorsStore.authors)
const isLoading = computed(() => authorsStore.isLoading)

const filteredAuthors = computed(() => {
  let filtered = authors.value.filter((author) => {
    const matchesSearch = author.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCountry = selectedCountry.value === '' || author.Country === selectedCountry.value
    return matchesSearch && matchesCountry
  })

  filtered.sort((a, b) => {
    let aValue = a[sortBy.value]
    let bValue = b[sortBy.value]
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortOrder.value === 'asc' ? aValue - bValue : bValue - aValue
    }
    aValue = String(aValue).toLowerCase()
    bValue = String(bValue).toLowerCase()
    if (sortOrder.value === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
    }
  })
  return filtered
})

const totalOrders = computed(() => filteredAuthors.value.reduce((sum, author) => sum + author.Orders_count, 0))
const totalBooks = computed(() => filteredAuthors.value.reduce((sum, author) => sum + author.nmbBook, 0))

const countries = computed(() => [...new Set(authors.value.map((author) => author.Country))].sort())

const clearFilters = () => {
  searchQuery.value = ''
  selectedCountry.value = ''
  sortBy.value = 'name'
  sortOrder.value = 'asc'
}

const handleSort = (field) => {
  if (sortBy.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = field
    sortOrder.value = 'asc'
  }
}

const getSortIcon = (field) => {
  if (sortBy.value !== field) return '↕️'
  return sortOrder.value === 'asc' ? '↑' : '↓'
}

const exportData = () => {
  const data = filteredAuthors.value.map((author) => ({
    ID: author.id,
    Name: author.name,
    Country: author.Country,
    Orders: author.Orders_count,
    Rewards: author.SpendMuch,
    Books: author.nmbBook,
  }))
  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Authors')
  XLSX.writeFile(wb, 'authors.xlsx')
}

const triggerImport = () => document.getElementById('import-input').click()

const importData = async (event) => {
  const file = event.target.files[0]
  const reader = new FileReader()
  reader.onload = async (e) => {
    try {
      const data = new Uint8Array(e.target.result)
      const workbook = XLSX.read(data, { type: 'array' })
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      const json = XLSX.utils.sheet_to_json(worksheet)
      
      for (const author of json) {
        const formData = new FormData()
        formData.append('name', author.name)
        formData.append('Country', author.Country)
        
        if (author.descriptionKey) {
          formData.append('descriptionKey', author.descriptionKey)
        }
        
        if (author.img) {
          try {
            const response = await fetch(author.img)
            const blob = await response.blob()
            // تحويل blob إلى ملف
            const fileName = author.name.replace(/\s+/g, '_') + '.jpg'
            const fileImg = new File([blob], fileName, { type: blob.type })
            formData.append('img', fileImg)
          } catch (err) {
            console.warn(`⚠️ فشل تحميل صورة للكاتب ${author.name}:`, err)
          }
        }
        
        if (author.Registration_date) {
          formData.append('Registration_date', author.Registration_date)
        }
        
        await authorsStore.addAuthor(formData)
      }
      
      alert(t('dashboard.authors.importSuccess'))
      event.target.value = ''
    } catch (error) {
      console.error('Error during data import:', error)
      alert(t('dashboard.authors.importFailed'))
    }
  }
  reader.readAsArrayBuffer(file)
}

const deleteAuthor = (authorId) => {
  if (window.confirm(t('dashboard.authors.deleteConfirm'))) {
    authorsStore.deleteAuthor(authorId)
  }
}

const openEditModal = (author) => addAuthorModal.value.openModal(author)

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
</script>

<template>
  <div class="p-4 md:p-8 min-h-screen bg-gray-50">
    <AddAuthorModal ref="addAuthorModal" />
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <LoaderWithText :loading="isLoading" :message="t('dashboard.authorDetails.loading')" />
    </div>

    <div v-else>
      <!-- Header -->
      <div class="mb-8 font-BonaRegular ltr:text-left rtl:text-right">
        <h1 class="text-2xl md:text-3xl font-bold text-gray-800">{{ t('dashboard.authors.title') }}</h1>
        <p class="text-gray-600 mt-1">{{ t('dashboard.authors.subtitle') }}</p>
      </div>

      <!-- Filters and Actions -->
      <div class="mb-6 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div class="relative">
            <i class="fas fa-search absolute top-1/2 -translate-y-1/2 text-gray-400 ltr:left-3 rtl:right-3"></i>
            <input v-model="searchQuery" :placeholder="t('dashboard.authors.search')" type="text" class="w-full ltr:pl-10 rtl:pr-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-light)]"/>
          </div>
          <select v-model="selectedCountry" class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-light)]">
            <option value="">{{ t('dashboard.authors.filters.allCountries') }}</option>
            <option v-for="country in countries" :key="country" :value="country">{{ country }}</option>
          </select>
          <button @click="clearFilters" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 whitespace-nowrap">
            {{ t('dashboard.authors.clearFilters') }}
          </button>
        </div>
        <div class="mt-4 flex flex-col sm:flex-row gap-2 justify-end">
            <button @click="addAuthorModal.openModal()" class="px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white font-medium hover:bg-[var(--color-hover)] transition-colors duration-200">
              {{ t('dashboard.authors.addAuthor') }}
            </button>
            <button @click="exportData" class="px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-200 bg-blue-500 text-white hover:bg-blue-600">
              {{ t('dashboard.authors.export') }}
            </button>
            <input type="file" id="import-input" @change="importData" accept=".xlsx, .xls" class="hidden" />
            <button @click="triggerImport" class="px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-200 bg-green-500 text-white hover:bg-green-600">
              {{ t('dashboard.authors.import') }}
            </button>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div class="p-4 bg-white rounded-xl shadow-sm border flex items-center gap-4"><i class="fas fa-users text-xl text-blue-500"></i><div><p class="text-sm text-gray-500">{{ t('dashboard.authors.totalAuthors') }}</p><p class="text-lg font-bold text-gray-800">{{ filteredAuthors.length }}</p></div></div>
        <div class="p-4 bg-white rounded-xl shadow-sm border flex items-center gap-4"><i class="fas fa-shopping-cart text-xl text-green-500"></i><div><p class="text-sm text-gray-500">{{ t('dashboard.authors.totalOrders') }}</p><p class="text-lg font-bold text-gray-800">{{ totalOrders }}</p></div></div>
        <div class="p-4 bg-white rounded-xl shadow-sm border flex items-center gap-4"><i class="fas fa-book text-xl text-purple-500"></i><div><p class="text-sm text-gray-500">{{ t('dashboard.authors.totalBooks') }}</p><p class="text-lg font-bold text-gray-800">{{ totalBooks }}</p></div></div>
      </div>

      <!-- Desktop Table -->
      <div class="hidden lg:block bg-white rounded-xl shadow-sm border overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr class="ltr:text-left rtl:text-right">
              <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"><span class="flex items-center gap-2 cursor-pointer" @click="handleSort('name')">{{ t('dashboard.authors.name') }} {{ getSortIcon('name') }}</span></th>
              <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"><span class="flex items-center gap-2 cursor-pointer" @click="handleSort('Orders_count')">{{ t('dashboard.authors.orders') }} {{ getSortIcon('Orders_count') }}</span></th>
              <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"><span class="flex items-center gap-2 cursor-pointer" @click="handleSort('nmbBook')">{{ t('dashboard.authors.books') }} {{ getSortIcon('nmbBook') }}</span></th>
              <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{{ t('dashboard.authors.country') }}</th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">{{ t('dashboard.authors.action') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="author in filteredAuthors" :key="author.id" class="hover:bg-gray-50 ltr:text-left rtl:text-right">
              <td class="px-6 py-4 whitespace-nowrap"><div class="flex items-center gap-3"><img class="h-10 w-10 rounded-full object-cover" :src="`${apiBaseUrl}${author.img}`" :alt="author.name"/><span class="font-medium text-gray-900">{{ author.name }}</span></div></td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ author.Orders_count }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ author.nmbBook }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ author.Country }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium"><div class="flex items-center justify-center gap-4"><RouterLink :to="`/dashboard/authors/${author.id}`" class="text-gray-500 hover:text-[var(--color-primary)]"><i class="far fa-eye"></i></RouterLink><button @click="openEditModal(author)" class="text-gray-500 hover:text-indigo-600"><i class="fas fa-pen"></i></button><button @click="deleteAuthor(author.id)" class="text-gray-500 hover:text-red-600"><i class="fas fa-trash"></i></button></div></td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile/Tablet Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:hidden">
        <div v-for="author in filteredAuthors" :key="author.id" class="bg-white rounded-xl shadow-sm border overflow-hidden ltr:text-left rtl:text-right">
          <div class="p-4 flex items-center gap-4">
            <img class="h-16 w-16 rounded-full object-cover shadow-md" :src="`${apiBaseUrl}${author.img}`" :alt="author.name"/>
            <div>
              <h3 class="font-bold text-lg text-gray-800">{{ author.name }}</h3>
              <p class="text-sm text-gray-500">{{ author.Country }}</p>
            </div>
          </div>
          <div class="px-4 pb-4 space-y-2 text-sm">
            <div class="flex justify-between items-center border-t pt-2"><span class="text-gray-500">{{ t('dashboard.authors.orders') }}</span><span class="font-semibold text-gray-700">{{ author.Orders_count }}</span></div>
            <div class="flex justify-between items-center"><span class="text-gray-500">{{ t('dashboard.authors.books') }}</span><span class="font-semibold text-gray-700">{{ author.nmbBook }}</span></div>
          </div>
          <div class="bg-gray-50 p-3 flex justify-end gap-3">
            <RouterLink :to="`/dashboard/authors/${author.id}`" class="text-gray-500 hover:text-[var(--color-primary)] p-2 rounded-full hover:bg-gray-100"><i class="far fa-eye"></i></RouterLink>
            <button @click="openEditModal(author)" class="text-gray-500 hover:text-indigo-600 p-2 rounded-full hover:bg-gray-100"><i class="fas fa-pen"></i></button>
            <button @click="deleteAuthor(author.id)" class="text-gray-500 hover:text-red-600 p-2 rounded-full hover:bg-gray-100"><i class="fas fa-trash"></i></button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredAuthors.length === 0" class="text-center py-12 bg-white rounded-xl shadow-sm border mt-6">
        <i class="fas fa-users-slash text-gray-400 text-4xl mx-auto"></i>
        <h3 class="mt-4 text-lg font-medium text-gray-900">{{ t('dashboard.authors.noAuthors') }}</h3>
        <p class="mt-1 text-sm text-gray-500">{{ t('dashboard.authors.adjustFilters') }}</p>
        <button @click="clearFilters" class="mt-4 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-hover)] transition-colors">
          {{ t('dashboard.authors.clearFilters') }}
        </button>
      </div>
    </div>
  </div>
</template>