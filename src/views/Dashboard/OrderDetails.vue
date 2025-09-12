<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useOrdersStore } from '@/stores/Orders'
import LoaderWithText from '@/components/LoaderWithText.vue'
import { storeToRefs } from 'pinia'
import { XCircleIcon, CheckCircleIcon, UserIcon, EnvelopeIcon, MapPinIcon, ClockIcon, TruckIcon, DocumentDuplicateIcon, EyeIcon, ArrowPathIcon, InformationCircleIcon, CurrencyDollarIcon, CalendarDaysIcon, TagIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  orderId: {
    type: Number,
    required: false
  }
})

const emit = defineEmits(['statusChanged', 'orderUpdated'])

const route = useRoute()
const { t } = useI18n()
const ordersStore = useOrdersStore()
const { loading: isLoading } = storeToRefs(ordersStore)

// تعريف ثابت الحالات داخل نفس الملف
const ORDER_STATUS = {
  PENDING: 'pending',
  SHIPPED: 'shipped',
  COMPLETED: 'paid',
  CANCELLED: 'canceled'
}

const isUpdating = ref(false)
const error = ref(null)
const showSuccessMessage = ref(false)

const orderId = computed(() => {
  return props.orderId || parseInt(route.params.id)
})

const selectedOrder = computed(() => {
  return ordersStore.orders.find(order => order.id === orderId.value)
})

const updateOrderStatus = async (newStatus) => {
  if (!selectedOrder.value || isUpdating.value) return

  try {
    isUpdating.value = true
    error.value = null

    const oldStatus = selectedOrder.value.status
    await ordersStore.updateOrder(orderId.value, { status: newStatus })

    showSuccessMessage.value = true
    setTimeout(() => {
      showSuccessMessage.value = false
    }, 3000)

    emit('statusChanged', { orderId: orderId.value, oldStatus, newStatus })
    emit('orderUpdated', selectedOrder.value)
  } catch (err) {
    error.value = 'حدث خطأ أثناء تحديث حالة الطلب'
  } finally {
    isUpdating.value = false
  }
}

// Computed properties
const formattedOrderDate = computed(() => {
  if (!selectedOrder.value || !selectedOrder.value.createdAt) return ''
  const date = new Date(selectedOrder.value.createdAt)
  return date.toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
})

const statusConfig = computed(() => {
  if (!selectedOrder.value) return {}

  const statusMap = {
    'pending': {
      icon: ClockIcon,
      label: t('orderDetails.statusPending'),
      color: 'bg-amber-100 text-amber-800 border-amber-200',
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-600',
      progress: 25
    },
    'shipped': {
      icon: TruckIcon,
      label: t('orderDetails.statusShipped'),
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      bgColor: 'bg-blue-50',
      iconColor: 'text-[var(--color-primary)]',
      progress: 75
    },
    'paid': {
      icon: CheckCircleIcon,
      label: t('orderDetails.statusCompleted'),
      color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      progress: 100
    },
    'canceled': {
      icon: XCircleIcon,
      label: t('orderDetails.statusCancelled'),
      color: 'bg-red-100 text-red-800 border-red-200',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
      progress: 0
    }
  }

  return statusMap[selectedOrder.value.status] || statusMap['pending']
})

const statusOptions = computed(() => {
  return [
    { value: 'pending', label: t('orderDetails.statusPending'), icon: ClockIcon },
    { value: 'shipped', label: t('orderDetails.statusShipped'), icon: TruckIcon },
    { value: 'paid', label: t('orderDetails.statusCompleted'), icon: CheckCircleIcon },
    { value: 'canceled', label: t('orderDetails.statusCancelled'), icon: XCircleIcon }
  ]
})

const subtotal = computed(() => {
  if (!selectedOrder.value || !selectedOrder.value.items) return 0
  return selectedOrder.value.items.reduce((total, item) => {
    return total + (parseFloat(item.price) * item.quantity)
  }, 0)
})

const orderTotal = computed(() => {
  if (!selectedOrder.value) return 0
  // Use the total_price from the API response
  return parseFloat(selectedOrder.value.total_price || '0')
})

// Helper functions
const goBack = () => {
  window.history.back()
}

const printOrder = () => {
  window.print()
}

const downloadInvoice = () => {
  // Implement invoice download functionality
  console.log('Downloading invoice...')
}

const copyOrderId = () => {
  navigator.clipboard.writeText(selectedOrder.value.id.toString())
  showSuccessMessage.value = true
  setTimeout(() => {
    showSuccessMessage.value = false
  }, 2000)
}

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

// Helper functions to access book data from items array
const getFirstBookCover = () => {
  if (selectedOrder.value && selectedOrder.value.items && selectedOrder.value.items.length > 0) {
    const firstItem = selectedOrder.value.items[0]
    if (firstItem.book && firstItem.book.cover) {
      return `${apiBaseUrl}${firstItem.book.cover}`
    }
  }
  // Return a default placeholder image if book data is not available
  return 'https://via.placeholder.com/200x280?text=Book+Cover'
}

const getFirstBookTitle = () => {
  if (selectedOrder.value && selectedOrder.value.items && selectedOrder.value.items.length > 0) {
    const firstItem = selectedOrder.value.items[0]
    if (firstItem.book && firstItem.book.title) {
      return firstItem.book.title
    }
  }
  return t('orderDetails.bookTitleNotAvailable')
}

const getFirstBookAuthor = () => {
  // In the provided data, there is no author field, so we return a placeholder
  if (selectedOrder.value && selectedOrder.value.items && selectedOrder.value.items.length > 0) {
    const firstItem = selectedOrder.value.items[0]
    if (firstItem.book && firstItem.book.author) {
      return firstItem.book.author.name
    }
    return t('orderDetails.unknownAuthor')
  }
  return t('orderDetails.authorNotAvailable')
}

const getFirstBookIsbn = () => {
  // In the provided data, there is no ISBN field, so we return a placeholder
  if (selectedOrder.value && selectedOrder.value.items && selectedOrder.value.items.length > 0) {
    const firstItem = selectedOrder.value.items[0]
    if (firstItem.book && firstItem.book.isbn) {
      return firstItem.book.isbn
    }
  }
  return t('orderDetails.isbnNotAvailable')
}

onMounted(async () => {
  try {
    error.value = null

    if (ordersStore.orders.length === 0) {
      await ordersStore.fetchOrders()
    }
  } catch (err) {
    error.value = t('orderDetails.errorLoading')
  }
})

watch(isLoading, (newLoading) => {
  if (newLoading === false && !selectedOrder.value) {
    error.value = t('orderDetails.errorNotFound')
  }
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
    <!-- Loading State with enhanced animation -->
    <div v-if="isLoading" class="flex items-center justify-center min-h-screen">
      <LoaderWithText :message="t('orderDetails.loading')" />
    </div>

    <!-- Error State with enhanced design -->
    <div v-else-if="error" class="flex items-center justify-center min-h-screen px-4">
      <div class="text-center p-8 bg-white rounded-2xl shadow-xl border border-gray-200 max-w-md">
        <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
          <XCircleIcon class="h-8 w-8 text-red-600" />
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-3">{{ t('orderDetails.errorOccurred') }}</h3>
        <p class="text-gray-600 mb-6">{{ error }}</p>
        <button
          @click="goBack"
          class="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-[var(--color-primary)] hover:bg-[var(--color-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 hover:shadow-lg"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          {{ t('orderDetails.goBack') }}
        </button>
      </div>
    </div>

    <!-- Main Content with enhanced design -->
    <div v-else-if="selectedOrder" class="max-w-6xl mx-auto px-4 md:px-6 py-8">
      <!-- Success Message with better animation -->
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <div v-if="showSuccessMessage" class="mb-6">
          <div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center shadow-sm">
            <div class="flex-shrink-0">
              <CheckCircleIcon class="h-6 w-6 text-emerald-600" />
            </div>
            <div class="ml-3">
              <p class="text-emerald-800 font-medium">{{ t('orderDetails.updateSuccess') }}</p>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Enhanced Header with gradient background -->
      <div class="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-hover)] rounded-2xl shadow-xl mb-8 overflow-hidden">
        <div class="px-6 py-8 text-white">
          <div class="flex flex-col md:flex-row md:items-center justify-between">
            <div class="mb-6 md:mb-0">
              <div class="flex items-center mb-4">
                <button
                  @click="goBack"
                  class="mr-4 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                  </svg>
                </button>
                <div>
                  <h1 class="text-3xl md:text-4xl font-bold mb-2">
                    {{ t('orderDetails.title') }}{{ selectedOrder.id }}
                  </h1>
                  <div class="flex items-center space-x-4 text-white/80">
                    <div class="flex items-center">
                      <CalendarDaysIcon class="h-4 w-4 mr-2" />
                      <span>{{ formattedOrderDate }}</span>
                    </div>
                    <button
                      @click="copyOrderId"
                      class="flex items-center hover:text-white transition-colors"
                    >
                      <DocumentDuplicateIcon class="h-4 w-4 mr-1" />
                      <span class="text-sm">Copy ID</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex flex-col sm:flex-row gap-3">
              <button
                @click="printOrder"
                class="flex items-center justify-center px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition-all duration-200 hover:scale-105"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
                </svg>
                طباعة
              </button>
              <button
                @click="downloadInvoice"
                class="flex items-center justify-center px-6 py-3 bg-white text-[var(--color-primary)] rounded-xl hover:bg-gray-50 transition-all duration-200 hover:scale-105 font-medium shadow-lg"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                تحميل الفاتورة
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <!-- Main Content -->
        <div class="xl:col-span-2 space-y-8">
          <!-- Enhanced Order Status Card -->
          <div class="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div class="px-8 py-6 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <div class="flex items-center">
                <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-100 mr-4">
                  <component :is="statusConfig.icon" class="h-5 w-5 text-[var(--color-primary)]" />
                </div>
                <h2 class="text-xl font-bold text-gray-900">{{ t('orderDetails.statusTitle') }}</h2>
              </div>
            </div>
            <div class="p-8">
              <!-- Status Progress Bar -->
              <div class="mb-8">
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center space-x-4">
                    <div class="flex items-center justify-center w-12 h-12 rounded-2xl" :class="statusConfig.bgColor">
                      <component :is="statusConfig.icon" class="h-6 w-6" :class="statusConfig.iconColor" />
                    </div>
                    <div>
                      <span class="inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold border" :class="statusConfig.color">
                        {{ statusConfig.label }}
                      </span>
                      <p class="text-sm text-gray-500 mt-1">{{ formattedOrderDate }}</p>
                    </div>
                  </div>
                </div>

                <!-- Progress bar -->
                <div class="w-full bg-gray-200 rounded-full h-3 mb-4">
                  <div
                    class="h-3 rounded-full transition-all duration-1000 ease-out"
                    :class="statusConfig.progress === 100 ? 'bg-emerald-500' : statusConfig.progress >= 75 ? 'bg-blue-500' : statusConfig.progress >= 25 ? 'bg-amber-500' : 'bg-gray-400'"
                    :style="`width: ${statusConfig.progress}%`"
                  ></div>
                </div>
              </div>

              <div class="space-y-4">
                <label class="block text-sm font-bold text-gray-700">
                  {{ t('orderDetails.updateStatus') }}
                </label>
                <div class="flex items-center gap-4">
                  <div class="flex-1 relative">
                    <select
                      :value="selectedOrder.status"
                      @change="updateOrderStatus($event.target.value)"
                      :disabled="isUpdating"
                      class="w-full appearance-none border-2 border-gray-200 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed font-medium transition-all duration-200"
                    >
                      <option
                        v-for="option in statusOptions"
                        :key="option.value"
                        :value="option.value"
                      >
                        {{ option.label }}
                      </option>
                    </select>
                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                      <ArrowPathIcon v-if="isUpdating" class="h-4 w-4 animate-spin" />
                      <svg v-else class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Enhanced Order Items -->
          <div class="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div class="px-8 py-6 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <div class="flex items-center">
                <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-100 mr-4">
                  <TagIcon class="h-5 w-5 text-emerald-600" />
                </div>
                <h2 class="text-xl font-bold text-gray-900">{{ t('orderDetails.itemsTitle') }}</h2>
              </div>
            </div>
            <div class="p-8">
              <div class="flex items-start space-x-6">
                <div class="relative group">
                  <img
                    :src="getFirstBookCover()"
                    :alt="getFirstBookTitle()"
                    class="w-24 h-32 object-cover rounded-2xl border-2 border-gray-200 group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105"
                  />
                  <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-2xl transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <EyeIcon class="h-6 w-6 text-white" />
                  </div>
                </div>
                <div class="flex-1">
                  <div class="mb-4">
                    <h3 class="font-bold text-gray-900 text-xl mb-2">
                      {{ getFirstBookTitle() }}
                    </h3>
                    <p class="text-gray-600 mb-2">{{ getFirstBookAuthor() }}</p>
                    <p class="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-lg inline-block">
                      {{ t('bookdetails.isbn') }}: {{ getFirstBookIsbn() }}
                    </p>
                  </div>
                  <div class="flex items-center justify-between bg-gray-50 rounded-xl p-4">
                    <div class="text-center">
                      <p class="text-sm text-gray-500 font-medium">الكمية</p>
                      <p class="text-lg font-bold text-gray-900">{{ selectedOrder.items && selectedOrder.items[0] ? selectedOrder.items[0].quantity : 0 }}</p>
                    </div>
                    <div class="text-center">
                      <p class="text-sm text-gray-500 font-medium">السعر</p>
                      <p class="text-lg font-bold text-[var(--color-primary)]">${{ selectedOrder.items && selectedOrder.items[0] ? selectedOrder.items[0].price : '0.00' }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Display additional items if there are more than one -->
              <div v-if="selectedOrder.items && selectedOrder.items.length > 1" class="mt-8 pt-6 border-t-2 border-gray-100">
                <h4 class="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <InformationCircleIcon class="h-5 w-5 mr-2 text-blue-500" />
                  {{ t('orderDetails.additionalItems', { count: selectedOrder.items.length - 1 }) }}
                </h4>
                <div class="space-y-3">
                  <div v-for="(item, index) in selectedOrder.items.slice(1)" :key="index"
                       class="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div class="flex-1">
                      <p class="font-bold text-gray-900">{{ item.book?.title || 'Book Title' }}</p>
                      <p class="text-sm text-gray-600">الكمية: {{ item.quantity }}</p>
                    </div>
                    <span class="font-bold text-[var(--color-primary)] text-lg">${{ item.price }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Enhanced Tracking Information -->
          <div
            v-if="selectedOrder.tracking"
            class="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
          >
            <div class="px-8 py-6 bg-gradient-to-r from-blue-50 to-indigo-100 border-b border-gray-200">
              <div class="flex items-center">
                <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-100 mr-4">
                  <TruckIcon class="h-5 w-5 text-[var(--color-primary)]" />
                </div>
                <h2 class="text-xl font-bold text-gray-900">{{ t('order.tracking') }}</h2>
              </div>
            </div>
            <div class="p-8">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6">
                  <p class="text-sm text-[var(--color-hover)] font-bold mb-2">{{ t('order.trackingNumber') }}</p>
                  <p class="font-mono text-xl text-blue-900 font-bold">{{ selectedOrder.tracking.number }}</p>
                </div>
                <div class="bg-gradient-to-r from-green-50 to-emerald-100 rounded-xl p-6">
                  <p class="text-sm text-green-700 font-bold mb-2">{{ t('order.shippingCarrier') }}</p>
                  <p class="text-xl text-green-900 font-bold">{{ selectedOrder.tracking.carrier }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Enhanced Sidebar -->
        <div class="space-y-8">
          <!-- Enhanced Customer Information -->
          <div class="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div class="px-6 py-4 bg-gradient-to-r from-purple-50 to-pink-100 border-b border-gray-200">
              <div class="flex items-center">
                <div class="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-100 mr-3">
                  <UserIcon class="h-4 w-4 text-purple-600" />
                </div>
                <h2 class="text-lg font-bold text-gray-900">{{ t('orderDetails.customerInfo') }}</h2>
              </div>
            </div>
            <div class="p-6 space-y-4">
              <div class="flex items-center bg-purple-50 rounded-xl p-4">
                <UserIcon class="h-5 w-5 text-purple-500 mr-3" />
                <span class="font-bold">{{ t('orderDetails.customerId') }} {{ selectedOrder.customer_id }}</span>
              </div>
              <div class="space-y-3 text-sm">
                <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span class="text-gray-600 font-medium">{{ t('orderDetails.orderId') }}</span>
                  <span class="font-bold text-gray-900">{{ selectedOrder.id }}</span>
                </div>
                <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span class="text-gray-600 font-medium">{{ t('orderDetails.status') }}</span>
                  <span class="font-bold" :class="statusConfig.iconColor">{{ selectedOrder.status }}</span>
                </div>
                <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span class="text-gray-600 font-medium">{{ t('orderDetails.created') }}</span>
                  <span class="font-bold text-gray-900">{{ new Date(selectedOrder.created_at).toLocaleDateString() }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Enhanced Order Summary -->
          <div class="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div class="px-6 py-4 bg-gradient-to-r from-green-50 to-emerald-100 border-b border-gray-200">
              <div class="flex items-center">
                <div class="flex items-center justify-center w-8 h-8 rounded-lg bg-green-100 mr-3">
                  <CurrencyDollarIcon class="h-4 w-4 text-green-600" />
                </div>
                <h2 class="text-lg font-bold text-gray-900">{{ t('orderDetails.summaryTitle') }}</h2>
              </div>
            </div>
            <div class="p-6 space-y-4">
              <div class="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                <span class="text-gray-600 font-medium">{{ t('orderDetails.subtotal') }}</span>
                <span class="font-bold text-gray-900 text-lg">${{ subtotal.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200">
                <span class="text-[var(--color-hover)] font-bold">{{ t('orderDetails.total') }}</span>
                <span class="font-bold text-blue-900 text-xl">${{ orderTotal.toFixed(2) }}</span>
              </div>

              <!-- Enhanced Order Details Grid -->
              <div class="mt-6 space-y-3">
                <div class="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4">
                  <div class="grid grid-cols-1 gap-3 text-sm">
                    <div class="flex justify-between items-center">
                      <span class="text-gray-600 font-medium flex items-center">
                        <TagIcon class="h-4 w-4 mr-2" />
                        {{ t('orderDetails.numItems') }}
                      </span>
                      <span class="font-bold text-gray-900">{{ selectedOrder.items?.length || 0 }}</span>
                    </div>
                    <div class="flex justify-between items-center">
                      <span class="text-gray-600 font-medium flex items-center">
                        <CalendarDaysIcon class="h-4 w-4 mr-2" />
                        {{ t('orderDetails.orderDate') }}
                      </span>
                      <span class="font-bold text-gray-900">{{ new Date(selectedOrder.created_at).toLocaleDateString() }}</span>
                    </div>
                    <div class="flex justify-between items-center">
                      <span class="text-gray-600 font-medium flex items-center">
                        <ClockIcon class="h-4 w-4 mr-2" />
                        {{ t('orderDetails.lastUpdated') }}
                      </span>
                      <span class="font-bold text-gray-900">{{ new Date(selectedOrder.updated_at).toLocaleDateString() }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Quick Actions -->
              <div class="mt-6 pt-4 border-t-2 border-gray-100">
                <h3 class="text-sm font-bold text-gray-700 mb-3">إجراءات سريعة</h3>
                <div class="grid grid-cols-2 gap-3">
                  <button
                    @click="printOrder"
                    class="flex flex-col items-center justify-center p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-105 group"
                  >
                    <svg class="w-6 h-6 text-gray-600 group-hover:text-gray-800 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
                    </svg>
                    <span class="text-xs font-medium text-gray-700 group-hover:text-gray-900">طباعة</span>
                  </button>
                  <button
                    @click="copyOrderId"
                    class="flex flex-col items-center justify-center p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all duration-200 hover:scale-105 group"
                  >
                    <DocumentDuplicateIcon class="w-6 h-6 text-[var(--color-primary)] group-hover:text-blue-800 mb-2" />
                    <span class="text-xs font-medium text-[var(--color-hover)] group-hover:text-blue-900">نسخ الرقم</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Timeline Card -->
          <div class="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div class="px-6 py-4 bg-gradient-to-r from-indigo-50 to-purple-100 border-b border-gray-200">
              <div class="flex items-center">
                <div class="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-100 mr-3">
                  <ClockIcon class="h-4 w-4 text-indigo-600" />
                </div>
                <h2 class="text-lg font-bold text-gray-900">تتبع الطلب</h2>
              </div>
            </div>
            <div class="p-6">
              <div class="space-y-4">
                <!-- Timeline items -->
                <div class="flex items-start">
                  <div class="flex-shrink-0">
                    <div class="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 border-4 border-green-200">
                      <CheckCircleIcon class="w-5 h-5 text-green-600" />
                    </div>
                  </div>
                  <div class="mr-4 min-w-0 flex-1">
                    <div class="text-sm font-bold text-gray-900">تم إنشاء الطلب</div>
                    <div class="text-sm text-gray-500">{{ new Date(selectedOrder.created_at).toLocaleString('ar-EG') }}</div>
                  </div>
                </div>

                <div class="flex items-start" v-if="selectedOrder.status !== 'pending'">
                  <div class="flex-shrink-0">
                    <div class="flex items-center justify-center w-10 h-10 rounded-full"
                         :class="selectedOrder.status === 'shipped' || selectedOrder.status === 'paid' ? 'bg-blue-100 border-4 border-blue-200' : 'bg-gray-100 border-4 border-gray-200'">
                      <TruckIcon class="w-5 h-5" :class="selectedOrder.status === 'shipped' || selectedOrder.status === 'paid' ? 'text-[var(--color-primary)]' : 'text-gray-400'" />
                    </div>
                  </div>
                  <div class="mr-4 min-w-0 flex-1">
                    <div class="text-sm font-bold text-gray-900">تم شحن الطلب</div>
                    <div class="text-sm text-gray-500">{{ new Date(selectedOrder.updated_at).toLocaleString('ar-EG') }}</div>
                  </div>
                </div>

                <div class="flex items-start" v-if="selectedOrder.status === 'paid'">
                  <div class="flex-shrink-0">
                    <div class="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100 border-4 border-emerald-200">
                      <CheckCircleIcon class="w-5 h-5 text-emerald-600" />
                    </div>
                  </div>
                  <div class="mr-4 min-w-0 flex-1">
                    <div class="text-sm font-bold text-gray-900">تم إكمال الطلب</div>
                    <div class="text-sm text-gray-500">{{ new Date(selectedOrder.updated_at).toLocaleString('ar-EG') }}</div>
                  </div>
                </div>

                <div class="flex items-start" v-if="selectedOrder.status === 'canceled'">
                  <div class="flex-shrink-0">
                    <div class="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 border-4 border-red-200">
                      <XCircleIcon class="w-5 h-5 text-red-600" />
                    </div>
                  </div>
                  <div class="mr-4 min-w-0 flex-1">
                    <div class="text-sm font-bold text-gray-900">تم إلغاء الطلب</div>
                    <div class="text-sm text-gray-500">{{ new Date(selectedOrder.updated_at).toLocaleString('ar-EG') }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom animations and transitions */
.animate-fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hover-lift {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Print styles */
@media print {
  .no-print {
    display: none !important;
  }

  .print-optimize {
    box-shadow: none !important;
    border: 1px solid #e5e7eb !important;
  }
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
