<script setup>
import { Pie } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import { useDashboardStore } from '@/stores/Dashboard'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

const { t } = useI18n()
ChartJS.register(Title, Tooltip, Legend, ArcElement)

const dashboardStore = useDashboardStore()
const { ordersByCountry, loading } = storeToRefs(dashboardStore)

// بيانات الـ Pie Chart من متجر Dashboard
const chartData = computed(() => {
  if (!ordersByCountry.value.labels.length || !ordersByCountry.value.data.length) {
    return { labels: [], datasets: [] }
  }

  return {
    labels: ordersByCountry.value.labels,
    datasets: [
      {
        label: t('ordersByCountryChart.label'),
        data: ordersByCountry.value.data,
        backgroundColor: [
          '#facc15', '#60a5fa', '#f472b6', '#34d399', '#a78bfa',
          '#f87171', '#3b82f6', '#9333ea', '#10b981', '#fbbf24'
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
    legend: { position: 'bottom', labels: { color: '#000' } },
    title: { display: true, text: t('ordersByCountryChart.title'), color: '#000', font: { size: 16 } },
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
