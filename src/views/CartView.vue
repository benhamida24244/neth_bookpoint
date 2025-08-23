<script setup>
import { onMounted } from 'vue';
import TallBanner from '@/components/Banner/TallBanner.vue';
import Cover from '@/assets/Img/Cover.png';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/stores/Cart';
import { storeToRefs } from 'pinia';

const router = useRouter();
const cartStore = useCartStore();
const { cartItems, cartTotal, loading, error } = storeToRefs(cartStore);

const banner = {
  id: 1,
  img: Cover,
  url: '/',
};

onMounted(() => {
  cartStore.fetchCart();
});

const handleCheckout = () => {
  router.push('/checkout');
};

const handleUpdateQuantity = (itemId, event) => {
  const quantity = parseInt(event.target.value, 10);
  if (!isNaN(quantity) && quantity > 0) {
    cartStore.updateQuantity(itemId, quantity);
  }
};

const handleRemoveItem = (itemId) => {
  cartStore.removeFromCart(itemId);
};
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
          Your Cart Details
        </h1>

        <div v-if="loading" class="text-center">Loading cart...</div>
        <div v-if="error" class="text-center text-red-500">{{ error }}</div>

        <!-- Cart Items -->
        <div v-if="cartItems.length > 0">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="item in cartItems"
              :key="item.id"
              class="flex flex-col justify-between items-center border p-4 rounded-lg shadow hover:shadow-lg transition-shadow duration-300"
            >
              <img :src="item.book.cover_image_url" alt="Book Cover" class="w-24 h-32 object-cover rounded" />
              <div class="text-center mt-4">
                <h2 class="text-lg font-semibold">{{ item.book.title }}</h2>
                <p class="text-sm text-gray-500">by {{ item.book.author.name }}</p>
                <p class="text-green-600 font-medium mt-2">
                  $ {{ (item.price || 0).toFixed(2) }}
                </p>
                <div class="flex items-center gap-3 mt-4">
                  <label class="text-sm text-gray-700">Quantity:</label>
                  <input
                    type="number"
                    min="1"
                    :value="item.quantity"
                    @input="handleUpdateQuantity(item.id, $event)"
                    class="w-16 p-2 border rounded text-center"
                  />
                </div>
                <button @click="handleRemoveItem(item.id)" class="mt-2 text-red-500 hover:underline">Remove</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty Cart -->
        <p v-else-if="!loading" class="text-gray-500 text-center mt-8">Your cart is currently empty.</p>

        <!-- Total + Button -->
        <div class="w-full mt-10" v-if="cartItems.length > 0">
          <p class="text-center text-2xl font-BonaRegular">
            Total Price: <span class="font-bold text-[var(--color-hover)]">$ {{ cartTotal.toFixed(2) }}</span>
          </p>
          <button
            class="mt-4 w-full py-3 bg-[var(--color-primary)] text-white font-semibold rounded-lg hover:bg-[var(--color-hover)] transition-colors duration-300"
            @click="handleCheckout"
            :disabled="loading"
          >
            {{ loading ? 'Processing...' : 'Proceed to Checkout' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
