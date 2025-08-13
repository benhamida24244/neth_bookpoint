<script setup>
import Sidebar from '@/components/Dashboard/Sidebar.vue'
import { ref } from 'vue'
import { Menu } from 'lucide-vue-next'

const MenuIsOpen = ref(false)
const OpenMenu = () => {
  MenuIsOpen.value = true
}
const CloseMenu = () => {
  MenuIsOpen.value = false
}
</script>

<template>
  <div class="flex min-h-screen bg-gray-50">
    <!-- Sidebar ثابت على الحاسوب -->
    <aside class="fixed top-0 left-0 h-screen w-[240px] z-50 hidden lg:block">
      <Sidebar :MenuOpen="true" />
    </aside>

    <!-- Sidebar متجاوب في الهاتف -->
    <Sidebar v-if="MenuIsOpen" :MenuOpen="true" @close="CloseMenu" class="lg:hidden" />

    <!-- Main content -->
    <main class="flex-1 ml-0 lg:ml-[240px] w-full min-h-screen overflow-x-hidden relative">
      <!-- زر فتح القائمة في الهاتف -->
      <div
        class="h-12 w-12 bg-[var(--color-primary)] left-5 top-5 rounded-full fixed lg:hidden flex items-center justify-center text-white z-50"
        :class="MenuIsOpen ? 'hidden' : 'block'"
        @click="OpenMenu"
      >
        <Menu />
      </div>
      <RouterView />
    </main>
  </div>
</template>
