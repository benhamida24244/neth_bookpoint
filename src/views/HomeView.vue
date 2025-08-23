<script setup>
// LAZY LOADING: defineAsyncComponent is used to load components only when they're needed.
// This splits the code into smaller chunks, improving initial page load performance.
import { defineAsyncComponent, onMounted } from 'vue'

import { useAuthorStore } from '@/stores/Authors'
import { usePublishingHouseStore } from '@/stores/PublishingHouses'
import { useLanguageStore } from '@/stores/language'
import { storeToRefs } from 'pinia'

// LAZY LOADING EXAMPLE:
// Each component below is now loaded asynchronously. Instead of being bundled with the
// parent page, it will be fetched from the server the first time it's rendered.
const AuthorList = defineAsyncComponent(() => import('@/components/Author/AuthorList.vue'))
const LargeBanner = defineAsyncComponent(() => import('@/components/Banner/LargeBanner.vue'))
const SmallBannerList = defineAsyncComponent(() => import('@/components/Banner/Small Banner/SmallBannerList.vue'))
const BookList = defineAsyncComponent(() => import('@/components/Book/bookList.vue'))
const CatigoryList = defineAsyncComponent(() => import('@/components/Catigory/CatigoryList.vue'))
const Footer = defineAsyncComponent(() => import('@/components/Footer/Footer.vue'))
const Hero = defineAsyncComponent(() => import('@/components/Hero.vue'))
const PublishingHousesList = defineAsyncComponent(() => import('@/components/Publishing/PublishingHousesList.vue'))

const PublishingHousesStore = usePublishingHouseStore()
const authorsStore = useAuthorStore()
const languageStore = useLanguageStore()
const { translations } = storeToRefs(languageStore)


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
  {
    id: 1,
    img: 'https://prodimage.images-bn.com/lf?set=key%5Bresolve.pixelRatio%5D,value%5B1%5D&set=key%5Bresolve.width%5D,value%5B600%5D&set=key%5Bresolve.height%5D,value%5B10000%5D&set=key%5Bresolve.imageFit%5D,value%5Bcontainerwidth%5D&set=key%5Bresolve.allowImageUpscaling%5D,value%5B0%5D&set=key%5Bresolve.format%5D,value%5Bwebp%5D&source=url%5Bhttps://dispatch.barnesandnoble.com/content/dam/ccr/BNApp/PromoCarousel/2025/05/32503_PCS_Buckeye_June_27_25.jpg%5D&scale=options%5Blimit%5D,size%5B600x10000%5D&sink=format%5Bwebp%5D',
    url: 'https://www.barnesandnoble.com/w/buckeye-patrick-ryan/1146518591?ean=9798217155095',
  },
  {
    id: 2,
    img: 'https://prodimage.images-bn.com/lf?set=key%5Bresolve.pixelRatio%5D,value%5B1%5D&set=key%5Bresolve.width%5D,value%5B600%5D&set=key%5Bresolve.height%5D,value%5B10000%5D&set=key%5Bresolve.imageFit%5D,value%5Bcontainerwidth%5D&set=key%5Bresolve.allowImageUpscaling%5D,value%5B0%5D&set=key%5Bresolve.format%5D,value%5Bwebp%5D&source=url%5Bhttps://dispatch.barnesandnoble.com/content/dam/ccr/homepage/daily/2025/07/08/32523_0775_PCS_DanBrown_July2025.jpg%5D&scale=options%5Blimit%5D,size%5B600x10000%5D&sink=format%5Bwebp%5D',
    url: 'https://www.barnesandnoble.com/w/the-secret-of-secrets-dan-brown/1146902400?ean=9780385546898',
  },
  {
    id: 3,
    img: 'https://prodimage.images-bn.com/lf?set=key%5Bresolve.pixelRatio%5D,value%5B1%5D&set=key%5Bresolve.width%5D,value%5B600%5D&set=key%5Bresolve.height%5D,value%5B10000%5D&set=key%5Bresolve.imageFit%5D,value%5Bcontainerwidth%5D&set=key%5Bresolve.allowImageUpscaling%5D,value%5B0%5D&set=key%5Bresolve.format%5D,value%5Bwebp%5D&source=url%5Bhttps://dispatch.barnesandnoble.com/content/dam/ccr/homepage/daily/2025/07/08/32523_0847_PCS_PuzzleMania_Jul25.jpg%5D&scale=options%5Blimit%5D,size%5B600x10000%5D&sink=format%5Bwebp%5D',
    url: 'https://www.barnesandnoble.com/w/buckeye-patrick-ryan/1146518591?ean=9798217155095',
  },
]
const smallBannerTwo = [
  {
    id: 1,
    img: 'https://prodimage.images-bn.com/lf?set=key%5Bresolve.pixelRatio%5D,value%5B1%5D&set=key%5Bresolve.width%5D,value%5B600%5D&set=key%5Bresolve.height%5D,value%5B10000%5D&set=key%5Bresolve.imageFit%5D,value%5Bcontainerwidth%5D&set=key%5Bresolve.allowImageUpscaling%5D,value%5B0%5D&set=key%5Bresolve.format%5D,value%5Bwebp%5D&source=url%5Bhttps://dispatch.barnesandnoble.com/content/dam/ccr/homepage/daily/2025/07/01/32522_PCS_A1_NewReleasesThisMonth_07_01_25.jpg%5D&scale=options%5Blimit%5D,size%5B600x10000%5D&sink=format%5Bwebp%5D',
    url: 'https://www.barnesandnoble.com/w/buckeye-patrick-ryan/1146518591?ean=9798217155095',
  },
  {
    id: 2,
    img: 'https://prodimage.images-bn.com/lf?set=key%5Bresolve.pixelRatio%5D,value%5B1%5D&set=key%5Bresolve.width%5D,value%5B600%5D&set=key%5Bresolve.height%5D,value%5B10000%5D&set=key%5Bresolve.imageFit%5D,value%5Bcontainerwidth%5D&set=key%5Bresolve.allowImageUpscaling%5D,value%5B0%5D&set=key%5Bresolve.format%5D,value%5Bwebp%5D&source=url%5Bhttps://dispatch.barnesandnoble.com/content/dam/ccr/homepage/daily/2025/07/01/32522_PCS_A2_OurBestPaperbacks_07_01_25.jpg%5D&scale=options%5Blimit%5D,size%5B600x10000%5D&sink=format%5Bwebp%5D',
    url: 'https://www.barnesandnoble.com/w/the-secret-of-secrets-dan-brown/1146902400?ean=9780385546898',
  },
  {
    id: 3,
    img: 'https://prodimage.images-bn.com/lf?set=key%5Bresolve.pixelRatio%5D,value%5B1%5D&set=key%5Bresolve.width%5D,value%5B600%5D&set=key%5Bresolve.height%5D,value%5B10000%5D&set=key%5Bresolve.imageFit%5D,value%5Bcontainerwidth%5D&set=key%5Bresolve.allowImageUpscaling%5D,value%5B0%5D&set=key%5Bresolve.format%5D,value%5Bwebp%5D&source=url%5Bhttps://dispatch.barnesandnoble.com/content/dam/ccr/homepage/daily/2025/07/01/32522_PCS_A3_HardcoverBestsellers_07_01_25.jpg%5D&scale=options%5Blimit%5D,size%5B600x10000%5D&sink=format%5Bwebp%5D',
    url: 'https://www.barnesandnoble.com/w/buckeye-patrick-ryan/1146518591?ean=9798217155095',
  },
]

const authors = authorsStore.authors
const PublishingHouses = PublishingHousesStore.publishingHouses

import { useBooksStore } from '@/stores/Books'

const booksStore = useBooksStore()

onMounted(()=> {
  window.scrollTo(0,0)
  booksStore.fetchBooks()
  PublishingHousesStore.fetchPublisher()
  authorsStore.fetchAuthors()
})
</script>

<template>
  <Hero />
  <div class="w-full">
    <h1 class="text-center text-5xl p-6 font-bona">{{ translations.home?.bestsellers || 'BestSellers' }}</h1>
    <BookList />
    <LargeBanner :banner="banner" />
    <SmallBannerList :smallBanner="smallBanner" />
    <LargeBanner :banner="bannerTow" />
    <h1 class="text-center text-5xl p-6 font-bona">{{ translations.home?.everyonesTalkingAbout || 'Everyone\'s Talking About' }}</h1>
    <BookList />
    <SmallBannerList :smallBanner="smallBannerTwo" />
    <h1 class="text-center text-5xl p-6 font-bona">{{ translations.home?.ourBestPaperbacks || 'Our Best Paperbacks' }}</h1>
    <BookList />
    <h1 class="text-center text-5xl p-6 font-bona">{{ translations.home?.shopByCategory || 'Shop by Category' }}</h1>
    <CatigoryList />
    <LargeBanner :banner="bannerThree" />
    <h1 class="text-center text-5xl p-6 font-bona">{{ translations.home?.ourBestYABooks || 'Our Best YA Books' }}</h1>
    <BookList />
    <h1 class="text-center text-5xl p-6 font-bona">{{ translations.home?.authors || 'Authors' }}</h1>
    <AuthorList :authors="authors"/>
    <h1 class="text-center text-5xl p-6 font-bona">{{ translations.home?.signedAndSpecialEditions || 'Signed & Special Editions' }}</h1>
    <BookList />
    <h1 class="text-center text-5xl p-6 font-bona">{{ translations.home?.publishingHouse || 'Publishing House' }}</h1>
    <PublishingHousesList :PublishingHouses="PublishingHouses"/>
    <Footer/>
  </div>
</template>
