<script setup lang="ts">
import {
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon,
    Plus,
    Filter,
    Search,
    Clock,
    Layers,
    AlertCircle,
} from "lucide-vue-next";
import {
    format,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameMonth,
    isToday,
    addMonths,
    subMonths,
    startOfWeek,
    endOfWeek,
    isSameDay,
    parseISO,
} from "date-fns";

definePageMeta({
    layout: "business",
    middleware: "auth",
});

const currentDate = ref(new Date());
const view = ref<"month" | "week" | "day">("month");
const searchQuery = ref("");
const selectedEmployeeId = ref("all");

const { data: teamData } = await useFetch("/api/business/team", {
    query: { limit: 100 },
});

const employees = computed(() => (teamData.value as any)?.data || []);

const { data: venuesData } = await useFetch("/api/business/venues");
const venues = computed(() => (venuesData.value as any)?.data || []);

const { data: servicesData } = await useFetch("/api/business/services");
const services = computed(() => (servicesData.value as any)?.data || []);

const startDateParam = computed(() =>
    format(startOfMonth(currentDate.value), "yyyy-MM-dd"),
);

const endDateParam = computed(() =>
    format(endOfMonth(currentDate.value), "yyyy-MM-dd"),
);

const {
    data: bookingsResponse,
    refresh: refreshBookings,
    pending,
} = await useFetch("/api/business/bookings", {
    query: {
        startDate: startDateParam,
        endDate: endDateParam,
        limit: 500,
    },
    watch: [currentDate],
});

const bookings = computed(() => (bookingsResponse.value as any)?.data || []);

const filteredBookings = computed(() => {
    let filtered = bookings.value;

    if (selectedEmployeeId.value !== "all") {
        filtered = filtered.filter((booking: any) =>
            booking.services?.some(
                (service: any) =>
                    service.employeeId === selectedEmployeeId.value,
            ),
        );
    }

    if (searchQuery.value.trim()) {
        const query = searchQuery.value.toLowerCase();

        filtered = filtered.filter(
            (booking: any) =>
                booking.user?.fullName?.toLowerCase().includes(query) ||
                booking.services?.some((service: any) =>
                    service.service?.name?.toLowerCase().includes(query),
                ),
        );
    }

    return filtered;
});

const calendarDays = computed(() => {
    const start = startOfMonth(currentDate.value);
    const end = endOfMonth(currentDate.value);

    const calendarStart = startOfWeek(start);
    const calendarEnd = endOfWeek(end);

    return eachDayOfInterval({
        start: calendarStart,
        end: calendarEnd,
    }).map((date) => ({
        date,
        isCurrentMonth: isSameMonth(date, currentDate.value),
        isToday: isToday(date),
        bookings: filteredBookings.value.filter((booking: any) =>
            isSameDay(parseISO(booking.date), date),
        ),
    }));
});

const isDetailsOpen = ref(false);
const selectedBooking = ref<any>(null);
const isNewAppointmentOpen = ref(false);
const isSubmitting = ref(false);

const newAppt = ref({
    venueId: "",
    userEmail: "",
    serviceId: "",
    employeeId: "",
    date: "",
    startTime: "",
    notes: "",
});

watch(
    venues,
    (newVenues) => {
        if (newVenues.length > 0 && !newAppt.value.venueId) {
            newAppt.value.venueId = newVenues[0].id;
        }
    },
    { immediate: true },
);

const openBookingDetails = (booking: any) => {
    selectedBooking.value = booking;
    isDetailsOpen.value = true;
};

const updateBookingStatus = async (status: string) => {
    if (!selectedBooking.value || isSubmitting.value) return;

    isSubmitting.value = true;

    try {
        await $fetch(`/api/business/bookings/${selectedBooking.value.id}`, {
            method: "PATCH",
            body: { status },
        });

        await refreshBookings();
        isDetailsOpen.value = false;
    } catch (error) {
        console.error("Failed to update status", error);
    } finally {
        isSubmitting.value = false;
    }
};

const createNewAppointment = async () => {
    if (isSubmitting.value) return;

    isSubmitting.value = true;

    try {
        await $fetch("/api/business/bookings", {
            method: "POST",
            body: newAppt.value,
        });

        await refreshBookings();

        isNewAppointmentOpen.value = false;

        newAppt.value = {
            venueId: venues.value[0]?.id || "",
            userEmail: "",
            serviceId: "",
            employeeId: "",
            date: "",
            startTime: "",
            notes: "",
        };
    } catch (error: any) {
        alert(error.data?.statusMessage || "Failed to create appointment");
    } finally {
        isSubmitting.value = false;
    }
};

const nextMonth = () => {
    currentDate.value = addMonths(currentDate.value, 1);
};

const prevMonth = () => {
    currentDate.value = subMonths(currentDate.value, 1);
};

const goToToday = () => {
    currentDate.value = new Date();
};

const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
        case "CONFIRMED":
            return "border-emerald-100 bg-emerald-50 text-emerald-700";
        case "COMPLETED":
            return "border-blue-100 bg-blue-50 text-blue-700";
        case "CANCELLED":
            return "border-rose-100 bg-rose-50 text-rose-700";
        case "NO_SHOW":
            return "border-slate-200 bg-slate-50 text-slate-600";
        default:
            return "border-amber-100 bg-amber-50 text-amber-700";
    }
};

const statusOptions = ["CONFIRMED", "COMPLETED", "CANCELLED", "NO_SHOW"];
</script>

<template>
    <div class="space-y-8 pb-12">
        <div
            class="flex flex-col gap-5 border-b border-slate-200 pb-7 md:flex-row md:items-end md:justify-between"
        >
            <div>
                <div
                    class="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400"
                >
                    Business Operations
                </div>

                <h1
                    class="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl"
                >
                    Calendar
                </h1>

                <p class="mt-1.5 text-sm text-slate-500">
                    Manage appointments, staff schedules and bookings.
                </p>
            </div>

            <button
                type="button"
                class="inline-flex h-10 items-center justify-center gap-2 bg-primary px-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-slate-900"
                @click="isNewAppointmentOpen = true"
            >
                <Plus class="h-4 w-4" />
                New Booking
            </button>
        </div>

        <div v-if="pending" class="border border-slate-200 bg-white">
            <div
                class="flex h-16 items-center justify-center text-xs text-slate-400"
            >
                Loading calendar...
            </div>
        </div>

        <div v-else class="overflow-hidden border border-slate-200 bg-white">
            <div
                class="flex flex-col gap-5 border-b border-slate-200 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between"
            >
                <div class="flex flex-wrap items-center gap-2">
                    <button
                        type="button"
                        @click="prevMonth"
                        class="flex h-9 w-9 items-center justify-center border border-slate-200 bg-white text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-900"
                        aria-label="Previous month"
                    >
                        <ChevronLeft class="h-4 w-4" />
                    </button>

                    <button
                        type="button"
                        @click="goToToday"
                        class="h-9 border border-slate-200 bg-white px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
                    >
                        Today
                    </button>

                    <button
                        type="button"
                        @click="nextMonth"
                        class="flex h-9 w-9 items-center justify-center border border-slate-200 bg-white text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-900"
                        aria-label="Next month"
                    >
                        <ChevronRight class="h-4 w-4" />
                    </button>

                    <div class="ml-1 border-l border-slate-200 pl-4">
                        <h2
                            class="text-sm font-semibold text-slate-950 sm:text-base"
                        >
                            {{ format(currentDate, "MMMM yyyy") }}
                        </h2>
                    </div>
                </div>

                <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <div class="flex border border-slate-200 bg-white">
                        <button
                            v-for="option in ['month', 'week', 'day'] as const"
                            :key="option"
                            type="button"
                            @click="view = option"
                            :class="[
                                'h-9 px-3 text-[10px] font-semibold uppercase tracking-[0.1em] transition-colors',
                                view === option
                                    ? 'bg-primary text-white'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900',
                            ]"
                        >
                            {{ option }}
                        </button>
                    </div>

                    <div class="relative w-full sm:w-52">
                        <Filter
                            class="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"
                        />

                        <select
                            v-model="selectedEmployeeId"
                            class="h-9 w-full appearance-none border border-slate-200 bg-white pl-9 pr-8 text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-600 outline-none transition-colors focus:border-primary/30"
                        >
                            <option value="all">All Staff</option>

                            <option
                                v-for="employee in employees"
                                :key="employee.id"
                                :value="employee.id"
                            >
                                {{ employee.name }}
                            </option>
                        </select>
                    </div>

                    <div class="relative w-full sm:w-56">
                        <Search
                            class="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            v-model="searchQuery"
                            type="text"
                            placeholder="Search bookings"
                            class="h-9 w-full border border-slate-200 bg-white pl-9 pr-3 text-xs text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-primary/30"
                        />
                    </div>
                </div>
            </div>

            <div v-if="view === 'month'" class="overflow-x-auto">
                <div class="min-w-[760px]">
                    <div
                        class="grid grid-cols-7 border-b border-slate-200 bg-slate-50"
                    >
                        <div
                            v-for="day in [
                                'Sun',
                                'Mon',
                                'Tue',
                                'Wed',
                                'Thu',
                                'Fri',
                                'Sat',
                            ]"
                            :key="day"
                            class="border-r border-slate-200 px-3 py-3 text-left text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-400 last:border-r-0"
                        >
                            {{ day }}
                        </div>
                    </div>

                    <div class="grid grid-cols-7 auto-rows-fr">
                        <div
                            v-for="cell in calendarDays"
                            :key="cell.date.toString()"
                            class="group min-h-[135px] border-b border-r border-slate-200 p-3 transition-colors hover:bg-slate-50/70"
                            :class="[
                                !cell.isCurrentMonth
                                    ? 'bg-slate-50/50'
                                    : 'bg-white',
                            ]"
                        >
                            <div class="mb-3 flex items-center justify-between">
                                <span
                                    :class="[
                                        'flex h-7 w-7 items-center justify-center text-xs font-semibold',
                                        cell.isToday
                                            ? 'bg-primary text-white'
                                            : cell.isCurrentMonth
                                              ? 'text-slate-700'
                                              : 'text-slate-300',
                                    ]"
                                >
                                    {{ format(cell.date, "d") }}
                                </span>

                                <button
                                    v-if="cell.isCurrentMonth"
                                    type="button"
                                    class="flex h-7 w-7 items-center justify-center border border-transparent text-slate-300 opacity-0 transition-all hover:border-slate-200 hover:bg-white hover:text-primary group-hover:opacity-100"
                                    @click="
                                        newAppt.date = format(
                                            cell.date,
                                            'yyyy-MM-dd',
                                        );
                                        isNewAppointmentOpen = true;
                                    "
                                    aria-label="Add booking"
                                >
                                    <Plus class="h-3.5 w-3.5" />
                                </button>
                            </div>

                            <div class="space-y-1">
                                <button
                                    v-for="booking in cell.bookings.slice(0, 4)"
                                    :key="booking.id"
                                    type="button"
                                    class="block w-full border px-2 py-1.5 text-left transition-colors hover:border-slate-300 hover:bg-slate-50"
                                    :class="getStatusColor(booking.status)"
                                    @click="openBookingDetails(booking)"
                                >
                                    <div
                                        class="truncate text-[9px] font-semibold"
                                    >
                                        {{ booking.startTime }}
                                        {{
                                            booking.user?.fullName ||
                                            "Anonymous Client"
                                        }}
                                    </div>
                                </button>

                                <button
                                    v-if="cell.bookings.length > 4"
                                    type="button"
                                    class="w-full pt-1 text-center text-[9px] font-semibold uppercase tracking-[0.08em] text-slate-400 hover:text-primary"
                                    @click="
                                        openBookingDetails(cell.bookings[4])
                                    "
                                >
                                    +{{ cell.bookings.length - 4 }}
                                    more
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div
                v-else
                class="flex min-h-[520px] flex-col items-center justify-center border-t border-slate-200 px-6 text-center"
            >
                <div
                    class="mb-5 flex h-12 w-12 items-center justify-center border border-slate-200 bg-slate-50"
                >
                    <CalendarIcon class="h-5 w-5 text-slate-300" />
                </div>

                <h3 class="text-sm font-semibold text-slate-900">
                    {{ view === "week" ? "Week" : "Day" }} view
                </h3>

                <p class="mt-1 max-w-sm text-xs leading-relaxed text-slate-400">
                    This calendar view is not available yet. Month view remains
                    available for managing bookings.
                </p>

                <button
                    type="button"
                    class="mt-5 text-[10px] font-semibold uppercase tracking-[0.12em] text-primary hover:text-slate-900"
                    @click="view = 'month'"
                >
                    Return to month view
                </button>
            </div>
        </div>

        <UiSlideover
            :show="isDetailsOpen"
            title="Booking Details"
            @close="isDetailsOpen = false"
        >
            <div v-if="selectedBooking" class="space-y-7">
                <div
                    class="flex items-center gap-4 border border-slate-200 bg-slate-50 p-5"
                >
                    <div
                        class="flex h-11 w-11 shrink-0 items-center justify-center border border-slate-200 bg-white text-sm font-semibold text-primary"
                    >
                        {{ selectedBooking.user?.fullName?.[0] || "C" }}
                    </div>

                    <div class="min-w-0">
                        <h3
                            class="truncate text-sm font-semibold text-slate-950"
                        >
                            {{
                                selectedBooking.user?.fullName ||
                                "Anonymous Client"
                            }}
                        </h3>

                        <p class="mt-1 truncate text-xs text-slate-400">
                            {{ selectedBooking.user?.email }}
                        </p>
                    </div>
                </div>

                <div class="space-y-3">
                    <div
                        class="flex items-center gap-4 border border-slate-200 p-4"
                    >
                        <div
                            class="flex h-9 w-9 shrink-0 items-center justify-center border border-slate-200 bg-slate-50 text-slate-500"
                        >
                            <CalendarIcon class="h-4 w-4" />
                        </div>

                        <div>
                            <p
                                class="text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-400"
                            >
                                Date & Time
                            </p>

                            <p
                                class="mt-1 text-xs font-semibold text-slate-900"
                            >
                                {{
                                    format(
                                        parseISO(selectedBooking.date),
                                        "EEEE, MMMM d, yyyy",
                                    )
                                }}
                                ·
                                {{ selectedBooking.startTime }}
                            </p>
                        </div>
                    </div>

                    <div
                        class="flex items-center gap-4 border border-slate-200 p-4"
                    >
                        <div
                            class="flex h-9 w-9 shrink-0 items-center justify-center border border-slate-200 bg-slate-50 text-slate-500"
                        >
                            <Clock class="h-4 w-4" />
                        </div>

                        <div>
                            <p
                                class="text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-400"
                            >
                                Duration & Total
                            </p>

                            <p
                                class="mt-1 text-xs font-semibold text-slate-900"
                            >
                                {{ selectedBooking.durationTotal }}
                                mins · R{{
                                    Number(
                                        selectedBooking.priceTotal || 0,
                                    ).toLocaleString()
                                }}
                            </p>
                        </div>
                    </div>
                </div>

                <div>
                    <div
                        class="mb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400"
                    >
                        Services
                    </div>

                    <div
                        class="divide-y divide-slate-200 border border-slate-200"
                    >
                        <div
                            v-for="bookingService in selectedBooking.services"
                            :key="bookingService.id"
                            class="flex items-center justify-between gap-4 p-4"
                        >
                            <div class="flex min-w-0 items-center gap-3">
                                <div
                                    class="flex h-8 w-8 shrink-0 items-center justify-center border border-slate-200 bg-slate-50 text-slate-400"
                                >
                                    <Layers class="h-3.5 w-3.5" />
                                </div>

                                <div class="min-w-0">
                                    <p
                                        class="truncate text-xs font-semibold text-slate-900"
                                    >
                                        {{ bookingService.service?.name }}
                                    </p>

                                    <p
                                        v-if="bookingService.employee"
                                        class="mt-1 text-[9px] uppercase tracking-[0.08em] text-slate-400"
                                    >
                                        {{ bookingService.employee.name }}
                                    </p>
                                </div>
                            </div>

                            <span
                                class="shrink-0 text-xs font-semibold text-slate-900"
                            >
                                R{{
                                    Number(
                                        bookingService.price || 0,
                                    ).toLocaleString()
                                }}
                            </span>
                        </div>
                    </div>
                </div>

                <div v-if="selectedBooking.notes">
                    <div
                        class="mb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400"
                    >
                        Notes
                    </div>

                    <div
                        class="border border-slate-200 bg-slate-50 p-4 text-xs leading-relaxed text-slate-600"
                    >
                        {{ selectedBooking.notes }}
                    </div>
                </div>

                <div>
                    <div
                        class="mb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400"
                    >
                        Update Status
                    </div>

                    <div
                        class="grid grid-cols-2 gap-px border border-slate-200 bg-slate-200"
                    >
                        <button
                            v-for="status in statusOptions"
                            :key="status"
                            type="button"
                            :disabled="isSubmitting"
                            :class="[
                                'bg-white px-3 py-3 text-[9px] font-semibold uppercase tracking-[0.08em] transition-colors disabled:cursor-not-allowed disabled:opacity-50',
                                selectedBooking.status === status
                                    ? 'bg-primary text-white'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900',
                            ]"
                            @click="updateBookingStatus(status)"
                        >
                            {{ status.replace("_", " ") }}
                        </button>
                    </div>
                </div>
            </div>

            <template #footer>
                <div class="border-t border-slate-200 p-6">
                    <UiButton
                        label="Close"
                        type="outline"
                        class="w-full !py-3"
                        @click="isDetailsOpen = false"
                    />
                </div>
            </template>
        </UiSlideover>

        <UiSlideover
            :show="isNewAppointmentOpen"
            title="New Booking"
            @close="isNewAppointmentOpen = false"
        >
            <form
                id="manual-appointment-form"
                class="space-y-6"
                @submit.prevent="createNewAppointment"
            >
                <div v-if="venues.length > 1" class="space-y-2">
                    <label
                        class="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400"
                    >
                        Venue
                    </label>

                    <select
                        v-model="newAppt.venueId"
                        required
                        class="h-11 w-full appearance-none border border-slate-200 bg-white px-3 text-xs text-slate-900 outline-none focus:border-primary/30"
                    >
                        <option
                            v-for="venue in venues"
                            :key="venue.id"
                            :value="venue.id"
                        >
                            {{ venue.name }}
                        </option>
                    </select>
                </div>

                <div class="space-y-2">
                    <label
                        class="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400"
                    >
                        Client Email
                    </label>

                    <input
                        v-model="newAppt.userEmail"
                        type="email"
                        placeholder="client@example.com"
                        required
                        class="h-11 w-full border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-primary/30"
                    />

                    <p class="text-[10px] leading-relaxed text-slate-400">
                        The client must already have an account.
                    </p>
                </div>

                <div class="space-y-2">
                    <label
                        class="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400"
                    >
                        Service
                    </label>

                    <select
                        v-model="newAppt.serviceId"
                        required
                        class="h-11 w-full appearance-none border border-slate-200 bg-white px-3 text-xs text-slate-900 outline-none focus:border-primary/30"
                    >
                        <option value="">Select service</option>

                        <option
                            v-for="service in services"
                            :key="service.id"
                            :value="service.id"
                        >
                            {{ service.name }} · R{{
                                Number(service.price || 0).toLocaleString()
                            }}
                        </option>
                    </select>
                </div>

                <div class="space-y-2">
                    <label
                        class="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400"
                    >
                        Staff Member
                    </label>

                    <select
                        v-model="newAppt.employeeId"
                        class="h-11 w-full appearance-none border border-slate-200 bg-white px-3 text-xs text-slate-900 outline-none focus:border-primary/30"
                    >
                        <option value="">Automatic assignment</option>

                        <option
                            v-for="employee in employees"
                            :key="employee.id"
                            :value="employee.id"
                        >
                            {{ employee.name }}
                        </option>
                    </select>
                </div>

                <div class="grid grid-cols-2 gap-3">
                    <div class="space-y-2">
                        <label
                            class="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400"
                        >
                            Date
                        </label>

                        <input
                            v-model="newAppt.date"
                            type="date"
                            required
                            class="h-11 w-full border border-slate-200 bg-white px-3 text-xs text-slate-900 outline-none focus:border-primary/30"
                        />
                    </div>

                    <div class="space-y-2">
                        <label
                            class="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400"
                        >
                            Start Time
                        </label>

                        <input
                            v-model="newAppt.startTime"
                            type="time"
                            required
                            class="h-11 w-full border border-slate-200 bg-white px-3 text-xs text-slate-900 outline-none focus:border-primary/30"
                        />
                    </div>
                </div>

                <div class="space-y-2">
                    <label
                        class="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400"
                    >
                        Notes
                    </label>

                    <textarea
                        v-model="newAppt.notes"
                        rows="4"
                        placeholder="Optional booking notes..."
                        class="w-full resize-none border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-primary/30"
                    />
                </div>

                <div class="flex gap-3 border border-amber-100 bg-amber-50 p-4">
                    <AlertCircle class="h-4 w-4 shrink-0 text-amber-500" />

                    <p class="text-[10px] leading-relaxed text-amber-700">
                        Manual bookings bypass standard payment validation and
                        are created as confirmed operational bookings.
                    </p>
                </div>
            </form>

            <template #footer>
                <div class="flex gap-3">
                    <UiButton
                        label="Cancel"
                        type="outline"
                        class="flex-1 !py-3"
                        :disabled="isSubmitting"
                        @click="isNewAppointmentOpen = false"
                    />

                    <UiButton
                        label="Create Booking"
                        type="submit"
                        form="manual-appointment-form"
                        class="flex-[2] !py-3"
                        :loading="isSubmitting"
                    />
                </div>
            </template>
        </UiSlideover>
    </div>
</template>

<style scoped>
:deep(.overflow-y-auto::-webkit-scrollbar) {
    width: 6px;
}

:deep(.overflow-y-auto::-webkit-scrollbar-track) {
    background: transparent;
}

:deep(.overflow-y-auto::-webkit-scrollbar-thumb) {
    background: #cbd5e1;
}
</style>
