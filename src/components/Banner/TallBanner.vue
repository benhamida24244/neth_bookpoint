<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <a v-if="banner?.url" :href="banner.url" class="block">
      <img
        v-if="banner?.img"
        :src="banner.img"
        alt="Banner"
        class="w-full rounded-lg shadow-md object-cover object-center
               min-h-[200px] sm:min-h-[300px]
               aspect-[3/1] sm:aspect-auto"
      />
    </a>
  </div>
</template>

<script setup>
defineProps({
  banner: {
    type: Object,
    required: true,
  }
})
</script>
