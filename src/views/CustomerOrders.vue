<template>
  <div class="min-h-screen bg-gray-50">
    <div class="w-full px-4 md:px-6 py-8">
      <!-- Header -->
      <div class="mb-8 font-BonaRegular">
        <h1 class="text-2xl md:text-3xl font-bold text-gray-800">
          {{ $t('orders.title') }}
        </h1>
        <p class="text-gray-600 mt-1">{{ $t('orders.subtitle') }}</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center p-12">Loading...</div>
      <div v-else-if="error" class="text-center p-12 text-red-500">{{ error }}</div>

      <!-- Orders List -->
      <div v-else class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  #
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Items
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Total
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr
                v-for="order in orders"
                :key="order.id"
                class="hover:bg-gray-50 transition-colors duration-200"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #{{ order.id }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ new Date(order.created_at).toLocaleDateString() }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ order.items.length }} item(s)
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="getStatusClass(order.status)"
                    class="px-3 py-1 rounded-full text-xs font-medium"
                  >
                    {{ order.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  ${{ parseFloat(order.total_price).toFixed(2) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-if="orders.length === 0" class="p-12 text-center">
          <div
            class="mx-auto w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4"
          >
            <i class="far fa-file-alt text-gray-400 text-3xl"></i>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-1">
            No orders yet
          </h3>
          <p class="text-gray-500">Your orders will appear here once you place them.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useCustomerOrdersStore } from '@/stores/CustomerOrders';
import { useAuthStore } from '@/stores/Auth';
import { storeToRefs } from 'pinia';

const ordersStore = useCustomerOrdersStore();
const { orders, loading, error } = storeToRefs(ordersStore);
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

onMounted(() => {
  if (user.value) {
    ordersStore.fetchOrders();
  }
});

const getStatusClass = (status) => {
  const statusClasses = {
    completed: 'bg-green-50 text-green-700',
    pending: 'bg-yellow-50 text-yellow-700',
    shipped: 'bg-indigo-50 text-indigo-700',
    paid: 'bg-blue-50 text-blue-700'
  };
  return statusClasses[status] || 'bg-gray-50 text-gray-700';
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

body {
  font-family: 'Inter', sans-serif;
}
</style>
