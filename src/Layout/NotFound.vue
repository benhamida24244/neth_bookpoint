<template>
  <div
    class="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 py-12 font-BonaRegular"
  >
    <div class="text-center max-w-xl">
      <h1 class="text-[120px] font-bold leading-none text-[var(--color-primary)]">404</h1>
      <h2 class="text-3xl sm:text-4xl font-semibold mt-2">{{ t('notFound.title') }}</h2>
      <p class="text-gray-400 mt-4">
        {{ t('notFound.message') }}
      </p>
      <router-link
        to="/"
        class="inline-block mt-6 px-6 py-3 bg-[var(--color-primary)] text-black font-semibold rounded-full hover:bg-[var(--color-primary)] transition-all"
      >
        ← {{ t('notFound.backToHome') }}
      </router-link>
    </div>
  </div>
</template>
