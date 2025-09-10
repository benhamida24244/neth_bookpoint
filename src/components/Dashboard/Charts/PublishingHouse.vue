<script setup>
import { computed, onMounted } from 'vue'
import { Chart as PieChart, ArcElement, Tooltip, Legend, Title } from 'chart.js'
import { Pie } from 'vue-chartjs'
import { usePublishingHouseStore } from '@/stores/PublishingHouses'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// تسجيل جميع المكونات اللازمة
PieChart.register(ArcElement, Tooltip, Legend, Title)
const publishingHouseStore = usePublishingHouseStore()

onMounted(() => {
  publishingHouseStore.fetchPublisher()
})

// بيانات وهمية لدور النشر – يمكنك ربطها بقاعدة البيانات لاحقًا
// عرض فقط الفئات الأكثر أهمية (الأعلى عددًا من الكتب)
const chartData = computed(() => {
  const topPublishers = [...publishingHouseStore.publishingHouses]
    .sort((a, b) => b.nmBook - a.nmBook)
    .slice(0, 5) // عرض فقط أفضل 5 دور نشر

  return {
    labels: topPublishers.map((publisher) => publisher.name),
    datasets: [
      {
        label: t('publishingHouseChart.label'),
        data: topPublishers.map((publisher) => publisher.nmBook),
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
    <Pie :data="chartData" :options="chartOptions" />
  </div>
</template>
