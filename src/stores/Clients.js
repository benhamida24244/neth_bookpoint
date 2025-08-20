import { defineStore } from "pinia";
import apiService from "@/services/api.js";

export const useClientsStore = defineStore("clients", {
  state: () => ({
    clients: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchClients() {
      this.loading = true;
      this.error = null;
      try {
        const response = await apiService.adminGetClients();
        this.clients = response.data.data;
      } catch (error) {
        this.error = "Failed to fetch clients.";
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    async addClient(clientData) {
      this.loading = true;
      this.error = null;
      try {
        const response = await apiService.adminAddClient(clientData);
        await this.fetchClients();
        return response.data;
      } catch (error) {
        this.error = "Failed to add client.";
        console.error(error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async updateClient(clientId, clientData) {
      this.loading = true;
      this.error = null;
      try {
        const response = await apiService.adminUpdateClient(
          clientId,
          clientData
        );
        await this.fetchClients();
        return response.data;
      } catch (error) {
        this.error = "Failed to update client.";
        console.error(error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async deleteClient(clientId) {
      this.loading = true;
      this.error = null;
      try {
        await apiService.adminDeleteClient(clientId);
        this.clients = this.clients.filter(
          (client) => client.id !== clientId
        );
      } catch (error) {
        this.error = "Failed to delete client.";
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
  },
});
