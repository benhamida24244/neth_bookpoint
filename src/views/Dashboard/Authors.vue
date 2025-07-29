<script setup>
import { ref, computed } from 'vue';

const searchQuery = ref('');
const selectedCountry = ref('');
const sortBy = ref('name');
const sortOrder = ref('asc');

const authors = [
  {
    id: 1,
    name: 'Stephen King',
    url: 'https://www.barnesandnoble.com/b/contributor/stephen-king/_/N-2k9Z8q8',
    img: 'https://prodimage.images-bn.com/pimages/9781501142970_p0_v1_s600x595.jpg',
    nmbBook: 87,
    description: 'An icon of horror, supernatural fiction, and suspense. Known as the "King of Horror," his captivating stories have terrified and thrilled readers for decades.',
    SpendMuch: 1500,
    Orders_count: 120,
    Country: 'American',
    email: 'stephen.king@example.com',
    phone: '+1-555-0101',
    Registration_date: '2020-01-15'
  },
  {
    id: 2,
    name: 'J.K. Rowling',
    url: 'https://www.barnesandnoble.com/b/contributor/j-k-rowling/_/N-2k9Z8q8Z1z141yl',
    img: 'https://prodimage.images-bn.com/pimages/9781338878929_p0_v1_s600x595.jpg',
    nmbBook: 24,
    description: 'The creative genius behind the enchanting world of Harry Potter. Her magical storytelling has inspired a global generation of readers and dreamers.',
    SpendMuch: 1500,
    Orders_count: 120,
    Country: 'British',
    email: 'jk.rowling@example.com',
    phone: '+44-555-0102',
    Registration_date: '2019-08-22'
  },
  {
    id: 3,
    name: 'Colleen Hoover',
    url: 'https://www.barnesandnoble.com/b/contributor/colleen-hoover/_/N-2k9Z8q8Z1z141yc',
    img: 'https://prodimage.images-bn.com/pimages/9781501110344_p0_v1_s600x595.jpg',
    nmbBook: 22,
    description: 'A powerhouse in contemporary romance and young adult fiction. Hoover is celebrated for her emotionally charged novels that explore love, heartbreak, and resilience.',
    SpendMuch: 2200,
    Orders_count: 89,
    Country: 'American',
    email: 'colleen.hoover@example.com',
    phone: '+1-555-0103',
    Registration_date: '2021-03-10'
  },
  {
    id: 4,
    name: 'James Patterson',
    url: 'https://www.barnesandnoble.com/b/contributor/james-patterson/_/N-2k9Z8q8Z1z141yo',
    img: 'https://prodimage.images-bn.com/pimages/9780316407090_p0_v1_s600x595.jpg',
    nmbBook: 350,
    description: 'One of the world\'s most prolific and bestselling authors. Patterson is a master of the thriller genre, known for his fast-paced plots and unforgettable characters.',
    SpendMuch: 3500,
    Orders_count: 156,
    Country: 'American',
    email: 'james.patterson@example.com',
    phone: '+1-555-0104',
    Registration_date: '2018-11-05'
  },
  {
    id: 5,
    name: 'Agatha Christie',
    url: 'https://www.barnesandnoble.com/b/contributor/agatha-christie/_/N-2k9Z8q8Z1z141y9',
    img: 'https://prodimage.images-bn.com/pimages/9780062073488_p0_v2_s600x595.jpg',
    nmbBook: 80,
    description: 'The undisputed "Queen of Crime." Christie penned timeless detective novels, creating iconic sleuths like Hercule Poirot and Miss Marple who continue to captivate.',
    SpendMuch: 1800,
    Orders_count: 95,
    Country: 'British',
    email: 'agatha.christie@example.com',
    phone: '+44-555-0105',
    Registration_date: '2017-06-12'
  },
  {
    id: 6,
    name: 'George R. R. Martin',
    url: 'https://www.barnesandnoble.com/b/contributor/george-r-r-martin/_/N-2k9Z8q8Z1z141yt',
    img: 'https://prodimage.images-bn.com/pimages/9780553573404_p0_v2_s600x595.jpg',
    nmbBook: 34,
    description: 'The architect of the epic fantasy saga "A Song of Ice and Fire." Martin is renowned for his intricate world-building and morally complex characters.',
    SpendMuch: 2800,
    Orders_count: 134,
    Country: 'American',
    email: 'george.martin@example.com',
    phone: '+1-555-0106',
    Registration_date: '2019-02-28'
  },
  {
    id: 7,
    name: 'Brandon Sanderson',
    url: 'https://www.barnesandnoble.com/b/contributor/brandon-sanderson/_/N-2k9Z8q8Z1z141xe',
    img: 'https://prodimage.images-bn.com/pimages/9780765376671_p0_v3_s600x595.jpg',
    nmbBook: 58,
    description: 'A master of modern fantasy, famous for his detailed magic systems and the interconnected "Cosmere" universe. Sanderson is a prolific and beloved storyteller.',
    SpendMuch: 2100,
    Orders_count: 98,
    Country: 'American',
    email: 'brandon.sanderson@example.com',
    phone: '+1-555-0107',
    Registration_date: '2020-09-14'
  },
  {
    id: 8,
    name: 'Margaret Atwood',
    url: 'https://www.barnesandnoble.com/b/contributor/margaret-atwood/_/N-2k9Z8q8Z1z141yx',
    img: 'https://prodimage.images-bn.com/pimages/9780385490818_p0_v2_s600x595.jpg',
    nmbBook: 65,
    description: 'A literary titan whose work spans speculative fiction, historical fiction, and poetry. Atwood is acclaimed for her sharp social commentary and visionary novels like "The Handmaid\'s Tale."',
    SpendMuch: 1900,
    Orders_count: 87,
    Country: 'Canadian',
    email: 'margaret.atwood@example.com',
    phone: '+1-555-0108',
    Registration_date: '2018-04-03'
  }
];

// Computed properties for filtering and sorting
const filteredAuthors = computed(() => {
  let filtered = authors.filter(author => {
    const matchesSearch = author.name.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesCountry = selectedCountry.value === '' || author.Country === selectedCountry.value;
    return matchesSearch && matchesCountry;
  });

  // Sort the filtered results
  filtered.sort((a, b) => {
    let aValue = a[sortBy.value];
    let bValue = b[sortBy.value];

    // Handle numeric sorting
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortOrder.value === 'asc' ? aValue - bValue : bValue - aValue;
    }

    // Handle string sorting
    aValue = String(aValue).toLowerCase();
    bValue = String(bValue).toLowerCase();

    if (sortOrder.value === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  return filtered;
});

// Computed property for total orders
const totalOrders = computed(() => {
  return filteredAuthors.value.reduce((sum, author) => sum + author.Orders_count, 0);
});

// Computed property for unique countries
const countries = computed(() => {
  const uniqueCountries = [...new Set(authors.map(author => author.Country))];
  return uniqueCountries.sort();
});

// Methods
const clearFilters = () => {
  searchQuery.value = '';
  selectedCountry.value = '';
  sortBy.value = 'name';
  sortOrder.value = 'asc';
};

const handleSort = (field) => {
  if (sortBy.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortBy.value = field;
    sortOrder.value = 'asc';
  }
};

const getSortIcon = (field) => {
  if (sortBy.value !== field) return '↕️';
  return sortOrder.value === 'asc' ? '↑' : '↓';
};
</script>

<template>
  <div class="w-full sm:px-8 lg:px-16 mt-8">
    <!-- Header Section -->
    <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
      <!-- Search and Filters -->
      <div class="flex flex-col sm:flex-row gap-4 w-full lg:w-2/3">
        <input
          v-model="searchQuery"
          placeholder="Search for Author"
          type="text"
          class="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-yellow-600"
        />
        <select
          v-model="selectedCountry"
          class="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
        >
          <option value="">All Countries</option>
          <option v-for="country in countries" :key="country" :value="country">
            {{ country }}
          </option>
        </select>
        <button
          @click="clearFilters"
          class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 whitespace-nowrap"
        >
          Clear Filters
        </button>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-3 w-full lg:w-auto">
        <button class="bg-gray-200 text-black px-4 py-2 rounded-lg hover:bg-gray-300 flex-1 lg:flex-none">
          Add Author
        </button>
        <button class="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 flex-1 lg:flex-none">
          Export
        </button>
      </div>
    </div>

    <!-- Sort Options -->
    <div class="flex flex-wrap gap-2 mb-4">
      <span class="text-sm font-medium text-gray-600 mr-2">Sort by:</span>
      <button
        v-for="field in ['name', 'Orders_count', 'SpendMuch', 'nmbBook']"
        :key="field"
        @click="handleSort(field)"
        :class="[
          'px-3 py-1 text-xs rounded-full border transition-colors',
          sortBy === field
            ? 'bg-yellow-600 text-white border-yellow-600'
            : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
        ]"
      >
        {{ field === 'nmbBook' ? 'Books' : field.replace('_', ' ') }}
        {{ getSortIcon(field) }}
      </button>
    </div>

    <!-- Analytics Row -->
    <div class="flex flex-col sm:flex-row justify-between mt-6 gap-4">
      <div class="flex items-center bg-yellow-50 px-4 py-2 rounded-lg">
        <p class="text-lg font-bold text-gray-600">Total Authors:</p>
        <span class="ml-2 text-yellow-600 font-bold text-lg">{{ filteredAuthors.length }}</span>
      </div>
      <div class="flex items-center bg-green-50 px-4 py-2 rounded-lg">
        <p class="text-lg font-bold text-gray-600">Total Orders:</p>
        <span class="ml-2 text-green-600 font-bold text-lg">{{ totalOrders }}</span>
      </div>
      <div class="flex items-center bg-blue-50 px-4 py-2 rounded-lg">
        <p class="text-lg font-bold text-gray-600">Total Books:</p>
        <span class="ml-2 text-blue-600 font-bold text-lg">
          {{ filteredAuthors.reduce((sum, author) => sum + author.nmbBook, 0) }}
        </span>
      </div>
    </div>

    <!-- Table Section -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-6 mb-8">
      <!-- Mobile Card View -->
      <div class="lg:hidden">
        <div v-for="author in filteredAuthors" :key="author.id" class="border-b border-gray-200 p-4">
          <div class="flex justify-between items-start mb-2">
            <h3 class="font-semibold text-gray-900">{{ author.name }}</h3>
            <span class="text-sm text-gray-500">#{{ author.id }}</span>
          </div>
          <div class="space-y-1 text-sm text-gray-600">
            <p><span class="font-medium">Country:</span> {{ author.Country }}</p>
            <p><span class="font-medium">Orders:</span> {{ author.Orders_count }}</p>
            <p><span class="font-medium">Spent:</span> ${{ author.SpendMuch }}</p>
            <p><span class="font-medium">Books:</span> {{ author.nmbBook }}</p>
            <p><span class="font-medium">Email:</span> {{ author.email }}</p>
          </div>
          <div class="mt-3">
            <button class="text-yellow-600 hover:text-yellow-700 flex items-center gap-1 text-sm font-medium">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
              View Details
            </button>
          </div>
        </div>
      </div>

      <!-- Desktop Table View -->
      <div class="hidden lg:block overflow-x-auto">
        <table class="min-w-full">
          <thead class="bg-gray-50">
            <tr>
              <th
                @click="handleSort('name')"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                Name {{ getSortIcon('name') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th
                @click="handleSort('Orders_count')"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                Orders {{ getSortIcon('Orders_count') }}
              </th>
              <th
                @click="handleSort('SpendMuch')"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                Total Spent {{ getSortIcon('SpendMuch') }}
              </th>
              <th
                @click="handleSort('nmbBook')"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                Books {{ getSortIcon('nmbBook') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="author in filteredAuthors" :key="author.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{{ author.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-500">#{{ author.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-500">{{ author.Orders_count }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-500">${{ author.SpendMuch.toLocaleString() }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-500">{{ author.nmbBook }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-500">{{ author.Country }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <button class="text-yellow-600 hover:text-yellow-700 flex items-center gap-1 text-sm font-medium">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                   <RouterLink :to="`/dashboard/authors/${author.id}`" class="text-yellow-600 hover:text-yellow-700 flex items-center gap-1 text-sm font-medium">
                    View
                  </RouterLink>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="filteredAuthors.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No authors found</h3>
        <p class="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
        <button
          @click="clearFilters"
          class="mt-4 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
        >
          Clear Filters
        </button>
      </div>
    </div>
  </div>
</template>
