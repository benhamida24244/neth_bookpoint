<script setup>
import coverAspect from "@/assets/Auth/LoginImg.png"
</script>

<template>
  <div
    id="login-popup"
    tabindex="-1"
    class="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4 py-10"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-xl shadow-lg overflow-hidden max-w-3xl w-full flex flex-col md:flex-row font-BonaRegular">
      <!-- صورة الغلاف -->
      <div class="hidden md:block w-1/2 bg-yellow-600">
        <img :src="coverAspect" alt="login-cover" class="h-full w-full object-cover" />
      </div>

      <!-- نموذج تسجيل الدخول -->
      <div class="w-full md:w-1/2 p-6 md:p-10 text-black">
        <!-- زر الإغلاق -->
        <button
          type="button"
          @click="$emit('close')"
          class="absolute top-4 right-4 text-gray-500 hover:text-black transition"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>

        <!-- العنوان -->
        <div class="mb-6 text-center">
          <h2 class="text-2xl font-bold text-yellow-600 mb-2">Welcome to Neth BookPoint!</h2>
          <p class="text-sm text-gray-600 italic">
            Discover a seamless way to explore books and enjoy exclusive features.
          </p>
        </div>

        <!-- النموذج -->
        <form class="space-y-4">
          <input
            name="email"
            type="email"
            required
            placeholder="Email Address"
            class="w-full px-4 py-3 rounded-md border border-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-yellow-600 focus:outline-none"
          />

          <input
            name="password"
            type="password"
            required
            placeholder="Password"
            class="w-full px-4 py-3 rounded-md border border-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-yellow-600 focus:outline-none"
          />

          <div class="text-right text-sm">
            <a href="/forgot-password" class="text-yellow-600 hover:underline">Forgot password?</a>
          </div>

          <button
            type="submit"
            class="w-full bg-black text-white py-3 rounded-md font-semibold hover:bg-gray-900 transition"
          >
            Login
          </button>
        </form>

        <!-- فاصل -->
        <div class="flex items-center gap-2 my-6 text-sm text-gray-400">
          <div class="flex-grow h-px bg-gray-200"></div>
          OR
          <div class="flex-grow h-px bg-gray-200"></div>
        </div>

        <!-- تسجيل الدخول عبر Google -->
        <button
          class="flex items-center justify-center gap-3 w-full border border-gray-300 py-2 rounded-md hover:bg-gray-100 transition"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            class="h-5 w-5"
          />
          <span class="text-sm font-medium text-black">Continue with Google</span>
        </button>

        <!-- رابط التسجيل -->
        <p class="mt-6 text-center text-sm text-gray-600">
          Don’t have an account?
          <span
          class="text-yellow-600 font-semibold hover:underline"
          @click="$emit('openRegister')"
          >Sign up</span>
        </p>
      </div>
    </div>
  </div>
</template>
