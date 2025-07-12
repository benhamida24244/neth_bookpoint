<template>
  <div class="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 py-12 font-BonaRegular">
    <div class="text-center max-w-xl">
      <h1 class="text-[120px] font-bold leading-none text-yellow-600">404</h1>
      <h2 class="text-3xl sm:text-4xl font-semibold mt-2">Oops! Page Not Found</h2>
      <p class="text-gray-400 mt-4">
        The page you're looking for doesn’t exist or has been moved.
      </p>
      <router-link
        to="/"
        class="inline-block mt-6 px-6 py-3 bg-yellow-600 text-black font-semibold rounded-full hover:bg-yellow-700 transition-all"
      >
        ← Back to Home
      </router-link>
    </div>
  </div>
</template>
