<script setup>
import { InfoIcon, CreditCard, Truck, Package } from 'lucide-vue-next';
import { ref, computed, onMounted } from 'vue';
import { useCartStore } from '@/stores/Cart';
import { useCheckoutStore } from '@/stores/Checkout';
import { useUserStore } from '@/stores/Users';
import { storeToRefs } from 'pinia';

const icons = {
  Truck,
  Package,
};

const isLoading = ref(false);
const selectedShipping = ref('delivery'); // 'delivery' or 'pickup'
const selectedPayment = ref('electronic'); // 'electronic', 'tabby', or 'cod'

const cartStore = useCartStore();
const { cart: orderItems } = storeToRefs(cartStore);

const checkoutStore = useCheckoutStore();
const { shippingOptions, paymentOptions } = storeToRefs(checkoutStore);

const userStore = useUserStore();
const { user } = storeToRefs(userStore);

onMounted(() => {
  checkoutStore.fetchCheckoutData();
});

// Form data structure
const formData = ref({
  receiverName: user.value.name,
  email: user.value.email,
  phone: '',
  address: user.value.address,
  city: '',
  postalCode: ''
});

// Form field configuration
const formFields = [
  { key: 'receiverName', placeholder: 'Receiver Name', type: 'text', required: true },
  { key: 'email', placeholder: 'Email Address', type: 'email', required: true },
  { key: 'phone', placeholder: 'Phone Number', type: 'tel', required: true },
  { key: 'address', placeholder: 'Street Address', type: 'text', required: selectedShipping.value === 'delivery' },
  { key: 'city', placeholder: 'City', type: 'text', required: true },
  { key: 'postalCode', placeholder: 'Postal Code', type: 'text', required: false }
];

// Computed values
const subtotal = computed(() =>
  orderItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
);

const shippingCost = computed(() => {
  const option = shippingOptions.value.find(opt => opt.id === selectedShipping.value);
  return option ? option.price : 0;
});

const vatAmount = computed(() => {
  const total = subtotal.value + shippingCost.value;
  return total * 0.15; // 15% VAT
});

const grandTotal = computed(() =>
  subtotal.value + shippingCost.value + vatAmount.value
);

const freeShippingThreshold = 299.00;
const amountNeededForFreeShipping = computed(() =>
  Math.max(0, freeShippingThreshold - subtotal.value)
);

const handleSubmit = () => {
  if (isLoading.value) return;

  isLoading.value = true;

  const orderData = {
    items: orderItems.value,
    shipping: selectedShipping.value,
    payment: selectedPayment.value,
    customer: formData.value,
    totals: {
      subtotal: subtotal.value,
      shipping: shippingCost.value,
      vat: vatAmount.value,
      total: grandTotal.value
    }
  };

  console.log('Order submitted:', orderData);

  // Simulate API call
  setTimeout(() => {
    isLoading.value = false;
    alert('Order submitted successfully!');
  }, 2000);
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

            <!-- Order Items -->
            <div class="space-y-4 mb-6">
              <div
                v-for="item in orderItems"
                :key="item.name"
                class="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
              >
                <div class="flex-1">
                  <p class="font-medium text-gray-800 text-sm">{{ item.name }}</p>
                  <p class="text-gray-600 text-xs">Quantity: {{ item.quantity }}</p>
                </div>
                <span class="font-bold text-[var(--color-primary)]">${{ item.price.toFixed(2) }}</span>
              </div>
            </div>

            <!-- Totals -->
            <div class="border-t pt-4 space-y-2">
              <div class="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${{ subtotal.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>${{ shippingCost.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-gray-600 text-sm">
                <span>VAT (15%)</span>
                <span>${{ vatAmount.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-lg font-bold text-gray-800 border-t pt-2">
                <span>Total</span>
                <span class="text-[var(--color-primary)]">${{ grandTotal.toFixed(2) }}</span>
              </div>
            </div>

            <!-- Free Shipping Notice -->
            <div v-if="amountNeededForFreeShipping > 0" class="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p class="text-[var(--color-hover)] text-sm text-center">
                Add ${{ amountNeededForFreeShipping.toFixed(2) }} to get free shipping!
              </p>
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

              <!-- Shipping Options -->
              <div class="mb-8">
                <h3 class="text-[var(--color-primary)] text-xl font-bold mb-4 flex items-center">
                  <Truck class="w-5 h-5 mr-2" />
                  Shipping Options
                </h3>
                <div class="space-y-3">
                  <div
                    v-for="option in shippingOptions"
                    :key="option.id"
                    class="relative"
                  >
                    <input
                      :id="option.id"
                      v-model="selectedShipping"
                      :value="option.id"
                      type="radio"
                      name="shipping"
                      class="sr-only"
                    />
                    <label
                      :for="option.id"
                      class="flex items-center justify-between p-4 bg-gray-800 rounded-xl cursor-pointer transition-all duration-200 hover:bg-gray-700"
                      :class="{ 'ring-2 ring-[var(--color-primary)] bg-gray-700': selectedShipping === option.id }"
                    >
                      <div class="flex items-center">
                        <component :is="icons[option.icon]" class="w-5 h-5 text-[var(--color-primary)] mr-3" />
                        <span class="text-white font-medium">{{ option.name }}</span>
                      </div>
                      <span class="text-[var(--color-primary)] font-bold">${{ option.price.toFixed(2) }}</span>
                    </label>
                  </div>
                </div>
              </div>

              <!-- Payment Options -->
              <div class="mb-8">
                <h3 class="text-[var(--color-primary)] text-xl font-bold mb-4 flex items-center">
                  <CreditCard class="w-5 h-5 mr-2" />
                  Payment Methods
                </h3>
                <div class="space-y-3">
                  <div
                    v-for="option in paymentOptions"
                    :key="option.id"
                    class="relative"
                  >
                    <input
                      :id="option.id"
                      v-model="selectedPayment"
                      :value="option.id"
                      type="radio"
                      name="payment"
                      class="sr-only"
                    />
                    <label
                      :for="option.id"
                      class="block p-4 bg-gray-800 rounded-xl cursor-pointer transition-all duration-200 hover:bg-gray-700"
                      :class="{ 'ring-2 ring-[var(--color-primary)] bg-gray-700': selectedPayment === option.id }"
                    >
                      <div class="flex items-center justify-between">
                        <div>
                          <div class="text-white font-medium">{{ option.name }}</div>
                          <div class="text-gray-400 text-sm mt-1">{{ option.subtitle }}</div>
                        </div>
                        <div class="w-4 h-4 rounded-full border-2 border-[var(--color-primary)] flex items-center justify-center">
                          <div v-if="selectedPayment === option.id" class="w-2 h-2 bg-[var(--color-primary)] rounded-full"></div>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  type="submit"
                  :disabled="isLoading"
                  class="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-light)] hover:from-[var(--color-primary)] hover:to-[var(--color-primary)] text-black font-bold py-4 px-8 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <span v-if="!isLoading">Place Order</span>
                  <span v-else class="flex items-center">
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                </button>
                <RouterLink
                  to="/cart"
                  class="bg-transparent hover:bg-[var(--color-primary)] hover:text-black text-white border-2 border-[var(--color-primary)] font-bold py-4 px-8 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-300 text-center"
                >
                  Back to Cart
                </RouterLink>
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

/* Custom scrollbar for better aesthetics */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #fbbf24;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #f59e0b;
}

/* RTL support for Arabic text */
[dir="rtl"] {
  text-align: right;
}

/* Loading animation */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
