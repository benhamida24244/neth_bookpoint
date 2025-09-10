<script setup>
import Sidebar from '@/components/Dashboard/Sidebar.vue'
import { ref,computed } from 'vue'
import { Menu } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { useSettingsStore } from '@/stores/settings'

const MenuIsOpen = ref(false)
const isLogout = ref(false)
const router = useRouter()
const settingsStore = useSettingsStore()
const OpenMenu = () => {
  MenuIsOpen.value = true
}
const CloseMenu = () => {
  MenuIsOpen.value = false
}

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('role')
  isLogout.value = false
  router.push('/loginAdmin')
}

const isLtr = computed(() => {
  return settingsStore.language != 'ar' || settingsStore.language === 'he'
})
</script>

<template>
  <div class="flex min-h-screen bg-gray-50">
    <div v-if="isLogout" class="absolute inset-0 z-80 flex items-center justify-center">
      <div class="bg-white p-6 rounded-lg shadow-lg">
        <h2 class="text-lg font-semibold mb-4">{{ t('dashboard.logoutConfirm') }}</h2>
        <div class="flex justify-center items-center">
          <button class="bg-red-500 text-white px-4 py-2 rounded-lg" @click="logout">
            {{ t('dashboard.sidebar.logout') }}
          </button>
          <button
            class="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg ml-2"
            @click="isLogout = false"
          >
            {{ t('dashboard.cancel') }}
          </button>
        </div>
      </div>
    </div>
    <!-- Sidebar ثابت على الحاسوب -->
    <aside
      :class="
        isLtr
          ? 'fixed top-0 left-0 h-screen w-[240px] z-50 hidden lg:block'
          : 'fixed top-0 right-0 h-screen w-[240px] z-50 hidden lg:block'
      "
    >
      <Sidebar :MenuOpen="true" @logout="isLogout = true" />
    </aside>

    <!-- Sidebar متجاوب في الهاتف -->
    <Sidebar v-if="MenuIsOpen" :MenuOpen="true" @close="CloseMenu" @logout="isLogout = true" class="lg:hidden" />

    <!-- Main content -->
    <main
      :class="
        isLtr
          ? 'flex-1 ml-0 lg:ml-[240px] w-full min-h-screen overflow-x-hidden relative'
          : 'flex-1 mr-0 lg:mr-[240px] w-full min-h-screen overflow-x-hidden relative'
      "
    >
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
