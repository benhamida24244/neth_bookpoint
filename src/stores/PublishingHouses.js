import { defineStore } from "pinia";
import apiService from "@/services/api.js";

export const usePublishingHouseStore = defineStore("publishingHouse", {
  state: () => ({
    publishingHouses: [],
    loading: false,
    error: null,
  }),
  actions: {
     async fetchPublisher() {
      this.loading = true; // Fixed from isLoading
      try {
        const response = await apiService.getPublishers();
        this.publishingHouses = response.data.data;
        console.log(this.publishingHouses);
        this.loading = false;
        return this.publishingHouses;
      } catch (error) {
        console.error('Failed to fetch publishing Houses:', error);
        this.loading = false;
        return [];
      }
    },
    async addPublisher(publisher, imageFile) {
      this.loading = true;
      this.error = null;
      try {
        // Step 1: Create the publisher with text data
        const response = await apiService.adminAddPublisher(publisher);
        const newPublisher = response.data;

        // Step 2: If there's an image, upload it
        if (imageFile) {
          const formData = new FormData();
          formData.append('logo', imageFile); // 'logo' should match your backend's expected field name
          await this.uploadPublisherImage(newPublisher.id, formData);
        }

        // Step 3: Refresh the list to show the new publisher
        await this.fetchPublisher();
        return newPublisher;
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
        await apiService.adminUpdatePublisher(publisherId, publisherData);
        await this.fetchPublisher(); // Refresh the list after updating
      } catch (error) {
        this.error = "Failed to update Publisher.";
        console.error(error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
     async uploadPublisherImage(publisherId, formData) {
      this.loading = true;
      this.error = null;
      try {
        // Call the corresponding API service function
        await apiService.uploadPublisherLogo(publisherId, formData);
        // After a successful upload, refresh all author data to get the new image URL
        await this.fetchPublisher();
      } catch (error) {
        this.error = "Failed to upload Publisher image.";
        console.error(error);
        throw error; // Re-throw so the component knows about the failure
      } finally {
        this.loading = false;
      }
    },

    async deletePublisher(publisherId) {
      this.loading = true;
      this.error = null;
      try {
        await apiService.adminDeletePublisher(publisherId);
        this.publishingHouses = this.publishingHouses.filter((publisher) => publisher.id !== publisherId);
      } catch (error) {
        this.error = "Failed to delete Publisher.";
        console.error(error);
        throw error; // Added for consistency
      } finally {
        this.loading = false;
      }
    },
  }
})
