<script setup>
import { ref, computed } from 'vue';

const searchQuery = ref('');
const selectedCountry = ref('');
const sortBy = ref('name');
const sortOrder = ref('asc');

const publishingHouses = [
  {
    id: 1,
    name: 'Penguin Random House',
    url: 'https://www.penguinrandomhouse.com/',
    img: 'https://placehold.co/600x595/000000/ffffff?text=PRH',
    titlesPublishedAnnually: 15000,
    description: 'A global publishing leader formed in 2013, home to over 300 diverse and prestigious imprints. They publish bestselling fiction, non-fiction, and children\'s books.',
    annualRevenueMillions: 4200, // In USD
    imprintCount: 320,
    country: 'USA',
    email: 'contact@penguinrandomhouse.com',
    phone: '+1-212-782-9000',
    foundedYear: 2013,
    // Fixed: Added missing properties that were referenced in template
    ordersCount: 1250,
    spendMuch: 2850000,
    nmbBook: 45000
  },
  {
    id: 2,
    name: 'HarperCollins',
    url: 'https://www.harpercollins.com/',
    img: 'https://placehold.co/600x595/0055a3/ffffff?text=HC',
    titlesPublishedAnnually: 10000,
    description: 'One of the "Big Five" English-language publishing companies with a rich history stretching back to the early 19th century. Known for a wide range of genres.',
    annualRevenueMillions: 2200, // In USD
    imprintCount: 120,
    country: 'USA',
    email: 'info@harpercollins.com',
    phone: '+1-212-207-7000',
    foundedYear: 1817,
    ordersCount: 980,
    spendMuch: 1950000,
    nmbBook: 32000
  },
  {
    id: 3,
    name: 'Hachette Livre',
    url: 'https://www.hachette.com/en/',
    img: 'https://placehold.co/600x595/1f4d89/ffffff?text=Hachette',
    titlesPublishedAnnually: 20000,
    description: 'A major French publishing group and one of the largest in the world. They have a strong presence in educational and general literature markets globally.',
    annualRevenueMillions: 3100, // In Euros
    imprintCount: 150,
    country: 'France',
    email: 'communication@hachette-livre.fr',
    phone: '+33-1-43-92-30-00',
    foundedYear: 1826,
    ordersCount: 1450,
    spendMuch: 3200000,
    nmbBook: 58000
  },
  {
    id: 4,
    name: 'Scholastic Corporation',
    url: 'https://www.scholastic.com/',
    img: 'https://placehold.co/600x595/e6001a/ffffff?text=Scholastic',
    titlesPublishedAnnually: 750,
    description: 'The world\'s largest publisher and distributor of children\'s books, renowned for its book fairs, book clubs, and popular franchises like Harry Potter and The Hunger Games.',
    annualRevenueMillions: 1700, // In USD
    imprintCount: 25,
    country: 'USA',
    email: 'customercare@scholastic.com',
    phone: '+1-800-724-6527',
    foundedYear: 1920,
    ordersCount: 650,
    spendMuch: 1200000,
    nmbBook: 18000
  },
  {
    id: 5,
    name: 'Macmillan Publishers',
    url: 'https://us.macmillan.com/',
    img: 'https://placehold.co/600x595/003471/ffffff?text=Macmillan',
    titlesPublishedAnnually: 2500,
    description: 'A global trade publishing company with a reputation for award-winning literary fiction, non-fiction, and academic works. Part of the Holtzbrinck Publishing Group.',
    annualRevenueMillions: 1400, // In USD
    imprintCount: 45,
    country: 'USA',
    email: 'customerservice@macmillan.com',
    phone: '+1-646-307-5151',
    foundedYear: 1843,
    ordersCount: 420,
    spendMuch: 980000,
    nmbBook: 12500
  }
];

// Computed properties for filtering and sorting
const filteredPublishingHouses = computed(() => {
  let filtered = publishingHouses.filter(house => {
    const matchesSearch = house.name.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesCountry = selectedCountry.value === '' || house.country === selectedCountry.value;
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
  return filteredPublishingHouses.value.reduce((sum, house) => sum + house.ordersCount, 0);
});

// Computed property for total books
const totalBooks = computed(() => {
  return filteredPublishingHouses.value.reduce((sum, house) => sum + house.nmbBook, 0);
});

// Computed property for unique countries
const countries = computed(() => {
  const uniqueCountries = [...new Set(publishingHouses.map(house => house.country))];
  return uniqueCountries.sort();
});

// Sort field options with proper labels
const sortFields = [
  { key: 'name', label: 'Name' },
  { key: 'ordersCount', label: 'Orders' },
  { key: 'spendMuch', label: 'Spent' },
  { key: 'nmbBook', label: 'Books' }
];

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

// Format currency helper
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Format number helper
const formatNumber = (number) => {
  return new Intl.NumberFormat('en-US').format(number);
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
          placeholder="Search for Publishing House"
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
          class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors whitespace-nowrap"
        >
          Clear Filters
        </button>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-3 w-full lg:w-auto">
        <button class="bg-gray-200 text-black px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors flex-1 lg:flex-none">
          Add Publisher
        </button>
        <button class="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors flex-1 lg:flex-none">
          Export
        </button>
      </div>
    </div>

    <!-- Sort Options -->
    <div class="flex flex-wrap gap-2 mb-4">
      <span class="text-sm font-medium text-gray-600 mr-2">Sort by:</span>
      <button
        v-for="field in sortFields"
        :key="field.key"
        @click="handleSort(field.key)"
        :class="[
          'px-3 py-1 text-xs rounded-full border transition-colors',
          sortBy === field.key
            ? 'bg-yellow-600 text-white border-yellow-600'
            : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
        ]"
      >
        {{ field.label }}
        {{ getSortIcon(field.key) }}
      </button>
    </div>

    <!-- Analytics Row -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
      <div class="flex items-center bg-yellow-50 px-4 py-3 rounded-lg">
        <div class="flex flex-col">
          <p class="text-sm font-medium text-gray-600">Total Publishers</p>
          <span class="text-2xl font-bold text-yellow-600">{{ filteredPublishingHouses.length }}</span>
        </div>
      </div>
      <div class="flex items-center bg-green-50 px-4 py-3 rounded-lg">
        <div class="flex flex-col">
          <p class="text-sm font-medium text-gray-600">Total Orders</p>
          <span class="text-2xl font-bold text-green-600">{{ formatNumber(totalOrders) }}</span>
        </div>
      </div>
      <div class="flex items-center bg-blue-50 px-4 py-3 rounded-lg">
        <div class="flex flex-col">
          <p class="text-sm font-medium text-gray-600">Total Books</p>
          <span class="text-2xl font-bold text-blue-600">{{ formatNumber(totalBooks) }}</span>
        </div>
      </div>
    </div>

    <!-- Table Section -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-6 mb-8">
      <!-- Mobile Card View -->
      <div class="lg:hidden">
        <div v-for="house in filteredPublishingHouses" :key="house.id" class="border-b border-gray-200 p-4 hover:bg-gray-50 transition-colors">
          <div class="flex justify-between items-start mb-3">
            <h3 class="font-semibold text-gray-900 text-lg">{{ house.name }}</h3>
            <span class="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">#{{ house.id }}</span>
          </div>
          <div class="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
            <div><span class="font-medium">Country:</span> {{ house.country }}</div>
            <div><span class="font-medium">Orders:</span> {{ formatNumber(house.ordersCount) }}</div>
            <div><span class="font-medium">Spent:</span> {{ formatCurrency(house.spendMuch) }}</div>
            <div><span class="font-medium">Books:</span> {{ formatNumber(house.nmbBook) }}</div>
          </div>
          <div class="text-sm text-gray-500 mb-3">
            <div><span class="font-medium">Email:</span> {{ house.email }}</div>
            <div><span class="font-medium">Phone:</span> {{ house.phone }}</div>
          </div>
          <div class="flex gap-2">
            <button class="text-yellow-600 hover:text-yellow-700 flex items-center gap-1 text-sm font-medium transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
              View Details
            </button>
            <a
              :href="house.url"
              target="_blank"
              rel="noopener noreferrer"
              class="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm font-medium transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
              </svg>
              Visit Website
            </a>
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
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
              >
                Name {{ getSortIcon('name') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th
                @click="handleSort('ordersCount')"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
              >
                Orders {{ getSortIcon('ordersCount') }}
              </th>
              <th
                @click="handleSort('spendMuch')"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
              >
                Total Spent {{ getSortIcon('spendMuch') }}
              </th>
              <th
                @click="handleSort('nmbBook')"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
              >
                Books {{ getSortIcon('nmbBook') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="house in filteredPublishingHouses" :key="house.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="font-medium text-gray-900">{{ house.name }}</div>
                <div class="text-sm text-gray-500">Founded {{ house.foundedYear }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-500">#{{ house.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-500">{{ formatNumber(house.ordersCount) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-500">{{ formatCurrency(house.spendMuch) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-500">{{ formatNumber(house.nmbBook) }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {{ house.country }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-2">
                  <button class="text-yellow-600 hover:text-yellow-900 transition-colors">
                    View
                  </button>
                  <a
                    :href="house.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-blue-600 hover:text-blue-900 transition-colors"
                  >
                    Website
                  </a>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="filteredPublishingHouses.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No Publishers Found</h3>
        <p class="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
        <button
          @click="clearFilters"
          class="mt-4 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
        >
          Clear Filters
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Add smooth transitions for better UX */
.transition-colors {
  transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
}

/* Ensure proper spacing for mobile cards */
@media (max-width: 1023px) {
  .grid-cols-2 > div {
    min-width: 0;
  }
}
</style>
