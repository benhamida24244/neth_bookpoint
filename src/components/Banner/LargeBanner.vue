<template>
  <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <a :href="banner.url">
       <img
      :src="banner.img"
      alt="Rose In Chains - Banner"
      class="w-full h-full rounded-lg shadow-md object-cover object-center aspect-[3/1]"
    />
    </a>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
defineProps({
  banner: {
  type:Object,
  required: true,
}
})

</script>
