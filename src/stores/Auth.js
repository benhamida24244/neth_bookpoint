import { defineStore } from 'pinia';
import apiService from '@/services/api';
import router from '@/router';
import { useCartStore } from './Cart';

export const useAuthStore = defineStore('auth', {
  state: () => {
    // قراءة المستخدم من localStorage بشكل آمن
    const safeParse = (key) => {
      try {
        const value = localStorage.getItem(key);
        if (value && value !== 'undefined' && value !== 'null') {
          return JSON.parse(value);
        }
      } catch (e) {
        console.error(`Failed to parse ${key} from localStorage`, e);
        localStorage.removeItem(key);
      }
      return null;
    };

    return {
      user: safeParse('user'),
      token: localStorage.getItem('token') || null,
      customerToken: localStorage.getItem('customer_token') || null,
      role: localStorage.getItem('role') || null,
      error: null,
      loading: false,
    };
  },

  getters: {
    isAuthenticated: (state) => !!state.token || !!state.customerToken,
    currentUser: (state) => state.user,
    isAdmin: (state) => state.role === 'admin',
  },

  actions: {
    // حفظ آمن في localStorage
    saveSession(user, token, role, isCustomer = false) {
      if (user) localStorage.setItem('user', JSON.stringify(user));
      if (isCustomer) {
        localStorage.setItem('customer_token', token);
      } else {
        localStorage.setItem('token', token);
      }
      if (role) localStorage.setItem('role', role);
    },

    async login(credentials) {
      this.loading = true;
      this.error = null;
      try {
        const response = await apiService.auth.login(credentials);
        const { user, token, access_token, role } = response.data;

        this.user = user || null;
        this.token = token || access_token || null;
        this.role = role || user?.role || null;

        this.saveSession(this.user, this.token, this.role, false);

        if (this.role === 'admin') {
          router.push('/dashboard');
        } else {
          router.push('/');
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'An error occurred during login.';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async register(userData) {
      this.loading = true;
      this.error = null;
      try {
        const response = await apiService.auth.register(userData);
        const { user, token, access_token, role } = response.data;

        this.user = user || null;
        this.token = token || access_token || null;
        this.role = role || user?.role || null;

        this.saveSession(this.user, this.token, this.role, false);

        if (this.role === 'admin') {
          router.push('/dashboard');
        } else {
          router.push('/');
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'An error occurred during registration.';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async customerLogin(credentials) {
      this.loading = true;
      this.error = null;
      try {
        const response = await apiService.customerAuth.login(credentials);
        const { user, token, access_token, role } = response.data;

        this.user = user || null;
        this.customerToken = token || access_token || null;
        this.role = role || 'customer';

        this.saveSession(this.user, this.customerToken, this.role, true);
        
        // مزامنة السلة المحلية مع السلة في الخادم
        const cartStore = useCartStore();
        await cartStore.syncLocalCart();

        return true;
      } catch (error) {
        this.error = error.response?.data?.message || 'An error occurred during customer login.';
        return false;
      } finally {
        this.loading = false;
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      this.customerToken = null;
      this.role = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('customer_token');
      localStorage.removeItem('role');
      router.push('/login');
    },
  },
});
