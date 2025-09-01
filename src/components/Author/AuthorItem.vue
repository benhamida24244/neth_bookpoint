<script setup>
import { defineProps,computed } from 'vue'

const props = defineProps({
  author: {
    type: Object,
    required: true
  }
})

const ImageUrl = computed(() => {
  if (props.author.img && props.author.img.startsWith('http')) {
    return props.author.img;
  }
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  return `${baseUrl}${props.author.img}`;
});
</script>

<template>
 <a :href="author.url" class="flex flex-col items-center justify-center gap-3 p-2 w-36 flex-shrink-0 text-center group">
  <img
    :src="ImageUrl"
    :alt="author.name"
    class="w-24 h-24 object-cover rounded-full group-hover:scale-110 transition-transform duration-300"
  />
  <p class="text-sm font-semibold uppercase tracking-wider">{{ author.name }}</p>
 </a>
</template>
