<script setup>
import BookList from '@/components/Book/bookList.vue';
import Header from '@/components/Header.vue';
import Hero from '@/components/Hero.vue';

</script>

<template>
  <Header />
  <Hero />
  <div class="h-screen w-full">
    <h1 class="text-center text-5xl p-6 font-bona">BestSellers</h1>
    <BookList/>
  </div>
</template>
