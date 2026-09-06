<script setup lang="ts">
import { CheckCircle2, ChevronRight } from "lucide-vue-next";

import StarRating from "./StarRating.vue";
import type { Venue } from "~/types/venue";

const props = withDefaults(
    defineProps<{
        venue: Venue;
        previewCount?: number;
    }>(),
    {
        previewCount: 4,
    },
);

function initials(name: string) {
    return name
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
}

const visibleReviews = computed(() =>
    props.venue.reviews.slice(0, props.previewCount),
);
</script>

<template>
    <section aria-labelledby="reviews-heading">
        <!-- Header -->
        <div class="mb-8">
            <p
                class="text-xs font-semibold uppercase tracking-[0.16em] text-primary"
            >
                Customer feedback
            </p>

            <div class="mt-2 flex flex-wrap items-end justify-between gap-4">
                <div>
                    <h2
                        id="reviews-heading"
                        class="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl"
                    >
                        What people are saying
                    </h2>

                    <p class="mt-2 text-sm leading-6 text-slate-500">
                        Real experiences from people who have booked with
                        {{ venue.name }}.
                    </p>
                </div>

                <button
                    type="button"
                    class="hidden items-center gap-1 text-sm font-medium text-slate-900 transition hover:text-primary sm:inline-flex"
                >
                    See all reviews
                    <ChevronRight class="h-4 w-4" />
                </button>
            </div>
        </div>

        <!-- Rating summary -->
        <div class="border-y border-slate-200 py-7">
            <div class="grid gap-8 sm:grid-cols-[180px_1fr]">
                <!-- Overall rating -->
                <div>
                    <div class="flex items-end gap-2">
                        <span
                            class="text-5xl font-semibold tracking-tight text-slate-950"
                        >
                            {{ venue.rating.toFixed(1) }}
                        </span>

                        <span class="pb-1 text-sm text-slate-400"> / 5 </span>
                    </div>

                    <StarRating :rating="venue.rating" size="md" class="mt-2" />

                    <p class="mt-2 text-sm text-slate-500">
                        Based on {{ venue.reviewCount }} reviews
                    </p>
                </div>

                <!-- Summary -->
                <div class="border-l border-slate-200 pl-8">
                    <p
                        v-if="venue.reviewSummary"
                        class="max-w-2xl text-sm leading-7 text-slate-600"
                    >
                        {{ venue.reviewSummary }}
                    </p>

                    <div
                        class="mt-4 flex items-center gap-2 text-xs font-medium text-primary"
                    >
                        <CheckCircle2 class="h-4 w-4" />
                        Reviews from DailyBookings customers
                    </div>
                </div>
            </div>
        </div>

        <!-- Reviews -->
        <div class="mt-2">
            <article
                v-for="review in visibleReviews"
                :key="review.id"
                class="border-b border-slate-200 py-7"
            >
                <div class="flex items-start gap-4">
                    <!-- Avatar -->
                    <div
                        class="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-100 text-xs font-semibold text-slate-500"
                    >
                        <img
                            v-if="review.authorAvatarUrl"
                            :src="review.authorAvatarUrl"
                            :alt="review.authorName"
                            class="h-full w-full object-cover"
                        />

                        <span v-else>
                            {{ initials(review.authorName) }}
                        </span>
                    </div>

                    <!-- Content -->
                    <div class="min-w-0 flex-1">
                        <div
                            class="flex flex-wrap items-center justify-between gap-x-4 gap-y-2"
                        >
                            <div>
                                <div class="flex flex-wrap items-center gap-2">
                                    <h3
                                        class="text-sm font-semibold text-slate-950"
                                    >
                                        {{ review.authorName }}
                                    </h3>

                                    <span
                                        v-if="review.verified"
                                        class="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-primary"
                                    >
                                        <CheckCircle2 class="h-3 w-3" />
                                        Verified
                                    </span>
                                </div>

                                <div
                                    class="mt-1 flex flex-wrap items-center gap-2"
                                >
                                    <StarRating
                                        :rating="review.rating"
                                        size="sm"
                                    />

                                    <span class="text-xs text-slate-400">
                                        {{ review.postedAt }}
                                    </span>
                                </div>
                            </div>

                            <span
                                v-if="review.serviceName"
                                class="text-xs text-slate-400"
                            >
                                {{ review.serviceName }}
                            </span>
                        </div>

                        <p
                            class="mt-4 max-w-3xl text-sm leading-6 text-slate-600"
                        >
                            {{ review.body }}
                        </p>

                        <p
                            v-if="review.employeeName"
                            class="mt-3 text-xs text-slate-400"
                        >
                            Service with {{ review.employeeName }}
                        </p>
                    </div>
                </div>
            </article>
        </div>

        <!-- See all -->
        <button
            type="button"
            class="mt-6 inline-flex h-11 items-center gap-2 border border-slate-200 bg-white px-5 text-sm font-medium text-slate-900 transition hover:border-slate-950 hover:bg-slate-950 hover:text-white"
        >
            See all {{ venue.reviewCount }} reviews

            <ChevronRight class="h-4 w-4" />
        </button>
    </section>
</template>
