<script setup>
import { ref } from 'vue'
import BookItem from '@/components/Book/bookItem.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps({
  books: {
    type: Array,
    required: true,
  },
  title: {
    type: String,
    default: 'Related Books',
  },
})

const scrollContainer = ref(null)

const scrollLeft = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollBy({ left: -300, behavior: 'smooth' })
  }
}

const scrollRight = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollBy({ left: 300, behavior: 'smooth' })
  }
}
</script>

<template>
  <div class="relative">
    <h2 class="text-2xl font-bold text-[#111827] mb-4">{{ title }}</h2>
    <div ref="scrollContainer" class="flex overflow-x-auto space-x-4 py-4 scrollbar-hide">
      <BookItem v-for="book in books" :key="book.id" :book="book" />
    </div>
    <button
      @click="scrollLeft"
      class="absolute top-1/2 -left-4 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-200 transition"
    >
      <i class="pi pi-chevron-left"></i>
    </button>
    <button
      @click="scrollRight"
      class="absolute top-1/2 -right-4 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-200 transition"
    >
      <i class="pi pi-chevron-right"></i>
    </button>
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
