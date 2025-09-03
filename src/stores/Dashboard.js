import { defineStore } from 'pinia';
import { useBooksStore } from './Books';
import { useOrdersStore } from './Orders';
import { useCounterStore } from './counter';

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
      try {
        // Get books data
        const books = await booksStore.fetchBooks();
        this.stats.books = books.length;

        // Get recent books (last 5 added)
        this.recentBooks = books.slice(0, 5);

        // Get orders data
        const orders = await ordersStore.fetchOrders();

        // Calculate today's orders and sales
        const today = new Date().toISOString().split('T')[0];
        let todayOrders = 0;
        let todaySales = 0;

        orders.forEach(order => {
          const orderDate = new Date(order.date).toISOString().split('T')[0];
          if (orderDate === today) {
            todayOrders++;
            todaySales += parseFloat(order.total || 0);
          }
        });

        this.stats.ordersToday = todayOrders;
        this.stats.salesToday = todaySales;

        // Get unique customers count
        const uniqueCustomers = new Set(orders.map(order => order.customerId || order.email));
        this.stats.clients = uniqueCustomers.size;

        // Prepare daily sales data for the last 7 days
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];
          last7Days.push(dateStr);
        }

        this.dailySales.labels = last7Days.map(date => {
          const d = new Date(date);
          return d.toLocaleDateString('en-US', { weekday: 'short' });
        });

        this.dailySales.data = last7Days.map(date => {
          return orders
            .filter(order => new Date(order.date).toISOString().split('T')[0] === date)
            .reduce((sum, order) => sum + parseFloat(order.total || 0), 0);
        });

        // Prepare daily orders data for the last 7 days
        this.dailyOrders.labels = this.dailySales.labels; // Same labels as daily sales
        this.dailyOrders.data = last7Days.map(date => {
          return orders.filter(order => new Date(order.date).toISOString().split('T')[0] === date).length;
        });

        // Get latest orders (last 10 orders)
        this.latestOrders = orders.slice(0, 10).reverse();

        // Add some sample notifications
        this.recentNotifications = [
          { id: 1, message: 'New book added: "The Great Adventure"', time: '2 hours ago' },
          { id: 2, message: 'Order #1234 completed successfully', time: '5 hours ago' },
          { id: 3, message: 'Low stock alert: "Science Basics"', time: '1 day ago' },
        ];

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    },
  },
});
