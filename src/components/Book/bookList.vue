<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation } from 'swiper/modules'

// استيراد الأنماط
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import BookItem from './bookItem.vue'
import {useBooksStore} from '@/stores/Books.js'
const BestSellerBook = useBooksStore().books
</script>

<template>
  <div class="relative w-full max-w-6xl mx-auto px-4 mb-8">
    <Swiper
        :modules="[Navigation]"
        :slides-per-view="6"
        :space-between="15"
        :breakpoints="{
        320: {
          slidesPerView: 1.5,
        },
        480: {
          slidesPerView: 2,
        },
        640: {
          slidesPerView: 3,
        },
        768: {
          slidesPerView: 4,
        },
        1024: {
          slidesPerView: 5,
        },
        1280: {
          slidesPerView: 6,
        }
      }"
        navigation
        class="mySwiper"
    >
      <SwiperSlide v-for="book in BestSellerBook" :key="book.id">
        <BookItem :book="book" />
      </SwiperSlide>
    </Swiper>
    <div class="absolute underline text-gray-400 right-0">
      <a href="/">See All</a>
    </div>
  </div>
</template>

<style>
.mySwiper .swiper-button-prev,
.mySwiper .swiper-button-next {
    background-color: #A65F00;
    border-radius: 9999px;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    width: 2.75rem;
    height: 2.75rem;
    color: white;
}

.mySwiper .swiper-button-prev:after,
.mySwiper .swiper-button-next:after {
    font-size: 1.25rem;
    font-weight: 800;
}



.mySwiper .swiper-button-disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
</style>
