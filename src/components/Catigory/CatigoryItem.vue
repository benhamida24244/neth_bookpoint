<script setup>
import { defineProps } from 'vue'

defineProps({
  category: {
    type: Object,
    required: true
  }
})
</script>

<template>
 <a :href="category.url" class="flex flex-col items-center justify-center gap-3 p-2 w-36 flex-shrink-0 text-center group">
  <span :class="['pi', category.icon, category.color, 'text-5xl p-4 rounded-full text-white group-hover:scale-110 transition-transform duration-300']"></span>
  <p class="text-sm font-semibold uppercase tracking-wider">{{ category.name }}</p>
 </a>
</template>
