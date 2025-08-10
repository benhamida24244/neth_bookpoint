<template>
  <div class="min-h-screen bg-gray-50">
    <div class="w-full px-4 md:px-6 py-8">
      <!-- Header -->
      <div class="mb-8 font-BonaRegular">
        <h1 class="text-2xl md:text-3xl font-bold text-gray-800">Order Management</h1>
        <p class="text-gray-600 mt-1">Track and manage all your book orders efficiently</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 mb-8">
        <div v-for="stat in stats" :key="stat.label" class="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
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
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div class="flex flex-wrap gap-2">
          <button
            v-for="filter in filters"
            :key="filter.value"
            @click="activeFilter = filter.value"
            :class="[
              'px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium transition-all duration-200',
              activeFilter === filter.value
                ? 'bg-yellow-600 text-white border-yellow-600'
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
            class="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
          >
          <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
        </div>
      </div>

      <!-- Orders Table -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr
                v-for="order in filteredOrders"
                :key="order.id"
                class="hover:bg-gray-50 transition-colors duration-200"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ order.id }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ order.customer }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ order.book }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusClass(order.status)" class="px-3 py-1 rounded-full text-xs font-medium">
                    {{ order.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ order.price }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ order.date }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-center text-sm">
                  <RouterLink :to="`/dashboard/orders/${order.id}`" class="text-yellow-600 hover:text-yellow-700 flex items-center gap-1 text-sm font-medium">
                    <i class="far fa-eye"></i> View
                  </RouterLink>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-if="filteredOrders.length === 0" class="p-12 text-center">
          <div class="mx-auto w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <i class="far fa-file-alt text-gray-400 text-3xl"></i>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-1">No orders found</h3>
          <p class="text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
        </div>

        <!-- Pagination -->
        <div v-if="filteredOrders.length > 0" class="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <div class="flex-1 flex justify-between sm:hidden">
            <button class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Previous
            </button>
            <button class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Next
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Showing <span class="font-medium">1</span> to <span class="font-medium">{{ filteredOrders.length }}</span> of <span class="font-medium">{{ filteredOrders.length }}</span> results
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span class="sr-only">Previous</span>
                  <i class="fas fa-chevron-left"></i>
                </button>
                <button class="z-10 bg-yellow-50 border-yellow-500 text-yellow-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                  1
                </button>
                <button class="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                  2
                </button>
                <button class="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                  3
                </button>
                <button class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span class="sr-only">Next</span>
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
import { useOrdersStore } from '@/stores/Orders'
import { ref, computed } from 'vue'

    const ordersStore = useOrdersStore()

    const activeFilter = ref('all')
    const searchQuery = ref('')

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
          icon: 'fas fa-truck text-yellow-500',
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
      { label: 'Completed', value: 'Completed' },
      { label: 'Pending', value: 'Pending' },
      { label: 'Returned', value: 'Returned' }
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
          order.customer.toLowerCase().includes(query) ||
          order.book.toLowerCase().includes(query) ||
          order.id.toString().includes(query)
        )
      }

      return filtered
    })

    const getStatusClass = (status) => {
      const statusClasses = {
        'Completed': 'bg-green-50 text-green-700',
        'Pending': 'bg-yellow-50 text-yellow-700',
        'Returned': 'bg-red-50 text-red-700'
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
