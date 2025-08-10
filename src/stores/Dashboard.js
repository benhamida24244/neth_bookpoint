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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      this.stats = {
        books: 120,
        ordersToday: 12,
        clients: 120,
        salesToday: 3423,
      };

      this.dailySales = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        data: [120, 150, 180, 220, 200, 250, 230],
      };

      this.dailyOrders = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        data: [10, 12, 15, 18, 16, 20, 19],
      };

      this.categorySales = {
        labels: ['Fiction', 'Non-Fiction', 'Sci-Fi', 'Fantasy', 'Biography'],
        data: [300, 250, 200, 180, 150],
      };

      this.publishingHouse = {
        labels: ['Penguin', 'HarperCollins', 'Simon & Schuster', 'Hachette', 'Macmillan'],
        data: [500, 450, 400, 350, 300],
      };

      this.ordersByCountry = {
        labels: ['USA', 'UK', 'Canada', 'Australia', 'Germany'],
        data: [40, 30, 20, 15, 10],
      };

      this.latestOrders = [
        { id: 1, customer: 'John Doe', total: 59.99, status: 'Paid' },
        { id: 2, customer: 'Jane Smith', total: 46.00, status: 'Pending' },
        { id: 3, customer: 'Bob Johnson', total: 49.00, status: 'Paid' },
      ];

      this.recentBooks = [
        { id: 1, name: 'Hasees (Signed Edition)', img: 'https://m.media-amazon.com/images/I/81WcnNQ-TBL._AC_UF1000,1000_QL80_.jpg' },
        { id: 2, name: 'The Crazy Musician (Signed Edition)', img: 'https://blog-cdn.reedsy.com/directories/gallery/248/large_65b0ae90317f7596d6f95bfdd6131398.jpg' },
      ];

      this.recentNotifications = [
        { id: 1, message: 'New order #1234 has been placed.', time: '10 minutes ago' },
        { id: 2, message: 'A new user has registered.', time: '1 hour ago' },
      ];
    },
  },
});
