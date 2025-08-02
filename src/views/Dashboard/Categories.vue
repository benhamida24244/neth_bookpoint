<script setup>
import AdminCategoriesTable from '@/components/Dashboard/Table/AdminCategoriesTable.vue';
import { ref } from 'vue';
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

const categories = ref([
  { id: 1, name: 'Mystery & Thriller', icon: 'pi-search', description: 'Exploring suspense and thrillers.', status: 'active', orders: 43, nmBook: 12, createdAt: '2025-07-10T12:00:00Z', color: 'bg-yellow-700', url: '#' },
  { id: 2, name: 'Science Fiction', icon: 'pi-globe', description: 'Futuristic and scientific imagination.', status: 'active', orders: 58, nmBook: 25, createdAt: '2025-07-09T11:30:00Z', color: 'bg-yellow-700', url: '#' },
  { id: 3, name: 'Fantasy', icon: 'pi-sparkles', description: 'Magical and mythical worlds.', status: 'active', orders: 75, nmBook: 33, createdAt: '2025-07-08T15:10:00Z', color: 'bg-yellow-700', url: '#' },
  { id: 4, name: 'Romance', icon: 'pi-heart-fill', description: 'Love and emotional stories.', status: 'active', orders: 92, nmBook: 40, createdAt: '2025-07-07T09:05:00Z', color: 'bg-yellow-700', url: '#' },
  { id: 5, name: 'History', icon: 'pi-book', description: 'Historical events and biographies.', status: 'inactive', orders: 21, nmBook: 18, createdAt: '2025-07-06T18:45:00Z', color: 'bg-yellow-700', url: '#' },
  { id: 6, name: 'Kids', icon: 'pi-prime', description: 'Fun stories for children.', status: 'active', orders: 110, nmBook: 50, createdAt: '2025-07-05T10:20:00Z', color: 'bg-yellow-700', url: '#' },
  { id: 7, name: 'Biography', icon: 'pi-user', description: 'Life stories of influential people.', status: 'active', orders: 35, nmBook: 15, createdAt: '2025-07-04T13:00:00Z', color: 'bg-yellow-700', url: '#' },
  { id: 8, name: 'Cooking', icon: 'pi-apple', description: 'Recipes and culinary arts.', status: 'active', orders: 48, nmBook: 22, createdAt: '2025-07-03T16:50:00Z', color: 'bg-yellow-700', url: '#' },
  { id: 9, name: 'Self-Help', icon: 'pi-sun', description: 'Guides for personal development.', status: 'inactive', orders: 65, nmBook: 28, createdAt: '2025-07-02T11:15:00Z', color: 'bg-yellow-700', url: '#' },
  { id: 10, name: 'Comics & Graphic Novels', icon: 'pi-palette', description: 'Visual storytelling.', status: 'active', orders: 88, nmBook: 45, createdAt: '2025-07-01T20:00:00Z', color: 'bg-yellow-700', url: '#' }
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
