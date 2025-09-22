import { defineStore } from 'pinia'
import apiService from '@/services/api.js'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('customer_token') || null,
    isAuthenticated: false
  }),
  getters: {
    isLoggedIn: (state) => state.isAuthenticated,
    currentUser: (state) => state.user
  },
  actions: {
    async login(credentials) {
      try {
        const response = await apiService.customer.login(credentials);
        const { customer_token, user } = response.data;

        this.token = customer_token;
        this.user = user;
        this.isAuthenticated = true;
        localStorage.setItem('customer_token', customer_token);
        localStorage.setItem('role', 'customer');

        return true;
      } catch (error) {
        this.logout();
        console.error('Login failed:', error);
        return false;
      }
    },

    async register(userData) {
      try {
        const response = await apiService.customer.register(userData);
        const { customer_token, user } = response.data;

        this.token = customer_token;
        this.user = user;
        this.isAuthenticated = true;
        localStorage.setItem('customer_token', customer_token);
        localStorage.setItem('role', 'customer');

        return true;
      } catch (error) {
        console.error('Registration failed:', error);
        throw error;
      }
    },

    async logout() {
      try {
        await apiService.customer.logout();
      } catch (error) {
        console.error("Logout failed on server:", error);
      } finally {
        this.token = null;
        this.user = null;
        this.isAuthenticated = false;
        localStorage.removeItem('customer_token');
        localStorage.removeItem('role');
      }
    },

    async fetchProfile() {
      if (!this.token) return;

      try {
        const response = await apiService.customer.getProfile();
        this.user = response.data.data;
        this.isAuthenticated = true;
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        this.logout();
      }
    },

    async tryAutoLogin() {
      if (this.token) {
        await this.fetchProfile();
      }
    },

    async updateProfile(data) {
      if (!this.token) return;

      try {
        const response = await apiService.customer.updateProfile(data);
        this.user = response.data.data;
        return true;
      } catch (error) {
        console.error('Failed to update profile:', error);
        return false;
      }
    }
  }
})