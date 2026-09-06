import { computed, reactive } from "vue";
import type { VenueServiceCategory, VenueService } from "~/types/venue";

interface CartLine {
  service: VenueService;
}

interface BookingCartState {
  venueId: string | null;
  lines: CartLine[];
  date: string;
  time: string,
  employeeId: string,
}

const state = reactive<BookingCartState>({
  venueId: null,
  lines: [],
  date: '',
  time: '',
  employeeId: '',
});

export function useBookingCart() {
  function setVenue(venueId: string) {
    if (state.venueId && state.venueId !== venueId) {
      state.lines = [];
    }

    state.venueId = venueId;
  }

  function toggle(service: VenueService) {
    const index = state.lines.findIndex(
      (line) => line.service.id === service.id,
    );

    if (index >= 0) {
      state.lines.splice(index, 1);
      return;
    }

    state.lines.push({
      service,
    });
  }

  function isSelected(serviceId: string) {
    return state.lines.some((line) => line.service.id === serviceId);
  }

  function remove(serviceId: string) {
    const index = state.lines.findIndex(
      (line) => line.service.id === serviceId,
    );

    if (index >= 0) {
      state.lines.splice(index, 1);
    }
  }

  function clear() {
    state.lines.splice(0);
  }

  const lines = computed(() => state.lines);

  const count = computed(() => state.lines.length);

  const total = computed(() =>
    state.lines.reduce((sum, line) => sum + line.service.price, 0),
  );

  const totalDuration = computed(() =>
    state.lines.reduce((sum, line) => sum + line.service.durationMinutes, 0),
  );

  return {
    venueId: computed(() => state.venueId),
    lines,
    count,
    total,
    totalDuration,
    setVenue,
    toggle,
    isSelected,
    remove,
    clear,
  };
}

export function useBookingDateTime() {
  function selectDate(date: string) {
    state.date = date

    // reset time when changing date
    state.time = ''
  }

  function selectTime(time: string) {
    state.time = time
  }

  function selectEmployee(employeeId: string) {
    state.employeeId = employeeId
  }

  function reset() {
    state.date = ''
    state.time = ''
    state.employeeId = ''
  }

  const selected = computed(() => ({
    date: state.date,
    time: state.time,
    employeeId: state.employeeId,
  }))

  return {
    date: computed(() => state.date),
    time: computed(() => state.time),
    employeeId: computed(() => state.employeeId),

    selected,

    selectDate,
    selectTime,
    selectEmployee,
    reset,
  }
}

export function flattenServices(categories: VenueServiceCategory[]) {
  return categories.flatMap((category) => category.services);
}
