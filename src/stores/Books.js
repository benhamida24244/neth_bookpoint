import { defineStore } from "pinia";
import apiService from "@/services/api.js";

export const useBooksStore = defineStore("books", {
  state: () => ({
    books: [],
    book: null,
    loading: false,
    error: null,
  }),

  getters: {
    getBook: (state) => (id) => {
      return state.books.find((book) => book.id === id);
    },
  },

  actions: {
    async getAllBooks() {
      this.loading = true;
      this.error = null;
      try {
        const response = await apiService.getBooks();
        this.books = response.data.data; // Assuming API returns data in response.data.data
      } catch (error) {
        this.error = "Failed to fetch books.";
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    async getBookById(id) {
      this.loading = true;
      this.error = null;
      try {
        const response = await apiService.getBook(id);
        this.book = response.data;
      } catch (error) {
        this.error = "Failed to fetch book.";
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    async createBook(bookData) {
      this.loading = true;
      this.error = null;
      try {
        const response = await apiService.adminAddBook(bookData);
        await this.getAllBooks(); // Refresh list after creation
        return response.data; // Return the created book data
      } catch (error) {
        this.error = "Failed to create book.";
        console.error(error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async uploadBookCover(bookId, file) {
      this.loading = true;
      this.error = null;
      const formData = new FormData();
      formData.append("cover_image", file);

      try {
        await apiService.uploadBookCover(bookId, formData);
        await this.getAllBooks(); // Refresh list to get new cover URL
      } catch (error) {
        this.error = "Failed to upload book cover.";
        console.error(error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateBook(bookId, bookData) {
      this.loading = true;
      this.error = null;
      try {
        await apiService.adminUpdateBook(bookId, bookData);
        await this.getAllBooks(); // Refresh list after update
      } catch (error) {
        this.error = "Failed to update book.";
        console.error(error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteBook(bookId) {
      this.loading = true;
      this.error = null;
      try {
        await apiService.adminDeleteBook(bookId);
        this.books = this.books.filter((book) => book.id !== bookId);
      } catch (error) {
        this.error = "Failed to delete book.";
        console.error(error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});
