<script setup>
import { defineProps } from 'vue'
import AuthorItem from './AuthorItem.vue'

defineProps({
  authors: {
    type: Array,
    required: true
  }
})
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 mt-5 mb-8">
      <!-- 🟢 حاوية التمرير -->
  <div class="overflow-x-auto p-4">
    <!-- 🟢 صف أفقي قابل للتمرير -->
    <div class="inline-flex gap-4">
      <AuthorItem
        v-for="author in authors"
        :key="author.id || author.name"
        :author="author"
        class="shrink-0"
      />
    </div>
  </div>
  </div>
</template>
