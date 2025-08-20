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
      this.loading = true; // Fixed from isLoading
      try {
        const response = await apiService.getAuthors();
        this.authors = response.data.data;
        console.log(this.authors);
        this.loading = false;
        return this.authors;
      } catch (error) {
        console.error('Failed to fetch authors:', error);
        this.loading = false;
        return [];
      }
    },

    async addAuthor(authorData) {
      this.loading = true;
      this.error = null;
      try {
        const response = await apiService.adminAddAuthor(authorData);
        this.fetchAuthors(); // Refresh the list after adding
        return response;
      } catch (error) {
        this.error = "Failed to add author.";
        console.error(error);
        throw error;
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
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 📸 NEW FUNCTION FOR IMAGE UPLOAD
    async uploadAuthorImage(authorId, formData) {
      this.loading = true;
      this.error = null;
      try {
        // Call the corresponding API service function
        await apiService.uploadAuthorLogo(authorId, formData);
        // After a successful upload, refresh all author data to get the new image URL
        await this.fetchAuthors();
      } catch (error) {
        this.error = "Failed to upload author image.";
        console.error(error);
        throw error; // Re-throw so the component knows about the failure
      } finally {
        this.loading = false;
      }
    },

    async deleteAuthor(authorId) {
      this.loading = true;
      this.error = null;
      try {
        await apiService.adminDeleteAuthor(authorId);
        this.authors = this.authors.filter((author) => author.id !== authorId);
      } catch (error) {
        this.error = "Failed to delete author.";
        console.error(error);
        throw error; // Added for consistency
      } finally {
        this.loading = false;
      }
    },
  },
});
