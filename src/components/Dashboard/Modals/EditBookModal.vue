<script setup>
import { ref, computed, watch } from 'vue'
import { useAuthorStore } from '@/stores/Authors'
import { usePublishingHouseStore } from '@/stores/PublishingHouses'
import AddAttributeModal from './AddAttributeModal.vue'
import { useLanguageStore } from '@/stores/language'

const languageStore = useLanguageStore()
const translations = computed(() => languageStore.translations)

const props = defineProps({
  show: Boolean,
  book: Object
})

const emit = defineEmits(['close', 'save'])

const authorStore = useAuthorStore()
const publishingHouseStore = usePublishingHouseStore()

const showAddAttributeModal = ref(false)
const attributeType = ref('') // 'author' or 'publisher'

const editedBook = ref(null)

watch(
  () => props.book,
  (newVal) => {
    if (newVal) {
      editedBook.value = { ...newVal }
    } else {
      editedBook.value = null
    }
  },
  { immediate: true }
)

const authors = computed(() => authorStore.authors)
const publishers = computed(() => publishingHouseStore.publishingHouses)

function closeModal() {
  emit('close')
}

function saveBook() {
  if (!editedBook.value) return
  // Basic validation
  if (!editedBook.value.title || !editedBook.value.author || !editedBook.value.publishingHouse) {
    alert('Please fill in all required fields.')
    return
  }
  emit('save', editedBook.value)
  closeModal()
}

const openAddAttributeModal = (type) => {
  attributeType.value = type
  showAddAttributeModal.value = true
}

const handleSaveAttribute = (name) => {
  if (attributeType.value === 'author') {
    authorStore.addAuthor({ name })
    editedBook.value.author = name
  } else if (attributeType.value === 'publisher') {
    publishingHouseStore.addPublisher({ name })
    editedBook.value.publishingHouse = name
  }
}

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      editedBook.value.cover = file // Store the file object
      editedBook.value.imagePreview = e.target.result // Store the data URL for preview
    }
    reader.readAsDataURL(file)
  }
}
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    @click.self="closeModal"
  >
    <AddAttributeModal
      :show="showAddAttributeModal"
      :title="'Add New ' + attributeType"
      :label="attributeType + ' Name'"
      @close="showAddAttributeModal = false"
      @save="handleSaveAttribute"
    />
    <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
      <div class="p-6 border-b">
        <h3 class="text-xl font-semibold">{{ translations.dashboard?.editBookModal?.title }}</h3>
      </div>
      <div v-if="editedBook" class="p-6">
        <form @submit.prevent="saveBook">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="title" class="block text-sm font-medium text-gray-700">{{
                translations.dashboard?.editBookModal?.labels?.title
              }}</label>
              <input
                v-model="editedBook.title"
                type="text"
                id="title"
                class="mt-2 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label for="price" class="block text-sm font-medium text-gray-700">{{
                translations.dashboard?.editBookModal?.labels?.price
              }}</label>
              <input
                v-model.number="editedBook.price"
                type="number"
                id="price"
                class="mt-2 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div class="md:col-span-2">
              <label for="description" class="block text-sm font-medium text-gray-700">{{
                translations.dashboard?.editBookModal?.labels?.description
              }}</label>
              <textarea
                v-model="editedBook.description"
                id="description"
                rows="4"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              ></textarea>
            </div>
            <div>
              <label for="author" class="block text-sm font-medium text-gray-700">{{
                translations.dashboard?.editBookModal?.labels?.author
              }}</label>
              <div class="flex items-center gap-2">
                <select
                  v-model="editedBook.author"
                  id="author"
                  class="mt-2 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                >
                  <option disabled value="">Select an author</option>
                  <option v-for="author in authors" :key="author.id" :value="author.name">
                    {{ author.name }}
                  </option>
                </select>
                <button
                  @click="openAddAttributeModal('author')"
                  type="button"
                  class="mt-2 px-3 py-2 text-sm font-medium text-white bg-[var(--color-light)] border border-transparent rounded-md shadow-sm hover:bg-[var(--color-primary)]"
                >
                  New
                </button>
              </div>
            </div>
            <div>
              <label for="publisher" class="block text-sm font-medium text-gray-700">{{
                translations.dashboard?.editBookModal?.labels?.publisher
              }}</label>
              <div class="flex items-center gap-2">
                <select
                  v-model="editedBook.publishingHouse"
                  id="publishingHouse"
                  class="mt-2 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                >
                  <option disabled value="">Select a publisher</option>
                  <option
                    v-for="publisher in publishers"
                    :key="publisher.id"
                    :value="publisher.name"
                  >
                    {{ publisher.name }}
                  </option>
                </select>
                <button
                  @click="openAddAttributeModal('publisher')"
                  type="button"
                  class="mt-2 px-3 py-2 text-sm font-medium text-white bg-[var(--color-light)] border border-transparent rounded-md shadow-sm hover:bg-[var(--color-primary)]"
                >
                  New
                </button>
              </div>
            </div>
            <div>
              <label for="stock" class="block text-sm font-medium text-gray-700">{{
                translations.dashboard?.editBookModal?.labels?.stock
              }}</label>
              <input
                v-model.number="editedBook.stock"
                type="number"
                id="stock"
                class="mt-2 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label for="image" class="block text-sm font-medium text-gray-700">{{
                translations.dashboard?.editBookModal?.labels?.image
              }}</label>
              <input
                type="file"
                id="image"
                @change="handleImageUpload"
                class="mt-2 p-2 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
              />
              <div v-if="editedBook.imagePreview" class="mt-4">
                <img
                  :src="editedBook.imagePreview"
                  alt="Image Preview"
                  class="h-32 w-32 object-cover rounded-md"
                />
              </div>
            </div>
          </div>
        </form>
      </div>
      <div class="p-6 bg-gray-50 flex justify-end gap-4">
        <button
          @click="closeModal"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
        >
          {{ translations.dashboard?.editBookModal?.cancel }}
        </button>
        <button
          @click="saveBook"
          class="px-4 py-2 text-sm font-medium text-white bg-[var(--color-light)] border border-transparent rounded-md shadow-sm hover:bg-[var(--color-primary)]"
        >
          {{ translations.dashboard?.editBookModal?.save }}
        </button>
      </div>
    </div>
  </div>
</template>
