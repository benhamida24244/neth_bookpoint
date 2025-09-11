<script setup>
import { usePublishingHouseStore } from '@/stores/PublishingHouses'
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import BookList from '@/components/Book/Shop/BookList.vue'
import LoaderWithText from '@/components/LoaderWithText.vue';
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia';

const { t } = useI18n()
const publishingHouseStore = usePublishingHouseStore()
const route = useRoute()
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

const { isLoading, error } = storeToRefs(publishingHouseStore);
const currentPublishingHouse = ref(null)

const imageUrl = computed(() => {
  if (!currentPublishingHouse.value || !currentPublishingHouse.value.img) {
    return 'https://via.placeholder.com/300x450.png?text=No+Image'
  }
  const imgPath = currentPublishingHouse.value.img
  return imgPath.startsWith('http') ? imgPath : `${apiBaseUrl.replace(///$/, '')}/${imgPath.replace(/^\//, '')}`
})

async function fetchPublisherById() {
  try {
    const publisherId = Number(route.params.id)
    if (isNaN(publisherId)) throw new Error(t('singlePublishingHousePage.invalidId'))
    
    const publisherData = await publishingHouseStore.getPublisherById(publisherId)
    if (!publisherData) {
        throw new Error(t('singlePublishingHousePage.notFound', { id: publisherId }))
    }
    currentPublishingHouse.value = publisherData

  } catch (err) {
    console.error('Failed to load publisher:', err)
    currentPublishingHouse.value = null
  }
}

onMounted(fetchPublisherById)
onMounted(() => {
  window.scrollTo(0, 0)
})
</script>

<template>
  <div class="w-full min-h-screen bg-gray-50 py-8 px-4 sm:py-16">
    <div v-if="isLoading">
      <LoaderWithText :message="t('loading.publisher')" />
    </div>

    <div v-else-if="error || !currentPublishingHouse">
      <div class="text-center py-20">
        <p class="text-red-500 font-semibold">{{ t('singlePublishingHousePage.error') }}</p>
        <p class="text-gray-600">{{ error || t('singlePublishingHousePage.unknownError') }}</p>
        <button
          @click="fetchPublisherById"
          class="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          {{ t('singlePublishingHousePage.retry') }}
        </button>
      </div>
    </div>

    <div v-else class="max-w-7xl mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        <div class="flex justify-center lg:justify-start">
          <img
            :src="imageUrl"
            alt="Publisher Image"
            class="h-64 w-64 sm:h-80 sm:w-80 object-cover rounded-full shadow-2xl shadow-[var(--color-primary)]/30"
          />
        </div>

        <div class="lg:col-span-2 flex flex-col justify-center space-y-6 relative">
          <div class="h-1 bg-gradient-to-r from-[var(--color-primary)] to-transparent w-full max-w-xs"></div>
          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--color-primary)] leading-tight font-BonaRegular">
            {{ currentPublishingHouse.name }}
          </h1>
          <div class="h-1 bg-gradient-to-r from-[var(--color-primary)] to-transparent w-20"></div>
          <p class="text-gray-700 text-base sm:text-lg leading-relaxed max-w-2xl font-BonaRegular">
            {{ currentPublishingHouse.description }}
          </p>
        </div>
      </div>

      <section class="max-w-7xl mx-auto px-4 py-12 lg:py-16">
        <header class="text-center mb-12">
          <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--color-primary)] mb-4 font-BonaRegular">
            {{ t('singlePublishingHousePage.booksBy') }} {{ currentPublishingHouse.name }}
          </h2>
          <div class="h-px bg-gradient-to-r from-transparent via-[var(--color-primary)]/50 to-transparent w-32 mx-auto"></div>
        </header>

        <Suspense>
          <BookList v-if="currentPublishingHouse && currentPublishingHouse.id" :publisher_id="currentPublishingHouse.id" />
          <template #fallback>
            <LoaderWithText :message="t('loading.books')" />
          </template>
        </Suspense>
      </section>
    </div>
  </div>
</template>