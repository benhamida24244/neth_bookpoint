import { defineStore } from 'pinia'
import apiService, * as api from '@/services/api.js'

export const useCategoriesStore = defineStore('categories', {
  state: () => ({
    categories: [], // Holds the list of all categories
    category: null, // Holds a single category for detail/edit views
    isLoading: false,
    error: null,

  }),

  getters: {
    // Returns all categories
    allCategories: (state) => state.categories,

    // Returns a category from the local list, useful for quick access without a new API call
    getCategoryById: (state) => (id) => {
      return state.categories.find((cat) => cat.id === id)
    },

    // Formats statistics for display
    formattedStatistics: (state) => {
      return state.statistics.map((stat) => ({
        ...stat,
        displayValue: stat.prefix
          ? `${stat.prefix}${stat.value.toLocaleString()}`
          : stat.value.toLocaleString()
      }))
    }
  },

  actions: {
    // Fetch all categories from the API
    async fetchCategories() {
      this.isLoading = true
      this.error = null
      try {
        const response = await apiService.publicResources.categories.all()
        this.categories = response.data.data // Assuming API returns { data: { data: [...] } }
      } catch (error) {
        this.error = 'Failed to fetch categories.'
        console.error(error)
      } finally {
        this.isLoading = false
      }
    },

    // Fetch a single category from the API
    async fetchCategory(id) {
      this.isLoading = true
      this.error = null
      try {
        const response = await apiService.publicResources.categories.get(id)
        this.category = response.data.data // Assuming API returns { data: { data: {...} } }
      } catch (error) {
        this.error = 'Failed to fetch category.'
        console.error(error)
      } finally {
        this.isLoading = false
      }
    },

    // Add a new category
    async addCategory(categoryData) {
      this.isLoading = true
      this.error = null
      try {
        await apiService.admin.categories.add(categoryData)
        // After adding, refresh the list to get the new item
        await this.fetchCategories()
      } catch (error) {
        this.error = 'Failed to add category.'
        console.error(error)
        throw error // Re-throw to be caught in the component
      } finally {
        this.isLoading = false
      }
    },

    // Update an existing category
    async updateCategory(id, categoryData) {
      this.isLoading = true
      this.error = null
      try {
        await apiService.admin.categories.update(id,categoryData)
        // After updating, refresh the single category view and the list
        await this.fetchCategory(id)
        await this.fetchCategories()
      } catch (error) {
        this.error = 'Failed to update category.'
        console.error(error)
        throw error // Re-throw to be caught in the component
      } finally {
        this.isLoading = false
      }
    },

    // Delete a category
    async deleteCategory(id) {
      this.isLoading = true
      this.error = null
      try {
        await apiService.admin.categories.delete(id)
        // After deleting, remove it from the local list
        this.categories = this.categories.filter((cat) => cat.id !== id)
      } catch (error) {
        this.error = 'Failed to delete category.'
        console.error(error)
        throw error // Re-throw to be caught in the component
      } finally {
        this.isLoading = false
      }
    }
  }
})
