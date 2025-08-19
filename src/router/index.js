import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Main Page',
      component: () => import('@/Layout/DefaultLayout.vue'),
      children: [
        { path: '', name: 'home', component: () => import('../views/HomeView.vue') },
        { path: 'about', name: 'About', component: () => import('@/views/AboutView.vue') },
        { path: 'shop', name: 'shop', component: () => import('@/views/ShopView.vue') },
        { path: 'authors', name: 'Authors', component: () => import('@/views/Authors/AuthorsView.vue') },
        { path: 'authors/:id', name: 'public Authors info', component: () => import('@/views/Authors/SingleAuthorPage.vue') },
        { path: 'delivery-theme', name: 'Delivery Theme', component: () => import('@/views/Delivery_theme.vue') },
        { path: 'contact', name: 'Contact Us', component: () => import('@/views/ContactView.vue') },
        { path: '/cart', name: 'Cart', component: () => import('@/views/CartView.vue') },
        { path: '/checkout', name: 'Checkout', component: () => import('@/views/CheckOutPageView.vue'), meta: { requiresAuth: true } },
        { path: '/profile', name: 'Profile', component: () => import('../views/ProfileView.vue'), meta: { requiresAuth: true } },
        { path: '/book/:id', name: 'BookDetails', component: () => import('@/views/BookDetailsView.vue') },
        { path: '/payment-success', name: 'PaymentSuccess', component: () => import('@/views/PaymentSuccess.vue') },
        { path: '/login', name: 'Login', component: () => import('@/views/Auth/LoginView.vue') },
        { path: '/register', name: 'Register', component: () => import('@/views/Auth/RegisterView.vue') }
      ]
    },

    // 🛡️ Dashboard Routes
    {
      path: '/dashboard',
      name: 'Dashboard Home',
      component: () => import('@/Layout/DashboardLayout.vue'),
      meta: { requiresAuth: true, requiresAdmin: true }, // 🛑 الحماية
      children: [
        { path: '', name: 'Home Dashboard', component: () => import('@/views/Dashboard/DashboardHome.vue') },
        { path: 'orders', name: 'Orders page', component: () => import('@/views/Dashboard/Orders.vue') },
        { path: 'orders/:id', name: 'Orders Info', component: () => import('@/views/Dashboard/OrderDetails.vue') },
        { path: 'clients', name: 'clients page', component: () => import('@/views/Dashboard/ClientDash.vue') },
        { path: 'clients/:id', name: 'clients Info', component: () => import('@/views/Dashboard/ClientInfo.vue') },
        { path: 'books', name: 'Books page', component: () => import('@/views/Dashboard/Books.vue') },
        { path: 'books/:id', name: 'Books info', component: () => import('@/views/Dashboard/BookDetails.vue') },
        { path: 'categories', name: 'Categories page', component: () => import('@/views/Dashboard/Categories.vue') },
        { path: 'categories/:id', name: 'Categories info', component: () => import('@/views/Dashboard/CategoriesInfo.vue') },
        { path: 'authors', name: 'Authors page', component: () => import('@/views/Dashboard/Authors.vue') },
        { path: 'authors/:id', name: 'dashboard Authors info', component: () => import('@/views/Dashboard/AuthorDetails.vue') },
        { path: 'settings', name: 'Settings page', component: () => import('@/views/Dashboard/SettingsPage.vue') },
        { path: 'publishing-house', name: 'Publishing House page', component: () => import('@/views/Dashboard/publishing-house.vue') },
        { path: 'publishing-house/:id', name: 'Publishing House Info', component: () => import('@/views/Dashboard/PHouseDetails.vue') }
      ]
    },

    // 🛑 صفحة تسجيل دخول الأدمن
    {
      path: '/loginAdmin',
      name: 'Admin Login',
      component: () => import('@/views/Auth/LoginAdmin.vue')
    },

    // 🛑 صفحة Not Found
    {
      path: '/:pathMatch(.*)*',
      name: 'Not Found',
      component: () => import('@/Layout/NotFound.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')

  // ✅ إذا أدمن وحاول يفتح صفحة تسجيل الدخول → Dashboard مباشرة
  if (to.path === '/loginAdmin' && token && role === 'admin') {
    return next('/dashboard')
  }

  if (to.meta.requiresAuth && !token) {
    if (to.meta.requiresAdmin) {
      return next('/loginAdmin')
    } else {
      return next('/login')
    }
  } else if (to.meta.requiresAdmin && role !== 'admin') {
    return next('/')
  } else {
    return next()
  }
})


export default router
