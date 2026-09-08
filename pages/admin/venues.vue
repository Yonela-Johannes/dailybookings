<script setup lang="ts">
import {
    Search,
    MoreVertical,
    CheckCircle2,
    XCircle,
    ExternalLink,
    MapPin,
    Star,
    Loader2,
    ShieldCheck,
    ChevronLeft,
    ChevronRight,
    Filter,
    Store,
    Trash2,
} from "lucide-vue-next";
import { format, parseISO } from "date-fns";
import Head from "~/components/head/Head.vue";

definePageMeta({
    layout: "admin",
    middleware: "auth",
});

const search = ref("");
const statusFilter = ref("");
const page = ref(1);

const {
    data: venuesData,
    pending,
    refresh,
} = useFetch("/api/admin/venues", {
    query: {
        search,
        status: statusFilter,
        page,
        limit: 10,
    },
    watch: [search, statusFilter, page],
});

const venues = computed(() => venuesData.value?.venues || []);

const meta = computed(
    () =>
        venuesData.value?.meta || {
            total: 0,
            page: 1,
            totalPages: 1,
        },
);

const { data: communitiesRes } = await useFetch<any>("/api/admin/communities", { query: { limit: 100 } });
const communities = computed(() => communitiesRes.value?.data || []);

const updateCommunity = async (venueId: string, communityId: string | null) => {
    try {
        await $fetch(`/api/admin/venues/${venueId}/verify`, {
            method: "PATCH",
            body: { communityId },
        });

        refresh();
    } catch (error) {
        console.error("Failed to update venue community:", error);
    }
};

const getStatusStyles = (status: string) => {
    switch (status?.toUpperCase()) {
        case "ACTIVE":
            return "bg-teal-50 text-teal-700 border-teal-200";

        case "PENDING":
            return "bg-amber-50 text-amber-700 border-amber-200";

        case "SUSPENDED":
            return "bg-red-50 text-red-700 border-red-200";

        default:
            return "bg-slate-50 text-slate-600 border-slate-200";
    }
};

const updateStatus = async (venueId: string, status: string) => {
    try {
        await $fetch(`/api/admin/venues/${venueId}/verify`, {
            method: "PATCH",
            body: { status },
        });

        refresh();
    } catch (error) {
        console.error("Failed to update venue status:", error);
    }
};

const toggleVerification = async (venueId: string, verified: boolean) => {
    try {
        await $fetch(`/api/admin/venues/${venueId}/verify`, {
            method: "PATCH",
            body: { verified },
        });

        refresh();
    } catch (error) {
        console.error("Failed to update venue verification:", error);
    }
};

const handleDelete = async (id: string) => {
    if (
        !confirm(
            "Are you sure you want to delete this business? This action is permanent.",
        )
    ) {
        return;
    }

    try {
        await $fetch(`/api/admin/venues/${id}`, {
            method: "DELETE",
        });

        refresh();
    } catch (error) {
        console.error("Failed to delete venue:", error);
    }
};
</script>

<template>
    <div class="space-y-8 p-20 ">
        <!-- Page Header -->
        <Head
            title="Venues"
            description="Manage business venues, verification and availability across DailyBookings"
        />

        <!-- Summary -->
        <div
            class="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between"
        >
            <div class="flex items-center gap-3">
                <div
                    class="border border-slate-200 bg-white px-4 py-2.5 text-[11px] font-semibold text-slate-600"
                >
                    {{ meta.total }} venues
                </div>

                <div
                    class="hidden border border-slate-200 bg-white px-4 py-2.5 text-[11px] font-medium text-slate-400 sm:block"
                >
                    Page {{ meta.page }} of {{ meta.totalPages }}
                </div>
            </div>
        </div>

        <!-- Main -->
        <div class="overflow-hidden border border-slate-200 bg-white shadow-sm">
            <!-- Filters -->
            <div
                class="flex flex-col gap-4 border-b border-slate-200 bg-slate-50/40 p-5 lg:flex-row lg:items-end"
            >
                <div class="w-full max-w-xl">
                    <label
                        for="business-search"
                        class="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400"
                    >
                        Search businesses
                    </label>

                    <div class="relative">
                        <Search
                            class="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            id="business-search"
                            v-model="search"
                            type="text"
                            placeholder="Search by business name or slug..."
                            class="h-10 w-full border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-slate-400"
                        />
                    </div>
                </div>

                <div class="flex gap-3">
                    <div class="flex-1 lg:w-56 lg:flex-none">
                        <label
                            for="status-filter"
                            class="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400"
                        >
                            Status
                        </label>

                        <select
                            id="status-filter"
                            v-model="statusFilter"
                            class="h-10 w-full border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-slate-400"
                        >
                            <option value="">All businesses</option>
                            <option value="ACTIVE">Active</option>
                            <option value="PENDING">Pending</option>
                            <option value="SUSPENDED">Suspended</option>
                        </select>
                    </div>

                    <button
                        type="button"
                        @click="refresh"
                        class="mt-auto inline-flex h-10 w-10 shrink-0 items-center justify-center border border-slate-200 bg-white text-slate-500 transition-colors hover:border-slate-300 hover:bg-slate-50"
                        aria-label="Refresh businesses"
                    >
                        <Filter class="h-4 w-4" />
                    </button>
                </div>
            </div>

            <!-- Loading -->
            <div
                v-if="pending"
                class="flex min-h-[520px] items-center justify-center"
            >
                <Loader2 class="h-6 w-6 animate-spin text-slate-400" />
            </div>

            <!-- Table -->
            <div v-else-if="venues.length" class="overflow-x-auto">
                <table class="w-full min-w-[1100px] text-left">
                    <thead>
                        <tr class="border-b border-slate-200 bg-slate-50/60">
                            <th
                                class="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400"
                            >
                                Business
                            </th>

                            <th
                                class="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400"
                            >
                                Owner
                            </th>

                            <th
                                class="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400"
                            >
                                Community
                            </th>

                            <th
                                class="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400"
                            >
                                Status
                            </th>

                            <th
                                class="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400"
                            >
                                Performance
                            </th>

                            <th
                                class="px-6 py-4 text-right text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400"
                            >
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody class="divide-y divide-slate-100">
                        <tr
                            v-for="venue in venues"
                            :key="venue.id"
                            class="group transition-colors hover:bg-slate-50/60"
                        >
                            <!-- Business -->
                            <td class="px-6 py-5">
                                <div class="flex items-center gap-4">
                                    <div
                                        class="h-12 w-12 shrink-0 overflow-hidden border border-slate-200 bg-slate-50"
                                    >
                                        <img
                                            v-if="venue.media?.[0]?.url"
                                            :src="venue.media[0].url"
                                            :alt="venue.name"
                                            class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />

                                        <div
                                            v-else
                                            class="flex h-full w-full items-center justify-center text-sm font-bold text-slate-400"
                                        >
                                            {{
                                                venue.name
                                                    ?.charAt(0)
                                                    ?.toUpperCase()
                                            }}
                                        </div>
                                    </div>

                                    <div class="min-w-0">
                                        <div class="flex items-center gap-2">
                                            <div
                                                class="max-w-[260px] truncate text-sm font-semibold text-slate-900"
                                            >
                                                {{ venue.name }}
                                            </div>

                                            <NuxtLink
                                                :to="`/venue/${venue.slug}`"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                class="shrink-0 text-slate-400 transition-colors hover:text-slate-900"
                                                title="View public page"
                                            >
                                                <ExternalLink
                                                    class="h-3.5 w-3.5"
                                                />
                                            </NuxtLink>
                                        </div>

                                        <div
                                            class="mt-1 flex items-center gap-2 text-xs text-slate-400"
                                        >
                                            <MapPin
                                                class="h-3.5 w-3.5 shrink-0"
                                            />

                                            <span>
                                                {{
                                                    venue.address?.city ||
                                                    "Location unavailable"
                                                }}
                                            </span>

                                            <span class="text-slate-200">
                                                ·
                                            </span>

                                            <span
                                                class="max-w-[140px] truncate"
                                            >
                                                {{
                                                    venue.category?.name ||
                                                    "Uncategorised"
                                                }}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </td>

                            <!-- Owner -->
                            <td class="px-6 py-5">
                                <div class="max-w-[220px]">
                                    <div
                                        class="truncate text-sm font-medium text-slate-800"
                                    >
                                        {{
                                            venue.business?.owner?.fullName ||
                                            "No owner"
                                        }}
                                    </div>

                                    <div
                                        class="mt-1 truncate text-xs text-slate-400"
                                    >
                                        {{
                                            venue.business?.owner?.email || "—"
                                        }}
                                    </div>
                                </div>
                            </td>

                            <!-- Community -->
                            <td class="px-6 py-5">
                                <div class="max-w-[180px]">
                                    <select
                                        :value="venue.communityId || ''"
                                        @change="updateCommunity(venue.id, ($event.target as HTMLSelectElement).value || null)"
                                        class="h-9 w-full border border-slate-200 bg-white px-2 text-xs outline-none focus:border-primary"
                                    >
                                        <option value="">No community</option>
                                        <option v-for="comm in communities" :key="comm.id" :value="comm.id">{{ comm.name }}</option>
                                    </select>
                                </div>
                            </td>

                            <!-- Status -->
                            <td class="px-6 py-5">
                                <div class="space-y-2.5">
                                    <span
                                        :class="[
                                            'inline-flex border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide',
                                            getStatusStyles(venue.status),
                                        ]"
                                    >
                                        {{ venue.status }}
                                    </span>

                                    <button
                                        type="button"
                                        @click="
                                            toggleVerification(
                                                venue.id,
                                                !venue.business?.verified,
                                            )
                                        "
                                        :class="[
                                            'flex items-center gap-1.5 text-xs font-medium transition-colors',
                                            venue.business?.verified
                                                ? 'text-teal-700 hover:text-teal-800'
                                                : 'text-slate-400 hover:text-slate-700',
                                        ]"
                                    >
                                        <ShieldCheck class="h-3.5 w-3.5" />

                                        {{
                                            venue.business?.verified
                                                ? "Verified"
                                                : "Verify business"
                                        }}
                                    </button>
                                </div>
                            </td>

                            <!-- Performance -->
                            <td class="px-6 py-5">
                                <div class="flex items-center gap-4">
                                    <div>
                                        <div
                                            class="text-sm font-semibold text-slate-900"
                                        >
                                            {{ venue._count?.bookings || 0 }}
                                            <span
                                                class="font-normal text-slate-400"
                                            >
                                                bookings
                                            </span>
                                        </div>

                                        <div
                                            class="mt-1 text-xs text-slate-400"
                                        >
                                            {{ venue._count?.reviews || 0 }}
                                            reviews
                                        </div>
                                    </div>

                                    <div class="h-8 w-px bg-slate-200"></div>

                                    <div class="flex items-center gap-1.5">
                                        <Star
                                            class="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                                        />

                                        <span
                                            class="text-sm font-semibold text-slate-800"
                                        >
                                            {{
                                                Number(
                                                    venue.rating || 0,
                                                ).toFixed(1)
                                            }}
                                        </span>
                                    </div>
                                </div>
                            </td>

                            <!-- Actions -->
                            <td class="px-6 py-5">
                                <div
                                    class="flex items-center justify-end gap-2"
                                >
                                    <button
                                        v-if="
                                            venue.status === 'PENDING' ||
                                            venue.status === 'SUSPENDED'
                                        "
                                        type="button"
                                        @click="
                                            updateStatus(venue.id, 'ACTIVE')
                                        "
                                        class="inline-flex h-9 w-9 items-center justify-center border border-teal-200 bg-white text-teal-600 transition-colors hover:bg-teal-50"
                                        title="Activate business"
                                        aria-label="Activate business"
                                    >
                                        <CheckCircle2 class="h-4 w-4" />
                                    </button>

                                    <button
                                        v-if="venue.status !== 'SUSPENDED'"
                                        type="button"
                                        @click="
                                            updateStatus(venue.id, 'SUSPENDED')
                                        "
                                        class="inline-flex h-9 w-9 items-center justify-center border border-red-200 bg-white text-red-500 transition-colors hover:bg-red-50"
                                        title="Suspend business"
                                        aria-label="Suspend business"
                                    >
                                        <XCircle class="h-4 w-4" />
                                    </button>

                                    <button
                                        type="button"
                                        @click="handleDelete(venue.id)"
                                        class="inline-flex h-9 w-9 items-center justify-center border border-slate-200 bg-white text-slate-400 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                                        title="Delete business"
                                        aria-label="Delete business"
                                    >
                                        <Trash2 class="h-4 w-4" />
                                    </button>

                                    <button
                                        type="button"
                                        class="inline-flex h-9 w-9 items-center justify-center border border-slate-800 bg-slate-900 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
                                        aria-label="More actions"
                                    >
                                        <MoreVertical class="h-4 w-4" />
                                    </button>
                                </div>
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
                    <Store class="h-6 w-6 text-slate-300" />
                </div>

                <h3 class="text-base font-semibold text-slate-900">
                    No businesses found
                </h3>

                <p class="mt-1 max-w-sm text-sm text-slate-400">
                    Try adjusting your search or status filter.
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
