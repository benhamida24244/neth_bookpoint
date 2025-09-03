<script setup>
import { InfoIcon } from 'lucide-vue-next';
import { ref, computed, onMounted } from 'vue';
import { useCartStore } from '@/stores/Cart';
import { useCheckoutStore } from '@/stores/Checkout';
import { useCustomerAuthStore } from '@/stores/customerAuth';
import { useOrdersStore } from '@/stores/Orders';
import { useAuthStore } from '@/stores/Auth';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';

const cartStore = useCartStore();
const { cartItems, cartTotal, loading: cartLoading } = storeToRefs(cartStore);
const { cart: orderItems } = storeToRefs(cartStore);

const checkoutStore = useCheckoutStore();
const { shippingOptions, paymentOptions } = storeToRefs(checkoutStore);

const userStore = useCustomerAuthStore();
const { user } = storeToRefs(userStore);

const ordersStore = useOrdersStore();
const { loading: orderLoading, error: orderError } = storeToRefs(ordersStore);

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const router = useRouter();

const selectedShipping = ref('delivery');

const formData = ref({
  receiverName: user.value?.name || '',
  email: user.value?.email || '',
  phone: '',
  address: '',
  city: '',
  postalCode: ''
});

const formFields = computed(() => [
    { key: 'receiverName', placeholder: 'Receiver Name', type: 'text', required: true },
    { key: 'email', placeholder: 'Email', type: 'email', required: true },
    { key: 'phone', placeholder: 'Phone', type: 'tel', required: true },
    { key: 'address', placeholder: 'Address', type: 'text', required: selectedShipping.value === 'delivery' },
    { key: 'city', placeholder: 'City', type: 'text', required: true },
    { key: 'postalCode', placeholder: 'Postal Code', type: 'text', required: false }
]);

const shippingCost = ref(10); // Example shipping cost
const vatRate = 0.15; // 15% VAT

const grandTotal = computed(() => cartTotal.value + shippingCost.value + (cartTotal.value * vatRate));

onMounted(() => {
  if (cartItems.value.length === 0) {
    cartStore.fetchCart();
  }
});

const handleSubmit = async () => {
  try {
    const newOrder = await ordersStore.createOrder();
    router.push({ name: 'payment-success', params: { orderId: newOrder.id } });
  } catch {
    // Error is handled in the store and displayed via the `orderError` ref
  }
};
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8 font-BonaRegular">
    <div class="max-w-7xl mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <!-- Order Summary Sidebar -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-2xl shadow-xl p-6 sticky top-8">
            <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">Order Summary</h2>

            <div v-if="cartLoading" class="text-center">Loading cart...</div>

            <!-- Order Items -->
            <div class="space-y-4 mb-6">
              <div
                v-for="item in cartItems"
                :key="item.id"
                class="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
              >
                <div class="flex-1">
                  <p class="font-medium text-gray-800 text-sm">{{ item.book.title }}</p>
                  <p class="text-gray-600 text-xs">Quantity: {{ item.quantity }}</p>
                </div>
                <span class="font-bold text-[var(--color-primary)]">${{ item.price.toFixed(2) }}</span>
              </div>
            </div>

            <!-- Totals -->
            <div class="border-t pt-4 space-y-2">
              <div class="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${{ cartTotal.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>${{ shippingCost.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-gray-600 text-sm">
                <span>VAT (15%)</span>
                <span>${{ (cartTotal * vatRate).toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-lg font-bold text-gray-800 border-t pt-2">
                <span>Total</span>
                <span class="text-[var(--color-primary)]">${{ grandTotal.toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Checkout Form -->
        <div class="lg:col-span-2">
          <div class="bg-black rounded-2xl shadow-2xl overflow-hidden">
            <div class="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-light)] p-6">
              <h1 class="text-black text-3xl font-bold text-center">
                Payment & Shipping Details
              </h1>
            </div>

            <form @submit.prevent="handleSubmit" class="p-8">

              <!-- Customer Information -->
              <div class="mb-8">
                <h3 class="text-[var(--color-primary)] text-xl font-bold mb-4 flex items-center">
                  <InfoIcon class="w-5 h-5 mr-2" />
                  Customer Information
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    v-for="field in formFields"
                    :key="field.key"
                    class="relative"
                  >
                    <label
                      :for="field.key"
                      class="block text-[var(--color-primary)] text-sm font-medium mb-2"
                    >
                      {{ field.placeholder }}
                      <span v-if="field.required" class="text-red-400">*</span>
                    </label>
                    <input
                      :id="field.key"
                      :type="field.type"
                      :name="field.key"
                      :placeholder="field.placeholder"
                      v-model="formData[field.key]"
                      :required="field.required"
                      class="w-full bg-gray-800 text-white rounded-xl p-3 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all duration-200 placeholder-gray-400"
                    />
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  type="submit"
                  :disabled="orderLoading"
                  class="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-light)] hover:from-[var(--color-primary)] hover:to-[var(--color-primary)] text-black font-bold py-4 px-8 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <span v-if="!orderLoading">Place Order</span>
                  <span v-else class="flex items-center">
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing
                  </span>
                </button>
                 <RouterLink
                  to="/cart"
                  class="bg-transparent hover:bg-[var(--color-primary)] hover:text-black text-white border-2 border-[var(--color-primary)] font-bold py-4 px-8 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-300 text-center"
                >
                 Back To Cart
                </RouterLink>
              </div>
               <div v-if="orderError" class="text-red-500 text-sm mt-4 text-center">
                {{ orderError }}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.font-bona {
  font-family: 'Bona Regular', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
/* ... other styles ... */
</style>
