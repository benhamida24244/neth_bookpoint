<script setup lang="ts">
import LargeBanner from '@/components/Banner/LargeBanner.vue'
import BookList from '@/components/Book/Shop/BookList.vue'
import SidebarContent from '@/components/Book/Shop/Sidebar/SidebarContent.vue'
import { onMounted, ref, watch } from 'vue'
import { useBooksStore } from '@/stores/Books'
import { useCategoriesStore } from '@/stores/Categories'
import Pagination from '@/components/Pagination.vue'
import { useI18n } from 'vue-i18n'
import { Filter, X } from 'lucide-vue-next'
import { useRoute, useRouter } from 'vue-router'

const { t } = useI18n()

const imgBanner = {
  id: 1,
  img: 'https://dispatch.barnesandnoble.com/content/dam/ccr/bnstores/books/hero/2025/32464_SkinnyHero_BestBooksSoFar_June2025.jpg',
  url: 'https://www.barnesandnoble.com/',
}

const booksStore = useBooksStore()
const categoriesStore = useCategoriesStore()

const activeFilters = ref({})
const currentPage = ref(1)
const isSidebarOpen = ref(false)
const route = useRoute()
const router = useRouter()

const handleFiltersChanged = (filters: any) => {
  activeFilters.value = filters
  currentPage.value = 1 // Reset to first page on filter change
  booksStore.fetchBooks({ ...filters, page: 1 })
  window.scrollTo(0, 0) // Scroll to top when filters change
}

const clearAllFilters = () => {
  activeFilters.value = {}
  currentPage.value = 1
  booksStore.fetchBooks({ page: 1 })
  window.scrollTo(0, 0)
}

const onPageChange = (page: number) => {
  currentPage.value = page
}

const openSidebar = () => {
  isSidebarOpen.value = true
}

const closeSidebar = () => {
  isSidebarOpen.value = false
}

onMounted(async () => {
  console.log('Fetching data...')
  window.scrollTo(0, 0)
  const pageFromQuery = route.query.page ? parseInt(route.query.page as string) : 1
  currentPage.value = pageFromQuery
  await booksStore.fetchBooks({ page: currentPage.value })
  await categoriesStore.fetchCategories()
  console.log('Data fetched!')
})

watch(currentPage, (newPage, oldPage) => {
  if (newPage !== oldPage) {
    booksStore.fetchBooks({ ...activeFilters.value, page: newPage })
    router.push({ query: { ...route.query, page: newPage } })
  }
})

watch(
  () => route.query.page,
  (newPage) => {
    const page = newPage ? parseInt(newPage as string) : 1
    if (currentPage.value !== page) {
      currentPage.value = page
    }
  }
)

watch(isSidebarOpen, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})
</script>

<template>
  <div class="w-full font-BonaRegular bg-gray-50 min-h-screen py-8">
    <!-- Mobile Filter Button -->
    <div class="md:hidden fixed bottom-6 right-6 z-40">
      <button
        @click="openSidebar"
        class="bg-[var(--color-primary)] text-white p-4 rounded-full shadow-lg flex items-center justify-center hover:bg-[var(--color-hover)] transition-transform transform hover:scale-110"
        aria-label="Open filters"
      >
        <Filter class="w-6 h-6" />
      </button>
    </div>

    <!-- Mobile Sidebar -->
    <Transition
      enter-active-class="transition-opacity ease-linear duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity ease-linear duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isSidebarOpen"
        @click="closeSidebar"
        class="fixed inset-0 bg-black bg-opacity-60 z-50 md:hidden"
        aria-hidden="true"
      ></div>
    </Transition>

    <Transition
      enter-active-class="transition ease-in-out duration-300 transform"
      enter-from-class="-translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition ease-in-out duration-300 transform"
      leave-from-class="translate-x-0"
      leave-to-class="-translate-x-full"
    >
      <aside
        v-if="isSidebarOpen"
        class="fixed top-0 left-0 w-72 h-full bg-white z-50 md:hidden shadow-lg flex flex-col"
      >
        <div class="flex-grow overflow-y-auto">
          <SidebarContent
            :active-filters="activeFilters"
            @filters-changed="handleFiltersChanged"
            @clear-filters="clearAllFilters"
            @close-sidebar="closeSidebar"
          />
        </div>
        <div class="p-4 border-t border-gray-200">
          <button
            @click="closeSidebar"
            class="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors px-4 py-2 rounded-lg text-sm font-semibold"
          >
            <X class="w-5 h-5" />
            <span>{{ t('sidebar.close') }}</span>
          </button>
        </div>
      </aside>
    </Transition>

    <div class="container mx-auto flex gap-8">
      <!-- Sidebar -->
      <aside class="w-64 hidden md:block sticky top-8 h-fit bg-white rounded-lg shadow p-4">
        <SidebarContent
          :active-filters="activeFilters"
          @filters-changed="handleFiltersChanged"
          @clear-filters="clearAllFilters"
        />
      </aside>
      <!-- Main Content -->
      <main class="flex-1">
        <p class="font-bold text-[var(--color-primary)] text-2xl text-center mb-2">
          {{ t('shop.title') }}
        </p>
        <p class="text-center mb-4 text-gray-700">
          {{ t('shop.subtitle') }}
        </p>
        <LargeBanner :banner="imgBanner" class="mb-6" />
        <BookList :filters="activeFilters" />
        <Pagination
          v-if="booksStore.lastPage > 1"
          :current-page="currentPage"
          :last-page="booksStore.lastPage"
          :total-items="booksStore.total"
          @page-changed="onPageChange"
        />
      </main>
    </div>
  </div>
</template>
