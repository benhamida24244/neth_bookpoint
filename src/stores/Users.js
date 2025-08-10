import { defineStore } from 'pinia'

export const useUserStore = defineStore('users', {
  state: () => ({
    user: {
      name: 'Admin',
      email: 'admin@example.com',
      address: '123 Main St, Anytown, USA',
    },
    isAuthenticated: true,
  }),
  getters: {
    isLoggedIn: (state) => state.isAuthenticated,
    currentUser: (state) => state.user,
  },
})
