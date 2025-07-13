<script setup>
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale
} from 'chart.js'

// تسجيل مكونات Chart.js
ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale)

// بيانات افتراضية (يمكنك استبدالها ببيانات حقيقية من API لاحقًا)
const chartData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Daily Sales',
      data: [120, 90, 150, 200, 170, 210, 180],
      borderColor: '#facc15', // أصفر Tailwind
      backgroundColor: 'rgba(250, 204, 21, 0.2)',
      fill: true,
      tension: 0.4
    }
  ]
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        color: '#000',
        font: {
          family: 'inherit',
        }
      }
    },
    title: {
      display: true,
      text: 'Daily Sales Overview',
      color: '#000',
      font: {
        size: 18
      }
    }
  },
  scales: {
    x: {
      ticks: { color: '#555' }
    },
    y: {
      ticks: { color: '#555' },
      beginAtZero: true
    }
  }
}
</script>

<template>
  <div class="w-full h-[300px]">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>
