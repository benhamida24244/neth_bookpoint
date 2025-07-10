import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import ShopView from '@/views/ShopView.vue'
import AuthorsView from '@/views/AuthorsView.vue'

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
    }
  ],
})

export default router
