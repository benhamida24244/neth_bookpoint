<script setup>
import { ref } from 'vue'
import Logo from '../assets/HomeIcon/Header/Logo.png'
import { useRoute } from 'vue-router'


const isMenuOpen = ref(false)
const route = useRoute();


const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = (e) => {
  // التحقق من أن النقر كان على الخلفية (backdrop) وليس على القائمة نفسها
  if (e.target === e.currentTarget) {
    isMenuOpen.value = false
  }
}

// دالة لإغلاق القائمة عند النقر على رابط
const handleLinkClick = () => {
  isMenuOpen.value = false
}

const isActive = (link) => {
  return route.path === link
}

const MenuContent = [
  {
    name: 'Home',
    link: '/',
    selectUrl: true,
  },
  {
    name: 'About',
    link: '/about',
    selectUrl: false,
  },
  {
    name: 'Shop',
    link: '/shop',
    selectUrl: false,
  },
  {
    name: 'Delivery theme',
    link: '/delivery-theme',
    selectUrl: false,
  },
  {
    name: 'Sellers',
    link: '/sellers',
    selectUrl: false,
  }
]
</script>

<template>
  <header
    id="header"
    class="flex shadow-md py-4 px-4 sm:px-10  min-h-[70px] tracking-wide relative z-50"
  >
    <div class="flex flex-wrap items-center justify-between gap-5 w-full">
      <RouterLink to="/" class="max-sm:hidden">
        <div class="flex items-center gap-2">
          <img :src="Logo" alt="logo" class="w-20" />
          <p class="text-xl font-bold font-bona text-yellow-600 ">NETH<br>BOOKPOINT</p>
        </div>
      </RouterLink>
      <RouterLink to="/" class="hidden max-sm:block">
        <img :src="Logo" alt="logo" class="w-12"/>
      </RouterLink>

      <div

        id="collapseMenu"
        class="lg:!block max-lg:before:fixed max-lg:before:bg-black max-lg:before:opacity-50 max-lg:before:inset-0 max-lg:before:z-50"
        :class="{ 'max-lg:hidden': !isMenuOpen }"
        @click="closeMenu"
      >

        <ul
          v-motion-slide-visible-left
          class="font-BonaRegular lg:flex gap-x-4 max-lg:space-y-3 max-lg:fixed max-lg:bg-black max-lg:w-1/2 max-lg:min-w-[300px] max-lg:top-0 max-lg:left-0 max-lg:p-6 max-lg:h-full max-lg:shadow-md max-lg:overflow-auto z-50"
          @click.stop
        >
          <li class="mb-6 hidden max-lg:block">
            <a href="javascript:void(0)"
              ><img :src="Logo" alt="logo" class="w-36" />
            </a>
          </li>
          <li v-for="item in MenuContent" class="max-lg:border-b max-lg:border-gray-300 max-lg:py-3 px-3">
            <RouterLink
              :to="item.link"
              class="hover:text-yellow-600 text-white block font-medium text-[15px]"
              :class="{'text-yellow-500': isActive(item.link)}"
              @click="handleLinkClick"
              >{{item.name}}</RouterLink
            >
          </li>
        </ul>
      </div>

      <div class="flex max-lg:ml-auto space-x-4">
        <div class="text-white pt-1 relative cursor-pointer">
          <i class="pi pi-shopping-cart" style="font-size: 1.5rem"></i>
          <span class="absolute right-6 bottom-6 text-sm font-medium bg-yellow-600 rounded-lg p-1">15</span>
        </div>
        <button
          class="px-4 py-2 text-sm rounded-full font-medium cursor-pointer tracking-wide text-white border border-gray-400 bg-transparent hover:bg-gray-50 hover:text-black transition-all"
        >
          Login
        </button>
        <button
          class="px-4 py-2 text-sm rounded-full font-medium cursor-pointer tracking-wide text-white border border-yellow-600 bg-yellow-600 hover:bg-yellow-700 transition-all"
        >
          Sign up
        </button>

        <button id="toggleOpen" class="lg:hidden cursor-pointer text-yellow-600" @click="toggleMenu">
          <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
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
</template>
