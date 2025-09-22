<template>
  <header
    id="header"
    :style="{ background: headerBackground }"
    class="sticky top-0 z-50 w-full shadow-lg backdrop-blur-sm transition-all duration-500 ease-in-out"
    :class="[
      'header-container',
      isRtl ? 'font-arabic' : 'font-latin',
      { 'header-scrolled': isScrolled }
    ]"
  >
    <!-- Desktop Header -->
    <div class="hidden lg:flex items-center justify-between px-4 xl:px-8 py-4 transition-all duration-300">
      <!-- Logo Section -->
      <RouterLink to="/" class="flex items-center gap-3 hover:opacity-80 transition-all duration-300 transform hover:scale-105">
        <div :class="isRtl ? 'flex-row-reverse' : 'flex-row'" class="flex items-center gap-3">
          <img :src="Logo" alt="logo" class="w-12 xl:w-16 h-auto transition-transform duration-300 hover:rotate-3" />
          <div class="flex flex-col">
            <h1 class="text-sm xl:text-lg font-bold text-[var(--color-primary)] leading-tight">
              {{ t('header.title') }}
            </h1>
          </div>
        </div>
      </RouterLink>

      <!-- Navigation Menu -->
      <nav class="flex items-center">
        <ul class="flex items-center gap-4 xl:gap-8">
          <li v-for="(item, index) in MenuContent" :key="item.name" class="nav-item">
            <RouterLink
              :to="item.link"
              class="nav-link relative text-white hover:text-[var(--color-hover)] font-medium text-sm xl:text-base transition-all duration-300 py-2 px-1 group"
              :class="{
                'text-[var(--color-primary)] font-semibold nav-active': isActive(item.link)
              }"
              :style="{
                '--animation-delay': `${index * 0.1}s`
              }"
            >
              {{ item.name }}
              <!-- Enhanced Underline Animation -->
              <span
                class="underline-animation absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-hover)] origin-left transition-all duration-500 ease-out transform"
                :class="[
                  isActive(item.link) ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100',
                  'before:absolute before:inset-0 before:bg-white before:opacity-20 before:blur-sm'
                ]"
              ></span>
              <!-- Hover glow effect -->
              <span class="absolute inset-0 rounded-md bg-[var(--color-primary)] opacity-0 group-hover:opacity-10 transition-opacity duration-300 -z-10"></span>
            </RouterLink>
          </li>
        </ul>
      </nav>

      <!-- Actions Section -->
      <div class="flex items-center gap-3 xl:gap-4">
        <!-- Cart with enhanced animation -->
        <RouterLink
          to="/cart"
          class="cart-button relative group text-white hover:text-[var(--color-hover)] transition-all duration-300 p-2 rounded-full hover:bg-white hover:bg-opacity-10 transform hover:scale-110"
        >
          <i class="pi pi-shopping-cart text-lg xl:text-xl transition-transform duration-300 group-hover:animate-bounce"></i>
          <span
            v-if="cartCount > 0"
            class="cart-badge absolute -top-1 -right-1 bg-[var(--color-primary)] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center transform transition-all duration-300 animate-pulse"
            :class="{ 'animate-ping': cartCount > 0 }"
          >
            {{ cartCount > 99 ? '99+' : cartCount }}
          </span>
        </RouterLink>

        <!-- User Section -->
        <div v-if="isLoggedIn" class="flex items-center">
          <RouterLink to="/profile" class="group">
            <img
              src="https://randomuser.me/api/portraits/men/75.jpg"
              alt="User Avatar"
              class="w-8 h-8 xl:w-10 xl:h-10 rounded-full border-2 border-transparent group-hover:border-[var(--color-primary)] transition-all duration-300 transform group-hover:scale-110 hover:shadow-lg"
            />
          </RouterLink>
        </div>
        <div v-else class="flex items-center gap-2 xl:gap-3">
          <button
            @click="uiStore.openLoginModal"
            class="auth-button px-3 py-2 text-xs xl:text-sm font-medium text-white border border-gray-400 rounded-full bg-transparent hover:bg-white hover:text-gray-800 transition-all duration-300 transform hover:scale-105 hover:shadow-md"
          >
            {{ t('header.login') }}
          </button>
          <button
            @click="uiStore.openRegisterModal"
            class="auth-button px-3 py-2 text-xs xl:text-sm font-medium text-white bg-[var(--color-primary)] border border-[var(--color-primary)] rounded-full hover:bg-[var(--color-hover)] hover:border-[var(--color-hover)] transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            {{ t('header.signup') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile/Tablet Header -->
    <div class="flex lg:hidden items-center justify-between px-3 sm:px-4 py-3">
      <!-- Mobile Logo -->
      <RouterLink to="/" class="flex items-center gap-2 flex-shrink-0">
        <img :src="Logo" alt="logo" class="w-10 sm:w-12 h-auto transition-transform duration-300 hover:scale-110" />
        <h1 class="text-sm sm:text-base font-bold text-[var(--color-primary)] hidden xs:block">
          {{ t('header.title') }}
        </h1>
      </RouterLink>

      <!-- Mobile Actions -->
      <div class="flex items-center gap-2 sm:gap-3">
        <!-- Mobile Cart -->
        <RouterLink
          to="/cart"
          class="relative text-white hover:text-[var(--color-hover)] p-2 flex-shrink-0 rounded-full hover:bg-white hover:bg-opacity-10 transition-all duration-300 transform hover:scale-110"
        >
          <i class="pi pi-shopping-cart text-lg sm:text-xl"></i>
          <span
            v-if="cartCount > 0"
            class="absolute -top-1 -right-1 bg-[var(--color-primary)] text-white text-xs font-bold rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-[10px] sm:text-xs animate-pulse"
          >
            {{ cartCount > 9 ? '9+' : cartCount }}
          </span>
        </RouterLink>

        <!-- Mobile User/Auth -->
        <div v-if="isLoggedIn" class="flex-shrink-0">
          <RouterLink to="/profile">
            <img
              src="https://randomuser.me/api/portraits/men/75.jpg"
              alt="User Avatar"
              class="w-8 h-8 sm:w-10 sm:h-10 rounded-full transition-transform duration-300 hover:scale-110"
            />
          </RouterLink>
        </div>

        <!-- Enhanced Mobile Menu Toggle -->
        <button
          @click="toggleMenu"
          class="mobile-menu-toggle relative w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-[var(--color-primary)] focus:outline-none flex-shrink-0 rounded-full hover:bg-white hover:bg-opacity-10 transition-all duration-300"
          :class="{ 'menu-open': isMenuOpen }"
          aria-label="Toggle Menu"
        >
          <div class="hamburger">
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
          </div>
        </button>
      </div>
    </div>

    <!-- Enhanced Mobile Menu Overlay -->
    <Teleport to="body">
      <Transition
        name="overlay"
        enter-active-class="transition-opacity duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-300 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="isMenuOpen"
          class="mobile-overlay fixed inset-0 bg-opacity-60 backdrop-blur-sm z-40 lg:hidden"
          @click.prevent="closeMenu"
        />
      </Transition>

      <!-- Enhanced Mobile Menu Panel -->
      <Transition
        name="slide"
        enter-active-class="transition-transform duration-400 ease-out"
        :enter-from-class="isRtl ? 'transform -translate-x-full' : 'transform translate-x-full'"
        enter-to-class="transform translate-x-0"
        leave-active-class="transition-transform duration-400 ease-in"
        leave-from-class="transform translate-x-0"
        :leave-to-class="isRtl ? 'transform -translate-x-full' : 'transform translate-x-full'"
      >
        <div
          v-if="isMenuOpen"
          class="mobile-menu-panel fixed top-0 h-screen w-80 max-w-xs sm:max-w-sm z-50 lg:hidden overflow-hidden shadow-2xl"
          :class="[
            isRtl ? 'left-0' : 'right-0',
            'flex flex-col backdrop-blur-lg'
          ]"
          :style="{
            background: `linear-gradient(135deg, ${headerBackground || 'rgba(0,0,0,0.95)'}, rgba(0,0,0,0.8))`
          }"
        >
          <!-- Mobile Menu Header -->
          <div class="mobile-menu-header flex items-center justify-between p-3 border-b border-gray-700 border-opacity-50">
            <div class="flex items-center gap-3">
              <img :src="Logo" alt="logo" class="w-10 sm:w-10 h-auto" />
              <h2 class="text-[var(--color-primary)] font-semibold text-lg">{{ t('header.title') }}</h2>
            </div>
          </div>

          <!-- Enhanced Mobile Navigation -->
          <nav class="mobile-nav flex-1 bg-black py-4 overflow-y-auto">
            <ul class="space-y-2 px-4">
              <li v-for="(item, index) in MenuContent" :key="item.name">
                <RouterLink
                  :to="item.link"
                  @click="handleLinkClick"
                  class="mobile-nav-link flex items-center px-4 py-3 text-base text-white hover:bg-[var(--color-hover)] hover:bg-opacity-10 rounded-lg transition-all duration-300 group"
                  :class="{
                    'text-[var(--color-primary)] bg-[var(--color-primary)] bg-opacity-20': isActive(item.link),
                    'border-r-2 border-[var(--color-primary)]': isActive(item.link) && !isRtl,
                    'border-l-2 border-[var(--color-primary)]': isActive(item.link) && isRtl
                  }"
                  :style="{
                    '--stagger-delay': `${index * 0.1}s`,
                    'animation-delay': `var(--stagger-delay)`
                  }"
                >
                  <span class="flex-1">{{ item.name }}</span>
                  <i class="pi pi-chevron-right text-sm opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-300"
                     :class="{ 'pi-chevron-left': isRtl, 'group-hover:-translate-x-1': isRtl }"></i>
                </RouterLink>
              </li>
            </ul>
          </nav>

          <!-- Enhanced Mobile Auth Buttons -->
          <div v-if="!isLoggedIn" class="bg-black mobile-auth p-4 border-t border-gray-700 border-opacity-50 space-y-3">
            <button
              @click="handleAuthClick('login')"
              class="w-full px-4 py-3 text-sm font-medium text-white border border-gray-600 rounded-lg bg-transparent hover:bg-white hover:bg-opacity-10 hover:border-[var(--color-primary)] transition-all duration-300 transform hover:scale-105"
            >
              {{ t('header.login') }}
            </button>
            <button
              @click="handleAuthClick('register')"
              class="w-full px-4 py-3 text-sm font-medium text-white bg-[var(--color-primary)] rounded-lg hover:bg-[var(--color-hover)] transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              {{ t('header.signup') }}
            </button>
          </div>

          <!-- Enhanced Mobile User Info -->
          <div v-if="isLoggedIn" class="mobile-user p-4 border-t border-gray-700 border-opacity-50 bg-black">
            <RouterLink
              to="/profile"
              @click="handleLinkClick"
              class="flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--color-hover)] hover:bg-opacity-10 transition-all duration-300 group"
            >
              <img
                src="https://randomuser.me/api/portraits/men/75.jpg"
                alt="User Avatar"
                class="w-12 h-12 rounded-full flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
              />
              <div class="min-w-0 flex-1">
                <p class="text-white font-medium text-sm truncate">الملف الشخصي</p>
                <p class="text-gray-400 text-xs truncate">عرض الملف الشخصي</p>
              </div>
              <i class="pi pi-chevron-right text-gray-400 group-hover:text-[var(--color-primary)] transition-colors duration-300"
                 :class="{ 'pi-chevron-left': isRtl }"></i>
            </RouterLink>
          </div>
        </div>
      </Transition>
    </Teleport>
  </header>

  <!-- Modals -->
  <LoginView
    v-if="isLoginModalOpen"
    @openRegister="uiStore.openRegisterModal"
    @close="uiStore.closeModal"
  />
  <RegisterView
    v-if="isRegisterModalOpen"
    @openLogin="uiStore.openLoginModal"
    @close="uiStore.closeModal"
  />
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import Logo from '../assets/HomeIcon/Header/Logo.png'
import { useRoute } from 'vue-router'
import LoginView from '@/views/Auth/LoginView.vue'
import RegisterView from '@/views/Auth/RegisterView.vue'
import { useCartStore } from '@/stores/Cart'
import { useSettingsStore } from '@/stores/settings'
import { useUIStore } from '@/stores/ui'
import { useI18n } from 'vue-i18n'
import { useCustomerAuthStore } from '@/stores/customerAuth'

const { t } = useI18n()

// Ref for mobile menu state
const isMenuOpen = ref(false)
const isScrolled = ref(false)
const route = useRoute()

// UI store for modal management
const uiStore = useUIStore()
const { isLoginModalOpen, isRegisterModalOpen } = storeToRefs(uiStore)

// Scroll detection for header effects
const handleScroll = () => {
  isScrolled.value = window.scrollY > 10
}

// Enhanced mobile menu functions
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value

  if (isMenuOpen.value) {
    document.body.style.overflow = 'hidden'
    document.body.classList.add('menu-open')
    // Add smooth opening animation delay
    setTimeout(() => {
      document.querySelectorAll('.mobile-nav-link').forEach((link, index) => {
        link.style.animationDelay = `${index * 0.1}s`
        link.classList.add('animate-slide-in')
      })
    }, 100)
  } else {
    document.body.style.overflow = 'auto'
    document.body.classList.remove('menu-open')
  }
}

const closeMenu = () => {
  isMenuOpen.value = false
  document.body.style.overflow = 'auto'
  document.body.classList.remove('menu-open')
}

const handleLinkClick = () => {
  closeMenu()
}

// Handle auth button clicks in mobile menu
const handleAuthClick = (type) => {
  if (type === 'login') {
    uiStore.openLoginModal()
  } else {
    uiStore.openRegisterModal()
  }
  closeMenu()
}

// Function to check if a route is active
const isActive = (link) => {
  return route.path === link
}

// Pinia stores
const settingsStore = useSettingsStore()
const userStore = useCustomerAuthStore()
const cartStore = useCartStore()

// Reactive state from stores
const { isLoggedIn } = storeToRefs(userStore)
const { cartCount } = storeToRefs(cartStore)

const headerBackground = computed(() => {
  const wallpaper = settingsStore.primaryColor.headerWallpaper || ''
  return wallpaper ? `url("${wallpaper}") center/cover no-repeat` : 'linear-gradient(135deg, rgba(0,0,0,0.9), rgba(30,30,30,0.95))'
})

// Enhanced menu content
const MenuContent = computed(() => [
  {
    name: t('header.home'),
    link: '/',
  },
  {
    name: t('header.about'),
    link: '/about',
  },
  {
    name: t('header.shop'),
    link: '/shop',
  },
  {
    name: t('header.delivery_theme'),
    link: '/delivery-theme',
  },
  {
    name: t('header.authors'),
    link: '/authors',
  },
])

// Computed property to check if current language is RTL
const isRtl = computed(() => {
  return settingsStore.locale === 'ar' || settingsStore.locale === 'he'
})

// Lifecycle hooks
onMounted(() => {
  cartStore.fetchCart()
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.body.style.overflow = 'auto'
  document.body.classList.remove('menu-open')
})
</script>

<style scoped>
/* Enhanced Header Animations */
.header-container {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.header-scrolled {
  backdrop-filter: blur(20px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

/* Enhanced Navigation Animations */
.nav-item {
  animation: fadeInUp 0.6s ease-out forwards;
  animation-delay: var(--animation-delay, 0s);
  opacity: 0;
  transform: translateY(10px);
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.nav-link {
  position: relative;
  overflow: hidden;
}

.underline-animation {
  transform-origin: left center;
}

.nav-link:hover .underline-animation {
  animation: shimmer 0.6s ease-in-out;
}

@keyframes shimmer {
  0% { transform: scaleX(0) translateX(-100%); }
  50% { transform: scaleX(1) translateX(0); }
  100% { transform: scaleX(1) translateX(0); }
}

/* Enhanced Hamburger Animation */
.hamburger {
  position: relative;
  width: 1.25rem;
  height: 0.875rem;
}

@media (min-width: 640px) {
  .hamburger {
    width: 1.5rem;
    height: 1rem;
  }
}

.hamburger-line {
  position: absolute;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, currentColor 0%, var(--color-primary) 100%);
  border-radius: 1px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: left center;
}

.hamburger-line:nth-child(1) {
  top: 0;
}

.hamburger-line:nth-child(2) {
  top: 50%;
  transform: translateY(-50%);
}

.hamburger-line:nth-child(3) {
  bottom: 0;
}

.menu-open .hamburger-line:nth-child(1) {
  transform: rotate(45deg) translate(2px, -2px);
}

.menu-open .hamburger-line:nth-child(2) {
  opacity: 0;
  transform: translateY(-50%) scaleX(0);
}

.menu-open .hamburger-line:nth-child(3) {
  transform: rotate(-45deg) translate(2px, 2px);
}

/* Enhanced Mobile Menu Animations */
.mobile-overlay {
  backdrop-filter: blur(8px);
}

.mobile-menu-panel {
  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.5);
}

.mobile-nav-link {
  opacity: 0;
  transform: translateX(20px);
  animation: slideInLeft 0.4s ease-out forwards;
}

@keyframes slideInLeft {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Enhanced Button Animations */
.auth-button {
  position: relative;
  overflow: hidden;
}

.auth-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s;
}

.auth-button:hover::before {
  left: 100%;
}

/* Cart Badge Animation */
.cart-badge {
  animation: bounceIn 0.5s ease-out;
}

@keyframes bounceIn {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Enhanced Transitions */
.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Responsive Design Improvements */
@media (max-width: 475px) {
  .mobile-menu-panel {
    width: 85vw;
  }
}

@media (min-width: 640px) {
  .mobile-menu-panel {
    width: 384px;
  }
}

/* Performance Optimizations */
.hamburger,
.hamburger-line,
.mobile-menu-panel,
.nav-link,
.underline-animation {
  will-change: transform;
}

/* Accessibility Improvements */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Custom Scrollbar for Mobile Menu */
.mobile-nav::-webkit-scrollbar {
  width: 4px;
}

.mobile-nav::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
}

.mobile-nav::-webkit-scrollbar-thumb {
  background: var(--color-primary);
  border-radius: 2px;
}

/* Smooth Focus Transitions */
button:focus-visible,
a:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  transition: outline 0.2s ease-in-out;
}

/* Enhanced Backdrop Support */
@supports (backdrop-filter: blur(20px)) {
  .backdrop-blur-sm {
    backdrop-filter: blur(20px);
  }

  .mobile-menu-panel {
    backdrop-filter: blur(20px);
  }
}

/* Body Lock for Mobile Menu */
:global(body.menu-open) {
  overflow: hidden;
  touch-action: none;
}

/* Safe Area Support for Modern Devices */
@supports (padding-top: env(safe-area-inset-top)) {
  .mobile-menu-panel {
    padding-top: env(safe-area-inset-top);
  }
}

/* Enhanced Visual Effects */
.nav-link::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle, var(--color-primary) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.nav-link:hover::after {
  opacity: 0.1;
}

/* Mobile Menu Header Animation */
.mobile-menu-header {
  animation: slideDown 0.4s ease-out;
}

@keyframes slideDown {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Enhanced Mobile Auth Buttons */
.mobile-auth button {
  position: relative;
  overflow: hidden;
}

.mobile-auth button::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.4s ease, height 0.4s ease;
}

.mobile-auth button:hover::before {
  width: 300px;
  height: 300px;
}
</style>
