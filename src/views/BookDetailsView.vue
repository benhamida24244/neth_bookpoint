<template>
  <div class="bg-[#F3F4F6] py-8 font-BonaRegular">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Breadcrumb -->
      <nav class="text-sm mb-4 py-2 sticky top-0 z-10 bg-[#F3F4F6]">
        <ol class="list-none p-0 inline-flex">
          <li class="flex items-center">
            <a href="#" class="text-gray-500 hover:text-gray-700">{{ t('bookdetails.home') }}</a>
            <span class="mx-2">/</span>
          </li>
          <li class="flex items-center" v-if="book.category && book.category.name">
            <RouterLink :to="`/category/${book.category.id}`" class="text-gray-500 hover:text-gray-700">{{ book.category.name }}</RouterLink>
            <span class="mx-2">/</span>
          </li>
          <li class="text-gray-700">{{ book.title }}</li>
        </ol>
      </nav>

      <div class="bg-white p-8 rounded-lg shadow-md">
        <!-- Main Book Section -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="md:col-span-1">
            <img :src="`${apiBaseUrl}${book.cover}`" :alt="book.title" class="w-full h-auto object-cover rounded-lg shadow-lg">
          </div>
          <div class="md:col-span-2">
            <h1 class="text-3xl font-bold text-[#111827]">{{ book.title }}</h1>
            <p class="text-lg text-gray-600 mt-2">
              {{ t('bookdetails.by') }}
              <RouterLink :to="`/authors/${book.author?.id}`" class="text-[#1E40AF] hover:underline">{{ book.author?.name || t('bookdetails.unknownAuthor') }}</RouterLink>
            </p>
            <p class="text-sm text-gray-500 mt-1">
              {{ t('bookdetails.publishedBy') }}
              <RouterLink :to="`/publishing-house/${book.publisher?.id}`" class="text-[#1E40AF] hover:underline">{{ book.publisher?.name || t('bookdetails.unknownPublisher') }}</RouterLink>
            </p>

            <div class="flex items-center mt-4">
              <div class="flex items-center">
                <span v-for="i in 5" :key="i" class="text-yellow-400">
                  <i class="pi" :class="i <= Math.floor(book.rating) ? 'pi-star-fill' : 'pi-star'"></i>
                </span>
                <span class="text-gray-600 ml-2">({{ book.reviews }} {{ t('bookdetails.reviews') }})</span>
              </div>
            </div>

            <div class="mt-4">
              <span class="text-3xl font-bold text-[#111827]">
                ${{ book.price || '0.00' }}
              </span>
              <span v-if="book.discount > 0" class="text-lg text-gray-500 line-through ml-2">
                ${{ book.price }}
              </span>
              <span v-if="book.discount > 0" class="bg-red-500 text-white text-xs font-semibold ml-2 px-2.5 py-0.5 rounded-full">
                -{{ book.discount }}%
              </span>
            </div>

            <p class="text-green-600 font-semibold mt-2">
              {{ book.stock && book.stock > 0 ? t('bookdetails.inStock') : t('bookdetails.outOfStock') }}
            </p>

            <div class="mt-4 text-gray-700">
              <p v-if="!showFullDescription">
                {{ book.description || t('bookdetails.noDescription') }}
                <a href="#" @click.prevent="showFullDescription = true" class="text-[#1E40AF] hover:underline">
                  {{ t('bookdetails.readMore') }}
                </a>
              </p>
            </div>

            <div class="mt-6 flex items-center space-x-4">
              <button @click="handleAddToCart" class="bg-[#1E40AF] hover:bg-[#1E3A8A] text-white font-bold py-3 px-6 rounded-lg transition duration-300" :title="t('bookdetails.addToCartTooltip')">
                {{ t('bookdetails.addToCart') }}
              </button>
              <button @click="handleBuyNow" class="bg-[#F59E0B] hover:bg-[#D97706] text-white font-bold py-3 px-6 rounded-lg transition duration-300" :title="t('bookdetails.buyNowTooltip')">
                {{ t('bookdetails.buyNow') }}
              </button>

            </div>
          </div>
        </div>

        <!-- Detailed Description Section -->
        <Transition name="fade">
          <div class="mt-12" v-if="showFullDescription">
            <h2 class="text-2xl font-bold text-[#111827]">{{ t('bookdetails.fullDescription') }}</h2>
            <p class="text-gray-700 mt-4">{{ book.description || t('bookdetails.noDescription') }}</p>
            <h3 class="text-xl font-bold text-[#111827] mt-6">{{ t('bookdetails.specifications') }}</h3>
            <ul class="list-disc list-inside mt-4 text-gray-700">
              <li>{{ t('bookdetails.pages') }}: {{ book.pages || t('bookdetails.notAvailable') }}</li>
              <li>{{ t('bookdetails.language') }}: {{ book.language || t('bookdetails.notAvailable') }}</li>
              <li>{{ t('bookdetails.publisher') }}: {{ book.publisher?.name || t('bookdetails.notAvailable') }}</li>
              <li>{{ t('bookdetails.publishedDate') }}: {{ book.publisherDate || t('bookdetails.notAvailable') }}</li>
            </ul>
          </div>
        </Transition>
      </div>

      <!-- Related Books Section -->
      <div v-if="muchCategory" class="mt-12">
        <RelatedBooksCarousel :books="relatedBooksCategory" :title="t('bookdetails.booksSameCategory')" />
      </div>
      <div v-if="muchAuthor" class="mt-12">
        <RelatedBooksCarousel :books="relatedBooksAuthor" :title="t('bookdetails.booksSameAuthor')" />
      </div>
      <div v-if="muchPublisher" class="mt-12">
        <RelatedBooksCarousel :books="relatedBooksPublisher" :title="t('bookdetails.booksSamePublisher')" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { onBeforeRouteUpdate } from 'vue-router';
import RelatedBooksCarousel from '@/components/Book/RelatedBooksCarousel.vue';
import { useCartStore } from '@/stores/Cart';
import { useBooksStore } from '@/stores/Books';
import { useI18n } from 'vue-i18n';
import { useCustomerAuthStore } from '@/stores/customerAuth';
import { useUIStore } from '@/stores/ui';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();
const customerAuthStore = useCustomerAuthStore();
const uiStore = useUIStore();
const booksStore = useBooksStore();
const showFullDescription = ref(false);

const bookId = Number(route.params.id);
const book = computed(() => booksStore.book || {});

const relatedBooksCategory = ref([]);
const relatedBooksAuthor = ref([]);
const relatedBooksPublisher = ref([]);



// ...

onBeforeRouteUpdate(async (to, from, next) => {
  const newBookId = Number(to.params.id);
   window.scrollTo(0, 0);
  if (newBookId) {
    await booksStore.fetchBook(newBookId);
    await fetchRelatedData();
  }
  next();
});


const fetchRelatedData = async () => {
  if (!book.value || !book.value.id) return;

  const currentBookId = book.value.id;

  // Fetch by category
  if (book.value.category?.id) {
    const books = await booksStore.fetchBooksBy({ category_id: book.value.category.id, limit: 21 });
    relatedBooksCategory.value = books.filter(b => b.id !== currentBookId).slice(0, 20);
  }

  // Fetch by author
  if (book.value.author?.id) {
    // Assuming the backend supports filtering by author_id
    const books = await booksStore.fetchBooksBy({ author_id: book.value.author.id, limit: 21 });
    relatedBooksAuthor.value = books.filter(b => b.id !== currentBookId).slice(0, 20);
  }

  // Fetch by publisher
  if (book.value.publisher?.id) {
    // Assuming the backend supports filtering by publisher_id
    const books = await booksStore.fetchBooksBy({ publisher_id: book.value.publisher.id, limit: 21 });
    relatedBooksPublisher.value = books.filter(b => b.id !== currentBookId).slice(0, 20);
  }
};

onMounted(async () => {
  if (bookId) {
    await booksStore.fetchBook(bookId);
  }
});

// Watch for the book data to be loaded, then fetch related books.
watch(book, (newBook) => {
  if (newBook && newBook.id) {
    fetchRelatedData();
  }
}, { immediate: true, deep: true });


// تحقق إذا يوجد أكثر من كتاب بنفس الفئة/المؤلف/الناشر
const muchCategory = computed(() => relatedBooksCategory.value.length > 0);
const muchAuthor = computed(() => relatedBooksAuthor.value.length > 0);
const muchPublisher = computed(() => relatedBooksPublisher.value.length > 0);

const handleAddToCart = () => {
  if (book.value.id) {
    if (book.value.stock && book.value.stock > 0) {
      cartStore.addToCart(book.value.id, 1);
    } else {
      alert(t('bookdetails.outOfStock'));
    }
  } else {
    alert(t('bookdetails.bookNotFound'));
  }
};
const handleBuyNow = () => {
  if (book.value.id) {
    if (book.value.stock && book.value.stock > 0) {
      cartStore.addToCart(book.value.id, 1);
      if (customerAuthStore.isAuthenticated) {
        router.push('/checkout');
      } else {
        uiStore.openLoginModal();
      }
    } else {
      alert(t('bookdetails.outOfStock'));
    }
  } else {
    alert(t('bookdetails.bookNotFound'));
  }
};
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
