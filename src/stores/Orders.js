import { defineStore } from "pinia";

export const useOrdersStore = defineStore("orders", {
  state: () => ({
    orders: [
      {
        id: 1,
        customer: 'Ali Ahmed',
        book: '1984',
        status: 'Completed',
        price: '$29.99',
        date: '2025-07-12'
      },
      {
        id: 2,
        customer: 'Sara Belkacem',
        book: 'Kafka on the Shore',
        status: 'Pending',
        price: '$35.00',
        date: '2025-07-14'
      },
      {
        id: 3,
        customer: 'Omar Yacine',
        book: 'Animal Farm',
        status: 'Returned',
        price: '$24.99',
        date: '2025-07-13'
      },
      {
        id: 4,
        customer: 'Yasmine H.',
        book: 'The Alchemist',
        status: 'Completed',
        price: '$39.99',
        date: '2025-07-10'
      }
    ],
  }),

  },
);
