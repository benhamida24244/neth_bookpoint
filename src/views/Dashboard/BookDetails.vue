<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { CheckCircleIcon, ClockIcon, XCircleIcon, TruckIcon } from '@heroicons/vue/24/outline'
import { useBooksStore } from '@/stores/Books'
import { useI18n } from 'vue-i18n'
import LoaderWithText from '@/components/LoaderWithText.vue'

const { t } = useI18n()

// --- Constants ---
const BOOK_STATUS = {
  PUBLISHED: 1,
  DRAFT: 0,
}

const STATUS_CONFIG = {
  [BOOK_STATUS.PUBLISHED]: {
    color: 'text-green-700 bg-green-100',
    icon: CheckCircleIcon,
    label: 'Published',
  },
  [BOOK_STATUS.DRAFT]: { color: 'text-red-700 bg-red-100', icon: XCircleIcon, label: 'Draft' },
}

// --- Props & Emits ---
const props = defineProps({
  bookIdProp: { type: [String, Number], required: false },
})
const emit = defineEmits(['bookUpdated', 'statusChanged', 'bookDeleted'])

// --- Composables ---
const route = useRoute()
const router = useRouter()
const booksStore = useBooksStore()

// --- State ---
const isUpdating = ref(false)
const isSaving = ref(false)
const showSuccessMessage = ref(false)
const successMessage = ref('')

// --- Popups State ---
const isPop = ref(false)
const isDeleteConfirmOpen = ref(false)
const isOfferPopupOpen = ref(false)

// --- Form Data ---
const editForm = ref({})
const offerForm = ref({})

// --- Computed ---
const bookId = computed(() => Number(props.bookIdProp || route.params.id))
const selectedBook = computed(() => booksStore.book)
const isLoading = computed(() => booksStore.isLoading)
const error = computed(() => booksStore.error)

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
const bookCoverUrl = computed(() => {
  if (!selectedBook.value || !selectedBook.value.cover)
    return 'data:image/svg+xml;charset=UTF-8,%3csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="%23a0aec0"%3e%3cpath d="M16 2 L16 30 M2 16 L30 16"/%3e%3c/svg%3e'
  return selectedBook.value.cover.startsWith('/storage')
    ? `${apiBaseUrl}${selectedBook.value.cover}`
    : selectedBook.value.cover
})

const statusConfig = computed(() => {
  const book = selectedBook.value
  if (!book || book.status === null || book.status === undefined) return null
  // The API might return a string, so we parse it to be safe
  const statusKey = parseInt(book.status, 10)
  return STATUS_CONFIG[statusKey] || null
})

const stockStatusText = computed(() => {
  if (!selectedBook.value) return ''
  const stock = Number(selectedBook.value.stock || 0)
  if (stock > 100) return t('dashboard.bookDetails.inStock')
  if (stock > 20) return t('dashboard.bookDetails.limitedStock')
  if (stock > 0) return t('dashboard.bookDetails.onlyRemaining', { stock: stock })
  return t('dashboard.bookDetails.outOfStock')
})

const stockStatusColor = computed(() => {
  if (!selectedBook.value) return ''
  const stock = Number(selectedBook.value.stock || 0)
  if (stock > 100) return 'text-green-600'
  if (stock > 20) return 'text-yellow-600'
  if (stock > 0) return 'text-red-600'
  return 'text-gray-500'
})

// --- Helper Functions ---
const showSuccess = (message) => {
  successMessage.value = message
  showSuccessMessage.value = true
  setTimeout(() => (showSuccessMessage.value = false), 3000)
}

// --- Core Logic ---
const loadBook = async () => {
  if (bookId.value) {
    await booksStore.fetchBook(bookId.value)
    if (selectedBook.value && !selectedBook.value.offers) {
      selectedBook.value.offers = []
    }
  }
}

// --- Action Handlers ---
const updateBookStatus = async (newStatus) => {
  if (!selectedBook.value || isUpdating.value) return
  isUpdating.value = true
  try {
    const success = await booksStore.updateBook(selectedBook.value.id, { status: newStatus })
    if (success) {
      showSuccess(t('dashboard.bookDetails.success'))
      emit('statusChanged', { bookId: selectedBook.value.id, newStatus })
    } else {
      throw new Error('Failed to update status')
    }
  } catch (err) {
    console.error('Error updating book status:', err)
    alert('Error updating status. Please try again.')
  } finally {
    isUpdating.value = false
  }
}

// --- Edit Book ---
const openEditPopup = () => {
  if (!selectedBook.value) return
  const book = selectedBook.value
  editForm.value = {
    title: book.title || '',
    description: book.description || '',
    author: book.author ? book.author.name : '',
    pages: book.pages || '',
    stock: book.stock || '',
    price: book.price || '',
    category: book.category ? book.category.name : '',
    coverPreview: bookCoverUrl.value,
  }
  isPop.value = true
}

const closeEditPopup = () => {
  isPop.value = false
}

const saveBookChanges = async () => {
  if (!selectedBook.value || isSaving.value) return
  isSaving.value = true
  try {
    const formData = new FormData()
    for (const key in editForm.value) {
      if (key === 'coverFile') {
        if (editForm.value.coverFile) {
          formData.append('cover', editForm.value.coverFile)
        }
      } else if (editForm.value[key] !== null) {
        formData.append(key, editForm.value[key])
      }
    }
    const success = await booksStore.updateBook(selectedBook.value.id, formData)
    if (success) {
      closeEditPopup()
      showSuccess(t('dashboard.bookDetails.success'))
      emit('bookUpdated', booksStore.book)
    } else throw new Error('Update failed')
  } catch (err) {
    console.error('Error updating book:', err)
    alert('Error updating book details. Please try again.')
  } finally {
    isSaving.value = false
  }
}

const handleCoverImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    editForm.value.coverFile = file
    const reader = new FileReader()
    reader.onload = (e) => {
      editForm.value.coverPreview = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

// --- Delete Book ---
const openDeleteConfirm = () => {
  isDeleteConfirmOpen.value = true
}
const closeDeleteConfirm = () => {
  isDeleteConfirmOpen.value = false
}

const deleteBook = async () => {
  if (!selectedBook.value || isUpdating.value) return
  isUpdating.value = true
  try {
    const success = await booksStore.deleteBook(selectedBook.value.id)
    if (success) {
      closeDeleteConfirm()
      showSuccess(t('dashboard.bookDetails.success'))
      emit('bookDeleted', selectedBook.value.id)
      router.push('/dashboard/books')
    } else throw new Error('Failed to delete book')
  } catch (err) {
    console.error('Error deleting book:', err)
    alert('Error deleting book. Please try again.')
  } finally {
    isUpdating.value = false
  }
}

// --- Offer / Discount ---
const openOfferPopup = () => {
  offerForm.value = {
    discountType: 'percentage',
    discountValue: 0,
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    description: '',
  }
  isOfferPopupOpen.value = true
}

const closeOfferPopup = () => {
  isOfferPopupOpen.value = false
}

const addOffer = async () => {
  if (!selectedBook.value) return
  const newOffer = { id: Date.now(), ...offerForm.value, active: true }
  selectedBook.value.offers.push(newOffer)
  closeOfferPopup()
  showSuccess(t('dashboard.bookDetails.success'))
}

const togglePublishStatus = async () => {
  if (!selectedBook.value || isUpdating.value) return
  // Toggle between Published (1) and Draft (3)
  const newStatus =
    parseInt(selectedBook.value.status, 10) === BOOK_STATUS.PUBLISHED
      ? BOOK_STATUS.DRAFT
      : BOOK_STATUS.PUBLISHED
  console.log('Toggling status to:', newStatus)
  await updateBookStatus(newStatus)
}

const toggleOfferStatus = (offer) => {
  offer.active = !offer.active
  showSuccess(
    `Offer ${offer.active ? t('dashboard.bookDetails.activate') : t('dashboard.bookDetails.deactivate')} successfully!`
  )
}

const removeOffer = (offerId) => {
  if (!selectedBook.value) return
  selectedBook.value.offers = selectedBook.value.offers.filter((o) => o.id !== offerId)
  showSuccess(t('dashboard.bookDetails.success'))
}

// --- Misc ---
const goBack = () => router.go(-1)
const printBook = () => window.print()
const getCurrentDate = () =>
  new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

// --- Lifecycle ---
onMounted(async () => {
  await loadBook()
})

watch(bookId, (newId, oldId) => {
  if (newId !== oldId) loadBook()
})
</script>

<template>
  <div class="min-h-screen bg-gray-100 font-sans text-gray-800">
    <div v-if="isLoading" class="flex justify-center items-center min-h-screen">
      <LoaderWithText :message="t('loading.book')" />
    </div>

    <div v-else-if="error" class="flex justify-center items-center min-h-screen">
      <div
        class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md text-center"
      >
        <strong class="font-bold">{{ t('dashboard.bookDetails.error') }}</strong>
        <span class="block sm:inline"> {{ error }}</span>
        <button
          @click="loadBook"
          class="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          {{ t('dashboard.bookDetails.tryAgain') }}
        </button>
      </div>
    </div>

    <div
      v-if="showSuccessMessage"
      class="fixed top-4 right-4 z-50 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded"
    >
      <strong class="font-bold">{{ t('dashboard.bookDetails.success') }}</strong>
      <span class="block sm:inline"> {{ successMessage }}</span>
    </div>

    <div
      v-if="isPop"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-900">{{ t('dashboard.bookDetails.editTitle') }}</h2>
          <button @click="closeEditPopup" class="text-gray-500 hover:text-gray-700">&times;</button>
        </div>
        <form @submit.prevent="saveBookChanges" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">{{
                t('dashboard.bookDetails.labels.title')
              }}</label>
              <input
                v-model="editForm.title"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                :placeholder="t('dashboard.bookDetails.bookTitle')"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">{{
                t('dashboard.bookDetails.labels.author')
              }}</label>
              <input
                v-model="editForm.author"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                :placeholder="t('dashboard.bookDetails.authorName')"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">{{
                t('dashboard.bookDetails.labels.pages')
              }}</label>
              <input
                v-model="editForm.pages"
                type="number"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                :placeholder="t('dashboard.bookDetails.pagesLabel')"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">{{
                t('dashboard.bookDetails.labels.stock')
              }}</label>
              <input
                v-model="editForm.stock"
                type="number"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                :placeholder="t('dashboard.bookDetails.stockLabel')"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">{{
                t('dashboard.bookDetails.labels.price')
              }}</label>
              <input
                v-model="editForm.price"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                :placeholder="t('dashboard.bookDetails.pricePlaceholder')"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">{{
                t('dashboard.bookDetails.labels.category')
              }}</label>
              <input
                v-model="editForm.category"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                :placeholder="t('dashboard.bookDetails.categoryPlaceholder')"
              />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{
              t('dashboard.bookDetails.labels.description')
            }}</label>
            <textarea
              v-model="editForm.description"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              :placeholder="t('dashboard.bookDetails.descriptionPlaceholder')"
            ></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{
              t('dashboard.bookDetails.labels.cover')
            }}</label>
            <input
              type="file"
              @change="handleCoverImageUpload"
              class="w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
            />
            <div v-if="editForm.coverPreview" class="mt-4">
              <img
                :src="editForm.coverPreview"
                :alt="t('dashboard.bookDetails.imagePreview')"
                class="h-32 w-32 object-cover rounded-md"
              />
            </div>
          </div>
          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="closeEditPopup"
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              {{ t('dashboard.bookDetails.cancel') }}
            </button>
            <button
              type="submit"
              :disabled="isSaving"
              class="px-4 py-2 bg-[var(--color-light)] text-white rounded-md hover:bg-[var(--color-primary)] disabled:opacity-50"
            >
              {{ isSaving ? t('dashboard.bookDetails.saving') : t('dashboard.bookDetails.save') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <div
      v-if="isDeleteConfirmOpen"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          {{ t('dashboard.bookDetails.deleteConfirmTitle') }}
        </h3>
        <p class="text-gray-700 mb-6">
          {{ t(`dashboard.bookDetails.deleteConfirm`).replace('title', selectedBook?.title) }}
        </p>
        <div class="flex justify-end space-x-3">
          <button
            @click="closeDeleteConfirm"
            class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            {{ t('dashboard.bookDetails.cancel') }}
          </button>
          <button
            @click="deleteBook"
            :disabled="isUpdating"
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
          >
            {{ isUpdating ? t('dashboard.bookDetails.deleting') : t('dashboard.bookDetails.delete') }}
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="isOfferPopupOpen"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-900">
            {{ t('dashboard.bookDetails.addOfferTitle') }}
          </h2>
          <button @click="closeOfferPopup" class="text-gray-500 hover:text-gray-700">&times;</button>
        </div>
        <form @submit.prevent="addOffer" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{
              t('dashboard.bookDetails.discountType')
            }}</label>
            <select
              v-model="offerForm.discountType"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="percentage">{{ t('dashboard.bookDetails.percentage') }}</option>
              <option value="fixed">{{ t('dashboard.bookDetails.fixed') }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >{{ t('dashboard.bookDetails.discountValue') }}
              {{ offerForm.discountType === 'percentage' ? '(%)' : '($)' }}</label
            >
            <input
              v-model.number="offerForm.discountValue"
              type="number"
              :min="0"
              :max="offerForm.discountType === 'percentage' ? 100 : 9999"
              step="0.01"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">{{
                t('dashboard.bookDetails.startDate')
              }}</label>
              <input
                v-model="offerForm.startDate"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">{{
                t('dashboard.bookDetails.endDate')
              }}</label>
              <input
                v-model="offerForm.endDate"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{
              t('dashboard.bookDetails.description')
            }}</label>
            <textarea
              v-model="offerForm.description"
              rows="2"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="closeOfferPopup"
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              {{ t('dashboard.bookDetails.cancel') }}
            </button>

            <button
              type="submit"
              :disabled="isSaving"
              class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {{ isSaving ? t('dashboard.bookDetails.adding') : t('dashboard.bookDetails.addOffer') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <template v-else-if="selectedBook">
      <header class="bg-white shadow-sm py-6 px-4 sm:px-8 lg:px-24">
        <div class="flex flex-col sm:flex-row justify-between items-center">
          <div class="mb-4 sm:mb-0 text-center sm:text-left">
            <h1 class="font-bold text-3xl md:text-4xl text-gray-900">
              {{ t('dashboard.bookDetails.bookDetailsTitle') }}{{ selectedBook.id }}
            </h1>
            <p class="text-sm text-gray-500 mt-1">{{ getCurrentDate() }}</p>
          </div>
          <div class="flex space-x-3">
            <button
              @click="printBook"
              class="px-5 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary)] transition-colors"
            >
              {{ t('dashboard.bookDetails.print') }}
            </button>
            <button
              @click="goBack"
              class="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {{ t('dashboard.bookDetails.back') }}
            </button>
          </div>
        </div>
      </header>
      <main class="container mx-auto px-4 sm:px-8 lg:px-24 py-8">
        <div class="bg-white rounded-lg shadow-md p-6 md:p-8 lg:flex lg:space-x-8">
          <div class="flex-shrink-0 mb-6 lg:mb-0 lg:w-1/3 flex justify-center">
            <img
              class="w-full max-w-xs rounded-lg shadow-lg object-cover"
              :src="bookCoverUrl"
              :alt="`${selectedBook.title} Cover`"
              loading="lazy"
            />
          </div>
          <div class="flex-grow">
            <h2 class="font-bold text-3xl text-gray-900 mb-2">{{ selectedBook.title }}</h2>
            <div class="w-24 h-1 bg-[var(--color-light)] mb-4 rounded-full"></div>
            <div class="space-y-2 mb-6 text-gray-700">
              <RouterLink :to="`/dashboard/authors/${selectedBook.author.id}`"
                ><strong>{{ t('dashboard.bookDetails.authorLabel') }}</strong>
                {{ selectedBook.author.name }}
              </RouterLink>
            </div>
            <div class="flex items-center">
              <strong class="text-lg text-gray-700 mr-2">{{
                t('dashboard.bookDetails.status')
              }}</strong>
              <span
                v-if="statusConfig"
                :class="statusConfig.color"
                class="px-2 py-1 rounded-full text-sm font-medium flex items-center"
              >
                <component :is="statusConfig.icon" class="w-4 h-4 mr-1" />
                {{ statusConfig.label }}
              </span>
            </div>
            <div class="flex flex-wrap gap-3 mt-6">
              <button
                @click="openEditPopup"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {{ t('dashboard.bookDetails.edit') }}
              </button>
              <button
                @click="openDeleteConfirm"
                class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                {{ t('dashboard.bookDetails.delete') }}
              </button>
              <button
                @click="openOfferPopup"
                class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                {{ t('dashboard.bookDetails.addOffer') }}
              </button>
              <button
                @click="togglePublishStatus"
                :disabled="isUpdating"
                class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 transition-colors"
              >
                {{
                  isUpdating
                    ? '...'
                    : parseInt(selectedBook.status, 10) === 1
                    ? t('dashboard.bookDetails.unpublish')
                    : t('dashboard.bookDetails.publish')
                }}
              </button>
            </div>
          </div>
        </div>

        <section class="bg-white rounded-lg shadow-md p-6 md:p-8 mt-8">
          <h3 class="font-bold text-2xl text-gray-900 mb-4">
            {{ t('dashboard.bookDetails.availabilityPricing') }}
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div class="flex items-center space-x-2 mb-2">
                <p class="text-lg text-gray-700">
                  <strong>{{ t('dashboard.bookDetails.priceLabel') }}</strong>
                </p>
                <span v-if="selectedBook.discountedPrice" class="text-gray-500 line-through">{{
                  selectedBook.price
                }}</span>
                <span
                  :class="
                    selectedBook.discountedPrice
                      ? 'text-red-600 font-bold text-xl'
                      : 'text-green-600 font-semibold text-xl'
                  "
                >
                  {{ selectedBook.discountedPrice || selectedBook.price }}
                </span>
              </div>
              <p class="text-lg text-gray-700 mb-4">
                <strong>Stock {{ t('dashboard.bookDetails.status') }}</strong>
                <span :class="stockStatusColor" class="font-semibold">{{ stockStatusText }}</span>
              </p>
            </div>
            <div>
              <div class="flex items-center text-lg text-gray-700 mb-2">
                <strong>{{ t('dashboard.bookDetails.ratingLabel') }}</strong>
                <span class="ml-2 flex text-yellow-400"> </span>
                <span class="ml-2"
                  >({{ selectedBook.rating }}{{ t('dashboard.bookDetails.outOf5') }})</span
                >
              </div>
            </div>
          </div>
        </section>

        <section
          v-if="selectedBook.offers && selectedBook.offers.length > 0"
          class="bg-white rounded-lg shadow-md p-6 md:p-8 mt-8"
        >
          <h3 class="font-bold text-2xl text-gray-900 mb-4">
            {{ t('dashboard.bookDetails.manageOffers') }}
          </h3>
          <div class="space-y-4">
            <div
              v-for="offer in selectedBook.offers"
              :key="offer.id"
              class="border border-gray-200 rounded-lg p-4"
              :class="offer.active ? 'bg-green-50 border-green-200' : 'bg-gray-50'"
            >
              <div class="flex justify-between items-start">
                <div>
                  <h4 class="font-semibold text-lg">
                    {{
                      offer.type === 'percentage'
                        ? `${offer.value}% Discount`
                        : `${offer.value} Off`
                    }}
                  </h4>
                  <p class="text-sm text-gray-500">
                    Valid: {{ new Date(offer.startDate).toLocaleDateString() }}
                    <span v-if="offer.endDate">
                      - {{ new Date(offer.endDate).toLocaleDateString() }}</span
                    >
                  </p>
                </div>
                <div class="flex space-x-2 ml-4">
                  <button
                    @click="toggleOfferStatus(offer)"
                    :class="
                      offer.active ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                    "
                    class="px-3 py-1 rounded text-sm font-medium transition-colors"
                  >
                    {{
                      offer.active
                        ? t('dashboard.bookDetails.deactivate')
                        : t('dashboard.bookDetails.activate')
                    }}
                  </button>
                  <button
                    @click="removeOffer(offer.id)"
                    class="px-3 py-1 bg-red-100 text-red-700 rounded text-sm font-medium hover:bg-red-200 transition-colors"
                  >
                    {{ t('dashboard.bookDetails.remove') }}
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
