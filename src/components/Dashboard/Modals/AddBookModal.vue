<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthorStore } from '@/stores/Authors'
import { usePublishingHouseStore } from '@/stores/PublishingHouses'
import { useCategoriesStore } from '@/stores/Categories'
import AddAttributeModal from './AddAttributeModal.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  show: Boolean,
})

const emit = defineEmits(['close', 'save'])

const authorStore = useAuthorStore()
const publishingHouseStore = usePublishingHouseStore()
const categoriesStore = useCategoriesStore()

const showAddAttributeModal = ref(false)
const attributeType = ref('') // 'author' or 'publisher'

const newBook = ref({
  title: '',
  description: '',
  price: null,
  author_id: '',
  publisher_id: '',
  category_id: '',
  stock: null,
  pages: null,
  cover: '',
  publisherDate: '',
})

const authors = computed(() => authorStore.authors)
const publishers = computed(() => publishingHouseStore.publishingHouses)
const categories = computed(() => categoriesStore.categories)

onMounted(() => {
  // Assuming fetch actions exist in these stores
  authorStore.fetchAuthors()
  publishingHouseStore.fetchPublishers()
  categoriesStore.fetchCategories()
})

function onFileChange(event) {
  const file = event.target.files[0]
  if (file) {
    newBook.value.cover = file
  }
}

function closeModal() {
  emit('close')
}

function saveBook() {
  // Basic validation
  if (
    !newBook.value.title ||
    !newBook.value.author_id ||
    !newBook.value.publisher_id ||
    !newBook.value.category_id ||
    newBook.value.price === null
  ) {
    alert(t('dashboard.addBookModal.requiredFields'))
    return
  }

  const formData = new FormData()

  // Append each field individually
  formData.append('title', newBook.value.title)
  formData.append('description', newBook.value.description || '')
  formData.append('price', newBook.value.price)
  formData.append('author_id', newBook.value.author_id)
  formData.append('publisher_id', newBook.value.publisher_id)
  formData.append('category_id', newBook.value.category_id)
  formData.append('stock', newBook.value.stock ?? 0)
  formData.append('pages', newBook.value.pages ?? 0)

  // Optional fields
  formData.append(
    'publisherDate',
    newBook.value.publisherDate || new Date().toISOString().split('T')[0]
  )

  // Append cover file if selected
  if (newBook.value.cover instanceof File) {
    formData.append('cover', newBook.value.cover)
  }

  // Emit FormData to parent or send directly
  emit('save', formData)
  closeModal()
}

const openAddAttributeModal = (type) => {
  attributeType.value = type
  showAddAttributeModal.value = true
}

const handleSaveAttribute = async (name) => {
  try {
    if (attributeType.value === 'author') {
      const newAuthor = await authorStore.addAuthor({ name })
      // Assuming addAuthor returns the new author object with id
      if (newAuthor && newAuthor.id) {
        newBook.value.author_id = newAuthor.id
      }
    } else if (attributeType.value === 'publisher') {
      const newPublisher = await publishingHouseStore.addPublisher({ name })
      // Assuming addPublisher returns the new publisher object with id
      if (newPublisher && newPublisher.id) {
        newBook.value.publisher_id = newPublisher.id
      }
    }
  } catch (error) {
    console.error(`Failed to add ${attributeType.value}:`, error)
    alert(t('dashboard.addBookModal.failed') + `${attributeType.value}.`)
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
      :title="t('dashboard.addBookModal.addNew') + attributeType"
      :label="attributeType + t('dashboard.addBookModal.name')"
      @close="showAddAttributeModal = false"
      @save="handleSaveAttribute"
    />
    <div class="bg-white rounded-lg shadow-xl w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
      <div class="p-6 border-b sticky top-0 bg-white z-10">
        <h3 class="text-xl font-semibold">{{ t('dashboard.addBookModal.title') }}</h3>
      </div>
      <div class="p-6">
        <form @submit.prevent="saveBook">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="title" class="block text-sm font-medium text-gray-700">{{
                t('dashboard.addBookModal.labels.title')
              }}</label>
              <input
                v-model="newBook.title"
                type="text"
                id="title"
                class="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label for="price" class="block text-sm font-medium text-gray-700">{{
                t('dashboard.addBookModal.labels.price')
              }}</label>
              <input
                v-model.number="newBook.price"
                type="number"
                step="0.01"
                id="price"
                class="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div class="md:col-span-2">
              <label for="description" class="block text-sm font-medium text-gray-700">{{
                t('dashboard.addBookModal.labels.description')
              }}</label>
              <textarea
                v-model="newBook.description"
                id="description"
                rows="4"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              ></textarea>
            </div>
            <div>
              <label for="author" class="block text-sm font-medium text-gray-700">{{
                t('dashboard.addBookModal.labels.author')
              }}</label>
              <div class="flex items-center gap-2">
                <select
                  v-model="newBook.author_id"
                  id="author"
                  class="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                >
                  <option disabled value="">
                    {{ t('dashboard.addBookModal.placeholders.author') }}
                  </option>
                  <option v-for="author in authors" :key="author.id" :value="author.id">
                    {{ author.name }}
                  </option>
                </select>
                <button
                  @click="openAddAttributeModal('author')"
                  type="button"
                  class="mt-1 px-3 py-2 text-sm font-medium text-white bg-gray-600 border border-transparent rounded-md shadow-sm hover:bg-gray-700"
                >
                  {{ t('dashboard.addBookModal.new') }}
                </button>
              </div>
            </div>
            <div>
              <label for="publishingHouse" class="block text-sm font-medium text-gray-700">{{
                t('dashboard.addBookModal.labels.publisher')
              }}</label>
              <div class="flex items-center gap-2">
                <select
                  v-model="newBook.publisher_id"
                  id="publishingHouse"
                  class="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                >
                  <option disabled value="">
                    {{ t('dashboard.addBookModal.placeholders.publisher') }}
                  </option>
                  <option
                    v-for="publisher in publishers"
                    :key="publisher.id"
                    :value="publisher.id"
                  >
                    {{ publisher.name }}
                  </option>
                </select>
                <button
                  @click="openAddAttributeModal('publisher')"
                  type="button"
                  class="mt-1 px-3 py-2 text-sm font-medium text-white bg-gray-600 border border-transparent rounded-md shadow-sm hover:bg-gray-700"
                >
                  {{ t('dashboard.addBookModal.new') }}
                </button>
              </div>
            </div>
            <div>
              <label for="category" class="block text-sm font-medium text-gray-700">{{
                t('dashboard.addBookModal.labels.category')
              }}</label>
              <select
                v-model="newBook.category_id"
                id="category"
                class="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              >
                <option disabled value="">
                  {{ t('dashboard.addBookModal.placeholders.category') }}
                </option>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
            </div>
            <div>
              <label for="stock" class="block text-sm font-medium text-gray-700">{{
                t('dashboard.addBookModal.labels.stock')
              }}</label>
              <input
                v-model.number="newBook.stock"
                type="number"
                id="stock"
                class="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label for="pages" class="block text-sm font-medium text-gray-700">{{
                t('dashboard.addBookModal.labels.pages')
              }}</label>
              <input
                v-model.number="newBook.pages"
                type="number"
                id="pages"
                class="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div class="md:col-span-2">
              <label for="cover" class="block text-sm font-medium text-gray-700">{{
                t('dashboard.addBookModal.labels.cover')
              }}</label>
              <input
                @change="onFileChange"
                type="file"
                id="cover"
                accept="image/*"
                class="mt-1 p-2 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
              />
            </div>
          </div>
        </form>
      </div>
      <div class="p-6 bg-gray-50 flex justify-end gap-4 sticky bottom-0 z-10">
        <button
          @click="closeModal"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
        >
          {{ t('dashboard.addBookModal.cancel') }}
        </button>
        <button
          @click="saveBook"
          class="px-4 py-2 text-sm font-medium text-white bg-[var(--color-primary)] border border-transparent rounded-md shadow-sm hover:bg-[var(--color-hover)]"
        >
          {{ t('dashboard.addBookModal.save') }}
        </button>
      </div>
    </div>
  </div>
</template>
