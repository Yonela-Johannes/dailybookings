export function useAvailability(venueSlug: string) {
  const getAvailability = (date: string, serviceIds: string[]) => {
    return useAsyncData(`availability-${venueSlug}-${date}`, () =>
      $fetch(`/api/venues/${venueSlug}/availability`, {
        query: {
          date,
          services: serviceIds.join(',')
        }
      })
    );
  };

  return {
    getAvailability
  };
}
