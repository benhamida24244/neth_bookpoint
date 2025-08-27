<script setup>
import { Pie } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js'
import { usePublishingHouseStore } from '@/stores/PublishingHouses'
import { onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'

ChartJS.register(Title, Tooltip, Legend, ArcElement)
const PublishingHouseStore = usePublishingHouseStore()
const { publishingHouses } = storeToRefs(PublishingHouseStore)

onMounted(() => {
  PublishingHouseStore.fetchPublisher()
})

// بيانات وهمية لدور النشر – يمكنك ربطها بقاعدة البيانات لاحقًا
const chartData = computed(() => ({
  labels: publishingHouses.value.map((publisher) => publisher.name),
  datasets: [
    {
      label: 'Publishing Houses',
      data: publishingHouses.value.map((publisher) => publisher.bookCount),
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
