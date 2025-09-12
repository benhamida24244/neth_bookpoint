<script setup>
import { computed } from 'vue'
import { useOrdersStore } from '@/stores/Orders'
import { storeToRefs } from 'pinia'
import { CheckCircle } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import LoaderWithText from '@/components/LoaderWithText.vue'
import { useLoading } from '@/composables/useLoading'

const { t } = useI18n()
const ordersStore = useOrdersStore()
const { latestOrder, isLoading } = storeToRefs(ordersStore)
const { isLoading: ordersLoading } = useLoading(ordersStore)

const order = computed(() => latestOrder.value)

const subtotal = computed(() => {
  if (!order.value || !order.value.items) return 0
  return order.value.items.reduce((sum, item) => sum + (item.price * item.quantity || 0), 0)
})
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-BonaRegular">
    <div v-if="ordersLoading" class="flex justify-center items-center h-64">
      <LoaderWithText :message="t('loading.order')" />
    </div>
    <div
      v-else-if="order"
      class="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 transition-all transform hover:scale-105 duration-300"
    >
      <div class="text-center mb-8">
        <CheckCircle class="w-16 h-16 text-green-500 mx-auto animate-pulse" />
        <h1 class="text-3xl font-bold text-gray-800 mt-4">{{ t('paymentSuccess.title') }}</h1>
        <p class="text-gray-600 mt-2">{{ t('paymentSuccess.subtitle') }}</p>
      </div>

      <div class="bg-gray-100 rounded-xl p-6 mb-6">
        <h2 class="text-xl font-semibold text-gray-700 mb-4">
          {{ t('paymentSuccess.orderSummary') }}
        </h2>
        <div class="space-y-3">
          <div
            v-for="item in order.items"
            :key="item.id"
            class="flex items-center justify-between"
            v-if="order.items"
          >
            <div class="flex items-center">
              <img
                :src="`${apiBaseUrl}${item.book.cover}`"
                :alt="item.name"
                class="w-16 h-16 rounded-lg mr-4 object-cover"
              />
              <div>
                <p class="font-medium text-gray-800">{{ item.book.title }}</p>
                <p class="text-sm text-gray-500">
                  {{ t('paymentSuccess.quantity') }}{{ item.quantity }}
                </p>
              </div>
            </div>
            <p class="font-semibold text-gray-800">${{ (item.price * item.quantity).toFixed(2) }}</p>
          </div>
        </div>
      </div>

      <div class="border-t pt-4 space-y-2 text-gray-700">
        <div class="flex justify-between">
          <span>{{ t('paymentSuccess.subtotal') }}</span>
          <span>${{ subtotal.toFixed(2) }}</span>
        </div>
        <div class="flex justify-between">
          <span>{{ t('paymentSuccess.shipping') }}</span>
          <span
            >${{
              order.totals && order.totals.shipping ? order.totals.shipping.toFixed(2) : '0.00'
            }}</span
          >
        </div>
        <div class="flex justify-between text-sm">
          <span>{{ t('paymentSuccess.vat') }}</span>
          <span>${{ order.totals && order.totals.vat ? order.totals.vat.toFixed(2) : '0.00' }}</span>
        </div>
        <div class="flex justify-between text-lg font-bold text-gray-900 border-t pt-2 mt-2">
          <span>{{ t('paymentSuccess.total') }}</span>
          <span class="text-green-600"
            >${{
              order.totals?.total
                ? order.totals.total.toFixed(2)
                : subtotal
                ? subtotal.toFixed(2)
                : '0.00'
            }}</span
          >
        </div>
      </div>

      <div class="mt-8 text-center">
        <RouterLink
          to="/shop"
          class="bg-[var(--color-primary)] hover:bg-[var(--color-hover)] text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
        >
          {{ t('paymentSuccess.continueShopping') }}
        </RouterLink>
        <RouterLink to="/profile" class="ml-4 text-[var(--color-primary)] hover:underline">
          {{ t('paymentSuccess.viewOrderHistory') }}
        </RouterLink>
      </div>
    </div>
    <div v-else class="text-center">
      <h1 class="text-2xl font-bold text-gray-700">{{ t('paymentSuccess.noOrderDetails') }}</h1>
      <p class="text-gray-500 mt-2">{{ t('paymentSuccess.completePurchase') }}</p>
      <RouterLink
        to="/shop"
        class="mt-4 inline-block bg-[var(--color-primary)] hover:bg-[var(--color-hover)] text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
      >
        {{ t('paymentSuccess.goToShop') }}
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
