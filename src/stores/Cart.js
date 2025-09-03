import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    cart: [],
  }),

  getters: {
    cartCount: (state) =>
      state.cart.reduce((total, item) => total + item.quantity, 0),
  },

  actions: {
    addToCart(book) {
      const existingItem = this.cart.find(item => item.id === book.id)
      if (existingItem) {
        existingItem.quantity += 1
      } else {
        this.cart.push({ ...book, quantity: 1 })
      }
    },

    removeFromCart(bookId) {
      const index = this.cart.findIndex(item => item.id === bookId)
      if (index !== -1) {
        if (this.cart[index].quantity > 1) {
          this.cart[index].quantity -= 1
        } else {
          this.cart.splice(index, 1)
        }
      }
    },

    updateQuantity(bookId, quantity) {
      const item = this.cart.find(item => item.id === bookId)
      if (item) {
        item.quantity = quantity
      }
    },

    clearCart() {
      this.cart = []
    }
  }
})
