<script setup>
import { ref } from 'vue';
import { usePublishingHouseStore } from '@/stores/PublishingHouses';
import apiService from '@/services/api'; // 1. تم استيراد apiService

const publishingHouseStore = usePublishingHouseStore();
const showModal = ref(false);

const isLoading = computed(() => publishingHouseStore.loading);
const error = computed(() => publishingHouseStore.error);

const newPublisher = ref({
  name: '',
  country: '',
  description: '',
  img: '' // سيحتوي على رابط الصورة (URL) وليس الملف
});
const validationError = ref('');

// 2. دالة جديدة لرفع الصورة فور اختيارها
const handlePublisherFileUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  // الخادم يتوقع الحقل باسم 'image' كما في مثال المؤلف الناجح
  formData.append('image', file);

  try {
    // نفترض أن لديك دالة مشابهة لرفع صورة الناشر في apiService
    // نستخدم '0' كـ id مؤقت للناشر الجديد كما في مثال المؤلف
    const response = await apiService.uploadPublisherLogo(newPublisher.value.id, formData);

    // حفظ رابط الصورة العائد من الخادم
    if (response && response.data && response.data.url) {
      newPublisher.value.img = response.data.url;
    } else if (response && response.url) { // Fallback
      newPublisher.value.img = response.url;
    }
  } catch (error) {
    validationError.value = "Image upload failed. Please try again.";
    console.error("Publisher image upload failed:", error);
  }
};

const openModal = () => {
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
  validationError.value = '';
  publishingHouseStore.error = null;
  const fileInput = document.getElementById('publisherImage');
  if (fileInput) fileInput.value = '';
};

// 3. تم تبسيط دالة الإضافة
const addPublisher = async () => {
  if (!newPublisher.value.name.trim()) {
    validationError.value = 'Publisher name is required.';
    return;
  }
  validationError.value = '';

  try {
    // الآن نرسل الكائن مباشرة، فهو يحتوي على رابط الصورة وليس الملف
    await publishingHouseStore.addPublisher(newPublisher.value);

    if (!publishingHouseStore.error) {
      closeModal();
    }
  } catch (err) {
    console.error("Failed to add publisher from component:", err);
  }
};

defineExpose({
  openModal
});
</script>

<template>
  <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity">
    <div class="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg relative transform transition-all" @click.stop>
      <h2 class="text-xl font-bold mb-4">Add New Publisher</h2>

      <div v-if="validationError" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
        <span class="block sm:inline">{{ validationError }}</span>
      </div>

      <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
        <span class="block sm:inline">{{ error }}</span>
      </div>

      <form @submit.prevent="addPublisher">
        <div class="space-y-4">
          <div>
            <label for="publisherName" class="block mb-2 font-medium">Name <span class="text-red-500">*</span></label>
            <input id="publisherName" v-model="newPublisher.name" type="text" class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" required>
          </div>

          <div>
            <label for="publisherDescription" class="block mb-2 font-medium">Description</label>
            <textarea id="publisherDescription" v-model="newPublisher.description" rows="4" class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"></textarea>
          </div>

          <div>
            <label for="publisherImage" class="block mb-2 font-medium">Image</label>
            <input id="publisherImage"   @change="handlePublisherFileUpload" type="file" accept="image/*"
            class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-[var(--color-primary)] hover:file:bg-blue-100">
          </div>
        </div>

        <div class="flex justify-end gap-2 mt-6">
          <button type="button" @click="closeModal" class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300" :disabled="isLoading">Cancel</button>
          <button type="submit" class="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-opacity-90 flex items-center" :disabled="isLoading">
            <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isLoading ? 'Adding...' : 'Add Publisher' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
