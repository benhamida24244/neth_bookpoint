import { defineStore } from 'pinia';
import apiService from '@/services/api';

export const useCustomerOrdersStore = defineStore('customerOrders', {
  state: () => ({
    orders: [],
    loading: false,
    error: null,
  }),

  getters: {
    getRecentOrders: (state) => state.orders.slice(-5),
  },

  actions: {
    async fetchOrders() {
      this.loading = true;
      this.error = null;
      try {
        const response = await apiService.orders.all();
        this.orders = response.data.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch orders.';
      } finally {
        this.loading = false;
      }
    },

    async createOrder(data) {
      this.loading = true;
      this.error = null;
      try {
        const response = await apiService.orders.create(data);
        this.orders.unshift(response.data.data);
        return response.data.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to create order.';
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});
