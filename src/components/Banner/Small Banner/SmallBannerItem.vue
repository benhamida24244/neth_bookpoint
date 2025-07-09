<script setup>
import { defineProps } from 'vue';

defineProps({
  banner: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="flex-shrink-0 w-64 sm:w-80 md:w-96 p-2">
    <a :href="banner.url">
      <img
        :src="banner.img"
        alt=""
        class="w-full h-auto rounded-lg object-cover shadow-md"
      />
    </a>
  </div>
</template>
