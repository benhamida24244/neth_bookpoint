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
        const response = await apiService.publicResources.authors.all();
        this.authors = response.data.data;
        console.log(this.authors);
        this.loading = false;
        return this.authors;
      } catch (error) {
        console.error('Failed to fetch publishing Houses:', error);
        this.loading = false;
        return [];
      }
    },

    // --- الدالة الجديدة المضافة ---
    async getAuthorById(AuthorId) {
      this.loading = true;
      this.error = null;
      try {
        const response = await apiService.publicResources.authors.get(AuthorId);
        return response.data.data; // إرجاع بيانات الناشر المحدد مباشرة
      } catch (error) {
        this.error = "Failed to fetch Author by ID.";
        console.error(error);
        throw error; // إرسال الخطأ للمعالجة في المكون
      } finally {
        this.loading = false;
      }
    },
    // ----------------------------

    async addAuthor(Author) {
      this.loading = true;
      this.error = null;
      try {
        const response = await apiService.admin.authors.add(Author)
        this.fetchAuthors(); // Refresh the list after adding
        return response;
      } catch (error) {
        this.error = "Failed to add Author.";
        console.error(error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async updateAuthor(AuthorId, AuthorData) {
      this.loading = true;
      this.error = null;
      try {
        await apiService.admin.authors.update(AuthorId, AuthorData);
        await this.fetchAuthors(); // Refresh the list after updating
      } catch (error) {
        this.error = "Failed to update Author.";
        console.error(error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteAuthor(AuthorId) {
      this.loading = true;
      this.error = null;
      try {
        await apiService.admin.authors.delete(AuthorId);
        this.authors = this.authors.filter((Author) => Author.id !== AuthorId);
      } catch (error) {
        this.error = "Failed to delete Author.";
        console.error(error);
        throw error; // Added for consistency
      } finally {
        this.loading = false;
      }
    },
  },
});
