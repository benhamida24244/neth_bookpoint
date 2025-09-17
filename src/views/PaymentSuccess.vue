<script setup>
import { computed, onMounted, ref } from 'vue'
import { useOrdersStore } from '@/stores/Orders'
import { useI18n } from 'vue-i18n'
import LoaderWithText from '@/components/LoaderWithText.vue'
import { CheckCircle } from 'lucide-vue-next'
import { defineProps } from 'vue'

const props = defineProps({
  customer: { type: String, default: null },
  token: { type: String, default: null },
})

const { t } = useI18n()
const ordersStore = useOrdersStore()
const currentOrder = ref(null)
const loading = ref(true)
const error = ref(null)
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

const subtotal = computed(() => {
  if (!currentOrder.value?.items) return 0
  return currentOrder.value.items.reduce((sum, item) => sum + (item.price * item.quantity || 0), 0)
})

onMounted(async () => {
  console.log('Props:', { customer: props.customer, token: props.token })
  console.log('URL params:', window.location.search)

  // إذا كان هناك payment_token في URL (PayPal)
  const urlParams = new URLSearchParams(window.location.search)
  const paymentToken = urlParams.get('payment_token')
  const paypalOrderId = urlParams.get('token') // PayPal يرسل token

  if (paymentToken && paypalOrderId) {
    try {
      console.log('Processing PayPal payment...', { paymentToken, paypalOrderId })

      // استدعاء paypalSuccess API
      const response = await ordersStore.processPaypalPayment(paymentToken, paypalOrderId)
      if (response && response.data) {
        currentOrder.value = response.data
        console.log('PayPal order processed:', response.data)
      } else {
        error.value = t('paymentSuccess.paymentFailed')
      }
    } catch (e) {
      console.error('Error processing PayPal payment:', e)
      error.value = t('paymentSuccess.paymentFailed')
    } finally {
      loading.value = false
    }
  }
  // إذا كان هناك customer و token props (من redirect قديم)
  else if (props.customer && props.token) {
    try {
      console.log('Fetching all orders and looking for PayPal order...')
      await ordersStore.fetchOrders()
      const orders = ordersStore.orders

      if (orders && orders.length > 0) {
        console.log('All orders:', orders)
        console.log('Looking for token:', props.token)

        const paypalOrder = orders.find(order => {
          console.log(`Order ${order.id}: token=${order.payment_token}, status=${order.status}`)
          return order.payment_token === props.token && order.status === 'paid'
        })

        if (paypalOrder) {
          currentOrder.value = paypalOrder
          console.log('PayPal order found:', paypalOrder)
        } else {
          const paypalOrderAnyStatus = orders.find(order => order.payment_token === props.token)
          console.log('PayPal order with any status:', paypalOrderAnyStatus)

          if (paypalOrderAnyStatus) {
            currentOrder.value = paypalOrderAnyStatus
            console.log('Using PayPal order with status:', paypalOrderAnyStatus.status)
          } else {
            console.log('PayPal order not found in orders list')
            error.value = t('paymentSuccess.noOrderDetails')
          }
        }
      } else {
        error.value = t('paymentSuccess.noOrderDetails')
      }
    } catch (e) {
      console.error('Error fetching orders:', e)
      error.value = t('paymentSuccess.noOrderDetails')
    } finally {
      loading.value = false
    }
  }
  // إذا لم يكن هناك customer و token (COD أو Stripe)، جلب آخر طلب
  else {
    try {
      console.log('Fetching latest order...')
      await ordersStore.fetchOrders()
      const orders = ordersStore.orders
      if (orders && orders.length > 0) {
        const latestOrder = orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0]
        if (latestOrder) {
          currentOrder.value = latestOrder
          console.log('Latest order loaded:', latestOrder)
        } else {
          error.value = t('paymentSuccess.noOrderDetails')
        }
      } else {
        error.value = t('paymentSuccess.noOrderDetails')
      }
    } catch (e) {
      console.error('Error fetching orders:', e)
      error.value = t('paymentSuccess.noOrderDetails')
    } finally {
      loading.value = false
    }
  }
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-BonaRegular">
    <div v-if="loading" class="flex justify-center items-center h-64">
      <LoaderWithText :message="t('loading.order')" />
    </div>

    <div
      v-else-if="currentOrder"
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
            v-for="item in currentOrder.items"
            :key="item.id"
            class="flex items-center justify-between"
          >
            <div class="flex items-center">
              <img
                :src="`${apiBaseUrl}${item.book.cover}`"
                :alt="item.book.title"
                class="w-16 h-16 rounded-lg mr-4 object-cover"
              />
              <div>
                <p class="font-medium text-gray-800">{{ item.book.title }}</p>
                <p class="text-sm text-gray-500">
                  {{ t('paymentSuccess.quantity') }}{{ item.quantity }}
                </p>
              </div>
            </div>
            <p class="font-semibold text-gray-800">
              ${{ (item.price * item.quantity).toFixed(2) }}
            </p>
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
          <span>${{ parseFloat(currentOrder.shipping || 0).toFixed(2) }}</span>
        </div>
        <div class="flex justify-between text-sm">
          <span>{{ t('paymentSuccess.vat') }}</span>
          <span>${{ parseFloat(currentOrder.vat || 0).toFixed(2) }}</span>
        </div>
        <div class="flex justify-between text-lg font-bold text-gray-900 border-t pt-2 mt-2">
          <span>{{ t('paymentSuccess.total') }}</span>
          <span class="text-green-600"
            >${{ parseFloat(currentOrder.total_price || subtotal).toFixed(2) }}</span
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
      <h1 class="text-2xl font-bold text-gray-700">
        {{ error || t('paymentSuccess.noOrderDetails') }}
      </h1>
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
  0%,
  100% {
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
