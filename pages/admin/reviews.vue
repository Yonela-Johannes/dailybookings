<script setup lang="ts">
import {
    Filter,
    Star,
    Trash2,
    CheckCircle2,
    Loader2,
    ChevronLeft,
    ChevronRight,
    MessageSquare,
    Store,
} from "lucide-vue-next";
import { format, parseISO } from "date-fns";
import Head from "~/components/head/Head.vue";

definePageMeta({
    layout: "admin",
    middleware: "auth",
});

const ratingFilter = ref("");
const page = ref(1);

const {
    data: reviewsResponse,
    pending,
    refresh,
} = useFetch("/api/admin/reviews", {
    query: {
        rating: ratingFilter,
        page,
        limit: 10,
    },
    watch: [ratingFilter, page],
});

const reviews = computed(() => reviewsResponse.value?.data || []);

const meta = computed(
    () =>
        reviewsResponse.value?.meta || {
            total: 0,
            page: 1,
            totalPages: 1,
        },
);

const handleDelete = async (id: string) => {
    if (
        !confirm(
            "Are you sure you want to delete this review? This action is permanent and cannot be undone.",
        )
    ) {
        return;
    }

    try {
        await $fetch(`/api/admin/reviews/${id}`, {
            method: "DELETE",
        });

        refresh();
    } catch (error) {
        console.error("Failed to delete review:", error);
    }
};

const toggleVerification = async (id: string, verified: boolean) => {
    try {
        await $fetch(`/api/admin/reviews/${id}`, {
            method: "PATCH",
            body: { verified },
        });

        refresh();
    } catch (error) {
        console.error("Failed to update review:", error);
    }
};
</script>

<template>
    <div class="space-y-8 pb-20">
        <Head
            title="Reviews"
            description="Manage customer feedback and ratings across DailyBookings"
        />

        <div
            class="flex flex-col gap-4 border-y border-slate-200 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
        >
            <div class="flex items-center gap-4">
                <div>
                    <p
                        class="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400"
                    >
                        Total reviews
                    </p>

                    <p
                        class="mt-1 text-lg font-bold tracking-tight text-slate-900"
                    >
                        {{ meta.total }}
                    </p>
                </div>

                <div class="h-8 w-px bg-slate-200" />

                <div>
                    <p
                        class="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400"
                    >
                        Page
                    </p>

                    <p
                        class="mt-1 text-lg font-bold tracking-tight text-slate-900"
                    >
                        {{ meta.page }} / {{ meta.totalPages }}
                    </p>
                </div>
            </div>

            <div class="flex items-center gap-2">
                <select
                    v-model="ratingFilter"
                    class="h-10 min-w-48 border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 outline-none transition-colors focus:border-slate-900"
                >
                    <option value="">All ratings</option>
                    <option value="5">5 stars</option>
                    <option value="4">4 stars</option>
                    <option value="3">3 stars</option>
                    <option value="2">2 stars</option>
                    <option value="1">1 star</option>
                </select>

                <button
                    type="button"
                    aria-label="Refresh reviews"
                    class="flex h-10 w-10 items-center justify-center border border-slate-200 bg-white text-slate-500 transition-colors hover:border-slate-900 hover:bg-slate-900 hover:text-white"
                    @click="refresh"
                >
                    <Filter class="h-4 w-4" />
                </button>
            </div>
        </div>

        <!-- Reviews -->
        <div class="border border-slate-200 bg-white">
            <!-- Loading -->
            <div
                v-if="pending"
                class="flex min-h-[560px] items-center justify-center"
            >
                <div class="flex items-center gap-3 text-slate-400">
                    <Loader2 class="h-5 w-5 animate-spin" />

                    <span class="text-xs font-semibold">
                        Loading reviews...
                    </span>
                </div>
            </div>

            <!-- Empty -->
            <div
                v-else-if="reviews.length === 0"
                class="flex min-h-[560px] flex-col items-center justify-center px-6 text-center"
            >
                <div
                    class="mb-5 flex h-14 w-14 items-center justify-center border border-slate-200 bg-slate-50"
                >
                    <MessageSquare class="h-6 w-6 text-slate-400" />
                </div>

                <h3 class="text-lg font-bold tracking-tight text-slate-900">
                    No reviews yet
                </h3>

                <p class="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                    Customer feedback will appear here once people start
                    reviewing businesses.
                </p>
            </div>

            <!-- Review list -->
            <div v-else class="divide-y divide-slate-200">
                <article
                    v-for="review in reviews"
                    :key="review.id"
                    class="group px-5 py-7 transition-colors hover:bg-slate-50/60 sm:px-7 lg:px-8"
                >
                    <div
                        class="grid gap-7 lg:grid-cols-[240px_minmax(0,1fr)_auto] lg:gap-10"
                    >
                        <!-- Customer -->
                        <div>
                            <div class="flex items-center gap-3">
                                <div
                                    class="flex h-11 w-11 shrink-0 items-center justify-center border border-slate-200 bg-slate-50 text-sm font-bold text-slate-700"
                                >
                                    {{ review.user?.fullName?.[0] || "U" }}
                                </div>

                                <div class="min-w-0">
                                    <p
                                        class="truncate text-sm font-bold text-slate-900"
                                    >
                                        {{
                                            review.user?.fullName ||
                                            "Verified Client"
                                        }}
                                    </p>

                                    <p
                                        class="mt-0.5 truncate text-xs text-slate-400"
                                    >
                                        {{ review.user?.email || "—" }}
                                    </p>
                                </div>
                            </div>

                            <!-- Venue -->
                            <div class="mt-6 border-t border-slate-100 pt-5">
                                <p
                                    class="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400"
                                >
                                    Business
                                </p>

                                <div class="mt-3 flex items-center gap-3">
                                    <Store
                                        class="h-4 w-4 shrink-0 text-teal-600"
                                    />

                                    <p
                                        class="truncate text-sm font-semibold text-slate-800"
                                    >
                                        {{
                                            review.venue?.name ||
                                            "Unknown business"
                                        }}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <!-- Review -->
                        <div class="min-w-0">
                            <div
                                class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
                            >
                                <div class="flex items-center gap-3">
                                    <div class="flex items-center gap-0.5">
                                        <Star
                                            v-for="i in 5"
                                            :key="i"
                                            :class="[
                                                'h-4 w-4',
                                                i <= review.rating
                                                    ? 'fill-amber-400 text-amber-400'
                                                    : 'text-slate-200',
                                            ]"
                                        />
                                    </div>

                                    <span
                                        class="text-sm font-bold text-slate-900"
                                    >
                                        {{ review.rating }}.0
                                    </span>
                                </div>

                                <span class="text-xs text-slate-400">
                                    {{
                                        format(
                                            parseISO(review.createdAt),
                                            "MMM d, yyyy",
                                        )
                                    }}
                                </span>
                            </div>

                            <blockquote
                                class="mt-6 max-w-3xl text-base leading-7 text-slate-700"
                            >
                                “{{ review.body }}”
                            </blockquote>

                            <div
                                class="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-slate-100 pt-5"
                            >
                                <button
                                    type="button"
                                    @click="toggleVerification(review.id, !review.verified)"
                                    :class="[
                                        'inline-flex items-center gap-2 text-xs font-semibold transition-colors',
                                        review.verified
                                            ? 'text-teal-600 hover:text-teal-700'
                                            : 'text-slate-400 hover:text-slate-600',
                                    ]"
                                >
                                    <CheckCircle2 class="h-3.5 w-3.5" />
                                    {{ review.verified ? 'Verified review' : 'Mark as verified' }}
                                </button>

                                <span
                                    v-if="review.serviceName"
                                    class="text-xs text-slate-400"
                                >
                                    Service:
                                    <strong
                                        class="font-semibold text-slate-700"
                                    >
                                        {{ review.serviceName }}
                                    </strong>
                                </span>
                            </div>
                        </div>

                        <!-- Actions -->
                        <div class="flex items-start justify-end">
                            <button
                                type="button"
                                aria-label="Delete review"
                                class="flex h-9 w-9 items-center justify-center border border-transparent text-slate-300 opacity-0 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                                @click="handleDelete(review.id)"
                            >
                                <Trash2 class="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </article>
            </div>

            <!-- Pagination -->
            <div
                class="flex flex-col gap-4 border-t border-slate-200 bg-slate-50/50 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7"
            >
                <p class="text-xs text-slate-500">
                    Showing page
                    <strong class="font-semibold text-slate-900">
                        {{ meta.page }}
                    </strong>
                    of
                    <strong class="font-semibold text-slate-900">
                        {{ meta.totalPages }}
                    </strong>
                    · {{ meta.total }} reviews
                </p>

                <div class="flex items-center">
                    <button
                        type="button"
                        :disabled="page === 1"
                        aria-label="Previous page"
                        class="flex h-9 w-9 items-center justify-center border border-slate-200 bg-white text-slate-600 transition-colors hover:border-slate-900 hover:bg-slate-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                        @click="page--"
                    >
                        <ChevronLeft class="h-4 w-4" />
                    </button>

                    <div
                        class="flex h-9 items-center border-y border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700"
                    >
                        {{ meta.page }}
                    </div>

                    <button
                        type="button"
                        :disabled="page >= meta.totalPages"
                        aria-label="Next page"
                        class="flex h-9 w-9 items-center justify-center border border-slate-200 bg-white text-slate-600 transition-colors hover:border-slate-900 hover:bg-slate-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                        @click="page++"
                    >
                        <ChevronRight class="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
