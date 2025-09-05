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

    // --- الدالة الجديدة المضافة ---
    getClientById(ClientId) {
      // البحث في القائمة المحلية أولاً
      const client = this.clients.find(client => client.id === ClientId);
      if (client) {
        return client;
      }
      
      // إذا لم يتم العثور على العميل في القائمة المحلية
      console.warn(`Client with ID ${ClientId} not found in local data`);
      return null;
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
    // ----------------------------

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
});
