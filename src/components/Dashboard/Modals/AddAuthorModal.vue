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
  } else {
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

// رفع الصورة وتخزين رابطها
const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file);

  try {
    let response;
    if (isEditMode.value) {
      // رفع الصورة لمؤلف موجود
      response = await apiService.uploadAuthorLogo(authorToEdit.value.id, formData);
    } else {
      // رفع صورة جديدة لمؤلف جديد (يمكنك تعديل API حسب الحاجة)
      response = await apiService.uploadAuthorLogo(null, formData);
    }

    // افترض أن API يعيد { url: "link_to_image" }
    authorForm.value.img = response.url;
  } catch (error) {
    console.error("Upload failed:", error);
  }
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

            <div v-if="authorForm.img" class="mt-2">
              <img :src="authorForm.img" alt="preview" class="w-24 h-24 object-cover rounded-lg border">
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
