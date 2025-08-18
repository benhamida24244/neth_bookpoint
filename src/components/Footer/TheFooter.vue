<script setup>
import FooterBook from '@/assets/HomeIcon/Footer/FooterBook.png'
import { useLanguageStore } from '@/stores/language'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

const languageStore = useLanguageStore()
const { translations } = storeToRefs(languageStore)

const stats = computed(() => [
  { id: 1, Number:'800+', text: translations.value.footer?.stat1 || 'book listings' },
  { id: 2,Number:'1000+', text: translations.value.footer?.stat2 || 'registered members' },
  { id: 3,Number:'50+', text: translations.value.footer?.stat3 || 'Branch Count' }
])
</script>

<template>
  <footer class="w-full bg-black text-white py-16">
    <div class="container mx-auto grid md:grid-cols-2 gap-8 items-center px-6">
      <!-- Image Section (decorative, hidden on small screens for better mobile experience) -->
      <div class="relative hidden md:flex flex-col justify-between items-center">
        <img :src="FooterBook" class="mb-20" alt="A stack of old books with a glowing light.">
      </div>

      <!-- Content Section -->
      <div class="flex flex-col justify-center items-center md:items-start text-center md:text-left">
        <h2 class="text-4xl lg:text-5xl font-bona mb-6">
          {{ translations.footer?.promoTitle1 || 'Your Favorite' }} <span class="text-[var(--color-primary)]">{{ translations.footer?.promoTitle2 || 'Reads Are Here!' }}</span>
        </h2>
        <p class="text-white/90 mb-8 max-w-lg font-BonaRegular">
          {{ translations.footer?.promoDescription || 'Buy your favorite books online with ease! Enjoy exclusive offers and discounts on selected titles. Dive into our collection and find special deals that make reading more affordable. Shop now and unlock more savings with every purchase!' }}
        </p>

        <!-- Stats Section -->
        <ul class="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 font-BonaRegular text-[var(--color-primary)] mb-8 capitalize">
          <li v-for="stat in stats" :key="stat.id" class="whitespace-nowrap">
            <span class="font-bold text-2xl font-bona">{{ stat.Number }}</span>
            <br>
            {{ stat.text }}
          </li>
        </ul>

        <!-- Action Button -->
        <a href="/shop" class="border border-[var(--color-primary)] text-white font-bona py-3 px-8 rounded-md uppercase text-sm tracking-wider hover:bg-[var(--color-light)] hover:text-black transition-colors duration-300">
          {{ translations.footer?.explore || 'Explore More' }}
        </a>
      </div>
    </div>
  </footer>
</template>
