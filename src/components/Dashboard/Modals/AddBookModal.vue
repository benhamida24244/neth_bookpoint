<script setup>
import { ref, computed } from 'vue'
import { useAuthorStore } from '@/stores/Authors'
import { usePublishingHouseStore } from '@/stores/PublishingHouses'
import AddAttributeModal from './AddAttributeModal.vue'

const props = defineProps({
  show: Boolean,
})

const emit = defineEmits(['close', 'save'])

const authorStore = useAuthorStore()
const publishingHouseStore = usePublishingHouseStore()

const showAddAttributeModal = ref(false)
const attributeType = ref('') // 'author' or 'publisher'

const newBook = ref({
  title: '',
  description: '',
  price: null,
  author: '',
  publisher: '',
})

const authors = computed(() => authorStore.authors)
const publishers = computed(() => publishingHouseStore.publishingHouses)

function closeModal() {
  emit('close')
}

function saveBook() {
  // Basic validation
  if (!newBook.value.title || !newBook.value.author || !newBook.value.publisher) {
    alert('Please fill in all required fields.')
    return
  }
  emit('save', { ...newBook.value })
  closeModal()
}

const openAddAttributeModal = (type) => {
  attributeType.value = type
  showAddAttributeModal.value = true
}

const handleSaveAttribute = (name) => {
  if (attributeType.value === 'author') {
    authorStore.addAuthor({ name })
    newBook.value.author = name
  } else if (attributeType.value === 'publisher') {
    publishingHouseStore.addPublisher({ name })
    newBook.value.publisher = name
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
        <h3 class="text-xl font-semibold">Add New Book</h3>
      </div>
      <div class="p-6">
        <form @submit.prevent="saveBook">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
              <input
                v-model="newBook.title"
                type="text"
                id="title"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label for="price" class="block text-sm font-medium text-gray-700">Price</label>
              <input
                v-model.number="newBook.price"
                type="number"
                id="price"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div class="md:col-span-2">
              <label for="description" class="block text-sm font-medium text-gray-700"
                >Description</label
              >
              <textarea
                v-model="newBook.description"
                id="description"
                rows="4"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              ></textarea>
            </div>
            <div>
              <label for="author" class="block text-sm font-medium text-gray-700">Author</label>
              <div class="flex items-center gap-2">
                <select
                  v-model="newBook.author"
                  id="author"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                  class="px-3 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700"
                >
                  New
                </button>
              </div>
            </div>
            <div>
              <label for="publisher" class="block text-sm font-medium text-gray-700"
                >Publisher</label
              >
              <div class="flex items-center gap-2">
                <select
                  v-model="newBook.publisher"
                  id="publisher"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                  class="px-3 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700"
                >
                  New
                </button>
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
          Cancel
        </button>
        <button
          @click="saveBook"
          class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700"
        >
          Save Book
        </button>
      </div>
    </div>
  </div>
</template>
