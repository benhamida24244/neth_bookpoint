import { defineStore } from 'pinia'
import apiService from '@/services/api.js'

export const useCustomerAuthStore = defineStore('customerAuth', {
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
        const { customer_token, user } = response.data; // Assuming the API returns token and user data

        this.token = customer_token;
        this.user = user;
        this.isAuthenticated = true;
        localStorage.setItem('customer_token', customer_token);
        // Also set the role for the router guard if needed
        localStorage.setItem('role', 'customer');

        return true;
      } catch (error) {
        this.logout(); // Ensure state is clean after a failed login
        console.error('Customer login failed:', error);
        return false;
      }
    },
    async loginWithGoogle(queryString) {
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
    console.error("Google login failed:", error);
    return false;
  }
    },
    async register(credentials) {
      try {
        const response = await apiService.customer.register(credentials);
        const { customer_token, user } = response.data; // Assuming the API returns token and user data

        this.token = customer_token;
        this.user = user;
        this.isAuthenticated = true;
        localStorage.setItem('customer_token', customer_token);
        // Also set the role for the router guard if needed
        localStorage.setItem('role', 'customer');

        return true;
      } catch (error) {
        this.logout(); // Ensure state is clean after a failed registration
        console.error('Customer register failed:', error);
        return false;
      }
    },
    async logout() {
      try {
        // Ask the server to invalidate the token, but don't block client-side cleanup
        await apiService.customer.logout();
      } catch (error) {
        console.error("Customer logout failed on server:", error);
      } finally {
        // Always clear client-side state
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
        this.user = response.data.data; // Assuming user data is in response.data.data
        this.isAuthenticated = true; // User is confirmed to be authenticated
      } catch (error) {
        console.error('Failed to fetch customer profile:', error);
        // If fetching profile fails, it might mean the token is invalid
        this.logout();
      }
    },
    async tryAutoLogin() {
        if (this.token) {
            // Token exists, try to fetch user profile to validate it
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
        console.error('Failed to update customer profile:', error);
        return false;
      }
    }
  }
})
