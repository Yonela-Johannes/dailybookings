<script setup lang="ts">
import {
    Users,
    Store,
    CreditCard,
    TrendingUp,
    ShieldCheck,
    ArrowUpRight,
    ArrowDownRight,
    Calendar,
    CheckCircle2,
    Clock,
    UserPlus,
} from "lucide-vue-next";
import { format, parseISO } from "date-fns";
import Head from "~/components/head/Head.vue";

definePageMeta({
    layout: "admin",
    middleware: "auth",
});

const { data: adminStats, pending: statsPending } = useFetch("/api/admin");

const { data: pendingVenuesData, pending: venuesPending } = useFetch(
    "/api/admin/venues",
    {
        query: {
            status: "PENDING",
            limit: 5,
        },
    },
);

const stats = computed(() => [
    {
        label: "Total users",
        value: adminStats.value?.totalUsers?.toLocaleString() || "0",
        change: adminStats.value?.userChange || "0%",
        trend: (adminStats.value?.userChange || "").startsWith("-") ? "down" : "up",
        icon: Users,
        color: "text-blue-600",
        bg: "bg-blue-50",
        border: "border-blue-200",
    },
    {
        label: "Active businesses",
        value: adminStats.value?.totalVenues?.toLocaleString() || "0",
        change: adminStats.value?.venueChange || "0%",
        trend: (adminStats.value?.venueChange || "").startsWith("-") ? "down" : "up",
        icon: Store,
        color: "text-teal-600",
        bg: "bg-teal-50",
        border: "border-teal-200",
    },
    {
        label: "Total bookings",
        value: adminStats.value?.totalBookings?.toLocaleString() || "0",
        change: adminStats.value?.bookingChange || "0%",
        trend: (adminStats.value?.bookingChange || "").startsWith("-") ? "down" : "up",
        icon: Calendar,
        color: "text-purple-600",
        bg: "bg-purple-50",
        border: "border-purple-200",
    },
    {
        label: "Revenue",
        value: `R${(adminStats.value?.totalRevenue || 0).toLocaleString()}`,
        change: adminStats.value?.revenueChange || "0%",
        trend: (adminStats.value?.revenueChange || "").startsWith("-") ? "down" : "up",
        icon: TrendingUp,
        color: "text-amber-600",
        bg: "bg-amber-50",
        border: "border-amber-200",
    },
    {
        label: "Communities",
        value: adminStats.value?.totalCommunities?.toLocaleString() || "0",
        change: "+0",
        trend: "up",
        icon: MapPin,
        color: "text-rose-600",
        bg: "bg-rose-50",
        border: "border-rose-200",
    },
]);

const pendingVerifications = computed(
    () => pendingVenuesData.value?.venues || [],
);

const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
        case "CONFIRMED":
        case "COMPLETED":
        case "ACTIVE":
            return "text-teal-700 bg-teal-50 border-teal-200";

        case "PENDING":
            return "text-amber-700 bg-amber-50 border-amber-200";

        case "CANCELLED":
        case "SUSPENDED":
            return "text-red-700 bg-red-50 border-red-200";

        default:
            return "text-slate-500 bg-slate-50 border-slate-200";
    }
};
</script>

<template>
    <div class="space-y-8 pb-20">
        <Head
            title="Dashboard"
            description="See how DailyBookings is performing across users, businesses, bookings and revenue."
        />

        <!-- Overview -->
        <section class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
            <template v-if="statsPending">
                <div
                    v-for="i in 5"
                    :key="i"
                    class="h-40 animate-pulse border border-slate-200 bg-white"
                />
            </template>

            <article
                v-else
                v-for="stat in stats"
                :key="stat.label"
                class="group relative overflow-hidden border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-lg"
            >
                <div
                    class="absolute -right-5 -top-5 opacity-[0.035] transition-opacity duration-300 group-hover:opacity-[0.07]"
                >
                    <component :is="stat.icon" class="h-28 w-28 rotate-12" />
                </div>

                <div
                    class="relative z-10 flex items-start justify-between gap-4"
                >
                    <div
                        :class="[
                            'flex h-11 w-11 items-center justify-center border',
                            stat.bg,
                            stat.color,
                            stat.border,
                        ]"
                    >
                        <component :is="stat.icon" class="h-5 w-5" />
                    </div>

                    <div
                        :class="[
                            'inline-flex items-center gap-1 border px-2.5 py-1 text-[10px] font-semibold',
                            stat.trend === 'up'
                                ? 'border-teal-200 bg-teal-50 text-teal-700'
                                : 'border-red-200 bg-red-50 text-red-700',
                        ]"
                    >
                        <ArrowUpRight
                            v-if="stat.trend === 'up'"
                            class="h-3 w-3"
                        />

                        <ArrowDownRight v-else class="h-3 w-3" />

                        {{ stat.change }}
                    </div>
                </div>

                <div class="relative z-10 mt-7">
                    <div
                        class="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400"
                    >
                        {{ stat.label }}
                    </div>

                    <div
                        class="mt-1 text-3xl font-bold tracking-tight text-slate-900"
                    >
                        {{ stat.value }}
                    </div>
                </div>
            </article>
        </section>

        <!-- Main content -->
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <!-- Left -->
            <div class="space-y-6 lg:col-span-2">
                <!-- Pending businesses -->
                <section
                    class="overflow-hidden border border-slate-200 bg-white shadow-sm"
                >
                    <div
                        class="flex items-center justify-between border-b border-slate-200 bg-slate-50/50 p-6"
                    >
                        <div class="flex items-center gap-4">
                            <div
                                class="flex h-10 w-10 items-center justify-center border border-amber-200 bg-amber-50 text-amber-700"
                            >
                                <ShieldCheck class="h-5 w-5" />
                            </div>

                            <div>
                                <h2
                                    class="text-base font-semibold tracking-tight text-slate-900"
                                >
                                    Pending venues
                                </h2>

                                <p class="mt-0.5 text-xs text-slate-400">
                                    Venues waiting for approval
                                </p>
                            </div>
                        </div>

                        <NuxtLink
                            to="/admin/venues"
                            class="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500 transition-colors hover:text-slate-900"
                        >
                            View all
                        </NuxtLink>
                    </div>

                    <div v-if="venuesPending" class="space-y-3 p-6">
                        <div
                            v-for="i in 3"
                            :key="i"
                            class="h-20 animate-pulse bg-slate-50"
                        />
                    </div>

                    <div
                        v-else-if="pendingVerifications.length === 0"
                        class="flex min-h-[280px] flex-col items-center justify-center px-6 text-center"
                    >
                        <div
                            class="mb-5 flex h-14 w-14 items-center justify-center border border-slate-200 bg-slate-50"
                        >
                            <CheckCircle2 class="h-6 w-6 text-slate-300" />
                        </div>

                        <h3 class="text-base font-semibold text-slate-900">
                            Nothing to review
                        </h3>

                        <p class="mt-1 max-w-sm text-sm text-slate-400">
                            There are no businesses waiting for approval.
                        </p>
                    </div>

                    <div v-else class="divide-y divide-slate-100">
                        <div
                            v-for="venue in pendingVerifications"
                            :key="venue.id"
                            class="group flex items-center justify-between gap-6 p-6 transition-colors hover:bg-slate-50/60"
                        >
                            <div class="flex min-w-0 items-center gap-4">
                                <div
                                    class="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden border border-slate-200 bg-slate-50 text-lg font-bold text-slate-500"
                                >
                                    <img
                                        v-if="venue.media?.[0]?.url"
                                        :src="venue.media[0].url"
                                        :alt="venue.name"
                                        class="h-full w-full object-cover"
                                    />

                                    <template v-else>
                                        {{
                                            venue.name?.charAt(0)?.toUpperCase()
                                        }}
                                    </template>
                                </div>

                                <div class="min-w-0">
                                    <h3
                                        class="truncate text-sm font-semibold text-slate-900"
                                    >
                                        {{ venue.name }}
                                    </h3>

                                    <div
                                        class="mt-1 flex items-center gap-2 text-xs text-slate-400"
                                    >
                                        <span class="truncate">
                                            {{
                                                venue.business?.owner
                                                    ?.fullName || "No owner"
                                            }}
                                        </span>

                                        <span class="text-slate-200"> · </span>

                                        <span class="truncate">
                                            {{
                                                venue.category?.name ||
                                                "Uncategorised"
                                            }}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div class="flex shrink-0 items-center gap-4">
                                <div class="hidden text-right sm:block">
                                    <div
                                        class="flex items-center justify-end gap-1.5 text-xs text-slate-400"
                                    >
                                        <Clock class="h-3.5 w-3.5" />

                                        {{
                                            format(
                                                parseISO(venue.createdAt),
                                                "MMM d, yyyy",
                                            )
                                        }}
                                    </div>

                                    <div
                                        class="mt-1 text-[10px] text-slate-400"
                                    >
                                        Submitted
                                    </div>
                                </div>

                                <NuxtLink
                                    to="/admin/venues"
                                    class="inline-flex h-9 items-center border border-slate-800 bg-slate-900 px-4 text-[10px] font-semibold uppercase tracking-wide text-white transition-colors hover:bg-slate-800"
                                >
                                    Review
                                </NuxtLink>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Recent bookings -->
                <section
                    class="overflow-hidden border border-slate-200 bg-white shadow-sm"
                >
                    <div
                        class="flex items-center justify-between border-b border-slate-200 bg-slate-50/50 p-6"
                    >
                        <div class="flex items-center gap-4">
                            <div
                                class="flex h-10 w-10 items-center justify-center border border-purple-200 bg-purple-50 text-purple-700"
                            >
                                <CreditCard class="h-5 w-5" />
                            </div>

                            <div>
                                <h2
                                    class="text-base font-semibold tracking-tight text-slate-900"
                                >
                                    Recent bookings
                                </h2>

                                <p class="mt-0.5 text-xs text-slate-400">
                                    Latest booking activity
                                </p>
                            </div>
                        </div>

                        <NuxtLink
                            to="/admin/bookings"
                            class="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500 transition-colors hover:text-slate-900"
                        >
                            View all
                        </NuxtLink>
                    </div>

                    <div class="overflow-x-auto">
                        <table class="w-full min-w-[700px] text-left">
                            <thead>
                                <tr
                                    class="border-b border-slate-200 bg-slate-50/40"
                                >
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
                                        Total
                                    </th>

                                    <th
                                        class="px-6 py-4 text-right text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400"
                                    >
                                        Status
                                    </th>
                                </tr>
                            </thead>

                            <tbody class="divide-y divide-slate-100">
                                <tr
                                    v-for="booking in adminStats?.recentBookings"
                                    :key="booking.id"
                                    class="group transition-colors hover:bg-slate-50/60"
                                >
                                    <td class="px-6 py-5">
                                        <div
                                            class="text-sm font-medium text-slate-900"
                                        >
                                            {{
                                                booking.user?.fullName ||
                                                "Guest"
                                            }}
                                        </div>

                                        <div
                                            class="mt-1 text-xs text-slate-400"
                                        >
                                            {{ booking.user?.email }}
                                        </div>
                                    </td>

                                    <td class="px-6 py-5">
                                        <div
                                            class="text-sm font-medium text-slate-700"
                                        >
                                            {{ booking.venue?.name }}
                                        </div>

                                        <div
                                            class="mt-1 text-xs text-slate-400"
                                        >
                                            {{
                                                format(
                                                    parseISO(booking.date),
                                                    "MMM d",
                                                )
                                            }}
                                            ·
                                            {{ booking.startTime }}
                                        </div>
                                    </td>

                                    <td class="px-6 py-5">
                                        <span
                                            class="text-sm font-semibold text-slate-900"
                                        >
                                            R{{
                                                Number(
                                                    booking.priceTotal,
                                                ).toLocaleString()
                                            }}
                                        </span>
                                    </td>

                                    <td class="px-6 py-5 text-right">
                                        <span
                                            :class="[
                                                'inline-flex border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide',
                                                getStatusColor(booking.status),
                                            ]"
                                        >
                                            {{ booking.status }}
                                        </span>
                                    </td>
                                </tr>

                                <tr v-if="!adminStats?.recentBookings?.length">
                                    <td
                                        colspan="4"
                                        class="px-6 py-16 text-center text-sm text-slate-400"
                                    >
                                        No recent bookings.
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>

            <!-- Right -->
            <div class="space-y-6">
                <!-- Platform status -->
                <section class="border border-slate-200 bg-white p-6 shadow-sm">
                    <div class="mb-6">
                        <h2
                            class="text-base font-semibold tracking-tight text-slate-900"
                        >
                            Platform status
                        </h2>

                        <p class="mt-1 text-xs text-slate-400">
                            Current platform services
                        </p>
                    </div>

                    <div class="space-y-5">
                        <div class="flex items-center justify-between gap-4">
                            <div class="flex items-center gap-3">
                                <div
                                    class="flex h-9 w-9 items-center justify-center border border-teal-200 bg-teal-50 text-teal-700"
                                >
                                    <ShieldCheck class="h-4 w-4" />
                                </div>

                                <span
                                    class="text-sm font-medium text-slate-700"
                                >
                                    Security
                                </span>
                            </div>

                            <span class="text-xs font-semibold text-teal-700">
                                Operational
                            </span>
                        </div>

                        <div class="flex items-center justify-between gap-4">
                            <div class="flex items-center gap-3">
                                <div
                                    class="flex h-9 w-9 items-center justify-center border border-blue-200 bg-blue-50 text-blue-700"
                                >
                                    <Store class="h-4 w-4" />
                                </div>

                                <span
                                    class="text-sm font-medium text-slate-700"
                                >
                                    Business listings
                                </span>
                            </div>

                            <span class="text-xs font-semibold text-blue-700">
                                Synced
                            </span>
                        </div>
                    </div>
                </section>

                <!-- Recent users -->
                <section
                    class="overflow-hidden border border-slate-200 bg-white shadow-sm"
                >
                    <div
                        class="flex items-center justify-between border-b border-slate-200 bg-slate-50/50 p-6"
                    >
                        <div>
                            <h2
                                class="text-base font-semibold tracking-tight text-slate-900"
                            >
                                Recent users
                            </h2>

                            <p class="mt-1 text-xs text-slate-400">
                                Latest accounts created
                            </p>
                        </div>

                        <UserPlus class="h-4 w-4 text-slate-400" />
                    </div>

                    <div class="divide-y divide-slate-100">
                        <div
                            v-for="user in adminStats?.recentUsers"
                            :key="user.id"
                            class="flex items-center gap-3 p-5 transition-colors hover:bg-slate-50/60"
                        >
                            <div
                                class="flex h-10 w-10 shrink-0 items-center justify-center border border-slate-200 bg-slate-50 text-sm font-bold uppercase text-slate-500"
                            >
                                {{ user.fullName?.[0] || user.email?.[0] }}
                            </div>

                            <div class="min-w-0 flex-1">
                                <div
                                    class="truncate text-sm font-medium text-slate-900"
                                >
                                    {{ user.fullName || "Unnamed user" }}
                                </div>

                                <div
                                    class="mt-0.5 truncate text-xs text-slate-400"
                                >
                                    {{ user.role }}
                                </div>
                            </div>

                            <div class="text-right text-xs text-slate-400">
                                {{ format(parseISO(user.createdAt), "HH:mm") }}
                            </div>
                        </div>

                        <div
                            v-if="!adminStats?.recentUsers?.length"
                            class="px-6 py-12 text-center text-sm text-slate-400"
                        >
                            No recent users.
                        </div>
                    </div>

                    <NuxtLink
                        to="/admin/users"
                        class="block border-t border-slate-200 bg-slate-50/50 px-6 py-4 text-center text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                    >
                        Manage users
                    </NuxtLink>
                </section>

                <!-- Growth -->
                <section class="border border-slate-200 bg-white p-6 shadow-sm">
                    <div class="mb-7 flex items-center justify-between">
                        <div>
                            <h2
                                class="text-base font-semibold tracking-tight text-slate-900"
                            >
                                Growth
                            </h2>

                            <p class="mt-1 text-xs text-slate-400">
                                Recent platform activity
                            </p>
                        </div>

                        <TrendingUp class="h-4 w-4 text-teal-600" />
                    </div>

                    <div
                        class="flex h-40 items-end gap-2 border-b border-slate-100 px-1"
                    >
                        <div
                            v-for="(height, index) in (adminStats?.growthPercentages || [35, 65, 45, 85, 55, 95, 75])"
                            :key="index"
                            class="group relative flex-1 bg-teal-50 transition-colors hover:bg-teal-100"
                            :style="{
                                height: `${height}%`,
                            }"
                        >
                            <div
                                class="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 border border-slate-200 bg-slate-900 px-2 py-1 text-[9px] font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100"
                            >
                                {{ height }}%
                            </div>
                        </div>
                    </div>

                    <div
                        class="flex justify-between pt-4 text-[10px] font-medium text-slate-400"
                    >
                        <span>7 days ago</span>
                        <span>Today</span>
                    </div>
                </section>
            </div>
        </div>
    </div>
</template>
