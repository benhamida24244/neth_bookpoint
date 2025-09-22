<template>
  <RouterLink :to="`/dashboard/books/${book.id}`" class="relative flex flex-col rounded-lg bg-white p-3 shadow-md transition-shadow duration-300 hover:shadow-xl group">
    <!-- Book Image -->
    <div class="relative mb-3 overflow-hidden rounded-md">
      <img :src="`${apiBaseUrl}${book.cover}`" :alt="book.title" class="w-full aspect-[2/3] object-cover transition-transform duration-300 group-hover:scale-105" />
    </div>

    <!-- Book Details -->
    <div class="flex flex-grow flex-col items-center text-center space-y-1 ltr:text-center rtl:text-center">
      <h3 class="font-bona truncate text-md font-bold w-full" :title="book.title">
        {{ book.title }}
      </h3>
      <p class="font-BonaRegular text-sm text-gray-600 w-full truncate">
        {{ book.author.name }}
      </p>

      <!-- Rating -->
      <div class="flex justify-center my-2">
        <span v-for="i in 5" :key="i">
          <i class="pi mx-px text-sm" :class="i <= book.rating ? 'pi-star-fill text-[var(--color-light)]' : 'pi-star text-gray-300'"></i>
        </span>
      </div>

      <!-- Price -->
      <p class="text-base font-semibold text-gray-800 mt-auto">
        {{ book.price }} {{ settingsStore.currency }}
      </p>
    </div>
  </RouterLink>
</template>

<script setup>
import { useSettingsStore } from '@/stores/settings';

defineProps({
  book: {
    type: Object,
    required: true
  }
});

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const settingsStore = useSettingsStore();
</script>