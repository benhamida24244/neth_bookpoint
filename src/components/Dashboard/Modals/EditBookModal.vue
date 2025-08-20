<script setup>
import { ref, computed, watch } from 'vue';
import { useAuthorStore } from '@/stores/Authors';
import { usePublishingHouseStore } from '@/stores/PublishingHouses';
import { useCategoriesStore } from '@/stores/Categories';
import { useBooksStore } from '@/stores/Books';

const props = defineProps({
  show: Boolean,
  book: Object,
});

const emit = defineEmits(['close', 'save']);

// Stores
const authorStore = useAuthorStore();
const publishingHouseStore = usePublishingHouseStore();
const categoryStore = useCategoriesStore();
const booksStore = useBooksStore();

// Form State
const editingBook = ref({});
const coverFile = ref(null);

// Data for Selects
const authors = computed(() => authorStore.authors);
const publishers = computed(() => publishingHouseStore.publishingHouses);
const categories = computed(() => categoryStore.categories);

// Populate form when modal is shown or book prop changes
watch(() => props.book, (newBook) => {
  if (newBook) {
    editingBook.value = {
      ...newBook,
      author_id: newBook.author?.id ?? null,
      publisher_id: newBook.publisher?.id ?? null,
      category_id: newBook.category?.id ?? null,
      publisherDate: newBook.publisherDate ? newBook.publisherDate.split('T')[0] : new Date().toISOString().slice(0, 10),
    };
    coverFile.value = null;
  }
}, { immediate: true, deep: true });


// Fetch data when the modal becomes visible
watch(() => props.show, (newVal) => {
  if (newVal) {
    if (!authors.value.length) authorStore.fetchAuthors();
    if (!publishers.value.length) publishingHouseStore.fetchPublisher();
    if (!categories.value.length) categoryStore.fetchCategories();
  }
});

function handleFileChange(event) {
  coverFile.value = event.target.files[0];
}

function closeModal() {
  emit('close');
}

async function saveBook() {
  if (!props.book || !props.book.id) {
    alert("Cannot update book: No book data provided.");
    return;
  }

  // Create a payload and remove the full relational objects to avoid API errors
  const payload = { ...editingBook.value };
  delete payload.author;
  delete payload.publisher;
  delete payload.category;

  try {
    await booksStore.updateBook(props.book.id, payload);

    if (coverFile.value) {
      await booksStore.uploadBookCover(props.book.id, coverFile.value);
    }

    emit('save'); // Emit save event to parent
    closeModal();
    alert('Book updated successfully!');
  } catch (error) {
    alert('Failed to update book. Please check the console for details.');
    console.error("Update book error:", error);
  }
}
</script>

<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" @click.self="closeModal">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 h-[90vh] flex flex-col">
      <div class="p-6 border-b">
        <h3 class="text-xl font-semibold">Edit Book: {{ book?.title }}</h3>
      </div>
      <div class="p-6 overflow-y-auto flex-grow">
        <form @submit.prevent="saveBook" class="space-y-6" v-if="editingBook.id">
          <!-- Row 1: Title, Price, Stock -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label for="edit-title" class="block text-sm font-medium text-gray-700">Title*</label>
              <input v-model="editingBook.title" type="text" id="edit-title" class="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm" required />
            </div>
            <div>
              <label for="edit-price" class="block text-sm font-medium text-gray-700">Price</label>
              <input v-model.number="editingBook.price" type="number" step="0.01" id="edit-price" class="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label for="edit-stock" class="block text-sm font-medium text-gray-700">Stock</label>
              <input v-model.number="editingBook.stock" type="number" id="edit-stock" class="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm" />
            </div>
          </div>

          <!-- Row 2: Description -->
          <div>
            <label for="edit-description" class="block text-sm font-medium text-gray-700">Description</label>
            <textarea v-model="editingBook.description" id="edit-description" rows="4" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm"></textarea>
          </div>

          <!-- Row 3: Author, Publisher, Category -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label for="edit-author" class="block text-sm font-medium text-gray-700">Author*</label>
              <select v-model="editingBook.author_id" id="edit-author" class="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm" required>
                <option :value="null" disabled>Select an author</option>
                <option v-for="author in authors" :key="author.id" :value="author.id">{{ author.name }}</option>
              </select>
            </div>
            <div>
              <label for="edit-publisher" class="block text-sm font-medium text-gray-700">Publisher*</label>
              <select v-model="editingBook.publisher_id" id="edit-publisher" class="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm" required>
                <option :value="null" disabled>Select a publisher</option>
                <option v-for="publisher in publishers" :key="publisher.id" :value="publisher.id">{{ publisher.name }}</option>
              </select>
            </div>
            <div>
              <label for="edit-category" class="block text-sm font-medium text-gray-700">Category*</label>
              <select v-model="editingBook.category_id" id="edit-category" class="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm" required>
                <option :value="null" disabled>Select a category</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
              </select>
            </div>
          </div>

          <!-- Row 4: Status, Language, Publisher Date -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div>
                <label for="edit-status" class="block text-sm font-medium text-gray-700">Status</label>
                <select v-model="editingBook.status" id="edit-status" class="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm">
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="pending">Pending</option>
                </select>
            </div>
            <div>
              <label for="edit-language" class="block text-sm font-medium text-gray-700">Language</label>
              <input v-model="editingBook.language" type="text" id="edit-language" class="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label for="edit-publisherDate" class="block text-sm font-medium text-gray-700">Publisher Date</label>
              <input v-model="editingBook.publisherDate" type="date" id="edit-publisherDate" class="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm" />
            </div>
          </div>

          <!-- Row 5: Pages, Discount, Rating -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label for="edit-pages" class="block text-sm font-medium text-gray-700">Pages</label>
              <input v-model.number="editingBook.pages" type="number" id="edit-pages" class="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label for="edit-discount" class="block text-sm font-medium text-gray-700">Discount (%)</label>
              <input v-model.number="editingBook.discount" type="number" id="edit-discount" class="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label for="edit-rating" class="block text-sm font-medium text-gray-700">Rating (0-5)</label>
              <input v-model.number="editingBook.rating" type="number" step="0.1" min="0" max="5" id="edit-rating" class="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm" />
            </div>
          </div>

          <!-- Row 6: Cover File Upload -->
          <div>
            <label for="edit-cover_file" class="block text-sm font-medium text-gray-700">Update Book Cover</label>
            <input @change="handleFileChange" type="file" id="edit-cover_file" class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
            <p v-if="book.cover_url" class="text-xs text-gray-500 mt-2">Current cover: <a :href="book.cover_url" target="_blank" class="text-blue-500 hover:underline">View Image</a></p>
          </div>

        </form>
      </div>
      <div class="p-4 bg-gray-50 flex justify-end gap-4 border-t">
        <button @click="closeModal" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">
          Cancel
        </button>
        <button @click="saveBook" class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700">
          Save Changes
        </button>
      </div>
    </div>
  </div>
</template>
