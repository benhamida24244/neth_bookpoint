<script setup>
import coverAspect from '@/assets/Auth/RegisterImg.png' // غيّر الصورة إذا أردت
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useCustomerAuthStore } from '@/stores/customerAuth.js'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()
const CustomerAuth = useCustomerAuthStore()
const emit = defineEmits(['close', 'openLogin'])

const formData = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
})

const errors = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
})

const isLoading = ref(false)

const validateForm = () => {
  let isValid = true

  // Reset errors
  Object.keys(errors).forEach((key) => {
    errors[key] = ''
  })

  // Name validation
  if (!formData.name.trim()) {
    errors.name = t('register.nameRequired')
    isValid = false
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!formData.email) {
    errors.email = t('register.emailRequired')
    isValid = false
  } else if (!emailRegex.test(formData.email)) {
    errors.email = t('register.emailInvalid')
    isValid = false
  }

  // Password validation
  if (!formData.password) {
    errors.password = t('register.passwordRequired')
    isValid = false
  } else if (formData.password.length < 6) {
    errors.password = t('register.passwordLength')
    isValid = false
  }

  // Confirm password validation
  if (!formData.password_confirmation) {
    errors.password_confirmation = t('register.confirmPasswordRequired')
    isValid = false
  } else if (formData.password !== formData.password_confirmation) {
    errors.password_confirmation = t('register.passwordsMismatch')
    isValid = false
  }

  return isValid
}

const handleRegister = async () => {
  if (!validateForm()) return

  isLoading.value = true

  // Reset all errors
  Object.keys(errors).forEach((key) => {
    errors[key] = ''
  })

  try {
    // 1. محاولة تسجيل المستخدم
    await CustomerAuth.register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      password_confirmation: formData.password_confirmation,
    })

    // 2. إذا نجح التسجيل، قم بتسجيل الدخول تلقائيًا
    const loginSuccess = await CustomerAuth.login({
      email: formData.email,
      password: formData.password,
    })

    if (loginSuccess) {
      // عند النجاح، أغلق النافذة. سيبقى المستخدم في الصفحة الحالية.
      emit('close')
    } else {
      // إذا فشل تسجيل الدخول التلقائي، أظهر نافذة تسجيل الدخول للمحاولة اليدوية.
      emit('openLogin')
    }
  } catch (error) {
    // Handle registration error
    console.error('Registration failed:', error)

    // Display server validation errors if available
    if (error.response && error.response.data && error.response.data.errors) {
      const serverErrors = error.response.data.errors

      // Map server errors to our form errors
      Object.keys(serverErrors).forEach((key) => {
        if (errors.hasOwnProperty(key)) {
          errors[key] = serverErrors[key][0] // Take the first error message
        }
      })

      // If there's a general error message, show it
      if (error.response.data.message) {
        alert(error.response.data.message)
      }
    } else {
      // Generic error message
      alert(t('register.registrationFailed'))
    }
  } finally {
    isLoading.value = false
  }
}
const handleGoogleRegister = () => {
  const googleAuthUrl = import.meta.env.VITE_API_BASE_URL + '/api/customer/auth/google/redirect'
  window.location.href = googleAuthUrl
}
</script>

<template>
  <div
    id="register-popup"
    tabindex="-1"
    class="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4 py-10"
    @click.self="emit('close')"
  >
    <div
      class="bg-white rounded-xl shadow-lg overflow-hidden max-w-3xl w-full flex flex-col md:flex-row font-BonaRegular"
    >
      <!-- صورة جانبية -->
      <div class="hidden md:block w-1/2 bg-[var(--color-primary)]">
        <img :src="coverAspect" alt="register-cover" class="h-full w-full object-cover" />
      </div>

      <!-- محتوى التسجيل -->
      <div class="w-full md:w-1/2 p-6 md:p-10 text-black relative">
        <!-- زر إغلاق -->
        <button
          type="button"
          @click="emit('close')"
          class="absolute top-4 right-4 text-gray-500 hover:text-black transition"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- العنوان -->
        <div class="mb-6 text-center">
          <h2 class="text-2xl font-bold text-[var(--color-primary)] mb-2">
            {{ t('register.title') }}
          </h2>
          <p class="text-sm text-gray-600 italic">
            {{ t('register.subtitle') }}
          </p>
        </div>

        <!-- نموذج التسجيل -->
        <form @submit.prevent="handleRegister" class="space-y-4">
          <div>
            <input
              v-model="formData.name"
              name="name"
              type="text"
              required
              :placeholder="t('register.fullNamePlaceholder')"
              class="w-full px-4 py-3 rounded-md border border-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
            />
            <p v-if="errors.name" class="text-red-500 text-sm mt-1">{{ errors.name }}</p>
          </div>

          <div>
            <input
              v-model="formData.email"
              name="email"
              type="email"
              required
              :placeholder="t('register.emailPlaceholder')"
              class="w-full px-4 py-3 rounded-md border border-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
            />
            <p v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email }}</p>
          </div>

          <div>
            <input
              v-model="formData.password"
              name="password"
              type="password"
              required
              autocomplete="new-password"
              :placeholder="t('register.passwordPlaceholder')"
              class="w-full px-4 py-3 rounded-md border border-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
            />
            <p v-if="errors.password" class="text-red-500 text-sm mt-1">{{ errors.password }}</p>
          </div>

          <div>
            <input
              v-model="formData.password_confirmation"
              name="password_confirmation"
              type="password"
              required
              autocomplete="new-password"
              :placeholder="t('register.confirmPasswordPlaceholder')"
              class="w-full px-4 py-3 rounded-md border border-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
            />
            <p v-if="errors.password_confirmation" class="text-red-500 text-sm mt-1">
              {{ errors.password_confirmation }}
            </p>
          </div>

          <button
            type="submit"
            :disabled="isLoading"
            class="w-full bg-black text-white py-3 rounded-md font-semibold hover:bg-gray-900 transition disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <span v-if="isLoading">{{ t('register.creatingAccount') }}</span>
            <span v-else>{{ t('register.createAccount') }}</span>
          </button>
        </form>

        <!-- فاصل -->
        <div class="flex items-center gap-2 my-6 text-sm text-gray-400">
          <div class="flex-grow h-px bg-gray-200"></div>
          {{ t('register.or') }}
          <div class="flex-grow h-px bg-gray-200"></div>
        </div>

        <!-- التسجيل عبر Google -->
        <button
          class="flex items-center justify-center gap-3 w-full border border-gray-300 py-2 rounded-md hover:bg-gray-100 transition"
          @click="handleGoogleRegister"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            class="h-5 w-5"
          />
          <span class="text-sm font-medium text-black">{{ t('register.googleSignUp') }}</span>
        </button>

        <!-- تحويل لتسجيل الدخول -->
        <p class="mt-6 text-center text-sm text-gray-600">
          {{ t('register.alreadyAccount') }}
          <span
            @click="emit('openLogin')"
            class="text-[var(--color-primary)] font-semibold hover:underline"
            >{{ t('register.login') }}</span
          >
        </p>
      </div>
    </div>
  </div>
</template>
