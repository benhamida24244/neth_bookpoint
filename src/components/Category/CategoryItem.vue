<script setup lang="ts">
import { defineProps } from 'vue'
import { RouterLink } from 'vue-router';
import type { Category } from '@/types'

defineProps<{
  category: Category
}>()

</script>

<template>
<RouterLink :to="`/category/${category.id}`"
   class="flex flex-col items-center justify-center gap-3 p-4 w-36 text-center group">

  <div class="w-20 h-20 flex items-center justify-center rounded-full bg-[var(--color-hover)] text-white group-hover:scale-110 transition-transform duration-300">
    <span :class="['fas', category.icon ? category.icon : 'fa-book', 'text-3xl']"></span>
  </div>

  <p class="text-sm font-semibold uppercase tracking-wider">{{ category.name }}</p>
</RouterLink>

</template>