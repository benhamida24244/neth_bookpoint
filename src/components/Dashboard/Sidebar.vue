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
  Clipboard,
  ServerIcon
} from 'lucide-vue-next'
import { ref, onMounted, onUnmounted, defineProps, defineEmits, watch, computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/Auth'

const { t } = useI18n()
const userStore = useAuthStore()
const { user } = storeToRefs(userStore)

const emit = defineEmits(['close'])

const active = ref('Control Panel')
const isOpen = ref(true)
const isMobile = ref(false)
const isLogout = ref(false)
const route = useRoute()

const Menu = computed(() => [
  {
    title: t('dashboard.sidebar.dashboard'),
    icon: PanelBottom,
    url: '/dashboard'
  },
  { title: t('dashboard.sidebar.orders'), icon: ShoppingCart, url: '/dashboard/orders' },
  { title: t('dashboard.sidebar.books'), icon: Book, url: '/dashboard/books' },
  {
    title: t('dashboard.sidebar.categories'),
    icon: Layers,
    url: '/dashboard/categories'
  },
  { title: t('dashboard.sidebar.clients'), icon: ServerIcon, url: '/dashboard/clients' },
  { title: t('dashboard.sidebar.authors'), icon: BookOpen, url: '/dashboard/authors' },
  {
    title: t('dashboard.sidebar.publishingHouses'),
    icon: Layers,
    url: '/dashboard/publishing-house'
  },
  { title: t('dashboard.sidebar.settings'), icon: Settings, url: '/dashboard/settings' }
])

const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 1024
  if (!isMobile.value) {
    isOpen.value = false
  }
}

const logOut = () => {
  isLogout.value = true
  emit('logout')
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
    default: false
  }
})

onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
})
onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
})

// Watch route changes to update the active menu
watch(
  () => route.path,
  (newPath) => {
    const bestMatch = Menu.value
      .filter((item) => newPath.startsWith(item.url))
      .reduce((best, item) => (!best || item.url.length > best.url.length ? item : best), null)

    if (bestMatch) {
      active.value = bestMatch.title
    }
  },
  { immediate: true }
)

const CreateAvatar = (name) => {
  if (!name) return ''
  const getInitials = (name) => {
    let initials = name.match(/\b\w/g) || []
    return ((initials.shift() || '') + (initials.pop() || '')).toUpperCase()
  }

  const stringToColor = (str) => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }
    let color = '#'
    for (let i = 0; i < 3; i++) {
      let value = (hash >> (i * 8)) & 0xff
      color += ('00' + value.toString(16)).substr(-2)
    }
    return color
  }

  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  canvas.width = 200
  canvas.height = 200

  // Background
  context.fillStyle = stringToColor(name)
  context.fillRect(0, 0, canvas.width, canvas.height)

  // Text
  context.font = 'bold 100px Arial'
  context.fillStyle = '#fff'
  context.textAlign = 'center'
  context.textBaseline = 'middle'
  context.fillText(getInitials(name), canvas.width / 2, canvas.height / 2)

  return canvas.toDataURL('image/png')
}
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
        `fixed lg:relative h-screen bg-white shadow-2xl ${$i18n.language === 'ar' ? 'rounded-l-2xl' : 'rounded-r-2xl'} flex flex-col z-50 transition-all duration-300`,
        isMobile
          ? ['w-[280px] sm:w-[300px]', MenuOpen ? 'translate-x-0' : '-translate-x-full']
          : 'w-[240px]'
      ]"
    >
      <!-- Header -->
      <div :class="`flex items-center justify-between bg-black text-white py-4 px-6 ${$i18n.language === 'ar' ? 'rounded-ss-2xl' : 'rounded-se-2xl'}`">
        <div class="flex items-center gap-2">
          <img :src="Logo" alt="logo" class="h-8 sm:h-10" />
          <span class="font-BonaRegular text-[var(--color-primary)] text-base sm:text-lg">
            <router-link to="/">Neth BookPoint</router-link>
          </span>
        </div>
        <button
          v-if="isMobile"
          @click="emit('close')"
          class="lg:hidden text-white hover:text-[var(--color-primary)] transition-colors"
        >
          <X class="w-6 h-6" />
        </button>
      </div>

      <!-- Admin Info -->
      <div class="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <div class="flex items-center gap-3">
          <img
            :src="CreateAvatar(user?.name || 'Admin')"
            alt="Admin"
            class="w-10 h-10 rounded-full object-cover border-2 border-[var(--color-primary)]"
          />
          <div>
            <h2 class="font-semibold text-sm text-gray-800">{{ user?.name || "Admin" }}</h2>
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
                ? 'bg-[var(--color-primary)] text-black shadow-md'
                : 'text-gray-800 hover:bg-yellow-100 hover:shadow-sm'
            ]"
            @click="setActiveMenu(menu.title)"
          >
            <RouterLink :to="menu.url" class="flex items-center gap-2 w-full">
              <span
                :class="[
                  'w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200',
                  active === menu.title
                    ? 'bg-white text-black shadow-sm'
                    : 'bg-[var(--color-primary)] text-white group-hover:bg-[var(--color-primary)]'
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
          @click="logOut"
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
          {{ t('dashboard.sidebar.logout') }}
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
