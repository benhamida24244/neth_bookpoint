<script setup lang="ts">
import LargeBanner from '@/components/Banner/LargeBanner.vue'
import BookList from '@/components/Book/Shop/BookList.vue';
import SidebarContent from '@/components/Book/Shop/Sidebar/SidebarContent.vue';
import { onMounted } from 'vue';
import { useBooksStore } from '@/stores/Books';
import { useCategoriesStore } from '@/stores/Categories';

const imgBanner = {
  id: 1,
  img: 'https://dispatch.barnesandnoble.com/content/dam/ccr/bnstores/books/hero/2025/32464_SkinnyHero_BestBooksSoFar_June2025.jpg',
  url: 'https://www.barnesandnoble.com/',
}

// Fetch books and categories when the component is mounted
onMounted(async () => {
  console.log("Fetching data...");
  window.scrollTo(0,0)
  const booksStore = useBooksStore();
  const categoriesStore = useCategoriesStore();
  await booksStore.fetchBooks();
  await categoriesStore.fetchCategories();
  console.log("Data fetched!");
})
</script>

<template>
  <div class="w-full font-BonaRegular bg-gray-50 min-h-screen py-8">
    <div class="container mx-auto flex gap-8">
      <!-- Sidebar -->
      <aside class="w-64 hidden md:block sticky top-8 h-fit bg-white rounded-lg shadow p-4">
        <SidebarContent />
      </aside>
      <!-- Main Content -->
      <main class="flex-1">
        <p class="font-bold text-[var(--color-primary)] text-2xl text-center mb-2">{{ $t('shop.title') }}</p>
        <p class="text-center mb-4 text-gray-700">
          {{ $t('shop.subtitle') }}
        </p>
        <LargeBanner :banner="imgBanner" class="mb-6" />
        <BookList />
      </main>
    </div>
  </div>
</template>
