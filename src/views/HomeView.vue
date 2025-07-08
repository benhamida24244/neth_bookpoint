<script setup>
import LargeBanner from '@/components/Banner/LargeBanner.vue'
import SmallBannerItem from '@/components/Banner/Small Banner/SmallBannerItem.vue'
import SmallBannerList from '@/components/Banner/Small Banner/SmallBannerList.vue'
import BookList from '@/components/Book/bookList.vue'
import Header from '@/components/Header.vue'
import Hero from '@/components/Hero.vue'

const banner = {
  id: 1,
  img: 'https://dispatch.barnesandnoble.com/content/dam/ccr/homepage/daily/2025/07/08/32542_0793_SkinnyHero_RoseInChains_July2025.jpg',
  url: 'https://www.barnesandnoble.com/',
}
const bannerTow = {
  id: 2,
  img: 'https://dispatch.barnesandnoble.com/content/dam/ccr/homepage/daily/2025/07/08/32543_0795_SkinnyHero_ViewfromLakeComo_Jul25.jpg',
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
</script>

<template>
  <Header />
  <Hero />
  <div class="h-screen w-full">
    <h1 class="text-center text-5xl p-6 font-bona">BestSellers</h1>
    <BookList />
    <LargeBanner :banner="banner" />
    <SmallBannerList :smallBanner="smallBanner" />
    <LargeBanner :banner="bannerTow" />
  </div>
</template>
