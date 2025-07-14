<script setup>
const orders = [
  {
    id: '#ORD1234',
    client: 'Ali Bensalem',
    email: 'ali@example.com',
    status: 'Pending',
    total: '120.00 SAR',
    payment: 'Credit Card',
    date: '2025-07-10'
  },
  {
    id: '#ORD1235',
    client: 'Fatima Khaled',
    email: 'fatima@example.com',
    status: 'Shipped',
    total: '89.50 SAR',
    payment: 'Cash on Delivery',
    date: '2025-07-09'
  },
  {
    id: '#ORD1236',
    client: 'Yassine M.',
    email: 'yassine@example.com',
    status: 'Cancelled',
    total: '45.00 SAR',
    payment: 'Bank Transfer',
    date: '2025-07-08'
  }
]

const statusColor = {
  Pending: 'text-yellow-600 bg-yellow-100',
  Shipped: 'text-green-600 bg-green-100',
  Cancelled: 'text-red-600 bg-red-100'
}
</script>

<template>
  <div class="bg-white shadow-md rounded-2xl p-5 overflow-x-auto">
    <h2 class="text-xl font-bold font-BonaRegular text-yellow-600 mb-4">📦 Latest Orders</h2>
    <table class="w-full text-left border-collapse">
      <thead>
        <tr class="text-gray-700 border-b">
          <th class="py-3 px-3">Order ID</th>
          <th class="py-3 px-3">Client</th>
          <th class="py-3 px-3">Email</th>
          <th class="py-3 px-3">Status</th>
          <th class="py-3 px-3">Total</th>
          <th class="py-3 px-3">Payment</th>
          <th class="py-3 px-3">Date</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="order in orders"
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
          <td class="py-2 px-3 font-semibold">{{ order.total }}</td>
          <td class="py-2 px-3">{{ order.payment }}</td>
          <td class="py-2 px-3">{{ order.date }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
