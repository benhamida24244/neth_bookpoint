<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import RelatedBooksCarousel from '@/components/Book/RelatedBooksCarousel.vue';
import { useCartStore } from '@/stores/Cart';
import { useBooksStore } from '@/stores/Books';

const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();
const booksStore = useBooksStore();
const showFullDescription = ref(false);

// اقرأ id من الرابط
const bookId = Number(route.params.id);

// استرجع الكتاب من الستور حسب id
const book = computed(() => booksStore.books.find(b => b.id === bookId) || {});

// لأقتران كتب متشابهة (مثال: نفس المؤلف)
const relatedBooks = computed(() => {
  if (!book.value.author) return [];
  return booksStore.books.filter(
    b => b.author === book.value.author && b.id !== bookId
  );
});

// أزرار الإضافة للسلة والشراء الآن
const handleAddToCart = () => {
  if (book.value.id) {
    cartStore.addToCart(book.value);
  }
};

const handleBuyNow = () => {
  if (book.value.id) {
    cartStore.addToCart(book.value);
    router.push('/checkout');
  }
};
</script>


<template>
  <div class="bg-[#F3F4F6] py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Breadcrumb -->
      <nav class="text-sm mb-4 py-2 sticky top-0 z-10 bg-[#F3F4F6]">
        <ol class="list-none p-0 inline-flex">
          <li class="flex items-center">
            <a href="#" class="text-gray-500 hover:text-gray-700">Home</a>
            <span class="mx-2">/</span>
          </li>
          <li class="flex items-center">
            <a href="#" class="text-gray-500 hover:text-gray-700">{{ book.category }}</a>
            <span class="mx-2">/</span>
          </li>
          <li class="text-gray-700">{{ book.title }}</li>
        </ol>
      </nav>

      <div class="bg-white p-8 rounded-lg shadow-md">
        <!-- Main Book Section -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="md:col-span-1">
            <img :src="book.cover" :alt="book.title" class="w-full h-auto object-cover rounded-lg shadow-lg">
          </div>
          <div class="md:col-span-2">
            <h1 class="text-3xl font-bold text-[#111827]">{{ book.title }}</h1>
            <p class="text-lg text-gray-600 mt-2">by <a href="#" class="text-[#1E40AF] hover:underline">{{ book.author }}</a></p>
            <p class="text-sm text-gray-500 mt-1">Published by <a href="#" class="text-[#1E40AF] hover:underline">{{ book.publishingHouse }}</a></p>

            <div class="flex items-center mt-4">
              <div class="flex items-center">
                <span v-for="i in 5" :key="i" class="text-yellow-400">
                  <i class="pi" :class="i <= Math.floor(book.rating) ? 'pi-star-fill' : 'pi-star'"></i>
                </span>
                <span class="text-gray-600 ml-2">({{ book.reviews }} reviews)</span>
              </div>
            </div>

            <div class="mt-4">
              <span class="text-3xl font-bold text-[#111827]">${{ (book.pricing.basePrice * (1 - book.pricing.discount / 100)).toFixed(2) }}</span>
              <span v-if="book.discount > 0" class="text-lg text-gray-500 line-through ml-2">${{ book.price.toFixed(2) }}</span>
              <span v-if="book.discount > 0" class="bg-red-500 text-white text-xs font-semibold ml-2 px-2.5 py-0.5 rounded-full">-{{ book.discount }}%</span>
            </div>

            <p class="text-green-600 font-semibold mt-2">{{ book.availability }}</p>

            <div class="mt-4 text-gray-700">
              <p v-if="!showFullDescription">{{ book.shortDescription }} <a href="#" @click.prevent="showFullDescription = true" class="text-[#1E40AF] hover:underline">Read more</a></p>
            </div>

            <div class="mt-6 flex items-center space-x-4">
              <button @click="handleAddToCart" class="bg-[#1E40AF] hover:bg-[#1E3A8A] text-white font-bold py-3 px-6 rounded-lg transition duration-300" v-tooltip.top="'Add to your cart'">Add to Cart</button>
              <button @click="handleBuyNow" class="bg-[#F59E0B] hover:bg-[#D97706] text-white font-bold py-3 px-6 rounded-lg transition duration-300" v-tooltip.top="'Proceed to checkout'">Buy Now</button>
              <button class="text-gray-500 hover:text-red-500 transition duration-300" v-tooltip.top="'Add to your wishlist'">
                <i class="pi pi-heart" style="font-size: 1.5rem"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Detailed Description Section -->
        <Transition name="fade">
            <div class="mt-12" v-if="showFullDescription">
            <h2 class="text-2xl font-bold text-[#111827]">Full Description</h2>
            <p class="text-gray-700 mt-4">{{ book.fullDescription }}</p>
            <h3 class="text-xl font-bold text-[#111827] mt-6">Specifications</h3>
            <ul class="list-disc list-inside mt-4 text-gray-700">
                <li>ISBN: {{ book.specifications.isbn }}</li>
                <li>Pages: {{ book.specifications.pages }}</li>
                <li>Language: {{ book.specifications.language }}</li>
                <li>Dimensions: {{ book.specifications.dimensions }}</li>
            </ul>
            </div>
        </Transition>
      </div>

      <!-- Related Books Section -->
      <div class="mt-12">
        <RelatedBooksCarousel :books="relatedBooks" title="Books from the same category" />
      </div>
       <div class="mt-12">
        <RelatedBooksCarousel :books="relatedBooks" title="Books from the same author" />
      </div>
       <div class="mt-12">
        <RelatedBooksCarousel :books="relatedBooks" title="Books from the same publisher" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
