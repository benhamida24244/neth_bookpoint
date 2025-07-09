<script setup lang="ts">
import { ref } from 'vue'
import CatigoryItem from './CatigoryItem.vue'

const categories = ref([
  { id: 1, name: 'Mystery & Thriller', icon: 'pi-search', color: 'bg-yellow-700', url: '#' },
  { id: 2, name: 'Science Fiction', icon: 'pi-globe', color: 'bg-yellow-700', url: '#' },
  { id: 3, name: 'Fantasy', icon: 'pi-sparkles', color: 'bg-yellow-700', url: '#' },
  { id:4, name: 'Romance', icon: 'pi-heart-fill', color: 'bg-yellow-700', url: '#' },
  { id: 5, name: 'History', icon: 'pi-book', color: 'bg-yellow-700', url: '#' },
  { id: 6, name: 'Kids', icon: 'pi-prime', color: 'bg-yellow-700', url: '#' }
])
</script>

<template>
  <div class="w-full max-w-6xl mx-auto px-4 mt-5 mb-8">
    <span class="block w-full h-px bg-gray-300 my-8"></span>
    <div
      class="flex justify-start items-center gap-4 lg:justify-center overflow-x-auto pb-4"
    >
      <CatigoryItem v-for="category in categories" :key="category.id" :category="category" />
    </div>
    <span class="block w-full h-px bg-gray-300 my-8"></span>
  </div>
</template>
