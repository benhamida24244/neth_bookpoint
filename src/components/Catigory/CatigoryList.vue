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
      class="flex justify-start items-center gap-4 lg:justify-center overflow-x-auto pb-4"
    >
      <CatigoryItem v-for="category in categories" :key="category.id" :category="category" />
    </div>
    <span class="block w-full h-px bg-gray-300 my-8"></span>
  </div>
</template>
