import { defineStore } from 'pinia';
import apiClient from '../api';

export const useUserStore = defineStore('users', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('authToken') || null,
    isAuthenticated: !!localStorage.getItem('authToken'),
  }),
  getters: {
    isLoggedIn: (state) => state.isAuthenticated,
    currentUser: (state) => state.user,
    isAdmin: (state) => state.user && state.user.role === 'admin',
  },
  actions: {
    setAuthData(user, token) {
      this.user = user;
      this.token = token;
      this.isAuthenticated = true;
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('authToken', token);
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    },

    clearAuthData() {
      this.user = null;
      this.token = null;
      this.isAuthenticated = false;
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
      delete apiClient.defaults.headers.common['Authorization'];
    },

    async login(credentials) {
      const response = await apiClient.post('/login', credentials);
      const { user, token } = response.data;
      this.setAuthData(user, token);
    },

    async register(userInfo) {
      const response = await apiClient.post('/register', userInfo);
      const { user, token } = response.data;
      this.setAuthData(user, token);
    },

    async logout() {
      try {
        await apiClient.post('/logout');
      } catch (error) {
        console.error('Logout failed', error);
      } finally {
        this.clearAuthData();
      }
    },

    async fetchUser() {
      if (!this.token) return;
      try {
        const response = await apiClient.get('/profile');
        this.user = response.data;
        localStorage.setItem('user', JSON.stringify(response.data));
      } catch (error) {
        console.error('Failed to fetch user profile', error);
        this.clearAuthData(); // Clear data if token is invalid
      }
    }
  }
});
