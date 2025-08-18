import { defineStore } from "pinia";
import apiClient from '../api';

export const useAuthorStore = defineStore("authors", {
  state: () => ({
    authors: [],
    isLoading: false,
  }),
  actions: {
    async fetchAuthors() {
      this.isLoading = true;
      try {
        const response = await apiClient.get('/authors');
        this.authors = response.data.data;
      } catch (error) {
        console.error("Failed to fetch authors:", error);
      } finally {
        this.isLoading = false;
      }
    },
    async addAuthor(author) {
      try {
        const response = await apiClient.post('/authors', author);
        this.authors.push(response.data);
      } catch (error) {
        console.error("Failed to add author:", error);
      }
    },
    async updateAuthor(updatedAuthor) {
      try {
        const response = await apiClient.put(`/authors/${updatedAuthor.id}`, updatedAuthor);
        const index = this.authors.findIndex(author => author.id === updatedAuthor.id);
        if (index !== -1) {
          this.authors[index] = response.data;
        }
      } catch (error) {
        console.error("Failed to update author:", error);
      }
    },
    async deleteAuthor(authorId) {
      try {
        await apiClient.delete(`/authors/${authorId}`);
        this.authors = this.authors.filter(author => author.id !== authorId);
      } catch (error) {
        console.error("Failed to delete author:", error);
      }
    }
  }
});
