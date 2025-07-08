<template>
  <div class="w-120 p-5">
    <a :href="banner.url">
      <img :src="banner.img" alt="">
    </a>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
defineProps({
  banner:
  {
    type:Object,
    required:true
  }
})
</script>
