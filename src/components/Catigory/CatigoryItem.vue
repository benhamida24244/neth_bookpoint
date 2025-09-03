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
<a :href="category.url"
   class="flex flex-col items-center justify-center gap-3 p-4 w-36 text-center group">

  <div class="w-20 h-20 flex items-center justify-center rounded-full bg-[var(--color-hover)] text-white group-hover:scale-110 transition-transform duration-300">
    <span :class="['fas', category.icon ? category.icon : 'fa-book', 'text-3xl']"></span>
  </div>

  <p class="text-sm font-semibold uppercase tracking-wider">{{ category.name }}</p>
</a>

</template>
