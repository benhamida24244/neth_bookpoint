<script setup>
import LargeBanner from '@/components/Banner/LargeBanner.vue';
import BookList from '@/components/Book/bookList.vue';
import Header from '@/components/Header.vue';
import Hero from '@/components/Hero.vue';

const banner = {
    id:1,
    img:'https://dispatch.barnesandnoble.com/content/dam/ccr/homepage/daily/2025/07/08/32542_0793_SkinnyHero_RoseInChains_July2025.jpg',
    url:'https://www.barnesandnoble.com/',
}
</script>

<template>
  <Header />
  <Hero />
  <div class="h-screen w-full">
    <h1 class="text-center text-5xl p-6 font-bona">BestSellers</h1>
    <BookList/>
    <LargeBanner :banner="banner"/>
  </div>
</template>
