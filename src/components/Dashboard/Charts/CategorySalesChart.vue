<script setup>
import { computed, onMounted } from 'vue'
import { Chart as PieChart, ArcElement, Tooltip, Legend, Title } from 'chart.js'
import { Pie } from 'vue-chartjs'
import { useCategoriesStore } from '@/stores/Categories'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// تسجيل جميع المكونات اللازمة
PieChart.register(ArcElement, Tooltip, Legend, Title)
const CategoriesStore = useCategoriesStore()

onMounted(() => {
  CategoriesStore.fetchCategories()
})

// بيانات الفئات (مثال فقط — عدلها لاحقًا من API إن أردت)
const chartData = computed(() => {
  // عرض فقط أفضل 5 فئات من حيث عدد الكتب
  const topCategories = [...CategoriesStore.categories]
    .sort((a, b) => b.nmBook - a.nmBook)
    .slice(0, 5) // عرض فقط أفضل 5 فئات

  return {
    labels: topCategories.map((category) => category.name),
    datasets: [
      {
        label: 'فئات الكتب',
        data: topCategories.map((category) => category.nmBook),
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
    <Pie :data="chartData" :options="chartOptions" />
  </div>
</template>
