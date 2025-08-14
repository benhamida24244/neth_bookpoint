<script setup>
import { computed } from 'vue'
import { useOrdersStore } from '@/stores/Orders'
import { storeToRefs } from 'pinia'
import { CheckCircle } from 'lucide-vue-next'

const ordersStore = useOrdersStore()
const { latestOrder } = storeToRefs(ordersStore)

const order = computed(() => latestOrder.value)

const subtotal = computed(() =>
  order.value.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
)
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-BonaRegular">
    <div
      v-if="order"
      class="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 transition-all transform hover:scale-105 duration-300"
    >
      <div class="text-center mb-8">
        <CheckCircle class="w-16 h-16 text-green-500 mx-auto animate-pulse" />
        <h1 class="text-3xl font-bold text-gray-800 mt-4">Payment Successful!</h1>
        <p class="text-gray-600 mt-2">Thank you for your purchase. Your order is confirmed.</p>
      </div>

      <div class="bg-gray-100 rounded-xl p-6 mb-6">
        <h2 class="text-xl font-semibold text-gray-700 mb-4">Order Summary</h2>
        <div class="space-y-3">
          <div v-for="item in order.items" :key="item.id" class="flex items-center justify-between">
            <div class="flex items-center">
              <img :src="item.image" :alt="item.name" class="w-16 h-16 rounded-lg mr-4 object-cover" />
              <div>
                <p class="font-medium text-gray-800">{{ item.name }}</p>
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
          <span>Shipping</span>
          <span>${{ order.totals.shipping.toFixed(2) }}</span>
        </div>
        <div class="flex justify-between text-sm">
          <span>VAT (15%)</span>
          <span>${{ order.totals.vat.toFixed(2) }}</span>
        </div>
        <div class="flex justify-between text-lg font-bold text-gray-900 border-t pt-2 mt-2">
          <span>Total</span>
          <span class="text-green-600">${{ order.totals.total.toFixed(2) }}</span>
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

<style scoped>
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.animate-pulse {
  animation: pulse 1.5s infinite;
}
</style>
