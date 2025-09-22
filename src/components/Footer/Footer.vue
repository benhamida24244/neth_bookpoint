<script setup>
import FooterBook from '@/assets/HomeIcon/Footer/FooterBook.png'
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

const { t } = useI18n()

const stats = computed(() => [
  { id: 1, Number:'800+', text: t('footer.stat1') },
  { id: 2,Number:'1000+', text: t('footer.stat2') },
  { id: 3,Number:'50+', text: t('footer.stat3') }
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
          {{ t('footer.promoTitle1') }} <span class="text-[var(--color-primary)]">{{ t('footer.promoTitle2') }}</span>
        </h2>
        <p class="text-white/90 mb-8 max-w-lg font-BonaRegular">
          {{ t('footer.promoDescription') }}
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
          {{ t('footer.explore') }}
        </a>
      </div>
    </div>
  </footer>
</template>
