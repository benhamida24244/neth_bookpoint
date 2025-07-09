<script setup>
import SmallBannerItem from './SmallBannerItem.vue';
import { defineProps } from 'vue';

defineProps({
  smallBanner: {
    type: Array,
    required: true
  }
})
</script>

<template>
  <div class="flex overflow-x-auto justify-center gap-4 px-4 mt-5 mb-8 scrollbar-hide">
    <SmallBannerItem
      v-for="banner in smallBanner"
      :key="banner.id"
      :banner="banner"
    />
  </div>
</template>

<style scoped>
/* إخفاء شريط التمرير */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
