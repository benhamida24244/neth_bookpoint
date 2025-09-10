import { setActivePinia, createPinia } from 'pinia';
import { useCartStore } from '../Cart';
import { useAuthStore } from '../Auth';
import apiService from '../../services/api';
import { vi } from 'vitest';

vi.mock('../../services/api');

describe('Cart Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
  });

  it('clears the cart for an authenticated user', async () => {
    const authStore = useAuthStore();
    authStore.customerToken = 'test_token';

    const cartStore = useCartStore();
    cartStore.cart = { items: [{ id: 1, quantity: 1 }] };

    apiService.cart.clear.mockResolvedValue({});
    apiService.cart.show.mockResolvedValue({ data: { data: { items: [] } } });

    await cartStore.clearCart();

    expect(apiService.cart.clear).toHaveBeenCalled();
    expect(cartStore.cart).toBeNull();
  });
});
