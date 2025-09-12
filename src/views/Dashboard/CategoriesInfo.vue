<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useCategoriesStore } from '@/stores/Categories'
import { storeToRefs } from 'pinia'
import BookCategoryList from '@/components/Book/BookCategoryList.vue'
import LoaderWithText from '@/components/LoaderWithText.vue'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const categoriesStore = useCategoriesStore()
const { category, isLoading, error } = storeToRefs(categoriesStore)

const currentId = Number(route.params.id)

onMounted(async () => {
  try {
    await categoriesStore.fetchCategory(currentId)
  } catch (err) {
    console.error('Failed to load category:', err)
  }
})

const goToEditPage = () => {
  router.push(`/dashboard/categories/edit/${currentId}`)
}

const handleDeleteCategory = async () => {
  if (confirm(t('categoriesInfo.deleteConfirmation'))) {
    try {
      await categoriesStore.deleteCategory(currentId)
      alert(t('categoriesInfo.categoryDeleted'))
      router.push('/dashboard/categories')
    } catch (err) {
      console.error('Delete failed:', err)
      alert(t('categoriesInfo.deleteFailed'))
    }
  }
}

const currentCategory = computed(
  () => category.value || { name: 'Loading...', description: '...', icon: 'pi-tag' }
)

// إحصائيات افتراضية (إلى أن تبنيها من API أو store)
const formattedStatistics = computed(() => [
  {
    id: 1,
    name: t('categoriesInfo.totalBooks'),
    displayValue: currentCategory.value.nmBook ?? 0,
    icon: 'fas fa-book',
    color: 'bg-blue-500',
    ariaLabel: 'Total number of books in category'
  },
  {
    id: 2,
    name: t('categoriesInfo.orders'),
    displayValue: currentCategory.value.orders ?? 0,
    icon: 'fas fa-shopping-cart',
    color: 'bg-green-500',
    ariaLabel: 'Total number of orders for this category'
  },
  {
    id: 3,
    name: t('categoriesInfo.profit'),
    displayValue: currentCategory.value.total_profit
      ? `$${currentCategory.value.profit}`
      : '$0',
    icon: 'fas fa-dollar-sign',
    color: 'bg-yellow-500',
    ariaLabel: 'Total profit from category'
  }
])
</script>


<template>
  <div class="w-full min-h-screen bg-gray-50 py-8 px-4 sm:py-16">
    <div v-if="isLoading" class="text-center py-20">
      <LoaderWithText :message="t('categoriesInfo.loadingCategory')" />
    </div>
    <div v-else-if="error" class="text-center py-20">
      <p class="text-red-500 font-semibold">{{ t('categoriesInfo.error') }}</p>
      <p class="text-gray-600">{{ error }}</p>
      <button @click="categoriesStore.fetchCategory(currentId)" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
        {{ t('categoriesInfo.retry') }}
      </button>
    </div>
    <div v-else-if="currentCategory" class="max-w-7xl mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        <!-- Icon section -->
        <div class="flex justify-center lg:justify-start">
          <div class="relative">
            <div class="h-64 w-64 sm:h-80 sm:w-80 rounded-full shadow-2xl shadow-[var(--color-primary)]/30 bg-[var(--color-hover)] flex items-center justify-center text-white text-9xl">
              <i class="pi" :class="currentCategory.icon || 'pi-tag'"></i>
            </div>
            <div class="absolute inset-0 rounded-full bg-gradient-to-tr from-[var(--color-primary)]/20 to-transparent pointer-events-none"></div>
          </div>
        </div>

        <!-- Details and Actions -->
        <div class="lg:col-span-2 flex flex-col justify-center space-y-6 relative">
          <!-- Action Buttons -->
        <!-- Action Buttons -->
<div 
  class="absolute top-4 flex flex-col sm:flex-row gap-3"
  :class="{
    'right-4': $i18n.locale === 'en' || $i18n.locale === 'fr', // LTR
    'left-4 flex-row-reverse': $i18n.locale === 'ar'            // RTL
  }"
>
  <button 
    @click="goToEditPage" 
    class="px-5 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors duration-200 shadow-sm flex items-center gap-2"
  >
    <i class="fas fa-pencil-alt"></i> {{ t('categoriesInfo.edit') }}
  </button>

  <button 
    @click="handleDeleteCategory" 
    class="px-5 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors duration-200 shadow-sm flex items-center gap-2"
  >
    <i class="fas fa-trash"></i> {{ t('categoriesInfo.delete') }}
  </button>
</div>

          <!-- Category Info -->
          <div class="h-1 bg-gradient-to-r from-[var(--color-primary)] to-transparent w-full max-w-xs"></div>
          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--color-primary)] leading-tight font-BonaRegular pt-12 sm:pt-0">
            {{ currentCategory.name }}
          </h1>
          <div class="h-1 bg-gradient-to-r from-[var(--color-primary)] to-transparent w-20"></div>
          <p class="text-gray-700 text-base sm:text-lg leading-relaxed max-w-2xl font-BonaRegular">
            {{ currentCategory.description }}
          </p>

          <!-- Total profit | Number of Orders and Number of Books -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            <div v-for="stat in formattedStatistics" :key="stat.id" class="flex items-center gap-4 border border-[var(--color-primary)]/30 rounded-xl p-4 bg-white/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:border-[var(--color-primary)]/50" :aria-label="stat.ariaLabel">
              <div :class="[stat.color, 'p-3 rounded-full shadow-md']" class="flex-shrink-0">
                <i :class="[stat.icon, 'text-white text-xl']" aria-hidden="true"></i>
              </div>
              <div class="flex flex-col min-w-0 flex-1">
                <p class="font-semibold text-gray-800 text-sm truncate">{{ stat.name }}</p>
                <p class="text-xl font-bold text-gray-900">{{ stat.displayValue }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Books in Category Section -->
      <section class="max-w-7xl mx-auto px-4 py-12 lg:py-16">
        <header class="text-center mb-12">
          <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--color-primary)] mb-4 font-BonaRegular">
            {{ t('categoriesInfo.booksIn') }} {{ currentCategory.name }}
          </h2>
          <div class="h-px bg-gradient-to-r from-transparent via-[var(--color-primary)]/50 to-transparent w-32 mx-auto"></div>
        </header>

        <Suspense>
          <BookCategoryList v-if="currentCategory && currentCategory.id" :category="currentCategory.id" />
          <template #fallback>
            <div class="flex justify-center items-center py-12">
              <LoaderWithText :message="t('categoriesInfo.loadingBooks')" />
            </div>
          </template>
        </Suspense>
      </section>
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in-up {
  animation: fadeInUp 0.6s ease-out;
}

button {
  min-height: 2.5rem;
}

@media (max-width: 640px) {
  h1 {
    font-size: 2rem;
  }
  h2 {
    font-size: 1.5rem;
  }
}
</style>
