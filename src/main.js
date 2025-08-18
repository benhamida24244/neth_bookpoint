import './assets/main.css'
import 'primeicons/primeicons.css'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'


import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { MotionPlugin } from '@vueuse/motion'
import i18n from './i18n'

const app = createApp(App)

import { useUserStore } from './stores/Users'

app.use(createPinia())

// Fetch user profile if token exists
const userStore = useUserStore()
if (userStore.isLoggedIn) {
  userStore.fetchUser()
}

app.use(router)
app.use(MotionPlugin)
app.use(i18n)
app.mount('#app')
