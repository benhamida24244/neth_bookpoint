<script setup>
import { useAuthorStore } from '@/stores/Authors';
import { ref, computed } from 'vue';
import AddAuthorModal from '@/components/Dashboard/Modals/AddAuthorModal.vue';

const addAuthorModal = ref(null);
const searchQuery = ref('');
const selectedCountry = ref('');
const sortBy = ref('name');
const sortOrder = ref('asc');
const AuthorsStore = useAuthorStore()
const authors = AuthorsStore.authors

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
    <AddAuthorModal ref="addAuthorModal" />
    <!-- Header Section -->
    <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
      <!-- Search and Filters -->
      <div class="flex flex-col sm:flex-row gap-4 w-full lg:w-2/3">
        <input
          v-model="searchQuery"
          placeholder="Search for Author"
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
          class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 whitespace-nowrap"
        >
          Clear Filters
        </button>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-3 w-full lg:w-auto">
        <button @click="addAuthorModal.openModal()" class="bg-gray-200 text-black px-4 py-2 rounded-lg hover:bg-gray-300 flex-1 lg:flex-none">
          Add Author
        </button>
        <button class="bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg hover:bg-[var(--color-primary)] flex-1 lg:flex-none">
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
            ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
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
        <span class="ml-2 text-[var(--color-primary)] font-bold text-lg">{{ filteredAuthors.length }}</span>
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
            <button class="text-[var(--color-primary)] hover:text-[var(--color-primary)] flex items-center gap-1 text-sm font-medium">
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
                Rewards {{ getSortIcon('SpendMuch') }}
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
                <button class="text-[var(--color-primary)] hover:text-[var(--color-primary)] flex items-center gap-1 text-sm font-medium">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                   <RouterLink :to="`/dashboard/authors/${author.id}`" class="text-[var(--color-primary)] hover:text-[var(--color-primary)] flex items-center gap-1 text-sm font-medium">
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
          class="mt-4 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary)]"
        >
          Clear Filters
        </button>
      </div>
    </div>
  </div>
</template>
