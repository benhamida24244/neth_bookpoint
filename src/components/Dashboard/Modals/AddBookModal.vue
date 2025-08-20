<script setup>
import { ref, computed, watch } from 'vue';
import { useAuthorStore } from '@/stores/Authors';
import { usePublishingHouseStore } from '@/stores/PublishingHouses';
import { useCategoriesStore } from '@/stores/Categories';
import { useBooksStore } from '@/stores/Books';

const props = defineProps({
  show: Boolean,
});

const emit = defineEmits(['close']);

// Stores
const authorStore = useAuthorStore();
const publishingHouseStore = usePublishingHouseStore();
const categoryStore = useCategoriesStore();
const booksStore = useBooksStore();

// Form State
const newBook = ref({
  title: '',
  description: '',
  price: null,
  stock: null,
  author_id: null,
  publisher_id: null,
  category_id: null,
  discount: 0,
  rating: 0,
  status: 'draft',
  publisherDate: new Date().toISOString().slice(0, 10),
  pages: null,
  language: '',
});
const coverFile = ref(null);

// Data for Selects
const authors = computed(() => authorStore.authors);
const publishers = computed(() => publishingHouseStore.publishingHouses);
const categories = computed(() => categoryStore.categories);

// Fetch data when the modal becomes visible
watch(() => props.show, (newVal) => {
  if (newVal) {
    if (!authors.value.length) authorStore.fetchAuthors();
    if (!publishers.value.length) publishingHouseStore.fetchPublisher();
    if (!categories.value.length) categoryStore.fetchCategories();
    resetForm();
  }
});

function handleFileChange(event) {
  coverFile.value = event.target.files[0];
}

function closeModal() {
  emit('close');
}

function resetForm() {
    newBook.value = {
        title: '',
        description: '',
        price: null,
        stock: null,
        author_id: null,
        publisher_id: null,
        category_id: null,
        discount: 0,
        rating: 0,
        status: 'draft',
        publisherDate: new Date().toISOString().slice(0, 10),
        pages: null,
        language: '',
    };
    coverFile.value = null;
    // Reset file input visually
    const fileInput = document.getElementById('cover_file');
    if (fileInput) {
        fileInput.value = '';
    }
}

async function saveBook() {
  // Basic validation
  if (!newBook.value.title || !newBook.value.author_id || !newBook.value.publisher_id || !newBook.value.category_id) {
    alert('Please fill in all required fields: Title, Author, Publisher, and Category.');
    return;
  }
  try {
    // Create the book first
    const createdBook = await booksStore.createBook(newBook.value);

    // If a cover file is selected, upload it
    if (coverFile.value && createdBook?.data?.id) {
      await booksStore.uploadBookCover(createdBook.data.id, coverFile.value);
    } else if (coverFile.value) {
        // Fallback or error if ID is not returned
        console.warn("Book was created, but cover couldn't be uploaded because no ID was returned.");
        // Attempt to refetch and find the book to upload cover, though this is not robust
    }

    alert('Book added successfully!');
    closeModal();
  } catch (error) {
    alert('Failed to add book. Please check the console for details.');
    console.error("Save book error:", error);
  }
}
</script>

<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" @click.self="closeModal">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 h-[90vh] flex flex-col">
      <div class="p-6 border-b">
        <h3 class="text-xl font-semibold">Add New Book</h3>
      </div>
      <div class="p-6 overflow-y-auto flex-grow">
        <form @submit.prevent="saveBook" class="space-y-6">
          <!-- Row 1: Title, Price, Stock -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label for="title" class="block text-sm font-medium text-gray-700">Title*</label>
              <input v-model="newBook.title" type="text" id="title" class="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm" required />
            </div>
            <div>
              <label for="price" class="block text-sm font-medium text-gray-700">Price</label>
              <input v-model.number="newBook.price" type="number" step="0.01" id="price" class="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label for="stock" class="block text-sm font-medium text-gray-700">Stock</label>
              <input v-model.number="newBook.stock" type="number" id="stock" class="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm" />
            </div>
          </div>

          <!-- Row 2: Description -->
          <div class="md:col-span-3">
            <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
            <textarea v-model="newBook.description" id="description" rows="4" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm"></textarea>
          </div>

          <!-- Row 3: Author, Publisher, Category -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label for="author" class="block text-sm font-medium text-gray-700">Author*</label>
              <select v-model="newBook.author_id" id="author" class="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm" required>
                <option :value="null" disabled>Select an author</option>
                <option v-for="author in authors" :key="author.id" :value="author.id">{{ author.name }}</option>
              </select>
            </div>
            <div>
              <label for="publisher" class="block text-sm font-medium text-gray-700">Publisher*</label>
              <select v-model="newBook.publisher_id" id="publisher" class="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm" required>
                <option :value="null" disabled>Select a publisher</option>
                <option v-for="publisher in publishers" :key="publisher.id" :value="publisher.id">{{ publisher.name }}</option>
              </select>
            </div>
            <div>
              <label for="category" class="block text-sm font-medium text-gray-700">Category*</label>
              <select v-model="newBook.category_id" id="category" class="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm" required>
                <option :value="null" disabled>Select a category</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
              </select>
            </div>
          </div>

          <!-- Row 4: Status, Language, Publisher Date -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div>
                <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
                <select v-model="newBook.status" id="status" class="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm">
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="pending">Pending</option>
                </select>
            </div>
            <div>
              <label for="language" class="block text-sm font-medium text-gray-700">Language</label>
              <input v-model="newBook.language" type="text" id="language" class="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label for="publisherDate" class="block text-sm font-medium text-gray-700">Publisher Date</label>
              <input v-model="newBook.publisherDate" type="date" id="publisherDate" class="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm" />
            </div>
          </div>

          <!-- Row 5: Pages, Discount, Rating -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label for="pages" class="block text-sm font-medium text-gray-700">Pages</label>
              <input v-model.number="newBook.pages" type="number" id="pages" class="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label for="discount" class="block text-sm font-medium text-gray-700">Discount (%)</label>
              <input v-model.number="newBook.discount" type="number" id="discount" class="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label for="rating" class="block text-sm font-medium text-gray-700">Rating (0-5)</label>
              <input v-model.number="newBook.rating" type="number" step="0.1" min="0" max="5" id="rating" class="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm" />
            </div>
          </div>

          <!-- Row 6: Cover File Upload -->
          <div class="md:col-span-3">
            <label for="cover_file" class="block text-sm font-medium text-gray-700">Book Cover</label>
            <input @change="handleFileChange" type="file" id="cover_file" class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
          </div>

        </form>
      </div>
      <div class="p-4 bg-gray-50 flex justify-end gap-4 border-t">
        <button @click="closeModal" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">
          Cancel
        </button>
        <button @click="saveBook" class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700">
          Save Book
        </button>
      </div>
    </div>
  </div>
</template>
