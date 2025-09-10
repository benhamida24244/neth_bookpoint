<script setup>
import { computed, ref, onMounted, watch } from 'vue'
import TallBanner from '@/components/Banner/TallBanner.vue'
import Cover from '@/assets/Img/Cover.png'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/Cart'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useUIStore } from '@/stores/ui' // 1. استيراد UI store
import { useCustomerAuthStore } from '@/stores/customerAuth'

const { t } = useI18n()
const isLoading = ref(false)
const checkout = ref(false)
const router = useRouter()

const banner = {
  id: 1,
  img: Cover,
  url: '/',
}

const CartStore = useCartStore()
const { cart, cartItems, loading } = storeToRefs(CartStore)
const customerAuthStore = useCustomerAuthStore()
const uiStore = useUIStore() // 2. تهيئة UI store

// جلب بيانات السلة عند تحميل المكون
onMounted(async () => {
  // لا تستدعي fetchCart إلا إذا كان المستخدم مسجلاً دخوله
  if (customerAuthStore.isAuthenticated) {
    console.log('User is authenticated, fetching cart data...')
    try {
      await CartStore.fetchCart()
      console.log('Cart data fetched:', cartItems.value)
      console.log('Cart raw data:', cart.value)
    } catch (error) {
      console.error('Error fetching cart:', error)
    }
  }
  // بالنسبة للضيوف، يتم التعامل مع السلة محليًا داخل CartStore
})

// مراقبة أي تغييرات في بيانات السلة
watch(
  () => cartItems.value,
  (newVal) => {
    console.log('Cart items updated:', newVal)
  },
  { deep: true }
)

// مراقبة أي تغييرات في بيانات السلة الخام
watch(
  () => cart.value,
  (newVal) => {
    console.log('Cart raw data updated:', newVal)
  },
  { deep: true }
)

// Total price computation
const totalPrice = computed(() => {
  if (!cartItems.value || cartItems.value.length === 0) return '0.00'
  return cartItems.value
    .reduce((sum, item) => sum + parseFloat(item.price || 0) * (item.quantity || 1), 0)
    .toFixed(2)
})

// Checkout button handler
const handleCheckout = () => {
  // 3. التحقق من حالة تسجيل الدخول
  if (customerAuthStore.isAuthenticated) {
    // إذا كان المستخدم مسجلاً، انتقل إلى صفحة الدفع
    if (isLoading.value) return
    isLoading.value = true
    setTimeout(() => {
      checkout.value = true
      isLoading.value = false
      router.push('/checkout')
    }, 1500)
  } else {
    // إذا لم يكن المستخدم مسجلاً، افتح نافذة تسجيل الدخول
    uiStore.openLoginModal()
  }
}

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
// Optional: If you don’t already have this in the store, you can add it
</script>

<template>
  <div class="w-full p-12 bg-gray-50 min-h-screen">
    <div class="flex gap-8 flex-col lg:flex-row">
      <!-- Banner Section -->
      <div class="lg:w-1/3 w-full">
        <TallBanner :banner="banner" />
      </div>

      <!-- Cart Section -->
      <div class="lg:w-2/3 w-full bg-white rounded-lg shadow p-6">
        <h1 class="text-3xl font-bold mb-6 font-BonaRegular text-[var(--color-hover)] text-center">
          {{ t('cartView.title') }}
        </h1>

        <!-- مؤشر التحميل -->
        <div v-if="loading" class="flex justify-center items-center h-64">
          <svg class="animate-spin h-10 w-10 text-[var(--color-primary)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>

        <!-- Cart Items -->
        <div v-else-if="cartItems && cartItems.length > 0">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="item in cartItems"
              :key="item.id"
              class="flex flex-col justify-between items-center border p-4 rounded-lg shadow hover:shadow-lg transition-shadow duration-300 relative"
            >
              <div
                class="absolute flex items-center justify-center bg-red-500 hover:bg-red-600 rounded-full w-6 h-6 top-2 right-2 z-20 transition-colors duration-200 cursor-pointer shadow-md hover:shadow-lg transform hover:scale-105"
                @click="CartStore.removeFromCart(item.id)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <img
                :src="
                  item.book
                    ? `${apiBaseUrl}${item.book.cover}`
                    : `${apiBaseUrl}${item.cover}`
                "
                alt="Book Cover"
                class="w-24 h-32 object-cover rounded"
              />
              <div class="text-center mt-4">
                <h2 class="text-lg font-semibold">
                  {{ item.book ? item.book.title : (item.title || t('cartView.unknownBook')) }}
                </h2>
                <p class="text-sm text-gray-500">
                  {{
                    item.book
                      ? (item.book.author ? item.book.author.name : '') + (item.book.description ? ' - ' + item.book.description.substring(0, 50) + '...' : '')
                      : (item.author || t('cartView.noDescription'))
                  }}
                </p>
                <p class="text-green-600 font-medium mt-2">
                  $ {{ parseFloat(item.price || 0).toFixed(2) }}
                </p>
                <div class="flex gap-3">
                  <label class="block mt-4 text-sm text-gray-700">{{
                    t('cartView.quantity')
                  }}</label>
                  <input
                    type="number"
                    min="1"
                    :value="item.quantity || 1"
                    @input="CartStore.updateQuantity(item.id, +$event.target.value)"
                    class="w-16 p-2 border rounded mt-1 text-center"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty Cart -->
        <p v-else class="text-gray-500 text-center mt-8">{{ t('cartView.emptyCart') }}</p>

        <!-- Total + Button -->
        <div class="w-full mt-10">
          <p class="text-center text-2xl font-BonaRegular">
            {{ t('cartView.totalPrice') }}
            <span class="font-bold text-[var(--color-hover)]">$ {{ totalPrice }}</span>
          </p>
          <button
            class="mt-4 w-full py-3 bg-[var(--color-primary)] text-white font-semibold rounded-lg hover:bg-[var(--color-hover)] transition-colors duration-300 flex items-center justify-center gap-2"
            @click="handleCheckout"
            :disabled="isLoading"
          >
            <svg
              v-if="isLoading"
              class="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            <span>{{ isLoading ? t('cartView.processing') : t('cartView.checkout') }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
