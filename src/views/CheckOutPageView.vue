<script setup>
import { InfoIcon, CreditCard, Truck, Package, Wallet } from 'lucide-vue-next';
import { ref, computed, onMounted, nextTick } from 'vue';
import { useCartStore } from '@/stores/Cart';
import { useCheckoutStore } from '@/stores/Checkout';
import { useUserStore } from '@/stores/Users';
import { useOrdersStore } from '@/stores/Orders';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useLanguageStore } from '@/stores/language';
import { loadStripe } from '@stripe/stripe-js';

const icons = {
  Truck,
  Package,
  Wallet,
};

const isLoading = ref(false);
const selectedShipping = ref('delivery');
const selectedPayment = ref('stripe'); // Default to stripe
const errorMessage = ref('');

const languageStore = useLanguageStore();
const { translations } = storeToRefs(languageStore);

const cartStore = useCartStore();
const { cart: orderItems, cartTotal } = storeToRefs(cartStore);

const checkoutStore = useCheckoutStore();
const { shippingOptions } = storeToRefs(checkoutStore);
// Add cash_on_delivery to payment options
const paymentOptions = ref([
  { id: 'stripe', name: 'Stripe', subtitle: 'Pay with your credit card' },
  { id: 'paypal', name: 'PayPal', subtitle: 'Pay with your PayPal account' },
  { id: 'cash_on_delivery', name: 'Cash on Delivery', subtitle: 'Pay when you receive the order' }
]);

const userStore = useUserStore();
const { user } = storeToRefs(userStore);

const ordersStore = useOrdersStore();
const router = useRouter();

// Stripe elements
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);
let stripe = null;
let cardElement = null;

onMounted(async () => {
  // checkoutStore.fetchCheckoutData(); // This can be uncommented if shipping options are from API
  if (selectedPayment.value === 'stripe') {
    await initializeStripe();
  }
});

async function initializeStripe() {
  stripe = await stripePromise;
  const elements = stripe.elements();
  cardElement = elements.create('card', {
    style: {
      base: {
        color: '#ffffff',
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
  await nextTick();
  const cardElementContainer = document.querySelector('#card-element');
  if (cardElementContainer) {
    cardElement.mount(cardElementContainer);
  }
}

// Form data
const formData = ref({
  receiverName: user.value?.name || '',
  email: user.value?.email || '',
  phone: '',
  address: user.value?.address || '',
  city: '',
  postalCode: ''
});

// Computed values
const subtotal = computed(() => cartTotal.value);

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

const handleSubmit = async () => {
  if (isLoading.value) return;
  isLoading.value = true;
  errorMessage.value = '';

  try {
    const response = await ordersStore.createOrder(selectedPayment.value);

    if (selectedPayment.value === 'stripe') {
      const { client_secret, order } = response;
      const { error, paymentIntent } = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: formData.value.receiverName,
          },
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (paymentIntent.status === 'succeeded') {
        ordersStore.finalizeOrder(order);
        router.push({ name: 'payment-success', query: { orderId: order.id } });
      } else {
        throw new Error('Payment not successful.');
      }
    } else if (selectedPayment.value === 'paypal') {
      const { approval_link } = response;
      window.location.href = approval_link;
    } else if (selectedPayment.value === 'cash_on_delivery') {
      const { order } = response;
      ordersStore.finalizeOrder(order);
      router.push({ name: 'payment-success', query: { orderId: order.id } });
    }
  } catch (error) {
    errorMessage.value = error.message || 'An unexpected error occurred.';
    console.error(error);
  } finally {
    isLoading.value = false;
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
            <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">{{ translations.orderSummary || 'Order Summary' }}</h2>

            <!-- Order Items -->
            <div class="space-y-4 mb-6">
              <div
                v-for="item in orderItems"
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
                <span>{{ translations.subtotal || 'Subtotal' }}</span>
                <span>${{ subtotal.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-gray-600">
                <span>{{ translations.shipping || 'Shipping' }}</span>
                <span>${{ shippingCost.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-gray-600 text-sm">
                <span>{{ translations.vat || 'VAT' }} (15%)</span>
                <span>${{ vatAmount.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-lg font-bold text-gray-800 border-t pt-2">
                <span>{{ translations.total || 'Total' }}</span>
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
              <!-- ... same as before ... -->

              <!-- Shipping Options -->
              <!-- ... same as before ... -->

              <!-- Payment Options -->
              <div class="mb-8">
                <h3 class="text-[var(--color-primary)] text-xl font-bold mb-4 flex items-center">
                  <CreditCard class="w-5 h-5 mr-2" />
                  {{ translations.paymentMethods || 'Payment Methods' }}
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
                      @change="option.id === 'stripe' ? initializeStripe() : null"
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

                <!-- Stripe Card Element -->
                <div v-if="selectedPayment === 'stripe'" class="mt-6 space-y-4">
                   <label class="block text-[var(--color-primary)] text-sm font-medium mb-2">Credit or debit card</label>
                   <div id="card-element" class="w-full bg-gray-800 rounded-xl p-4 border border-gray-600"></div>
                   <!-- Used to display form errors. -->
                   <div id="card-errors" role="alert" class="text-red-400 text-sm mt-2">{{ errorMessage }}</div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  type="submit"
                  :disabled="isLoading"
                  class="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-light)] hover:from-[var(--color-primary)] hover:to-[var(--color-primary)] text-black font-bold py-4 px-8 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <span v-if="!isLoading">{{ translations.placeOrder || 'Place Order' }}</span>
                  <span v-else class="flex items-center">
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {{ translations.processing || 'Processing...' }}
                  </span>
                </button>
                <RouterLink
                  to="/cart"
                  class="bg-transparent hover:bg-[var(--color-primary)] hover:text-black text-white border-2 border-[var(--color-primary)] font-bold py-4 px-8 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-300 text-center"
                >
                 {{ translations.backToCart || 'Back to Cart' }}
                </RouterLink>
              </div>
               <!-- Error Message Display -->
                <div v-if="errorMessage" class="mt-4 text-center text-red-400">
                    {{ errorMessage }}
                </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
#card-element {
  padding: 12px;
  border-radius: 0.75rem;
  background-color: #1f2937;
  border: 1px solid #4b5563;
}
</style>
