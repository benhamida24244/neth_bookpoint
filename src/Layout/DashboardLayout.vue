<script setup>
import Sidebar from '@/components/Dashboard/Sidebar.vue'
</script>

<template>
  <div class="flex min-h-screen bg-gray-50">
    <!-- Sidebar ثابت -->
    <aside class="fixed top-0 left-0 h-screen w-[240px] z-50 hidden lg:block">
      <Sidebar />
    </aside>

    <!-- المحتوى الرئيسي -->
    <main class="flex-1 ml-0 lg:ml-[240px] w-full min-h-screen overflow-x-hidden">
      <RouterView />
    </main>
  </div>
</template>
