<template>
  <aside class="w-full bg-white text-gray-900 p-4 font-BonaRegular rounded-lg shadow-md overflow-y-auto">
    <!-- Title -->
    <h2 class="text-xl font-bold text-[var(--color-primary)] mb-6">{{ $t('sidebar.title') }}</h2>

    <!-- Popular Sections -->
    <section class="mb-6">
      <h3 class="text-[var(--color-primary)] font-semibold mb-3">{{ $t('sidebar.popularSections.title') }}</h3>
      <ul class="space-y-1 text-sm">
        <li v-for="item in popularSections" :key="item">
          <a href="#" class="block px-2 py-1 rounded hover:bg-yellow-50 transition">{{ item }}</a>
        </li>
      </ul>
    </section>
    <hr class="my-4 border-gray-200" />

    <!-- Subjects -->
    <section class="mb-6">
      <h3 class="text-[var(--color-primary)] font-semibold mb-3">{{ $t('sidebar.subjects') }}</h3>
      <!-- Show a loading message while fetching categories -->
      <div v-if="isLoading" class="text-sm text-gray-500">{{ $t('sidebar.loadingCategories') }}</div>
      <!-- Show a message if there are no categories -->
      <div v-else-if="allCategories.length === 0" class="text-sm text-gray-500">{{ $t('sidebar.noCategories') }}</div>
      <!-- Display the list of categories -->
      <ul v-else class="space-y-1 text-sm">
        <li v-for="category in allCategories" :key="category.id">
          <a :href="category.url" class="block px-2 py-1 rounded hover:bg-yellow-50 transition">{{ category.name }}</a>
        </li>
      </ul>
    </section>
    <hr class="my-4 border-gray-200" />

    <!-- Price -->
    <section class="mb-6">
      <h3 class="text-[var(--color-primary)] font-semibold mb-3">{{ $t('sidebar.price.title') }}</h3>
      <ul class="space-y-1 text-sm">
        <li v-for="item in prices" :key="item">
          <a href="#" class="block px-2 py-1 rounded hover:bg-yellow-50 transition">{{ item }}</a>
        </li>
      </ul>
    </section>
    <hr class="my-4 border-gray-200" />

    <!-- حسب العمر -->
    <section class="mb-6">
      <h3 class="text-[var(--color-primary)] font-semibold mb-3">{{ $t('sidebar.age.title') }}</h3>
      <ul class="space-y-1 text-sm">
        <li v-for="item in ages" :key="item">
          <a href="#" class="block px-2 py-1 rounded hover:bg-yellow-50 transition">{{ item }}</a>
        </li>
      </ul>
    </section>
    <hr class="my-4 border-gray-200" />

    <!-- حسب اللغة -->
    <section>
      <h3 class="text-[var(--color-primary)] font-semibold mb-3">{{ $t('sidebar.language.title') }}</h3>
      <ul class="columns-2 gap-4 text-sm space-y-1">
        <li v-for="item in languages" :key="item">
          <a href="#" class="block px-2 py-1 rounded hover:bg-yellow-50 transition">{{ item }}</a>
        </li>
      </ul>
    </section>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useCategoriesStore } from '@/stores/Categories';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

// Access the categories store
const categoriesStore = useCategoriesStore();

// Get all categories from the store using the allCategories getter
const allCategories = computed(() => categoriesStore.allCategories);

// Get the loading state from the store
const isLoading = computed(() => categoriesStore.isLoading);

console.log('allCategories', allCategories.value);

const popularSections = computed(() => [
  t('sidebar.popularSections.customerFavorites'),
  t('sidebar.popularSections.bestsellers'),
  t('sidebar.popularSections.teensYABestsellers'),
  t('sidebar.popularSections.kidsBestsellers'),
  t('sidebar.popularSections.nyTimesBestsellers'),
  t('sidebar.popularSections.newReleases'),
  t('sidebar.popularSections.comingSoon'),
  t('sidebar.popularSections.specialValues'),
  t('sidebar.popularSections.paperbacksUpTo25Off'),
  t('sidebar.popularSections.bestsellers30Off'),
  t('sidebar.popularSections.bookAnnex'),
  t('sidebar.popularSections.bnCollectibleEditions'),
  t('sidebar.popularSections.specialCollections'),
  t('sidebar.popularSections.bestBooksOf2025'),
  t('sidebar.popularSections.ourMonthlyPicks'),
  t('sidebar.popularSections.bookClubSelections'),
  t('sidebar.popularSections.bnExclusives'),
  t('sidebar.popularSections.thePaperbackStore'),
  t('sidebar.popularSections.bookAwards'),
  t('sidebar.popularSections.boxedSets'),
  t('sidebar.popularSections.signedSpecialEditions'),
]);

const prices = computed(() => [
  t('sidebar.price.under5'),
  t('sidebar.price.p5to10'),
  t('sidebar.price.p10to25'),
  t('sidebar.price.p25to50'),
  t('sidebar.price.over50'),
]);

const ages = computed(() => [
  t('sidebar.age.a0to2'),
  t('sidebar.age.a3to5'),
  t('sidebar.age.a6to8'),
  t('sidebar.age.a9to12'),
  t('sidebar.age.teens'),
]);

const languages = computed(() => [
  t('sidebar.language.english'),
  t('sidebar.language.german'),
  t('sidebar.language.french'),
  t('sidebar.language.spanish'),
  t('sidebar.language.russian'),
  t('sidebar.language.italian'),
  t('sidebar.language.portuguese'),
  t('sidebar.language.finnish'),
  t('sidebar.language.welsh'),
  t('sidebar.language.panjabi'),
  t('sidebar.language.arabic'),
  t('sidebar.language.chinese'),
  t('sidebar.language.dutch'),
  t('sidebar.language.polish'),
  t('sidebar.language.turkish'),
]);
</script>
