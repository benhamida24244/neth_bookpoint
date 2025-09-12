<script setup>
import { Line } from 'vue-chartjs'
import { useDashboardStore } from '@/stores/Dashboard'
import { storeToRefs } from 'pinia'
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
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// تسجيل المكونات المطلوبة
ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale)
const dashboardStore = useDashboardStore()
const { dailyOrders, loading } = storeToRefs(dashboardStore)

// بيانات الطلبات اليومية من متجر Dashboard
const chartData = computed(() => {
  if (!dailyOrders.value.labels.length || !dailyOrders.value.data.length) {
    return {
      labels: [],
      datasets: [{
        label: t('dailyOrdersChart.label'),
        data: [],
        borderColor: '#4ade80',
        backgroundColor: 'rgba(74, 222, 128, 0.2)',
        fill: true,
        tension: 0.4,
      }]
    }
  }

  return {
    labels: dailyOrders.value.labels,
    datasets: [
      {
        label: t('dailyOrdersChart.label'),
        data: dailyOrders.value.data,
        borderColor: '#4ade80', // أخضر Tailwind
        backgroundColor: 'rgba(74, 222, 128, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  }
})

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
    <Line v-if="chartData.datasets[0].data.length && !loading" :data="chartData" :options="chartOptions" />
    <p v-else-if="loading">{{ t('loading') }}</p>
    <p v-else>{{ t('noData') }}</p>
  </div>
</template>
