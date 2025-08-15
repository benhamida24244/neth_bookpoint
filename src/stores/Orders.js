import { defineStore } from 'pinia'

export const useOrdersStore = defineStore('orders', {
  state: () => ({
    orders: []
  }),
  getters: {
    latestOrder: (state) => {
      return state.orders.length > 0 ? state.orders[state.orders.length - 1] : null
    },
    getRecentOrders: (state) => {
      return state.orders.slice(-5)
    }
  },
  actions: {
    addOrder(orderData) {
      const newOrder = {
        id: this.orders.length + 1,
        date: new Date().toISOString().slice(0, 10),
        status: 'Completed',
        ...orderData
      }
      this.orders.push(newOrder)
    }
  }
})
