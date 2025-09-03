import { defineStore } from 'pinia';
import apiService from '@/services/api.js';

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    loading: false,
    stats: {
      books:0,
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
  }),
  actions: {
    async fetchDashboardData() {
      this.loading = true;
      try {
        const response = await apiService.admin.dashboard();
        const data = response.data;
        if (data.stats) {
          this.stats.books = data.stats.books ?? this.stats.books;
          this.stats.ordersToday = data.stats.ordersToday ?? this.stats.ordersToday;
          this.stats.clients = data.stats.clients ?? this.stats.clients;
          this.stats.salesToday = data.stats.salesToday ?? this.stats.salesToday;
        }
        this.dailySales = data.dailySales;
        this.dailyOrders = data.dailyOrders;
        this.categorySales = data.categorySales;
        this.publishingHouse = data.publishingHouse;
        this.ordersByCountry = data.ordersByCountry;
        this.latestOrders = data.latestOrders;
        this.recentBooks = data.recentBooks;
        this.recentNotifications = data.recentNotifications;
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Optionally, handle the error state in the store
      } finally {
        this.loading = false;
      }
    },
  },
});
