import { defineStore } from 'pinia';
import apiService from '@/services/api';
import { useCartStore } from './Cart';

export const useCheckoutStore = defineStore('checkout', {
  state: () => ({
    loading: false,
    error: null,
    client_secret: null, // for Stripe
    approval_link: null, // for PayPal
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
      // Simulate API call for shipping
      await new Promise(resolve => setTimeout(resolve, 500));

      this.shippingOptions = [
        { id: 'delivery', name: 'Home Delivery', price: 24.00, icon: 'Truck' },
        { id: 'pickup', name: 'Pickup from RedBox Station', price: 12.00, icon: 'Package' },
      ];

      // Payment options as per backend
      this.paymentOptions = [
        { id: 'cod', name: 'Cash on Delivery', subtitle: 'Pay when you receive your order' },
        { id: 'stripe', name: 'Stripe', subtitle: 'Pay with your credit card' },
        { id: 'paypal', name: 'PayPal', subtitle: 'Secure checkout with PayPal' },
      ];
    },

    async createOrder(paymentMethod) {
  this.loading = true;
  this.error = null;
  const cartStore = useCartStore();

  try {
    const response = await apiService.customerOrders.create({ payment_method: paymentMethod });

    if (paymentMethod === 'stripe') {
      this.client_secret = response.data.client_secret;
    } else if (paymentMethod === 'paypal') {
      this.approval_link = response.data.approval_link;
      if (this.approval_link) {
        // التوجيه تلقائيًا
        window.location.href = this.approval_link;
      }
    } else { // cod
      cartStore.clearCart();
    }

    return response.data;
  } catch (error) {
    this.error = error.response?.data?.message || 'Failed to create order.';
    throw error;
  } finally {
    this.loading = false;
  }
},

    async confirmStripeOrder(paymentIntentId) {
      this.loading = true;
      this.error = null;
      const cartStore = useCartStore();

      try {
        const response = await apiService.customerOrders.confirmStripePayment({
          payment_intent_id: paymentIntentId,
        });
        cartStore.clearCart();
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to confirm Stripe payment.';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    updateOrderSummary(summary) {
      this.orderSummary = summary;
    },
  },
});
