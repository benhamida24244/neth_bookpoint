<script setup>
import { Pie } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js'
import { useOrdersStore } from '@/stores/Orders'

ChartJS.register(Title, Tooltip, Legend, ArcElement)
const orderStore = useOrdersStore()
const orders = orderStore.orders

// بيانات وهمية لدور النشر – يمكنك ربطها بقاعدة البيانات لاحقًا
const chartData = {
  labels: orders.map((order) => order.country),
  datasets: [
    {
      label: 'Publishing Houses',
      data: orders.map((order) => order.bookCount),
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
