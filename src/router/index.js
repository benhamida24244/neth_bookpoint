import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path:'/',
      name:'Main Page',
      component: () => import('@/Layout/DefaultLayout.vue'),
      children:[
        {
      path: '',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path:'about',
      name:'About',
      component: () => import('@/views/AboutView.vue'),
    },
    {
      path:'shop',
      name:'shop',
      component:() => import('@/views/ShopView.vue'),
    },
    {
    path:'authors',
    name:'Authors',
    component:() => import('@/views/Authors/AuthorsView.vue'),
    },
    {
      path:'authors/:id',
      name:'public Authors info',
      component:() => import('@/views/Authors/SingleAuthorPage.vue'),
    },
    {
      path:'delivery-theme',
      name:'Delivery Theme',
      component:() => import('@/views/Delivery_theme.vue'),
    },
    {
      path:'contact',
      name:'Contact Us',
      component: () => import('@/views/ContactView.vue'),
    },
    {
      path: '/cart',
      name: 'Cart',
      component: () => import('@/views/CartView.vue'),
    },
    {
      path: '/checkout',
      name: 'Checkout',
      component: () => import('@/views/CheckOutPageView.vue'),
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('../views/ProfileView.vue'),
    },
    {
      path: '/book/:id',
      name: 'BookDetails',
      component: () => import('@/views/BookDetailsView.vue'),
    },
    {
      path: '/payment-success',
      name: 'PaymentSuccess',
      component: () => import('@/views/PaymentSuccess.vue'),
    }
      ]
    },
    {
      path:'/dashboard',
      name:'Dashboard Home',
      component:() => import('@/Layout/DashboardLayout.vue'),
      children:[
        {path:'', name:'Home Dashboard' , component:() => import('@/views/Dashboard/DashboardHome.vue')},
        {path:'orders', name:'Orders page' , component:() => import('@/views/Dashboard/Orders.vue')},
        {path:'orders/:id', name:'Orders Info' , component:() => import('@/views/Dashboard/OrderDetails.vue')},
        {path:'clients', name:'clients page' , component:() => import('@/views/Dashboard/ClientDash.vue')},
        {path:'clients/:id', name:'clients Info' , component:() => import('@/views/Dashboard/ClientInfo.vue')},
        {path:'books', name:'Books page' , component:() => import('@/views/Dashboard/Books.vue')},
        {path:'books/:id', name:'Books info' , component:() => import('@/views/Dashboard/BookDetails.vue')},
        {path:'categories', name:'Categories page' , component:() => import('@/views/Dashboard/Categories.vue')},
        {path:'categories/:id', name:'Categories info' , component:() => import('@/views/Dashboard/CategoriesInfo.vue')},
        {path:'authors', name:'Authors page' , component:() => import('@/views/Dashboard/Authors.vue')},
        {path:'authors/:id', name:'dashboard Authors info' , component:() => import('@/views/Dashboard/AuthorDetails.vue')},
        {path:'settings', name:'Settings page' , component:() => import('@/views/Dashboard/SettingsPage.vue')},
        {path:'publishing-house', name:'Publishing House page' , component:() => import('@/views/Dashboard/publishing-house.vue')},
        {path:'publishing-house/:id', name:'Publishing House Info' , component:() => import('@/views/Dashboard/PHouseDetails.vue')},

      ]

    },
    {
      path:'/:pathMatch(.*)*',
      name:'Not Found',
      component:() => import('@/Layout/NotFound.vue')
    }
  ],
})

export default router
