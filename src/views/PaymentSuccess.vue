<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useOrdersStore } from '@/stores/Orders';
import { CheckCircle, Loader } from 'lucide-vue-next';

const route = useRoute();
const ordersStore = useOrdersStore();

const order = ref(null);
const loading = ref(true);
const error = ref('');

onMounted(async () => {
  const orderId = route.query.orderId;
  if (orderId) {
    try {
      const fetchedOrder = await ordersStore.fetchOrder(Number(orderId));
      if (fetchedOrder) {
        order.value = fetchedOrder;
      } else {
        error.value = "Could not retrieve order details.";
      }
    } catch (e) {
      error.value = "An error occurred while fetching your order.";
      console.error(e);
    } finally {
      loading.value = false;
    }
  } else {
    // Fallback to latest order if no ID is provided
    // This is not ideal but provides a fallback
    order.value = ordersStore.latestOrder;
    loading.value = false;
     if (!order.value) {
        error.value = "No order ID was provided and no recent order was found.";
     }
  }
});

const subtotal = computed(() => {
    if (!order.value || !order.value.items) return 0;
    return order.value.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
});

const total = computed(() => {
    if (!order.value) return 0;
    // The backend already sends the total_price, so we can use it directly.
    return order.value.total_price;
});

</script>

<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-BonaRegular">
    <div v-if="loading" class="text-center">
      <Loader class="w-16 h-16 text-blue-500 mx-auto animate-spin" />
      <h1 class="text-2xl font-bold text-gray-700 mt-4">Loading Order Details...</h1>
    </div>

    <div v-else-if="error" class="text-center text-red-500">
        <h1 class="text-2xl font-bold">Error</h1>
        <p>{{ error }}</p>
         <RouterLink
          to="/shop"
          class="mt-4 inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
        >
          Go to Shop
        </RouterLink>
    </div>

    <div
      v-else-if="order"
      class="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 transition-all"
    >
      <div class="text-center mb-8">
        <CheckCircle class="w-16 h-16 text-green-500 mx-auto" />
        <h1 class="text-3xl font-bold text-gray-800 mt-4">Payment Successful!</h1>
        <p class="text-gray-600 mt-2">Thank you for your purchase. Your order #{{ order.id }} is confirmed.</p>
      </div>

      <div class="bg-gray-100 rounded-xl p-6 mb-6">
        <h2 class="text-xl font-semibold text-gray-700 mb-4">Order Summary</h2>
        <div class="space-y-3">
          <div v-for="item in order.items" :key="item.id" class="flex items-center justify-between">
            <div class="flex items-center">
              <img :src="item.book.cover_image_url" :alt="item.book.title" class="w-16 h-16 rounded-lg mr-4 object-cover" />
              <div>
                <p class="font-medium text-gray-800">{{ item.book.title }}</p>
                <p class="text-sm text-gray-500">Quantity: {{ item.quantity }}</p>
              </div>
            </div>
            <p class="font-semibold text-gray-800">${{ (item.price * item.quantity).toFixed(2) }}</p>
          </div>
        </div>
      </div>

      <div class="border-t pt-4 space-y-2 text-gray-700">
        <div class="flex justify-between">
          <span>Subtotal</span>
          <span>${{ subtotal.toFixed(2) }}</span>
        </div>
         <div class="flex justify-between">
          <span>Payment Method</span>
          <span class="capitalize">{{ order.payment_method.replace('_', ' ') }}</span>
        </div>
        <div class="flex justify-between text-lg font-bold text-gray-900 border-t pt-2 mt-2">
          <span>Total</span>
          <span class="text-green-600">${{ parseFloat(total).toFixed(2) }}</span>
        </div>
      </div>

      <div class="mt-8 text-center">
        <RouterLink
          to="/shop"
          class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
        >
          Continue Shopping
        </RouterLink>
        <RouterLink
          to="/profile"
          class="ml-4 text-blue-500 hover:underline"
        >
          View Order History
        </RouterLink>
      </div>
    </div>
     <div v-else class="text-center">
      <h1 class="text-2xl font-bold text-gray-700">No order details found.</h1>
      <p class="text-gray-500 mt-2">Please complete a purchase to see your order summary.</p>
      <RouterLink
          to="/shop"
          class="mt-4 inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
        >
          Go to Shop
        </RouterLink>
    </div>
  </div>
</template>
