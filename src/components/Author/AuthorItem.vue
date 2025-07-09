<script setup>
import { defineProps } from 'vue'

defineProps({
  author: {
    type: Object,
    required: true
  }
})
</script>

<template>
 <a :href="author.url" class="flex flex-col items-center justify-center gap-3 p-2 w-36 flex-shrink-0 text-center group">
  <img
    :src="author.img"
    :alt="author.name"
    class="w-24 h-24 object-cover rounded-full group-hover:scale-110 transition-transform duration-300"
  />
  <p class="text-sm font-semibold uppercase tracking-wider">{{ author.name }}</p>
 </a>
</template>
