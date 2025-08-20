<script setup>
import { ref, computed } from 'vue';
import { useAuthorStore } from '@/stores/Authors';
import apiService from '@/services/api';

const authorStore = useAuthorStore();
const showModal = ref(false);

const authorForm = ref({
  name: '',
  Country: '',
  description: '',
  img: ''
});

const authorToEdit = ref(null);

const isEditMode = computed(() => !!authorToEdit.value);

const openModal = (author = null) => {
  if (author) {
    authorToEdit.value = author;
    authorForm.value = { ...author };
    imageUrl.value = author.img; // Set initial image preview
  } else {
    authorToEdit.value = null;
    resetForm();
    imageUrl.value = ''; // Clear image preview
  }
  imageFile.value = null; // Reset file input
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  authorToEdit.value = null;
  resetForm();
};

const resetForm = () => {
  authorForm.value = {
    name: '',
    Country: '',
    description: '',
    img: ''
  };
};

const imageFile = ref(null);
const imageUrl = ref('');

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    imageFile.value = file;
    imageUrl.value = URL.createObjectURL(file); // Create a local URL for preview
  }
};

const handleSubmit = async () => {
  try {
    // 1. Add or update author textual data
    let authorData = { ...authorForm.value };
    delete authorData.img; // Remove img property before sending

    let response;
    if (isEditMode.value) {
      response = await authorStore.updateAuthor(authorToEdit.value.id, authorData);
    } else {
      response = await authorStore.addAuthor(authorData);
    }

    // 2. If there's a new image, upload it
    if (imageFile.value) {
      const formData = new FormData();
      formData.append('img', imageFile.value);

      const authorId = isEditMode.value ? authorToEdit.value.id : response.data.id;
      await authorStore.uploadAuthorImage(authorId, formData);
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
      <h2 class="text-xl font-bold mb-4">{{ isEditMode ? 'Edit Author' : 'Add New Author' }}</h2>

      <form @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <div>
            <label for="name" class="block mb-1 font-medium text-sm">Name</label>
            <input id="name" v-model="authorForm.name" type="text" class="w-full border rounded-lg px-3 py-2" required>
          </div>

          <div>
            <label for="country" class="block mb-1 font-medium text-sm">Country</label>
            <input id="country" v-model="authorForm.Country" type="text" class="w-full border rounded-lg px-3 py-2">
          </div>

          <div>
            <label for="description" class="block mb-1 font-medium text-sm">Description</label>
            <textarea id="description" v-model="authorForm.description" rows="4" class="w-full border rounded-lg px-3 py-2"></textarea>
          </div>

          <div>
            <label for="image" class="block mb-1 font-medium text-sm">Upload Image</label>
            <input id="image" type="file" accept="image/*" @change="handleFileUpload" class="w-full border rounded-lg px-3 py-2">

            <div v-if="imageUrl || authorForm.img" class="mt-2">
              <img :src="imageUrl || authorForm.img" alt="preview" class="w-24 h-24 object-cover rounded-lg border">
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-3 mt-6">
          <button type="button" @click="closeModal" class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
            Cancel
          </button>
          <button type="submit" class="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-hover)]">
            {{ isEditMode ? 'Save Changes' : 'Add Author' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
