<script setup lang="ts">
import CategoryItem from './CategoryItem.vue'
import type { Category } from '@/types'

defineProps<{
  categories: Category[]
}>()
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 mt-5 mb-8">
    <span class="block w-full h-px bg-gray-300 my-8"></span>

    <!-- 🟢 حاوية التمرير -->
    <div class="overflow-x-auto pb-4">
      <!-- 🟢 صف أفقي غير قابل للضغط -->
      <div class="inline-flex items-start gap-4 pl-4">
        <CategoryItem
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