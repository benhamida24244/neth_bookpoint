import { defineStore } from "pinia";
import apiClient from '../api';

export const useCategoriesStore = defineStore("categories", {
  state: () => ({
    isLoading: false,
    isOpenEdit: false,
    categories: [],
    statistics: [
      {
        id: 1,
        name: 'Total Orders',
        icon: 'fas fa-layer-group',
        value: 21,
        color: 'bg-blue-500',
        ariaLabel: '21 total orders',
      },
      {
        id: 2,
        name: 'Total Books',
        icon: 'fas fa-book',
        value: 234,
        color: 'bg-green-500',
        ariaLabel: '234 total books',
      },
      {
        id: 3,
        name: 'Total Profit',
        icon: 'fas fa-dollar-sign',
        value: 2343,
        color: 'bg-[var(--color-light)]',
        ariaLabel: '$2,343 total profit',
        prefix: '$',
      },
    ]
  }),

  getters: {
    allCategories: (state) => state.categories,
    getCurrentCategory: (state) => (currentId) => {
      return state.categories.find((cat) => cat.id === currentId) || {
        name: 'Unknown Category',
        description: 'No description available.',
      }
    },
    formattedStatistics: (state) => {
      return state.statistics.map((stat) => ({
        ...stat,
        displayValue: stat.prefix
          ? `${stat.prefix}${stat.value.toLocaleString()}`
          : stat.value.toLocaleString(),
      }))
    },
    getNew: (state) => {
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      return state.categories.filter(category => {
        const createdDate = new Date(category.createdAt);
        return createdDate >= threeMonthsAgo;
      });
    }
  },

  actions: {
    async fetchCategories() {
      this.isLoading = true;
      try {
        const response = await apiClient.get('/categories');
        this.categories = response.data.data;
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        this.isLoading = false;
      }
    },
    async addCategory(category) {
      try {
        const response = await apiClient.post('/categories', category);
        this.categories.push(response.data);
      } catch (error) {
        console.error("Failed to add category:", error);
      }
    },
    async updateCategory(updatedCategory) {
      try {
        const response = await apiClient.put(`/categories/${updatedCategory.id}`, updatedCategory);
        const index = this.categories.findIndex(cat => cat.id === updatedCategory.id);
        if (index !== -1) {
          this.categories[index] = response.data;
        }
      } catch (error) {
        console.error("Failed to update category:", error);
      }
    },
    async deleteCategory(categoryId) {
      try {
        await apiClient.delete(`/categories/${categoryId}`);
        this.categories = this.categories.filter(cat => cat.id !== categoryId);
      } catch (error) {
        console.error("Failed to delete category:", error);
      }
    },
    handleEdit() {
      this.isOpenEdit = !this.isOpenEdit
    },
    handleImageError(event) {
      event.target.src = '/placeholder-book.jpg'
    },
  }
})
