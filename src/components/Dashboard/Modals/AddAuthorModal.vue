<script setup>
import { ref, computed } from 'vue'
import { useAuthorStore } from '@/stores/Authors'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const AuthorStore = useAuthorStore()
const showModal = ref(false)
const isEditMode = ref(false) // لتحديد ما إذا كنا في وضع التعديل أم الإضافة

const isLoading = computed(() => AuthorStore.loading)
const error = computed(() => AuthorStore.error)

// تم تغيير الاسم ليكون أكثر عمومية
const AuthorData = ref({
  id: null,
  name: '',
  Country: '',
  descriptionKey: '',
  img: null, // لتخزين الملف الجديد المرفوع
  currentImageUrl: null, // لتخزين رابط الصورة الحالية في وضع التعديل
})
const validationError = ref('')

// تم تعديل الدالة لتقبل بيانات الناشر
const openModal = (Author = null) => {
  if (Author) {
    // وضع التعديل
    isEditMode.value = true
    AuthorData.value = {
      id: Author.id,
      name: Author.name,
      Country: Author.Country,
      descriptionKey: Author.descriptionKey,
      img: null, // نبدأ بدون ملف جديد
      currentImageUrl: Author.img, // افترض أن 'img' هو رابط الصورة
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
  AuthorData.value = {
    id: null,
    name: '',
    Country: '',
    descriptionKey: '',
    img: null,
    currentImageUrl: null,
  }
  validationError.value = ''
  AuthorStore.error = null
  const fileInput = document.getElementById('AuthorImage')
  if (fileInput) fileInput.value = ''
}

const handleAuthorFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    AuthorData.value.img = file
    // عرض معاينة للصورة المختارة حديثًا
    AuthorData.value.currentImageUrl = URL.createObjectURL(file)
  }
}

// دالة موحدة للتعامل مع الإرسال
const handleSubmit = async () => {
  if (!AuthorData.value.name.trim()) {
    validationError.value = t('dashboard.addAuthorModal.nameRequired')
    return
  }

  const formData = new FormData()
  formData.append('name', AuthorData.value.name)
  formData.append('Country', AuthorData.value.Country)
  formData.append('descriptionKey', AuthorData.value.descriptionKey)

  // إذا تم اختيار ملف صورة جديد، قم بإضافته
  if (AuthorData.value.img) {
    formData.append('img', AuthorData.value.img)
  }

  try {
    if (isEditMode.value) {
      // استدعاء دالة التحديث من الـ store
      // ملاحظة: قد تحتاج لتمرير ID بشكل منفصل حسب تصميم الـ store
      formData.append('_method', 'PUT') // بعض الـ APIs تتطلب هذا لتفعيل التحديث
      await AuthorStore.updateAuthor(AuthorData.value.id, formData)
    } else {
      // استدعاء دالة الإضافة من الـ store
      await AuthorStore.addAuthor(formData)
    }
    if (!AuthorStore.error) closeModal()
  } catch (err) {
    console.error('Failed to submit from component:', err)
  }
}
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
// --- NEW: Computed property to safely resolve the image URL ---

// Improved: Always use currentImageUrl if available, else fallback to placeholder
const imageUrl = computed(() => {
  if (AuthorData.value.currentImageUrl) {
    return AuthorData.value.currentImageUrl
  }
  return 'https://via.placeholder.com/300x450.png?text=No+Image'
})

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
            ? t('dashboard.addAuthorModal.editTitle')
            : t('dashboard.addAuthorModal.addTitle')
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
            <label for="AuthorName" class="block mb-2 font-medium"
              >{{ t('dashboard.addAuthorModal.labels.name') }} <span class="text-red-500">*</span></label
            >
            <input
              id="AuthorName"
              v-model="AuthorData.name"
              type="text"
              class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              required
            />
          </div>
          <div>
            <label for="AuthorCountry" class="block mb-2 font-medium"
              >{{ t('dashboard.addAuthorModal.labels.country') }} <span class="text-red-500">*</span></label
            >
            <input
              id="AuthorCountry"
              v-model="AuthorData.Country"
              type="text"
              class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              required
            />
          </div>
          <div>
            <label for="AuthordescriptionKey" class="block mb-2 font-medium">{{
              t('dashboard.addAuthorModal.labels.description')
            }}</label>
            <textarea
              id="AuthordescriptionKey"
              v-model="AuthorData.descriptionKey"
              rows="4"
              class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            ></textarea>
          </div>

          <div>
            <label for="AuthorImage" class="block mb-2 font-medium">{{
              t('dashboard.addAuthorModal.labels.image')
            }}</label>

            <input
              id="AuthorImage"
              @change="handleAuthorFileUpload"
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
            {{ t('dashboard.addAuthorModal.cancel') }}
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
                ? t('dashboard.addAuthorModal.saving')
                : t('dashboard.addAuthorModal.adding')
            }}</span>
            <span v-else>{{
              isEditMode
                ? t('dashboard.addAuthorModal.save')
                : t('dashboard.addAuthorModal.add')
            }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
