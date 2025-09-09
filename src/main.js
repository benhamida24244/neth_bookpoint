import './assets/main.css';
import 'primeicons/primeicons.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'vue-toastification/dist/index.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import { MotionPlugin } from '@vueuse/motion';
import i18n from './i18n';
import { useCartStore } from './stores/Cart';
import Toast from 'vue-toastification';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(MotionPlugin);
app.use(i18n);
app.use(Toast, {
  transition: "Vue-Toastification__bounce",
  maxToasts: 20,
  newestOnTop: true
});

// تحميل السلة المحلية عند بدء التطبيق
const cartStore = useCartStore();
cartStore.initializeLocalCart();

app.mount('#app');

