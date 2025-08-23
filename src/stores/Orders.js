import { defineStore } from 'pinia';
import apiService from '@/services/api';
import { useCartStore } from './Cart';

export const useOrdersStore = defineStore('orders', {
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

    async createOrder() {
      this.loading = true;
      this.error = null;
      try {
        const response = await apiService.orders.create();
        const cartStore = useCartStore();
        cartStore.clearCart(); // Clear the cart after successful order creation
        return response.data.data; // Return the newly created order
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to create order.';
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});
