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
    latestOrder: (state) => {
      return state.orders.length > 0 ? state.orders[state.orders.length - 1] : null;
    },
  },
  actions: {
    async fetchOrders() {
      this.loading = true;
      this.error = null;
      try {
        const response = await apiService.orders.all();
        this.orders = response.data.data; // Assuming the API returns data in a 'data' property
      } catch (error) {
        this.error = 'Failed to fetch orders.';
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    async createOrder(paymentMethod) {
      this.loading = true;
      this.error = null;
      try {
        const response = await apiService.orders.create({
          payment_method: paymentMethod,
        });

        const cartStore = useCartStore();
        cartStore.clearCart(); // Clear the cart after successful order creation

        // The component will handle the response (e.g., redirect or payment confirmation)
        return response.data;
      } catch (error) {
        this.error = 'Failed to create order.';
        console.error('Order creation error:', error.response?.data || error.message);
        throw error; // Re-throw to be caught by the component
      } finally {
        this.loading = false;
      }
    },

    // Action to handle successful payment and update order status locally
    finalizeOrder(order) {
      this.orders.unshift(order); // Add new order to the beginning of the list
    },

    async fetchOrder(orderId) {
      this.loading = true;
      this.error = null;
      try {
        // Check if order already exists
        const existingOrder = this.orders.find(o => o.id === orderId);
        if (existingOrder) {
          return existingOrder;
        }
        // If not, fetch from API
        const response = await apiService.orders.get(orderId);
        // Add to store if not already present
        if (!this.orders.some(o => o.id === response.data.data.id)) {
            this.orders.unshift(response.data.data);
        }
        return response.data.data;
      } catch (error) {
        this.error = 'Failed to fetch order details.';
        console.error(error);
        return null;
      } finally {
        this.loading = false;
      }
    }
  },
});
