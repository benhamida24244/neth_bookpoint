<script setup>
import { Pie } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import { useOrdersStore } from '@/stores/Orders'
import { useClientsStore } from '@/stores/Clients'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

ChartJS.register(Title, Tooltip, Legend, ArcElement)
const orderStore = useOrdersStore()
const clientStore = useClientsStore()
const orders = orderStore.orders
const getCountryId = (id) => {
  const client = clientStore.getClientById(id)
  return client ? client.country : t('ordersByCountryChart.unknown')
}

const chartData = {
  labels: orders.map((order) => getCountryId(order.customer_id)),
  datasets: [
    {
      label: t('ordersByCountryChart.label'),
      data: orders.map((order) => order.bookCount),
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
      text: t('ordersByCountryChart.title'),
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
