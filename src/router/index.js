import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import ShopView from '@/views/ShopView.vue'
import AuthorsView from '@/views/Authors/AuthorsView.vue'
import Delivery_theme from '@/views/Delivery_theme.vue'
import ContactView from '@/views/ContactView.vue'
import SingleAuthorPage from '@/views/Authors/SingleAuthorPage.vue'
import DefaultLayout from '@/Layout/DefaultLayout.vue'
import DashboardLayout from '@/Layout/DashboardLayout.vue'
import NotFound from '@/Layout/NotFound.vue'
import DashboardHome from '@/views/Dashboard/DashboardHome.vue'
import Orders from '@/views/Dashboard/Orders.vue'
import Authors from '@/views/Dashboard/Authors.vue'
import Settings from '@/views/Dashboard/Settings.vue'
import PublishingHouse from '@/views/Dashboard/publishing-house.vue'
import ClientDash from '@/views/Dashboard/ClientDash.vue'
import Books from '@/views/Dashboard/Books.vue'
import OrderDetails from '@/views/Dashboard/OrderDetails.vue'
import BookDetails from '@/views/Dashboard/BookDetails.vue'
import ClientInfo from '@/views/Dashboard/ClientInfo.vue'
import CartView from '@/views/CartView.vue'
import CheckOutPageView from '@/views/CheckOutPageView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path:'/',
      name:'Main Page',
      component:DefaultLayout,
      children:[
        {
      path: '',
      name: 'home',
      component: HomeView,
    },
    {
      path:'about',
      name:'About',
      component: AboutView,
    },
    {
      path:'shop',
      name:'shop',
      component:ShopView,
    },
    {
    path:'authors',
    name:'Authors',
    component:AuthorsView,
    },
    {
      path:'authors/:id',
      name:'Authors info',
      component:SingleAuthorPage,
    },
    {
      path:'delivery-theme',
      name:'Delivery Theme',
      component:Delivery_theme,
    },
    {
      path:'contact',
      name:'Contact Us',
      component: ContactView,
    },
    {
      path: '/cart',
      name: 'Cart',
      component: CartView,
    },
    {
      path: '/checkout',
      name: 'Checkout',
      component: CheckOutPageView,
    }
      ]
    },
    {
      path:'/dashboard',
      name:'Dashboard Home',
      component:DashboardLayout,
      children:[
        {path:'', name:'Home Dashboard' , component:DashboardHome},
        {path:'orders', name:'Orders page' , component:Orders},
        {path:'orders/:id', name:'Orders Info' , component:OrderDetails},
        {path:'clients', name:'clients page' , component:ClientDash},
        {path:'clients/:id', name:'clients Info' , component:ClientInfo},
        {path:'books', name:'Books page' , component:Books},
        {path:'books/:id', name:'Books info' , component:BookDetails},
        {path:'authors', name:'Authors page' , component:Authors},
        {path:'authors/:id', name:'Authors info' , component:SingleAuthorPage},
        {path:'settings', name:'Settings page' , component:Settings},
        {path:'publishing-house', name:'Publishing House page' , component:PublishingHouse},

      ]

    },
    {
      path:'/:pathMatch(.*)*',
      name:'Not Found',
      component:NotFound
    }
  ],
})

export default router
