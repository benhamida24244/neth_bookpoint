<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useCategoriesStore } from '@/stores/Categories'
import { storeToRefs } from 'pinia'
import BookCategoryList from '@/components/Book/BookCategoryList.vue'
import LoaderWithText from '@/components/LoaderWithText.vue';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const route = useRoute()
const categoriesStore = useCategoriesStore()
const { category, isLoading, error } = storeToRefs(categoriesStore)

const currentId = Number(route.params.id)

onMounted(async () => {
  window.scrollTo(0, 0)
  await categoriesStore.fetchCategory(currentId)
})
</script>

<template>
  <div class="w-full min-h-screen bg-gray-50 py-8 px-4 sm:py-16">
    <div v-if="isLoading" class="text-center py-20">
      <LoaderWithText :message="t('loading.category')" />
    </div>
    <div v-else-if="error || !category" class="text-center py-20">
      <p class="text-red-500 font-semibold">{{ t('singleCategoryPage.error') }}</p>
      <p class="text-gray-600">{{ error }}</p>
      <button
        @click="categoriesStore.fetchCategory(currentId)"
        class="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        {{ t('singleCategoryPage.retry') }}
      </button>
    </div>
    <div v-else class="max-w-7xl mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        <!-- Icon section -->
        <div class="flex justify-center lg:justify-start">
          <div class="relative">
            <div
              class="h-64 w-64 sm:h-80 sm:w-80 rounded-full shadow-2xl shadow-[var(--color-primary)]/30 bg-[var(--color-hover)] flex items-center justify-center text-white text-9xl"
            >
              <i class="pi" :class="category.icon || 'pi-tag'"></i>
            </div>
            <div
              class="absolute inset-0 rounded-full bg-gradient-to-tr from-[var(--color-primary)]/20 to-transparent pointer-events-none"
            ></div>
          </div>
        </div>

        <!-- Details and Actions -->
        <div class="lg:col-span-2 flex flex-col justify-center space-y-6 relative">
          <div
            class="h-1 bg-gradient-to-r from-[var(--color-primary)] to-transparent w-full max-w-xs"
          ></div>
          <h1
            class="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--color-primary)] leading-tight font-BonaRegular pt-12 sm:pt-0"
          >
            {{ category.name }}
          </h1>
          <div class="h-1 bg-gradient-to-r from-[var(--color-primary)] to-transparent w-20"></div>
          <p class="text-gray-700 text-base sm:text-lg leading-relaxed max-w-2xl font-BonaRegular">
            {{ category.description }}
          </p>
        </div>
      </div>

      <!-- Books in Category Section -->
      <section class="max-w-7xl mx-auto px-4 py-12 lg:py-16">
        <header class="text-center mb-12">
          <h2
            class="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--color-primary)] mb-4 font-BonaRegular"
          >
            {{ t('singleCategoryPage.booksIn') }} {{ category.name }}
          </h2>
          <div
            class="h-px bg-gradient-to-r from-transparent via-[var(--color-primary)]/50 to-transparent w-32 mx-auto"
          ></div>
        </header>

        <Suspense>
          <BookCategoryList :category="category.id" />
          <template #fallback>
            <LoaderWithText :message="t('loading.books')" />
          </template>
        </Suspense>
      </section>
    </div>
  </div>
</template>