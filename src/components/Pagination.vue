<template>
  <div
    class="flex items-center justify-center gap-2 mt-6 mb-4 flex-wrap animate-[fadeIn_0.3s_ease-out]"
  >
    <!-- الانتقال إلى الصفحة الأولى -->
    <button
      :disabled="currentPage === 1"
      @click="goToPage(1)"
      class="flex items-center px-2 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm transition-all duration-200 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-hover)] focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:border-gray-500 dark:disabled:bg-gray-900 dark:disabled:text-gray-600"
      :title="t('pagination.firstPage')"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
        />
      </svg>
    </button>

    <!-- الصفحة السابقة -->
    <button
      :disabled="currentPage === 1"
      @click="goToPage(currentPage - 1)"
      class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-md hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-hover)] focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:border-gray-500 dark:disabled:bg-gray-900 dark:disabled:text-gray-600"
      :title="t('pagination.previousPage')"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      <span class="ml-1 hidden sm:inline">{{ t('pagination.previous') }}</span>
    </button>

    <!-- أرقام الصفحات -->
    <div class="flex items-center gap-1">
      <button
        v-for="page in visiblePages"
        :key="page"
        @click="goToPage(page)"
        :disabled="page === '...'"
        class="flex items-center justify-center w-8 sm:w-10 h-8 sm:h-10 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-hover)] focus:ring-offset-1
          hover:scale-110 hover:shadow-md hover:bg-gray-200 hover:border-[var(--color-light)] hover:text-[var(--color-hover)]
          dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-[var(--color-hover)] dark:hover:border-[var(--color-primary)] dark:hover:text-gray-200
          disabled:cursor-default disabled:border-none disabled:bg-transparent disabled:text-gray-500 disabled:shadow-none disabled:transform-none"
        :class="{
          'bg-[var(--color-primary)] border-[var(--color-primary)] text-black shadow-lg scale-110': page === currentPage,
          'pointer-events-none': page === '...'
        }"
      >
        {{ page }}
      </button>
    </div>

    <!-- الصفحة التالية -->
    <button
      :disabled="currentPage === lastPage"
      @click="goToPage(currentPage + 1)"
      class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-md hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-hover)] focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:border-gray-500 dark:disabled:bg-gray-900 dark:disabled:text-gray-600"
      :title="t('pagination.nextPage')"
    >
      <span class="mr-1 hidden sm:inline">{{ t('pagination.next') }}</span>
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>

    <!-- الانتقال إلى الصفحة الأخيرة -->
    <button
      :disabled="currentPage === lastPage"
      @click="goToPage(lastPage)"
      class="flex items-center px-2 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm transition-all duration-200 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-hover)] focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:border-gray-500 dark:disabled:bg-gray-900 dark:disabled:text-gray-600"
      :title="t('pagination.lastPage')"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M13 5l7 7-7 7M5 5l7 7-7 7"
        />
      </svg>
    </button>

    <!-- معلومات الصفحة -->
    <div class="flex flex-col items-center ml-2 sm:ml-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
      <span class="font-medium">{{ t('pagination.pageInfo', { currentPage, lastPage }) }}</span>
      <div v-if="totalItems" class="text-[10px] sm:text-xs text-gray-500 mt-1">
        {{ t('pagination.totalItems', totalItems) }}
      </div>
    </div>
  </div>
</template>


<script setup>
import { computed, defineEmits, defineProps } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
// Props
const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
    validator: (value) => value > 0
  },
  lastPage: {
    type: Number,
    required: true,
    validator: (value) => value > 0
  },
  totalItems: {
    type: Number,
    default: null
  },
  maxVisiblePages: {
    type: Number,
    default: 7
  }
})

// Emits
const emit = defineEmits(['page-changed', 'update:currentPage'])

// Methods
const goToPage = (page) => {
  if (page !== props.currentPage && page >= 1 && page <= props.lastPage) {
    emit('page-changed', page)
    emit('update:currentPage', page)
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// Computed - حساب الصفحات المرئية مع النقاط
const visiblePages = computed(() => {
  const { currentPage, lastPage, maxVisiblePages } = props
  const pages = []

  if (lastPage <= maxVisiblePages) {
    // إذا كان العدد الكلي للصفحات أقل من الحد الأقصى المرئي
    for (let i = 1; i <= lastPage; i++) {
      pages.push(i)
    }
  } else {
    // حساب النطاق المرئي
    const halfVisible = Math.floor(maxVisiblePages / 2)
    let start = Math.max(1, currentPage - halfVisible)
    let end = Math.min(lastPage, currentPage + halfVisible)

    // تعديل النطاق إذا كان قريباً من البداية أو النهاية
    if (end - start + 1 < maxVisiblePages) {
      if (start === 1) {
        end = Math.min(lastPage, start + maxVisiblePages - 1)
      } else {
        start = Math.max(1, end - maxVisiblePages + 1)
      }
    }

    // إضافة الصفحة الأولى والنقاط إذا لزم الأمر
    if (start > 1) {
      pages.push(1)
      if (start > 2) {
        pages.push('...')
      }
    }

    // إضافة الصفحات في النطاق المرئي
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    // إضافة النقاط والصفحة الأخيرة إذا لزم الأمر
    if (end < lastPage) {
      if (end < lastPage - 1) {
        pages.push('...')
      }
      pages.push(lastPage)
    }
  }

  return pages
})
</script>
