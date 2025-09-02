import { defineStore } from 'pinia'
import apiService from '@/services/api.js'

export const useOrdersStore = defineStore('orders', {
  state: () => ({
    orders: [],
    loading: false,
    error: null
  }),
  getters: {
    latestOrder: (state) => {
      return state.orders.length > 0 ? state.orders[state.orders.length - 1] : null
    },
    getRecentOrders: (state) => {
      // Sort by date to get the most recent ones, assuming 'created_at' or 'date' field
      return [...state.orders]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5)
    }
  },
  actions: {
    async fetchOrders() {
      this.loading = true;
      this.error = null;
      try {
        const response = await apiService.orders.all();
        // The backend likely returns orders in a 'data' property
        this.orders = response.data.data || [];
      } catch (error) {
        this.error = 'Failed to fetch orders.';
        console.error(this.error, error);
        this.orders = []; // Reset on error
      } finally {
        this.loading = false;
      }
    },

    async createOrder(orderData) {
      this.loading = true;
      this.error = null;
      try {
        const response = await apiService.orders.create(orderData);
        // Add the newly created order to the state
        this.orders.unshift(response.data.data); // Assuming the created order is returned
        return response.data.data;
      } catch (error) {
        this.error = 'Failed to create order.';
        console.error(this.error, error);
        throw error; // Re-throw to be handled in the component
      } finally {
        this.loading = false;
      }
    }
  }
})
