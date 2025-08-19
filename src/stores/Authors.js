import { defineStore } from "pinia";
import apiService from "@/services/api.js";

export const useAuthorStore = defineStore("authors", {
  state: () => ({
    authors: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchAuthors() {
      this.loading = true;
      this.error = null;
      try {
        const response = await apiService.getAuthors();
        this.authors = response.data.data; // Adjust based on your API response structure
      } catch (error) {
        this.error = "Failed to fetch authors.";
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    async addAuthor(authorData) {
      this.loading = true;
      this.error = null;
      try {
        await apiService.adminAddAuthor(authorData);
        await this.fetchAuthors(); // Refresh the list after adding
      } catch (error) {
        this.error = "Failed to add author.";
        console.error(error);
        throw error; // Re-throw to be caught in the component
      } finally {
        this.loading = false;
      }
    },
    async updateAuthor(authorId, authorData) {
      this.loading = true;
      this.error = null;
      try {
        await apiService.adminUpdateAuthor(authorId, authorData);
        await this.fetchAuthors(); // Refresh the list after updating
      } catch (error) {
        this.error = "Failed to update author.";
        console.error(error);
        throw error; // Re-throw to be caught in the component
      } finally {
        this.loading = false;
      }
    },
    async deleteAuthor(authorId) {
      this.loading = true;
      this.error = null;
      try {
        await apiService.adminDeleteAuthor(authorId);
        // Optimistic update: remove from local array before refetching
        this.authors = this.authors.filter((author) => author.id !== authorId);
        // Or simply refetch:
        // await this.fetchAuthors();
      } catch (error) {
        this.error = "Failed to delete author.";
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
  },
});
