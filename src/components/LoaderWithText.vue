<template>
  <div class="flex flex-col justify-center items-center space-y-4">
    <!-- الدائرة -->
    <div
      class="animate-spin rounded-full border-t-4 border-b-4"
      :class="colorClass"
      :style="{ width: `${size}px`, height: `${size}px` }"
    ></div>

    <!-- النص -->
    <p class="text-center font-medium" :class="textColorClass">
      {{ message }}
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// Props للتحكم
const props = defineProps({
  size: { type: Number, default: 48 }, // حجم اللودر
  color: { type: String, default: 'primary' }, // لون الدائرة
  message: { type: String, default: 'Loading...' }, // النص
  textColor: { type: String, default: 'gray' }, // لون النص
})

// ألوان الدائرة
const colorClass = computed(() => {
  switch (props.color) {
    case 'white':
      return 'border-white'
    case 'gray':
      return 'border-gray-400'
    case 'red':
      return 'border-red-500'
    case 'primary':
    default:
      return 'border-[var(--color-primary)]'
  }
})

// ألوان النص
const textColorClass = computed(() => {
  switch (props.textColor) {
    case 'white':
      return 'text-white'
    case 'primary':
      return 'text-[var(--color-primary)]'
    case 'red':
      return 'text-red-500'
    case 'gray':
    default:
      return 'text-gray-400'
  }
})
</script>
