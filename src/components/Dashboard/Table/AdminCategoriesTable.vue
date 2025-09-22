<script setup>
import { RouterLink } from 'vue-router'
import { computed } from 'vue'
import { useCategoriesStore } from '@/stores/Categories'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const categoriesStore = useCategoriesStore()

const categories = computed(() => categoriesStore.categories)

const getStatusClass = (status) => {
  const normalized = typeof status === 'number' ? (status === 1 ? 'active' : 'inactive') : status?.toString().toLowerCase()
  switch (normalized) {
    case 'active':
      return 'bg-green-100 text-green-800'
    case 'inactive':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStatusText = (status) => {
    return typeof status === 'number'
        ? status === 1
            ? t('dashboard.categories.statusActive')
            : t('dashboard.categories.statusInactive')
        : status;
}

const sortedCategories = computed(() =>
  [...categories.value].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
)
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
    <!-- Table for Medium screens and up -->
    <div class="overflow-x-auto hidden md:block">
      <table class="min-w-full">
        <thead class="bg-gray-50">
          <tr class="ltr:text-left rtl:text-right">
            <th class="p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">{{ t('dashboard.categories.table.hash') }}</th>
            <th class="p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">{{ t('dashboard.categories.table.name') }}</th>
            <th class="p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">{{ t('dashboard.categories.table.status') }}</th>
            <th class="p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">{{ t('dashboard.categories.table.orders') }}</th>
            <th class="p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">{{ t('dashboard.categories.table.books') }}</th>
            <th class="p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">{{ t('dashboard.categories.table.createdAt') }}</th>
            <th class="p-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">{{ t('dashboard.categories.table.action') }}</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="(category, index) in sortedCategories" :key="category.id" class="hover:bg-gray-50 transition-colors duration-200 ltr:text-left rtl:text-right">
            <td class="p-4 whitespace-nowrap text-sm text-gray-600">{{ index + 1 }}</td>
            <td class="p-4 whitespace-nowrap text-sm font-semibold text-gray-800">{{ category.name }}</td>
            <td class="p-4 whitespace-nowrap">
              <span :class="[getStatusClass(category.status), 'px-3 py-1 rounded-full text-xs font-medium']">
                {{ getStatusText(category.status) }}
              </span>
            </td>
            <td class="p-4 whitespace-nowrap text-sm text-gray-500">{{ category.orders }}</td>
            <td class="p-4 whitespace-nowrap text-sm text-gray-500">{{ category.nmBook }}</td>
            <td class="p-4 whitespace-nowrap text-sm text-gray-500">{{ new Date(category.created_at).toLocaleDateString() }}</td>
            <td class="p-4 whitespace-nowrap text-center">
              <RouterLink :to="`/dashboard/categories/${category.id}`" class="text-[var(--color-primary)] hover:underline flex items-center justify-center gap-1 text-sm font-medium">
                <i class="far fa-eye"></i>
                <span>{{ t('dashboard.categories.table.view') }}</span>
              </RouterLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Cards for Small screens -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 md:hidden">
        <div v-for="(category, index) in sortedCategories" :key="category.id" class="bg-gray-50 p-4 rounded-lg shadow-sm border ltr:text-left rtl:text-right">
            <div class="flex justify-between items-start">
                <h3 class="font-bold text-lg text-gray-800 mb-2">{{ category.name }}</h3>
                <span :class="[getStatusClass(category.status), 'px-3 py-1 rounded-full text-xs font-medium']">{{ getStatusText(category.status) }}</span>
            </div>
            <div class="mt-2 space-y-2 text-sm text-gray-600">
                <div class="flex justify-between">
                    <span>{{ t('dashboard.categories.table.books') }}:</span>
                    <span class="font-semibold">{{ category.nmBook }}</span>
                </div>
                <div class="flex justify-between">
                    <span>{{ t('dashboard.categories.table.orders') }}:</span>
                    <span class="font-semibold">{{ category.orders }}</span>
                </div>
                <div class="flex justify-between">
                    <span>{{ t('dashboard.categories.table.createdAt') }}:</span>
                    <span>{{ new Date(category.created_at).toLocaleDateString() }}</span>
                </div>
            </div>
            <div class="border-t mt-4 pt-3">
                <RouterLink :to="`/dashboard/categories/${category.id}`" class="w-full text-center block bg-[var(--color-primary)] text-white py-2 rounded-lg hover:bg-[var(--color-hover)] transition-colors">
                    {{ t('dashboard.categories.table.view') }}
                </RouterLink>
            </div>
        </div>
    </div>

    <!-- Empty State -->
    <div v-if="categories.length === 0" class="p-12 text-center">
      <div class="mx-auto w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <i class="fas fa-folder-open text-gray-400 text-3xl"></i>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-1">{{ t('dashboard.categories.emptyHeader') }}</h3>
      <p class="text-gray-500">{{ t('dashboard.categories.emptySubtext') }}</p>
    </div>
  </div>
</template>