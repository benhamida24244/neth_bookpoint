<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'

// الإحصائيات
const stats = ref([
  {
    label: 'Total Books',
    value: '400',
    icon: 'fas fa-book text-blue-500',
    iconBg: 'bg-blue-50'
  },
  {
    label: 'Total Authors',
    value: '120',
    icon: 'fas fa-user-pen text-green-500',
    iconBg: 'bg-green-50'
  },
  {
    label: 'Total Publishers',
    value: '84',
    icon: 'fas fa-building text-yellow-500',
    iconBg: 'bg-yellow-50'
  },
  {
    label: 'Total Categories',
    value: '53',
    icon: 'fas fa-layer-group text-emerald-500',
    iconBg: 'bg-emerald-50'
  }
])

// الفلاتر
const activeFilter = ref('All Books')
const searchQuery = ref('')
const filters = ref([
  { label: 'All Books', value: 'All Books' },
  { label: 'Published', value: 'published' },
  { label: 'Pending', value: 'pending' },
  { label: 'Draft', value: 'draft' }
])

// بيانات الكتب
const books = ref([
  {
    id: 1,
    title: 'Vue.js for Beginners: A Comprehensive Guide',
    author: 'Sarah Chen',
    cover: 'https://m.media-amazon.com/images/I/71h02AXdgTL._UF1000,1000_QL80_.jpg',
    description: 'An approachable guide for aspiring Vue.js developers that covers everything from basic concepts to advanced techniques. Learn how to build modern, reactive web applications with Vue.js 3 and the Composition API.',
    stock: 132,
    publishingHouse: 'Dragon House Publishing',
    publisherDate: '2023-09-15',
    pages: 320,
    category: 'Programming',
    language: 'English',
    status: 'published',
    price: '$29.99',
    rating: 4.5,
    quantity: 1,
    pricing: {
      basePrice: 29.99,
      shipping: 5.99,
      tax: 2.40,
      discount: 0
    },
    dates: {
      created: '2023-09-01T10:00:00Z',
      updated: '2023-09-15T14:30:00Z'
    }
  },
  {
    id: 2,
    title: 'Advanced Tailwind CSS: Building Modern Interfaces',
    author: 'Michael B. Davis',
    cover: 'https://m.media-amazon.com/images/I/5125KM6SBQL._UF1000,1000_QL80_.jpg',
    description: 'Dive deep into Tailwind CSS with this advanced guide that teaches you how to create stunning, responsive user interfaces. Master utility-first CSS and learn best practices for scalable design systems.',
    stock: 45,
    publishingHouse: 'Modern Web Solutions',
    publisherDate: '2024-03-20',
    pages: 280,
    category: 'Web Design',
    language: 'English',
    status: 'pending',
    price: '$34.50',
    rating: 4.8,
    quantity: 1,
    pricing: {
      basePrice: 34.50,
      shipping: 5.99,
      tax: 2.76,
      discount: 5.00
    },
    dates: {
      created: '2024-03-01T09:00:00Z',
      updated: '2024-03-20T16:45:00Z'
    }
  },
  {
    id: 3,
    title: 'Mastering Laravel: From Novice to Artisan',
    author: 'Jessica Lee',
    cover: 'https://m.media-amazon.com/images/I/61NLKoD4kVL._UF1000,1000_QL80_.jpg',
    description: 'Unlock the full potential of Laravel with this comprehensive guide that takes you from basic concepts to advanced architectural patterns. Learn to build robust, scalable web applications with PHP\'s most popular framework.',
    stock: 18,
    publishingHouse: 'Artisan Press',
    publisherDate: '2022-11-01',
    pages: 410,
    category: 'Web Development',
    language: 'English',
    status: 'draft',
    price: '$49.99',
    rating: 4.7,
    quantity: 1,
    pricing: {
      basePrice: 49.99,
      shipping: 7.99,
      tax: 4.00,
      discount: 10.00
    },
    dates: {
      created: '2022-10-15T11:30:00Z',
      updated: '2022-11-01T13:20:00Z'
    }
  },
  {
    id: 4,
    title: 'The Art of Clean Code',
    author: 'Robert C. Martin',
    cover: 'https://m.media-amazon.com/images/I/41xShlnTZTL._SX376_BO1,204,203,200_.jpg',
    description: 'A must-read for every programmer. This book teaches you principles of writing clean, maintainable, efficient code that stands the test of time and collaborative development.',
    stock: 210,
    publishingHouse: 'Prentice Hall',
    publisherDate: '2008-08-01',
    pages: 464,
    category: 'Software Engineering',
    language: 'English',
    status: 'published',
    price: '$45.00',
    rating: 4.9,
    quantity: 1,
    pricing: {
      basePrice: 45.00,
      shipping: 6.99,
      tax: 3.60,
      discount: 0
    },
    dates: {
      created: '2008-07-15T08:00:00Z',
      updated: '2008-08-01T12:00:00Z'
    }
  },
  {
    id: 5,
    title: 'Data Science with Python',
    author: 'Wes McKinney',
    cover: 'https://m.media-amazon.com/images/I/51WiLueukxL._SX379_BO1,204,203,200_.jpg',
    description: 'An in-depth introduction to data science tools and techniques using Python. Learn pandas, NumPy, matplotlib, and other essential libraries for data analysis and visualization.',
    stock: 78,
    publishingHouse: 'O\'Reilly Media',
    publisherDate: '2017-10-25',
    pages: 560,
    category: 'Data Science',
    language: 'English',
    status: 'published',
    price: '$59.95',
    rating: 4.6,
    quantity: 1,
    pricing: {
      basePrice: 59.95,
      shipping: 8.99,
      tax: 4.80,
      discount: 0
    },
    dates: {
      created: '2017-10-01T14:00:00Z',
      updated: '2017-10-25T10:30:00Z'
    }
  }
])


// تصفية البيانات
const filteredBooks = computed(() => {
  let filtered = books.value

  if (activeFilter.value !== 'All Books') {
    filtered = filtered.filter(book => book.status === activeFilter.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(book =>
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query) ||
      book.publishingHouse.toLowerCase().includes(query)
    )
  }

  return filtered
})

// تصنيف الحالة
const getStatusClass = (status) => {
  const statusClasses = {
    published: 'bg-green-50 text-green-700',
    pending: 'bg-yellow-50 text-yellow-700',
    draft: 'bg-red-50 text-red-700'
  }
  return statusClasses[status] || 'bg-gray-50 text-gray-700'
}
</script>



<template>
  <div class="min-h-screen bg-gray-50">
    <div class="w-full px-4 md:px-6 py-8">
      <div class="max-w-7xl mx-auto mb-8 font-BonaRegular">
        <h1 class="text-2xl md:text-3xl font-bold text-gray-800">Books Dashboard</h1>
        <p class="text-gray-600 mt-1">Track and manage all your books efficiently</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div v-for="stat in stats" :key="stat.label" class="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
          <div :class="stat.iconBg" class="p-3 rounded-lg">
            <i :class="stat.icon" class="text-lg"></i>
          </div>
          <div>
            <p class="text-sm text-gray-500">{{ stat.label }}</p>
            <p class="text-lg font-semibold text-gray-800">{{ stat.value }}</p>
          </div>
        </div>
      </div>

      <!-- Filters and Search -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div class="flex flex-wrap gap-2">
          <button
            v-for="filter in filters"
            :key="filter.value"
            @click="activeFilter = filter.value"
            :class="[
              'px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium transition-all duration-200',
              activeFilter === filter.value ? 'bg-yellow-600 text-white border-yellow-600' : 'hover:bg-gray-50'
            ]"
          >
            {{ filter.label }}
          </button>
        </div>

        <div class="relative w-full md:w-auto">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search books..."
            class="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
          >
          <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
        </div>
      </div>

      <!-- Books Table -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cover</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Publisher</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="book in filteredBooks" :key="book.id" class="hover:bg-gray-50 transition-colors duration-200">
                <td class="px-6 py-4 whitespace-nowrap">
                  <img :src="book.cover" alt="cover" class="w-10 h-14 rounded shadow" />
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{{ book.title }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ book.author }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ book.publishingHouse }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusClass(book.status)" class="px-3 py-1 rounded-full text-xs font-medium">
                    {{ book.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ book.price }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ book.publisherDate }}</td>
                 <td class="px-6 py-4 whitespace-nowrap text-center text-sm">
                  <RouterLink :to="`/dashboard/books/${book.id}`" class="text-yellow-600 hover:text-yellow-700 flex items-center gap-1 text-sm font-medium">
                    <i class="far fa-eye"></i> View
                  </RouterLink>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-if="filteredBooks.length === 0" class="p-12 text-center">
          <div class="mx-auto w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <i class="far fa-file-alt text-gray-400 text-3xl"></i>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-1">No books found</h3>
          <p class="text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

body {
  font-family: 'Inter', sans-serif;
}
</style>
