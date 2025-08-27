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
import { onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'

ChartJS.register(Title, Tooltip, Legend, ArcElement)
const orderStore = useOrdersStore()
const { orders } = storeToRefs(orderStore)

onMounted(() => {
  orderStore.fetchOrders()
})

// بيانات وهمية لدور النشر – يمكنك ربطها بقاعدة البيانات لاحقًا
const chartData = computed(() => ({
  labels: orders.value.map((order) => order.country),
  datasets: [
    {
      label: 'Publishing Houses',
      data: orders.value.map((order) => order.bookCount),
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
