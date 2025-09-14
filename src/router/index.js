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
        {
          path: 'authors',
          name: 'Authors',
          component: () => import('@/views/Authors/AuthorsView.vue'),
        },
        {
          path: 'authors/:id',
          name: 'public Authors info',
          component: () => import('@/views/Authors/SingleAuthorPage.vue'),
        },
        {
          path: 'category/:id',
          name: 'public Category info',
          component: () => import('@/views/Category/SingleCategoryPage.vue'),
        },
        {
          path: '/publishing-house/:id',
          name: 'public Publishing House info',
          component: () => import('@/views/Publishing/SinglePublishingHousePage.vue'),
        },
        {
          path: 'delivery-theme',
          name: 'Delivery Theme',
          component: () => import('@/views/Delivery_theme.vue'),
        },
        { path: 'contact', name: 'Contact Us', component: () => import('@/views/ContactView.vue') },
        { path: '/cart', name: 'Cart', component: () => import('@/views/CartView.vue') },
        {
          path: '/checkout',
          name: 'Checkout',
          component: () => import('@/views/CheckOutPageView.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: '/profile',
          name: 'Profile',
          component: () => import('../views/ProfileView.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: '/book/:id',
          name: 'BookDetails',
          component: () => import('@/views/BookDetailsView.vue'),
        },
        {
          path: '/paypal-success',
          name: 'PaymentSuccess',
          component: () => import('@/views/PaymentSuccess.vue'),
          props: (route) => ({ customer: route.query.customer, token: route.query.payment_token }),
        },
        {
          path: '/paypal/success',
          name: 'PayPalSuccess',
          component: () => import('@/views/PaymentSuccess.vue'),
        },
        {
          path: '/paypal/cancel',
          name: 'PayPalCancel',
          component: () => import('@/views/PaymentCancel.vue'),
        },
        { path: '/login', name: 'Login', component: () => import('@/views/Auth/LoginView.vue') },
        {
          path: '/register',
          name: 'Register',
          component: () => import('@/views/Auth/RegisterView.vue'),
        },
      ],
    },
    {
      path: '/google/callback',
      name: 'googleCallback',
      component: () => import('@/views/GoogleCallback.vue'),
    },
    // 🛡️ Dashboard Routes
    {
      path: '/dashboard',
      name: 'Dashboard Home',
      component: () => import('@/Layout/DashboardLayout.vue'),
      meta: { requiresAuth: true, requiresAdmin: true }, // 🛑 الحماية
      children: [
        {
          path: '',
          name: 'Home Dashboard',
          component: () => import('@/views/Dashboard/DashboardHome.vue'),
        },
        {
          path: 'orders',
          name: 'Orders page',
          component: () => import('@/views/Dashboard/Orders.vue'),
        },
        {
          path: 'orders/:id',
          name: 'Orders Info',
          component: () => import('@/views/Dashboard/OrderDetails.vue'),
        },
        {
          path: 'clients',
          name: 'clients page',
          component: () => import('@/views/Dashboard/ClientDash.vue'),
        },
        {
          path: 'clients/:id',
          name: 'clients Info',
          component: () => import('@/views/Dashboard/ClientInfo.vue'),
        },
        {
          path: 'books',
          name: 'Books page',
          component: () => import('@/views/Dashboard/Books.vue'),
        },
        {
          path: 'books/:id',
          name: 'Books info',
          component: () => import('@/views/Dashboard/BookDetails.vue'),
        },
        {
          path: 'categories',
          name: 'Categories page',
          component: () => import('@/views/Dashboard/Categories.vue'),
        },
        {
          path: 'categories/:id',
          name: 'Categories info',
          component: () => import('@/views/Dashboard/CategoriesInfo.vue'),
        },
        {
          path: 'categories/edit/:id',
          name: 'Edit Category',
          component: () => import('@/views/Dashboard/EditCategory.vue'),
        },
        {
          path: 'authors',
          name: 'Authors page',
          component: () => import('@/views/Dashboard/AuthorsView.vue'),
        },
        {
          path: 'authors/:id',
          name: 'dashboard Authors info',
          component: () => import('@/views/Dashboard/AuthorDetails.vue'),
        },
        {
          path: 'settings',
          name: 'Settings page',
          component: () => import('@/views/Dashboard/SettingsPage.vue'),
        },
        {
          path: 'publishing-house',
          name: 'Publishing House page',
          component: () => import('@/views/Dashboard/publishing-house.vue'),
        },
        {
          path: 'publishing-house/:id',
          name: 'Publishing House Info',
          component: () => import('@/views/Dashboard/PHouseDetails.vue'),
        },
      ],
    },

    // 🛑 صفحة تسجيل دخول الأدمن
    {
      path: '/loginAdmin',
      name: 'Admin Login',
      component: () => import('@/views/Auth/LoginAdmin.vue'),
    },

    // 🛑 صفحة Not Found
    {
      path: '/:pathMatch(.*)*',
      name: 'Not Found',
      component: () => import('@/Layout/NotFound.vue'),
    },
  ],
})

router.beforeEach((to, from, next) => {
  const adminToken = localStorage.getItem('token')
  const customerToken = localStorage.getItem('customer_token')
  const role = localStorage.getItem('role')

  // --- Redirect logged-in users from login pages ---
  if (to.path === '/loginAdmin' && adminToken && role === 'admin') {
    return next('/dashboard')
  }
  if (to.path === '/login' && customerToken) {
    return next('/profile')
  }

  // --- Handle protected routes ---
  if (to.meta.requiresAuth) {
    // Admin-specific routes
    if (to.meta.requiresAdmin) {
      if (adminToken && role === 'admin') {
        return next() // Allowed
      } else {
        return next('/loginAdmin') // Not an admin, redirect to admin login
      }
    }
    // Customer-specific routes
    else {
      if (customerToken) {
        return next() // Allowed
      } else {
        return next('/login') // Not a customer, redirect to customer login
      }
    }
  }

  // --- Handle admin routes for non-admins ---
  // This case is partly covered above, but as a fallback:
  if (to.matched.some((record) => record.meta.requiresAdmin) && role !== 'admin') {
    return next('/')
  }

  // If no special conditions, proceed
  return next()
})

export default router
