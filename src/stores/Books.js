// stores/Books.js
import { defineStore } from 'pinia';
import apiClient from '../api';

export const useBooksStore = defineStore('books', {
  state: () => ({
    // Flag to indicate if books are being loaded
    isLoading: false,
    // Array to hold the books data, initially empty
    books: [],
  }),
  getters: {
    /**
     * Getter to return all books.
     * @param {object} state - The store state.
     * @returns {Array} - The array of books.
     */
    allBooks: (state) => state.books,
    RecentBooks: (state) => state.books.filter(book => book.status === 'published').slice(-5),
    getTotalAuthors(state) {
      // نرجع قائمة المؤلفين الفريدة
      const uniqueAuthors = []
      state.books.forEach(book => {
        if (book.author && !uniqueAuthors.includes(book.author)) {
          uniqueAuthors.push(book.author)
        }
      })
      return uniqueAuthors
    },
    getTotalPublishedBooks(state) {
      const uniquePublished = []
      state.books.forEach(book => {
        if (book.publishingHouse && !uniquePublished.includes(book.publishingHouse)) {
          uniquePublished.push(book.publishingHouse)
        }
      })
      return uniquePublished
    },
    getTotalCategories(state) {
      const uniqueCategories = []
      state.books.forEach(book => {
        if(book.category && !uniqueCategories.includes(book.category)) {
          uniqueCategories.push(book.category)
        }
      })
      return uniqueCategories
    }
  },
  actions: {
    /**
     * Action to fetch books from the API.
     */
    async fetchBooks() {
      this.isLoading = true;
      try {
        const response = await apiClient.get('/books');
        this.books = response.data.data; // Assuming the API returns data in a 'data' property
      } catch (error) {
        console.error('Failed to fetch books:', error);
        // Optionally, handle the error in the UI
      } finally {
        this.isLoading = false;
      }
    },

    async addBook(book) {
      try {
        const response = await apiClient.post('/books', book);
        this.books.push(response.data);
      } catch (error) {
        console.error('Failed to add book:', error);
      }
    },

    async updateBook(updatedBook) {
      try {
        const response = await apiClient.put(`/books/${updatedBook.id}`, updatedBook);
        const index = this.books.findIndex(book => book.id === updatedBook.id);
        if (index !== -1) {
          this.books[index] = response.data;
        }
      } catch (error) {
        console.error('Failed to update book:', error);
      }
    },

    async deleteBook(bookId) {
      try {
        await apiClient.delete(`/books/${bookId}`);
        this.books = this.books.filter(book => book.id !== bookId);
      } catch (error) {
        console.error('Failed to delete book:', error);
      }
    }
  }
})
