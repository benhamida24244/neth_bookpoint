<script setup>
import AdminCategoriesTable from '@/components/Dashboard/Table/AdminCategoriesTable.vue'
import { useCategoriesStore } from '@/stores/Categories'
import { useLanguageStore } from '@/stores/language'
import { computed, ref } from 'vue'
import AddCategoryModal from '@/components/Dashboard/Modals/AddCategoryModal.vue'

const categoriesStore = useCategoriesStore()
const categories = computed(() => categoriesStore.categories)
const showAddCategoryModal = ref(false)
const languageStore = useLanguageStore()
const translations = computed(() => languageStore.translations)

const cartsCategories = computed(() => [
  {
    id: 1,
    name: translations.value.dashboard?.categories?.totalCategories,
    icon: 'fas fa-layer-group text-white',
    value: categories.value.length.toString(),
    color: 'bg-blue-500'
  },
  {
    id: 2,
    name: translations.value.dashboard?.categories?.activeCategories,
    icon: 'fas fa-check-circle text-white',
    value: categories.value.filter((category) => category.status === 'active').length.toString(),
    color: 'bg-green-500'
  },
  {
    id: 3,
    name: translations.value.dashboard?.categories?.newThisMonth,
    icon: 'fas fa-star text-white',
    value: categoriesStore.getNew.length.toString(), // لأنه getter يُتعامل معه كمصفوفة مباشرة
    color: 'bg-[var(--color-light)]'
  }
])

const handleSaveCategory = (newCategory) => {
  categoriesStore.addCategory(newCategory)
  showAddCategoryModal.value = false
  alert('Category added successfully!')
}
</script>

<template>
  <div class="p-8">
    <AddCategoryModal
      :show="showAddCategoryModal"
      @close="showAddCategoryModal = false"
      @save="handleSaveCategory"
    />
    <!-- Title -->
    <header class="font-BonaRegular mb-8 flex justify-between items-center">
      <div>
        <h1 class="font-bold text-3xl text-gray-800">
          {{ translations.dashboard?.categories?.title }}
        </h1>
        <p class="text-gray-500 text-base">{{ translations.dashboard?.categories?.subtitle }}</p>
      </div>
      <button
        @click="showAddCategoryModal = true"
        class="px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white font-medium hover:bg-[var(--color-primary-dark)] transition-colors duration-200"
      >
        Add New Category
      </button>
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
    <AdminCategoriesTable :categories="categories" />
  </div>
</template>
