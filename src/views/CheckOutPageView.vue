<script setup>
import { InfoIcon, CreditCard, Truck, Package } from 'lucide-vue-next';
import { ref, computed, onMounted, nextTick } from 'vue';
import { useCartStore } from '@/stores/Cart';
import { useCheckoutStore } from '@/stores/Checkout';
import { useCustomerAuthStore } from '@/stores/customerAuth';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { loadStripe } from '@stripe/stripe-js';

const { t } = useI18n();
const icons = {
  Truck,
  Package,
};

const isLoading = ref(false);
const selectedShipping = ref('delivery');
const selectedPayment = ref('cod'); // Default to 'cod'

const cartStore = useCartStore();
const { cart: orderItems, cartTotal } = storeToRefs(cartStore);

const checkoutStore = useCheckoutStore();
const { shippingOptions, paymentOptions, client_secret, error: checkoutError } = storeToRefs(checkoutStore);

const userStore = useCustomerAuthStore();
const { user } = storeToRefs(userStore);

const router = useRouter();

// Stripe specific refs
const stripe = ref(null);
const cardElement = ref(null);
const stripeError = ref(null);

const normalizedOrderItems = computed(() => {
  if (user.value) {
    if (orderItems.value && Array.isArray(orderItems.value.items)) {
      return orderItems.value.items;
    }
  } else {
    return cartStore.localCart;
  }
  return [];
});

onMounted(async () => {
  await checkoutStore.fetchCheckoutData();
  if (userStore.isAuthenticated) {
    await cartStore.fetchCart();
  }

  // Initialize Stripe
  const stripeKey = import.meta.env.VITE_STRIPE_KEY;
  if (!stripeKey) {
    console.error('Stripe public key is not set in .env file');
    return;
  }

  stripe.value = await loadStripe(stripeKey);
  const elements = stripe.value.elements();
  cardElement.value = elements.create('card', {
    style: {
      base: {
        color: '#fff',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4'
        }
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
      }
    }
  });

  // Wait for the next tick to ensure the element is in the DOM
  await nextTick();
  if(document.getElementById('card-element')) {
    cardElement.value.mount('#card-element');
  }
});

const formData = ref({
  receiverName: user.value?.name || '',
  email: user.value?.email || '',
  phone: user.value?.phone_number || '',
  address: user.value?.address || '',
  city: '',
  country: user.value?.country || '',
  postalCode: ''
});

const formFields = computed(() =>
  [
    { key: 'receiverName', placeholder: t('receiverName'), type: 'text', required: true },
    { key: 'email', placeholder: t('email'), type: 'email', required: true },
    { key: 'phone', placeholder: t('phone'), type: 'tel', required: true },
    { key: 'address', placeholder: t('address'), type: 'text', required: selectedShipping.value === 'delivery' },
    { key: 'city', placeholder: t('city'), type: 'text', required: true },
    { key: 'postalCode', placeholder: t('postalCode'), type: 'text', required: false }
  ]
);

const subtotal = computed(() => cartTotal.value);

const shippingCost = computed(() => {
  const option = shippingOptions.value.find(opt => opt.id === selectedShipping.value);
  return option ? Number(option.price || 0) : 0;
});

const vatAmount = computed(() => (subtotal.value + shippingCost.value) * 0.15);

const grandTotal = computed(() => subtotal.value + shippingCost.value + vatAmount.value);

const freeShippingThreshold = 299.00;
const amountNeededForFreeShipping = computed(() => Math.max(0, freeShippingThreshold - subtotal.value));

const handleSubmit = async () => {
  if (isLoading.value) return;
  isLoading.value = true;
  stripeError.value = null;

  try {
    if (selectedPayment.value === 'stripe') {
      await handleStripePayment();
    } else if (selectedPayment.value === 'cod') {
      await handleCodPayment();
    } else if (selectedPayment.value === 'paypal') {
      await handlePaypalPayment();
    } else {
      throw new Error('Invalid payment method selected');
    }
  } catch (error) {
    console.error('Failed to process order:', error);
    stripeError.value = error.message || 'An unexpected error occurred.';
  } finally {
    isLoading.value = false;
  }
};

const handleStripePayment = async () => {
  // 1. Create order on backend to get client_secret
  await checkoutStore.createOrder('stripe');
  if (checkoutError.value || !client_secret.value) {
    throw new Error(checkoutError.value || 'Could not initialize Stripe payment.');
  }

  // 2. Confirm the card payment with Stripe
  const { error, paymentIntent } = await stripe.value.confirmCardPayment(
    client_secret.value,
    {
      payment_method: {
        card: cardElement.value,
        billing_details: {
          name: formData.value.receiverName,
          email: formData.value.email,
        },
      },
    }
  );

  if (error) {
    throw new Error(error.message);
  }

  // 3. Confirm the order on the backend
  await checkoutStore.confirmStripeOrder(paymentIntent.id);
  if (checkoutError.value) {
    throw new Error(checkoutError.value);
  }

  router.push('/payment-success');
};

const handleCodPayment = async () => {
  await checkoutStore.createOrder('cod');
  if (checkoutError.value) {
    throw new Error(checkoutError.value);
  }
  router.push('/payment-success');
};

const handlePaypalPayment = async () => {
  await checkoutStore.createOrder('paypal');
  if (checkoutError.value || !checkoutStore.approval_link) {
    throw new Error(checkoutError.value || 'Could not initialize PayPal payment.');
  }
  window.location.href = checkoutStore.approval_link;
};

</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8 font-BonaRegular">
    <div class="max-w-7xl mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Order Summary Sidebar -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-2xl shadow-xl p-6 sticky top-8">
            <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">
              {{ t('orderSummary') }}
            </h2>

            <!-- Order Items -->
            <div class="space-y-4 mb-6">
              <div
                v-for="(item, index) in normalizedOrderItems"
                :key="item.id || index"
                class="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
              >
                <div class="flex-1">
                  <p class="font-medium text-gray-800 text-sm">
                    {{ item.title || (item.book && item.book.title) || t('checkoutPage.product') + (index + 1) }}
                  </p>
                  <p class="text-gray-600 text-xs">Quantity: {{ item.quantity || 0 }}</p>
                </div>
                <span class="font-bold text-[var(--color-primary)]"
                  >${{ Number(item.price || 0).toFixed(2) }}</span
                >
              </div>
            </div>

            <!-- Totals -->
            <div class="border-t pt-4 space-y-2">
              <div class="flex justify-between text-gray-600">
                <span>{{ t('subtotal') }}</span>
                <span>${{ subtotal.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-gray-600">
                <span>{{ t('shipping') }}</span>
                <span>${{ shippingCost.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-gray-600 text-sm">
                <span>{{ t('vat') }} (15%)</span>
                <span>${{ vatAmount.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-lg font-bold text-gray-800 border-t pt-2">
                <span>{{ t('total') }}</span>
                <span class="text-[var(--color-primary)]"
                  >${{ grandTotal.toFixed(2) }}</span
                >
              </div>
            </div>

            <!-- Free Shipping Notice -->
            <div
              v-if="amountNeededForFreeShipping > 0"
              class="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
            >
              <p class="text-[var(--color-hover)] text-sm text-center">
                Add ${{ amountNeededForFreeShipping.toFixed(2) }}
                {{ t('freeShippingNotice') }}
              </p>
            </div>
          </div>
        </div>

        <!-- Main Checkout Form -->
        <div class="lg:col-span-2">
          <div class="bg-black rounded-2xl shadow-2xl overflow-hidden">
            <div class="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-light)] p-6">
              <h1 class="text-black text-3xl font-bold text-center">
                {{ t('checkoutPage.paymentAndShipping') }}
              </h1>
            </div>

            <form @submit.prevent="handleSubmit" class="p-8">
              <!-- Customer Information -->
              <div class="mb-8">
                <h3 class="text-[var(--color-primary)] text-xl font-bold mb-4 flex items-center">
                  <InfoIcon class="w-5 h-5 mr-2" />
                  {{ t('customerInformation') }}
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div v-for="field in formFields" :key="field.key" class="relative">
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
                  {{ t('shippingOptions') }}
                </h3>
                <div class="space-y-3">
                  <div v-for="option in shippingOptions" :key="option.id" class="relative">
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
                      :class="{
                        'ring-2 ring-[var(--color-primary)] bg-gray-700':
                          selectedShipping === option.id,
                      }"
                    >
                      <div class="flex items-center">
                        <component
                          :is="icons[option.icon]"
                          class="w-5 h-5 text-[var(--color-primary)] mr-3"
                        />
                        <span class="text-white font-medium">{{ option.name }}</span>
                      </div>
                      <span class="text-[var(--color-primary)] font-bold"
                        >${{ option.price.toFixed(2) }}</span
                      >
                    </label>
                  </div>
                </div>
              </div>

              <!-- Payment Options -->
              <div class="mb-8">
                <h3 class="text-[var(--color-primary)] text-xl font-bold mb-4 flex items-center">
                  <CreditCard class="w-5 h-5 mr-2" />
                  {{ t('paymentMethods') }}
                </h3>
                <div class="space-y-3">
                  <div v-for="option in paymentOptions" :key="option.id" class="relative">
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
                      :class="{
                        'ring-2 ring-[var(--color-primary)] bg-gray-700':
                          selectedPayment === option.id,
                      }"
                    >
                      <div class="flex items-center justify-between">
                        <div>
                          <div class="text-white font-medium">{{ option.name }}</div>
                          <div class="text-gray-400 text-sm mt-1">{{ option.subtitle }}</div>
                        </div>
                        <div
                          class="w-4 h-4 rounded-full border-2 border-[var(--color-primary)] flex items-center justify-center"
                        >
                          <div
                            v-if="selectedPayment === option.id"
                            class="w-2 h-2 bg-[var(--color-primary)] rounded-full"
                          ></div>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                <!-- Stripe Card Element -->
                <div v-show="selectedPayment === 'stripe'" class="mt-6">
                    <label class="block text-[var(--color-primary)] text-sm font-medium mb-2">Card Details</label>
                    <div id="card-element" class="w-full bg-gray-800 text-white rounded-xl p-3 border border-gray-600"></div>
                    <div v-if="stripeError" class="text-red-400 text-sm mt-2">{{ stripeError }}</div>
                </div>

                <!-- PayPal Information -->
                <div v-show="selectedPayment === 'paypal'" class="mt-6">
                    <div class="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <p class="text-blue-800 text-sm">
                            سيتم توجيهك إلى صفحة باي بال لإتمام عملية الدفع بشكل آمن.
                        </p>
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
                  <span v-if="!isLoading">{{ t('placeOrder') }}</span>
                  <span v-else class="flex items-center">
                    <svg
                      class="animate-spin -ml-1 mr-3 h-5 w-5 text-black"
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
                      ></circle>
                      <path
                        class="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {{ t('processing') }}
                  </span>
                </button>
                <RouterLink
                  to="/cart"
                  class="bg-transparent hover:bg-[var(--color-primary)] hover:text-black text-white border-2 border-[var(--color-primary)] font-bold py-4 px-8 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-300 text-center"
                >
                  {{ t('backToCart') }}
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
