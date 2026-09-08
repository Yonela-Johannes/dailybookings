<script setup lang="ts">
import {
    Star,
    MessageSquare,
    CheckCircle2,
    MoreVertical,
    Loader2,
    Search,
    Filter,
} from "lucide-vue-next";
import { format, parseISO } from "date-fns";

definePageMeta({
    layout: "business",
    middleware: "auth",
});

const { data: reviewsResponse, pending } = await useFetch(
    "/api/business/reviews",
);

const reviews = computed(() => reviewsResponse.value?.data || []);
const meta = computed(() => reviewsResponse.value?.meta || { total: 0 });

const search = ref("");
const selectedRating = ref("all");

const getInitials = (name: string) => {
    return name
        .split(" ")
        .filter(Boolean)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
};

const filteredReviews = computed(() => {
    let result = reviews.value;

    if (selectedRating.value !== "all") {
        result = result.filter(
            (review: any) => String(review.rating) === selectedRating.value,
        );
    }

    if (search.value.trim()) {
        const query = search.value.toLowerCase().trim();

        result = result.filter((review: any) => {
            const customer = review.user?.fullName || "";
            const body = review.body || "";
            const service = review.serviceName || "";
            const employee = review.employeeName || "";

            return [customer, body, service, employee]
                .join(" ")
                .toLowerCase()
                .includes(query);
        });
    }

    return result;
});
</script>

<template>
    <div class="mx-auto max-w-7xl space-y-6">
        <div
            class="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between"
        >
            <div>
                <div
                    class="mb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary"
                >
                    Business Operations
                </div>

                <h1
                    class="text-2xl font-semibold tracking-tight text-slate-900"
                >
                    Reviews
                </h1>

                <p class="mt-1 text-sm text-slate-500">
                    Manage customer feedback and monitor your business
                    reputation.
                </p>
            </div>

            <div
                class="flex items-center gap-2 border border-slate-200 bg-white px-3 py-2"
            >
                <MessageSquare class="h-4 w-4 text-slate-400" />

                <span class="text-xs font-medium text-slate-600">
                    {{ meta.total }}
                    {{ meta.total === 1 ? "Review" : "Reviews" }}
                </span>
            </div>
        </div>

        <div
            class="grid grid-cols-1 border border-slate-200 bg-white sm:grid-cols-3"
        >
            <div
                class="border-b border-slate-200 p-4 sm:border-b-0 sm:border-r"
            >
                <p
                    class="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400"
                >
                    Total Reviews
                </p>

                <p class="mt-1 text-xl font-semibold text-slate-900">
                    {{ meta.total }}
                </p>
            </div>

            <div
                class="border-b border-slate-200 p-4 sm:border-b-0 sm:border-r"
            >
                <p
                    class="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400"
                >
                    Average Rating
                </p>

                <div class="mt-1 flex items-center gap-2">
                    <span class="text-xl font-semibold text-slate-900">
                        {{ Number(meta.averageRating || 0).toFixed(1) }}
                    </span>

                    <div class="flex items-center gap-0.5">
                        <Star
                            v-for="i in 5"
                            :key="i"
                            :class="[
                                'h-3.5 w-3.5',
                                i <= Math.round(meta.averageRating || 0)
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-slate-200',
                            ]"
                        />
                    </div>
                </div>
            </div>

            <div class="p-4">
                <p
                    class="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400"
                >
                    Verified
                </p>

                <p class="mt-1 text-xl font-semibold text-slate-900">
                    {{
                        reviews.filter((review: any) => review.verified).length
                    }}
                </p>
            </div>
        </div>

        <div class="border border-slate-200 bg-white">
            <div
                class="flex flex-col gap-3 border-b border-slate-200 p-3 sm:flex-row sm:items-center sm:justify-between"
            >
                <div>
                    <h2 class="text-sm font-semibold text-slate-900">
                        Customer Reviews
                    </h2>

                    <p class="mt-0.5 text-xs text-slate-500">
                        Feedback from customers who have used your services.
                    </p>
                </div>

                <div class="flex flex-col gap-2 sm:flex-row">
                    <div class="relative">
                        <Search
                            class="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            v-model="search"
                            type="search"
                            placeholder="Search reviews..."
                            class="h-9 w-full border border-slate-200 bg-white pl-9 pr-3 text-xs text-slate-700 outline-none placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/10 sm:w-56"
                        />
                    </div>

                    <div class="relative">
                        <Filter
                            class="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"
                        />

                        <select
                            v-model="selectedRating"
                            class="h-9 w-full appearance-none border border-slate-200 bg-white pl-9 pr-8 text-xs font-medium text-slate-600 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 sm:w-36"
                        >
                            <option value="all">All Ratings</option>
                            <option value="5">5 Stars</option>
                            <option value="4">4 Stars</option>
                            <option value="3">3 Stars</option>
                            <option value="2">2 Stars</option>
                            <option value="1">1 Star</option>
                        </select>
                    </div>
                </div>
            </div>

            <div v-if="pending" class="divide-y divide-slate-100">
                <div v-for="index in 4" :key="index" class="flex gap-4 p-4">
                    <div
                        class="h-10 w-10 shrink-0 animate-pulse bg-slate-100"
                    />

                    <div class="flex-1 space-y-2">
                        <div class="h-4 w-40 animate-pulse bg-slate-100" />
                        <div class="h-3 w-24 animate-pulse bg-slate-100" />
                        <div
                            class="mt-3 h-12 w-full animate-pulse bg-slate-100"
                        />
                    </div>
                </div>
            </div>

            <div
                v-else-if="filteredReviews.length === 0"
                class="px-6 py-16 text-center"
            >
                <div
                    class="mx-auto flex h-12 w-12 items-center justify-center border border-slate-200 bg-slate-50"
                >
                    <MessageSquare class="h-5 w-5 text-slate-400" />
                </div>

                <h3 class="mt-4 text-sm font-semibold text-slate-900">
                    {{
                        reviews.length === 0
                            ? "No reviews yet"
                            : "No matching reviews"
                    }}
                </h3>

                <p class="mt-1 text-xs text-slate-500">
                    {{
                        reviews.length === 0
                            ? "Complete some bookings to start receiving customer feedback."
                            : "Try adjusting your search or rating filter."
                    }}
                </p>
            </div>

            <div v-else class="divide-y divide-slate-100">
                <div
                    v-for="review in filteredReviews"
                    :key="review.id"
                    class="p-4 transition-colors hover:bg-slate-50/50 sm:p-5"
                >
                    <div class="flex gap-3 sm:gap-4">
                        <div
                            class="h-10 w-10 shrink-0 overflow-hidden border border-slate-200 bg-slate-100"
                        >
                            <img
                                v-if="review.user?.profile?.avatarUrl"
                                :src="review.user.profile.avatarUrl"
                                :alt="review.user?.fullName || 'Customer'"
                                class="h-full w-full object-cover"
                            />

                            <div
                                v-else
                                class="flex h-full w-full items-center justify-center text-xs font-semibold text-slate-500"
                            >
                                {{
                                    getInitials(
                                        review.user?.fullName || "Guest",
                                    )
                                }}
                            </div>
                        </div>

                        <div class="min-w-0 flex-1">
                            <div
                                class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between"
                            >
                                <div>
                                    <div
                                        class="flex flex-wrap items-center gap-2"
                                    >
                                        <h3
                                            class="text-sm font-semibold text-slate-900"
                                        >
                                            {{
                                                review.user?.fullName ||
                                                "Verified Customer"
                                            }}
                                        </h3>

                                        <span
                                            v-if="review.verified"
                                            class="inline-flex items-center gap-1 border border-primary/10 bg-primary/5 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-primary"
                                        >
                                            <CheckCircle2 class="h-3 w-3" />
                                            Verified
                                        </span>
                                    </div>

                                    <div
                                        class="mt-1 flex flex-wrap items-center gap-2"
                                    >
                                        <div class="flex items-center gap-0.5">
                                            <Star
                                                v-for="i in 5"
                                                :key="i"
                                                :class="[
                                                    'h-3.5 w-3.5',
                                                    i <= review.rating
                                                        ? 'fill-amber-400 text-amber-400'
                                                        : 'text-slate-200',
                                                ]"
                                            />
                                        </div>

                                        <span class="text-slate-300">•</span>

                                        <span
                                            class="text-[11px] text-slate-400"
                                        >
                                            {{
                                                format(
                                                    parseISO(review.createdAt),
                                                    "PP",
                                                )
                                            }}
                                        </span>
                                    </div>
                                </div>

                                <div class="relative group/menu self-start">
                                    <button
                                        type="button"
                                        class="flex h-8 w-8 items-center justify-center border border-transparent text-slate-400 hover:border-slate-200 hover:bg-white hover:text-slate-700"
                                    >
                                        <MoreVertical class="h-4 w-4" />
                                    </button>

                                    <div
                                        class="absolute right-0 top-full z-20 mt-1 hidden w-32 border border-slate-200 bg-white py-1 shadow-lg group-hover/menu:block"
                                    >
                                        <button
                                            type="button"
                                            class="w-full px-3 py-2 text-left text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div
                                class="mt-3 border border-slate-200 bg-slate-50/60 px-3 py-3"
                            >
                                <p class="text-sm leading-6 text-slate-700">
                                    "{{ review.body }}"
                                </p>
                            </div>

                            <div
                                class="mt-3 flex flex-col gap-2 text-[11px] sm:flex-row sm:items-center sm:gap-5"
                            >
                                <div>
                                    <span class="text-slate-400">
                                        Service
                                    </span>

                                    <span
                                        class="ml-1 font-medium text-slate-700"
                                    >
                                        {{
                                            review.serviceName ||
                                            "Standard Session"
                                        }}
                                    </span>
                                </div>

                                <div v-if="review.employeeName">
                                    <span class="text-slate-400">
                                        Professional
                                    </span>

                                    <span
                                        class="ml-1 font-medium text-slate-700"
                                    >
                                        {{ review.employeeName }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div
                v-if="filteredReviews.length > 0"
                class="border-t border-slate-200 bg-slate-50/50 px-4 py-3"
            >
                <p class="text-[11px] text-slate-500">
                    Showing
                    <span class="font-semibold text-slate-700">
                        {{ filteredReviews.length }}
                    </span>
                    of
                    <span class="font-semibold text-slate-700">
                        {{ meta.total }}
                    </span>
                    reviews
                </p>
            </div>
        </div>
    </div>
</template>
