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
  ServerIcon,
  ChevronLeft,
  ChevronRight
} from 'lucide-vue-next'
import { ref, onMounted, onUnmounted, defineProps, defineEmits, watch, computed, nextTick } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/Auth'

const { t } = useI18n()
const { locale } = useI18n()
const isRtl = computed(() => locale.value === 'ar' || document.documentElement.dir === 'rtl')

const userStore = useAuthStore()
const { user } = storeToRefs(userStore)

const emit = defineEmits(['close', 'logout', 'toggle-collapse'])

const props = defineProps({
  MenuOpen: {
    type: Boolean,
    default: false
  },
  isCollapsed: {
    type: Boolean,
    default: false
  }
})

const active = ref('Control Panel')
const screenSize = ref('mobile')
const route = useRoute()
const sidebarRef = ref(null)

// تحديد أنواع الشاشات
const breakpoints = {
  mobile: 768,
  tablet: 1024,
  desktop: 1280,
  large: 1920
}

const checkScreenSize = () => {
  const width = window.innerWidth

  if (width < breakpoints.mobile) {
    screenSize.value = 'mobile'
  } else if (width < breakpoints.tablet) {
    screenSize.value = 'tablet'
  } else if (width < breakpoints.desktop) {
    screenSize.value = 'desktop'
  } else if (width < breakpoints.large) {
    screenSize.value = 'large'
  } else {
    screenSize.value = 'xl'
  }
}

// حساب العروض المختلفة
const sidebarWidths = computed(() => ({
  mobile: props.isCollapsed ? '80px' : '280px',
  tablet: props.isCollapsed ? '80px' : '260px',
  desktop: props.isCollapsed ? '80px' : '280px',
  large: props.isCollapsed ? '80px' : '300px',
  xl: props.isCollapsed ? '80px' : '320px'
}))

const currentWidth = computed(() => sidebarWidths.value[screenSize.value])

const isMobile = computed(() => screenSize.value === 'mobile')
const isTablet = computed(() => screenSize.value === 'tablet')
const isDesktop = computed(() => !isMobile.value && !isTablet.value)

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

const logOut = () => {
  emit('logout')
}

const closeSidebar = () => {
  emit('close')
}

const toggleCollapse = () => {
  emit('toggle-collapse')
}

const setActiveMenu = (menuTitle) => {
  active.value = menuTitle
  if (isMobile.value || isTablet.value) {
    emit('close')
  }
}

// مراقبة تغيير الشاشة
onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)

  // إضافة listener للكيبورد للوصولية
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
  document.removeEventListener('keydown', handleKeydown)
})

const handleKeydown = (event) => {
  // إغلاق الـ sidebar بالـ Escape
  if (event.key === 'Escape' && (isMobile.value || isTablet.value) && props.MenuOpen) {
    closeSidebar()
  }
}

// مراقبة تغيير المسار
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

  context.fillStyle = stringToColor(name)
  context.fillRect(0, 0, canvas.width, canvas.height)

  context.font = 'bold 100px Arial'
  context.fillStyle = '#fff'
  context.textAlign = 'center'
  context.textBaseline = 'middle'
  context.fillText(getInitials(name), canvas.width / 2, canvas.height / 2)

  return canvas.toDataURL('image/png')
}

// حساب الفئات المختلفة
const sidebarClasses = computed(() => {
  const baseClasses =
    'fixed h-screen bg-white shadow-2xl flex flex-col z-50 transition-[width] duration-300 ease-in-out sidebar-responsive sidebar-gpu-accelerated'

  let widthClass = ''
  let positionClass = ''

  // العرض
  if (isMobile.value || isTablet.value) {
    // For mobile, width is fixed when open. The transition component handles show/hide.
    widthClass = 'w-[280px] max-w-[85vw]'
  } else {
    // For desktop, width changes on collapse/expand
    widthClass = `w-[${currentWidth.value}]`
  }

  // الموضع
  if (isRtl.value) {
    positionClass = 'right-0 top-0'
  } else {
    positionClass = 'left-0 top-0'
  }

  const radiusClass = isRtl.value ? 'rounded-l-2xl' : 'rounded-r-2xl'

  return `${baseClasses} ${widthClass} ${positionClass} ${radiusClass}`
})

const headerClasses = computed(() => {
  const baseClasses = 'flex items-center bg-black text-white transition-all duration-300'
  const radiusClass = isRtl.value ? 'rounded-tl-2xl' : 'rounded-tr-2xl'
  const paddingClass = props.isCollapsed ? 'px-2 py-3 justify-center' : 'px-4 py-3 justify-between md:px-6 md:py-4'

  return `${baseClasses} ${radiusClass} ${paddingClass}`
})

const getNavItemClasses = (menuItem) => {
  const baseClasses = 'flex items-center rounded-lg cursor-pointer transition-all duration-200 group relative'
  const paddingClass = props.isCollapsed ? 'p-3 justify-center' : 'gap-2 md:gap-3 px-3 py-2 md:px-4 md:py-3'

  let activeClass = ''
  if (active.value === menuItem.title) {
    activeClass = 'bg-[var(--color-primary)] text-black shadow-md sidebar-item-active'
  } else {
    activeClass = 'text-gray-800 hover:bg-yellow-100 hover:shadow-sm sidebar-hover'
  }

  return `${baseClasses} ${paddingClass} ${activeClass}`
}

const getIconClasses = (menuItem) => {
  const baseClasses = 'flex items-center justify-center rounded-full transition-all duration-200'
  const sizeClass = props.isCollapsed ? 'w-8 h-8 md:w-10 md:h-10' : 'w-8 h-8 md:w-9 md:h-9'

  let colorClass = ''
  if (active.value === menuItem.title) {
    colorClass = 'bg-white text-black shadow-sm'
  } else {
    colorClass = 'bg-[var(--color-primary)] text-white group-hover:bg-[var(--color-primary)]'
  }

  return `${baseClasses} ${sizeClass} ${colorClass}`
}
</script>

<template>
  <div>
    <!-- Overlay للأجهزة المحمولة والأجهزة اللوحية -->
    <transition name="fade">
      <div
        v-if="(isMobile || isTablet) && MenuOpen"
        class="fixed inset-0 bg-black bg-opacity-50 z-40 sidebar-overlay"
        @click="closeSidebar"
      ></div>
    </transition>

    <!-- Sidebar -->
    <transition :name="isRtl ? 'slide-right' : 'slide-left'">
      <aside
        v-if="isDesktop || MenuOpen"
        ref="sidebarRef"
        :class="sidebarClasses"
        role="navigation"
        aria-label="Main navigation"
      >
        <!-- Header -->
        <div :class="headerClasses">
          <div class="flex items-center gap-2" :class="{ 'justify-center': isCollapsed }">
            <img :src="Logo" alt="logo" class="h-6 sm:h-8 md:h-10 flex-shrink-0" />
            <span
              v-if="!isCollapsed"
              class="font-BonaRegular text-[var(--color-primary)] text-sm sm:text-base md:text-lg whitespace-nowrap"
            >
              <router-link to="/">{{ t('dashboard.sidebar.brand') }}</router-link>
            </span>
          </div>

          <div class="flex items-center gap-2">
            <!-- زر الطي/الإظهار للشاشات الكبيرة -->
            <button
              v-if="isDesktop"
              @click="toggleCollapse"
              class="text-white hover:text-[var(--color-primary)] transition-colors p-1 rounded sidebar-focus"
              :aria-label="isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
            >
              <component
                :is="isRtl ? (isCollapsed ? ChevronLeft : ChevronRight) : isCollapsed ? ChevronRight : ChevronLeft"
                class="w-5 h-5"
              />
            </button>

            <!-- زر الإغلاق للأجهزة المحمولة -->
            <button
              v-if="isMobile || isTablet"
              @click="closeSidebar"
              class="text-white hover:text-[var(--color-primary)] transition-colors p-1 rounded sidebar-focus"
              aria-label="Close menu"
            >
              <X class="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>
        </div>

        <!-- معلومات الإدارة -->
        <div
          v-if="!isCollapsed || isMobile || isTablet"
          class="flex items-center px-3 py-2 md:px-4 md:py-3 border-b border-gray-200"
          :class="{ 'justify-center': isCollapsed }"
        >
          <div class="flex items-center gap-2 md:gap-3 min-w-0">
            <img
              :src="CreateAvatar(user?.name || t('dashboard.sidebar.admin'))"
              alt="Admin"
              class="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover border-2 border-[var(--color-primary)] flex-shrink-0 sidebar-avatar"
            />
            <div v-if="!isCollapsed" class="min-w-0 flex-1">
              <h2 class="font-semibold text-xs md:text-sm text-gray-800 truncate sidebar-text">
                {{ user?.name || t('dashboard.sidebar.admin') }}
              </h2>
              <p class="text-xs text-gray-500 truncate">{{ t('dashboard.sidebar.administrator') }}</p>
            </div>
          </div>
        </div>

        <!-- التنقل -->
        <nav
          class="flex-1 px-3 md:px-4 py-3 md:py-5 overflow-y-auto sidebar-content sidebar-ios-scroll"
        >
          <ul class="flex flex-col gap-1 md:gap-2" role="menubar">
            <li
              v-for="menu in Menu"
              :key="menu.title"
              :class="getNavItemClasses(menu)"
              @click="setActiveMenu(menu.title)"
              role="menuitem"
              :aria-label="menu.title"
            >
              <RouterLink
                :to="menu.url"
                class="flex items-center w-full"
                :class="{ 'justify-center': isCollapsed, 'gap-2 md:gap-3': !isCollapsed }"
              >
                <span :class="getIconClasses(menu)" class="sidebar-icon">
                  <component :is="menu.icon" class="w-4 h-4 md:w-5 md:h-5" />
                </span>
                <span
                  v-if="!isCollapsed"
                  class="font-BonaRegular text-sm md:text-base font-medium truncate sidebar-text sidebar-text-responsive"
                >
                  {{ menu.title }}
                </span>

                <!-- Tooltip للوضع المطوي -->
                <div
                  v-if="isCollapsed && isDesktop"
                  class="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-10"
                  :class="{ 'right-full mr-2 left-auto': isRtl }"
                >
                  {{ menu.title }}
                </div>
              </RouterLink>
            </li>
          </ul>
        </nav>

        <!-- Footer -->
        <div
          class="px-3 md:px-4 py-3 md:py-4 border-t border-gray-200 flex flex-col gap-2 sidebar-border"
        >
          <button
            class="w-full flex items-center justify-center gap-2 bg-red-100 text-red-600 hover:bg-red-200 transition-all px-3 py-2 rounded-lg text-xs md:text-sm font-semibold sidebar-button sidebar-focus"
            :class="{ 'px-2': isCollapsed }"
            @click="logOut"
            :aria-label="t('dashboard.sidebar.logout')"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-4 h-4 md:w-5 md:h-5 flex-shrink-0"
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
            <span v-if="!isCollapsed">{{ t('dashboard.sidebar.logout') }}</span>
          </button>

          <div
            v-if="!isCollapsed"
            class="text-xs text-gray-400 text-center px-2 sidebar-text-responsive"
          >
            {{ t('dashboard.sidebar.copyright') }}
          </div>
        </div>
      </aside>
    </transition>
  </div>
</template>

<style scoped>
/* استيراد الستايلات المخصصة */
@import url('@/assets/sidebar.css');

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.4s ease-in-out;
}

.slide-left-enter-from,
.slide-left-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

/* ستايلات إضافية مخصصة للمكون */
.sidebar-nav-item {
  position: relative;
}

.sidebar-tooltip {
  transform: translateY(-50%);
  top: 50%;
}

/* تحسين الأداء */
nav {
  contain: layout style paint;
}

/* تحسين للحركة */
@media (prefers-reduced-motion: reduce) {
  * {
    transition: none !important;
    animation: none !important;
  }
}
</style>
