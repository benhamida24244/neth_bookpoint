<script setup>
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/Users'
import { useCartStore } from '@/stores/Cart'

// Pinia stores for user and cart data
const userStore = useUserStore()
const cartStore = useCartStore()

// Reactive state from stores
const { currentUser } = storeToRefs(userStore)
const { cart } = storeToRefs(cartStore)
</script>

<template>
  <div class="container mx-auto p-4">
    <div class="bg-white shadow-md rounded-lg p-6">
      <h1 class="text-2xl font-bold mb-4">User Profile</h1>
      <div class="flex items-center space-x-4">
        <img
          src="https://randomuser.me/api/portraits/men/75.jpg"
          alt="User Avatar"
          class="w-20 h-20 rounded-full"
        />
        <div>
          <p><strong>Name:</strong> {{ currentUser.name }}</p>
          <p><strong>Email:</strong> {{ currentUser.email }}</p>
          <p><strong>Address:</strong> {{ currentUser.address }}</p>
        </div>
      </div>
    </div>

    <div class="bg-white shadow-md rounded-lg p-6 mt-6">
      <h2 class="text-xl font-bold mb-4">Shopping Cart</h2>
      <div v-if="cart.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="item in cart" :key="item.id" class="border rounded-lg p-4">
          <p><strong>{{ item.name }}</strong></p>
          <p>Quantity: {{ item.quantity }}</p>
          <p>Price: ${{ item.price }}</p>
        </div>
      </div>
      <div v-else>
        <p>Your shopping cart is empty.</p>
      </div>
    </div>
  </div>
</template>
