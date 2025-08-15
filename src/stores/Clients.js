import { defineStore } from "pinia";

export const useClientsStore = defineStore("clients", {
  state: () => ({
    staticClients: [
  {
    id: 1,
    name: 'Benhamida Mohammed',
    email: 'mohammed@example.com',
    phone: '0823234234',
    Registration_date: '12-12-2000',
    Orders_count: 12,
    SpendMuch: 1234,
    Country: 'Algeria'
  },
  {
    id: 2,
    name: 'Ahmed Hassan',
    email: 'ahmed@example.com',
    phone: '0823234235',
    Registration_date: '15-03-2001',
    Orders_count: 8,
    SpendMuch: 890,
    Country: 'Morocco'
  },
  {
    id: 3,
    name: 'Fatima Al-Zahra',
    email: 'fatima@example.com',
    phone: '0823234236',
    Registration_date: '22-07-2002',
    Orders_count: 15,
    SpendMuch: 2100,
    Country: 'Tunisia'
  },
  {
    id: 4,
    name: 'Omar Ibrahim',
    email: 'omar@example.com',
    phone: '0823234237',
    Registration_date: '08-11-2003',
    Orders_count: 6,
    SpendMuch: 450,
    Country: 'Egypt'
  },
  {
    id: 5,
    name: 'Aisha Rahman',
    email: 'aisha@example.com',
    phone: '0823234238',
    Registration_date: '03-09-2004',
    Orders_count: 20,
    SpendMuch: 3200,
    Country: 'Algeria'
  },
],
    clients: []
  }),

  actions: {
    fetchClients() {
      // Fetch clients from an API or other source
    },
  },
});
