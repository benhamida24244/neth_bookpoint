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
        const response = await apiService.publicResources.publishers.all();
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

    // --- الدالة الجديدة المضافة ---
    async getPublisherById(publisherId) {
      this.loading = true;
      this.error = null;
      try {
        const response = await apiService.publicResources.publishers.get(publisherId);
        return response.data.data; // إرجاع بيانات الناشر المحدد مباشرة
      } catch (error) {
        this.error = "Failed to fetch publisher by ID.";
        console.error(error);
        throw error; // إرسال الخطأ للمعالجة في المكون
      } finally {
        this.loading = false;
      }
    },
    // ----------------------------

    async addPublisher(publisher) {
      this.loading = true;
      this.error = null;
      try {
        const response = await apiService.admin.publishers.add(publisher)
        this.fetchPublisher(); // Refresh the list after adding
        return response;
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
        await apiService.admin.publishers.update(publisherId, publisherData);
        await this.fetchPublisher(); // Refresh the list after updating
      } catch (error) {
        this.error = "Failed to update Publisher.";
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
        await apiService.admin.publishers.delete(publisherId);
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
