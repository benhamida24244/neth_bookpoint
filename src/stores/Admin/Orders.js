import { defineStore } from 'pinia';
import apiService from '@/services/api';

export const useAdminOrdersStore = defineStore('adminOrders', {
  state: () => ({
    orders: [],
    order: null,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchOrders() {
      this.loading = true;
      this.error = null;
      try {
        const response = await apiService.admin.orders.all();
        this.orders = response.data.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch orders.';
      } finally {
        this.loading = false;
      }
    },

    async fetchOrder(orderId) {
        this.loading = true;
        this.error = null;
        try {
            const response = await apiService.admin.orders.get(orderId);
            this.order = response.data.data;
        } catch (error) {
            this.error = error.response?.data?.message || 'Failed to fetch order.';
        } finally {
            this.loading = false;
        }
    },

    async updateOrderStatus(orderId, status) {
        this.loading = true;
        this.error = null;
        try {
            const response = await apiService.admin.orders.update(orderId, { status });
            // Update the order in the local state
            const index = this.orders.findIndex(o => o.id === orderId);
            if (index !== -1) {
                this.orders[index] = response.data.data;
            }
            if (this.order && this.order.id === orderId) {
                this.order = response.data.data;
            }
        } catch (error) {
            this.error = error.response?.data?.message || 'Failed to update order status.';
            throw error;
        } finally {
            this.loading = false;
        }
    },
  },
});
