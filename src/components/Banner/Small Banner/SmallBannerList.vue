<script setup>
import SmallBannerItem from './SmallBannerItem.vue';
import { defineProps } from 'vue';
defineProps({
  smallBanner:
  {
    type:Object,
    required:true
  }
})
</script>
<template>
  <div class="flex relative w-full max-w-7xl mx-auto px-4 mt-5 mb-8">
    <SmallBannerItem v-for="banner in smallBanner" :banner="banner"/>
  </div>
</template>
