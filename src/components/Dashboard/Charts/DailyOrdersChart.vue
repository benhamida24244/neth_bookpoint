<script setup>
import { Line } from 'vue-chartjs'
import { useOrdersStore } from '@/stores/Orders'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// تسجيل المكونات المطلوبة
ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale)
const OrdersStore = useOrdersStore()
const Orders = OrdersStore.orders

// بيانات الطلبات اليومية (افتراضية حاليًا)
const chartData = {
  labels: Orders.map((order) => order.date),
  datasets: [
    {
      label: t('dailyOrdersChart.label'),
      data: Orders.map((order) => order.bookCount),
      borderColor: '#4ade80', // أخضر Tailwind
      backgroundColor: 'rgba(74, 222, 128, 0.2)',
      fill: true,
      tension: 0.4,
    },
  ],
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        color: '#000',
      },
    },
    title: {
      display: true,
      text: t('dailyOrdersChart.title'),
      color: '#000',
      font: {
        size: 18,
      },
    },
  },
  scales: {
    x: {
      ticks: { color: '#555' },
    },
    y: {
      ticks: { color: '#555' },
      beginAtZero: true,
    },
  },
}
</script>

<template>
  <div class="w-full h-[300px]">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>
