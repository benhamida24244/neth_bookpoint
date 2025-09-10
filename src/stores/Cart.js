import { defineStore } from 'pinia';
import apiService from '@/services/api';
import { useAuthStore } from './Auth';

export const useCartStore = defineStore('cart', {
  state: () => ({
    cart: null,
    loading: false,
    error: null,
    localCart: JSON.parse(localStorage.getItem('cart')) || [], // تخزين السلة محلياً
  }),

  getters: {
   cartCount: (state) => {
  const authStore = useAuthStore();

  if (authStore.isAuthenticated) {
    if (!state.cart || !state.cart.items) return 0;
    const count = state.cart.items.reduce((total, item) => total + item.quantity, 0);
    console.log("📊 cartCount (server):", count);
    return count;
  }

  const count = state.localCart.reduce((total, item) => total + item.quantity, 0);
  console.log("📊 cartCount (local):", count, state.localCart);
  return count;
}
,
    cartItems: (state) => {
      const authStore = useAuthStore();
      
      // إذا كان المستخدم مسجلاً، استخدم السلة من الخادم
      if (authStore.isAuthenticated) {
        return state.cart?.items || [];
      }
      
      // إذا لم يكن المستخدم مسجلاً، استخدم السلة المحلية
      return state.localCart;
    },
    cartTotal: (state) => {
      const authStore = useAuthStore();
      
      // إذا كان المستخدم مسجلاً، استخدم السلة من الخادم
      if (authStore.isAuthenticated) {
        if (!state.cart || !state.cart.items) return 0;
        return state.cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
      }
      
      // إذا لم يكن المستخدم مسجلاً، استخدم السلة المحلية
      return state.localCart.reduce((total, item) => total + item.price * item.quantity, 0);
    }
  },

  actions: {
    initializeLocalCart() {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        this.localCart = JSON.parse(savedCart);
      }
    },
    async fetchCart() {
      const authStore = useAuthStore();
      if (!authStore.isAuthenticated) {
        return;
      }
      this.loading = true;
      this.error = null;
      try {
        const response = await apiService.cart.show();
        this.cart = response.data.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch cart.';
        if (error.response && error.response.status === 404) {
          this.cart = { items: [], total: 0 };
        }
      } finally {
        this.loading = false;
      }
    },

    async addToCart(bookId, quantity) {
      const authStore = useAuthStore();
      if (!authStore.isAuthenticated) {
        // Logic for guest user remains the same
        this.loading = true;
        const existingItem = this.localCart.find(item => item.id === bookId);
        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          try {
            const bookResponse = await apiService.publicResources.books.get(bookId);
            const book = bookResponse.data;
            this.localCart.push({
              id: book.id,
              title: book.title,
              price: book.price,
              cover: book.cover,
              author: book.author.name,
              quantity: quantity
            });
          } catch (error) {
            this.error = 'Failed to fetch book details.';
            console.error(error);
            this.loading = false;
            return;
          }
        }
        localStorage.setItem('cart', JSON.stringify(this.localCart));
        this.loading = false;
        return;
      }

      // Optimistic update for authenticated user
      if (!this.cart) this.cart = { items: [], total: 0 };
      const originalCart = JSON.parse(JSON.stringify(this.cart));

      const itemIndex = this.cart.items.findIndex(item => item.book_id === bookId);
      if (itemIndex > -1) {
        this.cart.items[itemIndex].quantity += quantity;
      } else {
        this.cart.items.push({ book_id: bookId, quantity: quantity, price: 0, book: { title: 'Adding...' } });
      }

      try {
        await apiService.cart.add({ book_id: bookId, quantity });
        await this.fetchCart(); // Refetch the cart for consistency
      } catch (error) {
        console.error("❌ addToCart failed", error);
        this.error = error.response?.data?.message || 'Failed to add item to cart.';
        this.cart = originalCart; // Revert on failure
        throw error;
      }
    },

    async updateQuantity(cartItemId, quantity) {
      // ... (keeping original for now, can be improved later if needed)
      this.loading = true;
      this.error = null;
      const authStore = useAuthStore();
      
      try {
        if (authStore.isAuthenticated) {
          await apiService.cart.update(cartItemId, { quantity });
          await this.fetchCart();
        } else {
          const itemIndex = this.localCart.findIndex(item => item.id === cartItemId);
          if (itemIndex !== -1) {
            this.localCart[itemIndex].quantity = quantity;
            localStorage.setItem('cart', JSON.stringify(this.localCart));
          } else {
            throw new Error('Item not found in local cart.');
          }
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to update item quantity.';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async removeFromCart(cartItemId) {
      const authStore = useAuthStore();
      if (!authStore.isAuthenticated) {
        this.localCart = this.localCart.filter(item => item.id !== cartItemId);
        localStorage.setItem('cart', JSON.stringify(this.localCart));
        return;
      }

      if (!this.cart || !this.cart.items) return;

      const originalCart = JSON.parse(JSON.stringify(this.cart));
      const itemIndex = this.cart.items.findIndex(item => item.id === cartItemId);

      if (itemIndex === -1) return; // Item not found

      this.cart.items.splice(itemIndex, 1); // Optimistic removal

      try {
        await apiService.cart.remove(cartItemId);
        await this.fetchCart(); // Refetch for consistency
      } catch (error) {
        console.error("❌ removeFromCart failed", error);
        this.error = error.response?.data?.message || 'Failed to remove item from cart.';
        this.cart = originalCart; // Revert on failure
        throw error;
      }
    },

    async clearCart() {
      const authStore = useAuthStore();
      if (authStore.isAuthenticated) {
        try {
          await apiService.cart.clear();
          await this.fetchCart(); // Refetch for consistency
        } catch (error) {
          this.error = error.response?.data?.message || 'Failed to clear cart.';
          throw error;
        }
      }
      this.cart = null;
      this.localCart = [];
      localStorage.removeItem('cart');
    },
    
    async syncLocalCart() {
      if (this.localCart.length === 0) return;
      const authStore = useAuthStore();
      if (!authStore.isAuthenticated) return;
      
      this.loading = true;
      this.error = null;
      try {
        for (const item of this.localCart) {
          await apiService.cart.add({ book_id: item.id, quantity: item.quantity });
        }
        this.localCart = [];
        localStorage.removeItem('cart');
        await this.fetchCart();
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to sync local cart.';
        throw error;
      } finally {
        this.loading = false;
      }
    }
  }
});
