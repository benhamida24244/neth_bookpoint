<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { CheckCircleIcon, ClockIcon, XCircleIcon, TruckIcon, UserIcon, EnvelopeIcon, MapPinIcon } from '@heroicons/vue/24/outline'

// Types and Interfaces (in a real project, these would be in separate files)
const ORDER_STATUS = {
  PENDING: 'Pending',
  COMPLETED: 'Completed',
  RETURNED: 'Returned',
  PROCESSING: 'Processing',
  SHIPPED: 'Shipped'
}

const STATUS_CONFIG = {
  [ORDER_STATUS.COMPLETED]: {
    color: 'text-green-700 bg-green-100',
    icon: CheckCircleIcon,
    label: 'Completed'
  },
  [ORDER_STATUS.PENDING]: {
    color: 'text-yellow-700 bg-yellow-100',
    icon: ClockIcon,
    label: 'Pending'
  },
  [ORDER_STATUS.RETURNED]: {
    color: 'text-red-700 bg-red-100',
    icon: XCircleIcon,
    label: 'Returned'
  },
  [ORDER_STATUS.PROCESSING]: {
    color: 'text-blue-700 bg-blue-100',
    icon: TruckIcon,
    label: 'Processing'
  },
  [ORDER_STATUS.SHIPPED]: {
    color: 'text-purple-700 bg-purple-100',
    icon: TruckIcon,
    label: 'Shipped'
  }
}

// Props and Emits
const props = defineProps({
  orderId: {
    type: [String, Number],
    required: false
  }
})

const emit = defineEmits(['orderUpdated', 'statusChanged'])

// Composables
const route = useRoute()
const router = useRouter()

// State Management
const isLoading = ref(true)
const isUpdating = ref(false)
const error = ref(null)
const showSuccessMessage = ref(false)

// Mock data - في التطبيق الحقيقي سيتم جلبها من API
const orders = ref([
  {
    id: 1,
    customer: {
      name: 'Ali Ahmed',
      email: 'ali@example.com',
      phone: '+966 50 123 4567',
      address: {
        street: '123 King Fahd Road',
        city: 'Riyadh',
        country: 'Saudi Arabia',
        postalCode: '11564'
      }
    },
    book: {
      title: '1984',
      author: 'George Orwell',
      isbn: '978-0-452-28423-4',
      coverImage: 'https://via.placeholder.com/150x200'
    },
    status: ORDER_STATUS.COMPLETED,
    pricing: {
      basePrice: 29.99,
      shipping: 5.00,
      tax: 2.10,
      discount: 0
    },
    dates: {
      ordered: '2025-07-12T10:30:00Z',
      shipped: '2025-07-13T14:20:00Z',
      delivered: '2025-07-15T16:45:00Z'
    },
    quantity: 1,
    tracking: {
      number: 'TRK123456789',
      carrier: 'DHL Express'
    }
  },
  {
    id: 2,
    customer: {
      name: 'Sara Belkacem',
      email: 'sara@example.com',
      phone: '+966 55 987 6543',
      address: {
        street: '456 Prince Mohammed Bin Abdulaziz Road',
        city: 'Jeddah',
        country: 'Saudi Arabia',
        postalCode: '21589'
      }
    },
    book: {
      title: 'Kafka on the Shore',
      author: 'Haruki Murakami',
      isbn: '978-1-4000-7927-6',
      coverImage: 'https://via.placeholder.com/150x200'
    },
    status: ORDER_STATUS.PENDING,
    pricing: {
      basePrice: 35.00,
      shipping: 5.00,
      tax: 2.80,
      discount: 5.00
    },
    dates: {
      ordered: '2025-07-14T09:15:00Z'
    },
    quantity: 1,
    tracking: null
  }
])

// Computed Properties
const orderId = computed(() => {
  return props.orderId || parseInt(route.params.id)
})

const selectedOrder = computed(() => {
  return orders.value.find(order => order.id === orderId.value)
})

const orderTotal = computed(() => {
  if (!selectedOrder.value) return 0
  const { basePrice, shipping, tax, discount } = selectedOrder.value.pricing
  return basePrice + shipping + tax - discount
})

const subtotal = computed(() => {
  if (!selectedOrder.value) return 0
  return selectedOrder.value.pricing.basePrice * selectedOrder.value.quantity
})

const statusConfig = computed(() => {
  if (!selectedOrder.value) return null
  return STATUS_CONFIG[selectedOrder.value.status]
})

const statusOptions = computed(() => {
  return Object.values(ORDER_STATUS).map(status => ({
    value: status,
    label: STATUS_CONFIG[status].label,
    disabled: false // يمكن تخصيص هذا بناءً على منطق العمل
  }))
})

const formattedOrderDate = computed(() => {
  if (!selectedOrder.value?.dates.ordered) return ''
  return new Date(selectedOrder.value.dates.ordered).toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
})

// Methods
const updateOrderStatus = async (newStatus) => {
  if (!selectedOrder.value || isUpdating.value) return

  try {
    isUpdating.value = true
    error.value = null

    // في التطبيق الحقيقي، سيتم استدعاء API
    await new Promise(resolve => setTimeout(resolve, 1000))

    const oldStatus = selectedOrder.value.status
    selectedOrder.value.status = newStatus

    // إضافة تاريخ الحالة الجديدة
    if (newStatus === ORDER_STATUS.SHIPPED && !selectedOrder.value.dates.shipped) {
      selectedOrder.value.dates.shipped = new Date().toISOString()
    }
    if (newStatus === ORDER_STATUS.COMPLETED && !selectedOrder.value.dates.delivered) {
      selectedOrder.value.dates.delivered = new Date().toISOString()
    }

    showSuccessMessage.value = true
    setTimeout(() => {
      showSuccessMessage.value = false
    }, 3000)

    emit('statusChanged', {
      orderId: selectedOrder.value.id,
      oldStatus,
      newStatus
    })

    emit('orderUpdated', selectedOrder.value)

  } catch (err) {
    error.value = 'There was an error updating the order status. Please try again.'
    console.error('Error updating order status:', err)
  } finally {
    isUpdating.value = false
  }
}

const goBack = () => {
  router.go(-1)
}

const printOrder = () => {
  window.print()
}

const downloadInvoice = () => {
  // منطق تحميل الفاتورة
  console.log('Downloading invoice for order:', orderId.value)
}

// Lifecycle
onMounted(async () => {
  try {
    isLoading.value = true
    error.value = null

    // في التطبيق الحقيقي، سيتم جلب البيانات من API
    await new Promise(resolve => setTimeout(resolve, 500))

    if (!selectedOrder.value) {
      error.value = 'لم يتم العثور على الطلب المطلوب'
    }

  } catch (err) {
    error.value = 'حدث خطأ في تحميل بيانات الطلب'
    console.error('Error loading order:', err)
  } finally {
    isLoading.value = false
  }
})

// Watchers
watch(() => route.params.id, (newId) => {
  if (newId) {
    // إعادة تحميل البيانات عند تغيير معرف الطلب
    onMounted()
  }
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center min-h-screen">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <span class="ml-3 text-gray-600">Loading order data...</span>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex items-center justify-center min-h-screen">
      <div class="text-center p-8 bg-white rounded-xl shadow-sm border max-w-md">
        <XCircleIcon class="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h3 class="text-lg font-semibold text-gray-900 mb-2">An error occurred</h3>
        <p class="text-gray-600 mb-4">{{ error }}</p>
        <button
          @click="goBack"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go Back
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else-if="selectedOrder" class="max-w-4xl mx-auto px-4 md:px-6 py-8">
      <!-- Success Message -->
      <Transition
        enter-active-class="transition ease-out duration-300"
        enter-from-class="transform opacity-0 translate-y-2"
        enter-to-class="transform opacity-100 translate-y-0"
        leave-active-class="transition ease-in duration-200"
        leave-from-class="transform opacity-100 translate-y-0"
        leave-to-class="transform opacity-0 translate-y-2"
      >
        <div v-if="showSuccessMessage" class="mb-6">
          <div class="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
            <CheckCircleIcon class="h-5 w-5 text-green-600 ml-3" />
            <span class="text-green-800 font-medium">Order status updated successfully</span>
          </div>
        </div>
      </Transition>

      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div class="mb-4 md:mb-0">
          <div class="flex items-center mb-2">
            <button
              @click="goBack"
              class="ml-3 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 19l-7-7 7-7"
                ></path>
              </svg>
            </button>
            <h1 class="text-2xl md:text-3xl font-bold text-gray-900">
              Order Details #{{ selectedOrder.id }}
            </h1>
          </div>
          <p class="text-gray-600">{{ formattedOrderDate }}</p>
        </div>

        <div class="flex flex-col sm:flex-row gap-3">
          <button
            @click="printOrder"
            class="flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
              ></path>
            </svg>
            Print
          </button>
          <button
            @click="downloadInvoice"
            class="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              ></path>
            </svg>
            Download Invoice
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Order Status Card -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 class="text-lg font-semibold text-gray-900">Order Status</h2>
            </div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center">
                  <component
                    :is="statusConfig.icon"
                    class="h-6 w-6 ml-3"
                    :class="statusConfig.color.split(' ')[0]"
                  />
                  <span
                    class="px-3 py-1 rounded-full text-sm font-medium"
                    :class="statusConfig.color"
                  >
                    {{ statusConfig.label }}
                  </span>
                </div>
                <span class="text-sm text-gray-500">{{ formattedOrderDate }}</span>
              </div>

              <div class="mt-6">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Update Order Status
                </label>
                <div class="flex items-center gap-3">
                  <select
                    :value="selectedOrder.status"
                    @change="updateOrderStatus($event.target.value)"
                    :disabled="isUpdating"
                    class="flex-1 border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option
                      v-for="option in statusOptions"
                      :key="option.value"
                      :value="option.value"
                      :disabled="option.disabled"
                    >
                      {{ option.label }}
                    </option>
                  </select>
                  <div v-if="isUpdating" class="flex items-center">
                    <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Items -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 class="text-lg font-semibold text-gray-900">Order Items</h2>
            </div>
            <div class="p-6">
              <div class="flex items-center space-x-4 space-x-reverse">
                <img
                  :src="selectedOrder.book.coverImage"
                  :alt="selectedOrder.book.title"
                  class="w-20 h-28 object-cover rounded-lg border border-gray-200"
                />
                <div class="flex-1">
                  <h3 class="font-semibold text-gray-900 text-lg">
                    {{ selectedOrder.book.title }}
                  </h3>
                  <p class="text-gray-600 mb-1">{{ selectedOrder.book.author }}</p>
                  <p class="text-sm text-gray-500 mb-2">ISBN: {{ selectedOrder.book.isbn }}</p>
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-600">Qty: {{ selectedOrder.quantity }}</span>
                    <span class="font-semibold text-gray-900"
                      >${{ selectedOrder.pricing.basePrice.toFixed(2) }}</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Tracking Information -->
          <div
            v-if="selectedOrder.tracking"
            class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          >
            <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 class="text-lg font-semibold text-gray-900">Tracking Information</h2>
            </div>
            <div class="p-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-600 font-medium">Tracking Number</p>
                  <p class="font-mono text-lg">{{ selectedOrder.tracking.number }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600 font-medium">Shipping Carrier</p>
                  <p class="text-lg">{{ selectedOrder.tracking.carrier }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Customer Information -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 class="text-lg font-semibold text-gray-900">Customer Information</h2>
            </div>
            <div class="p-6 space-y-4">
              <div class="flex items-center">
                <UserIcon class="h-5 w-5 text-gray-400 ml-3" />
                <span class="font-medium">{{ selectedOrder.customer.name }}</span>
              </div>
              <div class="flex items-center">
                <EnvelopeIcon class="h-5 w-5 text-gray-400 ml-3" />
                <a
                  :href="`mailto:${selectedOrder.customer.email}`"
                  class="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  {{ selectedOrder.customer.email }}
                </a>
              </div>
              <div class="flex items-center">
                <svg
                  class="h-5 w-5 text-gray-400 ml-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  ></path>
                </svg>
                <span>{{ selectedOrder.customer.phone }}</span>
              </div>
              <div class="flex items-start">
                <MapPinIcon class="h-5 w-5 text-gray-400 ml-3 mt-0.5" />
                <div class="text-sm leading-relaxed">
                  <p>{{ selectedOrder.customer.address.street }}</p>
                  <p>
                    {{ selectedOrder.customer.address.city }},
                    {{ selectedOrder.customer.address.postalCode }}
                  </p>
                  <p>{{ selectedOrder.customer.address.country }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Summary -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 class="text-lg font-semibold text-gray-900">Order Summary</h2>
            </div>
            <div class="p-6 space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-600">Subtotal</span>
                <span class="font-medium">${{ subtotal.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Shipping</span>
                <span class="font-medium">${{ selectedOrder.pricing.shipping.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Tax</span>
                <span class="font-medium">${{ selectedOrder.pricing.tax.toFixed(2) }}</span>
              </div>
              <div
                v-if="selectedOrder.pricing.discount > 0"
                class="flex justify-between text-green-600"
              >
                <span>Discount</span>
                <span>-${{ selectedOrder.pricing.discount.toFixed(2) }}</span>
              </div>
              <hr class="my-4" />
              <div class="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>${{ orderTotal.toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
@media print {
  .no-print {
    display: none !important;
  }
}
</style>
