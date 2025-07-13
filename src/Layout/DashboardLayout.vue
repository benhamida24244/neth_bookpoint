<script setup lang="ts">
import Sidebar from '@/components/Dashboard/Sidebar.vue';

</script>

<template>
  <div class="fixed top-0 left-0 h-screen">
    <Sidebar/>
  </div>
  <main class="ml-[240px]">
    <RouterView/>
  </main>
</template>
