<script setup lang="ts">
import {
    Filter,
    Calendar,
    Clock,
    CreditCard,
    Loader2,
    ChevronLeft,
    ChevronRight,
    Download,
    ArrowUpRight,
} from "lucide-vue-next";
import { format, parseISO } from "date-fns";

definePageMeta({
    layout: "admin",
    middleware: "auth",
});

const statusFilter = ref("");
const page = ref(1);

const {
    data: bookingsData,
    pending,
    refresh,
} = useFetch("/api/admin/bookings", {
    query: {
        status: statusFilter,
        page,
        limit: 10,
    },
    watch: [statusFilter, page],
});

const bookings = computed(() => bookingsData.value?.data || []);

const meta = computed(
    () =>
        bookingsData.value?.meta || {
            total: 0,
            page: 1,
            totalPages: 1,
        },
);

const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
        case "CONFIRMED":
        case "COMPLETED":
            return "text-teal-700 bg-teal-50 border-teal-200";

        case "PENDING":
            return "text-amber-700 bg-amber-50 border-amber-200";

        case "CANCELLED":
            return "text-red-700 bg-red-50 border-red-200";

        default:
            return "text-slate-600 bg-slate-50 border-slate-200";
    }
};
</script>

<template>
    <div class="space-y-8 pb-20">
        <!-- Page Header -->
        <Head
            title="Bookings"
            description="Manage and monitor bookings across DailyBookings"
        />

        <!-- Actions -->
        <div
            class="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between"
        >
            <div class="flex items-center gap-3">
                <div
                    class="border border-slate-200 bg-white px-4 py-2.5 text-[11px] font-semibold text-slate-600"
                >
                    {{ meta.total }} bookings
                </div>

                <div
                    class="border border-slate-200 bg-white px-4 py-2.5 text-[11px] font-medium text-slate-400"
                >
                    Page {{ meta.page }} of {{ meta.totalPages }}
                </div>
            </div>

            <button
                type="button"
                class="inline-flex h-10 items-center justify-center gap-2 border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50"
            >
                <Download class="h-4 w-4" />
                Export
            </button>
        </div>

        <!-- Booking Table -->
        <div class="overflow-hidden border border-slate-200 bg-white shadow-sm">
            <!-- Filters -->
            <div
                class="flex flex-col gap-4 border-b border-slate-200 bg-slate-50/40 p-5 sm:flex-row sm:items-center"
            >
                <div class="flex-1">
                    <label
                        for="status-filter"
                        class="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400"
                    >
                        Booking status
                    </label>

                    <select
                        id="status-filter"
                        v-model="statusFilter"
                        class="h-10 w-full border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-slate-400 sm:w-64"
                    >
                        <option value="">All bookings</option>
                        <option value="PENDING">Pending</option>
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancelled</option>
                    </select>
                </div>

                <button
                    type="button"
                    @click="refresh"
                    class="mt-auto inline-flex h-10 w-10 shrink-0 items-center justify-center border border-slate-200 bg-white text-slate-500 transition-colors hover:border-slate-300 hover:bg-slate-50"
                    aria-label="Refresh bookings"
                >
                    <Filter class="h-4 w-4" />
                </button>
            </div>

            <!-- Loading -->
            <div
                v-if="pending"
                class="flex min-h-[520px] items-center justify-center"
            >
                <Loader2 class="h-6 w-6 animate-spin text-slate-400" />
            </div>

            <!-- Table -->
            <div v-else-if="bookings.length" class="overflow-x-auto">
                <table class="w-full min-w-[1000px] text-left">
                    <thead>
                        <tr class="border-b border-slate-200 bg-slate-50/60">
                            <th
                                class="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400"
                            >
                                Booking
                            </th>

                            <th
                                class="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400"
                            >
                                Customer
                            </th>

                            <th
                                class="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400"
                            >
                                Business
                            </th>

                            <th
                                class="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400"
                            >
                                Date & time
                            </th>

                            <th
                                class="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400"
                            >
                                Status
                            </th>

                            <th
                                class="px-6 py-4 text-right text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400"
                            >
                                Total
                            </th>

                            <th
                                class="px-6 py-4 text-right text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400"
                            >
                                <span class="sr-only">Actions</span>
                            </th>
                        </tr>
                    </thead>

                    <tbody class="divide-y divide-slate-100">
                        <tr
                            v-for="booking in bookings"
                            :key="booking.id"
                            class="group transition-colors hover:bg-slate-50/60"
                        >
                            <!-- Booking -->
                            <td class="px-6 py-5">
                                <div
                                    class="font-mono text-xs font-semibold text-slate-700"
                                >
                                    #{{ booking.id.slice(-8) }}
                                </div>

                                <div class="mt-1 text-[10px] text-slate-400">
                                    {{ booking.services?.length || 0 }}
                                    {{
                                        booking.services?.length === 1
                                            ? "service"
                                            : "services"
                                    }}
                                </div>
                            </td>

                            <!-- Customer -->
                            <td class="px-6 py-5">
                                <div class="flex items-center gap-3">
                                    <div
                                        class="flex h-9 w-9 shrink-0 items-center justify-center border border-slate-200 bg-slate-50 text-xs font-bold text-slate-600"
                                    >
                                        {{ booking.user?.fullName?.[0] || "G" }}
                                    </div>

                                    <div class="min-w-0">
                                        <div
                                            class="max-w-[180px] truncate text-sm font-semibold text-slate-900"
                                        >
                                            {{
                                                booking.user?.fullName ||
                                                "Anonymous"
                                            }}
                                        </div>

                                        <div
                                            class="mt-0.5 max-w-[180px] truncate text-xs text-slate-400"
                                        >
                                            {{ booking.user?.email }}
                                        </div>
                                    </div>
                                </div>
                            </td>

                            <!-- Business -->
                            <td class="px-6 py-5">
                                <div
                                    class="max-w-[190px] truncate text-sm font-semibold text-slate-900"
                                >
                                    {{ booking.venue?.name || "—" }}
                                </div>

                                <div
                                    v-if="booking.venue?.slug"
                                    class="mt-1 max-w-[190px] truncate text-xs text-slate-400"
                                >
                                    {{ booking.venue.slug }}
                                </div>
                            </td>

                            <!-- Date / Time -->
                            <td class="px-6 py-5">
                                <div
                                    class="flex items-center gap-2 text-sm font-medium text-slate-800"
                                >
                                    <Calendar
                                        class="h-4 w-4 shrink-0 text-slate-400"
                                    />

                                    {{
                                        format(
                                            parseISO(booking.date),
                                            "MMM d, yyyy",
                                        )
                                    }}
                                </div>

                                <div
                                    class="mt-1.5 flex items-center gap-2 text-xs text-slate-400"
                                >
                                    <Clock class="h-3.5 w-3.5 shrink-0" />

                                    <span>
                                        {{ booking.startTime }}
                                        <span class="mx-1 text-slate-300">
                                            –
                                        </span>
                                        {{ booking.endTime }}
                                    </span>
                                </div>
                            </td>

                            <!-- Status -->
                            <td class="px-6 py-5">
                                <span
                                    :class="[
                                        'inline-flex items-center border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide',
                                        getStatusColor(booking.status),
                                    ]"
                                >
                                    {{ booking.status }}
                                </span>
                            </td>

                            <!-- Total -->
                            <td class="px-6 py-5 text-right">
                                <div class="text-sm font-bold text-slate-900">
                                    R{{ booking.priceTotal.toLocaleString() }}
                                </div>

                                <div class="mt-1 text-[10px] text-slate-400">
                                    {{ booking.services?.length || 0 }}
                                    {{
                                        booking.services?.length === 1
                                            ? "item"
                                            : "items"
                                    }}
                                </div>
                            </td>

                            <!-- Action -->
                            <td class="px-6 py-5 text-right">
                                <NuxtLink
                                    :to="`/admin/bookings/${booking.id}`"
                                    class="inline-flex h-9 w-9 items-center justify-center border border-slate-200 bg-white text-slate-400 opacity-0 transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 group-hover:opacity-100"
                                    aria-label="View booking"
                                >
                                    <ArrowUpRight class="h-4 w-4" />
                                </NuxtLink>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Empty -->
            <div
                v-else
                class="flex min-h-[520px] flex-col items-center justify-center px-6 text-center"
            >
                <div
                    class="mb-5 flex h-14 w-14 items-center justify-center border border-slate-200 bg-slate-50"
                >
                    <CreditCard class="h-6 w-6 text-slate-300" />
                </div>

                <h3 class="text-base font-semibold text-slate-900">
                    No bookings found
                </h3>

                <p class="mt-1 max-w-sm text-sm text-slate-400">
                    Bookings matching your current filters will appear here.
                </p>
            </div>

            <!-- Pagination -->
            <div
                class="flex flex-col gap-4 border-t border-slate-200 bg-slate-50/40 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
                <p class="text-xs text-slate-400">
                    Showing page
                    <span class="font-semibold text-slate-600">
                        {{ meta.page }}
                    </span>
                    of
                    <span class="font-semibold text-slate-600">
                        {{ meta.totalPages }}
                    </span>
                    · {{ meta.total }} total
                </p>

                <div class="flex items-center gap-2">
                    <button
                        type="button"
                        :disabled="page === 1"
                        @click="page--"
                        class="inline-flex h-9 w-9 items-center justify-center border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-30"
                        aria-label="Previous page"
                    >
                        <ChevronLeft class="h-4 w-4" />
                    </button>

                    <button
                        type="button"
                        :disabled="page >= meta.totalPages"
                        @click="page++"
                        class="inline-flex h-9 w-9 items-center justify-center border border-slate-200 bg-white text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-30"
                        aria-label="Next page"
                    >
                        <ChevronRight class="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
