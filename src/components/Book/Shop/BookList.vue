<script setup>

// استيراد الأنماط
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import BookItems from './BookItems.vue'
import { useBooksStore } from '@/stores/Books'

const BestSellerBook = useBooksStore().books
</script>

<template>
  <div class="relative flex flex-wrap justify-center w-full max-w-6xl mx-auto px-4">
        <BookItems v-for="book in BestSellerBook" :book="book" :key="book.id" />
  </div>
</template>
