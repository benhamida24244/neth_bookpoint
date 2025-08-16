<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <div class="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 font-sans relative">
      <!-- العنوان -->
      <h2 class="text-2xl font-bold text-center text-[var(--color-primary)]">
        Admin Login
      </h2>
      <p class="text-center text-gray-500 text-sm mb-6">
        Please sign in with your admin account
      </p>

      <!-- رسالة خطأ (عرض اختياري) -->
      <div class="hidden mb-4 p-3 text-sm text-red-600 bg-red-100 rounded-lg">
        Invalid credentials. Please try again.
      </div>

      <!-- النموذج -->
      <form class="space-y-4">
        <input
          type="email"
          required
          placeholder="Admin Email"
          class="w-full px-4 py-3 rounded-lg border border-gray-300
                 focus:ring-2 focus:ring-[var(--color-primary)]
                 focus:outline-none"
        />

        <input
          type="password"
          required
          placeholder="Password"
          class="w-full px-4 py-3 rounded-lg border border-gray-300
                 focus:ring-2 focus:ring-[var(--color-primary)]
                 focus:outline-none"
        />

        <button
          type="submit"
          class="w-full py-3 rounded-lg font-semibold text-white
                 bg-[var(--color-primary)] hover:opacity-90
                 transition"
        >
          Login
        </button>
      </form>

      <!-- رابط العودة للموقع -->
      <p class="mt-6 text-center text-sm text-gray-600">
        Back to
        <a href="/" class="text-[var(--color-primary)] font-semibold hover:underline">
          Home
        </a>
      </p>
    </div>
  </div>
</template>
