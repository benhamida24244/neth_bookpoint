<script setup>
import { useDashboardStore } from '@/stores/Dashboard'
import { storeToRefs } from 'pinia'
import { useSettingsStore } from '@/stores/settings'
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

const { t } = useI18n()
const settingsStore = useSettingsStore()
const dashboardStore = useDashboardStore()
const { latestOrders, loading } = storeToRefs(dashboardStore)

const statusColor = {
  pending: 'bg-yellow-500',
  paid: 'bg-green-300',
  completed: 'bg-green-600 text-gray-100',
  shipped: 'bg-blue-200 text-gray-600',
  canceled: 'bg-red-400'
}

// تنسيق التاريخ
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// الحصول على اسم العميل من بيانات الطلب
const getCustomerName = (order) => {
  if (order.customer && order.customer.name) {
    return order.customer.name
  }
  return `${t('dashboard.latestOrders.customer')} #${order.customer_id}`
}

// الحصول على بريد العميل من بيانات الطلب
const getCustomerEmail = (order) => {
  if (order.customer && order.customer.email) {
    return order.customer.email
  }
  return t('dashboard.latestOrders.noEmail')
}
</script>

<template>
  <div class="bg-white shadow-md rounded-2xl p-5">
    <h2 class="text-xl font-bold font-BonaRegular text-[var(--color-primary)] mb-4">
      📦 {{ t('dashboard.latestOrders.title') }}
    </h2>

    <div v-if="loading" class="flex justify-center items-center h-32">
      <p>{{ t('loading') }}</p>
    </div>

    <div v-else class="overflow-x-auto">
      <!-- On larger screens, display as a table -->
      <table class="w-full text-left border-collapse hidden md:table">
        <thead>
          <tr class="text-gray-700 border-b">
            <th class="py-3 px-3">{{ t('dashboard.latestOrders.table.orderId') }}</th>
            <th class="py-3 px-3">{{ t('dashboard.latestOrders.table.client') }}</th>
            <th class="py-3 px-3">{{ t('dashboard.latestOrders.table.email') }}</th>
            <th class="py-3 px-3">{{ t('dashboard.latestOrders.table.status') }}</th>
            <th class="py-3 px-3">{{ t('dashboard.latestOrders.table.total') }}</th>
            <th class="py-3 px-3">{{ t('dashboard.latestOrders.table.payment') }}</th>
            <th class="py-3 px-3">{{ t('dashboard.latestOrders.table.date') }}</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="order in latestOrders" :key="order.id" class="border-b hover:bg-gray-50 transition">
            <td class="py-2 px-3 font-medium">{{ order.id }}</td>
            <td class="py-2 px-3">{{ getCustomerName(order) }}</td>
            <td class="py-2 px-3 text-sm text-gray-600">{{ getCustomerEmail(order) }}</td>
            <td class="py-2 px-3">
              <span
                class="text-sm px-3 py-1 rounded-full font-semibold"
                :class="statusColor[order.status.toLowerCase()]"
              >
                {{ order.status }}
              </span>
            </td>
            <td class="py-2 px-3 font-semibold">{{ parseFloat(order.total_price).toFixed(2) }} {{ settingsStore.currency }}</td>
            <td class="py-2 px-3">{{ order.payment_method || t('dashboard.latestOrders.noPayment') }}</td>
            <td class="py-2 px-3">{{ formatDate(order.created_at) }}</td>
          </tr>
        </tbody>
      </table>

      <!-- On smaller screens, display as cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
        <div v-for="order in latestOrders" :key="order.id" class="bg-gray-50 p-4 rounded-lg shadow">
          <div class="flex justify-between items-center mb-2">
            <span class="font-bold text-lg">#{{ order.id }}</span>
            <span
              class="text-sm px-3 py-1 rounded-full font-semibold"
              :class="statusColor[order.status.toLowerCase()]"
            >
              {{ order.status }}
            </span>
          </div>
          <div class="mb-2">
            <p class="text-gray-600">{{ getCustomerName(order) }}</p>
            <p class="text-sm text-gray-500">{{ getCustomerEmail(order) }}</p>
          </div>
          <div class="flex justify-between items-center">
            <span class="font-semibold text-lg">{{ parseFloat(order.total_price).toFixed(2) }} {{ settingsStore.currency }}</span>
            <span class="text-sm text-gray-500">{{ formatDate(order.created_at) }}</span>
          </div>
           <div class="mt-2">
            <p class="text-sm text-gray-600">{{ t('dashboard.latestOrders.table.payment') }}: <span class="font-semibold">{{ order.payment_method || t('dashboard.latestOrders.noPayment') }}</span></p>
          </div>
        </div>
      </div>


      <!-- Empty State -->
      <div v-if="latestOrders.length === 0" class="p-12 text-center">
        <div class="mx-auto w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <i class="far fa-file-alt text-gray-400 text-3xl"></i>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-1">
          {{ t('dashboard.latestOrders.emptyHeader') }}
        </h3>
      </div>
    </div>
  </div>
</template>
<style scoped>
/* You can add additional styles here if needed */
</style>