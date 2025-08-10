<script setup>
import AdminCategoriesTable from '@/components/Dashboard/Table/AdminCategoriesTable.vue';
import { useCategoriesStore } from '@/stores/Categories';
import { computed } from 'vue';

const categoriesStore = useCategoriesStore()
const categories = computed(() => categoriesStore.categories);

const cartsCategories = computed(() => [
  {
    id: 1,
    name: 'Total Categories',
    icon: 'fas fa-layer-group text-white',
    value: categories.value.length.toString(),
    color: 'bg-blue-500',
  },
  {
    id: 2,
    name: 'Active Categories',
    icon: 'fas fa-check-circle text-white',
    value: categories.value.filter(category => category.status === 'active').length.toString(),
    color: 'bg-green-500',
  },
  {
    id: 3,
    name: 'New This Month',
    icon: 'fas fa-star text-white',
    value: categoriesStore.getNew.length.toString(), // لأنه getter يُتعامل معه كمصفوفة مباشرة
    color: 'bg-yellow-500',
  },
])
</script>


<template>
  <div class="p-8">
    <!-- Title -->
    <header class="font-BonaRegular mb-8">
      <h1 class="font-bold text-3xl text-gray-800">Categories Dashboard</h1>
      <p class="text-gray-500 text-base">Track and manage all your categories efficiently.</p>
    </header>

    <!-- Stats Cards -->
    <div class="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-8">
      <div
        v-for="({ id, name, icon, value, color }) in cartsCategories"
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
    <AdminCategoriesTable
      :categories="categories"
      />
  </div>
</template>
