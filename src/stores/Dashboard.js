import { defineStore } from 'pinia';
import apiService from '@/services/api.js';

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    stats: {
      books: 0,
      ordersToday: 0,
      clients: 0,
      salesToday: 0,
    },
    dailySales: {
      labels: [],
      data: [],
    },
    dailyOrders: {
      labels: [],
      data: [],
    },
    categorySales: {
      labels: [],
      data: [],
    },
    publishingHouse: {
      labels: [],
      data: [],
    },
    ordersByCountry: {
      labels: [],
      data: [],
    },
    latestOrders: [],
    recentBooks: [],
    recentNotifications: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchDashboardData() {
      this.loading = true;
      this.error = null;
      try {
        const response = await apiService.getAdminDashboard();
        const data = response.data;
        this.stats = data.stats;
        this.dailySales = data.dailySales;
        this.dailyOrders = data.dailyOrders;
        this.categorySales = data.categorySales;
        this.publishingHouse = data.publishingHouse;
        this.ordersByCountry = data.ordersByCountry;
        this.latestOrders = data.latestOrders;
        this.recentBooks = data.recentBooks;
        this.recentNotifications = data.recentNotifications;
      } catch (error) {
        this.error = 'Failed to fetch dashboard data.';
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
  },
});
