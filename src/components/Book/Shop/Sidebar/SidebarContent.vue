<template>
  <aside
    class="w-full bg-white text-gray-900 p-4 font-BonaRegular rounded-lg shadow-md overflow-y-auto"
  >
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-bold text-[var(--color-primary)]">{{ t('sidebar.title') }}</h2>
      <button v-if="hasActiveFilters" @click="clearFilters" class="text-sm text-red-500 hover:underline">
        {{ t('sidebar.clear') }}
      </button>
    </div>

    <!-- Popular Sections -->
    <section class="mb-6">
      <h3 class="text-[var(--color-primary)] font-semibold mb-3">
        {{ t('sidebar.popularSections.title') }}
      </h3>
      <ul class="space-y-1 text-sm">
        <li v-for="item in popularSections" :key="item">
          <button
            @click="selectFilter('popular', item)"
            :class="[
              'w-full text-left block px-2 py-1 rounded hover:bg-yellow-50 transition',
              { 'bg-yellow-100 font-semibold': selectedPopular === item },
            ]"
          >
            {{ item }}
          </button>
        </li>
      </ul>
    </section>
    <hr class="my-4 border-gray-200" />

    <!-- Subjects -->
    <section class="mb-6">
      <h3 class="text-[var(--color-primary)] font-semibold mb-3">{{ t('sidebar.subjects') }}</h3>
      <!-- Show a loading message while fetching categories -->
      <div v-if="isLoading" class="text-sm text-gray-500">
        {{ t('sidebar.loadingCategories') }}
      </div>
      <!-- Show a message if there are no categories -->
      <div v-else-if="allCategories.length === 0" class="text-sm text-gray-500">
        {{ t('sidebar.noCategories') }}
      </div>
      <!-- Display the list of categories -->
      <ul v-else class="space-y-1 text-sm">
        <li v-for="category in allCategories" :key="category.id">
          <button
            @click="selectFilter('category', category.id)"
            :class="[
              'w-full text-left block px-2 py-1 rounded hover:bg-yellow-50 transition',
              { 'bg-yellow-100 font-semibold': selectedCategory === category.id },
            ]"
          >
            {{ category.name }}
          </button>
        </li>
      </ul>
    </section>
    <hr class="my-4 border-gray-200" />

    <!-- Price -->
    <section class="mb-6">
      <h3 class="text-[var(--color-primary)] font-semibold mb-3">{{ t('sidebar.price.title') }}</h3>
      <ul class="space-y-1 text-sm">
        <li v-for="price in prices" :key="price.label">
          <button
            @click="selectFilter('price', price.value)"
            :class="[
              'w-full text-left block px-2 py-1 rounded hover:bg-yellow-50 transition',
              { 'bg-yellow-100 font-semibold': selectedPrice === price.value },
            ]"
          >
            {{ price.label }}
          </button>
        </li>
      </ul>
    </section>
    <hr class="my-4 border-gray-200" />

    <!-- حسب العمر -->
    <section class="mb-6">
      <h3 class="text-[var(--color-primary)] font-semibold mb-3">{{ t('sidebar.ageRanges.title') }}</h3>
      <ul class="space-y-1 text-sm">
        <li v-for="age in ages" :key="age">
          <button
            @click="selectFilter('age', age.toLowerCase())"
            :class="[
              'w-full text-left block px-2 py-1 rounded hover:bg-yellow-50 transition',
              { 'bg-yellow-100 font-semibold': selectedAge === age },
            ]"
          >
            {{ age }}
          </button>
        </li>
      </ul>
    </section>
    <hr class="my-4 border-gray-200" />

    <!-- حسب اللغة -->
    <section>
      <h3 class="text-[var(--color-primary)] font-semibold mb-3">{{ t('sidebar.language.title') }}</h3>
      <ul class="columns-2 gap-4 text-sm space-y-1">
        <li v-for="item in languages" :key="item">
          <button
            @click="selectFilter('language', item.trim().slice(0, 2).toLowerCase())"
            :class="[
              'w-full text-left block px-2 py-1 rounded hover:bg-yellow-50 transition',
              { 'bg-yellow-100 font-semibold': selectedLanguage === item },
            ]"
          >
            {{ item }}
          </button>
        </li>
      </ul>
    </section>
  </aside>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useCategoriesStore } from '@/stores/Categories'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const emit = defineEmits(['filters-changed'])
const categoriesStore = useCategoriesStore()

const allCategories = computed(() => categoriesStore.allCategories)
const isLoading = computed(() => categoriesStore.isLoading)

const selectedCategory = ref<number | null>(null)
const selectedPrice = ref<string | null>(null)
const selectedAge = ref<string | null>(null)
const selectedLanguage = ref<string | null>(null)
const selectedPopular = ref<string | null>(null)

const hasActiveFilters = computed(() => {
  return (
    selectedCategory.value !== null ||
    selectedPrice.value !== null ||
    selectedAge.value !== null ||
    selectedLanguage.value !== null ||
    selectedPopular.value !== null
  )
})

function selectFilter(type: 'category' | 'price' | 'age' | 'language' | 'popular', value: any) {
  if (type === 'category')
    selectedCategory.value = selectedCategory.value === value ? null : value
  if (type === 'price') selectedPrice.value = selectedPrice.value === value ? null : value
  if (type === 'age') selectedAge.value = selectedAge.value === value ? null : value
  if (type === 'language')
    selectedLanguage.value = selectedLanguage.value === value ? null : value
  if (type === 'popular') selectedPopular.value = selectedPopular.value === value ? null : value
}

function clearFilters() {
  selectedCategory.value = null
  selectedPrice.value = null
  selectedAge.value = null
  selectedLanguage.value = null
  selectedPopular.value = null
}

// 🔥 هنا التعديل: تجهيز القيم حسب الباك اند
watch([selectedCategory, selectedPrice, selectedAge, selectedLanguage, selectedPopular], () => {
  let filters: Record<string, any> = {}

  if (selectedCategory.value) filters.category_id = selectedCategory.value
  if (selectedAge.value) filters.age_group = selectedAge.value
  if (selectedLanguage.value) filters.language = selectedLanguage.value
  if (selectedPopular.value) filters.section = selectedPopular.value

  if (selectedPrice.value) {
    if (selectedPrice.value.includes('-')) {
      const [min, max] = selectedPrice.value.split('-')
      filters.price_min = min
      filters.price_max = max
    } else if (selectedPrice.value.endsWith('+')) {
      filters.price_min = selectedPrice.value.replace('+', '')
    }
  }

  emit('filters-changed', filters)
})

const popularSections = [
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
]

const prices = [
  { label: t('sidebar.price.under5'), value: '0-5' },
  { label: t('sidebar.price.p5to10'), value: '5-10' },
  { label: t('sidebar.price.p10to25'), value: '10-25' },
  { label: t('sidebar.price.p25to50'), value: '25-50' },
  { label: t('sidebar.price.over50'), value: '50+' },
]

const ages = [
  t('sidebar.age.child'),
  t('sidebar.age.tween'),
  t('sidebar.age.teen'),
  t('sidebar.age.adult'),
  t('sidebar.age.allAges'),
]

const languages = [
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
]
</script>
