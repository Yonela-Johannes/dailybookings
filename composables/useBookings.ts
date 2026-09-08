export function useBookings() {
  const { user } = useAuth();

  const createBooking = async (bookingData: any) => {
    return await $fetch('/api/bookings', {
      method: 'POST',
      body: bookingData
    });
  };

  const getBookingHistory = () => {
    return useAsyncData(`booking-history-${user.value?.id || 'guest'}`, () => $fetch('/api/bookings'));
  };

  return {
    createBooking,
    getBookingHistory
  };
}
