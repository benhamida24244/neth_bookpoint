<script setup lang="ts">
import {
  ListOrderedIcon,
  ClockIcon,
  TruckIcon,
  RotateCcwIcon,
  CheckCircleIcon,
  EyeIcon,
} from 'lucide-vue-next';
import { ref, computed } from 'vue';

const selectedStatus = ref('all');

const StatsCard = [
  { id: 1, title: 'Total Orders', value: 592, icon: ListOrderedIcon, color: 'text-blue-500' },
  { id: 2, title: 'Avg Delivery Time', value: '3 days', icon: ClockIcon, color: 'text-green-500' },
  { id: 3, title: 'Pending Orders', value: 84, icon: TruckIcon, color: 'text-yellow-500' },
  { id: 4, title: 'Returned Orders', value: 18, icon: RotateCcwIcon, color: 'text-red-500' },
  { id: 5, title: 'Completed Orders', value: 470, icon: CheckCircleIcon, color: 'text-emerald-500' }
];

const orders = ref([
  { id: '#001', customer: 'Ali Ahmed', book: '1984', status: 'Completed', price: 29.99, date: '2025-07-12' },
  { id: '#002', customer: 'Sara Belkacem', book: 'Kafka on the Shore', status: 'Pending', price: 35.00, date: '2025-07-14' },
  { id: '#003', customer: 'Omar Yacine', book: 'Animal Farm', status: 'Returned', price: 24.99, date: '2025-07-13' },
  { id: '#004', customer: 'Yasmine H.', book: 'The Alchemist', status: 'Completed', price: 39.99, date: '2025-07-10' },
]);

const filteredOrders = computed(() => {
  if (selectedStatus.value === 'all') return orders.value;
  return orders.value.filter(order => order.status.toLowerCase() === selectedStatus.value);
});

const statusColors = {
  Completed: 'text-green-600 bg-green-100',
  Pending: 'text-yellow-600 bg-yellow-100',
  Returned: 'text-red-600 bg-red-100',
};
</script>

<template>
  <div class="w-full min-h-screen px-4 md:px-6 py-8 bg-gray-50">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-3xl font-bold font-BonaRegular">Orders</h1>
      <p class="text-gray-600 font-BonaRegular">Track and manage all your book orders</p>
    </div>

    <!-- Stats -->
    <div class="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 mb-6">
      <div v-for="card in StatsCard" :key="card.id"
        class="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-md border">
        <component :is="card.icon" :class="`${card.color} w-6 h-6`" />
        <div>
          <p class="text-sm text-gray-600">{{ card.title }}</p>
          <p class="text-lg font-semibold">{{ card.value }}</p>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex gap-4 mb-4">
      <button
        v-for="status in ['all', 'Completed', 'Pending', 'Returned']"
        :key="status"
        @click="selectedStatus = status.toLowerCase()"
        class="px-4 py-2 rounded-xl border hover:bg-yellow-50 transition"
        :class="{
          'bg-yellow-700 text-white': selectedStatus === status.toLowerCase(),
          'text-gray-600': selectedStatus !== status.toLowerCase()
        }"
      >
        {{ status }}
      </button>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto bg-white rounded-2xl shadow border">
      <table class="min-w-full text-sm">
        <thead>
          <tr class="bg-gray-100 text-left">
            <th class="px-4 py-3 font-semibold">Order ID</th>
            <th class="px-4 py-3 font-semibold">Customer</th>
            <th class="px-4 py-3 font-semibold">Book</th>
            <th class="px-4 py-3 font-semibold">Status</th>
            <th class="px-4 py-3 font-semibold">Price</th>
            <th class="px-4 py-3 font-semibold">Date</th>
            <th class="px-4 py-3 font-semibold text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="order in filteredOrders"
            :key="order.id"
            class="border-t hover:bg-gray-50"
          >
            <td class="px-4 py-3 font-medium">{{ order.id }}</td>
            <td class="px-4 py-3">{{ order.customer }}</td>
            <td class="px-4 py-3">{{ order.book }}</td>
            <td class="px-4 py-3">
              <span :class="`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.status]}`">
                {{ order.status }}
              </span>
            </td>
            <td class="px-4 py-3">${{ order.price.toFixed(2) }}</td>
            <td class="px-4 py-3">{{ order.date }}</td>
            <td class="px-4 py-3 text-center">
              <button class="text-yellow-600 hover:underline flex items-center gap-1">
                <EyeIcon class="w-4 h-4" />
                View
              </button>
            </td>
          </tr>
          <tr v-if="filteredOrders.length === 0">
            <td colspan="7" class="text-center py-6 text-gray-400">No orders found.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
