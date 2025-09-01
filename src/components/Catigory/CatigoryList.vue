<script setup lang="ts">
import CatigoryItem from './CatigoryItem.vue'

defineProps({
  categories: {
    type: Array,
    required: true
  }
})
</script>

<template>
  <div class="w-full max-w-6xl mx-auto px-4 mt-5 mb-8">
    <span class="block w-full h-px bg-gray-300 my-8"></span>
    <div
      class="flex justify-start items-center gap-4 overflow-x-auto pb-4 category-list"
    >
      <CatigoryItem v-for="category in categories" :key="category.id" :category="category" />
    </div>
    <span class="block w-full h-px bg-gray-300 my-8"></span>
  </div>
</template>

<style scoped>
.category-list::-webkit-scrollbar {
  height: 8px;
}

.category-list::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.category-list::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.category-list::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
