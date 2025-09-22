import { defineStore } from 'pinia'
import apiService from '@/services/api.js'
import { useCartStore } from './Cart'

export const useCustomerAuthStore = defineStore('customerAuth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('customer_token') || null,
    isAuthenticated: false,
    isLoading: false,   // ✅ حالة التحميل
    error: null         // ✅ حالة الخطأ
  }),
  getters: {
    isLoggedIn: (state) => state.isAuthenticated,
    currentUser: (state) => state.user
  },
  actions: {
    async login(credentials) {
      this.isLoading = true
      this.error = null
      try {
        const response = await apiService.customer.login(credentials);
        const { customer_token, user } = response.data;

        this.token = customer_token;
        this.user = user;
        this.isAuthenticated = true;
        localStorage.setItem('customer_token', customer_token);
        localStorage.setItem('role', 'customer');

        const cartStore = useCartStore();
        await cartStore.syncLocalCart();

        return true;
      } catch (error) {
        this.logout();
        this.error = error.response?.data?.message || 'Login failed';
        console.error('Customer login failed:', error);
        return false;
      } finally {
        this.isLoading = false
      }
    },

    async loginWithGoogle(queryString) {
      this.isLoading = true
      this.error = null
      try {
        const response = await apiService.googleAuth.callback(queryString);
        const { customer_token, user } = response.data;

        this.token = customer_token;
        this.user = user;
        this.isAuthenticated = true;

        localStorage.setItem("customer_token", customer_token);
        localStorage.setItem("role", "customer");

        return true;
      } catch (error) {
        this.logout();
        this.error = error.response?.data?.message || 'Google login failed';
        console.error("Google login failed:", error);
        return false;
      } finally {
        this.isLoading = false
      }
    },

    async register(credentials) {
      this.isLoading = true
      this.error = null
      try {
        const response = await apiService.customer.register(credentials);
        const { customer_token, user } = response.data;

        this.token = customer_token;
        this.user = user;
        this.isAuthenticated = true;
        localStorage.setItem('customer_token', customer_token);
        localStorage.setItem('role', 'customer');

        return true;
      } catch (error) {
        this.logout();
        this.error = error.response?.data?.message || 'Register failed';
        console.error('Customer register failed:', error);
        return false;
      } finally {
        this.isLoading = false
      }
    },

    async fetchProfile() {
      if (!this.token) return;
      this.isLoading = true
      this.error = null
      try {
        const response = await apiService.customer.getProfile();
        this.user = response.data.data;
        this.isAuthenticated = true;
      } catch (error) {
        this.error = 'Failed to fetch profile';
        console.error('Failed to fetch customer profile:', error);
        this.logout();
      } finally {
        this.isLoading = false
      }
    },

    async tryAutoLogin() {
      if (this.token) {
        await this.fetchProfile();
      }
    },

    async updateProfile(data) {
      if (!this.token) return;
      this.isLoading = true
      this.error = null
      try {
        const response = await apiService.customer.updateProfile(data);
        this.user = response.data.data;
        return true;
      } catch (error) {
        this.error = 'Failed to update profile';
        console.error('Failed to update customer profile:', error);
        return false;
      } finally {
        this.isLoading = false
      }
    },

    async logout() {
      try {
        await apiService.customer.logout();
      } catch (error) {
        console.error("Customer logout failed on server:", error);
      } finally {
        this.token = null;
        this.user = null;
        this.isAuthenticated = false;
        this.isLoading = false;
        this.error = null;
        localStorage.removeItem('customer_token');
        localStorage.removeItem('role');
      }
    }
  }
})

