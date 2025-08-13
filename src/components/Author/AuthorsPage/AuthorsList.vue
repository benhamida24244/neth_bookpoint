<script setup>
import { defineProps } from 'vue'
import AuthorItem from './AuthorsItems.vue'

defineProps({
  authors: {
    type: Array,
    required: true
  }
})
</script>

<template>
  <div class="w-full max-w-7xl mx-auto px-4 py-6">
    <h2 class="text-2xl font-bold text-[var(--color-primary)] mb-6 font-BonaRegular text-center">Featured Authors</h2>
    <div class="flex flex-wrap gap-6 justify-center">
      <AuthorItem
        v-for="author in authors"
        :key="author.id || author.name"
        :author="author"
      />
    </div>
  </div>
</template>
