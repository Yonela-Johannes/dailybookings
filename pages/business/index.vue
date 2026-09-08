<script setup lang="ts">
import {
    Calendar,
    Users,
    TrendingUp,
    Clock,
    ChevronRight,
    MoreVertical,
    Plus,
    ArrowUpRight,
    DollarSign,
    Star,
    CheckCircle2,
    AlertCircle,
    Scissors,
    Settings,
    MessageSquare,
} from "lucide-vue-next";

definePageMeta({
    layout: "business",
    middleware: "auth",
});

const { data: businessData, pending, error } = useFetch("/api/business");

const stats = computed(() => [
    {
        label: "Today's Bookings",
        value: businessData.value?.todayBookingsCount || 0,
        change: businessData.value?.bookingsChange || "0%",
        trend: (businessData.value?.bookingsChange || "").startsWith("-") ? "down" : "up",
        icon: Calendar,
    },
    {
        label: "Today's Revenue",
        value: `R${Number(
            businessData.value?.todayRevenue || 0,
        ).toLocaleString()}`,
        change: businessData.value?.revenueChange || "0%",
        trend: (businessData.value?.revenueChange || "").startsWith("-") ? "down" : "up",
        icon: DollarSign,
    },
    {
        label: "Total Bookings",
        value: businessData.value?.totalBookingsCount || 0,
        change: "+5%",
        trend: "up",
        icon: Users,
    },
    {
        label: "Reputation",
        value: businessData.value?.reputation || "0.0",
        change: businessData.value?.reputationChange || "0.0",
        trend: (businessData.value?.reputationChange || "").startsWith("-") ? "down" : "up",
        icon: Star,
    },
]);

const upcomingBookings = computed(
    () => businessData.value?.upcomingBookings || [],
);

const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
        case "CONFIRMED":
            return "border-emerald-100 bg-emerald-50 text-emerald-700";
        case "PENDING":
            return "border-amber-100 bg-amber-50 text-amber-700";
        case "CANCELLED":
            return "border-rose-100 bg-rose-50 text-rose-700";
        default:
            return "border-slate-100 bg-slate-50 text-slate-600";
    }
};
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
                    Business Overview
                </div>

                <h1
                    class="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl"
                >
                    Dashboard
                </h1>

                <p class="mt-1.5 text-sm text-slate-500">
                    Monitor bookings, revenue and business activity.
                </p>
            </div>

            <div class="flex flex-wrap items-center gap-2">
                <NuxtLink
                    v-if="businessData?.mainVenueSlug"
                    :to="`/venue/${businessData.mainVenueSlug}`"
                    target="_blank"
                    class="inline-flex h-10 items-center gap-2 border border-slate-200 bg-white px-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
                >
                    View Live Site
                </NuxtLink>

                <NuxtLink
                    to="/business/calendar"
                    class="inline-flex h-10 items-center gap-2 bg-primary px-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-slate-900"
                >
                    <Plus class="h-4 w-4" />
                    New Booking
                </NuxtLink>
            </div>
        </div>

        <div
            v-if="error"
            class="flex items-center gap-4 border border-rose-100 bg-rose-50 p-5"
        >
            <AlertCircle class="h-5 w-5 shrink-0 text-rose-500" />

            <div>
                <h3 class="text-sm font-semibold text-rose-900">
                    Unable to load business data
                </h3>

                <p class="mt-1 text-xs text-rose-700">
                    Please refresh the page and try again.
                </p>
            </div>
        </div>

        <div
            v-else-if="!pending && !businessData?.mainVenueSlug"
            class="border border-dashed border-slate-300 bg-white px-6 py-20 text-center"
        >
            <div
                class="mx-auto flex h-16 w-16 items-center justify-center border border-slate-200 bg-slate-50"
            >
                <Store class="h-8 w-8 text-slate-300" />
            </div>

            <h2 class="mt-6 text-xl font-bold text-slate-900">
                Set up your business
            </h2>

            <p class="mx-auto mt-2 max-w-sm text-sm text-slate-500">
                You haven't registered a business venue yet. Create your first
                listing to start accepting bookings.
            </p>

            <UiButton
                label="Register My Business"
                to="/business/venues/new"
                class="mt-8 bg-primary text-white hover:bg-slate-900"
            />
        </div>

        <div
            v-else
            class="grid grid-cols-1 gap-px overflow-hidden border border-slate-200 bg-slate-200 sm:grid-cols-2 lg:grid-cols-4"
        >
            <template v-if="pending">
                <div v-for="i in 4" :key="i" class="animate-pulse bg-white p-6">
                    <div class="mb-5 h-9 w-9 bg-slate-100" />
                    <div class="mb-2 h-3 w-24 bg-slate-100" />
                    <div class="h-7 w-16 bg-slate-100" />
                </div>
            </template>

            <div
                v-else
                v-for="stat in stats"
                :key="stat.label"
                class="group bg-white p-6 transition-colors hover:bg-slate-50/50"
            >
                <div class="mb-6 flex items-start justify-between">
                    <div
                        class="flex h-9 w-9 items-center justify-center border border-slate-200 bg-slate-50 text-slate-500 transition-colors group-hover:border-primary/20 group-hover:bg-primary/5 group-hover:text-primary"
                    >
                        <component :is="stat.icon" class="h-4 w-4" />
                    </div>

                    <div
                        class="flex items-center gap-1 border border-emerald-100 bg-emerald-50 px-2 py-1 text-[9px] font-semibold text-emerald-700"
                    >
                        <ArrowUpRight class="h-3 w-3" />
                        {{ stat.change }}
                    </div>
                </div>

                <div
                    class="mb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400"
                >
                    {{ stat.label }}
                </div>

                <div class="text-2xl font-bold tracking-tight text-slate-950">
                    {{ stat.value }}
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <section
                class="min-w-0 border border-slate-200 bg-white xl:col-span-2"
            >
                <div
                    class="flex items-center justify-between border-b border-slate-200 px-6 py-5"
                >
                    <div>
                        <h2 class="text-sm font-semibold text-slate-950">
                            Upcoming Bookings
                        </h2>

                        <p class="mt-1 text-xs text-slate-400">
                            Your next scheduled appointments.
                        </p>
                    </div>

                    <NuxtLink
                        to="/business/calendar"
                        class="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-primary transition-colors hover:text-slate-900"
                    >
                        View calendar
                        <ChevronRight class="h-3.5 w-3.5" />
                    </NuxtLink>
                </div>

                <div v-if="pending" class="divide-y divide-slate-100">
                    <div
                        v-for="i in 4"
                        :key="i"
                        class="flex animate-pulse items-center gap-4 px-6 py-5"
                    >
                        <div class="h-11 w-11 bg-slate-100" />

                        <div class="flex-1">
                            <div class="mb-2 h-3 w-32 bg-slate-100" />
                            <div class="h-2.5 w-48 bg-slate-100" />
                        </div>

                        <div class="h-6 w-16 bg-slate-100" />
                    </div>
                </div>

                <div
                    v-else-if="upcomingBookings.length === 0"
                    class="flex min-h-[280px] flex-col items-center justify-center px-6 text-center"
                >
                    <div
                        class="mb-4 flex h-12 w-12 items-center justify-center border border-slate-200 bg-slate-50"
                    >
                        <Calendar class="h-5 w-5 text-slate-300" />
                    </div>

                    <h3 class="text-sm font-semibold text-slate-900">
                        No upcoming bookings
                    </h3>

                    <p class="mt-1 max-w-xs text-xs text-slate-400">
                        New appointments will appear here once they are
                        scheduled.
                    </p>
                </div>

                <div v-else class="divide-y divide-slate-100">
                    <div
                        v-for="booking in upcomingBookings"
                        :key="booking.id"
                        class="group flex items-center gap-4 px-6 py-5 transition-colors hover:bg-slate-50/60"
                    >
                        <div
                            class="flex h-12 w-12 shrink-0 flex-col items-center justify-center border border-slate-200 bg-slate-50"
                        >
                            <span class="text-xs font-bold text-slate-900">
                                {{ booking.startTime?.split(":")[0] }}
                            </span>

                            <span
                                class="text-[9px] font-medium uppercase text-slate-400"
                            >
                                {{ booking.startTime?.split(":")[1] }}
                            </span>
                        </div>

                        <div class="min-w-0 flex-1">
                            <h3
                                class="truncate text-sm font-semibold text-slate-900"
                            >
                                {{
                                    booking.user?.fullName || "Anonymous Client"
                                }}
                            </h3>

                            <div
                                class="mt-1 flex flex-wrap items-center gap-2 text-[10px] text-slate-400"
                            >
                                <span class="truncate">
                                    {{
                                        booking.services
                                            ?.map(
                                                (service) =>
                                                    service.service.name,
                                            )
                                            .join(", ") || "Service"
                                    }}
                                </span>

                                <span
                                    class="h-1 w-1 rounded-full bg-slate-300"
                                />

                                <span>
                                    R{{
                                        Number(
                                            booking.priceTotal || 0,
                                        ).toLocaleString()
                                    }}
                                </span>
                            </div>
                        </div>

                        <div class="hidden shrink-0 items-center gap-3 sm:flex">
                            <span
                                :class="[
                                    'border px-2 py-1 text-[9px] font-semibold uppercase tracking-wide',
                                    getStatusColor(booking.status),
                                ]"
                            >
                                {{ booking.status }}
                            </span>

                            <NuxtLink
                                to="/business/calendar"
                                class="flex h-8 w-8 items-center justify-center border border-transparent text-slate-400 transition-colors hover:border-slate-200 hover:bg-white hover:text-slate-900"
                                aria-label="View booking"
                            >
                                <ChevronRight class="h-4 w-4" />
                            </NuxtLink>
                        </div>

                        <button
                            type="button"
                            class="flex h-8 w-8 shrink-0 items-center justify-center text-slate-300 transition-colors hover:bg-slate-100 hover:text-slate-900 sm:hidden"
                            aria-label="Booking actions"
                        >
                            <MoreVertical class="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </section>

            <aside class="space-y-6">
                <section class="border border-slate-200 bg-white">
                    <div class="border-b border-slate-200 px-6 py-5">
                        <h2 class="text-sm font-semibold text-slate-950">
                            Quick Actions
                        </h2>

                        <p class="mt-1 text-xs text-slate-400">
                            Manage your business.
                        </p>
                    </div>

                    <div class="grid grid-cols-2 gap-px bg-slate-200">
                        <NuxtLink
                            to="/business/calendar"
                            class="group bg-white p-5 transition-colors hover:bg-slate-50"
                        >
                            <Calendar
                                class="mb-4 h-5 w-5 text-slate-400 transition-colors group-hover:text-primary"
                            />

                            <span
                                class="block text-xs font-semibold text-slate-700"
                            >
                                Calendar
                            </span>

                            <span class="mt-1 block text-[10px] text-slate-400">
                                Manage bookings
                            </span>
                        </NuxtLink>

                        <NuxtLink
                            to="/business/services"
                            class="group bg-white p-5 transition-colors hover:bg-slate-50"
                        >
                            <Scissors
                                class="mb-4 h-5 w-5 text-slate-400 transition-colors group-hover:text-primary"
                            />

                            <span
                                class="block text-xs font-semibold text-slate-700"
                            >
                                Services
                            </span>

                            <span class="mt-1 block text-[10px] text-slate-400">
                                Manage services
                            </span>
                        </NuxtLink>

                        <NuxtLink
                            to="/business/team"
                            class="group bg-white p-5 transition-colors hover:bg-slate-50"
                        >
                            <Users
                                class="mb-4 h-5 w-5 text-slate-400 transition-colors group-hover:text-primary"
                            />

                            <span
                                class="block text-xs font-semibold text-slate-700"
                            >
                                Team
                            </span>

                            <span class="mt-1 block text-[10px] text-slate-400">
                                Manage staff
                            </span>
                        </NuxtLink>

                        <NuxtLink
                            to="/business/reviews"
                            class="group bg-white p-5 transition-colors hover:bg-slate-50"
                        >
                            <MessageSquare
                                class="mb-4 h-5 w-5 text-slate-400 transition-colors group-hover:text-primary"
                            />

                            <span
                                class="block text-xs font-semibold text-slate-700"
                            >
                                Reviews
                            </span>

                            <span class="mt-1 block text-[10px] text-slate-400">
                                View feedback
                            </span>
                        </NuxtLink>
                    </div>
                </section>

                <section class="border border-slate-200 bg-white">
                    <div class="flex items-start gap-4 p-6">
                        <div
                            class="flex h-9 w-9 shrink-0 items-center justify-center border border-emerald-100 bg-emerald-50"
                        >
                            <CheckCircle2 class="h-4 w-4 text-emerald-600" />
                        </div>

                        <div>
                            <h3 class="text-xs font-semibold text-slate-900">
                                Business status
                            </h3>

                            <p
                                class="mt-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-600"
                            >
                                Operating normally
                            </p>

                            <p
                                class="mt-3 text-xs leading-relaxed text-slate-400"
                            >
                                Your business is active and available for
                                customer bookings.
                            </p>
                        </div>
                    </div>
                </section>

                <NuxtLink
                    to="/business/settings"
                    class="group flex items-center justify-between border border-slate-200 bg-white px-6 py-4 transition-colors hover:bg-slate-50"
                >
                    <div class="flex items-center gap-3">
                        <Settings
                            class="h-4 w-4 text-slate-400 group-hover:text-primary"
                        />

                        <span class="text-xs font-semibold text-slate-700">
                            Business settings
                        </span>
                    </div>

                    <ChevronRight
                        class="h-4 w-4 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-600"
                    />
                </NuxtLink>
            </aside>
        </div>
    </div>
</template>
