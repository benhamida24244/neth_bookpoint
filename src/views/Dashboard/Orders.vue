<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-6">
    <!-- Loading State -->
    <div v-if="ordersStore.loading" class="flex justify-center items-center h-64">
      <LoaderWithText :message="t('loading.orders')" />
    </div>

    <!-- Content -->
    <div v-else>
      <!-- Header -->
      <div class="mb-8 font-BonaRegular ltr:text-left rtl:text-right">
        <h1 class="text-2xl md:text-3xl font-bold text-gray-800">{{ t('dashboard.orders_dash.title') }}</h1>
        <p class="text-gray-600 mt-1">{{ t('dashboard.orders_dash.subtitle') }}</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 mb-8">
        <div v-for="stat in stats" :key="stat.label" class="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
          <div :class="stat.iconBg" class="p-3 rounded-lg">
            <i :class="stat.icon" class="text-lg"></i>
          </div>
          <div class="ltr:text-left rtl:text-right">
            <p class="text-sm text-gray-500">{{ stat.label }}</p>
            <p class="text-lg font-semibold text-gray-800">{{ stat.value }}</p>
          </div>
        </div>
      </div>

      <!-- Filters and Search -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div class="flex flex-wrap gap-2">
          <button v-for="filter in filters" :key="filter.value" @click="activeFilter = filter.value" :class="[
              'px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium transition-all duration-200',
              activeFilter === filter.value ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]' : 'hover:bg-gray-50'
            ]">
            {{ filter.label }}
          </button>
        </div>

        <div class="relative w-full md:w-auto flex gap-2">
           <i class="fas fa-search absolute top-3 text-gray-400 ltr:left-3 rtl:right-3"></i>
          <input v-model="searchQuery" type="text" :placeholder="t('dashboard.orders.searchPlaceholder')" class="w-full md:w-64 ltr:pl-10 ltr:pr-4 rtl:pr-10 rtl:pl-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-light)] focus:border-[var(--color-light)]" />
          <button @click="exportData" class="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium transition-all duration-200 bg-[var(--color-primary)] text-white hover:bg-[var(--color-hover)]">
            {{ t('dashboard.orders.exportData') }}
          </button>
        </div>
      </div>

      <!-- Orders Content -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <!-- Orders Table (for medium screens and up) -->
        <div class="overflow-x-auto hidden md:block">
          <table class="min-w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 ltr:text-left rtl:text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{{ t('dashboard.orders_dash.table.id') }}</th>
                <th class="px-6 py-3 ltr:text-left rtl:text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{{ t('dashboard.orders_dash.table.customer') }}</th>
                <th class="px-6 py-3 ltr:text-left rtl:text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{{ t('dashboard.orders_dash.table.book') }}</th>
                <th class="px-6 py-3 ltr:text-left rtl:text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{{ t('dashboard.orders_dash.table.status') }}</th>
                <th class="px-6 py-3 ltr:text-left rtl:text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{{ t('dashboard.orders_dash.table.price') }}</th>
                <th class="px-6 py-3 ltr:text-left rtl:text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{{ t('dashboard.orders_dash.table.date') }}</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">{{ t('dashboard.orders_dash.table.actions') }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="order in paginatedOrders" :key="order.id" class="hover:bg-gray-50 transition-colors duration-200">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ order.id }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ TheCustomer(order.customer_id) }}</td>
                <td class="px-6 py-4 text-sm">
                  <div v-for="item in order.items" :key="item.id" class="mb-1 ltr:text-left rtl:text-right">{{ item.quantity }} x {{ item.book.title }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusClass(order.status)" class="px-3 py-1 rounded-full text-xs font-medium">{{ order.status }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${{ parseFloat(order.total_price).toFixed(2) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(order.created_at) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-center text-sm">
                  <RouterLink :to="`/dashboard/orders/${order.id}`" class="text-[var(--color-primary)] hover:text-[var(--color-primary)] flex items-center justify-center gap-1 text-sm font-medium">
                    <i class="far fa-eye"></i>
                    <span>{{ t('dashboard.orders_filter.actions.view') }}</span>
                  </RouterLink>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Orders Cards (for small screens) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 md:hidden">
            <div v-for="order in paginatedOrders" :key="order.id" class="bg-gray-50 p-4 rounded-lg shadow-sm border ltr:text-left rtl:text-right">
                <div class="flex justify-between items-center mb-3">
                    <span class="font-bold text-lg text-gray-800">#{{ order.id }}</span>
                    <span :class="getStatusClass(order.status)" class="px-3 py-1 rounded-full text-xs font-medium">{{ order.status }}</span>
                </div>
                <div class="mb-3">
                    <p class="font-semibold text-gray-700">{{ TheCustomer(order.customer_id) }}</p>
                    <div class="text-sm text-gray-500 mt-1">
                        <div v-for="item in order.items" :key="item.id">{{ item.quantity }} x {{ item.book.title }}</div>
                    </div>
                </div>
                <div class="border-t border-gray-200 pt-3">
                    <div class="flex justify-between items-center mb-2">
                        <span class="text-sm text-gray-500">{{ t('dashboard.orders_dash.table.price') }}:</span>
                        <span class="font-semibold text-gray-800">${{ parseFloat(order.total_price).toFixed(2) }}</span>
                    </div>
                    <div class="flex justify-between items-center text-sm text-gray-500 mb-3">
                        <span>{{ t('dashboard.orders_dash.table.date') }}:</span>
                        <span>{{ formatDate(order.created_at) }}</span>
                    </div>
                    <RouterLink :to="`/dashboard/orders/${order.id}`" class="w-full text-center block bg-[var(--color-primary)] text-white py-2 rounded-lg hover:bg-[var(--color-hover)] transition-colors">
                        {{ t('dashboard.orders_filter.actions.view') }}
                    </RouterLink>
                </div>
            </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredOrders.length === 0" class="p-12 text-center">
          <div class="mx-auto w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <i class="far fa-file-alt text-gray-400 text-3xl"></i>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-1">{{ t('dashboard.orders_dash.emptyHeader') }}</h3>
          <p class="text-gray-500">{{ t('dashboard.orders_dash.emptySubtext') }}</p>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-center">
          <Pagination :current-page="currentPage" :last-page="totalPages" :total-items="filteredOrders.length" @page-changed="handlePageChange" />
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
import { useI18n } from 'vue-i18n'
import { ref, computed, onMounted, watch } from 'vue'
import * as XLSX from 'xlsx'
import LoaderWithText from '@/components/LoaderWithText.vue'
import Pagination from '@/components/Pagination.vue'

const { t } = useI18n()
const settingsStore = useSettingsStore()

const ordersStore = useOrdersStore()
const activeFilter = ref('all')
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 10

// جلب بيانات الطلبات عند تحميل المكون
onMounted(() => {
  ordersStore.fetchOrders()
  ordersStore.fetchOrderStats()
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
      const allOrders = ordersStore.stats || {};
      return [
        {
          label: t('dashboard.orders_filter.stats.totalOrders'),
          value: allOrders.ordersCount || 0,
          icon: 'fas fa-list-ol text-blue-500',
          iconBg: 'bg-blue-50'
        },
        {
          label: t('dashboard.orders_filter.stats.avgDeliveryTime'),
          value: allOrders.avgDeliveryTime || 'N/A', // This cannot be calculated from current data
          icon: 'far fa-clock text-green-500',
          iconBg: 'bg-green-50'
        },
        {
          label: t('dashboard.orders_filter.stats.pendingOrders'),
          value: allOrders.ordersPending,
          icon: 'fas fa-truck text-[var(--color-light)]',
          iconBg: 'bg-yellow-50'
        },
        {
          label: t('dashboard.orders_filter.stats.returnedOrders'),
          value: allOrders.ordersCanceled,
          icon: 'fas fa-undo text-red-500',
          iconBg: 'bg-red-50'
        },
        {
          label: t('dashboard.orders_filter.stats.completedOrders'),
          value: allOrders.ordersCompleted,
          icon: 'fas fa-check-circle text-emerald-500',
          iconBg: 'bg-emerald-50'
        }
      ]
    })

    const filters = ref([
      { label: t('dashboard.orders_filter.filters.allOrders'), value: 'all' },
      { label: t('dashboard.orders_filter.filters.pending'), value: 'pending' },
      { label: t('dashboard.orders_filter.filters.shipped'), value: 'shipped' },
      { label: t('dashboard.orders_filter.filters.delivered'), value: 'completed' },
      { label: t('dashboard.orders_filter.filters.cancelled'), value: 'canceled' }
    ])

    // Watch for filter changes to reset page
    watch([activeFilter, searchQuery], () => {
      currentPage.value = 1
    })

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

    const totalPages = computed(() => {
      return Math.ceil(filteredOrders.value.length / itemsPerPage)
    })

    const paginatedOrders = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage
      const end = start + itemsPerPage
      return filteredOrders.value.slice(start, end)
    })

    const getStatusClass = (status) => {
      const statusClasses = {
        'completed': 'bg-green-50 text-green-700',
        'pending': 'bg-yellow-50 text-[var(--color-primary)]',
        'processing': 'bg-blue-50 text-blue-700',
        'shipped': 'bg-purple-50 text-purple-700',
        'delivered': 'bg-green-50 text-green-700',
        'canceled': 'bg-red-50 text-red-700'
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

    const handlePageChange = (page) => {
      currentPage.value = page
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
/* Keeping imports for fonts and icons */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

body {
  font-family: 'Inter', sans-serif;
}
</style>