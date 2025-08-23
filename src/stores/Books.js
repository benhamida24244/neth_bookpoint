import { defineStore } from "pinia";
import apiService from "../services/api";

export const useBooksStore = defineStore("books", {
  state: () => ({
    isLoading: false,
    books: [],
    book: null, // To hold a single book's details
  }),
  getters: {
    allBooks: (state) => state.books,
    singleBook: (state) => state.book,
    // Keep other getters if they are still relevant
  },
  actions: {
    /**
     * Action to fetch all books from the API.
     */
    async fetchBooks(params = {}) {
      this.isLoading = true;
      try {
        const response = await apiService.publicResources.books.all(params);
        this.books = response.data.data; // The API returns data nested under a 'data' key
      } catch (error) {
        console.error("Failed to fetch books:", error);
        // Handle error appropriately in the UI
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Action to fetch a single book by its ID.
     */
    async fetchBook(id) {
      this.isLoading = true;
      this.book = null;
      try {
        const response = await apiService.publicResources.books.get(id);
        this.book = response.data; // The API returns the book object directly
      } catch (error) {
        console.error(`Failed to fetch book ${id}:`, error);
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Action to add a new book (Admin).
     */
    async addBook(bookData) {
      this.isLoading = true;
      try {
        const response = await apiService.admin.books.add(bookData);
        // Add the new book to the state to avoid a full re-fetch
        this.books.push(response.data);
        return true; // Indicate success
      } catch (error) {
        console.error("Failed to add book:", error);
        return false; // Indicate failure
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Action to update an existing book (Admin).
     */
    async updateBook(bookId, bookData) {
      this.isLoading = true;
      try {
        const response = await apiService.admin.books.update(bookId, bookData);
        // Find the index of the book and update it
        const index = this.books.findIndex((b) => b.id === bookId);
        if (index !== -1) {
          this.books[index] = response.data;
        }
        // Also update the single book view if it's the one being edited
        if (this.book && this.book.id === bookId) {
            this.book = response.data;
        }
        return true; // Indicate success
      } catch (error) {
        console.error("Failed to update book:", error);
        return false; // Indicate failure
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Action to delete a book (Admin).
     */
    async deleteBook(bookId) {
      this.isLoading = true;
      try {
        await apiService.admin.books.delete(bookId);
        // Remove the book from the state
        this.books = this.books.filter((b) => b.id !== bookId);
        return true; // Indicate success
      } catch (error) {
        console.error("Failed to delete book:", error);
        return false; // Indicate failure
      } finally {
        this.isLoading = false;
      }
    },
  },
});
