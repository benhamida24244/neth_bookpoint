<script setup>
import { useClientsStore } from '@/stores/Clients'
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import LoaderWithText from '@/components/LoaderWithText.vue'

const { t, locale } = useI18n()
const router = useRouter()
const searchQuery = ref('')
const ClientStore = useClientsStore()

onMounted(() => {
  ClientStore.fetchClients()
})

const clients = computed(() => ClientStore.clients)
const isLoading = computed(() => ClientStore.loading)

const filteredClients = computed(() => {
  if (!clients.value) return []
  return clients.value.filter((client) => {
    const search = searchQuery.value.toLowerCase()
    return (
      client.name.toLowerCase().includes(search) ||
      client.email.toLowerCase().includes(search) ||
      (client.phone && client.phone.includes(search)) ||
      client.Country.toLowerCase().includes(search)
    )
  })
})

const totalOrders = computed(() => {
  if (!filteredClients.value) return 0
  return filteredClients.value.reduce((sum, client) => sum + (client.total_orders || 0), 0)
})

const totalSpent = computed(() => {
    if (!filteredClients.value) return 0;
    return filteredClients.value.reduce((sum, client) => sum + (parseFloat(client.total_spent) || 0), 0);
});

const currentLocale = locale.value || "en"

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  // Use the current locale value for formatting
  return date.toLocaleDateString(currentLocale, { year: 'numeric', month: 'long', day: 'numeric' })
}

const viewDetails = (clientId) => {
  router.push(`/dashboard/clients/${clientId}`)
}

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

</script>

<template>
  <div class="p-4 md:p-8 min-h-screen bg-gray-50">
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <LoaderWithText :message="t('loading.clients')" />
    </div>

    <div v-else>
      <!-- Header -->
      <div class="mb-8 font-BonaRegular ltr:text-left rtl:text-right">
        <h1 class="text-2xl md:text-3xl font-bold text-gray-800">{{ t('dashboard.clients.title') }}</h1>
        <p class="text-gray-600 mt-1">{{ t('dashboard.clients.subtitle') }}</p>
      </div>

      <!-- Search and Actions -->
      <div class="mb-6 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
          <div class="relative">
            <i class="fas fa-search absolute top-1/2 -translate-y-1/2 text-gray-400 ltr:left-3 rtl:right-3"></i>
            <input v-model="searchQuery" :placeholder="t('dashboard.clients.searchPlaceholder')" type="text" class="w-full ltr:pl-10 rtl:pr-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-light)]"/>
          </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div class="p-4 bg-white rounded-xl shadow-sm border flex items-center gap-4"><i class="fas fa-users text-xl text-blue-500"></i><div class="ltr:text-left rtl:text-right"><p class="text-sm text-gray-500">{{ t('dashboard.clients_dash.stats.total') }}</p><p class="text-lg font-bold text-gray-800">{{ filteredClients.length }}</p></div></div>
        <div class="p-4 bg-white rounded-xl shadow-sm border flex items-center gap-4"><i class="fas fa-shopping-cart text-xl text-green-500"></i><div class="ltr:text-left rtl:text-right"><p class="text-sm text-gray-500">{{ t('dashboard.clients_dash.stats.orders') }}</p><p class="text-lg font-bold text-gray-800">{{ totalOrders }}</p></div></div>
        <div class="p-4 bg-white rounded-xl shadow-sm border flex items-center gap-4"><i class="fas fa-dollar-sign text-xl text-purple-500"></i><div class="ltr:text-left rtl:text-right"><p class="text-sm text-gray-500">{{ t('dashboard.clients_dash.table.totalSpent') }}</p><p class="text-lg font-bold text-gray-800">${{ totalSpent.toFixed(2) }}</p></div></div>
      </div>

      <!-- Desktop Table -->
      <div class="hidden lg:block bg-white rounded-xl shadow-sm border overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr class="ltr:text-left rtl:text-right">
              <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{{ t('dashboard.clients_dash.table.name') }}</th>
              <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{{ t('dashboard.clients_dash.table.registrationDate') }}</th>
              <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{{ t('dashboard.clients_dash.table.orders') }}</th>
              <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{{ t('dashboard.clients_dash.table.totalSpent') }}</th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">{{ t('dashboard.clients_dash.table.action') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="client in filteredClients" :key="client.id" class="hover:bg-gray-50 ltr:text-left rtl:text-right">
              <td class="px-6 py-4 whitespace-nowrap"><div class="flex items-center gap-3"><img class="h-10 w-10 rounded-full object-cover" :src="client.img ? `${apiBaseUrl}${client.img}` : '/images/default-user.webp'" :alt="client.name"/><div class="font-medium text-gray-900"><div>{{ client.name }}</div><div class="text-sm text-gray-500">{{ client.email }}</div></div></div></td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(client.registration_date) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ client.total_orders }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${{ parseFloat(client.total_spent).toFixed(2) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium"><button @click="viewDetails(client.id)" class="text-gray-500 hover:text-[var(--color-primary)] p-2 rounded-full hover:bg-gray-100"><i class="far fa-eye"></i></button></td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile/Tablet Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:hidden">
        <div v-for="client in filteredClients" :key="client.id" class="bg-white rounded-xl shadow-sm border overflow-hidden ltr:text-left rtl:text-right">
          <div class="p-4 flex items-center gap-4">
            <img class="h-16 w-16 rounded-full object-cover shadow-md" :src="client.img ? `${apiBaseUrl}${client.img}` : '/images/default-user.png'" :alt="client.name"/>
            <div>
              <h3 class="font-bold text-lg text-gray-800">{{ client.name }}</h3>
              <p class="text-sm text-gray-500 truncate">{{ client.email }}</p>
              <p class="text-sm text-gray-500">{{ client.Country }}</p>
            </div>
          </div>
          <div class="px-4 pb-4 space-y-2 text-sm">
            <div class="flex justify-between items-center border-t pt-2"><span class="text-gray-500">{{ t('dashboard.clients_dash.table.orders') }}</span><span class="font-semibold text-gray-700">{{ client.total_orders }}</span></div>
            <div class="flex justify-between items-center"><span class="text-gray-500">{{ t('dashboard.clients_dash.table.totalSpent') }}</span><span class="font-semibold text-gray-700">${{ parseFloat(client.total_spent).toFixed(2) }}</span></div>
          </div>
          <div class="bg-gray-50 p-3 flex justify-end">
            <button @click="viewDetails(client.id)" class="w-full text-center block bg-[var(--color-primary)] text-white py-2 rounded-lg hover:bg-[var(--color-hover)] transition-colors text-sm font-medium">
                {{ t('dashboard.clients.viewDetails') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!isLoading && filteredClients.length === 0" class="text-center py-12 bg-white rounded-xl shadow-sm border mt-6">
        <i class="fas fa-user-slash text-gray-400 text-4xl mx-auto"></i>
        <h3 class="mt-4 text-lg font-medium text-gray-900">{{ t('dashboard.clients_dash.emptyHeader') }}</h3>
        <p class="mt-1 text-sm text-gray-500">{{ t('dashboard.clients_dash.emptySubtext') }}</p>
      </div>
    </div>
  </div>
</template>
