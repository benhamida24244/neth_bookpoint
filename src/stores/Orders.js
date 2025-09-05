import { defineStore } from 'pinia'
import apiService from '@/services/api.js'

export const useOrdersStore = defineStore('orders', {
  state: () => ({
    orders: [],
    loading: false,
    error: null,
    role: localStorage.getItem('role') || 'customer',
    // نخزّن الدور في localStorage عند تسجيل الدخول
  }),

  getters: {
    latestOrder: (state) => {
      return state.orders.length > 0 ? state.orders[state.orders.length - 1] : null
    },
    getRecentOrders: (state) => {
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
        let response;
        if (this.role === 'admin') {
          response = await apiService.adminOrders.all();
        } else {
          response = await apiService.customerOrders.all();
        }

        this.orders = response.data.data || [];
      } catch (error) {
        this.error = 'Failed to fetch orders.';
        console.error(this.error, error);
        this.orders = [];
      } finally {
        this.loading = false;
      }
    },

    async createOrder(orderData) {
      if (this.role === 'admin') {
        throw new Error("Admins cannot create orders from here.");
      }

      this.loading = true;
      this.error = null;
      try {
        const response = await apiService.customerOrders.create(orderData);
        this.orders.unshift(response.data.data);
        return response.data.data;
      } catch (error) {
        this.error = 'Failed to create order.';
        console.error(this.error, error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateOrder(id, data) {
      if (this.role !== 'admin') {
        throw new Error("Only admins can update orders.");
      }
      try {
        const response = await apiService.adminOrders.update(id, data);
        // تحديث محلي للطلب
        const index = this.orders.findIndex(o => o.id === id);
        if (index !== -1) this.orders[index] = response.data.data;
        return response.data.data;
      } catch (error) {
        console.error("Failed to update order.", error);
        throw error;
      }
    }
  }
});
