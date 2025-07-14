<script setup>
import { Bell, CheckCircle, AlertTriangle, XCircle } from 'lucide-vue-next'

const notifications = [
  {
    id: 1,
    type: 'success',
    message: 'تم بيع كتاب "Atomic Habits"',
    date: '2025-07-11 10:23',
    icon: CheckCircle,
  },
  {
    id: 2,
    type: 'info',
    message: 'تمت إضافة كتاب جديد "It Starts With Us"',
    date: '2025-07-11 09:10',
    icon: Bell,
  },
  {
    id: 3,
    type: 'warning',
    message: 'نفاد المخزون لكتاب "The Alchemist"',
    date: '2025-07-10 17:42',
    icon: AlertTriangle,
  },
  {
    id: 4,
    type: 'error',
    message: 'فشل في معالجة الطلب رقم 4021',
    date: '2025-07-10 13:05',
    icon: XCircle,
  },
]
</script>

<template>
  <div class="bg-white p-6 rounded-2xl shadow-md">
    <h2 class="text-xl font-bold text-yellow-600 font-BonaRegular mb-4">
      🔔 Latest Notifications
    </h2>

    <ul class="space-y-3">
      <li
        v-for="notif in notifications"
        :key="notif.id"
        class="flex items-start gap-4 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition"
      >
        <div
          :class="[
            'rounded-full p-2',
            notif.type === 'success' && 'bg-green-100 text-green-600',
            notif.type === 'info' && 'bg-blue-100 text-blue-600',
            notif.type === 'warning' && 'bg-yellow-100 text-yellow-600',
            notif.type === 'error' && 'bg-red-100 text-red-600',
          ]"
        >
          <component :is="notif.icon" class="w-5 h-5" />
        </div>

        <div>
          <p class="text-sm text-gray-800">{{ notif.message }}</p>
          <p class="text-xs text-gray-400 mt-0.5">{{ notif.date }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>
