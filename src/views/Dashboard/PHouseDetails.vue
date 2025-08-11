<script setup>
import { usePublishingHouseStore } from '@/stores/PublishingHouses';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';

const publishingHouseStore = usePublishingHouseStore();
const { publishingHouses } = storeToRefs(publishingHouseStore);
const route = useRoute();

const showEditModal = ref(false);
const editForm = ref({ name: '', description: '', img: '' });

const currentPublishingHouse = computed(() => {
  const houseId = Number(route.params.id);
  if (!houseId || !Array.isArray(publishingHouses.value)) return null;
  return publishingHouses.value.find(house => house.id === houseId) || null;
});

function openEditModal() {
  if (currentPublishingHouse.value) {
    editForm.value = {
      name: currentPublishingHouse.value.name,
      description: currentPublishingHouse.value.description,
      img: currentPublishingHouse.value.img
    };
    showEditModal.value = true;
  }
}

function savePublishingHouse() {
  if (!currentPublishingHouse.value) return;
  currentPublishingHouse.value.name = editForm.value.name;
  currentPublishingHouse.value.description = editForm.value.description;
  currentPublishingHouse.value.img = editForm.value.img;
  showEditModal.value = false;
}
</script>

<template>
  <div v-if="currentPublishingHouse" class="min-h-screen bg-gray-100 font-sans text-gray-800 p-4 sm:p-6 lg:p-8 relative">
    <div class="max-w-5xl mx-auto bg-white rounded-xl shadow-md overflow-hidden md:flex">
      <div class="md:flex-shrink-0">
        <img class="h-full w-full object-cover md:w-64" :src="currentPublishingHouse.img" :alt="`Logo of ${currentPublishingHouse.name}`">
      </div>
      <div class="p-8 flex-grow relative">
        <button
          @click="openEditModal"
          class="absolute right-6 top-6 bg-yellow-500 px-4 py-2 rounded-lg text-white font-semibold hover:bg-yellow-600 transition"
        >
          ✏️ Edit
        </button>
        <div class="uppercase tracking-wide text-sm text-yellow-600 font-semibold">{{ currentPublishingHouse.country }}</div>
        <h1 class="block mt-1 text-4xl leading-tight font-bold text-gray-900">{{ currentPublishingHouse.name }}</h1>
        <a :href="`mailto:${currentPublishingHouse.email}`" class="mt-2 text-gray-500 hover:text-yellow-700 transition-colors block">{{ currentPublishingHouse.email }}</a>
        <a :href="currentPublishingHouse.url" target="_blank" class="mt-1 text-blue-600 hover:underline block">{{ currentPublishingHouse.url }}</a>
        <p class="mt-4 text-gray-700">{{ currentPublishingHouse.description }}</p>

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

        <label class="block mb-2 font-medium">Description</label>
        <textarea v-model="editForm.description" rows="4" class="w-full border rounded-lg px-3 py-2 mb-4"></textarea>

        <label class="block mb-2 font-medium">Image URL</label>
        <input v-model="editForm.img" type="text" class="w-full border rounded-lg px-3 py-2 mb-4">

        <div class="flex justify-end gap-2 mt-4">
          <button @click="showEditModal = false" class="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">Cancel</button>
          <button @click="savePublishingHouse" class="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">Save</button>
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
