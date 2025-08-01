<script setup>
import AdminCategoriesTable from '@/components/Dashboard/Table/AdminCategoriesTable.vue';

const cartsCategories = [
  {
    id: 1,
    name: 'Total Categories',
    icon: 'fas fa-layer-group text-white',
    value: 23,
    color: 'bg-blue-500',
  },
  {
    id: 2,
    name: 'Active Categories',
    icon: 'fas fa-check-circle text-white',
    value: 18,
    color: 'bg-green-500',
  },
  {
    id: 3,
    name: 'New This Month',
    icon: 'fas fa-star text-white',
    value: 2,
    color: 'bg-yellow-500',
  },
]
const categories = [
  {
    id: 1,
    name: 'Programming',
    slug: 'programming',
    status: 'active',
    createdAt: '2025-07-10T12:00:00Z',
  },
  {
    id: 2,
    name: 'Design',
    slug: 'design',
    status: 'inactive',
    createdAt: '2025-06-28T09:20:00Z',
  },
  {
    id: 3,
    name: 'Marketing',
    slug: 'marketing',
    status: 'active',
    createdAt: '2025-07-30T17:45:00Z',
  },
]
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
