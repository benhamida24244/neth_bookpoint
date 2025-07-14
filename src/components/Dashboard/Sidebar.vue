<script setup>
import Logo from '@/assets/HomeIcon/Header/Logo.png'
import {
  BookOpen,
  ShoppingCart,
  Layers,
  Settings,
  PanelBottom,
  Menu as MenuIcon,
  X
} from 'lucide-vue-next'
import { ref, onMounted, onUnmounted } from 'vue'

const active = ref('Control Panel')
const isOpen = ref(false)
const isMobile = ref(false)

const Menu = ref([
  { title: 'Control Panel', icon: PanelBottom },
  { title: 'Orders', icon: ShoppingCart },
  { title: 'Clients', icon: Layers },
  { title: 'Authors', icon: BookOpen },
  { title: 'Publishing House', icon: Layers },
  { title: 'Settings', icon: Settings },
])

const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 1024
  if (!isMobile.value) {
    isOpen.value = false
  }
}

const closeSidebar = () => {
  if (isMobile.value) {
    isOpen.value = false
  }
}

const setActiveMenu = (menuTitle) => {
  active.value = menuTitle
  if (isMobile.value) {
    isOpen.value = false
  }
}

onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
})
onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
})
</script>

<template>
  <div>
    <!-- زر فتح القائمة للشاشات الصغيرة -->
    <button
      v-if="isMobile"
      @click="isOpen = true"
      class="fixed top-4 left-4 z-50 lg:hidden bg-yellow-600 text-white p-2 rounded-lg shadow-lg hover:bg-yellow-700 transition-colors"
    >
      <MenuIcon class="w-6 h-6" />
    </button>

    <!-- خلفية عند فتح الشريط -->
    <div
      v-if="isMobile && isOpen"
      class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
      @click="closeSidebar"
    ></div>

    <!-- Sidebar -->
    <aside
      :class="[
        'fixed lg:relative h-screen bg-white shadow-2xl rounded-r-2xl flex flex-col z-50 transition-all duration-300',
        isMobile
          ? [
              'w-[280px] sm:w-[300px]',
              isOpen ? 'translate-x-0' : '-translate-x-full'
            ]
          : 'w-[240px] xl:w-[240px]'
      ]"
    >
      <!-- Logo -->
      <div class="flex items-center justify-between bg-black text-white py-4 px-6 rounded-se-2xl">
        <div class="flex items-center gap-2">
          <img :src="Logo" alt="logo" class="h-8 sm:h-10" />
          <span class="font-BonaRegular text-yellow-600 text-base sm:text-lg">
            Neth BookPoint
          </span>
        </div>
        <button
          v-if="isMobile"
          @click="isOpen = false"
          class="lg:hidden text-white hover:text-yellow-600 transition-colors"
        >
          <X class="w-6 h-6" />
        </button>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-4 py-5 overflow-y-auto">
        <ul class="flex flex-col gap-2">
          <li
            v-for="menu in Menu"
            :key="menu.title"
            :class="[
              'flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 group',
              active === menu.title
                ? 'bg-yellow-600 text-black shadow-md'
                : 'text-gray-800 hover:bg-yellow-100 hover:shadow-sm',
            ]"
            @click="setActiveMenu(menu.title)"
          >
            <span
              :class="[
                'w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200',
                active === menu.title
                  ? 'bg-white text-black shadow-sm'
                  : 'bg-yellow-600 text-white group-hover:bg-yellow-700'
              ]"
            >
              <component :is="menu.icon" class="w-5 h-5" />
            </span>
            <span class="font-BonaRegular text-base font-medium">
              {{ menu.title }}
            </span>
          </li>
        </ul>
      </nav>

      <!-- Footer -->
      <div class="px-4 py-3 border-t border-gray-200">
        <div class="text-xs text-gray-500 text-center">
          © 2024 Neth BookPoint
        </div>
      </div>
    </aside>
  </div>
</template>

<style scoped>
nav::-webkit-scrollbar {
  width: 4px;
}
nav::-webkit-scrollbar-thumb {
  background: #d4af37;
  border-radius: 4px;
}
</style>
