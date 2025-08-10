import { defineStore } from 'pinia';

export const useCheckoutStore = defineStore('checkout', {
  state: () => ({
    shippingOptions: [],
    paymentOptions: [],
    orderSummary: {
      subtotal: 0,
      shipping: 0,
      vat: 0,
      total: 0,
    },
  }),
  actions: {
    async fetchCheckoutData() {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      this.shippingOptions = [
        { id: 'delivery', name: 'Home Delivery', price: 24.00, icon: 'Truck' },
        { id: 'pickup', name: 'Pickup from RedBox Station', price: 12.00, icon: 'Package' },
      ];

      this.paymentOptions = [
        { id: 'electronic', name: 'Electronic Payment', subtitle: 'Secure payment via credit card, Mada or ApplePay' },
        { id: 'cod', name: 'Cash on Delivery', subtitle: 'Pay when the order arrives' },
      ];
    },
    updateOrderSummary(summary) {
      this.orderSummary = summary;
    },
  },
});
