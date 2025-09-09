<script setup>
import AdminCategoriesTable from '@/components/Dashboard/Table/AdminCategoriesTable.vue'
import { useCategoriesStore } from '@/stores/Categories'
import { useI18n } from 'vue-i18n'
import { computed, ref, onMounted } from 'vue'
import AddCategoryModal from '@/components/Dashboard/Modals/AddCategoryModal.vue'
import * as XLSX from 'xlsx'

const { t } = useI18n()
const categoriesStore = useCategoriesStore()

onMounted(async () => {
  await categoriesStore.fetchCategories()
})

// Make categories reactive by using computed
const categories = computed(() => categoriesStore.categories)
const showAddCategoryModal = ref(false)

const cartsCategories = computed(() => [
  {
    id: 1,
    name: t('dashboard.categories.totalCategories'),
    icon: 'fas fa-layer-group text-white',
    value: categories.value.length.toString(),
    color: 'bg-blue-500'
  },
  {
    id: 2,
    name: t('dashboard.categories.activeCategories'),
    icon: 'fas fa-check-circle text-white',
    value: categories.value.filter((category) => category.status === 1).length.toString(),
    color: 'bg-green-500'
  },
  {
    id: 3,
    name: t('dashboard.categories.newThisMonth'),
    icon: 'fas fa-star text-white',
    value: '0', // The getNew getter was removed, setting to static value.
    color: 'bg-[var(--color-light)]'
  }
])

const handleCategoryAdded = () => {
  // The store action now handles refetching, so we just need to close the modal.
  showAddCategoryModal.value = false
}

const exportData = () => {
  const data = categories.value.map(category => ({
    'ID': category.id,
    'Name': category.name,
    'Status': category.status === 1 ? 'Active' : 'Inactive',
  }))
  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Categories')
  XLSX.writeFile(wb, 'categories.xlsx')
}

const importData = (event) => {
  const file = event.target.files[0]
  const reader = new FileReader()
  reader.onload = async (e) => {
    try {
      const data = new Uint8Array(e.target.result)
      const workbook = XLSX.read(data, { type: 'array' })
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      const json = XLSX.utils.sheet_to_json(worksheet)
      for (const category of json) {
        await categoriesStore.addCategory({
          name: category.name,
          icon: category.icon,
          description: category.description,
        })
      }
      alert('Data imported successfully!')
      // Optionally, reset the file input
      event.target.value = ''
    } catch (error) {
      console.error('Error during data import:', error)
      alert('Failed to import data. Please check the console for more details.')
    }
  }
  reader.readAsArrayBuffer(file)
}

const triggerImport = () => {
  document.getElementById('import-input').click()
}
</script>

<template>
  <div class="p-8">
    <AddCategoryModal
      :show="showAddCategoryModal"
      @close="showAddCategoryModal = false"
      @save="handleCategoryAdded"
    />
    <!-- Title -->
    <header class="font-BonaRegular mb-8 flex justify-between items-center">
      <div>
        <h1 class="font-bold text-3xl text-gray-800">
          {{ t('dashboard.categories.title') }}
        </h1>
        <p class="text-gray-500 text-base">{{ t('dashboard.categories.subtitle') }}</p>
      </div>
      <div class="flex items-center gap-4">
        <button
          @click="showAddCategoryModal = true"
          class="px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white font-medium hover:bg-[var(--color-hover)] transition-colors duration-200"
        >
          Add New Category
        </button>
        <button @click="exportData" class="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium transition-all duration-200 bg-blue-500 text-white hover:bg-blue-600">
          Export Data
        </button>
        <input type="file" id="import-input" @change="importData" accept=".xlsx, .xls" style="display: none" />
        <button @click="triggerImport" class="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium transition-all duration-200 bg-green-500 text-white hover:bg-green-600">
          Import Data
        </button>
      </div>
    </header>

    <!-- Stats Cards -->
    <div class="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-8">
      <div
        v-for="{ id, name, icon, value, color } in cartsCategories"
        :key="id"
        class="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100"
      >
        <div :class="['w-10 h-10 rounded-full flex items-center justify-center', color]">
          <i :class="icon"></i>
        </div>
        <div>
          <h3 class="text-gray-500 text-sm font-medium">{{ name }}</h3>
          <p class="text-gray-800 text-2xl font-bold">{{ value }}</p>
        </div>
      </div>
    </div>
    <!-- Categories Table -->
    <AdminCategoriesTable/>
  </div>
</template>
