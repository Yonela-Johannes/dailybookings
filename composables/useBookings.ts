export function useBookings() {
  const createBooking = async (bookingData: any) => {
    return await $fetch('/api/bookings', {
      method: 'POST',
      body: bookingData
    });
  };

  const getBookingHistory = () => {
    return useAsyncData('booking-history', () => $fetch('/api/bookings'));
  };

  return {
    createBooking,
    getBookingHistory
  };
}
