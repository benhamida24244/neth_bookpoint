<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// Client Status Configuration
const STATUS_CONFIG = {
  active: {
    label: 'Active',
    color: 'bg-green-100 text-green-800',
    icon: '✓'
  },
  inactive: {
    label: 'Inactive',
    color: 'bg-red-100 text-red-800',
    icon: '✗'
  },
  pending: {
    label: 'Pending',
    color: 'bg-yellow-100 text-[var(--color-hover)]',
    icon: '⏳'
  }
}

// Props and Emits
const props = defineProps({
  clientId: {
    type: [String, Number],
    required: false
  }
})

const emit = defineEmits(['clientUpdated', 'statusChanged'])

// Router
const route = useRoute()
const router = useRouter()

// State
const isLoading = ref(true)
const isUpdating = ref(false)
const error = ref(null)
const showSuccessMessage = ref(false)
const showEditModal = ref(false)

// Client Data (Enhanced with missing properties)
const clients = ref([
  {
    id: 1,
    name: 'Benhamida Mohammed',
    email: 'mohammed@example.com',
    phone: '0823234234',
    Registration_date: '12-12-2000',
    Orders_count: 12,
    SpendMuch: 1234,
    Country: 'Algeria',
    status: 'active',
    avatar: 'https://ui-avatars.com/api/?name=Benhamida+Mohammed&background=3b82f6&color=fff',
    address: '123 Main Street, Algiers',
    lastOrderDate: '2024-01-15',
    totalOrders: 12,
    averageOrderValue: 102.83,
    memberSince: '2020-12-12',
    notes: 'VIP customer with frequent large orders'
  },
  {
    id: 2,
    name: 'Ahmed Hassan',
    email: 'ahmed@example.com',
    phone: '0823234235',
    Registration_date: '15-03-2001',
    Orders_count: 8,
    SpendMuch: 890,
    Country: 'Morocco',
    status: 'active',
    avatar: 'https://ui-avatars.com/api/?name=Ahmed+Hassan&background=10b981&color=fff',
    address: '456 Ocean Road, Casablanca',
    lastOrderDate: '2024-01-10',
    totalOrders: 8,
    averageOrderValue: 111.25,
    memberSince: '2021-03-15',
    notes: 'Regular customer, prefers express shipping'
  },
  {
    id: 3,
    name: 'Fatima Al-Zahra',
    email: 'fatima@example.com',
    phone: '0823234236',
    Registration_date: '22-07-2002',
    Orders_count: 15,
    SpendMuch: 2100,
    Country: 'Tunisia',
    status: 'pending',
    avatar: 'https://ui-avatars.com/api/?name=Fatima+Al-Zahra&background=f59e0b&color=fff',
    address: '789 Desert Avenue, Tunis',
    lastOrderDate: '2024-01-20',
    totalOrders: 15,
    averageOrderValue: 140,
    memberSince: '2022-07-22',
    notes: 'New customer, pending verification'
  },
  {
    id: 4,
    name: 'Omar Ibrahim',
    email: 'omar@example.com',
    phone: '0823234237',
    Registration_date: '08-11-2003',
    Orders_count: 6,
    SpendMuch: 450,
    Country: 'Egypt',
    status: 'inactive',
    avatar: 'https://ui-avatars.com/api/?name=Omar+Ibrahim&background=ef4444&color=fff',
    address: '321 Nile Street, Cairo',
    lastOrderDate: '2023-12-01',
    totalOrders: 6,
    averageOrderValue: 75,
    memberSince: '2023-11-08',
    notes: 'Account inactive due to payment issues'
  },
  {
    id: 5,
    name: 'Aisha Rahman',
    email: 'aisha@example.com',
    phone: '0823234238',
    Registration_date: '03-09-2004',
    Orders_count: 20,
    SpendMuch: 3200,
    Country: 'Algeria',
    status: 'active',
    avatar: 'https://ui-avatars.com/api/?name=Aisha+Rahman&background=8b5cf6&color=fff',
    address: '654 Mountain View, Oran',
    lastOrderDate: '2024-01-25',
    totalOrders: 20,
    averageOrderValue: 160,
    memberSince: '2024-09-03',
    notes: 'Premium customer with excellent payment history'
  },
])

// Computed Properties
const selectedClient = computed(() => {
  const clientId = props.clientId || parseInt(route.params.id)
  return clients.value.find(client => client.id === clientId)
})

const statusConfig = computed(() => {
  if (!selectedClient.value) return null
  return STATUS_CONFIG[selectedClient.value.status] || STATUS_CONFIG.pending
})

const formattedRegistrationDate = computed(() => {
  if (!selectedClient.value?.Registration_date) return ''
  return new Date(selectedClient.value.Registration_date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

const formattedLastOrderDate = computed(() => {
  if (!selectedClient.value?.lastOrderDate) return ''
  return new Date(selectedClient.value.lastOrderDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

const clientStats = computed(() => {
  if (!selectedClient.value) return []
  return [
    {
      label: 'Total Orders',
      value: selectedClient.value.Orders_count,
      icon: '📦',
      color: 'text-blue-600'
    },
    {
      label: 'Total Spent',
      value: `$${selectedClient.value.SpendMuch.toLocaleString()}`,
      icon: '💰',
      color: 'text-green-600'
    },
    {
      label: 'Average Order',
      value: `$${selectedClient.value.averageOrderValue}`,
      icon: '📊',
      color: 'text-purple-600'
    },
    {
      label: 'Member Since',
      value: new Date(selectedClient.value.Registration_date).getFullYear(),
      icon: '📅',
      color: 'text-orange-600'
    }
  ]
})

// Methods
const goBack = () => router.go(-1)

const printClient = () => {
  window.print()
}

const downloadReport = () => {
  // Create a simple text report
  const client = selectedClient.value
  const report = `
Client Report
=============
Name: ${client.name}
Email: ${client.email}
Phone: ${client.phone}
Country: ${client.Country}
Status: ${statusConfig.value.label}
Registration Date: ${formattedRegistrationDate.value}
Total Orders: ${client.Orders_count}
Total Spent: $${client.SpendMuch}
Average Order Value: $${client.averageOrderValue}
Last Order: ${formattedLastOrderDate.value}
Notes: ${client.notes}
  `.trim()

  const blob = new Blob([report], { type: 'text/plain' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `client-${client.id}-report.txt`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  window.URL.revokeObjectURL(url)
}

const updateClientStatus = async (newStatus) => {
  try {
    isUpdating.value = true
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    const clientIndex = clients.value.findIndex(c => c.id === selectedClient.value.id)
    if (clientIndex !== -1) {
      clients.value[clientIndex].status = newStatus
      showSuccessMessage.value = true
      setTimeout(() => { showSuccessMessage.value = false }, 3000)
      emit('statusChanged', { clientId: selectedClient.value.id, status: newStatus })
    }
  } catch (err) {
    error.value = 'Failed to update client status'
  } finally {
    isUpdating.value = false
  }
}

const sendEmail = () => {
  const client = selectedClient.value
  const subject = encodeURIComponent(`Regarding your account - ${client.name}`)
  const body = encodeURIComponent(`Dear ${client.name},\n\nI hope this email finds you well.\n\nBest regards,\nCustomer Service Team`)
  window.open(`mailto:${client.email}?subject=${subject}&body=${body}`)
}

const callClient = () => {
  window.open(`tel:${selectedClient.value.phone}`)
}

// Lifecycle
onMounted(async () => {
  try {
    isLoading.value = true
    error.value = null
    // Simulate loading time
    await new Promise(resolve => setTimeout(resolve, 800))

    if (!selectedClient.value) {
      error.value = 'Client not found'
    }
  } catch (err) {
    error.value = 'Error loading client data'
    console.error('Error loading client:', err)
  } finally {
    isLoading.value = false
  }
})

watch(() => route.params.id, (newId) => {
  if (newId) onMounted()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <button
              @click="goBack"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <h1 class="text-3xl font-bold text-gray-900">Client Details</h1>
          </div>

          <!-- Success Message -->
          <div v-if="showSuccessMessage" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
            ✓ Client updated successfully
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center py-16">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span class="ml-3 text-gray-600">Loading client data...</span>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div class="text-red-600 text-lg font-medium mb-2">⚠️ Error</div>
        <p class="text-red-700">{{ error }}</p>
        <button @click="onMounted" class="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
          Try Again
        </button>
      </div>

      <!-- Client Details -->
      <div v-else-if="selectedClient" class="space-y-8">
        <!-- Client Header Card -->
        <div class="bg-white rounded-xl shadow-lg overflow-hidden">
          <div class="bg-gradient-to-r from-[var(--color-primary)] to-black px-6 py-8">
            <div class="flex items-center space-x-6">
              <img
                :src="selectedClient.avatar"
                :alt="selectedClient.name"
                class="w-20 h-20 rounded-full border-4 border-white shadow-lg"
              />
              <div class="flex-1">
                <h2 class="text-2xl font-bold text-white">{{ selectedClient.name }}</h2>
                <p class="text-blue-100 mt-1">{{ selectedClient.email }}</p>
                <p class="text-blue-100">{{ selectedClient.phone }}</p>
                <div class="flex items-center mt-3 space-x-4">
                  <span
                    :class="statusConfig.color"
                    class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {{ statusConfig.icon }} {{ statusConfig.label }}
                  </span>
                  <span class="text-blue-100">📍 {{ selectedClient.Country }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div class="flex flex-wrap gap-3">
              <button
                @click="sendEmail"
                class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Send Email
              </button>

              <button
                @click="callClient"
                class="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call Client
              </button>

              <button
                @click="printClient"
                class="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print
              </button>

              <button
                @click="downloadReport"
                class="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Report
              </button>
            </div>
          </div>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="stat in clientStats"
            :key="stat.label"
            class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">{{ stat.label }}</p>
                <p :class="stat.color" class="text-2xl font-bold mt-1">{{ stat.value }}</p>
              </div>
              <div class="text-3xl">{{ stat.icon }}</div>
            </div>
          </div>
        </div>

        <!-- Detailed Information -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Personal Information -->
          <div class="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Personal Information
            </h3>

            <div class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="text-sm font-medium text-gray-500">Full Name</label>
                  <p class="text-gray-900 font-medium">{{ selectedClient.name }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-500">Email Address</label>
                  <p class="text-gray-900 font-medium">{{ selectedClient.email }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-500">Phone Number</label>
                  <p class="text-gray-900 font-medium">{{ selectedClient.phone }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-500">Country</label>
                  <p class="text-gray-900 font-medium">{{ selectedClient.Country }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-500">Registration Date</label>
                  <p class="text-gray-900 font-medium">{{ formattedRegistrationDate }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-500">Last Order</label>
                  <p class="text-gray-900 font-medium">{{ formattedLastOrderDate }}</p>
                </div>
              </div>

              <div>
                <label class="text-sm font-medium text-gray-500">Address</label>
                <p class="text-gray-900 font-medium">{{ selectedClient.address }}</p>
              </div>

              <div>
                <label class="text-sm font-medium text-gray-500">Notes</label>
                <p class="text-gray-700">{{ selectedClient.notes }}</p>
              </div>
            </div>
          </div>

          <!-- Status Management -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <svg class="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Status Management
            </h3>

            <div class="space-y-4">
              <div>
                <label class="text-sm font-medium text-gray-500 mb-2 block">Current Status</label>
                <span
                  :class="statusConfig.color"
                  class="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium"
                >
                  {{ statusConfig.icon }} {{ statusConfig.label }}
                </span>
              </div>

              <div>
                <label class="text-sm font-medium text-gray-500 mb-2 block">Change Status</label>
                <div class="space-y-2">
                  <button
                    v-for="(config, status) in STATUS_CONFIG"
                    :key="status"
                    @click="updateClientStatus(status)"
                    :disabled="selectedClient.status === status || isUpdating"
                    :class="[
                      'w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      selectedClient.status === status
                        ? config.color + ' cursor-not-allowed opacity-50'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    ]"
                  >
                    <span v-if="isUpdating && selectedClient.status !== status" class="animate-spin inline-block w-4 h-4 mr-2">⚙️</span>
                    {{ config.icon }} {{ config.label }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@media print {
  .no-print {
    display: none !important;
  }
}
</style>
