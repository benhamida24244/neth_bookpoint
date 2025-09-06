import { defineStore } from "pinia";
import apiService from "@/services/api.js";
export const useClientsStore = defineStore("clients", {
  state: () => ({
    clients: [],
    loaded: false
  }),

  actions: {
       async fetchClients() {
      this.loading = true; // Fixed from isLoading
      try {
        const response = await apiService.admin.customers.all();
        this.clients = response.data.data;
        console.log(this.clients);
        this.loaded = true;
        this.loading = false;
        return this.clients;
      } catch (error) {
        console.error('Failed to fetch customers:', error);
        this.loading = false;
        return [];
      }
    },

    async fetchClientById(ClientId) {
      this.loading = true;
      this.error = null;
      try {
        const response = await apiService.admin.customers.get(ClientId);
        console.log(response.data.data);
        return response.data.data; // إرجاع بيانات الناشر المحدد مباشرة
      } catch (error) {
        this.error = "Failed to fetch Client by ID.";
        console.error(error);
        throw error; // إرسال الخطأ للمعالجة في المكون
      } finally {
        this.loading = false;
      }
    },

    async updateClientStatus(clientId, status) {
      this.loading = true;
      this.error = null;
      try {
        if(status === 'active')
        {
          await apiService.admin.customers.activate(clientId, { status });
        const index = this.clients.findIndex(c => c.id === clientId);
        if (index !== -1) {
          this.clients[index].status = status;
        }
        }
        else if (status === 'inactive')
        {
          await apiService.admin.customers.deactivate(clientId, { status });
        const index = this.clients.findIndex(c => c.id === clientId);
        if (index !== -1) {
          this.clients[index].status = status;
        }
        }
      } catch (error) {
        this.error = "Failed to update client status.";
        console.error(error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteClient(ClientId) {
      this.loading = true;
      this.error = null;
      try {
        await apiService.admin.clients.delete(ClientId);
        this.clients = this.clients.filter((Client) => Client.id !== ClientId);
      } catch (error) {
        this.error = "Failed to delete Client.";
        console.error(error);
        throw error; // Added for consistency
      } finally {
        this.loading = false;
      }
    },
  },
  getters: {
    getClientById: (state) => (id) => {
      return state.clients.find(client => client.id === id);
    }
  },
});
