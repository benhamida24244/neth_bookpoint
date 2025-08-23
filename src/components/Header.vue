<script setup>
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import Logo from '../assets/HomeIcon/Header/Logo.png'
import { useRoute } from 'vue-router'
import LoginView from '@/views/Auth/LoginView.vue'
import RegisterView from '@/views/Auth/RegisterView.vue'
import { useCartStore } from '@/stores/Cart'
import { useSettingsStore } from '@/stores/settings'
import { useLanguageStore } from '@/stores/language'
import { useUserStore } from '@/stores/Users'
import LanguageSwitcher from './LanguageSwitcher.vue'

// Ref for mobile menu state
const isMenuOpen = ref(false)
const isProfileMenuOpen = ref(false)
const route = useRoute()
// Refs for login and register modal state
const showLogin = ref(false)
const showRegister = ref(false)

const userStore = useUserStore()

// Functions to control login and register modals
const openLogin = () => {
  showLogin.value = !showLogin.value
  showRegister.value = false
}
const openRegister = () => {
  showRegister.value = true
  showLogin.value = false
}
const CloseModal = () => {
  showLogin.value = false
  showRegister.value = false
}

// Function to toggle the mobile menu
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

import { useRouter } from 'vue-router'

const router = useRouter()

const handleLogout = () => {
  userStore.logout()
  isProfileMenuOpen.value = false
  router.push('/')
}

// Function to close the mobile menu
const closeMenu = (e) => {
  if (e.target === e.currentTarget) {
    isMenuOpen.value = false
  }
}

const handleLinkClick = () => {
  isMenuOpen.value = false
}

// Function to check if a route is active
const isActive = (link) => {
  return route.path === link
}

// Pinia stores
const settingsStore = useSettingsStore()
const languageStore = useLanguageStore()


// Reactive state from stores
const { translations } = storeToRefs(languageStore)
const { isLoggedIn, currentUser } = storeToRefs(userStore)

const headerBackground = computed(() => {
  const wallpaper = settingsStore.primaryColor.headerWallpaper || ''
  return wallpaper ? `url("${wallpaper}") center/cover no-repeat` : ''
})

const MenuContent = computed(() => [
  {
    name: translations.value.header?.home || 'Home',
    link: '/',
  },
  {
    name: translations.value.header?.about || 'About',
    link: '/about',
  },
  {
    name: translations.value.header?.shop || 'Shop',
    link: '/shop',
  },
  {
    name: translations.value.header?.delivery_theme || 'Delivery theme',
    link: '/delivery-theme',
  },
  {
    name: translations.value.header?.authors || 'Authors',
    link: '/authors',
  },
])

const cartStore = useCartStore()
const { cartCount } = storeToRefs(cartStore)
</script>

<template>
  <header
    id="header"
    :style="{ background: headerBackground }"
    class="flex shadow-md py-4 px-4 sm:px-10 min-h-[70px] tracking-wide relative z-50"
  >
    <div class="flex flex-wrap items-center justify-between gap-4 w-full">
      <RouterLink to="/" class="flex items-center gap-2">
        <img :src="Logo" alt="logo" class="w-20 max-sm:w-12" />
        <p class="text-xl font-bold font-bona text-[var(--color-primary)] max-sm:hidden">
          NETH<br />BOOKPOINT
        </p>
      </RouterLink>

      <div
        id="collapseMenu"
        class="lg:!block max-lg:fixed max-lg:top-0 max-lg:right-0 max-lg:w-full max-lg:h-full max-lg:bg-black max-lg:bg-opacity-50"
        :class="{ 'max-lg:hidden': !isMenuOpen }"
        @click="closeMenu"
      >
        <ul
          v-motion-slide-visible-right
          class="font-BonaRegular lg:flex gap-x-4 max-lg:space-y-3 max-lg:fixed max-lg:bg-black max-lg:w-1/2 max-lg:min-w-[300px] max-lg:top-0 max-lg:right-0 max-lg:p-6 max-lg:h-full max-lg:shadow-md max-lg:overflow-auto z-50"
          @click.stop
        >
          <li class="mb-6 hidden max-lg:block">
            <a href="javascript:void(0)"><img :src="Logo" alt="logo" class="w-36" /> </a>
          </li>
          <li
            v-for="item in MenuContent"
            :key="item.name"
            class="max-lg:border-b max-lg:border-gray-300 max-lg:py-3 px-3"
          >
            <RouterLink
              :to="item.link"
              class="hover:text-[var(--color-hover)] text-white block font-medium text-[15px]"
              :class="{ 'text-[var(--color-primary)]': isActive(item.link) }"
              @click="handleLinkClick"
              >{{ item.name }}</RouterLink
            >
          </li>
        </ul>
      </div>

      <div class="flex items-center max-lg:ml-auto space-x-4">
        <LanguageSwitcher />
        <RouterLink
          to="/cart"
          class="relative text-white hover:text-[var(--color-hover)] self-center"
        >
          <i class="pi pi-shopping-cart" style="font-size: 1.5rem"></i>
          <span
            v-if="cartCount > 0"
            class="absolute -top-1 -right-2 text-xs font-medium bg-[var(--color-primary)] rounded-full px-1.5 py-0.5"
            >{{ cartCount }}</span
          >
        </RouterLink>

        <div v-if="isLoggedIn && currentUser" class="relative">
          <button @click="isProfileMenuOpen = !isProfileMenuOpen" class="flex items-center">
            <img
              :src="currentUser.avatar || 'https://randomuser.me/api/portraits/men/75.jpg'"
              alt="User Avatar"
              class="w-10 h-10 rounded-full object-cover"
            />
          </button>
          <div v-if="isProfileMenuOpen" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
            <RouterLink to="/profile" @click="isProfileMenuOpen = false" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</RouterLink>
            <button @click="handleLogout" class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</button>
          </div>
        </div>

        <template v-else>
          <button
            class="px-4 py-2 text-sm rounded-full font-medium cursor-pointer tracking-wide text-white border border-gray-400 bg-transparent hover:bg-gray-50 hover:text-black transition-all max-sm:hidden"
            @click="openLogin"
          >
            {{ translations.header?.login || 'Login' }}
          </button>
          <button
            @click="openRegister"
            class="px-4 py-2 text-sm rounded-full font-medium cursor-pointer tracking-wide text-white border border-[var(--color-primary)] bg-[var(--color-primary)] hover:bg-[var(--color-hover)] transition-all max-sm:hidden"
          >
            {{ translations.header?.signup || 'Sign up' }}
          </button>
        </template>

        <button
          id="toggleOpen"
          class="lg:hidden cursor-pointer text-[var(--color-primary)]"
          @click="toggleMenu"
        >
          <svg
            class="w-7 h-7"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  </header>
  <LoginView v-if="showLogin" @openRegister="openRegister" @close="CloseModal" />
  <RegisterView v-if="showRegister" @openLogin="openLogin" @close="CloseModal" />
</template>
