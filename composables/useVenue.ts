import type { Venue } from "~/types/venue";

export function useVenue(slug: string) {
  return useAsyncData<Venue>(`venue-${slug}`, () => $fetch(`/api/venues/${slug}`));
}
