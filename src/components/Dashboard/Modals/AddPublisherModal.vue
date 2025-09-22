<script setup>
import { ref, computed } from 'vue'
import { usePublishingHouseStore } from '@/stores/PublishingHouses'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const publishingHouseStore = usePublishingHouseStore()
const showModal = ref(false)
const isEditMode = ref(false) // لتحديد ما إذا كنا في وضع التعديل أم الإضافة

const isLoading = computed(() => publishingHouseStore.loading)
const error = computed(() => publishingHouseStore.error)

// تم تغيير الاسم ليكون أكثر عمومية
const publisherData = ref({
  id: null,
  name: '',
  description: '',
  img: null, // لتخزين الملف الجديد المرفوع
  currentImageUrl: null, // لتخزين رابط الصورة الحالية في وضع التعديل
})
const validationError = ref('')

// تم تعديل الدالة لتقبل بيانات الناشر
const openModal = (publisher = null) => {
  if (publisher) {
    // وضع التعديل
    isEditMode.value = true
    publisherData.value = {
      id: publisher.id,
      name: publisher.name,
      description: publisher.description,
      img: null, // نبدأ بدون ملف جديد
      currentImageUrl: publisher.img, // افترض أن 'img' هو رابط الصورة
    }
  } else {
    // وضع الإضافة
    isEditMode.value = false
    resetForm() // نتأكد من أن النموذج فارغ
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  // نؤخر إعادة التعيين قليلاً لتحسين التأثير البصري عند الإغلاق
  setTimeout(resetForm, 300)
}

const resetForm = () => {
  isEditMode.value = false
  publisherData.value = { id: null, name: '', description: '', img: null, currentImageUrl: null }
  validationError.value = ''
  publishingHouseStore.error = null
  const fileInput = document.getElementById('publisherImage')
  if (fileInput) fileInput.value = ''
}

const handlePublisherFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    publisherData.value.img = file
    // عرض معاينة للصورة المختارة حديثًا
    publisherData.value.currentImageUrl = URL.createObjectURL(file)
  }
}

// دالة موحدة للتعامل مع الإرسال
const handleSubmit = async () => {
  if (!publisherData.value.name.trim()) {
    validationError.value = t('dashboard.addPublisherModal.nameRequired')
    return
  }

  const formData = new FormData()
  formData.append('name', publisherData.value.name)
  formData.append('description', publisherData.value.description)

  // إذا تم اختيار ملف صورة جديد، قم بإضافته
  if (publisherData.value.img) {
    formData.append('img', publisherData.value.img)
  }

  try {
    if (isEditMode.value) {
      // استدعاء دالة التحديث من الـ store
      // ملاحظة: قد تحتاج لتمرير ID بشكل منفصل حسب تصميم الـ store
      formData.append('_method', 'PUT') // بعض الـ APIs تتطلب هذا لتفعيل التحديث
      await publishingHouseStore.updatePublisher(publisherData.value.id, formData)
    } else {
      // استدعاء دالة الإضافة من الـ store
      await publishingHouseStore.addPublisher(formData)
    }
    if (!publishingHouseStore.error) closeModal()
  } catch (err) {
    console.error('Failed to submit from component:', err)
  }
}

// كشف الدالة openModal للمكون الأب
defineExpose({ openModal })
</script>

<template>
  <div
    v-if="showModal"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity"
  >
    <div
      class="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg relative transform transition-all"
      @click.stop
    >
      <h2 class="text-xl font-bold mb-4">
        {{
          isEditMode
            ? t('dashboard.addPublisherModal.editTitle')
            : t('dashboard.addPublisherModal.addTitle')
        }}
      </h2>

      <div
        v-if="validationError || error"
        class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
        role="alert"
      >
        <span class="block sm:inline">{{ validationError || error }}</span>
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <div>
            <label for="publisherName" class="block mb-2 font-medium"
              >{{ t('dashboard.addPublisherModal.labels.name') }} <span class="text-red-500">*</span></label
            >
            <input
              id="publisherName"
              v-model="publisherData.name"
              type="text"
              class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              required
            />
          </div>

          <div>
            <label for="publisherDescription" class="block mb-2 font-medium">{{
              t('dashboard.addPublisherModal.labels.description')
            }}</label>
            <textarea
              id="publisherDescription"
              v-model="publisherData.description"
              rows="4"
              class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            ></textarea>
          </div>

          <div>
            <label for="publisherImage" class="block mb-2 font-medium">{{
              t('dashboard.addPublisherModal.labels.image')
            }}</label>
            <div v-if="publisherData.currentImageUrl" class="mt-2 mb-4">
              <img
                :src="publisherData.currentImageUrl"
                :alt="t('dashboard.addPublisherModal.imagePreview')"
                class="h-24 w-24 object-cover rounded-md border"
              />
            </div>
            <input
              id="publisherImage"
              @change="handlePublisherFileUpload"
              type="file"
              accept="image/*"
              class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-[var(--color-primary)] hover:file:bg-blue-100"
            />
          </div>
        </div>

        <div class="flex justify-end gap-2 mt-6">
          <button
            type="button"
            @click="closeModal"
            class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
            :disabled="isLoading"
          >
            {{ t('dashboard.addPublisherModal.cancel') }}
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-opacity-90 flex items-center"
            :disabled="isLoading"
          >
            <svg
              v-if="isLoading"
              class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span v-if="isLoading">{{
              isEditMode
                ? t('dashboard.addPublisherModal.saving')
                : t('dashboard.addPublisherModal.adding')
            }}</span>
            <span v-else>{{
              isEditMode
                ? t('dashboard.addPublisherModal.save')
                : t('dashboard.addPublisherModal.add')
            }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
