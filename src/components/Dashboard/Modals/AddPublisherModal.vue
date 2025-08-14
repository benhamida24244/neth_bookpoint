<script setup>
import { ref } from 'vue';
import { usePublishingHouseStore } from '@/stores/PublishingHouses';

const publishingHouseStore = usePublishingHouseStore();
const showModal = ref(false);

const newPublisher = ref({
  name: '',
  country: '',
  description: '',
  img: ''
});

const openModal = () => {
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  resetForm();
};

const resetForm = () => {
  newPublisher.value = {
    name: '',
    country: '',
    description: '',
    img: ''
  };
};

const addPublisher = () => {
  publishingHouseStore.addPublisher(newPublisher.value);
  closeModal();
};

defineExpose({
  openModal
});
</script>

<template>
  <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg relative">
      <h2 class="text-xl font-bold mb-4">Add New Publisher</h2>

      <label class="block mb-2 font-medium">Name</label>
      <input v-model="newPublisher.name" type="text" class="w-full border rounded-lg px-3 py-2 mb-4">

      <label class="block mb-2 font-medium">Country</label>
      <input v-model="newPublisher.country" type="text" class="w-full border rounded-lg px-3 py-2 mb-4">

      <label class="block mb-2 font-medium">Description</label>
      <textarea v-model="newPublisher.description" rows="4" class="w-full border rounded-lg px-3 py-2 mb-4"></textarea>

      <label class="block mb-2 font-medium">Image URL</label>
      <input v-model="newPublisher.img" type="text" class="w-full border rounded-lg px-3 py-2 mb-4">

      <div class="flex justify-end gap-2 mt-4">
        <button @click="closeModal" class="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">Cancel</button>
        <button @click="addPublisher" class="px-4 py-2 bg-[var(--color-light)] text-white rounded-lg hover:bg-[var(--color-primary)]">Add Publisher</button>
      </div>
    </div>
  </div>
</template>
