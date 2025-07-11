<script setup>
import { defineProps } from 'vue'

defineProps({
  author: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <router-link
    :to="'/authors/' + author.id"
    class="flex flex-col items-center justify-center w-40 sm:w-48 p-4 bg-black text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 group"
  >
    <div class="relative w-28 h-28 sm:w-32 sm:h-32 mb-3">
      <img
        :src="author.img"
        :alt="author.name"
        class="rounded-full w-full h-full object-cover border-4 border-yellow-600 group-hover:scale-105 transition-transform duration-300"
      />
    </div>
    <p class="text-base font-semibold font-BonaRegular">{{ author.name }}</p>

    <span class="mt-1 px-3 py-1 text-xs rounded-full bg-yellow-600 text-black font-semibold">
      {{ author.nmbBook }} Book{{ author.nmbBook > 1 ? 's' : '' }}
    </span>
  </router-link>
</template>
