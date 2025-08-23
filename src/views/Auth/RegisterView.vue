<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/Auth';
import coverAspect from '@/assets/Auth/RegisterImg.png';

const authStore = useAuthStore();
const name = ref('');
const email = ref('');
const password = ref('');
const password_confirmation = ref('');

const handleSubmit = async () => {
  if (password.value !== password_confirmation.value) {
    authStore.error = "Passwords do not match.";
    return;
  }
  await authStore.register({
    name: name.value,
    email: email.value,
    password: password.value,
    password_confirmation: password_confirmation.value
  });
  if (!authStore.error) {
    // Optionally close the modal on success
    // emit('close');
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
        <form class="space-y-4" @submit.prevent="handleSubmit">
          <input
            v-model="name"
            name="name"
            type="text"
            required
            placeholder="Full Name"
            class="w-full px-4 py-3 rounded-md border border-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
          />

          <input
            v-model="email"
            name="email"
            type="email"
            required
            placeholder="Email Address"
            class="w-full px-4 py-3 rounded-md border border-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
          />

          <input
            v-model="password"
            name="password"
            type="password"
            required
            placeholder="Password"
            class="w-full px-4 py-3 rounded-md border border-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
          />

          <input
            v-model="password_confirmation"
            name="confirm_password"
            type="password"
            required
            placeholder="Confirm Password"
            class="w-full px-4 py-3 rounded-md border border-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
          />

          <div v-if="authStore.error" class="text-red-500 text-sm">
            {{ authStore.error }}
          </div>

          <button
            type="submit"
            class="w-full bg-black text-white py-3 rounded-md font-semibold hover:bg-gray-900 transition"
            :disabled="authStore.loading"
          >
            {{ authStore.loading ? 'Creating Account...' : 'Create Account' }}
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
