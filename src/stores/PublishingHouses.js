import { defineStore } from "pinia";
import apiService from "@/services/api.js";

export const usePublishingHouseStore = defineStore("publishingHouse", {
  state: () => ({
    publishers: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchPublishers() {
      this.loading = true;
      this.error = null;
      try {
        const response = await apiService.getPublishers();
        this.publishers = response.data.data;
      } catch (error) {
        this.error = "Failed to fetch publishers.";
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    async addPublisher(publisherData) {
      this.loading = true;
      this.error = null;
      try {
        const response = await apiService.adminAddPublisher(publisherData);
        await this.fetchPublishers();
        return response.data;
      } catch (error) {
        this.error = "Failed to add publisher.";
        console.error(error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async updatePublisher(publisherId, publisherData) {
      this.loading = true;
      this.error = null;
      try {
        const response = await apiService.adminUpdatePublisher(
          publisherId,
          publisherData
        );
        await this.fetchPublishers();
        return response.data;
      } catch (error) {
        this.error = "Failed to update publisher.";
        console.error(error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async deletePublisher(publisherId) {
      this.loading = true;
      this.error = null;
      try {
        await apiService.adminDeletePublisher(publisherId);
        this.publishers = this.publishers.filter(
          (publisher) => publisher.id !== publisherId
        );
      } catch (error) {
        this.error = "Failed to delete publisher.";
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    async uploadPublisherImage(publisherId, formData) {
      this.loading = true;
      this.error = null;
      try {
        await apiService.uploadPublisherLogo(publisherId, formData);
        await this.fetchPublishers();
      } catch (error) {
        this.error = "Failed to upload publisher image.";
        console.error(error);
        throw error;
      } finally {
        this.loading = false;
      }
    }
  },
});
