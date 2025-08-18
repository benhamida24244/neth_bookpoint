import { defineStore } from "pinia";
import apiClient from '../api';

export const usePublishingHouseStore = defineStore("publishingHouse", {
  state: () => ({
    publishingHouses: [],
    isLoading: false,
  }),
  actions: {
    async fetchPublishingHouses() {
      this.isLoading = true;
      try {
        const response = await apiClient.get('/publishers');
        this.publishingHouses = response.data.data;
      } catch (error) {
        console.error("Failed to fetch publishing houses:", error);
      } finally {
        this.isLoading = false;
      }
    },
    async addPublisher(publisher) {
      try {
        const response = await apiClient.post('/publishers', publisher);
        this.publishingHouses.push(response.data);
      } catch (error) {
        console.error("Failed to add publisher:", error);
      }
    },
    async updatePublisher(updatedPublisher) {
      try {
        const response = await apiClient.put(`/publishers/${updatedPublisher.id}`, updatedPublisher);
        const index = this.publishingHouses.findIndex(p => p.id === updatedPublisher.id);
        if (index !== -1) {
          this.publishingHouses[index] = response.data;
        }
      } catch (error) {
        console.error("Failed to update publisher:", error);
      }
    },
    async deletePublisher(publisherId) {
      try {
        await apiClient.delete(`/publishers/${publisherId}`);
        this.publishingHouses = this.publishingHouses.filter(p => p.id !== publisherId);
      } catch (error) {
        console.error("Failed to delete publisher:", error);
      }
    }
  }
});
