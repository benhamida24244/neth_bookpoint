<template>
  <aside class="w-full bg-white text-gray-900 p-4 font-BonaRegular rounded-lg shadow-md overflow-y-auto">
    <!-- عنوان -->
    <h2 class="text-xl font-bold text-yellow-600 mb-6">Filter & Categories</h2>

    <!-- الفئات الرئيسية -->
    <section class="mb-6">
      <h3 class="text-yellow-600 font-semibold mb-3">Popular Sections</h3>
      <ul class="space-y-1 text-sm">
        <li v-for="item in popularSections" :key="item">
          <a href="#" class="block px-2 py-1 rounded hover:bg-yellow-50 transition">{{ item }}</a>
        </li>
      </ul>
    </section>
    <hr class="my-4 border-gray-200" />

    <!-- حسب الموضوع -->
    <section class="mb-6">
      <h3 class="text-yellow-600 font-semibold mb-3">Subjects</h3>
      <ul class="space-y-1 text-sm">
        <li v-for="item in subjects" :key="item">
          <a href="#" class="block px-2 py-1 rounded hover:bg-yellow-50 transition" :class="{'text-yellow-600 font-medium': item === 'See All Subjects'}">{{ item }}</a>
        </li>
      </ul>
    </section>
    <hr class="my-4 border-gray-200" />

    <!-- حسب السعر -->
    <section class="mb-6">
      <h3 class="text-yellow-600 font-semibold mb-3">Price</h3>
      <ul class="space-y-1 text-sm">
        <li v-for="item in prices" :key="item">
          <a href="#" class="block px-2 py-1 rounded hover:bg-yellow-50 transition">{{ item }}</a>
        </li>
      </ul>
    </section>
    <hr class="my-4 border-gray-200" />

    <!-- حسب العمر -->
    <section class="mb-6">
      <h3 class="text-yellow-600 font-semibold mb-3">Age</h3>
      <ul class="space-y-1 text-sm">
        <li v-for="item in ages" :key="item">
          <a href="#" class="block px-2 py-1 rounded hover:bg-yellow-50 transition">{{ item }}</a>
        </li>
      </ul>
    </section>
    <hr class="my-4 border-gray-200" />

    <!-- حسب اللغة -->
    <section>
      <h3 class="text-yellow-600 font-semibold mb-3">Language</h3>
      <ul class="columns-2 gap-4 text-sm space-y-1">
        <li v-for="item in languages" :key="item">
          <a href="#" class="block px-2 py-1 rounded hover:bg-yellow-50 transition">{{ item }}</a>
        </li>
      </ul>
    </section>
  </aside>
</template>

<script setup lang="ts">
const popularSections = [
  'Customer Favorites', 'Bestsellers', 'Teens & YA Bestsellers', 'Kids Bestsellers',
  'NY Times® Bestsellers', 'New Releases', 'Coming Soon', 'Special Values',
  'Paperbacks Up to 25% Off', 'Bestsellers 30% Off', 'Book Annex',
  'B&N Collectible Editions', 'Special Collections', 'Best Books of 2025 (So Far)',
  'Our Monthly Picks', 'Book Club Selections', 'B&N Exclusives',
  'The Paperback Store', 'Book Awards', 'Boxed Sets', 'Signed & Special Editions'
];

const subjects = [
  'Art, Architecture & Photography', 'Bibles & Christianity', 'Biography', 'Business',
  'Cookbooks, Food & Wine', 'Fiction', 'Graphic Novels & Comics', 'Diet, Health & Fitness',
  'History', 'Manga', 'Mystery & Thrillers', 'Religion', 'Romance',
  'Science Fiction & Fantasy', 'Self-Help & Relationships', 'See All Subjects'
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
