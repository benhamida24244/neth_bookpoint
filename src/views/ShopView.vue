<script setup lang="ts">
import LargeBanner from '@/components/Banner/LargeBanner.vue'
import BookList from '@/components/Book/Shop/BookList.vue';
import SidebarContent from '@/components/Book/Shop/Sidebar/SidebarContent.vue';
import { onMounted, ref } from 'vue';
import { useBooksStore } from '@/stores/Books';
import { useCategoriesStore } from '@/stores/Categories';
import Pagination from '@/components/Pagination.vue';


const imgBanner = {
  id: 1,
  img: 'https://dispatch.barnesandnoble.com/content/dam/ccr/bnstores/books/hero/2025/32464_SkinnyHero_BestBooksSoFar_June2025.jpg',
  url: 'https://www.barnesandnoble.com/',
}

const booksStore = useBooksStore();
const categoriesStore = useCategoriesStore();

// State for filters
const activeFilters = ref({});
const currentPage = ref(1);

// Handler for filter changes from the sidebar
const handleFiltersChanged = (filters: any) => {
  activeFilters.value = filters;
  // Re-fetch books with the new filters
  booksStore.fetchBooks(filters);
};

const handlePageChange = (page) => {
  currentPage.value = page
  booksStore.fetchBooks({
    page,
    status: activeFilters.value !== 'All Books' ? activeFilters.value : undefined,
  })
}

// Fetch books and categories when the component is mounted
onMounted(async () => {
  console.log("Fetching data...");
  window.scrollTo(0,0)
  await booksStore.fetchBooks({}); // Fetch initial books without filters
  await categoriesStore.fetchCategories();
  console.log("Data fetched!");
})
</script>

<template>
  <div class="w-full font-BonaRegular bg-gray-50 min-h-screen py-8">
    <div class="container mx-auto flex gap-8">
      <!-- Sidebar -->
      <aside class="w-64 hidden md:block sticky top-8 h-fit bg-white rounded-lg shadow p-4">
        <SidebarContent @filters-changed="handleFiltersChanged" />

      </aside>
      <!-- Main Content -->
      <main class="flex-1">
        <p class="font-bold text-[var(--color-primary)] text-2xl text-center mb-2">Explore All Books Here</p>
        <p class="text-center mb-4 text-gray-700">
          Discover the best books to read right now including trending titles, bookseller
          recommendations, new releases and more.
        </p>
        <LargeBanner :banner="imgBanner" class="mb-6" />
        <BookList :filters="activeFilters" />
       <Pagination
      v-if="booksStore.pagination"
      :current-page="currentPage"
      :last-page="booksStore.pagination.last_page"
      :total-items="booksStore.pagination.total"
      @page-changed="handlePageChange"
    />
      </main>
    </div>
  </div>
</template>
