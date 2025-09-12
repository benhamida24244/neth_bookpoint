<script setup>
import { defineAsyncComponent, onMounted, computed } from 'vue'
import { useAuthorStore } from '@/stores/Authors'
import { usePublishingHouseStore } from '@/stores/PublishingHouses'
import { useI18n } from 'vue-i18n'
import { useCategoriesStore } from '@/stores/Categories'
import { storeToRefs } from 'pinia'
import { useBooksStore } from '@/stores/Books'
import LoaderWithText from '@/components/LoaderWithText.vue'

const { t } = useI18n()

// --- Components ---
const AuthorList = defineAsyncComponent(() => import('@/components/Author/AuthorList.vue'))
const LargeBanner = defineAsyncComponent(() => import('@/components/Banner/LargeBanner.vue'))
const SmallBannerList = defineAsyncComponent(() => import('@/components/Banner/Small Banner/SmallBannerList.vue'))
const BookList = defineAsyncComponent(() => import('@/components/Book/bookList.vue'))
const CatigoryList = defineAsyncComponent(() => import('@/components/Catigory/CatigoryList.vue'))
const Footer = defineAsyncComponent(() => import('@/components/Footer/Footer.vue'))
const Hero = defineAsyncComponent(() => import('@/components/Hero.vue'))
const PublishingHousesList = defineAsyncComponent(() => import('@/components/Publishing/PublishingHousesList.vue'))

// --- Stores ---
const publishingHousesStore = usePublishingHouseStore()
const authorsStore = useAuthorStore()
const categoriesStore = useCategoriesStore()
const booksStore = useBooksStore()

// --- Refs ---
const { authors, isLoading: isAuthorsLoading } = storeToRefs(authorsStore)
const { publishingHouses, isLoading: isPublishingHousesLoading } = storeToRefs(publishingHousesStore)
const { categories, isLoading: isCategoriesLoading } = storeToRefs(categoriesStore)
const { books, isLoading: isBooksLoading } = storeToRefs(booksStore)

// --- Combined Loading State ---
const isLoading = computed(() => {
  return isBooksLoading.value || isAuthorsLoading.value || isPublishingHousesLoading.value || isCategoriesLoading.value;
});

// --- Computed Properties ---
const bestsellersBooks = computed(() => books.value.slice(0, 10))
const everyoneTalkingBooks = computed(() => books.value.slice(10, 20))
const paperbacksBooks = computed(() => books.value.filter(book => book.category === 2).slice(0, 10))
const yaBooks = computed(() => books.value.filter(book => book.category === 1).slice(0, 10))
const signedEditionsBooks = computed(() => books.value.filter(book => book.is_signed).slice(0, 10))

// --- Banners Data ---
const banner = {
  id: 1,
  img: 'https://dispatch.barnesandnoble.com/content/dam/ccr/homepage/daily/2025/07/08/32542_0793_SkinnyHero_RoseInChains_July2025.jpg',
  url: 'https://www.barnesandnoble.com/',
}
const bannerTow = {
  id: 1,
  img: 'https://dispatch.barnesandnoble.com/content/dam/ccr/homepage/daily/2025/07/08/32543_0795_SkinnyHero_ViewfromLakeComo_Jul25.jpg',
  url: 'https://www.barnesandnoble.com/',
}
const bannerThree = {
  id: 2,
  img: 'https://dispatch.barnesandnoble.com/content/dam/ccr/homepage/daily/2025/07/08/32540_0791_SkinnyHero_HourofthePumpkinQueen_July2025.jpg',
  url: 'https://www.barnesandnoble.com/',
}
const smallBanner = [
  { id: 1, img: 'https://prodimage.images-bn.com/lf?set=key%5Bresolve.pixelRatio%5D,value%5B1%5D&set=key%5Bresolve.width%5D,value%5B600%5D&set=key%5Bresolve.height%5D,value%5B10000%5D&set=key%5Bresolve.imageFit%5D,value%5Bcontainerwidth%5D&set=key%5Bresolve.allowImageUpscaling%5D,value%5B0%5D&set=key%5Bresolve.format%5D,value%5Bwebp%5D&source=url%5Bhttps://dispatch.barnesandnoble.com/content/dam/ccr/BNApp/PromoCarousel/2025/05/32503_PCS_Buckeye_June_27_25.jpg%5D&scale=options%5Blimit%5D,size%5B600x10000%5D&sink=format%5Bwebp%5D', url: 'https://www.barnesandnoble.com/w/buckeye-patrick-ryan/1146518591?ean=9798217155095' },
  { id: 2, img: 'https://prodimage.images-bn.com/lf?set=key%5Bresolve.pixelRatio%5D,value%5B1%5D&set=key%5Bresolve.width%5D,value%5B600%5D&set=key%5Bresolve.height%5D,value%5B10000%5D&set=key%5Bresolve.imageFit%5D,value%5Bcontainerwidth%5D&set=key%5Bresolve.allowImageUpscaling%5D,value%5B0%5D&set=key%5Bresolve.format%5D,value%5Bwebp%5D&source=url%5Bhttps://dispatch.barnesandnoble.com/content/dam/ccr/homepage/daily/2025/07/08/32523_0775_PCS_DanBrown_July2025.jpg%5D&scale=options%5Blimit%5D,size%5B600x10000%5D&sink=format%5Bwebp%5D', url: 'https://www.barnesandnoble.com/w/the-secret-of-secrets-dan-brown/1146902400?ean=9780385546898' },
  { id: 3, img: 'https://prodimage.images-bn.com/lf?set=key%5Bresolve.pixelRatio%5D,value%5B1%5D&set=key%5Bresolve.width%5D,value%5B600%5D&set=key%5Bresolve.height%5D,value%5B10000%5D&set=key%5Bresolve.imageFit%5D,value%5Bcontainerwidth%5D&set=key%5Bresolve.allowImageUpscaling%5D,value%5B0%5D&set=key%5Bresolve.format%5D,value%5Bwebp%5D&source=url%5Bhttps://dispatch.barnesandnoble.com/content/dam/ccr/homepage/daily/2025/07/08/32523_0847_PCS_PuzzleMania_Jul25.jpg%5D&scale=options%5Blimit%5D,size%5B600x10000%5D&sink=format%5Bwebp%5D', url: 'https://www.barnesandnoble.com/w/buckeye-patrick-ryan/1146518591?ean=9798217155095' },
]
const smallBannerTwo = [
  { id: 1, img: 'https://prodimage.images-bn.com/lf?set=key%5Bresolve.pixelRatio%5D,value%5B1%5D&set=key%5Bresolve.width%5D,value%5B600%5D&set=key%5Bresolve.height%5D,value%5B10000%5D&set=key%5Bresolve.imageFit%5D,value%5Bcontainerwidth%5D&set=key%5Bresolve.allowImageUpscaling%5D,value%5B0%5D&set=key%5Bresolve.format%5D,value%5Bwebp%5D&source=url%5Bhttps://dispatch.barnesandnoble.com/content/dam/ccr/homepage/daily/2025/07/01/32522_PCS_A1_NewReleasesThisMonth_07_01_25.jpg%5D&scale=options%5Blimit%5D,size%5B600x10000%5D&sink=format%5Bwebp%5D', url: 'https://www.barnesandnoble.com/w/buckeye-patrick-ryan/1146518591?ean=9798217155095' },
  { id: 2, img: 'https://prodimage.images-bn.com/lf?set=key%5Bresolve.pixelRatio%5D,value%5B1%5D&set=key%5Bresolve.width%5D,value%5B600%5D&set=key%5Bresolve.height%5D,value%5B10000%5D&set=key%5Bresolve.imageFit%5D,value%5Bcontainerwidth%5D&set=key%5Bresolve.allowImageUpscaling%5D,value%5B0%5D&set=key%5Bresolve.format%5D,value%5Bwebp%5D&source=url%5Bhttps://dispatch.barnesandnoble.com/content/dam/ccr/homepage/daily/2025/07/01/32522_PCS_A2_OurBestPaperbacks_07_01_25.jpg%5D&scale=options%5Blimit%5D,size%5B600x10000%5D&sink=format%5Bwebp%5D', url: 'https://www.barnesandnoble.com/w/the-secret-of-secrets-dan-brown/1146902400?ean=9780385546898' },
  { id: 3, img: 'https://prodimage.images-bn.com/lf?set=key%5Bresolve.pixelRatio%5D,value%5B1%5D&set=key%5Bresolve.width%5D,value%5B600%5D&set=key%5Bresolve.height%5D,value%5B10000%5D&set=key%5Bresolve.imageFit%5D,value%5Bcontainerwidth%5D&set=key%5Bresolve.allowImageUpscaling%5D,value%5B0%5D&set=key%5Bresolve.format%5D,value%5Bwebp%5D&source=url%5Bhttps://dispatch.barnesandnoble.com/content/dam/ccr/homepage/daily/2025/07/01/32522_PCS_A3_HardcoverBestsellers_07_01_25.jpg%5D&scale=options%5Blimit%5D,size%5B600x10000%5D&sink=format%5Bwebp%5D', url: 'https://www.barnesandnoble.com/w/buckeye-patrick-ryan/1146518591?ean=9798217155095' },
]

// --- Lifecycle ---
onMounted(async () => {
  window.scrollTo(0, 0)
  try {
    // Fetch all data in parallel
    await Promise.all([
      booksStore.fetchBooks(),
      publishingHousesStore.fetchPublishers(),
      authorsStore.fetchAuthors(),
      categoriesStore.fetchCategories()
    ])
  } catch (error) {
    console.error("Failed to load homepage data:", error)
    // Optionally, set an error state to show a message to the user
  }
})
</script>

<template>
  <!-- Loading Spinner -->
  <div v-if="isLoading" class="flex justify-center items-center min-h-screen">
    <LoaderWithText :message="t('loading.home')" />
  </div>

  <!-- Main Content -->
  <div v-else>
    <Hero />
    <div class="w-full">
      <h1 class="text-center text-5xl p-6 font-bona">{{ t('home.bestsellers') }}</h1>
      <BookList :books="bestsellersBooks" />
      <LargeBanner :banner="banner" />
      <SmallBannerList :smallBanner="smallBanner" />
      <LargeBanner :banner="bannerTow" />
      <h1 class="text-center text-5xl p-6 font-bona">{{ t('home.everyonesTalkingAbout') }}</h1>
      <BookList :books="books" />
      <SmallBannerList :smallBanner="smallBannerTwo" />
      <h1 class="text-center text-5xl p-6 font-bona">{{ t('home.ourBestPaperbacks') }}</h1>
      <BookList :books="books" />
      <h1 class="text-center text-5xl p-6 font-bona">{{ t('home.shopByCategory') }}</h1>
      <CatigoryList :categories="categories"/>
      <LargeBanner :banner="bannerThree" />
      <h1 class="text-center text-5xl p-6 font-bona">{{ t('home.ourBestYABooks') }}</h1>
      <BookList :books="books" />
      <h1 class="text-center text-5xl p-6 font-bona">{{ t('home.authors')}}</h1>
      <AuthorList :authors="authors"/>
      <h1 class="text-center text-5xl p-6 font-bona">{{ t('home.signedAndSpecialEditions')}}</h1>
      <BookList :books="books" />
      <h1 class="text-center text-5xl p-6 font-bona">{{ t('home.publishingHouse') }}</h1>
      <PublishingHousesList :PublishingHouses="publishingHouses"/>
      <Footer/>
    </div>
  </div>
</template>