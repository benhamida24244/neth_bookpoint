<script setup>
import { ref, computed } from 'vue';

const searchQuery = ref('');
const selectedStatus = ref('');
const selectedSource = ref('');
const selectedSaleDate = ref('');
const showStatusDropdown = ref(false);
const showSourceDropdown = ref(false);
const showSaleDateDropdown = ref(false);

const Clients = [
  {
    id: 1,
    name: 'Benhamida Mohammed',
    email: 'mohammed@example.com',
    phone: '0823234234',
    Registration_date: '12-12-2000',
    Orders_count: 12,
    SpendMuch: 1234,
    Country: 'Algeria'
  },
  {
    id: 2,
    name: 'Ahmed Hassan',
    email: 'ahmed@example.com',
    phone: '0823234235',
    Registration_date: '15-03-2001',
    Orders_count: 8,
    SpendMuch: 890,
    Country: 'Morocco'
  },
  {
    id: 3,
    name: 'Fatima Al-Zahra',
    email: 'fatima@example.com',
    phone: '0823234236',
    Registration_date: '22-07-2002',
    Orders_count: 15,
    SpendMuch: 2100,
    Country: 'Tunisia'
  },
  {
    id: 4,
    name: 'Omar Ibrahim',
    email: 'omar@example.com',
    phone: '0823234237',
    Registration_date: '08-11-2003',
    Orders_count: 6,
    SpendMuch: 450,
    Country: 'Egypt'
  },
  {
    id: 5,
    name: 'Aisha Rahman',
    email: 'aisha@example.com',
    phone: '0823234238',
    Registration_date: '03-09-2004',
    Orders_count: 20,
    SpendMuch: 3200,
    Country: 'Algeria'
  },
];

// Computed property for filtered clients
const filteredClients = computed(() => {
  return Clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         client.phone.includes(searchQuery.value) ||
                         client.Country.toLowerCase().includes(searchQuery.value.toLowerCase());
    return matchesSearch;
  });
});

// Computed analytics
const totalOrders = computed(() => {
  return filteredClients.value.reduce((sum, client) => sum + client.Orders_count, 0);
});

const statusOptions = ['Active', 'Inactive', 'Pending'];
const sourceOptions = ['Website', 'Social Media', 'Referral', 'Advertisement'];
const saleDateOptions = ['Last 7 days', 'Last 30 days', 'Last 90 days', 'All time'];

const toggleDropdown = (dropdown) => {
  if (dropdown === 'status') {
    showStatusDropdown.value = !showStatusDropdown.value;
    showSourceDropdown.value = false;
    showSaleDateDropdown.value = false;
  } else if (dropdown === 'source') {
    showSourceDropdown.value = !showSourceDropdown.value;
    showStatusDropdown.value = false;
    showSaleDateDropdown.value = false;
  } else if (dropdown === 'saleDate') {
    showSaleDateDropdown.value = !showSaleDateDropdown.value;
    showStatusDropdown.value = false;
    showSourceDropdown.value = false;
  }
};
</script>

<template>
  <div class="w-full px-4 sm:px-8 lg:px-16 mt-8">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <input
        v-model="searchQuery"
        placeholder="Search for Clients"
        type="text"
        class="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg w-full sm:w-1/2 lg:w-1/3 focus:outline-none focus:ring-2 focus:ring-yellow-600"
      />
      <div class="flex gap-3 w-full sm:w-auto">
        <button class="bg-gray-200 text-black px-4 py-2 rounded-lg hover:bg-gray-300 flex-1 sm:flex-none">
          Add Client
        </button>
        <button class="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 flex-1 sm:flex-none">
          Export
        </button>
      </div>
    </div>

    <!-- Filter and Analytics Section -->
    <div class="mt-8">
      <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
        <p class="text-xl font-bold text-gray-600 mb-2 lg:mb-0">Filter</p>
        <p class="text-xl font-bold text-gray-600">Analytics</p>
      </div>

      <!-- Filter Inputs Row -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <!-- Registration Date -->
        <div class="relative">
          <div class="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
            <svg class="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
              <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"/>
            </svg>
          </div>
          <input
            type="date"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 block w-full pl-10 p-2.5"
            placeholder="Registration Date"
          />
        </div>

        <!-- Last Order Date -->
        <div class="relative">
          <div class="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
            <svg class="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
              <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"/>
            </svg>
          </div>
          <input
            type="date"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 block w-full pl-10 p-2.5"
            placeholder="Last Order Date"
          />
        </div>

        <!-- Total Spend -->
        <div class="relative">
          <div class="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
            <svg class="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
              <path d="M11.5 3.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0zm-5 4a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1h-4z"/>
            </svg>
          </div>
          <input
            type="number"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 block w-full pl-10 p-2.5"
            placeholder="Min Total Spend"
          />
        </div>

        <!-- Shipping Method -->
        <div class="relative">
          <div class="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
            <svg class="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8.5 1.5A1.5 1.5 0 0 0 7 3v.5H4.5a2 2 0 0 0-2 2V9a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V5.5a2 2 0 0 0-2-2H13V3a1.5 1.5 0 0 0-1.5-1.5h-3z"/>
            </svg>
          </div>
          <select class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 block w-full pl-10 p-2.5">
            <option value="">Shipping Method</option>
            <option value="standard">Standard</option>
            <option value="express">Express</option>
            <option value="overnight">Overnight</option>
          </select>
        </div>
      </div>

      <!-- Dropdown Filters Row -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <!-- Status Dropdown -->
        <div class="relative">
          <p class="text-sm font-bold text-gray-600 mb-2">Status</p>
          <button
            @click="toggleDropdown('status')"
            class="text-white bg-yellow-700 hover:bg-yellow-800 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center justify-between w-full"
            type="button"
          >
            {{ selectedStatus || 'Select Status' }}
            <svg class="w-2.5 h-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
            </svg>
          </button>
          <div v-if="showStatusDropdown" class="absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-full mt-1">
            <ul class="py-2 text-sm text-gray-700">
              <li v-for="option in statusOptions" :key="option">
                <button
                  @click="selectedStatus = option; showStatusDropdown = false"
                  class="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  {{ option }}
                </button>
              </li>
            </ul>
          </div>
        </div>

        <!-- Source Dropdown -->
        <div class="relative">
          <p class="text-sm font-bold text-gray-600 mb-2">Source</p>
          <button
            @click="toggleDropdown('source')"
            class="text-white bg-yellow-700 hover:bg-yellow-800 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center justify-between w-full"
            type="button"
          >
            {{ selectedSource || 'Select Source' }}
            <svg class="w-2.5 h-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
            </svg>
          </button>
          <div v-if="showSourceDropdown" class="absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-full mt-1">
            <ul class="py-2 text-sm text-gray-700">
              <li v-for="option in sourceOptions" :key="option">
                <button
                  @click="selectedSource = option; showSourceDropdown = false"
                  class="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  {{ option }}
                </button>
              </li>
            </ul>
          </div>
        </div>

        <!-- Sale Date Dropdown -->
        <div class="relative">
          <p class="text-sm font-bold text-gray-600 mb-2">Sale Date</p>
          <button
            @click="toggleDropdown('saleDate')"
            class="text-white bg-yellow-700 hover:bg-yellow-800 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center justify-between w-full"
            type="button"
          >
            {{ selectedSaleDate || 'Select Period' }}
            <svg class="w-2.5 h-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
            </svg>
          </button>
          <div v-if="showSaleDateDropdown" class="absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-full mt-1">
            <ul class="py-2 text-sm text-gray-700">
              <li v-for="option in saleDateOptions" :key="option">
                <button
                  @click="selectedSaleDate = option; showSaleDateDropdown = false"
                  class="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  {{ option }}
                </button>
              </li>
            </ul>
          </div>
        </div>

        <!-- Clear Filters Button -->
        <div class="flex items-end">
          <button
            @click="selectedStatus = ''; selectedSource = ''; selectedSaleDate = ''"
            class="text-white bg-yellow-600 hover:bg-yellow-700 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-4 py-2.5 w-full"
          >
            Clear Filters
          </button>
        </div>
      </div>

      <!-- Analytics Row -->
      <div class="flex flex-col sm:flex-row justify-between mt-6 gap-4">
        <div class="flex items-center bg-yellow-50 px-4 py-2 rounded-lg">
          <p class="text-lg font-bold text-gray-600">Total Clients:</p>
          <span class="ml-2 text-yellow-600 font-bold text-lg">{{ filteredClients.length }}</span>
        </div>
        <div class="flex items-center bg-green-50 px-4 py-2 rounded-lg">
          <p class="text-lg font-bold text-gray-600">Total Orders:</p>
          <span class="ml-2 text-green-600 font-bold text-lg">{{ totalOrders }}</span>
        </div>
      </div>

      <!-- Table Section -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-6 mb-8">
        <!-- Mobile Card View -->
        <div class="lg:hidden">
          <div v-for="client in filteredClients" :key="client.id" class="border-b border-gray-200 p-4">
            <div class="flex justify-between items-start mb-2">
              <h3 class="font-semibold text-gray-900">{{ client.name }}</h3>
              <span class="text-sm text-gray-500">#{{ client.id }}</span>
            </div>
            <div class="space-y-1 text-sm text-gray-600">
              <p><span class="font-medium">Email:</span> {{ client.email }}</p>
              <p><span class="font-medium">Phone:</span> {{ client.phone }}</p>
              <p><span class="font-medium">Country:</span> {{ client.Country }}</p>
              <p><span class="font-medium">Registration:</span> {{ client.Registration_date }}</p>
              <p><span class="font-medium">Orders:</span> {{ client.Orders_count }}</p>
              <p><span class="font-medium">Spent:</span> ${{ client.SpendMuch }}</p>
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
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration Date</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Spent</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="client in filteredClients" :key="client.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{{ client.name }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-500">#{{ client.id }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-500">{{ client.email }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-500">{{ client.phone }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-500">{{ client.Registration_date }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-500">{{ client.Orders_count }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-500">${{ client.SpendMuch }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-500">{{ client.Country }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <button class="text-yellow-600 hover:text-yellow-700 flex items-center gap-1 text-sm font-medium">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                    View
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-if="filteredClients.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewbox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No clients found</h3>
          <p class="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
        </div>
      </div>
    </div>
  </div>
</template>
