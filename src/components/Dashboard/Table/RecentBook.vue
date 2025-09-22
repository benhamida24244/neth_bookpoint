<script setup>
import { useDashboardStore } from '@/stores/Dashboard'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

const { t } = useI18n()
const dashboardStore = useDashboardStore()
const { recentBooks, loading } = storeToRefs(dashboardStore)
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

// تنسيق التاريخ
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-SA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
</script>

<template>
  <div class="bg-white p-6 rounded-2xl shadow-md">
    <h2 class="text-xl font-bold text-[var(--color-primary)] font-BonaRegular mb-4">
      📚 {{ t('dashboard.recentBooks.title') }}
    </h2>

    <div v-if="loading" class="flex justify-center items-center h-32">
      <p>{{ t('loading') }}</p>
    </div>

    <div v-else>
      <!-- Empty State -->
      <div v-if="recentBooks.length === 0" class="p-12 text-center">
        <div
          class="mx-auto w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4"
        >
          <i class="far fa-file-alt text-gray-400 text-3xl"></i>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-1">
          {{ t('dashboard.recentBooks.emptyHeader') }}
        </h3>
      </div>

      <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <div
          v-for="book in recentBooks"
          :key="book.id"
          class="bg-gray-50 rounded-xl p-3 shadow-sm hover:shadow-lg transition cursor-pointer"
        >
          <RouterLink :to="`/dashboard/books/${book.id}`">
            <img
              :src="`${apiBaseUrl}/storage/${book.cover}`"
              alt="book cover"
              class="w-full h-48 object-cover rounded-lg mb-2"
            />
            <h3 class="font-semibold text-slate-800 text-sm truncate">{{ book.title }}</h3>
            <p class="text-xs text-gray-500 italic">
              {{ t('dashboard.books.status.published') }}: {{ formatDate(book.created_at) }}
            </p>
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>
