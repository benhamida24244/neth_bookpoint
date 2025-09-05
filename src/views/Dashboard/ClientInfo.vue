<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLanguageStore } from '@/stores/language'
import { useClientsStore } from '@/stores/Clients'

const CreateAvatar = (name) => {
  if (!name) return ''
  const getInitials = (name) => {
    let initials = name.match(/\b\w/g) || []
    return ((initials.shift() || '') + (initials.pop() || '')).toUpperCase()
  }

  const stringToColor = (str) => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }
    let color = '#'
    for (let i = 0; i < 3; i++) {
      let value = (hash >> (i * 8)) & 0xff
      color += ('00' + value.toString(16)).substr(-2)
    }
    return color
  }

  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  canvas.width = 200
  canvas.height = 200

  // Background
  context.fillStyle = stringToColor(name)
  context.fillRect(0, 0, canvas.width, canvas.height)

  // Text
  context.font = 'bold 100px Arial'
  context.fillStyle = '#fff'
  context.textAlign = 'center'
  context.textBaseline = 'middle'
  context.fillText(getInitials(name), canvas.width / 2, canvas.height / 2)

  return canvas.toDataURL('image/png')
}

const languageStore = useLanguageStore()
const clientStore = useClientsStore()
const translations = computed(() => languageStore.translations)

// Client Status Configuration
const STATUS_CONFIG = computed(() => ({
  active: {
    label: translations.value.dashboard?.clientInfo?.status?.active,
    color: 'bg-green-100 text-green-800',
    icon: '✓'
  },
  inactive: {
    label: translations.value.dashboard?.clientInfo?.status?.inactive,
    color: 'bg-red-100 text-red-800',
    icon: '✗'
  },
  pending: {
    label: translations.value.dashboard?.clientInfo?.status?.pending,
    color: 'bg-yellow-100 text-[var(--color-hover)]',
    icon: '⏳'
  }
}))

// Router
const route = useRoute()
const router = useRouter()

// State
const isLoading = ref(true)
const isUpdating = ref(false)
const error = ref(null)
const showSuccessMessage = ref(false)

const selectedClient = ref(null)

// Fetch client data when component mounts or route changes
const loadClient = async () => {
  isLoading.value = true
  error.value = null
  const clientId = route.params.id

  if (!clientId) {
    error.value = "Client ID is missing"
    isLoading.value = false
    return
  }

  try {
    selectedClient.value = await clientStore.fetchClientById(clientId)
  } catch (err) {
    console.error("Error loading client:", err)
    error.value = "Failed to load client data"
  } finally {
    isLoading.value = false
  }
}

const statusConfig = computed(() => {
  if (!selectedClient.value) return null
  return (
    STATUS_CONFIG.value[selectedClient.value.status] || STATUS_CONFIG.value.pending
  )
})

const formattedRegistrationDate = computed(() => {
  if (!selectedClient.value?.registration_date) return ''
  return new Date(selectedClient.value.registration_date).toLocaleDateString(languageStore.language, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

const formattedLastOrderDate = computed(() => {
  if (!selectedClient.value?.last_orders) return ''
  return new Date(selectedClient.value.last_orders[0].created_at).toLocaleDateString(languageStore.language, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

const clientStats = computed(() => {
  if (!selectedClient.value) return []
  return [
    {
      label: translations.value.dashboard?.clientInfo?.totalOrders,
      value: selectedClient.value.total_orders,
      icon: '📦',
      color: 'text-blue-600'
    },
    {
      label: translations.value.dashboard?.clientInfo?.totalSpent,
      value: `$${selectedClient.value.total_spent}`,
      icon: '💰',
      color: 'text-green-600'
    },
    {
      label: translations.value.dashboard?.clientInfo?.averageOrder,
      value: `$${selectedClient.value.average_order}`,
      icon: '📊',
      color: 'text-purple-600'
    },
    {
      label: translations.value.dashboard?.clientInfo?.memberSince,
      value: new Date(selectedClient.value.registration_date).getFullYear(),
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
Country: ${client.country}
Status: ${statusConfig.value.label}
Registration Date: ${formattedRegistrationDate.value}
Total Orders: ${client.orders_count}
Total Spent: $${client.total_spent}
Average Order Value: $${client.average_order_value}
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
    await clientStore.updateClientStatus(selectedClient.value.id, newStatus)
    selectedClient.value.status = newStatus
    showSuccessMessage.value = true
    setTimeout(() => {
      showSuccessMessage.value = false
    }, 3000)
  } catch (err) {
    error.value = 'Failed to update client status'
  } finally {
    isUpdating.value = false
  }
}

const sendEmail = () => {
  const client = selectedClient.value
  const subject = encodeURIComponent(`Regarding your account - ${client.name}`)
  const body = encodeURIComponent(
    `Dear ${client.name},\n\nI hope this email finds you well.\n\nBest regards,\nCustomer Service Team`
  )
  window.open(`mailto:${client.email}?subject=${subject}&body=${body}`)
}

const callClient = () => {
  window.open(`tel:${selectedClient.value.phone}`)
}

// Lifecycle
onMounted(() => {
  loadClient()
})

watch(
  () => route.params.id,
  (newId, oldId) => {
    if (newId !== oldId) {
      loadClient()
    }
  }
)
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
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              {{ translations.dashboard?.clientInfo?.back }}
            </button>
            <h1 class="text-3xl font-bold text-gray-900">
              {{ translations.dashboard?.clientInfo?.title }}
            </h1>
          </div>

          <!-- Success Message -->
          <div
            v-if="showSuccessMessage"
            class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg"
          >
            ✓ {{ translations.dashboard?.clientInfo?.updatedSuccess }}
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center py-16">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span class="ml-3 text-gray-600">{{
          translations.dashboard?.clientInfo?.loading
        }}</span>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div class="text-red-600 text-lg font-medium mb-2">
          ⚠️ {{ translations.dashboard?.clientInfo?.error }}
        </div>
        <p class="text-red-700">{{ error }}</p>
        <button
          @click="loadClient"
          class="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          {{ translations.dashboard?.clientInfo?.tryAgain }}
        </button>
      </div>

      <!-- Client Details -->
      <div v-else-if="selectedClient" class="space-y-8">
        <!-- Client Header Card -->
        <div class="bg-white rounded-xl shadow-lg overflow-hidden">
          <div class="bg-gradient-to-r from-[var(--color-primary)] to-black px-6 py-8">
            <div class="flex items-center space-x-6">
              <img
                :src="selectedClient.avatar || CreateAvatar(selectedClient.name)"
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
                  <span class="text-blue-100">📍 {{ selectedClient.country }}</span>
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
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                {{ translations.dashboard?.clientInfo?.sendEmail }}
              </button>

              <button
                @click="callClient"
                class="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                {{ translations.dashboard?.clientInfo?.callClient }}
              </button>

              <button
                @click="printClient"
                class="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                  />
                </svg>
                {{ translations.dashboard?.clientInfo?.print }}
              </button>

              <button
                @click="downloadReport"
                class="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                {{ translations.dashboard?.clientInfo?.downloadReport }}
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
              <svg
                class="w-5 h-5 mr-2 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              {{ translations.dashboard?.clientInfo?.personalInformation }}
            </h3>

            <div class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="text-sm font-medium text-gray-500">{{
                    translations.dashboard?.clientInfo?.fullName
                  }}</label>
                  <p class="text-gray-900 font-medium">{{ selectedClient.name }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-500">{{
                    translations.dashboard?.clientInfo?.emailAddress
                  }}</label>
                  <p class="text-gray-900 font-medium">{{ selectedClient.email }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-500">{{
                    translations.dashboard?.clientInfo?.phoneNumber
                  }}</label>
                  <p class="text-gray-900 font-medium">{{ selectedClient.phone }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-500">{{
                    translations.dashboard?.clientInfo?.country
                  }}</label>
                  <p class="text-gray-900 font-medium">{{ selectedClient.country }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-500">{{
                    translations.dashboard?.clientInfo?.registrationDate
                  }}</label>
                  <p class="text-gray-900 font-medium">{{ formattedRegistrationDate }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-500">{{
                    translations.dashboard?.clientInfo?.lastOrder
                  }}</label>
                  <p class="text-gray-900 font-medium">{{ formattedLastOrderDate }}</p>
                </div>
              </div>

              <div>
                <label class="text-sm font-medium text-gray-500">{{
                  translations.dashboard?.clientInfo?.address
                }}</label>
                <p class="text-gray-900 font-medium">{{ selectedClient.address }}</p>
              </div>

              <div>
                <label class="text-sm font-medium text-gray-500">{{
                  translations.dashboard?.clientInfo?.notes
                }}</label>
                <p class="text-gray-700">{{ selectedClient.notes }}</p>
              </div>
            </div>
          </div>

          <!-- Status Management -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <svg
                class="w-5 h-5 mr-2 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {{ translations.dashboard?.clientInfo?.statusManagement }}
            </h3>

            <div class="space-y-4">
              <div>
                <label class="text-sm font-medium text-gray-500 mb-2 block">{{
                  translations.dashboard?.clientInfo?.currentStatus
                }}</label>
                <span
                  :class="statusConfig.color"
                  class="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium"
                >
                  {{ statusConfig.icon }} {{ statusConfig.label }}
                </span>
              </div>

              <div>
                <label class="text-sm font-medium text-gray-500 mb-2 block">{{
                  translations.dashboard?.clientInfo?.changeStatus
                }}</label>
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
                    <span
                      v-if="isUpdating && selectedClient.status !== status"
                      class="animate-spin inline-block w-4 h-4 mr-2"
                      >⚙️</span
                    >
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