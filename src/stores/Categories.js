import { defineStore } from 'pinia'
import apiService from '@/services/api.js'
import { ref, computed } from 'vue'

export const useCategoriesStore = defineStore('categories', () => {
  const categories = ref([]);
  const category = ref(null);
  const isLoading = ref(false);
  const error = ref(null);

  const allCategories = computed(() => categories.value);
  const getCategoryById = computed(() => (id) => {
    return categories.value.find((cat) => cat.id === id);
  });

  async function handleRequest(request, ...args) {
    isLoading.value = true;
    error.value = null;
    try {
      return await request(...args);
    } catch (e) {
      error.value = e.message || 'An error occurred.';
      console.error(`Failed action: ${request.name}`, e);
      throw e; // Re-throw for component-level handling
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchCategories() {
    const response = await handleRequest(apiService.publicResources.categories.all);
    if (response) {
      categories.value = response.data.data;
    }
  }

  async function fetchCategory(id) {
    const response = await handleRequest(apiService.publicResources.categories.get, id);
    if (response) {
      category.value = response.data.data;
    }
  }

  async function addCategory(categoryData) {
    await handleRequest(apiService.admin.categories.add, categoryData);
    await fetchCategories(); // Refresh list
  }

  async function updateCategory(id, categoryData) {
    await handleRequest(apiService.admin.categories.update, id, categoryData);
    await fetchCategories(); // Refresh list
    await fetchCategory(id); // Refresh single view
  }

  async function deleteCategory(id) {
    await handleRequest(apiService.admin.categories.delete, id);
    categories.value = categories.value.filter((cat) => cat.id !== id);
  }

  return {
    categories,
    category,
    isLoading,
    error,
    allCategories,
    getCategoryById,
    fetchCategories,
    fetchCategory,
    addCategory,
    updateCategory,
    deleteCategory,
  };
});