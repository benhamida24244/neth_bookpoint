<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation } from 'swiper/modules'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps({
  books: {
    type: Array,
    required: true,
  },
})
// استيراد الأنماط
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import BookItem from './bookItem.vue'
</script>

<template>
  <div class="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 mb-12">
    <div class="relative">
      <Swiper
        :modules="[Navigation]"
        :slides-per-view="2"
        :space-between="10"
        :breakpoints="{
          480: {
            slidesPerView: 3,
            spaceBetween: 10
          },
          640: {
            slidesPerView: 4,
            spaceBetween: 15
          },
          1024: {
            slidesPerView: 5,
            spaceBetween: 15
          },
          1280: {
            slidesPerView: 6,
            spaceBetween: 20
          }
        }"
        navigation
        class="mySwiper"
      >
        <SwiperSlide v-for="book in books" :key="book.id">
          <BookItem :book="book" />
        </SwiperSlide>
      </Swiper>
    </div>
    <div class="text-center mt-4 md:text-right md:-mt-6 md:mr-12">
      <RouterLink
        to="/shop"
        class="text-sm underline text-gray-500 hover:text-[var(--color-primary)] transition-colors"
        >{{ t('bookList.seeAll') }}</RouterLink
      >
    </div>
  </div>
</template>

<style>
/* Default styles for mobile */
.mySwiper .swiper-button-prev,
.mySwiper .swiper-button-next {
  background-color: rgba(166, 95, 0, 0.7);
  border-radius: 9999px;
  width: 2.25rem; /* 36px */
  height: 2.25rem; /* 36px */
  color: white;
  transition: background-color 0.3s ease;
}

.mySwiper .swiper-button-prev:hover,
.mySwiper .swiper-button-next:hover {
  background-color: rgba(166, 95, 0, 1);
}

.mySwiper .swiper-button-prev:after,
.mySwiper .swiper-button-next:after {
  font-size: 1rem; /* 16px */
  font-weight: 700;
}



.mySwiper .swiper-button-disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

/* Styles for medium screens and up */
@media (min-width: 768px) {
  .mySwiper .swiper-button-prev,
  .mySwiper .swiper-button-next {
    width: 2.75rem; /* 44px */
    height: 2.75rem; /* 44px */
  }

  .mySwiper .swiper-button-prev:after,
  .mySwiper .swiper-button-next:after {
    font-size: 1.25rem; /* 20px */
  }
}
</style>
