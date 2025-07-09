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
  <div class="flex gap-4 p-4 overflow-x-auto justify-center">
    <AuthorItem v-for="author in authors" :key="author.id || author.name" :author="author" />
  </div>
</template>
