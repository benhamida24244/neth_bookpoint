import { storeToRefs } from 'pinia';

export function useLoading(store) {
  const { isLoading } = storeToRefs(store);
  return { isLoading };
}
