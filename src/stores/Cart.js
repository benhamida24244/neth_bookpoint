import { defineStore } from 'pinia';
import apiService from '@/services/api';

export const useCartStore = defineStore('cart', {
  state: () => ({
    cart: null,
    loading: false,
    error: null,
  }),

  getters: {
    cartCount: (state) => {
      if (!state.cart || !state.cart.items) return 0;
      return state.cart.items.reduce((total, item) => total + item.quantity, 0);
    },
    cartItems: (state) => state.cart?.items || [],
    cartTotal: (state) => {
        if (!state.cart || !state.cart.items) return 0;
        return state.cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
    }
  },

  actions: {
    async fetchCart() {
      this.loading = true;
      this.error = null;
      try {
        const response = await apiService.cart.show();
        this.cart = response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch cart.';
        // If the cart is empty (404), we can set it to a default empty state
        if (error.response && error.response.status === 404) {
            this.cart = { items: [], total: 0 };
        }
      } finally {
        this.loading = false;
      }
    },

    async addToCart(bookId, quantity) {
      this.loading = true;
      this.error = null;
      try {
        const response = await apiService.cart.add({ book_id: bookId, quantity });
        this.cart = response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to add item to cart.';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateQuantity(cartItemId, quantity) {
      this.loading = true;
      this.error = null;
      try {
        const response = await apiService.cart.update(cartItemId, { quantity });
        this.cart = response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to update item quantity.';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async removeFromCart(cartItemId) {
        this.loading = true;
        this.error = null;
        try {
            const response = await apiService.cart.remove(cartItemId);
            this.cart = response.data;
        } catch (error) {
            this.error = error.response?.data?.message || 'Failed to remove item from cart.';
            throw error;
        } finally {
            this.loading = false;
        }
    },

    clearCart() {
      this.cart = null;
    }
  }
});
