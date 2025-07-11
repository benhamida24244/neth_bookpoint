<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { onMounted } from 'vue'
import BookList from '@/components/Book/Shop/BookList.vue'

// بيانات المؤلفين ثابتة
const authors = [
  {
    id: 1,
    name: 'Stephen King',
    url: 'https://www.barnesandnoble.com/b/contributor/stephen-king/_/N-2k9Z8q8',
    img: 'https://prodimage.images-bn.com/pimages/9781501142970_p0_v1_s600x595.jpg',
    nmbBook: 87,
    description:
      'An icon of horror, supernatural fiction, and suspense. Known as the "King of Horror," his captivating stories have terrified and thrilled readers for decades.',
  },
  {
    id: 2,
    name: 'J.K. Rowling',
    url: 'https://www.barnesandnoble.com/b/contributor/j-k-rowling/_/N-2k9Z8q8Z1z141yl',
    img: 'https://prodimage.images-bn.com/pimages/9781338878929_p0_v1_s600x595.jpg',
    nmbBook: 24,
    description:
      'The creative genius behind the enchanting world of Harry Potter. Her magical storytelling has inspired a global generation of readers and dreamers.',
  },
  {
    id: 3,
    name: 'Colleen Hoover',
    url: 'https://www.barnesandnoble.com/b/contributor/colleen-hoover/_/N-2k9Z8q8Z1z141yc',
    img: 'https://prodimage.images-bn.com/pimages/9781501110344_p0_v1_s600x595.jpg',
    nmbBook: 22,
    description:
      'A powerhouse in contemporary romance and young adult fiction. Hoover is celebrated for her emotionally charged novels that explore love, heartbreak, and resilience.',
  },
  {
    id: 4,
    name: 'James Patterson',
    url: 'https://www.barnesandnoble.com/b/contributor/james-patterson/_/N-2k9Z8q8Z1z141yo',
    img: 'https://prodimage.images-bn.com/pimages/9780316407090_p0_v1_s600x595.jpg',
    nmbBook: 350,
    description:
      "One of the world's most prolific and bestselling authors. Patterson is a master of the thriller genre, known for his fast-paced plots and unforgettable characters.",
  },
  {
    id: 5,
    name: 'Agatha Christie',
    url: 'https://www.barnesandnoble.com/b/contributor/agatha-christie/_/N-2k9Z8q8Z1z141y9',
    img: 'https://prodimage.images-bn.com/pimages/9780062073488_p0_v2_s600x595.jpg',
    nmbBook: 80,
    description:
      'The undisputed "Queen of Crime." Christie penned timeless detective novels, creating iconic sleuths like Hercule Poirot and Miss Marple who continue to captivate.',
  },
  {
    id: 6,
    name: 'George R. R. Martin',
    url: 'https://www.barnesandnoble.com/b/contributor/george-r-r-martin/_/N-2k9Z8q8Z1z141yt',
    img: 'https://prodimage.images-bn.com/pimages/9780553573404_p0_v2_s600x595.jpg',
    nmbBook: 34,
    description:
      'The architect of the epic fantasy saga "A Song of Ice and Fire." Martin is renowned for his intricate world-building and morally complex characters.',
  },
  {
    id: 7,
    name: 'Brandon Sanderson',
    url: 'https://www.barnesandnoble.com/b/contributor/brandon-sanderson/_/N-2k9Z8q8Z1z141xe',
    img: 'https://prodimage.images-bn.com/pimages/9780765376671_p0_v3_s600x595.jpg',
    nmbBook: 58,
    description:
      'A master of modern fantasy, famous for his detailed magic systems and the interconnected "Cosmere" universe. Sanderson is a prolific and beloved storyteller.',
  },
  {
    id: 8,
    name: 'Margaret Atwood',
    url: 'https://www.barnesandnoble.com/b/contributor/margaret-atwood/_/N-2k9Z8q8Z1z141yx',
    img: 'https://prodimage.images-bn.com/pimages/9780385490818_p0_v2_s600x595.jpg',
    nmbBook: 65,
    description:
      'A literary titan whose work spans speculative fiction, historical fiction, and poetry. Atwood is acclaimed for her sharp social commentary and visionary novels like "The Handmaid\'s Tale."',
  },
]

const route = useRoute()
const authorId = computed(() => parseInt(route.params.id))
const selectedAuthor = computed(() => authors.find((a) => a.id === authorId.value))

onMounted(() => {
  window.scrollTo(0, 0)
})
</script>

<template>
  <div class="w-full min-h-screen bg-black">
    <!-- Hero Section -->
    <div class="relative bg-black py-16 px-4">
      <div class="absolute inset-0 bg-black/30"></div>
      <div class="relative max-w-6xl mx-auto">
        <div v-if="selectedAuthor" class="text-center mb-8">
          <!-- Decorative elements -->
          <div class="flex justify-center mb-6">
            <div
              class="h-px bg-gradient-to-r from-transparent via-yellow-600 to-transparent w-24"
            ></div>
          </div>

          <div class="grid md:grid-cols-2 gap-12 items-center">
            <!-- Author Image -->
            <div class="flex justify-center">
              <div class="relative group">
                <div
                  class="absolute -inset-4 bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-full blur opacity-25 group-hover:opacity-40 transition duration-300"
                ></div>
                <img
                  :src="selectedAuthor.img"
                  :alt="selectedAuthor.name"
                  class="relative w-64 h-64 object-cover rounded-full shadow-2xl ring-4 ring-yellow-600/20 group-hover:ring-yellow-600/40 transition-all duration-300"
                />
              </div>
            </div>

            <!-- Author Info -->
            <div class="text-white font-BonaRegular space-y-6">
              <div>
                <h1 class="text-4xl md:text-5xl font-bold text-yellow-600 mb-3 leading-tight">
                  {{ selectedAuthor.name }}
                </h1>
                <div class="h-1 bg-gradient-to-r from-yellow-600 to-transparent w-20 mb-6"></div>
              </div>

              <p class="text-gray-300 text-lg leading-relaxed italic">
                {{ selectedAuthor.description }}
              </p>

              <!-- Stats -->
              <div class="flex flex-wrap gap-6 items-center">
                <div
                  class="flex items-center gap-3 bg-gray-800/50 px-4 py-2 rounded-lg border border-gray-700"
                >
                  <span class="text-2xl">📚</span>
                  <div>
                    <p class="text-yellow-600 font-bold text-xl">{{ selectedAuthor.nmbBook }}</p>
                    <p class="text-gray-400 text-sm">Books</p>
                  </div>
                </div>

                <div
                  class="flex items-center gap-3 bg-gray-800/50 px-4 py-2 rounded-lg border border-gray-700"
                >
                  <span class="text-2xl">⭐</span>
                  <div>
                    <p class="text-yellow-600 font-bold text-xl">Author</p>
                    <p class="text-gray-400 text-sm">Featured</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Error State -->
        <div v-else class="text-center text-white py-16">
          <div class="max-w-md mx-auto">
            <div class="mb-6">
              <div
                class="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <svg
                  class="w-8 h-8 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <h2 class="text-2xl font-bold text-red-500 mb-2">Author Not Found!</h2>
              <p class="text-gray-400">Please check the URL or return to the authors list.</p>
            </div>

            <button
              @click="$router.go(-1)"
              class="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors duration-300"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                ></path>
              </svg>
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Books Section -->
    <div class="bg-black">
      <div class="max-w-6xl mx-auto px-4 py-8">
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold text-yellow-600 font-BonaRegular mb-4">
            Books by {{ selectedAuthor?.name }}
          </h2>
          <div
            class="h-px bg-gradient-to-r from-transparent via-yellow-600/50 to-transparent w-32 mx-auto"
          ></div>
        </div>
        <BookList />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in-up {
  animation: fadeInUp 0.6s ease-out;
}

/* Custom scrollbar for better aesthetics */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #1a1a1a;
}

::-webkit-scrollbar-thumb {
  background: #d97706;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #f59e0b;
}
</style>
