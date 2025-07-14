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

// بيانات وهمية لدور النشر – يمكنك ربطها بقاعدة البيانات لاحقًا
const chartData = {
  labels: ['Algeria', 'China', 'India', 'United Kingdom', 'Other'],
  datasets: [
    {
      label: 'Publishing Houses',
      data: [20, 90, 60, 89, 65],
      backgroundColor: [
        '#facc15', // Yellow
        '#60a5fa', // Blue
        '#f472b6', // Pink
        '#34d399', // Green
        '#a78bfa'  // Violet
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
      text: 'Orders by they Country',
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
