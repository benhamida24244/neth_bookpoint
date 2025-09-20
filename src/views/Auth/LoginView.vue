<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCustomerAuthStore } from '@/stores/customerAuth.js'
import coverAspect from '@/assets/Auth/LoginImg.png'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()
const authStore = useCustomerAuthStore()

// تعريف الأحداث التي يمكن إرسالها
const emit = defineEmits(['close', 'openRegister'])

const email = ref('')
const password = ref('')
const error = ref(null)

const isLoading = ref(false)

const handleLogin = async () => {
  error.value = null // Reset error
  isLoading.value = true

  const success = await authStore.login({
    email: email.value,
    password: password.value,
  })

  isLoading.value = false

  if (success) {
    // إغلاق نافذة تسجيل الدخول بعد النجاح فقط
    emit('close')
  } else {
    error.value = t('login.failed')
  }
}
const handleGoogleLogin = () => {
  const googleAuthUrl = import.meta.env.VITE_API_BASE_URL + '/api/customer/auth/google/redirect'
  window.location.href = googleAuthUrl
}
</script>

<template>
  <div
    id="login-popup"
    tabindex="-1"
    class="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4 py-10 sm:px-6 lg:px-8"
    @click.self="$emit('close')"
  >
    <div
      class="bg-white rounded-xl shadow-lg overflow-hidden max-h-[90vh] max-w-3xl w-full flex flex-col md:flex-row font-BonaRelative m-2 sm:m-0"
    >
      <!-- صورة الغلاف -->
      <div class="hidden md:block w-1/2 bg-[var(--color-primary)]">
        <img :src="coverAspect" alt="login-cover" class="h-full w-full object-cover" />
      </div>

      <!-- نموذج تسجيل الدخول -->
      <div class="w-full md:w-1/2 p-6 md:p-10 sm:p-8 text-black relative overflow-y-auto max-h-[85vh]">
        <!-- زر الإغلاق -->
        <button
          type="button"
          @click="emit('close')"
          class="absolute top-4 right-4 text-gray-500 hover:text-black transition"
        >
          <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- العنوان -->
        <div class="mb-6 text-center">
          <h2 class="text-2xl font-bold text-[var(--color-primary)] mb-2">
            {{ t('login.welcome') }}
          </h2>
          <p class="text-sm text-gray-600 italic">
            {{ t('login.discover') }}
          </p>
        </div>

        <!-- رسالة الخطأ -->
        <div
          v-if="error"
          class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4"
          role="alert"
        >
          <span class="block sm:inline">{{ error }}</span>
        </div>

        <!-- النموذج -->
        <form @submit.prevent="handleLogin" class="space-y-4">
          <input
            v-model="email"
            name="email"
            type="email"
            required
            :placeholder="t('login.emailPlaceholder')"
            class="w-full px-4 py-3 sm:px-5 rounded-md border border-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none transition"
          />

          <input
            v-model="password"
            name="password"
            type="password"
            required
            :placeholder="t('login.passwordPlaceholder')"
            class="w-full px-4 py-3 sm:px-5 rounded-md border border-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none transition"
          />

          <div class="text-right text-sm">
            <a href="/forgot-password" class="text-[var(--color-primary)] hover:underline">{{
              t('login.forgotPassword')
            }}</a>
          </div>

          <button
            type="submit"
            class="w-full bg-black text-white py-3 sm:py-4 rounded-md font-semibold hover:bg-gray-900 transition duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
            :disabled="isLoading"
          >
            <span v-if="isLoading">{{ t('login.loggingIn') }}</span>
            <span v-else>{{ t('login.login') }}</span>
          </button>
        </form>

        <!-- فاصل -->
        <div class="flex items-center gap-2 my-6 text-sm text-gray-400">
          <div class="flex-grow h-px bg-gray-200"></div>
          {{ t('login.or') }}
          <div class="flex-grow h-px bg-gray-200"></div>
        </div>

        <!-- تسجيل الدخول عبر Google -->
        <button
          @click="handleGoogleLogin"
          class="flex items-center justify-center gap-3 w-full border border-gray-300 py-2.5 sm:py-3 rounded-md hover:bg-gray-100 transition duration-300"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            class="h-4 w-4 sm:h-5 sm:w-5"
          />
          <span class="text-sm font-medium text-black">{{ t('login.googleContinue') }}</span>
        </button>

        <!-- رابط التسجيل -->
        <p class="mt-6 text-center text-sm sm:text-base text-gray-600">
          {{ t('login.noAccount') }}
          <span
            class="text-[var(--color-primary)] font-semibold hover:underline cursor-pointer transition-colors duration-300"
            @click="emit('openRegister')"
            >{{ t('login.signUp') }}</span
          >
        </p>
      </div>
    </div>
  </div>
</template>
