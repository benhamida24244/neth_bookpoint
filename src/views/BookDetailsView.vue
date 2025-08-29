<template>
  <div class="bg-[#F3F4F6] py-8 font-BonaRegular">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Loading Indicator -->
      <div v-if="isLoading" class="text-center py-12">
        <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
        <p class="mt-2">Loading book details...</p>
      </div>

      <!-- Book Content -->
      <div v-else-if="book">
        <!-- Breadcrumb -->
        <nav class="text-sm mb-4 py-2 sticky top-0 z-10 bg-[#F3F4F6]">
          <ol class="list-none p-0 inline-flex">
            <li class="flex items-center">
              <a href="#" class="text-gray-500 hover:text-gray-700">{{ translations.bookdetails.home }}</a>
              <span class="mx-2">/</span>
            </li>
            <li class="flex items-center" v-if="book.category">
              <a href="#" class="text-gray-500 hover:text-gray-700">{{ book.category.name }}</a>
              <span class="mx-2">/</span>
            </li>
            <li class="text-gray-700">{{ book.title }}</li>
          </ol>
        </nav>

        <div class="bg-white p-8 rounded-lg shadow-md">
          <!-- Main Book Section -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="md:col-span-1">
              <img :src="book.cover_image_url" :alt="book.title" class="w-full h-auto object-cover rounded-lg shadow-lg">
            </div>
            <div class="md:col-span-2">
              <h1 class="text-3xl font-bold text-[#111827]">{{ book.title }}</h1>
              <p class="text-lg text-gray-600 mt-2">
                {{ translations.bookdetails.by }}
                <a href="#" class="text-[#1E40AF] hover:underline">{{ book.author.name }}</a>
              </p>
              <p class="text-sm text-gray-500 mt-1">
                {{ translations.bookdetails.publishedBy }}
                <a href="#" class="text-[#1E40AF] hover:underline">{{ book.publishing_house.name }}</a>
              </p>

              <div class="flex items-center mt-4">
                <div class="flex items-center">
                  <span v-for="i in 5" :key="i" class="text-yellow-400">
                    <i class="pi" :class="i <= Math.floor(book.rating) ? 'pi-star-fill' : 'pi-star'"></i>
                  </span>
                  <span class="text-gray-600 ml-2">({{ book.reviews_count }} {{ translations.bookdetails.reviews }})</span>
                </div>
              </div>

              <div class="mt-4">
                <span class="text-3xl font-bold text-[#111827]">
                  ${{ book.discounted_price.toFixed(2) }}
                </span>
                <span v-if="book.discount > 0" class="text-lg text-gray-500 line-through ml-2">
                  ${{ book.price.toFixed(2) }}
                </span>
                <span v-if="book.discount > 0" class="bg-red-500 text-white text-xs font-semibold ml-2 px-2.5 py-0.5 rounded-full">
                  -{{ book.discount }}%
                </span>
              </div>

              <p class="text-green-600 font-semibold mt-2">
                {{ book.availability || translations.bookdetails.inStock }}
              </p>

              <div class="mt-4 text-gray-700">
                <p v-if="!showFullDescription">
                  {{ book.description }}
                  <a href="#" @click.prevent="showFullDescription = true" class="text-[#1E40AF] hover:underline">
                    {{ translations.bookdetails.readMore }}
                  </a>
                </p>
              </div>

              <div class="mt-6 flex items-center space-x-4">
                <button @click="handleAddToCart" class="bg-[#1E40AF] hover:bg-[#1E3A8A] text-white font-bold py-3 px-6 rounded-lg transition duration-300" v-tooltip.top="translations.bookdetails.addToCartTooltip">
                  {{ translations.bookdetails.addToCart }}
                </button>
                <button @click="handleBuyNow" class="bg-[#F59E0B] hover:bg-[#D97706] text-white font-bold py-3 px-6 rounded-lg transition duration-300" v-tooltip.top="translations.bookdetails.buyNowTooltip">
                  {{ translations.bookdetails.buyNow }}
                </button>
                <button class="text-gray-500 hover:text-red-500 transition duration-300" v-tooltip.top="translations.bookdetails.addToWishlistTooltip">
                  <i class="pi pi-heart" style="font-size: 1.5rem"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Detailed Description Section -->
          <Transition name="fade">
            <div class="mt-12" v-if="showFullDescription">
              <h2 class="text-2xl font-bold text-[#111827]">{{ translations.bookdetails.fullDescription }}</h2>
              <p class="text-gray-700 mt-4">{{ book.description }}</p>
              <h3 class="text-xl font-bold text-[#111827] mt-6">{{ translations.bookdetails.specifications }}</h3>
              <ul class="list-disc list-inside mt-4 text-gray-700">
                <li>{{ translations.bookdetails.isbn }}: {{ book.isbn }}</li>
                <li>{{ translations.bookdetails.pages }}: {{ book.pages }}</li>
                <li>{{ translations.bookdetails.language }}: {{ book.language }}</li>
                <li>{{ translations.bookdetails.dimensions }}: {{ book.dimensions }}</li>
              </ul>
            </div>
          </Transition>
        </div>

        <!-- Related Books Section -->
        <div v-if="muchCategory" class="mt-12">
          <RelatedBooksCarousel :books="relatedBooksCategory" :title="translations.bookdetails.booksSameCategory" />
        </div>
        <div v-if="muchAuthor" class="mt-12">
          <RelatedBooksCarousel :books="relatedBooksAuthor" :title="translations.bookdetails.booksSameAuthor" />
        </div>
        <div v-if="muchPublisher" class="mt-12">
          <RelatedBooksCarousel :books="relatedBooksPublisher" :title="translations.bookdetails.booksSamePublisher" />
        </div>
      </div>

      <!-- Not Found Message -->
      <div v-else class="text-center py-12">
        <h1 class="text-2xl font-bold">Book not found</h1>
        <p class="mt-2">Sorry, we couldn't find the book you're looking for.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import RelatedBooksCarousel from '@/components/Book/RelatedBooksCarousel.vue';
import { useCartStore } from '@/stores/Cart';
import { useBooksStore } from '@/stores/Books';
import { useLanguageStore } from '@/stores/language';
import { storeToRefs } from 'pinia';

const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();
const booksStore = useBooksStore();
const showFullDescription = ref(false);

const languageStore = useLanguageStore();
const { translations } = storeToRefs(languageStore);

// Use storeToRefs to get reactive access to the store state
const { book, books, isLoading } = storeToRefs(booksStore);

// Function to fetch book details
const fetchBookData = async () => {
  const bookId = Number(route.params.id);
  if (!isNaN(bookId)) {
    await booksStore.fetchBook(bookId);
    // Also fetch all books for related books functionality, if not already loaded
    if (booksStore.books.length === 0) {
      await booksStore.fetchBooks();
    }
  }
};

// Fetch data when the component is first mounted
onMounted(fetchBookData);

// Watch for changes in the route parameter (e.g., navigating from one book to another)
watch(() => route.params.id, fetchBookData);

// Related books based on category, author, and publisher
const relatedBooksCategory = computed(() => {
  if (!book.value || !book.value.category) return [];
  return books.value.filter(b => b.category && b.category.id === book.value.category.id && b.id !== book.value.id);
});
const relatedBooksAuthor = computed(() => {
  if (!book.value || !book.value.author) return [];
  return books.value.filter(b => b.author && b.author.id === book.value.author.id && b.id !== book.value.id);
});
const relatedBooksPublisher = computed(() => {
  if (!book.value || !book.value.publishing_house) return [];
  return books.value.filter(b => b.publishing_house && b.publishing_house.id === book.value.publishing_house.id && b.id !== book.value.id);
});

// Check if there are related books to show
const muchCategory = computed(() => relatedBooksCategory.value.length > 0);
const muchAuthor = computed(() => relatedBooksAuthor.value.length > 0);
const muchPublisher = computed(() => relatedBooksPublisher.value.length > 0);

// Handlers for Add to Cart and Buy Now buttons
const handleAddToCart = () => {
  if (book.value && book.value.id) {
    cartStore.addToCart(book.value);
  }
};
const handleBuyNow = () => {
  if (book.value && book.value.id) {
    cartStore.addToCart(book.value);
    router.push('/checkout');
  }
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
