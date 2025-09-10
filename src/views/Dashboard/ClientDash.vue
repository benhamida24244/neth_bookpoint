<script setup>
import { useClientsStore } from '@/stores/Clients'
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const searchQuery = ref('')
const selectedStatus = ref('')
const selectedSource = ref('')
const selectedSaleDate = ref('')
const showStatusDropdown = ref(false)
const showSourceDropdown = ref(false)
const showSaleDateDropdown = ref(false)
const ClientStore = useClientsStore()

onMounted(() => {
  ClientStore.fetchClients()
})

const Clients = computed(() => ClientStore.clients)

// Computed property for filtered clients
const filteredClients = computed(() => {
  return Clients.value.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      client.phone.includes(searchQuery.value) ||
      client.Country.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchesSearch
  })
})

// Computed analytics
const totalOrders = computed(() => {
  return filteredClients.value.reduce((sum, client) => sum + client.total_orders, 0)
})

const statusOptions = ['Active', 'inActive']
const sourceOptions = ['Website', 'Social Media', 'Referral', 'Advertisement']
const saleDateOptions = ['Last 7 days', 'Last 30 days', 'Last 90 days', 'All time']

const toggleDropdown = (dropdown) => {
  if (dropdown === 'status') {
    showStatusDropdown.value = !showStatusDropdown.value
    showSourceDropdown.value = false
    showSaleDateDropdown.value = false
  } else if (dropdown === 'source') {
    showSourceDropdown.value = !showSourceDropdown.value
    showStatusDropdown.value = false
    showSaleDateDropdown.value = false
  } else if (dropdown === 'saleDate') {
    showSaleDateDropdown.value = !showSaleDateDropdown.value
    showStatusDropdown.value = false
    showSourceDropdown.value = false
  }
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<template>
  <div class="w-full px-4 sm:px-8 lg:px-16 mt-8">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <input
        v-model="searchQuery"
        :placeholder="t('dashboard.clients.searchPlaceholder')"
        type="text"
        class="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg w-full sm:w-1/2 lg:w-1/3 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
      />
      <div class="flex gap-3 w-full sm:w-auto">
        <button
          class="bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg hover:bg-[var(--color-primary)] flex-1 sm:flex-none"
        >
          {{ t('dashboard.clients.export') }}
        </button>
      </div>
    </div>

    <!-- Filter and Analytics Section -->
    <div class="mt-8">
      <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
        <p class="text-xl font-bold text-gray-600 mb-2 lg:mb-0">
          {{ t('dashboard.clients.filter') }}
        </p>
        <p class="text-xl font-bold text-gray-600">{{ t('dashboard.clients.analytics') }}</p>
      </div>

      <!-- Filter Inputs Row -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        <!-- Registration Date -->
        <div class="relative">
          <div class="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
            <svg
              class="w-4 h-4 text-gray-500"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"
              />
            </svg>
          </div>
          <input
            type="date"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[var(--color-light)] focus:border-[var(--color-light)] block w-full pl-10 p-2.5"
            :placeholder="t('dashboard.clients.registrationDatePlaceholder')"
          />
        </div>

        <!-- Last Order Date -->
        <div class="relative">
          <div class="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
            <svg
              class="w-4 h-4 text-gray-500"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"
              />
            </svg>
          </div>
          <input
            type="date"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[var(--color-light)] focus:border-[var(--color-light)] block w-full pl-10 p-2.5"
            :placeholder="t('dashboard.clients.lastOrderDatePlaceholder')"
          />
        </div>

        <!-- Total Spend -->
        <div class="relative">
          <div class="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
            <svg
              class="w-4 h-4 text-gray-500"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                d="M11.5 3.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0zm-5 4a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1h-4z"
              />
            </svg>
          </div>
          <input
            type="number"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[var(--color-light)] focus:border-[var(--color-light)] block w-full pl-10 p-2.5"
            :placeholder="t('dashboard.clients.minTotalSpendPlaceholder')"
          />
        </div>
      </div>

      <!-- Dropdown Filters Row -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <!-- Status Dropdown -->
        <div class="relative">
          <p class="text-sm font-bold text-gray-600 mb-2">{{ t('dashboard.clients.status') }}</p>
          <button
            @click="toggleDropdown('status')"
            class="text-white bg-[var(--color-primary)] hover:bg-[var(--color-hover)] focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center justify-between w-full"
            type="button"
          >
            {{ selectedStatus || t('dashboard.clients.selectStatus') }}
            <svg
              class="w-2.5 h-2.5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m1 1 4 4 4-4"
              />
            </svg>
          </button>
          <div
            v-if="showStatusDropdown"
            class="absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-full mt-1"
          >
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
          <p class="text-sm font-bold text-gray-600 mb-2">{{ t('dashboard.clients.source') }}</p>
          <button
            @click="toggleDropdown('source')"
            class="text-white bg-[var(--color-primary)] hover:bg-[var(--color-hover)] focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center justify-between w-full"
            type="button"
          >
            {{ selectedSource || t('dashboard.clients.selectSource') }}
            <svg
              class="w-2.5 h-2.5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m1 1 4 4 4-4"
              />
            </svg>
          </button>
          <div
            v-if="showSourceDropdown"
            class="absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-full mt-1"
          >
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
          <p class="text-sm font-bold text-gray-600 mb-2">{{ t('dashboard.clients.saleDate') }}</p>
          <button
            @click="toggleDropdown('saleDate')"
            class="text-white bg-[var(--color-primary)] hover:bg-[var(--color-hover)] focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center justify-between w-full"
            type="button"
          >
            {{ selectedSaleDate || t('dashboard.clients.selectPeriod') }}
            <svg
              class="w-2.5 h-2.5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m1 1 4 4 4-4"
              />
            </svg>
          </button>
          <div
            v-if="showSaleDateDropdown"
            class="absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-full mt-1"
          >
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
            class="text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary)] focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-4 py-2.5 w-full"
          >
            {{ t('dashboard.clients.clearFilters') }}
          </button>
        </div>
      </div>

      <!-- Analytics Row -->
      <div class="flex flex-col sm:flex-row justify-between mt-6 gap-4">
        <div class="flex items-center bg-yellow-50 px-4 py-2 rounded-lg">
          <p class="text-lg font-bold text-gray-600">{{ t('dashboard.clients_dash.stats.total') }}</p>
          <span class="ml-2 text-[var(--color-primary)] font-bold text-lg">{{
            filteredClients.length
          }}</span>
        </div>
        <div class="flex items-center bg-green-50 px-4 py-2 rounded-lg">
          <p class="text-lg font-bold text-gray-600">{{ t('dashboard.clients_dash.stats.orders') }}</p>
          <span class="ml-2 text-green-600 font-bold text-lg">{{ totalOrders }}</span>
        </div>
      </div>

      <!-- Table Section -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-6 mb-8">
        <!-- Mobile Card View -->
        <div class="lg:hidden">
          <div
            v-for="client in filteredClients"
            :key="client.id"
            class="border-b border-gray-200 p-4"
          >
            <div class="flex justify-between items-start mb-2">
              <h3 class="font-semibold text-gray-900">{{ client.name }}</h3>
              <span class="text-sm text-gray-500">#{{ client.id }}</span>
            </div>
            <div class="space-y-1 text-sm text-gray-600">
              <p>
                <span class="font-medium">{{ t('dashboard.clients_dash.table.email') }}:</span>
                {{ client.email }}
              </p>
              <p>
                <span class="font-medium">{{ t('dashboard.clients_dash.table.phone') }}:</span>
                {{ client.phone }}
              </p>
              <p>
                <span class="font-medium">{{ t('dashboard.clients_dash.table.country') }}:</span>
                {{ client.country }}
              </p>
              <p>
                <span class="font-medium"
                  >{{ t('dashboard.clients_dash.table.registrationDate') }}:</span
                >
                {{ client.Registration_date }}
              </p>
              <p>
                <span class="font-medium">{{ t('dashboard.clients_dash.table.orders') }}:</span>
                {{ client.total_orders }}
              </p>
              <p>
                <span class="font-medium">{{ t('dashboard.clients_dash.table.totalSpent') }}:</span> ${{
                  client.total_spent
                }}
              </p>
            </div>
            <div class="mt-3">
              <button
                class="text-[var(--color-primary)] hover:text-[var(--color-primary)] flex items-center gap-1 text-sm font-medium"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  ></path>
                </svg>
                {{ t('dashboard.clients.viewDetails') }}
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
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {{ t('dashboard.clients_dash.table.name') }}
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {{ t('dashboard.clients_dash.table.id') }}
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {{ t('dashboard.clients_dash.table.email') }}
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {{ t('dashboard.clients_dash.table.phone') }}
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {{ t('dashboard.clients_dash.table.registrationDate') }}
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {{ t('dashboard.clients_dash.table.orders') }}
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {{ t('dashboard.clients_dash.table.totalSpent') }}
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {{ t('dashboard.clients_dash.table.country') }}
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {{ t('dashboard.clients_dash.table.action') }}
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="client in filteredClients" :key="client.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                  {{ client.name }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-500">#{{ client.id }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-500">{{ client.email }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-500">{{ client.phone }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-500">
                  {{ formatDate(client.registration_date) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-500">
                  {{ client.total_orders }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-500">
                  ${{ client.total_spent }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-500">{{ client.country }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <button
                    class="text-[var(--color-primary)] hover:text-[var(--color-primary)] flex items-center gap-1 text-sm font-medium"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      ></path>
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      ></path>
                    </svg>
                    <RouterLink
                      :to="`/dashboard/clients/${client.id}`"
                      class="text-[var(--color-primary)] hover:text-[var(--color-primary)] flex items-center gap-1 text-sm font-medium"
                    >
                      {{ t('dashboard.clients.viewDetails') }}
                    </RouterLink>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-if="filteredClients.length === 0" class="text-center py-12">
          <svg
            class="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewbox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">
            {{ t('dashboard.clients_dash.emptyHeader') }}
          </h3>
          <p class="mt-1 text-sm text-gray-500">
            {{ t('dashboard.clients_dash.emptySubtext') }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
