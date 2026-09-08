<script setup lang="ts">
import {
    Calendar,
    Clock,
    TrendingUp,
    CalendarDays,
    Clock3,
    MoreVertical,
    ArrowRight,
    Search,
} from "lucide-vue-next";
import { format, isAfter, isBefore, parseISO } from "date-fns";

definePageMeta({
    middleware: "auth",
});

const { getBookingHistory } = useBookings();
const { data: bookingsResponse, pending, refresh } = await getBookingHistory();
const { favorites, loading: loadingFavorites, fetchFavorites } = useFavorites();
const { likes, fetchLikes } = useLikes();

onMounted(() => {
    fetchFavorites();
    fetchLikes();
});

const bookings = computed(() => bookingsResponse.value?.data || []);

const now = computed(() => new Date());

const upcomingBookings = computed(() => {
    return bookings.value
        .filter((booking) => {
            const date = parseISO(booking.date);
            const today =
                format(date, "yyyy-MM-dd") === format(now.value, "yyyy-MM-dd");

            return (
                isAfter(date, now.value) ||
                (today && booking.status === "CONFIRMED")
            );
        })
        .sort(
            (a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime(),
        );
});

const pastBookings = computed(() => {
    return bookings.value
        .filter((booking) => {
            const date = parseISO(booking.date);
            const today =
                format(date, "yyyy-MM-dd") === format(now.value, "yyyy-MM-dd");

            return isBefore(date, now.value) && !today;
        })
        .sort(
            (a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime(),
        );
});

const stats = computed(() => ({
    total: bookings.value.length,
    upcoming: upcomingBookings.value.length,
    today: bookings.value.filter((booking) => {
        return (
            format(parseISO(booking.date), "yyyy-MM-dd") ===
            format(now.value, "yyyy-MM-dd")
        );
    }).length,
}));

const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
        case "confirmed":
            return "bg-emerald-50 text-emerald-700 border-emerald-100";
        case "pending":
            return "bg-amber-50 text-amber-700 border-amber-100";
        case "cancelled":
            return "bg-red-50 text-red-700 border-red-100";
        case "completed":
            return "bg-blue-50 text-blue-700 border-blue-100";
        default:
            return "bg-slate-50 text-slate-700 border-slate-200";
    }
};

const cancelBooking = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    try {
        await $fetch(`/api/bookings/${id}`, {
            method: "PATCH",
            body: {
                status: "CANCELLED",
            },
        });

        await refresh();
    } catch (error) {
        console.error("Failed to cancel booking:", error);
    }
};
</script>

<template>
    <div class="min-h-full pt-20">
        <div
            class="pointer-events-none fixed inset-x-0 top-0 h-24 bg-gradient-to-b from-primary/[0.03] to-transparent"
        />

        <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <div class="space-y-6 lg:space-y-8">
                <!-- Page Header -->
                <header
                    class="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between"
                >
                    <div>
                        <h1
                            class="text-2xl font-semibold tracking-tight text-slate-900"
                        >
                            Dashboard
                        </h1>

                        <p class="mt-1 text-sm text-slate-500">
                            View and manage your upcoming appointments and
                            booking history.
                        </p>
                    </div>

                    <NuxtLink
                        to="/discover"
                        class="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                    >
                        Discover Businesses
                        <ArrowRight class="h-4 w-4" />
                    </NuxtLink>
                </header>

                <!-- Stats -->
                <section class="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div class="border border-slate-200 bg-white">
                        <div
                            class="flex items-center justify-between border-b border-slate-100 px-5 py-3"
                        >
                            <span class="text-xs font-medium text-slate-500">
                                Total Bookings
                            </span>

                            <div
                                class="flex h-8 w-8 items-center justify-center rounded-md bg-slate-50 text-primary"
                            >
                                <TrendingUp class="h-4 w-4" />
                            </div>
                        </div>

                        <div class="px-5 py-4">
                            <div
                                class="text-2xl font-semibold tracking-tight text-slate-900"
                            >
                                {{ stats.total }}
                            </div>

                            <p class="mt-1 text-xs text-slate-500">
                                All appointments
                            </p>
                        </div>
                    </div>

                    <div class="border border-slate-200 bg-white">
                        <div
                            class="flex items-center justify-between border-b border-slate-100 px-5 py-3"
                        >
                            <span class="text-xs font-medium text-slate-500">
                                Upcoming
                            </span>

                            <div
                                class="flex h-8 w-8 items-center justify-center rounded-md bg-slate-50 text-primary"
                            >
                                <CalendarDays class="h-4 w-4" />
                            </div>
                        </div>

                        <div class="px-5 py-4">
                            <div
                                class="text-2xl font-semibold tracking-tight text-slate-900"
                            >
                                {{ stats.upcoming }}
                            </div>

                            <p class="mt-1 text-xs text-slate-500">
                                Future appointments
                            </p>
                        </div>
                    </div>

                    <div class="border border-slate-200 bg-white">
                        <div
                            class="flex items-center justify-between border-b border-slate-100 px-5 py-3"
                        >
                            <span class="text-xs font-medium text-slate-500">
                                Today
                            </span>

                            <div
                                class="flex h-8 w-8 items-center justify-center rounded-md bg-slate-50 text-primary"
                            >
                                <Clock3 class="h-4 w-4" />
                            </div>
                        </div>

                        <div class="px-5 py-4">
                            <div
                                class="text-2xl font-semibold tracking-tight text-slate-900"
                            >
                                {{ stats.today }}
                            </div>

                            <p class="mt-1 text-xs text-slate-500">
                                Scheduled today
                            </p>
                        </div>
                    </div>
                </section>

                <!-- Favorites -->
                <section v-if="favorites.length > 0" class="border border-slate-200 bg-white">
                    <div class="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                        <div>
                            <h2 class="text-sm font-semibold text-slate-900">
                                Favorite Venues
                            </h2>
                            <p class="mt-0.5 text-xs text-slate-500">
                                Quick access to your favorite spots.
                            </p>
                        </div>
                        <NuxtLink to="/discover" class="text-xs font-medium text-primary hover:text-primary/80">
                            Explore more
                        </NuxtLink>
                    </div>

                    <div class="grid grid-cols-1 gap-px bg-slate-100 sm:grid-cols-2 lg:grid-cols-3">
                        <NuxtLink
                            v-for="venue in favorites"
                            :key="venue.id"
                            :to="`/venue/${venue.slug}`"
                            class="group bg-white p-5 transition-colors hover:bg-slate-50"
                        >
                            <div class="flex items-center gap-4">
                                <div class="h-12 w-12 shrink-0 overflow-hidden border border-slate-100 bg-slate-50">
                                    <img
                                        v-if="venue.media?.[0]?.url"
                                        :src="venue.media[0].url"
                                        class="h-full w-full object-cover"
                                    />
                                    <div v-else class="flex h-full w-full items-center justify-center text-slate-300">
                                        <Bookmark class="h-5 w-5" />
                                    </div>
                                </div>
                                <div class="min-w-0">
                                    <h3 class="truncate text-sm font-semibold text-slate-900 group-hover:text-primary">
                                        {{ venue.name }}
                                    </h3>
                                    <p class="mt-0.5 truncate text-xs text-slate-500">
                                        {{ venue.category?.name }} · {{ venue.address?.city }}
                                    </p>
                                </div>
                            </div>
                        </NuxtLink>
                    </div>
                </section>

                <!-- Likes -->
                <section v-if="likes.length > 0" class="border border-slate-200 bg-white">
                    <div class="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                        <div>
                            <h2 class="text-sm font-semibold text-slate-900">
                                Liked Venues
                            </h2>
                            <p class="mt-0.5 text-xs text-slate-500">
                                Venues you've appreciated.
                            </p>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 gap-px bg-slate-100 sm:grid-cols-2 lg:grid-cols-3">
                        <NuxtLink
                            v-for="venue in likes"
                            :key="venue.id"
                            :to="`/venue/${venue.slug}`"
                            class="group bg-white p-5 transition-colors hover:bg-slate-50"
                        >
                            <div class="flex items-center gap-4">
                                <div class="h-12 w-12 shrink-0 overflow-hidden border border-slate-100 bg-slate-50">
                                    <img
                                        v-if="venue.media?.[0]?.url"
                                        :src="venue.media[0].url"
                                        class="h-full w-full object-cover"
                                    />
                                    <div v-else class="flex h-full w-full items-center justify-center text-slate-300">
                                        <Heart class="h-5 w-5" />
                                    </div>
                                </div>
                                <div class="min-w-0 flex-1">
                                    <h3 class="truncate text-sm font-semibold text-slate-900 group-hover:text-primary">
                                        {{ venue.name }}
                                    </h3>
                                    <p class="mt-0.5 truncate text-xs text-slate-500">
                                        {{ venue.category?.name }} · {{ venue.address?.city }}
                                    </p>
                                </div>
                            </div>
                        </NuxtLink>
                    </div>
                </section>

                <!-- Communities -->
                <section v-if="dbUser?.communities?.length > 0" class="border border-slate-200 bg-white">
                    <div class="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                        <div>
                            <h2 class="text-sm font-semibold text-slate-900">
                                My Communities
                            </h2>
                            <p class="mt-0.5 text-xs text-slate-500">
                                Neighborhoods you've joined.
                            </p>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 gap-px bg-slate-100 sm:grid-cols-2 lg:grid-cols-3">
                        <NuxtLink
                            v-for="comm in dbUser.communities"
                            :key="comm.id"
                            :to="`/community/${comm.slug}`"
                            class="group bg-white p-5 transition-colors hover:bg-slate-50"
                        >
                            <div class="flex items-center gap-4">
                                <div class="h-12 w-12 shrink-0 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                    <MapPin class="h-5 w-5" />
                                </div>
                                <div class="min-w-0 flex-1">
                                    <h3 class="truncate text-sm font-bold text-slate-900 group-hover:text-primary">
                                        {{ comm.name }}
                                    </h3>
                                    <p class="mt-0.5 text-[10px] text-slate-400 uppercase tracking-widest">Joined Member</p>
                                </div>
                                <ArrowRight class="h-4 w-4 text-slate-200 group-hover:text-primary transition-colors" />
                            </div>
                        </NuxtLink>
                    </div>
                </section>

                <!-- Upcoming Bookings -->
                <section class="border border-slate-200 bg-white">
                    <div
                        class="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                        <div>
                            <h2 class="text-sm font-semibold text-slate-900">
                                Upcoming Bookings
                            </h2>

                            <p class="mt-0.5 text-xs text-slate-500">
                                Your next scheduled appointments.
                            </p>
                        </div>

                        <div
                            class="flex items-center gap-2 text-xs text-slate-400"
                        >
                            <Calendar class="h-3.5 w-3.5" />
                            {{ upcomingBookings.length }} booking{{
                                upcomingBookings.length === 1 ? "" : "s"
                            }}
                        </div>
                    </div>

                    <!-- Loading -->
                    <div
                        v-if="pending"
                        class="flex min-h-48 items-center justify-center"
                    >
                        <div
                            class="flex items-center gap-3 text-sm text-slate-500"
                        >
                            <div
                                class="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"
                            />
                            Loading bookings...
                        </div>
                    </div>

                    <!-- Bookings -->
                    <div
                        v-else-if="upcomingBookings.length > 0"
                        class="divide-y divide-slate-100"
                    >
                        <div
                            v-for="booking in upcomingBookings"
                            :key="booking.id"
                            class="px-5 py-5 transition-colors hover:bg-slate-50/60"
                        >
                            <div
                                class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
                            >
                                <div class="flex min-w-0 items-start gap-4">
                                    <div
                                        class="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-md bg-slate-100 font-semibold text-slate-500"
                                    >
                                        <img
                                            v-if="booking.venue.media?.[0]?.url"
                                            :src="booking.venue.media[0].url"
                                            :alt="booking.venue.name"
                                            class="h-full w-full object-cover"
                                        />

                                        <span v-else>
                                            {{ booking.venue.name.charAt(0) }}
                                        </span>
                                    </div>

                                    <div class="min-w-0">
                                        <div
                                            class="flex flex-wrap items-center gap-2"
                                        >
                                            <h3
                                                class="truncate text-sm font-semibold text-slate-900"
                                            >
                                                {{ booking.venue.name }}
                                            </h3>

                                            <span
                                                class="rounded border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
                                                :class="
                                                    getStatusColor(
                                                        booking.status,
                                                    )
                                                "
                                            >
                                                {{ booking.status }}
                                            </span>
                                        </div>

                                        <div
                                            class="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500"
                                        >
                                            <div
                                                class="flex items-center gap-1.5"
                                            >
                                                <Calendar
                                                    class="h-3.5 w-3.5 text-slate-400"
                                                />
                                                {{
                                                    format(
                                                        parseISO(booking.date),
                                                        "PPP",
                                                    )
                                                }}
                                            </div>

                                            <div
                                                class="flex items-center gap-1.5"
                                            >
                                                <Clock
                                                    class="h-3.5 w-3.5 text-slate-400"
                                                />
                                                {{ booking.startTime }}
                                            </div>

                                            <div
                                                v-if="booking.services?.length"
                                                class="font-medium text-primary"
                                            >
                                                {{
                                                    booking.services
                                                        .map(
                                                            (s) =>
                                                                s.service.name,
                                                        )
                                                        .join(", ")
                                                }}
                                            </div>
                                        </div>

                                        <div
                                            v-if="booking.notes"
                                            class="mt-3 border-l-2 border-slate-200 pl-3 text-xs text-slate-500"
                                        >
                                            {{ booking.notes }}
                                        </div>
                                    </div>
                                </div>

                                <div
                                    class="flex shrink-0 items-center gap-2 lg:pl-4"
                                >
                                    <NuxtLink
                                        :to="`/venue/${booking.venue.slug}`"
                                        class="inline-flex h-9 items-center justify-center rounded-md bg-slate-100 px-3 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-200"
                                    >
                                        View Business
                                    </NuxtLink>

                                    <button
                                        v-if="
                                            booking.status === 'PENDING' ||
                                            booking.status === 'CONFIRMED'
                                        "
                                        type="button"
                                        class="inline-flex h-9 items-center justify-center rounded-md border border-red-200 bg-white px-3 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
                                        @click="cancelBooking(booking.id)"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="button"
                                        class="flex h-9 w-9 items-center justify-center rounded-md border border-transparent text-slate-400 transition-colors hover:border-slate-200 hover:bg-slate-50 hover:text-slate-600"
                                    >
                                        <MoreVertical class="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Empty -->
                    <div
                        v-else
                        class="flex min-h-48 flex-col items-center justify-center px-6 text-center"
                    >
                        <div
                            class="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-slate-50 text-slate-400"
                        >
                            <CalendarDays class="h-5 w-5" />
                        </div>

                        <h3 class="text-sm font-medium text-slate-900">
                            No upcoming bookings
                        </h3>

                        <p class="mt-1 max-w-sm text-xs text-slate-500">
                            You don't have any upcoming appointments. Find a
                            business and make your next booking.
                        </p>

                        <NuxtLink
                            to="/discover"
                            class="mt-4 inline-flex h-9 items-center gap-2 rounded-md bg-primary px-3 text-xs font-medium text-white transition-opacity hover:opacity-90"
                        >
                            Discover Businesses
                            <ArrowRight class="h-3.5 w-3.5" />
                        </NuxtLink>
                    </div>
                </section>

                <!-- Recent History -->
                <section class="border border-slate-200 bg-white">
                    <div
                        class="flex items-center justify-between border-b border-slate-200 px-5 py-4"
                    >
                        <div>
                            <h2 class="text-sm font-semibold text-slate-900">
                                Recent History
                            </h2>

                            <p class="mt-0.5 text-xs text-slate-500">
                                Your latest completed and cancelled
                                appointments.
                            </p>
                        </div>
                    </div>

                    <div v-if="pastBookings.length > 0" class="overflow-x-auto">
                        <table class="w-full min-w-[640px] text-left">
                            <thead>
                                <tr
                                    class="border-b border-slate-100 bg-slate-50/70"
                                >
                                    <th
                                        class="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500"
                                    >
                                        Business
                                    </th>

                                    <th
                                        class="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500"
                                    >
                                        Date
                                    </th>

                                    <th
                                        class="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500"
                                    >
                                        Service
                                    </th>

                                    <th
                                        class="px-5 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-500"
                                    >
                                        Status
                                    </th>
                                </tr>
                            </thead>

                            <tbody class="divide-y divide-slate-100">
                                <tr
                                    v-for="booking in pastBookings.slice(0, 5)"
                                    :key="booking.id"
                                    class="transition-colors hover:bg-slate-50/50"
                                >
                                    <td class="px-5 py-4">
                                        <div class="flex items-center gap-3">
                                            <div
                                                class="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-md bg-slate-100 text-xs font-semibold text-slate-500"
                                            >
                                                <img
                                                    v-if="
                                                        booking.venue.media?.[0]
                                                            ?.url
                                                    "
                                                    :src="
                                                        booking.venue.media[0]
                                                            .url
                                                    "
                                                    :alt="booking.venue.name"
                                                    class="h-full w-full object-cover"
                                                />

                                                <span v-else>
                                                    {{
                                                        booking.venue.name.charAt(
                                                            0,
                                                        )
                                                    }}
                                                </span>
                                            </div>

                                            <span
                                                class="text-sm font-medium text-slate-900"
                                            >
                                                {{ booking.venue.name }}
                                            </span>
                                        </div>
                                    </td>

                                    <td
                                        class="px-5 py-4 text-xs text-slate-500"
                                    >
                                        {{
                                            format(
                                                parseISO(booking.date),
                                                "MMM d, yyyy",
                                            )
                                        }}
                                    </td>

                                    <td
                                        class="px-5 py-4 text-xs text-slate-500"
                                    >
                                        {{
                                            booking.services
                                                ?.map((s) => s.service.name)
                                                .join(", ")
                                        }}
                                    </td>

                                    <td class="px-5 py-4 text-right">
                                        <span
                                            class="inline-flex rounded border px-2 py-1 text-[10px] font-semibold uppercase tracking-wide"
                                            :class="
                                                getStatusColor(booking.status)
                                            "
                                        >
                                            {{ booking.status }}
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div
                        v-else
                        class="flex min-h-32 items-center justify-center px-6 text-center"
                    >
                        <p class="text-xs text-slate-500">
                            No booking history yet.
                        </p>
                    </div>
                </section>
            </div>
        </div>
    </div>
</template>
