<script setup>
import { computed, onMounted } from 'vue'
import { Pie } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js'
import { useCategoriesStore } from '@/stores/Categories'
import { storeToRefs } from 'pinia'

ChartJS.register(Title, Tooltip, Legend, ArcElement)
const CategoriesStore = useCategoriesStore()
const { categories } = storeToRefs(CategoriesStore)

onMounted(() => {
  CategoriesStore.fetchCategories()
})

// بيانات الفئات (مثال فقط — عدلها لاحقًا من API إن أردت)
const chartData = computed(() => ({
  labels: categories.value.map((category) => category.name),
  datasets: [
    {
      label: 'Book Categories',
      data: categories.value.map((category) => category.bookCount),
      backgroundColor: [
        '#facc15', // Yellow
        '#60a5fa', // Blue
        '#f87171', // Red
        '#34d399', // Green
        '#c084fc' // Purple
      ],
      borderColor: '#fff',
      borderWidth: 2
    }
  ]
}))

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        color: '#000'
      }
    },
    title: {
      display: true,
      text: 'Book Categories Distribution',
      color: '#000',
      font: {
        size: 16
      }
    }
  }
}
</script>

<template>
  <div class="w-full h-[300px]">
    <Pie :data="chartData" :options="chartOptions" />
  </div>
</template>
