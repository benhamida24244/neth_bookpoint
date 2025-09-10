<script setup>
import { useClientsStore } from '@/stores/Clients'
import { useOrdersStore } from '@/stores/Orders'
import { useSettingsStore } from '@/stores/settings'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const settingsStore = useSettingsStore()
const ordersStore = useOrdersStore()
const customerStore = useClientsStore()

const orders = ordersStore.getRecentOrders

const statusColor = {
  Pending: 'text-[var(--color-primary)] bg-yellow-100',
  Shipped: 'text-green-600 bg-green-100',
  Cancelled: 'text-red-600 bg-red-100'
}

const TheCustomer = (id) => {
  try {
    // التأكد من تحميل بيانات العملاء أولاً
    if (!customerStore.loaded) {
      customerStore.fetchClients().then(() => {
        // بعد تحميل البيانات، تحديث الجدول
        forceUpdate()
      })
      return t('dashboard.latestOrders.loading')
    }
    const customer = customerStore.getClientById(id)
    return customer ? customer.name : `${t('dashboard.latestOrders.customer')} #${id}`
  } catch (error) {
    console.error('Error fetching customer:', error)
    return `${t('dashboard.latestOrders.customer')} #${id}`
  }
}

// لفرض إعادة تحديث المكون
const forceUpdate = () => {
  searchQuery.value = searchQuery.value
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
</script>

<template>
  <div class="bg-white shadow-md rounded-2xl p-5 overflow-x-auto">
    <h2 class="text-xl font-bold font-BonaRegular text-[var(--color-primary)] mb-4">
      📦 {{ t('dashboard.latestOrders.title') }}
    </h2>
    <table class="w-full text-left border-collapse">
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
        <tr v-for="order in orders" :key="order.id" class="border-b hover:bg-gray-50 transition">
          <td class="py-2 px-3 font-medium">{{ order.id }}</td>
          <td class="py-2 px-3">{{ TheCustomer(order.customer_id) }}</td>
          <td class="py-2 px-3 text-sm text-gray-600">{{ order.customer_email }}</td>
          <td class="py-2 px-3">
            <span
              class="text-sm px-3 py-1 rounded-full font-semibold"
              :class="statusColor[order.status]"
            >
              {{ order.status }}
            </span>
          </td>
          <td class="py-2 px-3 font-semibold">{{ parseFloat(order.total_price).toFixed(2) }}</td>
          <td class="py-2 px-3">{{ order.payment }}</td>
          <td class="py-2 px-3">{{ formatDate(order.created_at) }}</td>
        </tr>
      </tbody>
    </table>
    <!-- Empty State -->
    <div v-if="orders.length === 0" class="p-12 text-center">
      <div class="mx-auto w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <i class="far fa-file-alt text-gray-400 text-3xl"></i>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-1">
        {{ t('dashboard.latestOrders.emptyHeader') }}
      </h3>
    </div>
  </div>
</template>
