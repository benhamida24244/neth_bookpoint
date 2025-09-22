import { defineStore } from "pinia";
import apiService from "@/services/api.js";
import { ref } from "vue";

export const useAuthorStore = defineStore("authors", () => {
  const authors = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  async function fetchAuthors() {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await apiService.publicResources.authors.all();
      authors.value = response.data.data;
      return authors.value;
    } catch (e) {
      error.value = "Failed to fetch authors.";
      console.error(e);
      return [];
    } finally {
      isLoading.value = false;
    }
  }

  async function getAuthorById(authorId) {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await apiService.publicResources.authors.get(authorId);
      return response.data.data;
    } catch (e) {
      error.value = "Failed to fetch author by ID.";
      console.error(e);
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  async function addAuthor(authorData) {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await apiService.admin.authors.add(authorData);
      await fetchAuthors(); // Refresh the list
      return response;
    } catch (e) {
      error.value = "Failed to add author.";
      console.error(e);
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  async function updateAuthor(authorId, authorData) {
    isLoading.value = true;
    error.value = null;
    try {
      await apiService.admin.authors.update(authorId, authorData);
      await fetchAuthors(); // Refresh the list
    } catch (e) {
      error.value = "Failed to update author.";
      console.error(e);
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteAuthor(authorId) {
    isLoading.value = true;
    error.value = null;
    try {
      await apiService.admin.authors.delete(authorId);
      authors.value = authors.value.filter((author) => author.id !== authorId);
    } catch (e) {
      error.value = "Failed to delete author.";
      console.error(e);
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    authors,
    isLoading,
    error,
    fetchAuthors,
    getAuthorById,
    addAuthor,
    updateAuthor,
    deleteAuthor,
  };
});