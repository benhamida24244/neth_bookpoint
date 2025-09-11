import { defineStore } from "pinia";
import apiService from "@/services/api.js";
import { ref } from "vue";

export const usePublishingHouseStore = defineStore("publishingHouse", () => {
  const publishingHouses = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  async function handleRequest(request, ...args) {
    isLoading.value = true;
    error.value = null;
    try {
      return await request(...args);
    } catch (e) {
      error.value = e.message || "An error occurred.";
      console.error(`Failed action: ${request.name}`, e);
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchPublishers() {
    const response = await handleRequest(apiService.publicResources.publishers.all);
    if (response) {
      publishingHouses.value = response.data.data;
    }
    return publishingHouses.value;
  }

  async function getPublisherById(publisherId) {
    const response = await handleRequest(apiService.publicResources.publishers.get, publisherId);
    return response ? response.data.data : null;
  }

  async function addPublisher(publisherData) {
    const response = await handleRequest(apiService.admin.publishers.add, publisherData);
    if (response) {
      await fetchPublishers(); // Refresh
    }
    return response;
  }

  async function updatePublisher(publisherId, publisherData) {
    const response = await handleRequest(apiService.admin.publishers.update, publisherId, publisherData);
    if (response) {
      await fetchPublishers(); // Refresh
    }
    return response;
  }

  async function deletePublisher(publisherId) {
    await handleRequest(apiService.admin.publishers.delete, publisherId);
    publishingHouses.value = publishingHouses.value.filter((p) => p.id !== publisherId);
  }

  return {
    publishingHouses,
    isLoading,
    error,
    fetchPublishers, // Renamed for consistency
    getPublisherById,
    addPublisher,
    updatePublisher,
    deletePublisher,
  };
});