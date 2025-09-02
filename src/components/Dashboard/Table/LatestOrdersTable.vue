<script setup>
import { useOrdersStore } from '@/stores/Orders';
import { useSettingsStore } from '@/stores/settings';
import { useLanguageStore } from '@/stores/language';
import { onMounted, computed } from 'vue';
import { storeToRefs } from 'pinia';

const settingsStore = useSettingsStore()
const languageStore = useLanguageStore()
const translations = computed(() => languageStore.translations)
const ordersStore = useOrdersStore()
const { orders } = storeToRefs(ordersStore)

onMounted(() => {
    ordersStore.fetchOrders()
})

const recentOrders = computed(() => orders.value.slice(-5))

const statusColor = {
  Pending: 'text-[var(--color-primary)] bg-yellow-100',
  Shipped: 'text-green-600 bg-green-100',
  Cancelled: 'text-red-600 bg-red-100'
}
</script>

<template>
  <div class="bg-white shadow-md rounded-2xl p-5 overflow-x-auto">
    <h2 class="text-xl font-bold font-BonaRegular text-[var(--color-primary)] mb-4">📦 {{ translations.dashboard?.latestOrders?.title }}</h2>
    <table class="w-full text-left border-collapse">
      <thead>
        <tr class="text-gray-700 border-b">
          <th class="py-3 px-3">{{ translations.dashboard?.latestOrders?.table?.orderId }}</th>
          <th class="py-3 px-3">{{ translations.dashboard?.latestOrders?.table?.client }}</th>
          <th class="py-3 px-3">{{ translations.dashboard?.latestOrders?.table?.email }}</th>
          <th class="py-3 px-3">{{ translations.dashboard?.latestOrders?.table?.status }}</th>
          <th class="py-3 px-3">{{ translations.dashboard?.latestOrders?.table?.total }}</th>
          <th class="py-3 px-3">{{ translations.dashboard?.latestOrders?.table?.payment }}</th>
          <th class="py-3 px-3">{{ translations.dashboard?.latestOrders?.table?.date }}</th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="order in recentOrders"
          :key="order.id"
          class="border-b hover:bg-gray-50 transition"
        >
          <td class="py-2 px-3 font-medium">{{ order.id }}</td>
          <td class="py-2 px-3">{{ order.client }}</td>
          <td class="py-2 px-3 text-sm text-gray-600">{{ order.email }}</td>
          <td class="py-2 px-3">
            <span
              class="text-sm px-3 py-1 rounded-full font-semibold"
              :class="statusColor[order.status]"
            >
              {{ order.status }}
            </span>
          </td>
          <td class="py-2 px-3 font-semibold">{{ order.total + settingsStore.currency }}</td>
          <td class="py-2 px-3">{{ order.payment }}</td>
          <td class="py-2 px-3">{{ order.date }}</td>
        </tr>
      </tbody>
    </table>
            <!-- Empty State -->
        <div v-if="recentOrders.length === 0" class="p-12 text-center">
          <div
            class="mx-auto w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4"
          >
            <i class="far fa-file-alt text-gray-400 text-3xl"></i>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-1">{{ translations.dashboard?.latestOrders?.emptyHeader }}</h3>

        </div>
  </div>
</template>
