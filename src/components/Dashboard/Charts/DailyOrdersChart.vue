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

// تسجيل المكونات المطلوبة
ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale)

// بيانات الطلبات اليومية (افتراضية حاليًا)
const chartData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Daily Orders',
      data: [15, 22, 18, 30, 25, 28, 21],
      borderColor: '#4ade80', // أخضر Tailwind
      backgroundColor: 'rgba(74, 222, 128, 0.2)',
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
        color: '#000'
      }
    },
    title: {
      display: true,
      text: 'Daily Orders Overview',
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
