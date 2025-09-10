<template>
  <div class="min-h-screen bg-gray-50">
    <div class="w-full px-4 md:px-6 py-8">
      <!-- Header -->
      <div class="mb-8 font-BonaRegular">
        <h1 class="text-2xl md:text-3xl font-bold text-gray-800">
          {{ t('dashboard.orders.title') }}
        </h1>
        <p class="text-gray-600 mt-1">{{ t('dashboard.orders.subtitle') }}</p>
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

        <div class="relative w-full md:w-auto flex gap-2">
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="t('dashboard.orders.searchPlaceholder')"
            class="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-light)] focus:border-[var(--color-light)]"
          />
          <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
          <button
            @click="exportData"
            class="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium transition-all duration-200 bg-[var(--color-primary)] text-white hover:bg-[var(--color-hover)]"
          >
            {{ t('dashboard.orders.exportData') }}
          </button>
        </div>
      </div>

      <!-- Orders Table -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {{ t('dashboard.orders.table.id') }}
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {{ t('dashboard.orders.table.customer') }}
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {{ t('dashboard.orders.table.book') }}
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {{ t('dashboard.orders.table.status') }}
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {{ t('dashboard.orders.table.price') }}
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {{ t('dashboard.orders.table.date') }}
                </th>
                <th
                  class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {{ t('dashboard.orders.table.actions') }}
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
                  {{ order.id }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ TheCustomer(order.customer_id) }}
                </td>
                <td class="px-6 py-4 text-sm">
                  <div v-for="item in order.items" :key="item.id" class="mb-1">
                    {{ item.quantity }} x {{ item.book.title }}
                  </div>
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
                  {{ formatDate(order.created_at) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center text-sm">
                  <RouterLink
                    :to="`/dashboard/orders/${order.id}`"
                    class="text-[var(--color-primary)] hover:text-[var(--color-primary)] flex items-center gap-1 text-sm font-medium"
                  >
                    <i class="far fa-eye"></i> {{ t('dashboard.orders.actions.view') }}
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
            {{ t('dashboard.orders.emptyHeader') }}
          </h3>
          <p class="text-gray-500">{{ t('dashboard.orders.emptySubtext') }}</p>
        </div>

        <!-- Pagination -->
        <div
          v-if="filteredOrders.length > 0"
          class="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between"
        >
          <div class="flex-1 flex justify-between sm:hidden">
            <button
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              {{ t('pagination.previous') }}
            </button>
            <button
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              {{ t('pagination.next') }}
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                {{ t('pagination.showing') }}
                <span class="font-medium">1</span>
                {{ t('pagination.to') }}
                <span class="font-medium">{{ filteredOrders.length }}</span>
                {{ t('pagination.of') }}
                <span class="font-medium">{{ filteredOrders.length }}</span>
                {{ t('pagination.results') }}
              </p>
            </div>
            <div>
              <nav
                class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span class="sr-only">{{ t('pagination.previous') }}</span>
                  <i class="fas fa-chevron-left"></i>
                </button>
                <button
                  class="z-10 bg-yellow-50 border-[var(--color-light)] text-[var(--color-primary)] relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                >
                  1
                </button>
                <button
                  class="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                >
                  2
                </button>
                <button
                  class="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                >
                  3
                </button>
                <button
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span class="sr-only">{{ t('pagination.next') }}</span>
                  <i class="fas fa-chevron-right"></i>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useClientsStore } from '@/stores/Clients'
import { useCounterStore } from '@/stores/counter'
import { useCustomerAuthStore } from '@/stores/customerAuth'
import { useOrdersStore } from '@/stores/Orders'
import { useSettingsStore } from '@/stores/settings'
import { ref, computed, onMounted } from 'vue'
import * as XLSX from 'xlsx'

const settingsStore = useSettingsStore()

const ordersStore = useOrdersStore()
const activeFilter = ref('all')
const searchQuery = ref('')

// جلب بيانات الطلبات عند تحميل المكون
onMounted(() => {
  ordersStore.fetchOrders()
})

    const exportData = () => {
      const data = filteredOrders.value.map(order => ({
        'Order ID': order.id,
        'Customer': TheCustomer(order.customer_id),
        'Book': order.items.map(item => `${item.quantity} x ${item.book.title}`).join(', '),
        'Status': order.status,
        'Price': order.total_price,
        'Date': formatDate(order.created_at)
      }))
      const ws = XLSX.utils.json_to_sheet(data)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Orders')
      XLSX.writeFile(wb, 'orders.xlsx')
    }

    const stats = computed(() => {
      const allOrders = ordersStore.orders;
      return [
        {
          label: 'Total Orders',
          value: allOrders.length,
          icon: 'fas fa-list-ol text-blue-500',
          iconBg: 'bg-blue-50'
        },
        {
          label: 'Avg Delivery Time',
          value: '3 days', // This cannot be calculated from current data
          icon: 'far fa-clock text-green-500',
          iconBg: 'bg-green-50'
        },
        {
          label: 'Pending Orders',
          value: allOrders.filter(o => o.status === 'Pending').length,
          icon: 'fas fa-truck text-[var(--color-light)]',
          iconBg: 'bg-yellow-50'
        },
        {
          label: 'Returned Orders',
          value: allOrders.filter(o => o.status === 'Returned').length,
          icon: 'fas fa-undo text-red-500',
          iconBg: 'bg-red-50'
        },
        {
          label: 'Completed Orders',
          value: allOrders.filter(o => o.status === 'Completed').length,
          icon: 'fas fa-check-circle text-emerald-500',
          iconBg: 'bg-emerald-50'
        }
      ]
    })

    const filters = ref([
      { label: 'All Orders', value: 'all' },
      { label: 'Pending', value: 'pending' },
      { label: 'Shipped', value: 'shipped' },
      { label: 'Delivered', value: 'delivered' },
      { label: 'Cancelled', value: 'cancelled' }
    ])

    const filteredOrders = computed(() => {
      let filtered = ordersStore.orders

      // Filter by status
      if (activeFilter.value !== 'all') {
        filtered = filtered.filter(order => order.status === activeFilter.value)
      }

      // Filter by search query
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(order =>
          order.customer_id.toString().includes(query) ||
          order.items.some(item => item.book.title.toLowerCase().includes(query)) ||
          order.id.toString().includes(query)
        )
      }

      return filtered
    })

    const getStatusClass = (status) => {
      const statusClasses = {
        'completed': 'bg-green-50 text-green-700',
        'pending': 'bg-yellow-50 text-[var(--color-primary)]',
        'processing': 'bg-blue-50 text-blue-700',
        'shipped': 'bg-purple-50 text-purple-700',
        'delivered': 'bg-green-50 text-green-700',
        'cancelled': 'bg-red-50 text-red-700'
      }
      return statusClasses[status] || 'bg-gray-50 text-gray-700'
    }
    const customerStore = useClientsStore()
    const TheCustomer = (id) => {
      try {
        // التأكد من تحميل بيانات العملاء أولاً
        if (!customerStore.loaded) {
          customerStore.fetchClients().then(() => {
            // بعد تحميل البيانات، تحديث الجدول
            forceUpdate()
          })
          return `Loading...`
        }
        const customer = customerStore.getClientById(id)
        return customer ? customer.name : `Customer #${id}`
      } catch (error) {
        console.error('Error fetching customer:', error)
        return `Customer #${id}`
      }
    }

    // لفرض إعادة تحديث المكون
    const forceUpdate = () => {
      searchQuery.value = searchQuery.value
    }
    // تنسيق التاريخ
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }


</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

body {
  font-family: 'Inter', sans-serif;
}
</style>
