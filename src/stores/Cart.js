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
      
      // إذا كان المستخدم مسجلاً، استخدم السلة من الخادم
      if (authStore.isAuthenticated) {
        if (!state.cart || !state.cart.items) return 0;
        return state.cart.items.reduce((total, item) => total + item.quantity, 0);
      }
      
      // إذا لم يكن المستخدم مسجلاً، استخدم السلة المحلية
      return state.localCart.reduce((total, item) => total + item.quantity, 0);
    },
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
    // تحميل السلة المحلية عند بدء التطبيق
    initializeLocalCart() {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        this.localCart = JSON.parse(savedCart);
      }
    },
    async fetchCart() {
      const authStore = useAuthStore();
      
      // إذا لم يكن المستخدم مسجلًا، لا تقم بجلب السلة من الخادم
      if (!authStore.isAuthenticated) {
        return;
      }
      
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
      const authStore = useAuthStore();
      
      try {
        // إذا كان المستخدم مسجلاً، أضف للسلة في الخادم
        if (authStore.isAuthenticated) {
          const response = await apiService.cart.add({ book_id: bookId, quantity });
          this.cart = response.data;
        } else {
          // إذا لم يكن المستخدم مسجلاً، أضف للسلة المحلية
          const existingItemIndex = this.localCart.findIndex(item => item.id === bookId);
          
          if (existingItemIndex !== -1) {
            // إذا كان الكتاب موجودًا بالفعل، قم بزيادة الكمية
            this.localCart[existingItemIndex].quantity += quantity;
          } else {
            // إذا كان الكتاب جديدًا، أضفه للسلة
            // سنحتاج إلى الحصول على تفاصيل الكتاب لإضافته للسلة المحلية
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
              console.error("Failed to fetch book details for local cart:", error);
              throw new Error("Failed to add item to cart. Could not fetch book details.");
            }
          }
          
          // تحديث السلة المحلية في localStorage
          localStorage.setItem('cart', JSON.stringify(this.localCart));
        }
      } catch (error) {
        // إذا كان الخطأ 401 (غير مصرح به) والمستخدم غير مسجل، فلا تظهر رسالة خطأ
        // لأن هذا سلوك متوقع للمستخدمين غير المسجلين
        if (error.response && error.response.status === 401 && !authStore.isAuthenticated) {
          console.log("User not authenticated, adding to local cart instead");
          // لا تظهر رسالة خطأ للمستخدمين غير المسجلين
        } else {
          this.error = error.response?.data?.message || 'Failed to add item to cart.';
          throw error;
        }
      } finally {
        this.loading = false;
      }
    },

    async updateQuantity(cartItemId, quantity) {
      this.loading = true;
      this.error = null;
      const authStore = useAuthStore();
      
      try {
        // إذا كان المستخدم مسجلاً، حدث الكمية في السلة في الخادم
        if (authStore.isAuthenticated) {
          const response = await apiService.cart.update(cartItemId, { quantity });
          this.cart = response.data;
        } else {
          // إذا لم يكن المستخدم مسجلاً، حدث الكمية في السلة المحلية
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
        this.loading = true;
        this.error = null;
        const authStore = useAuthStore();
        
        try {
            // إذا كان المستخدم مسجلاً، احذف من السلة في الخادم
            if (authStore.isAuthenticated) {
                const response = await apiService.cart.remove(cartItemId);
                this.cart = response.data;
            } else {
                // إذا لم يكن المستخدم مسجلاً، احذف من السلة المحلية
                this.localCart = this.localCart.filter(item => item.id !== cartItemId);
                localStorage.setItem('cart', JSON.stringify(this.localCart));
            }
        } catch (error) {
            this.error = error.response?.data?.message || 'Failed to remove item from cart.';
            throw error;
        } finally {
            this.loading = false;
        }
    },

    clearCart() {
      this.cart = null;
      this.localCart = [];
      localStorage.removeItem('cart');
    },
    
    // دالة لمزامنة السلة المحلية مع السلة في الخادم عند تسجيل المستخدم
    async syncLocalCart() {
      if (this.localCart.length === 0) return;
      
      const authStore = useAuthStore();
      if (!authStore.isAuthenticated) return;
      
      this.loading = true;
      this.error = null;
      
      try {
        // إضافة كل عناصر السلة المحلية إلى السلة في الخادم
        for (const item of this.localCart) {
          await apiService.cart.add({ book_id: item.id, quantity: item.quantity });
        }
        
        // مسح السلة المحلية بعد المزامنة
        this.localCart = [];
        localStorage.removeItem('cart');
        
        // إعادة تحميل السلة من الخادم
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
