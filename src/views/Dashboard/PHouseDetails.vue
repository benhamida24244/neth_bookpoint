<script setup>
import { usePublishingHouseStore } from '@/stores/PublishingHouses';
import { onMounted, ref, computed } from 'vue'; // <-- Import computed
import { useRoute } from 'vue-router';

// Initialize store and router
const publishingHouseStore = usePublishingHouseStore();
const route = useRoute();
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

// Component's local state
const currentPublishingHouse = ref(null);
const loading = ref(true);
const error = ref(null);

// State for the edit modal
const showEditModal = ref(false);
const editForm = ref({ id: null, name: '', description: '', img: '', country: '' });

// --- NEW: Computed property to safely resolve the image URL ---
const imageUrl = computed(() => {
  if (!currentPublishingHouse.value || !currentPublishingHouse.value.img) {
    // Return a placeholder if no image is available
    return 'https://via.placeholder.com/300x450.png?text=No+Image';
  }
  const imgPath = currentPublishingHouse.value.img;
  // If imgPath is already a full URL, use it directly. Otherwise, prepend the base URL.
  if (imgPath.startsWith('http://') || imgPath.startsWith('https://')) {
    return imgPath;
  }
  // Make sure there is no double slash
  return `${apiBaseUrl.replace(/\/$/, '')}/${imgPath.replace(/^\//, '')}`;
});


async function fetchPublisherById() {
  loading.value = true;
  error.value = null;
  try {
    const publisherId = Number(route.params.id);
    if (isNaN(publisherId)) {
      throw new Error('Invalid Publisher ID provided in the URL.');
    }

    const publisherData = await publishingHouseStore.getPublisherById(publisherId);

    if (!publisherData) {
      throw new Error(`Publisher with ID ${publisherId} could not be found.`);
    }

    currentPublishingHouse.value = publisherData;

  } catch (err) {
    console.error('Failed to load publisher:', err);
    error.value = err.message || 'An unknown error occurred while fetching data.';
    currentPublishingHouse.value = null; // Ensure no stale data is shown
  } finally {
    loading.value = false;
  }
}

onMounted(fetchPublisherById);

function openEditModal() {
  if (currentPublishingHouse.value) {
    editForm.value = { ...currentPublishingHouse.value };
    showEditModal.value = true;
  }
}

async function savePublishingHouse() {
  if (!editForm.value || !editForm.value.id) return;

  try {
    await publishingHouseStore.updatePublisher(editForm.value.id, editForm.value);
    currentPublishingHouse.value = { ...editForm.value };
    showEditModal.value = false;
  } catch (err) {
    console.error("Failed to save publishing house:", err);
    alert("Error: Could not save changes. Please try again.");
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 font-sans text-gray-800 p-4 sm:p-6 lg:p-8">

    <div v-if="loading" class="flex justify-center items-center h-screen">
      <div class="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[var(--color-primary)]"></div>
    </div>

    <div v-else-if="error" class="flex justify-center items-center min-h-screen">
      <div class="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg max-w-lg text-center shadow-md">
        <strong class="font-bold text-xl">{{ translations.dashboard?.publisherDetails?.error }}</strong>
        <p class="block mt-2">{{ error }}</p>
      </div>
    </div>

    <div v-else-if="currentPublishingHouse" class="max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <div class="md:flex">
        <div class="md:flex-shrink-0 md:w-64 bg-gray-200">
          <img class="h-full w-full object-cover" :src="imageUrl" :alt="`Logo of ${currentPublishingHouse.name}`">
        </div>

        <div class="p-8 flex-grow relative">
          <button
            @click="openEditModal"
            class="absolute right-6 top-6 bg-[var(--color-primary)] px-4 py-2 rounded-lg text-white font-semibold hover:bg-[var(--color-hover)] transition flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
              <path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd" />
            </svg>
            <span>Edit</span>
          </button>

          <div class="mb-4">
            <h1 class="text-4xl font-bold text-gray-900">{{ currentPublishingHouse.name }}</h1>
            <p class="text-lg text-gray-500 mt-1">{{ currentPublishingHouse.country }}</p>
          </div>

          <a v-if="currentPublishingHouse.url" :href="currentPublishingHouse.url" target="_blank" class="text-blue-600 hover:underline block mb-4">{{ currentPublishingHouse.url }}</a>
          <p class="mt-2 text-gray-600 leading-relaxed">{{ currentPublishingHouse.description }}</p>

          <div class="mt-8">
            <h2 class="text-2xl font-bold text-gray-800 mb-4">{{ translations.dashboard?.publisherDetails?.statistics }}</h2>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div class="p-4 bg-gray-50 rounded-lg border flex items-center gap-4">
                <div class="bg-blue-100 p-3 rounded-full text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v11.494m-9-5.747h18" /></svg>
                </div>
                <div>
                  <p class="text-base font-medium text-gray-600">{{ translations.dashboard?.publisherDetails?.booksPublished }}</p>
                  <p class="text-2xl font-bold text-gray-900">{{ currentPublishingHouse.nmBook }}</p>
                </div>
              </div>
              <div class="p-4 bg-gray-50 rounded-lg border flex items-center gap-4">
                 <div class="bg-green-100 p-3 rounded-full text-green-600">
                   <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                 </div>
                <div>
                  <p class="text-base font-medium text-gray-600">{{ translations.dashboard?.publisherDetails?.totalOrders }}</p>
                  <p class="text-2xl font-bold text-gray-900">{{ currentPublishingHouse.orders.toLocaleString() }}</p>
                </div>
              </div>
              <div class="p-4 bg-gray-50 rounded-lg border flex items-center gap-4">

                <div>
                  <p class="text-base font-medium text-gray-600">{{ translations.dashboard?.publisherDetails?.status }}</p>
                  <p :class="(currentPublishingHouse.status === 1)? '':''" class="text-2xl font-bold text-gray-900">{{ (currentPublishingHouse.status === 1)? 'Active':'Draft' }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div class="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg relative animate-fade-in-up">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold">{{ translations.dashboard?.publisherDetails?.editTitle }}</h2>
          <button @click="showEditModal = false" class="text-gray-400 hover:text-gray-600">&times;</button>
        </div>

        <label class="block mb-2 font-medium"{{ translations.dashboard?.publisherDetails?.labels?.name }}</label>
        <input v-model="editForm.name" type="text" class="w-full border rounded-lg px-3 py-2 mb-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
        <label class="block mb-2 font-medium"{{ translations.dashboard?.publisherDetails?.labels?.description }}</label>
        <textarea v-model="editForm.description" rows="4" class="w-full border rounded-lg px-3 py-2 mb-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
        <label class="block mb-2 font-medium"{{ translations.dashboard?.publisherDetails?.labels?.imagePath }}</label>
        <input type="file"
          class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-[var(--color-primary)] hover:file:bg-blue-100">

        <div class="flex justify-end gap-3 mt-4">
          <button @click="showEditModal = false" class="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 font-semibold"{{ translations.dashboard?.publisherDetails?.cancel }}/button>
          <button @click="savePublishingHouse" class="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-hover)] font-semibold">{{ translations.dashboard?.publisherDetails?.save }}</button>
        </div>
      </div>
    </div>

  </div>
</template>
