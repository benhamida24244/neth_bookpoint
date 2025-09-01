<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAdminOrdersStore } from '@/stores/Admin/Orders';
import { storeToRefs } from 'pinia';
import { CheckCircleIcon, ClockIcon, TruckIcon, UserIcon, EnvelopeIcon } from '@heroicons/vue/24/outline';

const ORDER_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  SHIPPED: 'shipped',
  COMPLETED: 'completed',
};

const STATUS_CONFIG = {
  [ORDER_STATUS.COMPLETED]: { color: 'text-green-700 bg-green-100', icon: CheckCircleIcon, label: 'Completed' },
  [ORDER_STATUS.PENDING]: { color: 'text-yellow-700 bg-yellow-100', icon: ClockIcon, label: 'Pending' },
  [ORDER_STATUS.SHIPPED]: { color: 'text-indigo-700 bg-indigo-100', icon: TruckIcon, label: 'Shipped' },
  [ORDER_STATUS.PAID]: { color: 'text-blue-700 bg-blue-100', icon: CheckCircleIcon, label: 'Paid' },
};

const route = useRoute();
const router = useRouter();
const ordersStore = useAdminOrdersStore();

const { order: selectedOrder, loading: isLoading, error } = storeToRefs(ordersStore);
const isUpdating = ref(false);
const showSuccessMessage = ref(false);

const orderId = computed(() => parseInt(route.params.id));

const statusConfig = computed(() => selectedOrder.value ? STATUS_CONFIG[selectedOrder.value.status] : null);

const statusOptions = Object.values(ORDER_STATUS).map(status => ({
  value: status,
  label: status.charAt(0).toUpperCase() + status.slice(1),
}));

const formattedOrderDate = computed(() => {
  if (!selectedOrder.value?.created_at) return '';
  return new Date(selectedOrder.value.created_at).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });
});

const updateOrderStatus = async (newStatus) => {
  if (!selectedOrder.value || isUpdating.value) return;
  isUpdating.value = true;
  try {
    await ordersStore.updateOrderStatus(orderId.value, newStatus);
    showSuccessMessage.value = true;
    setTimeout(() => showSuccessMessage.value = false, 3000);
  } catch (err) {
    console.error('Error updating order status:', err);
  } finally {
    isUpdating.value = false;
  }
};

const goBack = () => router.go(-1);

onMounted(() => {
  ordersStore.fetchOrder(orderId.value);
});

watch(() => route.params.id, (newId) => {
  if (newId) {
    ordersStore.fetchOrder(parseInt(newId));
  }
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div v-if="isLoading" class="flex items-center justify-center min-h-screen">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
    <div v-else-if="error" class="text-center p-8">
      <p class="text-red-500">{{ error }}</p>
      <button @click="goBack" class="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg">{{ translations.dashboard?.orderDetails?.goBack }}</button>
    </div>
    <div v-else-if="selectedOrder" class="max-w-4xl mx-auto px-4 md:px-6 py-8">
      <Transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="showSuccessMessage" class="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
          <CheckCircleIcon class="h-5 w-5 text-green-600 mr-3" />
          <span class="text-green-800 font-medium">{{ translations.dashboard?.orderDetails?.updateSuccess }}</span>
        </div>
      </Transition>

      <div class="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <button @click="goBack" class="p-2 text-gray-600 hover:bg-gray-100 rounded-lg mr-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
          </button>
          <h1 class="text-2xl md:text-3xl font-bold text-gray-900 inline">Order Details #{{ selectedOrder.id }}</h1>
          <p class="text-gray-600 mt-1">{{ formattedOrderDate }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">{{ translations.dashboard?.orderDetails?.statusTitle }}</h2>
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center">
                <component :is="statusConfig.icon" class="h-6 w-6 mr-3" :class="statusConfig.color.split(' ')[0]" />
                <span class="px-3 py-1 rounded-full text-sm font-medium" :class="statusConfig.color">{{ statusConfig.label }}</span>
              </div>
            </div>
            <div class="mt-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">Update {{ translations.dashboard?.orderDetails?.statusTitle }}</label>
              <select @change="updateOrderStatus($event.target.value)" :value="selectedOrder.status" :disabled="isUpdating" class="w-full border border-gray-300 rounded-lg p-2">
                <option v-for="option in statusOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
              </select>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
             <h2 class="text-lg font-semibold text-gray-900 mb-4">{{ translations.dashboard?.orderDetails?.itemsTitle }}</h2>
             <div v-for="item in selectedOrder.items" :key="item.id" class="flex items-center space-x-4 mb-4">
                <img :src="item.book.cover_image_url" :alt="item.book.title" class="w-20 h-28 object-cover rounded-lg border">
                <div class="flex-1">
                   <h3 class="font-semibold text-gray-900">{{ item.book.title }}</h3>
                   <p class="text-sm text-gray-600">by {{ item.book.author.name }}</p>
                   <p class="text-sm text-gray-500">Qty: {{ item.quantity }}</p>
                </div>
                <span class="font-semibold text-gray-900">${{ parseFloat(item.price).toFixed(2) }}</span>
             </div>
          </div>
        </div>

        <div class="space-y-6">
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">{{ translations.dashboard?.orderDetails?.customerInfoTitle }}</h2>
            <div class="space-y-3">
              <div class="flex items-center"><UserIcon class="h-5 w-5 text-gray-400 mr-3" /><span>{{ selectedOrder.customer.name }}</span></div>
              <div class="flex items-center"><EnvelopeIcon class="h-5 w-5 text-gray-400 mr-3" /><a :href="`mailto:${selectedOrder.customer.email}`" class="text-blue-600 hover:underline">{{ selectedOrder.customer.email }}</a></div>
            </div>
          </div>
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">{{ translations.dashboard?.orderDetails?.summaryTitle }}</h2>
            <div class="space-y-2">
                <div class="flex justify-between"><span class="text-gray-600">Total</span><span class="font-medium">${{ parseFloat(selectedOrder.total_price).toFixed(2) }}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@media print { .no-print { display: none !important; } }
</style>
