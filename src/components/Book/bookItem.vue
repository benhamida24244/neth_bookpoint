<script setup>
import { useBooksStore } from '@/stores/Books';
import { useCartStore } from '@/stores/Cart';
import { useSettingsStore } from '@/stores/settings';
import { RouterLink } from 'vue-router';


defineProps({
  book: {
    type: Object,
    required: true
  }
});

const cartStore = useCartStore();
const settingsStore = useSettingsStore()

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

</script>
<template>
  <div class="group relative cursor-pointer w-44 transition-all duration-300 ease-in-out m-4 p-3 flex flex-col bg-white rounded-lg  hover:shadow-lg">
    <div class="relative mb-2 overflow-hidden rounded-md">
      <img :src="`${apiBaseUrl}${book.cover}`" :alt="book.title" class="w-full h-52 object-cover transform group-hover:scale-105 transition-transform duration-300 ease-in-out" />

      <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out rounded-md">
        <button class="bg-[var(--color-primary)] text-white font-semibold py-2 px-4 rounded-full hover:bg-[var(--color-hover)] transition hover:scale-105"
        @click="cartStore.addToCart(book.id, 1)"
        >
          Quick Add
        </button>
      </div>
    </div>

    <RouterLink :to="`/book/${book.id}`" class="mt-auto text-center">
      <h3 class="font-bold text-md font-bona truncate" :title="book.title">{{ book.title }}</h3>
      <p class="text-sm text-gray-500 font-BonaRegular underline">{{ book.author.name }}</p>
      <p class="text-black font-bold font-BonaRegular ">{{ book.price + settingsStore.currency }} </p>

      <!-- ⭐️ التقييم بالنجوم -->
      <div class="flex justify-center mt-2">
        <span v-for="i in 5" :key="i">
          <i
            class="pi"
            :class="i <= book.rating ? 'pi-star-fill text-[var(--color-light)]' : 'pi-star text-gray-400'"
            style="font-size: 1rem; margin: 0 1px"
          ></i>
        </span>
      </div>
    </RouterLink>
  </div>
</template>
