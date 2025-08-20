<script setup>
import { usePublishingHouseStore } from '@/stores/PublishingHouses';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';

const publishingHouseStore = usePublishingHouseStore();
const { publishingHouses } = storeToRefs(publishingHouseStore);
const route = useRoute();

const showEditModal = ref(false);
const editForm = ref({ name: '', description: '', country: '' });
const imageFile = ref(null);

const currentPublishingHouse = computed(() => {
  const houseId = Number(route.params.id);
  if (!houseId || !Array.isArray(publishingHouses.value)) return null;
  return publishingHouses.value.find(house => house.id === houseId) || null;
});

function openEditModal() {
  if (currentPublishingHouse.value) {
    editForm.value = {
      name: currentPublishingHouse.value.name,
      country: currentPublishingHouse.value.country,
      description: currentPublishingHouse.value.description,
    };
    showEditModal.value = true;
  }
}

async function savePublishingHouse() {
  if (!currentPublishingHouse.value) return;

  const publisherId = currentPublishingHouse.value.id;

  // Create a payload with only the fields that are being edited
  const updatedData = {
    name: editForm.value.name,
    country: editForm.value.country,
    description: editForm.value.description,
  };

  await publishingHouseStore.updatePublisher(publisherId, updatedData);

  showEditModal.value = false;
}

const handleFileChange = (event) => {
  imageFile.value = event.target.files[0];
};

async function uploadImage() {
  if (!imageFile.value || !currentPublishingHouse.value) return;

  const formData = new FormData();
  formData.append('logo', imageFile.value);

  await publishingHouseStore.uploadPublisherImage(currentPublishingHouse.value.id, formData);

  // Optionally, clear the file input after upload
  imageFile.value = null;
  // You might need to reset the file input in the template as well
}
</script>

<template>
  <div v-if="currentPublishingHouse" class="min-h-screen bg-gray-100 font-sans text-gray-800 p-4 sm:p-6 lg:p-8 relative">
    <div class="max-w-5xl mx-auto bg-white rounded-xl shadow-md overflow-hidden md:flex">
      <div class="md:flex-shrink-0 relative group">
        <img class="h-full w-full object-cover md:w-64" :src="currentPublishingHouse.img" :alt="`Logo of ${currentPublishingHouse.name}`">
        <div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <label for="image-upload" class="cursor-pointer text-white text-lg bg-gray-800 bg-opacity-70 px-4 py-2 rounded-md">
            Change Image
          </label>
          <input id="image-upload" type="file" @change="handleFileChange" accept="image/*" class="hidden">
        </div>
      </div>
      <div class="p-8 flex-grow relative">
        <button
          @click="openEditModal"
          class="absolute right-6 top-6 bg-[var(--color-light)] px-4 py-2 rounded-lg text-white font-semibold hover:bg-[var(--color-primary)] transition"
        >
          ✏️ Edit
        </button>
        <div class="uppercase tracking-wide text-sm text-[var(--color-primary)] font-semibold">{{ currentPublishingHouse.country }}</div>
        <h1 class="block mt-1 text-4xl leading-tight font-bold text-gray-900">{{ currentPublishingHouse.name }}</h1>
        <a :href="`mailto:${currentPublishingHouse.email}`" class="mt-2 text-gray-500 hover:text-[var(--color-primary)] transition-colors block">{{ currentPublishingHouse.email }}</a>
        <a :href="currentPublishingHouse.url" target="_blank" class="mt-1 text-blue-600 hover:underline block">{{ currentPublishingHouse.url }}</a>
        <p class="mt-4 text-gray-700">{{ currentPublishingHouse.description }}</p>

        <!-- Display and upload new image -->
        <div v-if="imageFile" class="mt-4">
          <p class="text-sm font-medium text-gray-700">New image selected: {{ imageFile.name }}</p>
          <button @click="uploadImage" class="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Upload Image
          </button>
        </div>

        <div class="mt-8">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">Statistics</h2>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div class="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p class="text-base font-medium text-gray-600">Books Published</p>
              <p class="mt-1 text-3xl font-bold text-gray-900">{{ currentPublishingHouse.nmbBook }}</p>
            </div>
            <div class="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p class="text-base font-medium text-gray-600">Total Orders</p>
              <p class="mt-1 text-3xl font-bold text-gray-900">{{ currentPublishingHouse.ordersCount.toLocaleString() }}</p>
            </div>
            <div class="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p class="text-base font-medium text-gray-600">Total Spent</p>
              <p class="mt-1 text-3xl font-bold text-gray-900">${{ currentPublishingHouse.spendMuch.toLocaleString() }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="showEditModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg relative">
        <h2 class="text-xl font-bold mb-4">Edit Publishing House</h2>

        <label class="block mb-2 font-medium">Name</label>
        <input v-model="editForm.name" type="text" class="w-full border rounded-lg px-3 py-2 mb-4">
        <label class="block mb-2 font-medium">Country</label>
        <input v-model="editForm.country" type="text" class="w-full border rounded-lg px-3 py-2 mb-4">

        <label class="block mb-2 font-medium">Description</label>
        <textarea v-model="editForm.description" rows="4" class="w-full border rounded-lg px-3 py-2 mb-4"></textarea>

        <div class="flex justify-end gap-2 mt-4">
          <button @click="showEditModal = false" class="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">Cancel</button>
          <button @click="savePublishingHouse" class="px-4 py-2 bg-[var(--color-light)] text-white rounded-lg hover:bg-[var(--color-primary)]">Save</button>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="flex justify-center items-center min-h-screen bg-gray-100">
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg max-w-md text-center shadow-md">
      <strong class="font-bold">Error!</strong>
      <span class="block sm:inline ml-2"> Publishing House not found.</span>
    </div>
  </div>
</template>
