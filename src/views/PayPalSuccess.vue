<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import apiService from '@/services/api';
import { useOrdersStore } from '@/stores/Orders';
import { Loader } from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();
const ordersStore = useOrdersStore();

const loading = ref(true);
const error = ref('');

onMounted(async () => {
  const { payment_token, token } = route.query;

  if (!payment_token || !token) {
    error.value = 'Invalid PayPal callback URL. Missing tokens.';
    loading.value = false;
    return;
  }

  try {
    const response = await apiService.orders.paypalCapture({ payment_token, token });
    const { order } = response.data;

    // Finalize the order in the store
    ordersStore.finalizeOrder(order);

    // Redirect to the generic payment success page
    router.push({ name: 'payment-success', query: { orderId: order.id } });

  } catch (e) {
    console.error('PayPal capture error:', e.response?.data || e.message);
    error.value = e.response?.data?.error || 'Failed to process PayPal payment.';
    loading.value = false;
    // Optional: Redirect to a cancellation/failure page
    // router.push({ name: 'paypal-cancel' });
  }
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div v-if="loading" class="text-center">
      <Loader class="w-16 h-16 text-blue-500 mx-auto animate-spin" />
      <h1 class="text-2xl font-bold text-gray-700 mt-4">Processing PayPal Payment...</h1>
      <p class="text-gray-600">Please do not close this window.</p>
    </div>

    <div v-if="error" class="text-center text-red-500">
        <h1 class="text-2xl font-bold">Payment Processing Failed</h1>
        <p>{{ error }}</p>
         <RouterLink
          to="/checkout"
          class="mt-4 inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg"
        >
          Try Again
        </RouterLink>
    </div>
  </div>
</template>
