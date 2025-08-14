<script setup>
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/Users'
import { useCartStore } from '@/stores/Cart'
import { useOrdersStore } from '@/stores/Orders'
import { computed } from 'vue'

// Pinia stores
const userStore = useUserStore()
const cartStore = useCartStore()
const ordersStore = useOrdersStore()

// Reactive state
const { user: currentUser } = storeToRefs(userStore)
const { cart } = storeToRefs(cartStore)
const { orders } = storeToRefs(ordersStore)

const userOrders = computed(() =>
  orders.value.filter(order => order.customer.email === currentUser.value.email)
)

// حساب إجمالي السعر
const totalPrice = computed(() =>
  cart.value.reduce((total, item) => total + item.price * item.quantity, 0)
)
</script>

<template>
  <div class="container mx-auto p-4 font-BonaRegular">

    <!-- User Profile -->
    <div class="bg-white shadow-lg rounded-xl p-6 mb-6">
      <h1 class="text-2xl font-bold mb-4 text-gray-800">My Profile</h1>
      <div class="flex items-center gap-6">
        <img
          :src="currentUser.avatar || 'https://randomuser.me/api/portraits/men/75.jpg'"
          alt="User Avatar"
          class="w-24 h-24 rounded-full shadow-md border"
        />
        <div class="space-y-1">
          <p><strong>Name:</strong> {{ currentUser.name }}</p>
          <p><strong>Email:</strong> {{ currentUser.email }}</p>
          <p><strong>Address:</strong> {{ currentUser.address }}</p>
        </div>
      </div>
    </div>

    <!-- Shopping Cart -->
    <div class="bg-white shadow-lg rounded-xl p-6 mb-6">
      <h2 class="text-xl font-bold mb-4 text-gray-800">Shopping Cart</h2>
      <div v-if="cart.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="item in cart" :key="item.id" class="border rounded-lg p-4 bg-gray-50 shadow-sm">
          <img :src="item.image" :alt="item.name" class="w-full h-40 object-cover rounded-md mb-3" />
          <p class="font-semibold">{{ item.name }}</p>
          <p class="text-sm text-gray-600">Quantity: {{ item.quantity }}</p>
          <p class="text-sm text-gray-600">Price: ${{ item.price }}</p>
          <p class="text-sm text-gray-800 font-bold mt-2">
            Total: ${{ (item.price * item.quantity).toFixed(2) }}
          </p>
        </div>
      </div>
      <div v-else class="text-gray-500">
        Your shopping cart is empty.
      </div>
      <div v-if="cart.length > 0" class="mt-4 text-right">
        <span class="text-lg font-bold">Total Price: ${{ totalPrice.toFixed(2) }}</span>
      </div>
    </div>

    <!-- Order History -->
    <div class="bg-white shadow-lg rounded-xl p-6">
      <h2 class="text-xl font-bold mb-4 text-gray-800">Order History</h2>
      <div v-if="userOrders.length > 0" class="space-y-6">
        <div v-for="order in userOrders" :key="order.id" class="border rounded-lg p-4 bg-gray-50 shadow-sm">
          <div class="flex justify-between items-center mb-4">
            <div>
              <p class="font-semibold">Order #{{ order.id }}</p>
              <p class="text-sm text-gray-600">Date: {{ order.date }}</p>
            </div>
            <span class="text-green-700 text-sm font-semibold px-2 py-1 bg-green-100 rounded-full">{{ order.status }}</span>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="item in order.items" :key="item.id" class="border rounded-lg p-3 bg-white">
              <img :src="item.image" :alt="item.name" class="w-full h-32 object-cover rounded-md mb-3" />
              <p class="font-semibold text-sm">{{ item.name }}</p>
              <p class="text-xs text-gray-600">Quantity: {{ item.quantity }}</p>
              <p class="text-xs text-gray-600">Price: ${{ item.price }}</p>
            </div>
          </div>
           <div class="mt-4 text-right">
            <span class="text-lg font-bold">Total: ${{ order.totals.total.toFixed(2) }}</span>
          </div>
        </div>
      </div>
      <div v-else class="text-gray-500">
        You have no past orders.
      </div>
    </div>
  </div>
</template>
