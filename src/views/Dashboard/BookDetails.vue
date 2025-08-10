<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { CheckCircleIcon, ClockIcon, XCircleIcon, TruckIcon } from '@heroicons/vue/24/outline'
import { useBooksStore } from '@/stores/Books'

// Book Status Constants
const BOOK_STATUS = {
  PUBLISHED: 'published',
  PENDING: 'pending',
  DRAFT: 'draft',
  PROCESSING: 'processing',
  SHIPPED: 'shipped'
}

const STATUS_CONFIG = {
  [BOOK_STATUS.PUBLISHED]: {
    color: 'text-green-700 bg-green-100',
    icon: CheckCircleIcon,
    label: 'Published'
  },
  [BOOK_STATUS.PENDING]: {
    color: 'text-yellow-700 bg-yellow-100',
    icon: ClockIcon,
    label: 'Pending'
  },
  [BOOK_STATUS.DRAFT]: {
    color: 'text-red-700 bg-red-100',
    icon: XCircleIcon,
    label: 'Draft'
  },
  [BOOK_STATUS.PROCESSING]: {
    color: 'text-blue-700 bg-blue-100',
    icon: TruckIcon,
    label: 'Processing'
  },
  [BOOK_STATUS.SHIPPED]: {
    color: 'text-purple-700 bg-purple-100',
    icon: TruckIcon,
    label: 'Shipped'
  }
}

// Props and Emits
const props = defineProps({
  bookId: {
    type: [String, Number],
    required: false
  }
})
const emit = defineEmits(['bookUpdated', 'statusChanged'])

// Composables
const route = useRoute()
const router = useRouter()

// State
const isLoading = ref(true)
const isUpdating = ref(false)
const error = ref(null)
const showSuccessMessage = ref(false)

// Store (assume Pinia store exposes reactive `books`)
const booksStore = useBooksStore()
const books = computed(() => booksStore.books) // safe access as computed

// bookId: prefer prop, otherwise route param (Number or null)
const bookId = computed(() => {
  if (props.bookId !== undefined && props.bookId !== null && props.bookId !== '') {
    return Number(props.bookId)
  }
  const id = route.params.id
  return id ? Number(id) : null
})

// selectedBook (may be undefined if not found)
const selectedBook = computed(() => {
  const id = bookId.value
  if (!id || !Array.isArray(books.value)) return null
  return books.value.find(book => Number(book.id) === id) || null
})

// safer numeric helpers for pricing
const toNumber = (v) => {
  const n = Number(v)
  return Number.isFinite(n) ? n : 0
}

const bookTotal = computed(() => {
  const book = selectedBook.value
  if (!book || !book.pricing) return 0
  const basePrice = toNumber(book.pricing.basePrice)
  const shipping = toNumber(book.pricing.shipping)
  const tax = toNumber(book.pricing.tax)
  const discount = toNumber(book.pricing.discount)
  return basePrice + shipping + tax - discount
})

const subtotal = computed(() => {
  const book = selectedBook.value
  if (!book || !book.pricing) return 0
  const qty = toNumber(book.quantity || 1)
  return toNumber(book.pricing.basePrice) * qty
})

const statusConfig = computed(() => {
  const book = selectedBook.value
  if (!book) return null
  return STATUS_CONFIG[book.status] || null
})

const statusOptions = computed(() => {
  return Object.values(BOOK_STATUS).map(status => ({
    value: status,
    label: (STATUS_CONFIG[status] && STATUS_CONFIG[status].label) ? STATUS_CONFIG[status].label : status,
    disabled: false
  }))
})

const formattedBookDate = computed(() => {
  const book = selectedBook.value
  const dateStr = book?.dates?.created
  if (!dateStr) return ''
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return ''
  }
})

const stockStatusText = computed(() => {
  const book = selectedBook.value
  if (!book) return ''
  const stock = toNumber(book.stock)
  if (stock > 100) return 'In Stock'
  if (stock > 20) return 'Limited Stock'
  if (stock > 0) return `Only ${stock} copies remaining!`
  return 'Out of Stock'
})

const stockStatusColor = computed(() => {
  const book = selectedBook.value
  if (!book) return 'text-gray-600'
  const stock = toNumber(book.stock)
  if (stock > 100) return 'text-green-600'
  if (stock > 20) return 'text-yellow-600'
  if (stock > 0) return 'text-red-600'
  return 'text-red-800'
})

// renderStars: returns counts (safe for missing rating)
const renderStars = (rating) => {
  const r = Number.isFinite(Number(rating)) ? Number(rating) : 0
  const fullStars = Math.floor(r)
  const hasHalfStar = (r - fullStars) >= 0.5
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)
  return {
    full: fullStars,
    half: hasHalfStar,
    empty: emptyStars
  }
}

// Actions
const updateBookStatus = async (newStatus) => {
  const book = selectedBook.value
  if (!book || isUpdating.value) return

  try {
    isUpdating.value = true
    error.value = null

    // simulate API
    await new Promise(resolve => setTimeout(resolve, 1000))

    const oldStatus = book.status
    // mutate the actual store object (Pinia reactive object assumed)
    book.status = newStatus

    const now = new Date().toISOString()
    book.dates = book.dates || {}
    if (newStatus === BOOK_STATUS.SHIPPED && !book.dates.shipped) {
      book.dates.shipped = now
    }
    if (newStatus === BOOK_STATUS.PUBLISHED && !book.dates.published) {
      book.dates.published = now
    }
    book.dates.updated = now

    showSuccessMessage.value = true
    setTimeout(() => (showSuccessMessage.value = false), 3000)

    emit('statusChanged', { bookId: book.id, oldStatus, newStatus })
    emit('bookUpdated', book)
  } catch (err) {
    error.value = 'There was an error updating the book status. Please try again.'
    console.error('Error updating book status:', err)
  } finally {
    isUpdating.value = false
  }
}

const goBack = () => router.go(-1)
const printBook = () => window.print()
const downloadInvoice = () => {
  console.log('Downloading invoice for book:', bookId.value)
  // implement real download here
}
const getCurrentDate = () => new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

// loadBook: centralise loading logic (can be extended to call API)
const loadBook = async () => {
  try {
    isLoading.value = true
    error.value = null

    // simulate API latency
    await new Promise(resolve => setTimeout(resolve, 500))

    if (!selectedBook.value) {
      error.value = 'Book not found'
    }
  } catch (err) {
    error.value = 'Error loading book data'
    console.error('Error loading book:', err)
  } finally {
    isLoading.value = false
  }
}

// lifecycle
onMounted(() => {
  loadBook()
})

// watch bookId (props or route change)
watch(() => bookId.value, (newId, oldId) => {
  if (newId !== oldId) loadBook()
})
</script>


<template>
  <div class="min-h-screen bg-gray-100 font-sans text-gray-800">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center min-h-screen">
      <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-600"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex justify-center items-center min-h-screen">
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
        <strong class="font-bold">Error!</strong>
        <span class="block sm:inline"> {{ error }}</span>
        <button @click="goBack" class="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
          Go Back
        </button>
      </div>
    </div>

    <!-- Success Message -->
    <div v-if="showSuccessMessage" class="fixed top-4 right-4 z-50 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
      <strong class="font-bold">Success!</strong>
      <span class="block sm:inline"> Book status updated successfully.</span>
    </div>

    <!-- Main Content -->
    <template v-else-if="selectedBook">
      <header class="bg-white shadow-sm py-6 px-4 sm:px-8 lg:px-24">
        <div class="flex flex-col sm:flex-row justify-between items-center">
          <div class="mb-4 sm:mb-0 text-center sm:text-left">
            <h1 class="font-bold text-3xl md:text-4xl text-gray-900">
              Book Details #{{ selectedBook.id }}
            </h1>
            <p class="text-sm text-gray-500 mt-1">{{ getCurrentDate() }}</p>
          </div>
          <div class="flex space-x-3">
            <button
              @click="printBook"
              class="px-5 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 transition ease-in-out duration-150"
            >
              Print
            </button>
            <button
              @click="downloadInvoice"
              class="px-5 py-2 border border-yellow-600 text-yellow-700 rounded-lg hover:bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 transition ease-in-out duration-150"
            >
              Download
            </button>
            <button
              @click="goBack"
              class="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition ease-in-out duration-150"
            >
              Back
            </button>
          </div>
        </div>
      </header>

      <main class="container mx-auto px-4 sm:px-8 lg:px-24 py-8">
        <!-- Book Details Card -->
        <div class="bg-white rounded-lg shadow-md p-6 md:p-8 lg:flex lg:space-x-8">
          <div class="flex-shrink-0 mb-6 lg:mb-0 lg:w-1/3 flex justify-center items-center">
            <img
              class="w-full max-w-xs rounded-lg shadow-lg"
              :src="selectedBook.cover"
              :alt="`${selectedBook.title} Book Cover`"
              loading="lazy"
            />
          </div>

          <div class="flex-grow">
            <h2 class="font-bold text-3xl text-gray-900 mb-2">{{ selectedBook.title }}</h2>
            <div class="w-24 h-1 bg-yellow-500 mb-4 rounded-full"></div>

            <div class="space-y-2 mb-6">
              <p class="text-lg text-gray-700"><strong>Author:</strong> {{ selectedBook.author }}</p>
              <p class="text-lg text-gray-700"><strong>Pages:</strong> {{ selectedBook.pages }}</p>
              <p class="text-lg text-gray-700"><strong>Publisher Date:</strong> {{ selectedBook.publisherDate }}</p>
              <p class="text-lg text-gray-700"><strong>Publishing House:</strong> {{ selectedBook.publishingHouse }}</p>
              <p class="text-lg text-gray-700"><strong>Category:</strong> {{ selectedBook.category }}</p>
              <p class="text-lg text-gray-700"><strong>Language:</strong> {{ selectedBook.language }}</p>

              <!-- Status Badge -->
              <div class="flex items-center">
                <strong class="text-lg text-gray-700 mr-2">Status:</strong>
                <span
                  v-if="statusConfig"
                  :class="statusConfig.color"
                  class="px-2 py-1 rounded-full text-sm font-medium flex items-center"
                >
                  <component :is="statusConfig.icon" class="w-4 h-4 mr-1" />
                  {{ statusConfig.label }}
                </span>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-wrap gap-3 mt-6">
              <button class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition ease-in-out duration-150">
                Edit
              </button>
              <button class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition ease-in-out duration-150">
                Delete
              </button>
              <button class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition ease-in-out duration-150">
                Add Offer/Discount
              </button>
              <button class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition ease-in-out duration-150">
                {{ selectedBook.status === 'published' ? 'Unpublish' : 'Publish' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Description Section -->
        <section class="bg-white rounded-lg shadow-md p-6 md:p-8 mt-8">
          <h3 class="font-bold text-2xl text-gray-900 mb-4">Description</h3>
          <p class="text-gray-700 leading-relaxed">
            {{ selectedBook.description }}
          </p>
        </section>

        <!-- Availability & Pricing Section -->
        <section class="bg-white rounded-lg shadow-md p-6 md:p-8 mt-8">
          <h3 class="font-bold text-2xl text-gray-900 mb-4">Availability & Pricing</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p class="text-lg text-gray-700 mb-2">
                <strong>Price:</strong>
                <span class="text-green-600 font-semibold text-xl">{{ selectedBook.price }}</span>
              </p>
              <p class="text-lg text-gray-700 mb-4">
                <strong>Stock Status:</strong>
                <span :class="stockStatusColor" class="font-semibold">{{ stockStatusText }}</span>
              </p>
              <div class="flex gap-3">
                <button class="px-6 py-3 bg-yellow-600 text-white rounded-lg text-lg hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 transition ease-in-out duration-150">
                  Pre-book Now
                </button>
              </div>
            </div>
            <div>
              <p class="text-lg text-gray-700 mb-2">
                <strong>Stock Available:</strong>
                <span class="font-semibold">{{ selectedBook.stock }} copies</span>
              </p>
              <div class="flex items-center text-lg text-gray-700 mb-2">
                <strong>Rating:</strong>
                <span class="ml-2 flex text-yellow-400">
                  <!-- Full stars -->
                  <svg
                    v-for="n in renderStars(selectedBook.rating).full"
                    :key="`full-${n}`"
                    class="w-5 h-5 fill-current"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.5 8.271L12 18.896l-7.436 3.908 1.5-8.271-6.064-5.828 8.332-1.151z"/>
                  </svg>

                  <!-- Half star -->
                  <svg
                    v-if="renderStars(selectedBook.rating).half"
                    class="w-5 h-5 fill-current"
                    viewBox="0 0 24 24"
                  >
                    <defs>
                      <linearGradient id="half">
                        <stop offset="50%" stop-color="currentColor"/>
                        <stop offset="50%" stop-color="#d1d5db"/>
                      </linearGradient>
                    </defs>
                    <path fill="url(#half)" d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.5 8.271L12 18.896l-7.436 3.908 1.5-8.271-6.064-5.828 8.332-1.151z"/>
                  </svg>

                  <!-- Empty stars -->
                  <svg
                    v-for="n in renderStars(selectedBook.rating).empty"
                    :key="`empty-${n}`"
                    class="w-5 h-5 fill-current text-gray-300"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.5 8.271L12 18.896l-7.436 3.908 1.5-8.271-6.064-5.828 8.332-1.151z"/>
                  </svg>
                </span>
                <span class="ml-2">({{ selectedBook.rating }} out of 5)</span>
              </div>
              <p class="text-sm text-gray-500">Based on customer reviews</p>
            </div>
          </div>
        </section>

        <!-- Status Update Section -->
        <section v-if="statusOptions.length > 0" class="bg-white rounded-lg shadow-md p-6 md:p-8 mt-8">
          <h3 class="font-bold text-2xl text-gray-900 mb-4">Update Status</h3>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="option in statusOptions"
              :key="option.value"
              @click="updateBookStatus(option.value)"
              :disabled="isUpdating || option.disabled || selectedBook.status === option.value"
              :class="[
                'px-4 py-2 rounded-md font-medium transition-colors duration-150',
                selectedBook.status === option.value
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500'
              ]"
            >
              {{ option.label }}
            </button>
          </div>
        </section>
      </main>
    </template>
  </div>
</template>

<style scoped>
/* Custom animations */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Ensure proper responsive behavior */
@media (max-width: 640px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
</style>
