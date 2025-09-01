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
    RecentBooks: (state) => state.books.slice(-5),
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
    async addBook(formData) {
      this.isLoading = true;
      try {
        // Pass FormData directly to the api service
        const response = await apiService.admin.books.add(formData);
        // Assuming the API returns the newly created book data
        this.books.push(response.data.data);
        // Re-fetch books to get the latest list
        await this.fetchBooks();
        return true;
      } catch (error) {
        console.error("Failed to add book:", error);
        // Optionally, parse and return specific error messages
        return false;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Action to update an existing book (Admin).
     * Now handles FormData for file uploads.
     */
    async updateBook(bookId, bookData) {
      this.isLoading = true;
      try {
        const formData = new FormData();

        if (bookData instanceof FormData) {
          // If it's already FormData, append its entries
          for (let [key, value] of bookData.entries()) {
            formData.append(key, value);
          }
        } else {
          // If it's a plain object, append its properties
          for (const key in bookData) {
            if (bookData[key] !== null && bookData[key] !== undefined) {
              formData.append(key, bookData[key]);
            }
          }
        }

        // Add method spoofing for PUT request
        formData.append('_method', 'PUT');

        const response = await apiService.admin.books.update(bookId, formData);

        // Update state after successful API call
        const updatedBook = response.data.data;
        const index = this.books.findIndex((b) => b.id === bookId);
        if (index !== -1) {
          this.books[index] = { ...this.books[index], ...updatedBook };
        }
        if (this.book && this.book.id === bookId) {
          this.book = { ...this.book, ...updatedBook };
        }

        return true;
      } catch (error) {
        console.error(`Failed to update book ${bookId}:`, error);
        return false;
      } finally {
        this.isLoading = false;
      }
    },
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
