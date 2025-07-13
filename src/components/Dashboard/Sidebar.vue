<script setup>
import Logo from '@/assets/HomeIcon/Header/Logo.png'
import {
  BookOpen,
  ShoppingCart,
  Layers,
  Settings,
  PanelBottom,
} from 'lucide-vue-next'
import { ref } from 'vue'

const active = ref('Control Panel')

const Menu = ref([
  { title: 'Control Panel', icon: PanelBottom },
  { title: 'Orders', icon: ShoppingCart },
  { title: 'Clients', icon: Layers },
  { title: 'Authors', icon: BookOpen },
  { title: 'Publishing House', icon: Layers },
  { title: 'Settings', icon: Settings },
])
</script>

<template>
  <aside class="h-screen w-[240px] bg-white shadow-2xl rounded-r-2xl flex flex-col">
    <!-- Logo Header -->
    <div class="flex items-center gap-2 bg-black text-white py-4 px-6 rounded-se-2xl">
      <img :src="Logo" alt="logo" class="h-10" />
      <span class="font-BonaRegular text-yellow-600 text-lg">Neth BookPoint</span>
    </div>

    <!-- Menu List -->
    <nav class="flex-1 px-4 py-6 space-y-2">
      <ul class="flex flex-col gap-2">
        <li
          v-for="menu in Menu"
          :key="menu.title"
          :class="[
            'flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-all duration-200',
            active === menu.title
              ? 'bg-yellow-600 text-black'
              : 'text-gray-800 hover:bg-yellow-100',
          ]"
          @click="active = menu.title"
        >
          <span
            class="w-8 h-8 flex items-center justify-center rounded-full"
            :class="active === menu.title ? 'bg-white text-black' : 'bg-yellow-600 text-white'"
          >
            <component :is="menu.icon" class="w-5 h-5" />
          </span>
          <span class="font-BonaRegular text-sm">{{ menu.title }}</span>
        </li>
      </ul>
    </nav>
  </aside>
</template>
