import { defineStore } from "pinia";
import apiService from "../services/api";
import { ref, computed } from "vue";

export const useBooksStore = defineStore("books", () => {
  const isLoading = ref(false);
  const books = ref([]);
  const stats = ref({}); // Changed to object for stats
  const book = ref(null);
  const pagination = ref(null);
  const error = ref(null);
  const searchResults = ref([]);
  const isSearchLoading = ref(false);

  const allBooks = computed(() => books.value);
  const singleBook = computed(() => book.value);
  const RecentBooks = computed(() => books.value.slice(-5));
  const paginationInfo = computed(() => pagination.value);

  async function handleRequest(request, ...args) {
    isLoading.value = true;
    error.value = null;
    try {
      return await request(...args);
    } catch (e) {
      error.value = e.message || "An error occurred.";
      console.error(`Failed action: ${request.name}`, e);
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchBooks(params = {}) {
    const response = await handleRequest(apiService.publicResources.books.all, params);
    if (response) {
      books.value = response.data.data;
      pagination.value = response.data.meta;
    }
  }

  async function fetchBookStats() {
    try {
      const response = await apiService.admin.books.stats();
      if (response) {
        stats.value = response.data.stats;
      }
    } catch (e) {
      console.error("Failed to fetch book stats:", e);
    }
  }

  async function fetchBook(id) {
    const response = await handleRequest(apiService.publicResources.books.get, id);
    if (response) {
      book.value = response.data.data;
    }
  }

  async function fetchBooksBy(params = {}) {
    const response = await handleRequest(apiService.publicResources.books.all, params);
    return response ? response.data.data : [];
  }

  async function addBook(formData) {
    const response = await handleRequest(apiService.admin.books.add, formData);
    if (response) {
      await fetchBooks(); // Refresh
      return true;
    }
    return false;
  }

  async function updateBook(bookId, bookData) {
    const formData = new FormData();
    if (bookData instanceof FormData) {
      for (let [key, value] of bookData.entries()) {
        formData.append(key, value);
      }
    } else {
      for (const key in bookData) {
        if (bookData[key] !== null && bookData[key] !== undefined) {
          formData.append(key, bookData[key]);
        }
      }
    }
    formData.append('_method', 'PUT');

    const response = await handleRequest(apiService.admin.books.update, bookId, formData);
    if (response) {
      const updatedBook = response.data.data;
      const index = books.value.findIndex((b) => b.id === bookId);
      if (index !== -1) {
        books.value[index] = { ...books.value[index], ...updatedBook };
      }
      if (book.value && book.value.id === bookId) {
        book.value = { ...book.value, ...updatedBook };
      }
      return true;
    }
    return false;
  }

  async function deleteBook(bookId) {
    const response = await handleRequest(apiService.admin.books.delete, bookId);
    if (response) {
      books.value = books.value.filter((b) => b.id !== bookId);
      return true;
    }
    return false;
  }
  
  async function fetchBooksByAuthor(authorId, page = 1) {
    await fetchBooks({ author_id: authorId, page });
  }

  async function fetchBooksByCategory(categoryId, page = 1) {
    await fetchBooks({ category_id: categoryId, page });
  }

  async function fetchBooksByPublisher(publisherId, page = 1) {
    await fetchBooks({ publisher_id: publisherId, page });
  }

  async function searchBooks(query) {
    isSearchLoading.value = true;
    error.value = null;
    try {
      const response = await apiService.publicResources.books.all({ search: query });
      if (response) {
        searchResults.value = response.data.data;
      }
    } catch (e) {
      error.value = e.message || "An error occurred.";
      console.error(`Failed action: searchBooks`, e);
    } finally {
      isSearchLoading.value = false;
    }
  }

  return {
    isLoading,
    books,
    stats,
    book,
    pagination,
    error,
    allBooks,
    singleBook,
    RecentBooks,
    paginationInfo,
    searchResults,
    isSearchLoading,
    fetchBooks,
    fetchBookStats, // <-- Export new action
    fetchBook,
    fetchBooksBy,
    addBook,
    updateBook,
    deleteBook,
    fetchBooksByAuthor,
    fetchBooksByCategory,
    fetchBooksByPublisher,
    searchBooks,
  };
});