<script setup>
import { defineProps } from 'vue'

defineProps({
  item: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <div
    class=" border border-[var(--color-primary)] p-5 font-BonaRegular rounded-xl shadow-md text-black flex flex-col items-center justify-center gap-2 transition-transform hover:scale-105"
  >
    <component :is="item.icon" class="w-8 h-8 text-text-black" />

    <p class="text-sm uppercase tracking-wide text-black/90">
      {{ item.name }}
    </p>

    <p class="text-4xl font-bold text-black">
      {{ item.Num }}
    </p>
  </div>
</template>
