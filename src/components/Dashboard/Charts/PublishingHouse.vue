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
  labels: ['Penguin', 'HarperCollins', 'Macmillan', 'Simon & Schuster', 'Other'],
  datasets: [
    {
      label: 'Publishing Houses',
      data: [150, 90, 70, 60, 40],
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
      text: 'Books by Publishing House',
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
