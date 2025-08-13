<script setup>
import { useBooksStore } from '@/stores/Books';
import { useCartStore } from '@/stores/Cart';

defineProps({
  book: {
    type: Object,
    required: true
  }
});

const booksStore = useBooksStore();
const cartStore = useCartStore();

</script>
<template>
  <div class="group relative cursor-pointer w-44 transition-all duration-300 ease-in-out m-4 p-3 flex flex-col bg-white rounded-lg  hover:shadow-lg">
    <div class="relative mb-2 overflow-hidden rounded-md">
      <img :src="book.cover" :alt="book.title" class="w-full h-52 object-cover transform group-hover:scale-105 transition-transform duration-300 ease-in-out" />

    </div>

    <div class="mt-auto text-center">
      <h3 class="font-bold text-md font-bona truncate" :title="book.title">{{ book.title }}</h3>
      <p class="text-sm text-gray-500 font-BonaRegular underline">{{ book.author }}</p>

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
    </div>
  </div>
</template>
