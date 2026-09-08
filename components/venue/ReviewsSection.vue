<script setup lang="ts">
import { CheckCircle2, ChevronRight, MessageSquare, Send, Loader2 } from "lucide-vue-next";
import { formatDistanceToNow } from "date-fns";

import StarRating from "./StarRating.vue";
import type { Venue, VenueReview } from "~/types/venue";

const props = withDefaults(
    defineProps<{
        venue: Venue;
        previewCount?: number;
    }>(),
    {
        previewCount: 4,
    },
);

const { user } = useAuth();
const commentBodies = ref<Record<string, string>>({});
const submittingComments = ref<Record<string, boolean>>({});

async function submitComment(reviewId: string) {
    const body = commentBodies.value[reviewId]?.trim();
    if (!body || !user.value) return;

    submittingComments.value[reviewId] = true;
    try {
        const comment = await $fetch<any>(`/api/reviews/${reviewId}/comments`, {
            method: 'POST',
            body: { body }
        });

        // Find review and push comment locally
        const review = props.venue.reviews.find(r => r.id === reviewId);
        if (review) {
            if (!review.comments) review.comments = [];
            review.comments.push(comment);
        }
        commentBodies.value[reviewId] = '';
    } catch (err) {
        console.error('Failed to submit comment:', err);
    } finally {
        submittingComments.value[reviewId] = false;
    }
}

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

                        <!-- Comments Section -->
                        <div v-if="review.comments?.length || user" class="mt-6 space-y-4">
                            <div v-for="comment in review.comments" :key="comment.id" class="flex gap-3 bg-slate-50 p-3">
                                <div class="h-6 w-6 shrink-0 rounded-full bg-slate-200 overflow-hidden">
                                    <img v-if="comment.user.profile?.avatarUrl" :src="comment.user.profile.avatarUrl" class="h-full w-full object-cover" />
                                    <span v-else class="flex h-full w-full items-center justify-center text-[8px] font-bold text-slate-500 uppercase">{{ comment.user.fullName[0] }}</span>
                                </div>
                                <div class="flex-1">
                                    <div class="flex items-center justify-between gap-2">
                                        <span class="text-[10px] font-bold text-slate-900">{{ comment.user.fullName }}</span>
                                        <span class="text-[9px] text-slate-400">{{ formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true }) }}</span>
                                    </div>
                                    <p class="mt-1 text-xs text-slate-600">{{ comment.body }}</p>
                                </div>
                            </div>

                            <!-- Add Comment -->
                            <div v-if="user" class="flex gap-3 mt-4">
                                <div class="h-8 w-8 shrink-0 rounded-full bg-slate-100 flex items-center justify-center">
                                    <MessageSquare class="h-4 w-4 text-slate-400" />
                                </div>
                                <div class="relative flex-1">
                                    <input
                                        v-model="commentBodies[review.id]"
                                        type="text"
                                        placeholder="Add a comment..."
                                        class="w-full h-8 bg-transparent border-b border-slate-200 text-xs focus:border-primary outline-none transition-colors pr-8"
                                        @keyup.enter="submitComment(review.id)"
                                    />
                                    <button
                                        :disabled="!commentBodies[review.id]?.trim() || submittingComments[review.id]"
                                        class="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors disabled:opacity-30"
                                        @click="submitComment(review.id)"
                                    >
                                        <Loader2 v-if="submittingComments[review.id]" class="h-3 w-3 animate-spin" />
                                        <MessageSquare v-else class="h-3 w-3" />
                                    </button>
                                </div>
                            </div>
                        </div>
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
