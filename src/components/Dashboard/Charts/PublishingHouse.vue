<script setup>
import { computed } from 'vue'
import { Chart as PieChart, ArcElement, Tooltip, Legend, Title } from 'chart.js'
import { Pie } from 'vue-chartjs'
import { useDashboardStore } from '@/stores/Dashboard'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// تسجيل جميع المكونات اللازمة
PieChart.register(ArcElement, Tooltip, Legend, Title)
const dashboardStore = useDashboardStore()
const { publishingHouse, loading } = storeToRefs(dashboardStore)

// بيانات دور النشر من متجر Dashboard
const chartData = computed(() => {
  if (!publishingHouse.value.labels.length || !publishingHouse.value.data.length) {
    return { labels: [], datasets: [] }
  }

  // عرض فقط أفضل 5 دور نشر
  const topPublishersCount = Math.min(5, publishingHouse.value.labels.length)
  const labels = publishingHouse.value.labels.slice(0, topPublishersCount)
  const data = publishingHouse.value.data.slice(0, topPublishersCount)

  return {
    labels: labels,
    datasets: [
      {
        label: t('publishingHouseChart.label'),
        data: data,
        backgroundColor: [
          '#facc15', // Yellow
          '#60a5fa', // Blue
          '#f472b6', // Pink
          '#34d399', // Green
          '#a78bfa', // Violet
        ],
        borderColor: '#fff',
        borderWidth: 2,
      },
    ],
  }
})

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        color: '#000',
      },
    },
    title: {
      display: true,
      text: t('publishingHouseChart.title'),
      color: '#000',
      font: {
        size: 16,
      },
    },
  },
}
</script>

<template>
  <div class="w-full h-[300px]">
    <Pie v-if="chartData.datasets.length && !loading" :data="chartData" :options="chartOptions" />
    <p v-else-if="loading">{{ t('loading') }}</p>
    <p v-else>{{ t('noData') }}</p>
  </div>
</template>
