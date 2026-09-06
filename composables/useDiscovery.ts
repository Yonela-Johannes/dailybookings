export function useDiscovery() {
  return useAsyncData('discovery', () => $fetch('/api/discovery'));
}
