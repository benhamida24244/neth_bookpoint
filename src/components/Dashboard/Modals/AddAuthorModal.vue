<script setup>
import { ref, computed } from 'vue';
import { useAuthorStore } from '@/stores/Authors';

const authorStore = useAuthorStore();
const showModal = ref(false);

// Use a single ref for the form data
const authorForm = ref({
  name: '',
  Country: '',
  description: '',
  img: ''
});

// To keep track of the author being edited
const authorToEdit = ref(null);

// Computed property to determine the mode
const isEditMode = computed(() => !!authorToEdit.value);

// openModal can now accept an author object for editing
const openModal = (author = null) => {
  if (author) {
    // Edit mode
    authorToEdit.value = author;
    authorForm.value = { ...author }; // Copy author data to the form
  } else {
    // Add mode
    authorToEdit.value = null;
    resetForm();
  }
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

const handleSubmit = async () => {
  try {
    if (isEditMode.value) {
      await authorStore.updateAuthor(authorToEdit.value.id, authorForm.value);
    } else {
      await authorStore.addAuthor(authorForm.value);
    }
    closeModal();
  } catch (error) {
    // Optional: show an error message to the user
    console.error("Failed to submit form:", error);
    // You might want to display a notification to the user here
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
            <label for="image_url" class="block mb-1 font-medium text-sm">Image URL</label>
            <input id="image_url" v-model="authorForm.img" type="text" class="w-full border rounded-lg px-3 py-2">
          </div>
        </div>

        <div class="flex justify-end gap-3 mt-6">
          <button type="button" @click="closeModal" class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
            Cancel
          </button>
          <button type="submit" class="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)]">
            {{ isEditMode ? 'Save Changes' : 'Add Author' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
