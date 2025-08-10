<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useDashboardStore } from '@/stores/Dashboard'
import CategorySalesChart from '@/components/Dashboard/Charts/CategorySalesChart.vue'
import DailyOrdersChart from '@/components/Dashboard/Charts/DailyOrdersChart.vue'
import DailySalesChart from '@/components/Dashboard/Charts/DailySalesChart.vue'
import OrdersByTheCountry from '@/components/Dashboard/Charts/OrdersByTheCountry.vue'
import PublishingHouse from '@/components/Dashboard/Charts/PublishingHouse.vue'
import RecentNotification from '@/components/Dashboard/RecentNotification.vue'
import StatCards from '@/components/Dashboard/StatCards.vue'
import LatestOrdersTable from '@/components/Dashboard/Table/LatestOrdersTable.vue'
import RecentBook from '@/components/Dashboard/Table/RecentBook.vue'
import { BookOpen, ShoppingCart, Users, DollarSign } from 'lucide-vue-next'

const dashboardStore = useDashboardStore()
const { stats } = storeToRefs(dashboardStore)

onMounted(() => {
  dashboardStore.fetchDashboardData()
})

const info = [
  {
    id: 1,
    name: 'Books',
    icon: BookOpen,
    Num: stats.value.books,
  },
  {
    id: 2,
    name: 'Orders Today',
    icon: ShoppingCart,
    Num: stats.value.ordersToday,
  },
  {
    id: 3,
    name: 'Clients',
    icon: Users,
    Num: stats.value.clients,
  },
  {
    id: 4,
    name: 'Sales Today',
    icon: DollarSign,
    Num: `${stats.value.salesToday} $`,
  },
]
</script>

<template>
  <div class="w-full min-h-screen px-6 py-8 bg-gray-50">
    <!-- عنوان -->
    <h1 class="text-3xl font-bold text-yellow-600 font-BonaRegular text-center mb-8">
      Dashboard Overview
    </h1>

    <!-- بطاقات الإحصائيات -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCards v-for="item in info" :key="item.id" :item="item" />
    </div>

    <!-- مخططات مستقبلية أو عناصر أخرى -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
      <div class="bg-white p-4 rounded-2xl shadow">
        <DailySalesChart />
      </div>
      <div class="bg-white p-4 rounded-2xl shadow">
        <DailyOrdersChart />
      </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
      <div class="bg-white p-4 rounded-2xl shadow max-w-xl mx-auto">
        <CategorySalesChart />
      </div>
      <div class="bg-white p-4 rounded-2xl shadow max-w-xl mx-auto">
        <PublishingHouse />
      </div>
      <div class="bg-white p-4 rounded-2xl shadow max-w-xl mx-auto">
        <OrdersByTheCountry />
      </div>
    </div>
    <div class="mt-6 px-4">
      <LatestOrdersTable />
    </div>
    <!--آخر الكتب المضافة-->
    <!--📚 القسم 4: الكتب المضافة حديثًا (Recent Books)
      عرض غلاف + اسم الكتاب + تاريخ النشر -->

    <div class="mt-6 px-4">
      <RecentBook/>
    </div>
    <div class="mt-6 px-4">
      <RecentNotification/>
    </div>
  </div>
</template>
