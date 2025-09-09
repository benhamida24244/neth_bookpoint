<script setup>
import { InfoIcon, CreditCard, Truck, Package } from 'lucide-vue-next';
import { ref, computed, onMounted } from 'vue';
import { useCartStore } from '@/stores/Cart';
import { useCheckoutStore } from '@/stores/Checkout';
import { useCustomerAuthStore } from '@/stores/customerAuth';
import { useOrdersStore } from '@/stores/Orders';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';


const { t } = useI18n();
const icons = {
  Truck,
  Package,
};

const isLoading = ref(false);
const selectedShipping = ref('delivery'); // 'delivery' or 'pickup'
const selectedPayment = ref('paypal'); // 'paypal', or 'visa'

const cartStore = useCartStore();
const { cart: orderItems } = storeToRefs(cartStore);

// Normalize cart data to ensure it's always an array
const normalizedOrderItems = computed(() => {
  console.log("OrderItems value:", orderItems.value);

  // إذا كان المستخدم مسجلاً استخدم السلة من الخادم
  if (user.value) {
    // التحقق من وجود بيانات السلة بشكل مباشر
    if (Array.isArray(orderItems.value)) return orderItems.value;

    // التحقق من وجود items مباشرة في orderItems
    if (orderItems.value && Array.isArray(orderItems.value.items)) {
      console.log("Using orderItems.items");
      return orderItems.value.items;
    }

    // التحقق من وجود data في orderItems
    if (orderItems.value && orderItems.value.data) {
      console.log("Using orderItems.data");

      // إذا كانت data هي مصفوفة مباشرة
      if (Array.isArray(orderItems.value.data)) {
        return orderItems.value.data;
      }

      // إذا كانت data تحتوي على items
      if (orderItems.value.data && Array.isArray(orderItems.value.data.items)) {
        console.log("Using orderItems.data.items");
        return orderItems.value.data.items;
      }
    }
  }

  // إذا لم يكن المستخدم مسجلاً استخدم السلة المحلية
  if (cartStore.localCart && cartStore.localCart.length > 0) {
    console.log("Using local cart");
    return cartStore.localCart;
  }

  console.log("Returning empty array");
  return [];
});

const checkoutStore = useCheckoutStore();
const { shippingOptions, paymentOptions } = storeToRefs(checkoutStore);

const userStore = useCustomerAuthStore();
const { user } = storeToRefs(userStore);

const ordersStore = useOrdersStore();
const router = useRouter();

const visaCardDetails = ref({
  cardholderName: '',
  cardNumber: '',
  expirationDate: '',
  cvv: ''
});

onMounted(async () => {
  checkoutStore.fetchCheckoutData();

  // تأكد من تحميل بيانات السلة عند تحميل صفحة الدفع
  await cartStore.fetchCart();
  console.log("Cart data loaded:", cartStore.cart);
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

// Computed values
const subtotal = computed(() => {
  console.log("normalizedOrderItems:", normalizedOrderItems.value);
  const itemsTotal = normalizedOrderItems.value.reduce((sum, item) => {
    const price = Number(item.price || 0);
    const quantity = Number(item.quantity || 0);
    const itemTotal = price * quantity;
    console.log(`Item: ${item.name}, Price: ${price}, Quantity: ${quantity}, Total: ${itemTotal}`);
    return sum + itemTotal;
  }, 0);
  console.log("Subtotal total:", itemsTotal);
  return itemsTotal;
});

const shippingCost = computed(() => {
  const option = shippingOptions.value.find(opt => opt.id === selectedShipping.value);
  return option ? Number(option.price || 0) : 0;
});

const vatAmount = computed(() => {
  const total = Number(subtotal.value || 0) + Number(shippingCost.value || 0);
  return total * 0.15; // 15% VAT
});

const grandTotal = computed(() =>
  Number(subtotal.value || 0) + Number(shippingCost.value || 0) + Number(vatAmount.value || 0)
);

const freeShippingThreshold = 299.00;
const amountNeededForFreeShipping = computed(() =>
  Math.max(0, freeShippingThreshold - Number(subtotal.value || 0))
);

const handleSubmit = () => {
  if (isLoading.value) return;

  isLoading.value = true;

  const orderData = {
    items: normalizedOrderItems.value,
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

  if (selectedPayment.value === 'visa') {
    orderData.visaCard = visaCardDetails.value;
  }

  console.log('Order submitted:', orderData);

  // Simulate API call
  setTimeout(() => {
    ordersStore.createOrder(orderData);
    cartStore.clearCart();
    isLoading.value = false;
    router.push('/payment-success');
  }, 1000);
};
</script>


<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8 font-BonaRegular">
    <div class="max-w-7xl mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <!-- Order Summary Sidebar -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-2xl shadow-xl p-6 sticky top-8">
            <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">{{ t('orderSummary') }}</h2>

            <!-- Order Items -->
            <div class="space-y-4 mb-6">
              <div
                v-for="(item, index) in normalizedOrderItems"
                :key="item.name || index"
                class="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
              >
                <div class="flex-1">
                  <p class="font-medium text-gray-800 text-sm">{{ item.title || item.book.title || "Product " + (index + 1) }}</p>
                  <p class="text-gray-600 text-xs">Quantity: {{ item.quantity || 0 }}</p>
                </div>
                <span class="font-bold text-[var(--color-primary)]">${{ Number(item.price || 0).toFixed(2) }}</span>
              </div>
            </div>

            <!-- Totals -->
            <div class="border-t pt-4 space-y-2">
              <div class="flex justify-between text-gray-600">
                <span>{{ t('subtotal') }}</span>
                <span>${{ Number(subtotal || 0).toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-gray-600">
                <span>{{ t('shipping') }}</span>
                <span>${{ Number(shippingCost || 0).toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-gray-600 text-sm">
                <span>{{ t('vat') }} (15%)</span>
                <span>${{ Number(vatAmount || 0).toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-lg font-bold text-gray-800 border-t pt-2">
                <span>{{ t('total') }}</span>
                <span class="text-[var(--color-primary)]">${{ Number(grandTotal || 0).toFixed(2) }}</span>
              </div>
            </div>

            <!-- Free Shipping Notice -->
            <div v-if="amountNeededForFreeShipping > 0" class="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p class="text-[var(--color-hover)] text-sm text-center">
                Add ${{ Number(amountNeededForFreeShipping || 0).toFixed(2) }} {{ t('freeShippingNotice') }}
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
                 {{t('customerInformation')}}
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
                  {{t('shippingOptions')}}
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
                  {{t('paymentMethods')}}
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

                <!-- PayPal Button -->
                <div v-if="selectedPayment === 'paypal'" class="mt-6">
                  <button type="button" class="w-full bg-[#0070BA] text-white font-bold py-4 px-8 rounded-xl flex items-center justify-center transition-all duration-200 hover:bg-[#005ea6]">
                    <img src="https://www.paypalobjects.com/webstatic/mktg/Logo/pp-logo-200px.png" alt="PayPal" class="h-6 mr-2">
                    <span>Pay with PayPal</span>
                  </button>
                </div>

                <!-- Visa Card Form -->
                <div v-if="selectedPayment === 'visa'" class="mt-6 space-y-4">
                  <div>
                    <label for="cardholderName" class="block text-[var(--color-primary)] text-sm font-medium mb-2">Cardholder Name</label>
                    <input id="cardholderName" type="text" v-model="visaCardDetails.cardholderName" placeholder="John Doe" class="w-full bg-gray-800 text-white rounded-xl p-3 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]">
                  </div>
                  <div>
                    <label for="cardNumber" class="block text-[var(--color-primary)] text-sm font-medium mb-2">Card Number</label>
                    <input id="cardNumber" type="text" v-model="visaCardDetails.cardNumber" placeholder="**** **** **** ****" class="w-full bg-gray-800 text-white rounded-xl p-3 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]">
                  </div>
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label for="expirationDate" class="block text-[var(--color-primary)] text-sm font-medium mb-2">Expiration Date (MM/YY)</label>
                      <input id="expirationDate" type="text" v-model="visaCardDetails.expirationDate" placeholder="MM/YY" class="w-full bg-gray-800 text-white rounded-xl p-3 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]">
                    </div>
                    <div>
                      <label for="cvv" class="block text-[var(--color-primary)] text-sm font-medium mb-2">CVV</label>
                      <input id="cvv" type="text" v-model="visaCardDetails.cvv" placeholder="***" class="w-full bg-gray-800 text-white rounded-xl p-3 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]">
                    </div>
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
                  <span v-if="!isLoading">{{t('placeOrder')}}</span>
                  <span v-else class="flex items-center">
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {{t('processing')}}
                  </span>
                </button>
                <RouterLink
                  to="/cart"
                  class="bg-transparent hover:bg-[var(--color-primary)] hover:text-black text-white border-2 border-[var(--color-primary)] font-bold py-4 px-8 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-300 text-center"
                >
                 {{t('backToCart')}}
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
