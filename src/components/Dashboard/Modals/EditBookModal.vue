<script setup>
import { ref, computed, watch } from 'vue'
import { useAuthorStore } from '@/stores/Authors'
import { usePublishingHouseStore } from '@/stores/PublishingHouses'
import AddAttributeModal from './AddAttributeModal.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  show: Boolean,
  book: Object,
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
    alert(t('dashboard.editBookModal.requiredFields'))
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
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    @click.self="closeModal"
  >
    <AddAttributeModal
      :show="showAddAttributeModal"
      :title="t('dashboard.editBookModal.addNew') + attributeType"
      :label="attributeType + t('dashboard.editBookModal.name')"
      @close="showAddAttributeModal = false"
      @save="handleSaveAttribute"
    />
    <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
      <div class="p-6 border-b">
        <h3 class="text-xl font-semibold">{{ t('dashboard.editBookModal.title') }}</h3>
      </div>
      <div v-if="editedBook" class="p-6">
        <form @submit.prevent="saveBook">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="title" class="block text-sm font-medium text-gray-700">{{
                t('dashboard.editBookModal.labels.title')
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
                t('dashboard.editBookModal.labels.price')
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
                t('dashboard.editBookModal.labels.description')
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
                t('dashboard.editBookModal.labels.author')
              }}</label>
              <div class="flex items-center gap-2">
                <select
                  v-model="editedBook.author"
                  id="author"
                  class="mt-2 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                >
                  <option disabled value="">
                    {{ t('dashboard.editBookModal.selectAuthor') }}
                  </option>
                  <option v-for="author in authors" :key="author.id" :value="author.name">
                    {{ author.name }}
                  </option>
                </select>
                <button
                  @click="openAddAttributeModal('author')"
                  type="button"
                  class="mt-2 px-3 py-2 text-sm font-medium text-white bg-[var(--color-light)] border border-transparent rounded-md shadow-sm hover:bg-[var(--color-primary)]"
                >
                  {{ t('dashboard.editBookModal.new') }}
                </button>
              </div>
            </div>
            <div>
              <label for="publisher" class="block text-sm font-medium text-gray-700">{{
                t('dashboard.editBookModal.labels.publisher')
              }}</label>
              <div class="flex items-center gap-2">
                <select
                  v-model="editedBook.publishingHouse"
                  id="publishingHouse"
                  class="mt-2 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                >
                  <option disabled value="">
                    {{ t('dashboard.editBookModal.selectPublisher') }}
                  </option>
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
                  {{ t('dashboard.editBookModal.new') }}
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
          {{ t('dashboard.editBookModal.cancel') }}
        </button>
        <button
          @click="saveBook"
          class="px-4 py-2 text-sm font-medium text-white bg-[var(--color-light)] border border-transparent rounded-md shadow-sm hover:bg-[var(--color-primary)]"
        >
          {{ t('dashboard.editBookModal.save') }}
        </button>
      </div>
    </div>
  </div>
</template>
