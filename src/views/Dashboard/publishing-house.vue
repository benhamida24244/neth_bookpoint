<script setup>
import { usePublishingHouseStore } from '@/stores/PublishingHouses';
import { ref, computed } from 'vue';
import { useSettingsStore } from '@/stores/settings';

const searchQuery = ref('');
const selectedCountry = ref('');
const sortBy = ref('name');
const sortOrder = ref('asc');
const publishingHousesStore = usePublishingHouseStore()
const publishingHouses = publishingHousesStore.publishingHouses

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

const settingStore = useSettingsStore()
// A map to convert currency symbols from settings to ISO 4217 codes.
const currencyCodeMap = {
  '$': 'USD',
  '€': 'EUR',
  'DA': 'DZD'
};

// Format currency helper
const formatCurrency = (amount) => {
  // Get the ISO code from the map, defaulting to USD if not found.
  const currencyCode = currencyCodeMap[settingStore.currency] || 'USD';

  return new Intl.NumberFormat(settingStore.language, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Format number helper
const formatNumber = (number) => {
  return new Intl.NumberFormat(settingStore.language).format(number);
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
          class="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
        />
        <select
          v-model="selectedCountry"
          class="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
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
        <button class="bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg hover:bg-[var(--color-primary)] transition-colors flex-1 lg:flex-none">
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
            ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
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
          <span class="text-2xl font-bold text-[var(--color-primary)]">{{ filteredPublishingHouses.length }}</span>
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
            <button class="text-[var(--color-primary)] hover:text-[var(--color-primary)] flex items-center gap-1 text-sm font-medium transition-colors">
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
                Rewards {{ getSortIcon('spendMuch') }}
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
                  <RouterLink :to="`/dashboard/publishing-house/${house.id}`" class="text-[var(--color-primary)] hover:text-[var(--color-primary)] flex items-center gap-1 text-sm font-medium">
                    View
                  </RouterLink>
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
          class="mt-4 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary)] transition-colors"
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
