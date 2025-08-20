<script setup>
import { ref, computed } from 'vue';
import { usePublishingHouseStore } from '@/stores/PublishingHouses';

const publishingHouseStore = usePublishingHouseStore();
const showModal = ref(false);

const publisherForm = ref({
  name: '',
  country: '',
  description: '',
  img: ''
});

const publisherToEdit = ref(null);
const imageFile = ref(null);
const imageUrl = ref('');

const isEditMode = computed(() => !!publisherToEdit.value);

const openModal = (publisher = null) => {
  if (publisher) {
    publisherToEdit.value = publisher;
    publisherForm.value = { ...publisher };
    imageUrl.value = publisher.img;
  } else {
    publisherToEdit.value = null;
    resetForm();
    imageUrl.value = '';
  }
  imageFile.value = null;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  publisherToEdit.value = null;
  resetForm();
};

const resetForm = () => {
  publisherForm.value = {
    name: '',
    country: '',
    description: '',
    img: ''
  };
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    imageFile.value = file;
    imageUrl.value = URL.createObjectURL(file);
  }
};

const handleSubmit = async () => {
  try {
    let publisherData = { ...publisherForm.value };
    delete publisherData.img;

    let response;
    if (isEditMode.value) {
      response = await publishingHouseStore.updatePublisher(publisherToEdit.value.id, publisherData);
    } else {
      response = await publishingHouseStore.addPublisher(publisherData);
    }

    if (imageFile.value) {
      const formData = new FormData();
      formData.append('img', imageFile.value);

      const publisherId = isEditMode.value ? publisherToEdit.value.id : response.data.id;
      await publishingHouseStore.uploadPublisherImage(publisherId, formData);
    }

    closeModal();
  } catch (error) {
    console.error("Failed to submit form:", error);
  }
};

defineExpose({
  openModal
});
</script>

<template>
  <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg relative">
      <h2 class="text-xl font-bold mb-4">{{ isEditMode ? 'Edit Publisher' : 'Add New Publisher' }}</h2>

      <form @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <div>
            <label for="name" class="block mb-1 font-medium text-sm">Name</label>
            <input id="name" v-model="publisherForm.name" type="text" class="w-full border rounded-lg px-3 py-2" required>
          </div>

          <div>
            <label for="country" class="block mb-1 font-medium text-sm">Country</label>
            <input id="country" v-model="publisherForm.country" type="text" class="w-full border rounded-lg px-3 py-2">
          </div>

          <div>
            <label for="description" class="block mb-1 font-medium text-sm">Description</label>
            <textarea id="description" v-model="publisherForm.description" rows="4" class="w-full border rounded-lg px-3 py-2"></textarea>
          </div>

          <div>
            <label for="image" class="block mb-1 font-medium text-sm">Upload Image</label>
            <input id="image" type="file" accept="image/*" @change="handleFileUpload" class="w-full border rounded-lg px-3 py-2">

            <div v-if="imageUrl || publisherForm.img" class="mt-2">
              <img :src="imageUrl || publisherForm.img" alt="preview" class="w-24 h-24 object-cover rounded-lg border">
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-3 mt-6">
          <button type="button" @click="closeModal" class.prevent class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
            Cancel
          </button>
          <button type="submit" class="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-hover)]">
            {{ isEditMode ? 'Save Changes' : 'Add Publisher' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
