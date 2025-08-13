<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { CheckCircleIcon, ClockIcon, XCircleIcon, TruckIcon } from '@heroicons/vue/24/outline'
import { useBooksStore } from '@/stores/Books'

// --- Constants ---
const BOOK_STATUS = {
  PUBLISHED: 'published',
  PENDING: 'pending',
  DRAFT: 'draft',
  PROCESSING: 'processing',
  SHIPPED: 'shipped'
}

const STATUS_CONFIG = {
  [BOOK_STATUS.PUBLISHED]: { color: 'text-green-700 bg-green-100', icon: CheckCircleIcon, label: 'Published' },
  [BOOK_STATUS.PENDING]: { color: 'text-[var(--color-primary)] bg-yellow-100', icon: ClockIcon, label: 'Pending' },
  [BOOK_STATUS.DRAFT]: { color: 'text-red-700 bg-red-100', icon: XCircleIcon, label: 'Draft' },
  [BOOK_STATUS.PROCESSING]: { color: 'text-blue-700 bg-blue-100', icon: TruckIcon, label: 'Processing' },
  [BOOK_STATUS.SHIPPED]: { color: 'text-purple-700 bg-purple-100', icon: TruckIcon, label: 'Shipped' }
}

// --- Props and Emits ---
const props = defineProps({
  bookId: {
    type: [String, Number],
    required: false
  }
})
const emit = defineEmits(['bookUpdated', 'statusChanged', 'bookDeleted'])

// --- Composables ---
const route = useRoute()
const router = useRouter()

// --- State ---
const isLoading = ref(true)
const isUpdating = ref(false)
const isSaving = ref(false)
const error = ref(null)
const showSuccessMessage = ref(false)
const successMessage = ref('')

// --- Store ---
const booksStore = useBooksStore()
const books = computed(() => booksStore.books)

// --- Popups State ---
const isPop = ref(false)
const isDeleteConfirmOpen = ref(false)
const isOfferPopupOpen = ref(false)

// --- Form Data ---
const editForm = ref({})
const offerForm = ref({})

// --- Computed Properties ---

// **FIXED**: Simplified and more robust ID handling.
const bookId = computed(() => {
  const id = props.bookId || route.params.id;
  return id ? Number(id) : null;
})

const selectedBook = computed(() => {
  const id = bookId.value
  if (!id || !Array.isArray(books.value)) return null
  return books.value.find(book => Number(book.id) === id) || null
})

const statusConfig = computed(() => {
  const book = selectedBook.value
  return book ? STATUS_CONFIG[book.status] || null : null
})

const statusOptions = computed(() => Object.values(BOOK_STATUS).map(status => ({
  value: status,
  label: STATUS_CONFIG[status]?.label || status,
  disabled: false
})))

const stockStatusText = computed(() => {
  const stock = Number(selectedBook.value?.stock || 0)
  if (stock > 100) return 'In Stock'
  if (stock > 20) return 'Limited Stock'
  if (stock > 0) return `Only ${stock} copies remaining!`
  return 'Out of Stock'
})

const stockStatusColor = computed(() => {
  const stock = Number(selectedBook.value?.stock || 0)
  if (stock > 100) return 'text-green-600'
  if (stock > 20) return 'text-[var(--color-primary)]'
  if (stock > 0) return 'text-red-600'
  return 'text-red-800'
})

// --- Helper Functions ---

const showSuccess = (message) => {
  successMessage.value = message
  showSuccessMessage.value = true
  setTimeout(() => (showSuccessMessage.value = false), 3000)
}

// **FIXED**: Robust price parsing from string (e.g., "$19.99").
const parsePrice = (price) => {
  if (typeof price === 'number') return price
  if (typeof price !== 'string') return 0
  const num = parseFloat(price.replace(/[^0-9.-]+/g, ""))
  return Number.isFinite(num) ? num : 0
}

const renderStars = (rating) => {
  const r = Number.isFinite(Number(rating)) ? Number(rating) : 0
  const fullStars = Math.floor(r)
  const hasHalfStar = (r - fullStars) >= 0.5
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)
  return { full: fullStars, half: hasHalfStar, empty: emptyStars }
}

// --- Core Logic Functions ---

// **FIXED**: Centralized and corrected discount calculation logic.
const updateDiscountedPrice = () => {
  const book = selectedBook.value
  if (!book) return

  const originalPrice = parsePrice(book.price)
  const activeOffers = book.offers?.filter(offer => offer.active) || []

  if (activeOffers.length === 0 || originalPrice === 0) {
    delete book.discountedPrice
    return
  }

  // Find the largest discount amount from all active offers
  const bestDiscount = activeOffers.reduce((maxDiscount, offer) => {
    const offerValue = Number(offer.value) || 0
    const currentDiscount = offer.type === 'percentage'
      ? (originalPrice * offerValue) / 100
      : offerValue
    return Math.max(maxDiscount, currentDiscount)
  }, 0)

  if (bestDiscount > 0) {
    const finalPrice = Math.max(0, originalPrice - bestDiscount)
    book.discountedPrice = `$${finalPrice.toFixed(2)}`
  } else {
    delete book.discountedPrice
  }
}

const loadBook = async () => {
  isLoading.value = true
  error.value = null
  try {
    await new Promise(resolve => setTimeout(resolve, 500)) // simulate API
    if (!selectedBook.value) {
      error.value = 'Book not found'
    } else {
      updateDiscountedPrice() // Initial calculation
    }
  } catch (err) {
    error.value = 'Error loading book data'
    console.error('Error loading book:', err)
  } finally {
    isLoading.value = false
  }
}

// --- Action Handlers ---

const updateBookStatus = async (newStatus) => {
  const book = selectedBook.value
  if (!book || isUpdating.value) return

  isUpdating.value = true
  error.value = null
  try {
    await new Promise(resolve => setTimeout(resolve, 1000)) // simulate API
    const oldStatus = book.status
    book.status = newStatus
    book.dates = { ...book.dates, updated: new Date().toISOString() }

    showSuccess('Book status updated successfully!')
    emit('statusChanged', { bookId: book.id, oldStatus, newStatus })
    emit('bookUpdated', book)
  } catch (err) {
    error.value = 'Error updating status. Please try again.'
    console.error('Error updating book status:', err)
  } finally {
    isUpdating.value = false
  }
}

// --- Edit Book ---
const openEditPopup = () => {
  const book = selectedBook.value
  if (!book) return
  editForm.value = {
    title: book.title || '',
    description: book.description || '',
    author: book.author || '',
    pages: book.pages || '',
    stock: book.stock || '',
    price: book.price || '',
    category: book.category || '',
    language: book.language || '',
    publishingHouse: book.publishingHouse || '',
    publisherDate: book.publisherDate || ''
  }
  isPop.value = true
}

const closeEditPopup = () => { isPop.value = false }

const saveBookChanges = async () => {
  const book = selectedBook.value
  if (!book || isSaving.value) return

  isSaving.value = true
  error.value = null
  try {
    await new Promise(resolve => setTimeout(resolve, 1500)) // simulate API
    Object.assign(book, editForm.value)
    book.dates = { ...book.dates, updated: new Date().toISOString() }

    // **FIXED**: Recalculate discount if base price changed.
    updateDiscountedPrice()

    closeEditPopup()
    showSuccess('Book details updated successfully!')
    emit('bookUpdated', book)
  } catch (err) {
    error.value = 'Error updating book details. Please try again.'
    console.error('Error updating book:', err)
  } finally {
    isSaving.value = false
  }
}

// --- Delete Book ---
const openDeleteConfirm = () => { isDeleteConfirmOpen.value = true }
const closeDeleteConfirm = () => { isDeleteConfirmOpen.value = false }

const deleteBook = async () => {
  const book = selectedBook.value
  if (!book || isUpdating.value) return

  isUpdating.value = true
  error.value = null
  try {
    await new Promise(resolve => setTimeout(resolve, 1000)) // simulate API
    booksStore.deleteBook(book.id) // Assuming a store action

    closeDeleteConfirm()
    showSuccess('Book deleted successfully!')
    emit('bookDeleted', book.id)

    setTimeout(() => router.push('/books'), 1000)
  } catch (err) {
    error.value = 'Error deleting book. Please try again.'
    console.error('Error deleting book:', err)
  } finally {
    isUpdating.value = false
  }
}

// --- Offer/Discount ---
const openOfferPopup = () => {
  offerForm.value = {
    discountType: 'percentage',
    discountValue: 0,
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    description: ''
  }
  isOfferPopupOpen.value = true
}

const closeOfferPopup = () => { isOfferPopupOpen.value = false }

const addOffer = async () => {
  const book = selectedBook.value
  if (!book || isSaving.value) return

  isSaving.value = true
  error.value = null
  try {
    if (!offerForm.value.discountValue || offerForm.value.discountValue <= 0) {
      throw new Error('Please enter a valid discount value')
    }
    await new Promise(resolve => setTimeout(resolve, 1000)) // simulate API

    const newOffer = { id: Date.now(), ...offerForm.value, active: true, createdAt: new Date().toISOString() }
    book.offers = [...(book.offers || []), newOffer]
    book.dates = { ...book.dates, updated: new Date().toISOString() }

    // **FIXED**: Use centralized function to apply the best discount.
    updateDiscountedPrice()

    closeOfferPopup()
    showSuccess('Offer added successfully!')
    emit('bookUpdated', book)
  } catch (err) {
    error.value = err.message || 'Error adding offer. Please try again.'
    console.error('Error adding offer:', err)
  } finally {
    isSaving.value = false
  }
}

// --- Offer Management ---
const toggleOfferStatus = async (offerToUpdate) => {
  const book = selectedBook.value
  if (!book || isUpdating.value) return

  isUpdating.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 500)) // simulate API
    offerToUpdate.active = !offerToUpdate.active
    book.dates = { ...book.dates, updated: new Date().toISOString() }
    updateDiscountedPrice()
    showSuccess(`Offer ${offerToUpdate.active ? 'activated' : 'deactivated'}!`)
    emit('bookUpdated', book)
  } catch (err) {
    error.value = 'Error updating offer status.'
  } finally {
    isUpdating.value = false
  }
}

const removeOffer = async (offerId) => {
  const book = selectedBook.value
  if (!book || isUpdating.value) return

  isUpdating.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 500)) // simulate API
    book.offers = book.offers.filter(offer => offer.id !== offerId)
    book.dates = { ...book.dates, updated: new Date().toISOString() }
    updateDiscountedPrice()
    showSuccess('Offer removed successfully!')
    emit('bookUpdated', book)
  } catch (err) {
    error.value = 'Error removing offer.'
  } finally {
    isUpdating.value = false
  }
}

const togglePublishStatus = async () => {
  const book = selectedBook.value
  if (!book) return
  const newStatus = book.status === BOOK_STATUS.PUBLISHED ? BOOK_STATUS.DRAFT : BOOK_STATUS.PUBLISHED
  await updateBookStatus(newStatus)
}

// --- Misc Actions ---
const goBack = () => router.go(-1)
const printBook = () => window.print()
const downloadInvoice = () => console.log('Downloading invoice for book:', bookId.value)
const getCurrentDate = () => new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

// --- Lifecycle & Watchers ---
onMounted(() => {
  loadBook()
})

watch(bookId, (newId, oldId) => {
  if (newId !== oldId) loadBook()
})
</script>

<template>
  <div class="min-h-screen bg-gray-100 font-sans text-gray-800">
    <div v-if="isLoading" class="flex justify-center items-center min-h-screen">
      <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-[var(--color-primary)]"></div>
    </div>

    <div v-else-if="error" class="flex justify-center items-center min-h-screen">
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md text-center">
        <strong class="font-bold">Error!</strong>
        <span class="block sm:inline"> {{ error }}</span>
        <button @click="loadBook" class="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
          Try Again
        </button>
      </div>
    </div>

    <div v-if="showSuccessMessage" class="fixed top-4 right-4 z-50 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
      <strong class="font-bold">Success!</strong>
      <span class="block sm:inline"> {{ successMessage }}</span>
    </div>

    <div v-if="isPop" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-900">Edit Book Details</h2>
          <button @click="closeEditPopup" class="text-gray-500 hover:text-gray-700">&times;</button>
        </div>
        <form @submit.prevent="saveBookChanges" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input v-model="editForm.title" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Book Title">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Author</label>
              <input v-model="editForm.author" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Author Name">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Pages</label>
              <input v-model="editForm.pages" type="number" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Number of Pages">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Stock</label>
              <input v-model="editForm.stock" type="number" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Stock Quantity">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Price</label>
              <input v-model="editForm.price" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="$0.00">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input v-model="editForm.category" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Book Category">
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea v-model="editForm.description" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Book Description"></textarea>
          </div>
          <div class="flex justify-end space-x-3 pt-4">
            <button type="button" @click="closeEditPopup" class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">Cancel</button>
            <button type="submit" :disabled="isSaving" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
              {{ isSaving ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="isDeleteConfirmOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Confirm Delete</h3>
        <p class="text-gray-700 mb-6">Are you sure you want to delete "{{ selectedBook?.title }}"? This action cannot be undone.</p>
        <div class="flex justify-end space-x-3">
          <button @click="closeDeleteConfirm" class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">Cancel</button>
          <button @click="deleteBook" :disabled="isUpdating" class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50">
            {{ isUpdating ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="isOfferPopupOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-900">Add Offer/Discount</h2>
          <button @click="closeOfferPopup" class="text-gray-500 hover:text-gray-700">&times;</button>
        </div>
        <form @submit.prevent="addOffer" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
            <select v-model="offerForm.discountType" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount ($)</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Discount Value {{ offerForm.discountType === 'percentage' ? '(%)' : '($)' }}</label>
            <input v-model.number="offerForm.discountValue" type="number" :min="0" :max="offerForm.discountType === 'percentage' ? 100 : 9999" step="0.01" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input v-model="offerForm.startDate" type="date" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">End Date (Optional)</label>
              <input v-model="offerForm.endDate" type="date" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
            <textarea v-model="offerForm.description" rows="2" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
          </div>
          <div class="flex justify-end space-x-3 pt-4">
            <button type="button" @click="closeOfferPopup" class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">Cancel</button>
            <button type="submit" :disabled="isSaving" class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50">
              {{ isSaving ? 'Adding...' : 'Add Offer' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <template v-else-if="selectedBook">
      <header class="bg-white shadow-sm py-6 px-4 sm:px-8 lg:px-24">
        <div class="flex flex-col sm:flex-row justify-between items-center">
            <div class="mb-4 sm:mb-0 text-center sm:text-left">
              <h1 class="font-bold text-3xl md:text-4xl text-gray-900">Book Details #{{ selectedBook.id }}</h1>
              <p class="text-sm text-gray-500 mt-1">{{ getCurrentDate() }}</p>
            </div>
            <div class="flex space-x-3">
              <button @click="printBook" class="px-5 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary)] transition-colors">Print</button>
              <button @click="goBack" class="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">Back</button>
            </div>
          </div>
      </header>
      <main class="container mx-auto px-4 sm:px-8 lg:px-24 py-8">
        <div class="bg-white rounded-lg shadow-md p-6 md:p-8 lg:flex lg:space-x-8">
          <div class="flex-shrink-0 mb-6 lg:mb-0 lg:w-1/3 flex justify-center">
            <img class="w-full max-w-xs rounded-lg shadow-lg object-cover" :src="selectedBook.cover" :alt="`${selectedBook.title} Cover`" loading="lazy" />
          </div>
          <div class="flex-grow">
            <h2 class="font-bold text-3xl text-gray-900 mb-2">{{ selectedBook.title }}</h2>
            <div class="w-24 h-1 bg-[var(--color-light)] mb-4 rounded-full"></div>
            <div class="space-y-2 mb-6 text-gray-700">
                <p><strong>Author:</strong> {{ selectedBook.author }}</p>
                </div>
            <div class="flex items-center">
              <strong class="text-lg text-gray-700 mr-2">Status:</strong>
              <span v-if="statusConfig" :class="statusConfig.color" class="px-2 py-1 rounded-full text-sm font-medium flex items-center">
                <component :is="statusConfig.icon" class="w-4 h-4 mr-1" />
                {{ statusConfig.label }}
              </span>
            </div>
            <div class="flex flex-wrap gap-3 mt-6">
                <button @click="openEditPopup" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">Edit</button>
                <button @click="openDeleteConfirm" class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">Delete</button>
                <button @click="openOfferPopup" class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">Add Offer</button>
                <button @click="togglePublishStatus" :disabled="isUpdating" class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 transition-colors">
                  {{ isUpdating ? '...' : (selectedBook.status === 'published' ? 'Unpublish' : 'Publish') }}
                </button>
            </div>
          </div>
        </div>

        <section class="bg-white rounded-lg shadow-md p-6 md:p-8 mt-8">
            <h3 class="font-bold text-2xl text-gray-900 mb-4">Availability & Pricing</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div class="flex items-center space-x-2 mb-2">
                  <p class="text-lg text-gray-700"><strong>Price:</strong></p>
                  <span v-if="selectedBook.discountedPrice" class="text-gray-500 line-through">{{ selectedBook.price }}</span>
                  <span :class="selectedBook.discountedPrice ? 'text-red-600 font-bold text-xl' : 'text-green-600 font-semibold text-xl'">
                    {{ selectedBook.discountedPrice || selectedBook.price }}
                  </span>
                </div>
                <p class="text-lg text-gray-700 mb-4"><strong>Stock Status:</strong> <span :class="stockStatusColor" class="font-semibold">{{ stockStatusText }}</span></p>
              </div>
              <div>
                <div class="flex items-center text-lg text-gray-700 mb-2">
                    <strong>Rating:</strong>
                    <span class="ml-2 flex text-yellow-400">
                      </span>
                    <span class="ml-2">({{ selectedBook.rating }} out of 5)</span>
                </div>
              </div>
            </div>
        </section>

        <section v-if="selectedBook.offers && selectedBook.offers.length > 0" class="bg-white rounded-lg shadow-md p-6 md:p-8 mt-8">
            <h3 class="font-bold text-2xl text-gray-900 mb-4">Manage Offers</h3>
            <div class="space-y-4">
              <div v-for="offer in selectedBook.offers" :key="offer.id" class="border border-gray-200 rounded-lg p-4" :class="offer.active ? 'bg-green-50 border-green-200' : 'bg-gray-50'">
                  <div class="flex justify-between items-start">
                    <div>
                      <h4 class="font-semibold text-lg">{{ offer.type === 'percentage' ? `${offer.value}% Discount` : `${offer.value} Off` }}</h4>
                      <p class="text-sm text-gray-500">Valid: {{ new Date(offer.startDate).toLocaleDateString() }} <span v-if="offer.endDate"> - {{ new Date(offer.endDate).toLocaleDateString() }}</span></p>
                    </div>
                    <div class="flex space-x-2 ml-4">
                      <button @click="toggleOfferStatus(offer)" :class="offer.active ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'" class="px-3 py-1 rounded text-sm font-medium transition-colors">
                          {{ offer.active ? 'Deactivate' : 'Activate' }}
                      </button>
                      <button @click="removeOffer(offer.id)" class="px-3 py-1 bg-red-100 text-red-700 rounded text-sm font-medium hover:bg-red-200 transition-colors">
                          Remove
                      </button>
                    </div>
                  </div>
              </div>
            </div>
        </section>

      </main>
    </template>
  </div>
</template>

<style scoped>
/* Modal backdrop blur effect */
.fixed.inset-0 {
  backdrop-filter: blur(4px);
}
/* Other styles from the original code remain the same */
</style>
