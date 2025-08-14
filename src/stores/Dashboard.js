import { defineStore } from 'pinia';

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
  }),
  actions: {
    async fetchDashboardData() {
      // TODO: Replace with actual API calls

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Example of how to fetch and update the state:
      // try {
      //   const response = await fetch('/api/dashboard-stats');
      //   const data = await response.json();
      //   this.stats = data;
      // } catch (error) {
      //   console.error('Error fetching dashboard stats:', error);
      // }

      // Fetch daily sales data
      // this.dailySales = await fetch('/api/daily-sales').then(res => res.json());

      // Fetch daily orders data
      // this.dailyOrders = await fetch('/api/daily-orders').then(res => res.json());

      // Fetch category sales data
      // this.categorySales = await fetch('/api/category-sales').then(res => res.json());

      // Fetch publishing house data
      // this.publishingHouse = await fetch('/api/publishing-house').then(res => res.json());

      // Fetch orders by country data
      // this.ordersByCountry = await fetch('/api/orders-by-country').then(res => res.json());

      // Fetch latest orders
      // this.latestOrders = await fetch('/api/latest-orders').then(res => res.json());

      // Fetch recent books
      // this.recentBooks = await fetch('/api/recent-books').then(res => res.json());

      // Fetch recent notifications
      // this.recentNotifications = await fetch('/api/recent-notifications').then(res => res.json());
    },
  },
});
