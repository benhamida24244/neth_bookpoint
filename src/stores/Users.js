import { defineStore } from 'pinia'
import apiService from '@/services/api'
import { useRouter } from 'vue-router'

export const useUserStore = defineStore('users', {
  state: () => ({
    user: null,
    isAuthenticated: false,
    token: localStorage.getItem('token') || null,
    role: localStorage.getItem('role') || null,
  }),
  getters: {
    isLoggedIn: (state) => state.isAuthenticated,
    currentUser: (state) => state.user,
    isAdmin: (state) => state.role === 'admin',
  },
  actions: {
    async login(credentials) {
      const response = await apiService.auth.login(credentials)
      const token = response.data.token || response.data.access_token
      if (token) {
        this.token = token
        localStorage.setItem('token', token)
        await this.fetchUserProfile()
        return true
      }
      return false
    },
    async adminLogin(credentials) {
      const response = await apiService.auth.login(credentials)
      const token = response.data.token || response.data.access_token
      const user = response.data.user || { role: response.data.role }

      if (token && user.role === 'admin') {
        this.token = token
        this.role = user.role
        localStorage.setItem('token', token)
        localStorage.setItem('role', user.role)
        await this.fetchUserProfile()
        return true
      }
      throw new Error('Not an admin or invalid credentials.')
    },
    async fetchUserProfile() {
      if (!this.token) return
      try {
        const response = await apiService.auth.getProfile()
        this.user = response.data
        this.isAuthenticated = true
      } catch (error) {
        console.error('Failed to fetch user profile:', error)
        this.logout()
      }
    },
    async updateUserProfile(data) {
      const response = await apiService.auth.updateProfile(data)
      this.user = response.data
    },
    logout() {
      this.user = null
      this.isAuthenticated = false
      this.token = null
      this.role = null
      localStorage.removeItem('token')
      localStorage.removeItem('role')
    },
    async checkAuth() {
      if (this.token) {
        await this.fetchUserProfile()
      }
    },
  },
})
