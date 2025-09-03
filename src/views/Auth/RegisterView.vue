<script setup>
import coverAspect from '@/assets/Auth/RegisterImg.png' // غيّر الصورة إذا أردت
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useCustomerAuthStore } from '@/stores/customerAuth.js';

const router = useRouter();
const CustomerAuth = useCustomerAuthStore();

const formData = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: ''
});

const errors = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: ''
});

const isLoading = ref(false);

const validateForm = () => {
  let isValid = true;

  // Reset errors
  Object.keys(errors).forEach(key => {
    errors[key] = '';
  });

  // Name validation
  if (!formData.name.trim()) {
    errors.name = 'Name is required';
    isValid = false;
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formData.email) {
    errors.email = 'Email is required';
    isValid = false;
  } else if (!emailRegex.test(formData.email)) {
    errors.email = 'Please enter a valid email';
    isValid = false;
  }

  // Password validation
  if (!formData.password) {
    errors.password = 'Password is required';
    isValid = false;
  } else if (formData.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
    isValid = false;
  }

  // Confirm password validation
  if (!formData.password_confirmation) {
    errors.password_confirmation = 'Please confirm your password';
    isValid = false;
  } else if (formData.password !== formData.password_confirmation) {
    errors.password_confirmation = 'Passwords do not match';
    isValid = false;
  }

  return isValid;
};

const handleRegister = async () => {
  if (!validateForm()) return;

  isLoading.value = true;

  // Reset all errors
  Object.keys(errors).forEach(key => {
    errors[key] = '';
  });

  try {
    await CustomerAuth.register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      password_confirmation: formData.password_confirmation
    });

    // Registration successful, redirect to home or login
    router.push('/');
  } catch (error) {
    // Handle registration error
    console.error('Registration failed:', error);

    // Display server validation errors if available
    if (error.response && error.response.data && error.response.data.errors) {
      const serverErrors = error.response.data.errors;

      // Map server errors to our form errors
      Object.keys(serverErrors).forEach(key => {
        if (errors.hasOwnProperty(key)) {
          errors[key] = serverErrors[key][0]; // Take the first error message
        }
      });

      // If there's a general error message, show it
      if (error.response.data.message) {
        alert(error.response.data.message);
      }
    } else {
      // Generic error message
      alert('Registration failed. Please try again.');
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div
    id="register-popup"
    tabindex="-1"
    class="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4 py-10"
    @click.self="$emit('close')"
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
          @click="$emit('close')"
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
          <h2 class="text-2xl font-bold text-[var(--color-primary)] mb-2">Create Your Account</h2>
          <p class="text-sm text-gray-600 italic">
            Join the Neth BookPoint community and enjoy a personalized book experience.
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
              placeholder="Full Name"
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
              placeholder="Email Address"
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
              placeholder="Password"
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
              placeholder="Confirm Password"
              class="w-full px-4 py-3 rounded-md border border-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
            />
            <p v-if="errors.password_confirmation" class="text-red-500 text-sm mt-1">{{ errors.password_confirmation }}</p>
          </div>

          <button
            type="submit"
            :disabled="isLoading"
            class="w-full bg-black text-white py-3 rounded-md font-semibold hover:bg-gray-900 transition disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <span v-if="isLoading">Creating Account...</span>
            <span v-else>Create Account</span>
          </button>
        </form>

        <!-- فاصل -->
        <div class="flex items-center gap-2 my-6 text-sm text-gray-400">
          <div class="flex-grow h-px bg-gray-200"></div>
          OR
          <div class="flex-grow h-px bg-gray-200"></div>
        </div>

        <!-- التسجيل عبر Google -->
        <button
          class="flex items-center justify-center gap-3 w-full border border-gray-300 py-2 rounded-md hover:bg-gray-100 transition"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            class="h-5 w-5"
          />
          <span class="text-sm font-medium text-black">Sign up with Google</span>
        </button>

        <!-- تحويل لتسجيل الدخول -->
        <p class="mt-6 text-center text-sm text-gray-600">
          Already have an account?
          <span @click="$emit('openLogin')" class="text-[var(--color-primary)] font-semibold hover:underline"
            >Login</span
          >
        </p>
      </div>
    </div>
  </div>
</template>
