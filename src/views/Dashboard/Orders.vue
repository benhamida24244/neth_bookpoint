<template>
  <div class="min-h-screen bg-gray-50">
    <div class="w-full px-4 md:px-6 py-8">
      <!-- Header -->
      <div class="mb-8 font-BonaRegular">
        <h1 class="text-2xl md:text-3xl font-bold text-gray-800">
          {{ translations.dashboard?.orders?.title }}
        </h1>
        <p class="text-gray-600 mt-1">{{ translations.dashboard?.orders?.subtitle }}</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 mb-8">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100"
        >
          <div :class="stat.iconBg" class="p-3 rounded-lg">
            <i :class="stat.icon" class="text-lg"></i>
          </div>
          <div>
            <p class="text-sm text-gray-500">{{ stat.label }}</p>
            <p class="text-lg font-semibold text-gray-800">{{ stat.value }}</p>
          </div>
        </div>
      </div>

      <!-- Filters and Search -->
      <div
        class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6"
      >
        <div class="flex flex-wrap gap-2">
          <button
            v-for="filter in filters"
            :key="filter.value"
            @click="activeFilter = filter.value"
            :class="[
              'px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium transition-all duration-200',
              activeFilter === filter.value
                ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                : 'hover:bg-gray-50'
            ]"
          >
            {{ filter.label }}
          </button>
        </div>

        <div class="relative w-full md:w-auto">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search orders..."
            class="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-light)] focus:border-[var(--color-light)]"
          />
          <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
        </div>
      </div>

      <!-- Orders Table -->
      <div v-if="loading" class="text-center p-12">Loading...</div>
      <div v-else-if="error" class="text-center p-12 text-red-500">{{ error }}</div>
      <div v-else class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {{ translations.dashboard?.orders?.table?.id }}
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {{ translations.dashboard?.orders?.table?.customer }}
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {{ translations.dashboard?.orders?.table?.items }}
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {{ translations.dashboard?.orders?.table?.status }}
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {{ translations.dashboard?.orders?.table?.price }}
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {{ translations.dashboard?.orders?.table?.date }}
                </th>
                <th
                  class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {{ translations.dashboard?.orders?.table?.actions }}
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr
                v-for="order in filteredOrders"
                :key="order.id"
                class="hover:bg-gray-50 transition-colors duration-200"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #{{ order.id }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ order.customer.name }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ order.items.length }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="getStatusClass(order.status)"
                    class="px-3 py-1 rounded-full text-xs font-medium"
                  >
                    {{ order.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${{ parseFloat(order.total_price).toFixed(2) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ new Date(order.created_at).toLocaleDateString() }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center text-sm">
                  <RouterLink
                    :to="`/dashboard/orders/${order.id}`"
                    class="text-[var(--color-primary)] hover:text-[var(--color-primary)] flex items-center justify-center gap-1 text-sm font-medium"
                  >
                    <i class="far fa-eye"></i> {{ translations.dashboard?.orders?.actions.view }}
                  </RouterLink>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-if="filteredOrders.length === 0" class="p-12 text-center">
          <div
            class="mx-auto w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4"
          >
            <i class="far fa-file-alt text-gray-400 text-3xl"></i>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-1">
            {{ translations.dashboard?.orders?.emptyHeader }}
          </h3>
          <p class="text-gray-500">{{ translations.dashboard?.orders?.emptySubtext }}</p>
        </div>

        <!-- Pagination -->
        <div
          v-if="filteredOrders.length > 0"
          class="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between"
        >
          <!-- Pagination controls here -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAdminOrdersStore } from '@/stores/Admin/Orders'
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useLanguageStore } from '@/stores/language'

const languageStore = useLanguageStore()
const translations = computed(() => languageStore.translations)
const ordersStore = useAdminOrdersStore()
const { orders, loading, error } = storeToRefs(ordersStore)

const activeFilter = ref('all')
const searchQuery = ref('')

onMounted(() => {
  ordersStore.fetchOrders()
})

const stats = computed(() => {
  const allOrders = orders.value
  return [
    {
      label: translations.value.dashboard?.orders?.stats?.total,
      value: allOrders.length,
      icon: 'fas fa-list-ol text-blue-500',
      iconBg: 'bg-blue-50'
    },
    {
      label: translations.value.dashboard?.orders?.stats?.pending,
      value: allOrders.filter((o) => o.status === 'pending').length,
      icon: 'fas fa-truck text-yellow-500',
      iconBg: 'bg-yellow-50'
    },
    {
      label: translations.value.dashboard?.orders?.stats?.completed,
      value: allOrders.filter((o) => o.status === 'completed').length,
      icon: 'fas fa-check-circle text-emerald-500',
      iconBg: 'bg-emerald-50'
    },
    {
      label: translations.value.dashboard?.orders?.stats?.shipped,
      value: allOrders.filter((o) => o.status === 'shipped').length,
      icon: 'fas fa-shipping-fast text-indigo-500',
      iconBg: 'bg-indigo-50'
    },
    {
      label: translations.value.dashboard?.orders?.stats?.paid,
      value: allOrders.filter((o) => o.status === 'paid').length,
      icon: 'fas fa-dollar-sign text-green-500',
      iconBg: 'bg-green-50'
    }
  ]
})

const filters = computed(() => [
  { label: translations.value.dashboard?.orders?.filters?.all, value: 'all' },
  { label: translations.value.dashboard?.orders?.filters?.pending, value: 'pending' },
  { label: translations.value.dashboard?.orders?.filters?.paid, value: 'paid' },
  { label: translations.value.dashboard?.orders?.filters?.shipped, value: 'shipped' },
  { label: translations.value.dashboard?.orders?.filters?.completed, value: 'completed' }
])

const filteredOrders = computed(() => {
  let filtered = orders.value

  if (activeFilter.value !== 'all') {
    filtered = filtered.filter((order) => order.status === activeFilter.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (order) =>
        order.customer.name.toLowerCase().includes(query) || order.id.toString().includes(query)
    )
  }

  return filtered
})

const getStatusClass = (status) => {
  const statusClasses = {
    completed: 'bg-green-50 text-green-700',
    pending: 'bg-yellow-50 text-yellow-700',
    shipped: 'bg-indigo-50 text-indigo-700',
    paid: 'bg-blue-50 text-blue-700'
  }
  return statusClasses[status] || 'bg-gray-50 text-gray-700'
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

body {
  font-family: 'Inter', sans-serif;
}
</style>
