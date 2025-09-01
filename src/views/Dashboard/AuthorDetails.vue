<script setup>
import { useAuthorStore } from '@/stores/Authors';
import { onMounted, ref ,computed} from 'vue';
import { useRoute } from 'vue-router';

const authorStore = useAuthorStore();
const route = useRoute();
const showEditModal = ref(false);
const editForm = ref({ name: '', Country: '', description: '', img: '' });
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
      Country: currentAuthor.value.Country,
      description: currentAuthor.value.description,
      img: currentAuthor.value.img
    };
    showEditModal.value = true;
  }
}


// Handle file upload for author image
function handleAuthorFileUpload(event) {
  const file = event.target.files[0];
  if (file) {
    editForm.value.img = file;
  }
}

// Save author with FormData (for file upload)
async function saveAuthor() {
  if (!currentAuthor.value) return;
  loading.value = true;
  error.value = null;
  try {
    const formData = new FormData();
    formData.append('name', editForm.value.name);
    formData.append('description', editForm.value.description);
    if (editForm.value.Country) formData.append('Country', editForm.value.Country);
    if (editForm.value.img instanceof File) {
      formData.append('img', editForm.value.img);
    } else if (editForm.value.img) {
      // If it's a string (existing image path), send as is
      formData.append('img', editForm.value.img);
    }

    // Use the store or direct API call for FormData
    if (authorStore.updateAuthor) {
      await authorStore.updateAuthor(currentAuthor.value.id, formData);
    } else {
      // fallback to direct API call
      const api = (await import('@/services/api.js'));
      await api.updateAuthor(currentAuthor.value.id, formData);
    }
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
    <div class="text-gray-600 text-lg">{{ translations.dashboard?.authorDetails?.loading }}</div>
  </div>
  <div v-else-if="error" class="flex justify-center items-center min-h-screen bg-gray-100">
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg max-w-md text-center shadow-md">
      <strong class="font-bold">{{ translations.dashboard?.authorDetails?.error }}</strong>
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
          <h2 class="text-2xl font-bold text-gray-800 mb-4">{{ translations.dashboard?.authorDetails?.statistics }}</h2>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div class="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p class="text-base font-medium text-gray-600">{{ translations.dashboard?.authorDetails?.booksPublished }}</p>
              <p class="mt-1 text-3xl font-bold text-gray-900">{{ currentAuthor.nmbBook ?? 0 }}</p>
            </div>
            <div class="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p class="text-base font-medium text-gray-600">{{ translations.dashboard?.authorDetails?.totalOrders }}</p>
              <p class="mt-1 text-3xl font-bold text-gray-900">{{ (currentAuthor.Orders_count ?? 0).toLocaleString() }}</p>
            </div>
            <div class="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p class="text-base font-medium text-gray-600">{{ translations.dashboard?.authorDetails?.totalSpent }}</p>
              <p class="mt-1 text-3xl font-bold text-gray-900">${{ (currentAuthor.SpendMuch ?? 0).toLocaleString() }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="showEditModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg relative">
        <h2 class="text-xl font-bold mb-4">{{ translations.dashboard?.authorDetails?.editTitle }}</h2>

        <label class="block mb-2 font-medium"{{ translations.dashboard?.authorDetails?.labels?.name }}</label>
        <input v-model="editForm.name" type="text" class="w-full border rounded-lg px-3 py-2 mb-4">
        <label class="block mb-2 font-medium"{{ translations.dashboard?.authorDetails?.labels?.country }}</label>
        <input v-model="editForm.Country" type="text" class="w-full border rounded-lg px-3 py-2 mb-4">

        <label class="block mb-2 font-medium"{{ translations.dashboard?.authorDetails?.labels?.description }}</label>
        <textarea v-model="editForm.description" rows="4" class="w-full border rounded-lg px-3 py-2 mb-4"></textarea>

            <label for="AuthorImage" class="block mb-2 font-medium"{{ translations.dashboard?.authorDetails?.labels?.image }}</label>

            <input id="AuthorImage" @change="handleAuthorFileUpload" type="file" accept="image/*"
                   class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-[var(--color-primary)] hover:file:bg-blue-100">
        <div class="flex justify-end gap-2 mt-4">
          <button @click="showEditModal = false" class="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"{{ translations.dashboard?.authorDetails?.cancel }}/button>
          <button @click="saveAuthor" class="px-4 py-2 bg-[var(--color-light)] text-white rounded-lg hover:bg-[var(--color-primary)]"{{ translations.dashboard?.authorDetails?.save }}/button>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="flex justify-center items-center min-h-screen bg-gray-100">
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg max-w-md text-center shadow-md">
      <strong class="font-bold">{{ translations.dashboard?.authorDetails?.error }}</strong>
      <span class="block sm:inline ml-2"> {{ translations.dashboard?.authorDetails?.notFound }}</span>
    </div>
  </div>
</template>
