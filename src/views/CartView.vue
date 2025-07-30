<script setup>
import { computed, ref } from 'vue'
import TallBanner from '@/components/Banner/TallBanner.vue'
import Cover from '@/assets/Img/Cover.png'
import { useRouter } from 'vue-router'

const isLoading = ref(false)
const checkout = ref(false)
const router = useRouter()

const banner = {
  id: 1,
  img: Cover,
  url: '/',
}

const cartItems = [
  {
    id: 101,
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    price: 12.99,
    quantity: 1,
    img: 'https://covers.openlibrary.org/b/id/7222246-L.jpg',
  },
  {
    id: 102,
    title: '1984',
    author: 'George Orwell',
    price: 9.99,
    quantity: 1,
    img: 'https://covers.openlibrary.org/b/id/153541-L.jpg',
  },
]

// حساب السعر الإجمالي تلقائيًا
const totalPrice = computed(() =>
  cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)
)

// الزر: عند النقر، تفعيل isLoading ثم التنقل
const handleCheckout = () => {
  if (isLoading.value) return

  isLoading.value = true
  setTimeout(() => {
    checkout.value = true
    isLoading.value = false
    router.push('/checkout') // افترض وجود صفحة checkout
  }, 1500) // 1.5 ثانية محاكاة للتحميل
}
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
        <h1 class="text-3xl font-bold mb-6 font-BonaRegular text-yellow-800 text-center">
          Your Cart Details
        </h1>

        <!-- Cart Items -->
        <div v-if="cartItems.length > 0">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="item in cartItems"
              :key="item.id"
              class="flex flex-col items-center border p-4 rounded-lg shadow hover:shadow-lg transition-shadow duration-300"
            >
              <img :src="item.img" alt="Book Cover" class="w-24 h-32 object-cover rounded" />
              <div class="text-center mt-4">
                <h2 class="text-lg font-semibold">{{ item.title }}</h2>
                <p class="text-sm text-gray-500">by {{ item.author }}</p>
                <p class="text-green-600 font-medium mt-2">$ {{ item.price.toFixed(2) }}</p>

                <label class="block mt-4 text-sm text-gray-700">Quantity:</label>
                <input
                  type="number"
                  min="1"
                  v-model.number="item.quantity"
                  class="w-16 p-2 border rounded mt-1 text-center"
                />
              </div>
            </div>
          </div>
        </div>
        <!-- Empty Cart -->
        <p v-else class="text-gray-500 text-center mt-8">Your cart is currently empty.</p>

        <!-- Total + Button -->
        <div class="w-full mt-10">
          <p class="text-center text-2xl font-BonaRegular">
            Total Price: <span class="font-bold text-yellow-600">$ {{ totalPrice }}</span>
          </p>
          <button
  class="mt-4 w-full py-3 bg-yellow-600 text-white font-semibold rounded-lg hover:bg-yellow-500 transition-colors duration-300 flex items-center justify-center gap-2"
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
  <span>{{ isLoading ? 'Processing...' : 'Proceed to Checkout' }}</span>
</button>

        </div>
      </div>
    </div>
  </div>
</template>
