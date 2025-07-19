<script setup>
import Logo from '@/assets/HomeIcon/Header/Logo.png'
import {
  BookOpen,
  ShoppingCart,
  Layers,
  Settings,
  PanelBottom,
  Menu as MenuIcon,
  X,
  Book,
} from 'lucide-vue-next'
import { ref, onMounted, onUnmounted, defineProps, defineEmits } from 'vue'
import { RouterLink } from 'vue-router'

const emit = defineEmits(['close'])

const active = ref('Control Panel')
const isOpen = ref(true)
const isMobile = ref(false)

const Menu = ref([
  { title: 'Control Panel', icon: PanelBottom, url: '/dashboard' },
  { title: 'Orders', icon: ShoppingCart, url: '/dashboard/orders' },
  { title: 'Books', icon: Book, url: '/dashboard/books' },
  { title: 'Clients', icon: Layers, url: '/dashboard/clients' },
  { title: 'Authors', icon: BookOpen, url: '/dashboard/authors' },
  { title: 'Publishing House', icon: Layers, url: '/dashboard/publishing-house' },
  { title: 'Settings', icon: Settings, url: '/dashboard/settings' },
])

const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 1024
  if (!isMobile.value) {
    isOpen.value = false
  }
}

const closeSidebar = () => {
  if (isMobile.value) {
    emit('close')
  }
}

const setActiveMenu = (menuTitle) => {
  active.value = menuTitle
  if (isMobile.value) {
    emit('close')
  }
}

defineProps({
  MenuOpen: {
    type: Boolean,
    default: false,
  },
})

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
    <!-- Overlay -->
    <div
      v-if="isMobile && MenuOpen"
      class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
      @click="closeSidebar"
    ></div>

    <!-- Sidebar -->
    <aside
      v-motion-slide-visible-left
      :class="[
        'fixed lg:relative h-screen bg-white shadow-2xl rounded-r-2xl flex flex-col z-50 transition-all duration-300',
        isMobile
          ? ['w-[280px] sm:w-[300px]', MenuOpen ? 'translate-x-0' : '-translate-x-full']
          : 'w-[240px]',
      ]"
    >
      <!-- Header -->
      <div class="flex items-center justify-between bg-black text-white py-4 px-6 rounded-se-2xl">
        <div class="flex items-center gap-2">
          <img :src="Logo" alt="logo" class="h-8 sm:h-10" />
          <span class="font-BonaRegular text-yellow-600 text-base sm:text-lg">
            <router-link to="/">Neth BookPoint</router-link>
          </span>
        </div>
        <button
          v-if="isMobile"
          @click="emit('close')"
          class="lg:hidden text-white hover:text-yellow-600 transition-colors"
        >
          <X class="w-6 h-6" />
        </button>
      </div>

      <!-- Admin Info -->
      <div class="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <div class="flex items-center gap-3">
          <img
            src="https://i.pravatar.cc/40"
            alt="Admin"
            class="w-10 h-10 rounded-full object-cover border-2 border-yellow-600"
          />
          <div>
            <h2 class="font-semibold text-sm text-gray-800">Admin Name</h2>
            <p class="text-xs text-gray-500">Administrator</p>
          </div>
        </div>
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
            <RouterLink :to="menu.url" class="flex items-center gap-2 w-full">
              <span
                :class="[
                  'w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200',
                  active === menu.title
                    ? 'bg-white text-black shadow-sm'
                    : 'bg-yellow-600 text-white group-hover:bg-yellow-700',
                ]"
              >
                <component :is="menu.icon" class="w-5 h-5" />
              </span>
              <span class="font-BonaRegular text-base font-medium">
                {{ menu.title }}
              </span>
            </RouterLink>
          </li>
        </ul>
      </nav>

      <!-- Footer -->
      <div class="px-4 py-4 border-t border-gray-200 flex flex-col gap-2">
        <button
          class="w-full flex items-center justify-center gap-2 bg-red-100 text-red-600 hover:bg-red-200 transition-all px-3 py-2 rounded-lg text-sm font-semibold"
          @click="console.log('Log out clicked')"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"
            />
          </svg>
          Log Out
        </button>
        <div class="text-xs text-gray-400 text-center">© 2024 Neth BookPoint</div>
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
