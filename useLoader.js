import { computed } from 'vue';
import { storeToRefs } from 'pinia';

/**
 * A composable to handle loading and error states from a Pinia store.
 * @param {import('pinia').Store} store - The Pinia store instance.
 * @returns {{isLoading: import('vue').ComputedRef<boolean>, error: import('vue').ComputedRef<any>}}
 */
export function useLoader(store) {
  if (!store) {
    console.warn('useLoader: A Pinia store instance must be provided.');
    return {
      isLoading: computed(() => false),
      error: computed(() => null),
    };
  }

  const { isLoading, error } = storeToRefs(store);

  return {
    isLoading,
    error,
  };
}
