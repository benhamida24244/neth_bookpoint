<script setup>
import { useAuthorStore } from '@/stores/Authors'
import { ref, computed, onMounted } from 'vue'
import AddAuthorModal from '@/components/Dashboard/Modals/AddAuthorModal.vue'
import * as XLSX from 'xlsx'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const addAuthorModal = ref(null)
const searchQuery = ref('')
const selectedCountry = ref('')
const sortBy = ref('name')
const sortOrder = ref('asc')
const AuthorsStore = useAuthorStore()

onMounted(async () => {
  await AuthorsStore.fetchAuthors()
})

const authors = computed(() => AuthorsStore.authors)

// Computed properties for filtering and sorting
const filteredAuthors = computed(() => {
  let filtered = authors.value.filter((author) => {
    const matchesSearch = author.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCountry = selectedCountry.value === '' || author.Country === selectedCountry.value
    return matchesSearch && matchesCountry
  })

  // Sort the filtered results
  filtered.sort((a, b) => {
    let aValue = a[sortBy.value]
    let bValue = b[sortBy.value]

    // Handle numeric sorting
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortOrder.value === 'asc' ? aValue - bValue : bValue - aValue
    }

    // Handle string sorting
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

// Computed property for total orders
const totalOrders = computed(() => {
  return filteredAuthors.value.reduce((sum, author) => sum + author.Orders_count, 0)
})

// Computed property for unique countries
const countries = computed(() => {
  const uniqueCountries = [...new Set(authors.value.map((author) => author.Country))]
  return uniqueCountries.sort()
})

// Methods
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

        await AuthorsStore.addAuthor(formData)
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

const triggerImport = () => {
  document.getElementById('import-input').click()
}

const deleteAuthor = (authorId) => {
  if (window.confirm(t('dashboard.authors.deleteConfirm'))) {
    AuthorsStore.deleteAuthor(authorId)
  }
}

const openEditModal = (author) => {
  addAuthorModal.value.openModal(author)
}
</script>

<template>
  <div class="w-full sm:px-8 lg:px-16 mt-8">
    <AddAuthorModal ref="addAuthorModal" />

    <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
      <div class="flex flex-col sm:flex-row gap-4 w-full lg:w-2/3">
        <input
          v-model="searchQuery"
          :placeholder="t('dashboard.authors.search')"
          type="text"
          class="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
        />
        <select
          v-model="selectedCountry"
          class="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
        >
          <option value="">{{ t('dashboard.authors.filters.allCountries') }}</option>
          <option v-for="country in countries" :key="country" :value="country">
            {{ country }}
          </option>
        </select>
        <button
          @click="clearFilters"
          class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 whitespace-nowrap"
        >
          {{ t('dashboard.authors.clearFilters') }}
        </button>
      </div>

      <div class="flex gap-3 w-full lg:w-auto">
        <button
          @click="addAuthorModal.openModal()"
          class="bg-gray-200 text-black px-4 py-2 rounded-lg hover:bg-gray-300 flex-1 lg:flex-none"
        >
          {{ t('dashboard.authors.addAuthor') }}
        </button>
        <button
          @click="exportData"
          class="bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg hover:bg-[var(--color-primary)] flex-1 lg:flex-none"
        >
          {{ t('dashboard.authors.export') }}
        </button>
        <input
          type="file"
          id="import-input"
          @change="importData"
          accept=".xlsx, .xls"
          style="display: none"
        />
        <button
          @click="triggerImport"
          class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex-1 lg:flex-none"
        >
          {{ t('dashboard.authors.import') }}
        </button>
      </div>
    </div>

    <div class="flex flex-wrap gap-2 mb-4">
      <span class="text-sm font-medium text-gray-600 mr-2">{{ t('dashboard.authors.sortBy') }}</span>
      <button
        v-for="field in ['name', 'Orders_count', 'SpendMuch', 'nmbBook']"
        :key="field"
        @click="handleSort(field)"
        :class="[
          'px-3 py-1 text-xs rounded-full border transition-colors',
          sortBy === field
            ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
            : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50',
        ]"
      >
        {{ field === 'nmbBook' ? t('dashboard.authors.books') : field.replace('_', ' ') }}
        {{ getSortIcon(field) }}
      </button>
    </div>

    <div class="flex flex-col sm:flex-row justify-between mt-6 gap-4">
      <div class="flex items-center bg-yellow-50 px-4 py-2 rounded-lg">
        <p class="text-lg font-bold text-gray-600">{{ t('dashboard.authors.totalAuthors') }}</p>
        <span class="ml-2 text-[var(--color-primary)] font-bold text-lg">{{
          filteredAuthors.length
        }}</span>
      </div>
      <div class="flex items-center bg-green-50 px-4 py-2 rounded-lg">
        <p class="text-lg font-bold text-gray-600">{{ t('dashboard.authors.totalOrders') }}</p>
        <span class="ml-2 text-green-600 font-bold text-lg">{{ totalOrders }}</span>
      </div>
      <div class="flex items-center bg-blue-50 px-4 py-2 rounded-lg">
        <p class="text-lg font-bold text-gray-600">{{ t('dashboard.authors.totalBooks') }}</p>
        <span class="ml-2 text-blue-600 font-bold text-lg">
          {{ filteredAuthors.reduce((sum, author) => sum + author.nmbBook, 0) }}
        </span>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-6 mb-8">
      <div class="lg:hidden">
        <div v-for="author in filteredAuthors" :key="author.id" class="border-b border-gray-200 p-4">
          <div class="flex justify-between items-start mb-2">
            <h3 class="font-semibold text-gray-900">{{ author.name }}</h3>
            <span class="text-sm text-gray-500">#{{ author.id }}</span>
          </div>
          <div class="space-y-1 text-sm text-gray-600">
            <p>
              <span class="font-medium">{{ t('dashboard.authors.countryLabel') }}</span> {{ author.Country }}
            </p>
            <p>
              <span class="font-medium">{{ t('dashboard.authors.ordersLabel') }}</span> {{ author.Orders_count }}
            </p>
            <p>
              <span class="font-medium">{{ t('dashboard.authors.rewardsLabel') }}</span> ${{ author.SpendMuch?.toLocaleString() ?? '0' }}
            </p>
            <p>
              <span class="font-medium">{{ t('dashboard.authors.books') }}:</span> {{ author.nmbBook }}
            </p>
          </div>
          <div class="mt-3 flex items-center gap-4">
            <RouterLink
              :to="`/dashboard/authors/${author.id}`"
              class="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              {{ t('dashboard.authors.view') }}
            </RouterLink>
            <button
              @click="openEditModal(author)"
              class="text-green-600 hover:text-green-800 text-sm font-medium"
            >
              {{ t('dashboard.authors.edit') }}
            </button>
            <button
              @click="deleteAuthor(author.id)"
              class="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              {{ t('dashboard.authors.delete') }}
            </button>
          </div>
        </div>
      </div>

      <div class="hidden lg:block overflow-x-auto">
        <table class="min-w-full">
          <thead class="bg-gray-50">
            <tr>
              <th
                @click="handleSort('name')"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                {{ t('dashboard.authors.name') }} {{ getSortIcon('name') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ t('dashboard.authors.id') }}
              </th>
              <th
                @click="handleSort('Orders_count')"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                {{ t('dashboard.authors.orders') }} {{ getSortIcon('Orders_count') }}
              </th>
              <th
                @click="handleSort('SpendMuch')"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                {{ t('dashboard.authors.rewards') }} {{ getSortIcon('SpendMuch') }}
              </th>
              <th
                @click="handleSort('nmbBook')"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                {{ t('dashboard.authors.books') }} {{ getSortIcon('nmbBook') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ t('dashboard.authors.country') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ t('dashboard.authors.action') }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="author in filteredAuthors" :key="author.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{{ author.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-500">#{{ author.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-500">{{ author.Orders_count }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-500">
                ${{ author.SpendMuch?.toLocaleString() ?? '0' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-500">{{ author.nmbBook }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-500">{{ author.Country }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex items-center gap-4">
                  <RouterLink
                    :to="`/dashboard/authors/${author.id}`"
                    class="text-blue-600 hover:text-blue-800"
                  >
                    {{ t('dashboard.authors.view') }}
                  </RouterLink>
                  <button
                    @click="openEditModal(author)"
                    class="text-green-600 hover:text-green-800"
                  >
                    {{ t('dashboard.authors.edit') }}
                  </button>
                  <button @click="deleteAuthor(author.id)" class="text-red-600 hover:text-red-800">
                    {{ t('dashboard.authors.delete') }}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="filteredAuthors.length === 0" class="text-center py-12">
        <svg
          class="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">
          {{ t('dashboard.authors.noAuthors') }}
        </h3>
        <p class="mt-1 text-sm text-gray-500">{{ t('dashboard.authors.adjustFilters') }}</p>
        <button
          @click="clearFilters"
          class="mt-4 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary)]"
        >
          {{ t('dashboard.authors.clearFilters') }}
        </button>
      </div>
    </div>
  </div>
</template>
