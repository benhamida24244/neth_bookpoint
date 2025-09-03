<template>
  <aside class="w-full bg-white text-gray-900 p-4 font-BonaRegular rounded-lg shadow-md overflow-y-auto">
    <!-- Title -->
    <h2 class="text-xl font-bold text-[var(--color-primary)] mb-6">Filter & Categories</h2>

    <!-- Popular Sections -->
    <section class="mb-6">
      <h3 class="text-[var(--color-primary)] font-semibold mb-3">Popular Sections</h3>
      <ul class="space-y-1 text-sm">
        <li v-for="item in popularSections" :key="item">
          <a href="#" class="block px-2 py-1 rounded hover:bg-yellow-50 transition">{{ item }}</a>
        </li>
      </ul>
    </section>
    <hr class="my-4 border-gray-200" />

    <!-- Subjects -->
    <section class="mb-6">
      <h3 class="text-[var(--color-primary)] font-semibold mb-3">Subjects</h3>
      <!-- Show a loading message while fetching categories -->
      <div v-if="isLoading" class="text-sm text-gray-500">Loading categories...</div>
      <!-- Show a message if there are no categories -->
      <div v-else-if="allCategories.length === 0" class="text-sm text-gray-500">No categories available.</div>
      <!-- Display the list of categories -->
      <ul v-else class="space-y-1 text-sm">
        <li v-for="category in allCategories" :key="category.id">
          <a :href="category.url" class="block px-2 py-1 rounded hover:bg-yellow-50 transition">{{ category.name }}</a>
        </li>
      </ul>
    </section>
    <hr class="my-4 border-gray-200" />

    <!-- Price -->
    <section class="mb-6">
      <h3 class="text-[var(--color-primary)] font-semibold mb-3">Price</h3>
      <ul class="space-y-1 text-sm">
        <li v-for="item in prices" :key="item">
          <a href="#" class="block px-2 py-1 rounded hover:bg-yellow-50 transition">{{ item }}</a>
        </li>
      </ul>
    </section>
    <hr class="my-4 border-gray-200" />

    <!-- حسب العمر -->
    <section class="mb-6">
      <h3 class="text-[var(--color-primary)] font-semibold mb-3">Age</h3>
      <ul class="space-y-1 text-sm">
        <li v-for="item in ages" :key="item">
          <a href="#" class="block px-2 py-1 rounded hover:bg-yellow-50 transition">{{ item }}</a>
        </li>
      </ul>
    </section>
    <hr class="my-4 border-gray-200" />

    <!-- حسب اللغة -->
    <section>
      <h3 class="text-[var(--color-primary)] font-semibold mb-3">Language</h3>
      <ul class="columns-2 gap-4 text-sm space-y-1">
        <li v-for="item in languages" :key="item">
          <a href="#" class="block px-2 py-1 rounded hover:bg-yellow-50 transition">{{ item }}</a>
        </li>
      </ul>
    </section>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useCategoriesStore } from '@/stores/Categories';

// Access the categories store
const categoriesStore = useCategoriesStore();

// Get all categories from the store using the allCategories getter
const allCategories = computed(() => categoriesStore.allCategories);

// Get the loading state from the store
const isLoading = computed(() => categoriesStore.isLoading);

console.log('allCategories', allCategories.value);

const popularSections = [
  'Customer Favorites', 'Bestsellers', 'Teens & YA Bestsellers', 'Kids Bestsellers',
  'NY Times® Bestsellers', 'New Releases', 'Coming Soon', 'Special Values',
  'Paperbacks Up to 25% Off', 'Bestsellers 30% Off', 'Book Annex',
  'B&N Collectible Editions', 'Special Collections', 'Best Books of 2025 (So Far)',
  'Our Monthly Picks', 'Book Club Selections', 'B&N Exclusives',
  'The Paperback Store', 'Book Awards', 'Boxed Sets', 'Signed & Special Editions'
];

const prices = [
  'Under $5', '$5 - $10', '$10 - $25', '$25 - $50', 'Over $50'
];

const ages = [
  '0 - 2 Years', '3 - 5 Years', '6 - 8 Years', '9 - 12 Years', 'Teens'
];

const languages = [
  'English', 'German', 'French', 'Spanish', 'Russian', 'Italian', 'Portuguese',
  'Finnish', 'Welsh', 'Panjabi', 'Arabic', 'Chinese', 'Dutch', 'Polish', 'Turkish'
];
</script>
