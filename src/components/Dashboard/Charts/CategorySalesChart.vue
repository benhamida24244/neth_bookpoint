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
const { categorySales, loading } = storeToRefs(dashboardStore)

// بيانات الفئات من متجر Dashboard
const chartData = computed(() => {
  if (!categorySales.value.labels.length || !categorySales.value.data.length) {
    return { labels: [], datasets: [] }
  }

  // عرض فقط أفضل 5 فئات
  const topCategoriesCount = Math.min(5, categorySales.value.labels.length)
  const labels = categorySales.value.labels.slice(0, topCategoriesCount)
  const data = categorySales.value.data.slice(0, topCategoriesCount)

  return {
    labels: labels,
    datasets: [
      {
        label: t('categorySalesChart.label'),
        data: data,
        backgroundColor: [
          '#facc15', // Yellow
          '#60a5fa', // Blue
          '#f87171', // Red
          '#34d399', // Green
          '#c084fc', // Purple
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
      text: t('categorySalesChart.title'),
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
