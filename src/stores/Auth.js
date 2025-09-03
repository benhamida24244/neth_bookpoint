import { defineStore } from 'pinia';
import apiService from '@/services/api';
import router from '@/router';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
      token: localStorage.getItem('token') || null,
      error: null,
      loading: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    currentUser: (state) => state.user,
  },

  actions: {
    async login(credentials) {
      this.loading = true;
      this.error = null;
      try {
        const response = await apiService.auth.login(credentials);
        const { user, token } = response.data;
        this.user = user;
        this.token = token;
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);
          router.push('/');
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
        const { user, token } = response.data;
        this.user = user;
        this.token = token;
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);
          router.push('/');
      } catch (error) {
        this.error = error.response?.data?.message || 'An error occurred during registration.';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      router.push('/login');
    },
  },
});
