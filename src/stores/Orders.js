import { defineStore } from "pinia";
import apiService from "@/services/api.js";

export const useOrdersStore = defineStore("orders", {
  state: () => ({
    orders: [],
    selectedOrder: null,
    loading: false,
    error: null,
  }),
  actions: {
    async fetchOrders() {
      this.loading = true;
      this.error = null;
      try {
        const response = await apiService.getAdminOrders();
        this.orders = response.data.data;
      } catch (error) {
        this.error = "Failed to fetch orders.";
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    async fetchOrder(orderId) {
      this.loading = true;
      this.error = null;
      try {
        const response = await apiService.getAdminOrder(orderId);
        this.selectedOrder = response.data.data;
      } catch (error) {
        this.error = "Failed to fetch order.";
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    async updateOrder(orderId, orderData) {
      this.loading = true;
      this.error = null;
      try {
        const response = await apiService.updateAdminOrder(
          orderId,
          orderData
        );
        await this.fetchOrders();
        return response.data;
      } catch (error) {
        this.error = "Failed to update order.";
        console.error(error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async deleteOrder(orderId) {
      this.loading = true;
      this.error = null;
      try {
        await apiService.adminDeleteOrder(orderId);
        this.orders = this.orders.filter(
          (order) => order.id !== orderId
        );
      } catch (error) {
        this.error = "Failed to delete order.";
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
  },
});
