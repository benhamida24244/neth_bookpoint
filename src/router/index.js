import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import ShopView from '@/views/ShopView.vue'
import AuthorsView from '@/views/AuthorsView.vue'
import Delivery_theme from '@/views/Delivery_theme.vue'
import ContactView from '@/views/ContactView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path:'/about',
      name:'About',
      component: AboutView,
    },
    {
      path:'/shop',
      name:'shop',
      component:ShopView,
    },
    {
    path:'/authors',
    name:'Authors',
    component:AuthorsView,
    },
    {
      path:'/delivery-theme',
      name:'Delivery Theme',
      component:Delivery_theme,
    },
    {
      path:'/contact',
      name:'Contact Us',
      component: ContactView,
    }
  ],
})

export default router
