<script setup>
import { defineProps } from 'vue'

defineProps({
  PublishingHouse: {
    type: Object,
    required: true
  }
})
</script>

<template>
 <a :href="PublishingHouse.url" class="flex flex-col items-center justify-center gap-3 p-2 w-36 flex-shrink-0 text-center group">
  <img
    :src="PublishingHouse.img"
    :alt="PublishingHouse.name"
    class="w-24 h-24 object-cover rounded-full group-hover:scale-110 transition-transform duration-300"
  />
  <p class="text-sm font-semibold uppercase tracking-wider">{{ PublishingHouse.name }}</p>
 </a>
</template>
