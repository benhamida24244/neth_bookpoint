<script setup lang="ts">
import CatigoryItem from './CatigoryItem.vue'
import { useCategoriesStore } from '@/stores/Categories'

const categoriesStore = useCategoriesStore()
const categories = categoriesStore.categories
</script>

<template>
  <div class="w-full mx-auto px-4 mt-5 mb-8">
    <span class="block w-full h-px bg-gray-300 my-8"></span>

    <!-- 🟢 حاوية التمرير -->
    <div class="overflow-x-auto pb-4">
      <!-- 🟢 صف أفقي غير قابل للضغط -->
      <div class="inline-flex items-start gap-4 pl-4">
        <CatigoryItem
          v-for="category in categories"
          :key="category.id"
          :category="category"
          class="shrink-0"
        />
      </div>
    </div>

    <span class="block w-full h-px bg-gray-300 my-8"></span>
  </div>
</template>
