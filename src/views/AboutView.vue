<script setup>
import About from '@/assets/AboutIcon/About.png'
import { onMounted } from 'vue'
import { useLanguageStore } from '@/stores/language'
import { storeToRefs } from 'pinia'

const languageStore = useLanguageStore()
const { translations } = storeToRefs(languageStore)

onMounted(()=> {
  window.scrollTo(0,0)
})
</script>

<template>
  <div class="w-full bg-black text-white font-BonaRegular">
    <!-- صورة العنوان -->
    <div class="flex justify-center py-6">
      <img :src="About" alt="About Us" />
    </div>

    <!-- About Us -->
    <div class="px-6 py-4">
      <h2 class="text-3xl font-bold text-[var(--color-primary)] mb-3 border-b border-[var(--color-primary)] inline-block pb-1">{{ translations.about?.title || 'About Us' }}</h2>
      <p class="text-lg leading-relaxed text-gray-200" v-html="translations.about?.welcome || ''"></p>
    </div>

    <!-- Branches -->
    <div class="px-6 py-4 mt-6">
      <h2 class="text-3xl font-bold text-[var(--color-primary)] mb-6 border-b border-[var(--color-primary)] inline-block pb-1">{{ translations.about?.branchesTitle || 'Our Branches' }}</h2>
      <div class="grid gap-6 md:grid-cols-3">
        <div class=" bg-opacity-10 p-4 rounded-lg border border-[var(--color-primary)]">
          <h3 class="text-[var(--color-light)] font-semibold text-lg mb-2">{{ translations.about?.kurunegalaBranch?.title || 'Kurunegala Branch' }}</h3>
          <p v-html="translations.about?.kurunegalaBranch?.details || ''"></p>
        </div>
        <div class=" bg-opacity-10 p-4 rounded-lg border border-[var(--color-primary)]">
          <h3 class="text-[var(--color-light)] font-semibold text-lg mb-2">{{ translations.about?.kandyBranch?.title || 'Kandy Branch' }}</h3>
          <p v-html="translations.about?.kandyBranch?.details || ''"></p>
        </div>
        <div class=" bg-opacity-10 p-4 rounded-lg border border-[var(--color-primary)]">
          <h3 class="text-[var(--color-light)] font-semibold text-lg mb-2">{{ translations.about?.colomboBranch?.title || 'Colombo Branch' }}</h3>
          <p v-html="translations.about?.colomboBranch?.details || ''"></p>
        </div>
      </div>
    </div>

    <!-- Our Commitment -->
    <div class="px-6 py-8 mt-6 text-center">
      <h2 class="text-3xl font-bold text-[var(--color-primary)] mb-3 border-b border-[var(--color-primary)] inline-block pb-1">{{ translations.about?.commitmentTitle || 'Our Commitment' }}</h2>
      <p class="text-lg text-left leading-relaxed text-gray-200" v-html="translations.about?.commitmentText || ''">
      </p>
    </div>
  </div>
</template>
