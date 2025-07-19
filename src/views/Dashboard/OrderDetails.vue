<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const orders = ref([
  { id: 1, customer: 'Ali Ahmed', book: '1984', status: 'Completed', price: 29.99, date: '2025-07-12', email: 'ali@example.com' },
  { id: 2, customer: 'Sara Belkacem', book: 'Kafka on the Shore', status: 'Pending', price: 35.00, date: '2025-07-14', email: 'sara@example.com' },
  { id: 3, customer: 'Omar Yacine', book: 'Animal Farm', status: 'Returned', price: 24.99, date: '2025-07-13', email: 'omar@example.com' },
  { id: 4, customer: 'Yasmine H.', book: 'The Alchemist', status: 'Completed', price: 39.99, date: '2025-07-10', email: 'yasmine@example.com' },
]);

const route = useRoute();
const orderId = parseInt(route.params.id);
const selectedOrder = ref(orders.value.find(order => order.id === orderId));

// لتعديل الحالة
const statusOptions = ['Pending', 'Completed', 'Returned'];
const updateStatus = (newStatus) => {
  if (selectedOrder.value) {
    selectedOrder.value.status = newStatus;
  }
};
</script>

<template>
  <div class="w-full min-h-screen px-4 md:px-6 py-8 bg-gray-50">
    <div class="mb-6">
      <h1 class="text-3xl font-bold font-BonaRegular">تفاصيل الطلب</h1>
      <p class="text-gray-600 font-BonaRegular">عرض تفاصيل الطلب رقم {{ selectedOrder.id }}</p>
    </div>

    <div class="bg-white rounded-2xl shadow-md border p-6 mb-6">
      <h2 class="text-xl font-semibold mb-4">نظرة عامة</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p class="font-medium">رقم الطلب: <span class="font-normal text-gray-700">{{ selectedOrder.id }}</span></p>
          <p class="font-medium">تاريخ الطلب: <span class="font-normal text-gray-700">{{ selectedOrder.date }}</span></p>
          <p class="font-medium">الحالة:
            <span
              class="px-3 py-1 rounded-full text-xs font-semibold"
              :class="{
                'text-green-600 bg-green-100': selectedOrder.status === 'Completed',
                'text-yellow-600 bg-yellow-100': selectedOrder.status === 'Pending',
                'text-red-600 bg-red-100': selectedOrder.status === 'Returned',
              }"
            >
              {{ selectedOrder.status }}
            </span>
          </p>

          <!-- ميرة تعديل الحالة -->
          <div class="mt-2">
            <label class="text-sm text-gray-600 font-medium mb-1 block">تعديل حالة الطلب:</label>
            <select
              class="border rounded-lg px-3 py-2 text-sm w-full"
              v-model="selectedOrder.status"
              @change="updateStatus(selectedOrder.status)"
            >
              <option v-for="status in statusOptions" :key="status" :value="status">{{ status }}</option>
            </select>
          </div>
        </div>

        <div>
          <p class="font-medium">العميل: <span class="font-normal text-gray-700">{{ selectedOrder.customer }}</span></p>
          <p class="font-medium">البريد الإلكتروني: <span class="font-normal text-gray-700">{{ selectedOrder.email }}</span></p>
          <p class="font-medium">عنوان الشحن:
            <span class="font-normal text-gray-700">123 Elm Street, Springfield, 62704</span>
          </p>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-2xl shadow-md border p-6">
      <h2 class="text-xl font-semibold mb-4">محتويات الطلب</h2>
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead>
            <tr class="bg-gray-100 text-left">
              <th class="px-4 py-3 font-semibold">الكتاب</th>
              <th class="px-4 py-3 font-semibold">الكمية</th>
              <th class="px-4 py-3 font-semibold">السعر</th>
              <th class="px-4 py-3 font-semibold">الإجمالي</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="px-4 py-3 font-medium">{{ selectedOrder.book }}</td>
              <td class="px-4 py-3">1</td>
              <td class="px-4 py-3">${{ selectedOrder.price.toFixed(2) }}</td>
              <td class="px-4 py-3">${{ selectedOrder.price.toFixed(2) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-6 flex justify-end">
        <div class="w-full max-w-xs">
          <p class="font-medium">الإجمالي الفرعي: <span class="font-normal text-gray-700">${{ selectedOrder.price.toFixed(2) }}</span></p>
          <p class="font-medium">الشحن: <span class="font-normal text-gray-700">$5.00</span></p>
          <p class="font-semibold text-lg">المجموع: <span class="font-bold text-gray-900">${{ (selectedOrder.price + 5).toFixed(2) }}</span></p>
        </div>
      </div>
    </div>
  </div>
</template>
