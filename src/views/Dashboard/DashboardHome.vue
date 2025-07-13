<script setup>
import CategorySalesChart from '@/components/Dashboard/Charts/CategorySalesChart.vue';
import DailyOrdersChart from '@/components/Dashboard/Charts/DailyOrdersChart.vue';
import DailySalesChart from '@/components/Dashboard/Charts/DailySalesChart.vue';
import StatCards from '@/components/Dashboard/StatCards.vue';
import { BookOpen, ShoppingCart, Users, DollarSign } from 'lucide-vue-next';

const info = [
  {
    id: 1,
    name: 'Books',
    icon: BookOpen,
    Num: 120
  },
  {
    id: 2,
    name: 'Orders Today',
    icon: ShoppingCart,
    Num: 12
  },
  {
    id: 3,
    name: 'Clients',
    icon: Users,
    Num: 120
  },
  {
    id: 4,
    name: 'Sales',
    icon: DollarSign,
    Num: '3423 $'
  }
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
      <StatCards
        v-for="item in info"
        :key="item.id"
        :item="item"
      />
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
    <div class="bg-white p-4 rounded-2xl shadow max-w-xl mx-auto">
      <CategorySalesChart/>
    </div>
  </div>
</template>
