<script setup>
import { useAuthorStore } from '@/stores/Authors';
import { storeToRefs } from 'pinia';
import { onMounted, ref ,computed} from 'vue';
import { useRoute } from 'vue-router';

const authorStore = useAuthorStore();
const route = useRoute();
const showEditModal = ref(false);
const editForm = ref({ name: '', description: '', img: '' });
const loading = ref(true);
const error = ref(null);
const currentAuthor = ref(null);

// 2. Get the API base URL from the .env file
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

// 3. Create a computed property for the full image URL
const authorImageUrl = computed(() => {
  // Check if the author and image path exist
  if (currentAuthor.value && currentAuthor.value.img) {
    // Combine the base URL with the relative path from the API
    return `${apiBaseUrl}${currentAuthor.value.img}`;
  }
  // Return null or a placeholder image if no image is available
  return null;
});

async function fetchAuthorById() {
  loading.value = true;
  error.value = null;
  try {
    const authorId = Number(route.params.id);
    if (!authorId) throw new Error('Invalid author ID');
    // Use the API directly to fetch a single author
  // Try to get from store if available
    // fallback to API if not in store
    let authorData = null;
    if (authorStore.authors && authorStore.authors.length > 0) {
      authorData = authorStore.authors.find(a => a.id === authorId);
    }
    if (!authorData && authorStore.fetchAuthors) {
      await authorStore.fetchAuthors();
      authorData = authorStore.authors.find(a => a.id === authorId);
    }
    if (!authorData && authorStore.getAuthor) {
      // If you have a getAuthor action in the store, use it
      authorData = await authorStore.getAuthor(authorId);
    }
    if (!authorData && authorStore.$apiService && authorStore.$apiService.getAuthor) {
      // fallback to direct API call if available
      const res = await authorStore.$apiService.getAuthor(authorId);
      authorData = res.data.data;
    }
    if (!authorData) {
      // fallback to direct import
      const api = (await import('@/services/api.js'));
      const res = await api.getAuthor(authorId);
      authorData = res.data.data;
    }
    currentAuthor.value = authorData;
  } catch (err) {
    error.value = err.message || 'Failed to load author.';
    currentAuthor.value = null;
  } finally {
    loading.value = false;
  }
}

onMounted(fetchAuthorById);

function openEditModal() {
  if (currentAuthor.value) {
    editForm.value = {
      name: currentAuthor.value.name,
      description: currentAuthor.value.description,
      img: currentAuthor.value.img
    };
    showEditModal.value = true;
  }
}

async function saveAuthor() {
  if (!currentAuthor.value) return;
  loading.value = true;
  error.value = null;
  try {
    await authorStore.updateAuthor(currentAuthor.value.id, {
      name: editForm.value.name,
      description: editForm.value.description,
      img: editForm.value.img
    });
    await fetchAuthorById();
    showEditModal.value = false;
  } catch (err) {
    error.value = err.message || 'Failed to update author.';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div v-if="loading" class="flex justify-center items-center min-h-screen bg-gray-100">
    <div class="text-gray-600 text-lg">Loading author details...</div>
  </div>
  <div v-else-if="error" class="flex justify-center items-center min-h-screen bg-gray-100">
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg max-w-md text-center shadow-md">
      <strong class="font-bold">Error!</strong>
      <span class="block sm:inline ml-2">{{ error }}</span>
    </div>
  </div>
  <div v-else-if="currentAuthor" class="min-h-screen bg-gray-100 font-sans text-gray-800 p-4 sm:p-6 lg:p-8 relative">
    <div class="max-w-5xl mx-auto bg-white rounded-xl shadow-md overflow-hidden md:flex">
      <div class="md:flex-shrink-0">
    <img class="h-full w-full object-cover md:w-64" :src="authorImageUrl" :alt="`Portrait of ${currentAuthor.name}`" v-if="authorImageUrl">
      </div>
      <div class="p-8 flex-grow relative">
        <button
          @click="openEditModal"
          class="absolute right-6 top-6 bg-[var(--color-light)] px-4 py-2 rounded-lg text-white font-semibold hover:bg-[var(--color-primary)] transition"
        >
          ✏️ Edit
        </button>
  <div class="uppercase tracking-wide text-sm text-[var(--color-primary)] font-semibold">{{ currentAuthor.Country }}</div>
  <h1 class="block mt-1 text-4xl leading-tight font-bold text-gray-900">{{ currentAuthor.name }}</h1>
  <a v-if="currentAuthor.email" :href="`mailto:${currentAuthor.email}`" class="mt-2 text-gray-500 hover:text-[var(--color-primary)] transition-colors block">{{ currentAuthor.email }}</a>
  <p class="mt-4 text-gray-700">{{ currentAuthor.description }}</p>

        <div class="mt-8">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">Statistics</h2>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div class="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p class="text-base font-medium text-gray-600">Books Published</p>
              <p class="mt-1 text-3xl font-bold text-gray-900">{{ currentAuthor.nmbBook ?? 0 }}</p>
            </div>
            <div class="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p class="text-base font-medium text-gray-600">Total Orders</p>
              <p class="mt-1 text-3xl font-bold text-gray-900">{{ (currentAuthor.Orders_count ?? 0).toLocaleString() }}</p>
            </div>
            <div class="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p class="text-base font-medium text-gray-600">Total Spent</p>
              <p class="mt-1 text-3xl font-bold text-gray-900">${{ (currentAuthor.SpendMuch ?? 0).toLocaleString() }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="showEditModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg relative">
        <h2 class="text-xl font-bold mb-4">Edit Author</h2>

        <label class="block mb-2 font-medium">Name</label>
        <input v-model="editForm.name" type="text" class="w-full border rounded-lg px-3 py-2 mb-4">

        <label class="block mb-2 font-medium">Description</label>
        <textarea v-model="editForm.description" rows="4" class="w-full border rounded-lg px-3 py-2 mb-4"></textarea>

        <label class="block mb-2 font-medium">Upload Image</label>
        <input v-model="editForm.img" type="text" class="w-full border rounded-lg px-3 py-2 mb-4">

        <div class="flex justify-end gap-2 mt-4">
          <button @click="showEditModal = false" class="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">Cancel</button>
          <button @click="saveAuthor" class="px-4 py-2 bg-[var(--color-light)] text-white rounded-lg hover:bg-[var(--color-primary)]">Save</button>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="flex justify-center items-center min-h-screen bg-gray-100">
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg max-w-md text-center shadow-md">
      <strong class="font-bold">Error!</strong>
      <span class="block sm:inline ml-2"> Author not found.</span>
    </div>
  </div>
</template>
