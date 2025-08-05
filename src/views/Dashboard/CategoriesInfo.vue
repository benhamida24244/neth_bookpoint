<script setup>
import { ref, computed } from 'vue'
import BookList from '@/components/Book/Shop/BookList.vue'
import { useRoute } from 'vue-router'
import BookCategoryList from '@/components/Book/BookCategoryList.vue'

const isOpenEdit = ref(false)
const route = useRoute()
const currentId = parseInt(route.params.id)

const categories = ref([
  {
    id: 1,
    name: 'Mystery & Thriller',
    icon: 'pi-search',
    description: 'Exploring suspense and thrillers.',
    status: 'active',
    orders: 43,
    nmBook: 12,
    createdAt: '2025-07-10T12:00:00Z',
    color: 'bg-yellow-700',
    url: '#',
  },
  {
    id: 2,
    name: 'Science Fiction',
    icon: 'pi-globe',
    description: 'Futuristic and scientific imagination.',
    status: 'active',
    orders: 58,
    nmBook: 25,
    createdAt: '2025-07-09T11:30:00Z',
    color: 'bg-yellow-700',
    url: '#',
  },
  {
    id: 3,
    name: 'Fantasy',
    icon: 'pi-sparkles',
    description: 'Magical and mythical worlds.',
    status: 'active',
    orders: 75,
    nmBook: 33,
    createdAt: '2025-07-08T15:10:00Z',
    color: 'bg-yellow-700',
    url: '#',
  },
  {
    id: 4,
    name: 'Romance',
    icon: 'pi-heart-fill',
    description: 'Love and emotional stories.',
    status: 'active',
    orders: 92,
    nmBook: 40,
    createdAt: '2025-07-07T09:05:00Z',
    color: 'bg-yellow-700',
    url: '#',
  },
  {
    id: 5,
    name: 'History',
    icon: 'pi-book',
    description: 'Historical events and biographies.',
    status: 'inactive',
    orders: 21,
    nmBook: 18,
    createdAt: '2025-07-06T18:45:00Z',
    color: 'bg-yellow-700',
    url: '#',
  },
  {
    id: 6,
    name: 'Kids',
    icon: 'pi-prime',
    description: 'Fun stories for children.',
    status: 'active',
    orders: 110,
    nmBook: 50,
    createdAt: '2025-07-05T10:20:00Z',
    color: 'bg-yellow-700',
    url: '#',
  },
  {
    id: 7,
    name: 'Biography',
    icon: 'pi-user',
    description: 'Life stories of influential people.',
    status: 'active',
    orders: 35,
    nmBook: 15,
    createdAt: '2025-07-04T13:00:00Z',
    color: 'bg-yellow-700',
    url: '#',
  },
  {
    id: 8,
    name: 'Cooking',
    icon: 'pi-apple',
    description: 'Recipes and culinary arts.',
    status: 'active',
    orders: 48,
    nmBook: 22,
    createdAt: '2025-07-03T16:50:00Z',
    color: 'bg-yellow-700',
    url: '#',
  },
  {
    id: 9,
    name: 'Self-Help',
    icon: 'pi-sun',
    description: 'Guides for personal development.',
    status: 'inactive',
    orders: 65,
    nmBook: 28,
    createdAt: '2025-07-02T11:15:00Z',
    color: 'bg-yellow-700',
    url: '#',
  },
  {
    id: 10,
    name: 'Comics & Graphic Novels',
    icon: 'pi-palette',
    description: 'Visual storytelling.',
    status: 'active',
    orders: 88,
    nmBook: 45,
    createdAt: '2025-07-01T20:00:00Z',
    color: 'bg-yellow-700',
    url: '#',
  },
])

const statistics = ref([
  {
    id: 1,
    name: 'Total Orders',
    icon: 'fas fa-layer-group',
    value: 21,
    color: 'bg-blue-500',
    ariaLabel: '21 total orders',
  },
  {
    id: 2,
    name: 'Total Books',
    icon: 'fas fa-book',
    value: 234,
    color: 'bg-green-500',
    ariaLabel: '234 total books',
  },
  {
    id: 3,
    name: 'Total Profit',
    icon: 'fas fa-dollar-sign',
    value: 2343,
    color: 'bg-yellow-500',
    ariaLabel: '$2,343 total profit',
    prefix: '$',
  },
])

const isLoading = ref(false)

const currentCategory = computed(() => {
  return (
    categories.value.find((cat) => cat.id === currentId) || {
      name: 'Unknown Category',
      description: 'No description available.',
    }
  )
})

const formattedStatistics = computed(() => {
  return statistics.value.map((stat) => ({
    ...stat,
    displayValue: stat.prefix
      ? `${stat.prefix}${stat.value.toLocaleString()}`
      : stat.value.toLocaleString(),
  }))
})

const handleEdite = () => {
  isOpenEdit.value = !isOpenEdit.value
}
const handleImageError = (event) => {
  event.target.src = '/placeholder-book.jpg'
}
</script>

<template>
  <div class="w-full min-h-screen bg-gray-50 py-8 px-4 sm:py-16">
    <div class="max-w-7xl mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        <div class="flex justify-center lg:justify-start">
          <div class="relative">
            <div
              class="h-64 w-64 sm:h-80 sm:w-80 rounded-full shadow-2xl shadow-yellow-600/30 bg-yellow-800 flex items-center justify-center text-white text-9xl"
            >
              <i class="pi" :class="currentCategory.icon"></i>
            </div>
            <div
              class="absolute inset-0 rounded-full bg-gradient-to-tr from-yellow-600/20 to-transparent pointer-events-none"
            ></div>
          </div>
        </div>

        <div class="lg:col-span-2 flex flex-col justify-center space-y-6">
         <div class="flex flex-col gap-4 absolute right-2 top-2">
  <!-- زر التعديل الرئيسي -->
  <button
    class="bg-yellow-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-yellow-700 transition-colors duration-300 font-BonaRegular"
    @click="handleEdite"
  >
    Edit
  </button>

  <!-- تظهر خيارات التعديل عند isOpenEdit -->
  <div v-if="isOpenEdit" class="flex flex-col gap-2">
    <button
      class="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300 font-BonaRegular"
      @click="editName"
    >
      Edit Name
    </button>

    <button
      class="bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 transition-colors duration-300 font-BonaRegular"
      @click="editImage"
    >
      Edit Image
    </button>

    <button
      class="bg-purple-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-purple-700 transition-colors duration-300 font-BonaRegular"
      @click="editDescription"
    >
      Edit Description
    </button>

    <button
      class="bg-red-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-700 transition-colors duration-300 font-BonaRegular"
      @click="unpublish"
    >
      Unpublish
    </button>
  </div>
</div>

          <div class="h-1 bg-gradient-to-r from-yellow-600 to-transparent w-full max-w-xs"></div>
          <h1
            class="text-3xl sm:text-4xl lg:text-5xl font-bold text-yellow-700 leading-tight font-BonaRegular"
          >
            {{ currentCategory.name }}
          </h1>
          <div class="h-1 bg-gradient-to-r from-yellow-600 to-transparent w-20"></div>
          <p class="text-gray-700 text-base sm:text-lg leading-relaxed max-w-2xl font-BonaRegular">
            {{ currentCategory.description }}
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            <div
              v-for="stat in formattedStatistics"
              :key="stat.id"
              class="flex items-center gap-4 border border-yellow-600/30 rounded-xl p-4 bg-white/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:border-yellow-600/50"
              :aria-label="stat.ariaLabel"
            >
              <div :class="[stat.color, 'p-3 rounded-full shadow-md']" class="flex-shrink-0">
                <i :class="[stat.icon, 'text-white text-xl']" aria-hidden="true"></i>
              </div>
              <div class="flex flex-col min-w-0 flex-1">
                <p class="font-semibold text-gray-800 text-sm truncate">{{ stat.name }}</p>
                <p class="text-xl font-bold text-gray-900">{{ stat.displayValue }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section class="max-w-7xl mx-auto px-4 py-12 lg:py-16">
        <header class="text-center mb-12">
          <h2
            class="text-2xl sm:text-3xl lg:text-4xl font-bold text-yellow-600 mb-4 font-BonaRegular"
          >
            Books in {{ currentCategory.name }}
          </h2>
          <div
            class="h-px bg-gradient-to-r from-transparent via-yellow-600/50 to-transparent w-32 mx-auto"
          ></div>
        </header>

        <Suspense>
          <BookCategoryList :category="currentCategory.name" />
          <template #fallback>
            <div class="flex justify-center items-center py-12">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
            </div>
          </template>
        </Suspense>
      </section>
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in-up {
  animation: fadeInUp 0.6s ease-out;
}

button {
  min-height: 2.5rem;
}

@media (max-width: 640px) {
  h1 {
    font-size: 2rem;
  }
  h2 {
    font-size: 1.5rem;
  }
}
</style>
