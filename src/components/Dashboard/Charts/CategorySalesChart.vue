<script setup>
import { Pie } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, ArcElement)

// بيانات الفئات (مثال فقط — عدلها لاحقًا من API إن أردت)
const chartData = {
  labels: ['Fiction', 'Romance', 'Horror', 'Drama', 'Fantasy'],
  datasets: [
    {
      label: 'Book Categories',
      data: [120, 95, 50, 80, 140],
      backgroundColor: [
        '#facc15', // Yellow
        '#60a5fa', // Blue
        '#f87171', // Red
        '#34d399', // Green
        '#c084fc'  // Purple
      ],
      borderColor: '#fff',
      borderWidth: 2
    }
  ]
}

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
