<script setup>
import { RouterView } from 'vue-router'
import { useSettingsStore } from './stores/settings'
import { onMounted } from 'vue'
import { useCustomerAuthStore } from '@/stores/customerAuth'
import { useCartStore } from '@/stores/Cart'

const settingsStore = useSettingsStore()
const authStore = useCustomerAuthStore()
const cartStore = useCartStore()

// This ensures that when the app is loaded, the primary color from the
// store (and localStorage) is applied as a CSS variable to the document.
onMounted(async () => {
  // Attempt to log in the user automatically if a token exists
  await authStore.tryAutoLogin();
  
  // Initialize local cart for guest users
  cartStore.initializeLocalCart();
  
  // Fetch cart data if user is authenticated
  if (authStore.isAuthenticated) {
    await cartStore.fetchCart();
  }

  await settingsStore.fetchSettings();
})
</script>
<template>
  <RouterView />
</template>
