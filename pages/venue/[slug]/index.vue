<script setup lang="ts">
import {
    ArrowLeft,
    CalendarDays,
    ChevronRight,
    Heart,
    MapPin,
    Share2,
} from "lucide-vue-next";

import PhotoGallery from "~/components/venue/PhotoGallery.vue";
import ServicesTabs from "~/components/venue/ServicesTabs.vue";
import TeamCarousel from "~/components/venue/TeamCarousel.vue";
import ReviewsSection from "~/components/venue/ReviewsSection.vue";
import AboutSection from "~/components/venue/AboutSection.vue";
import BookingSidebar from "~/components/venue/BookingSidebar.vue";
import StarRating from "~/components/venue/StarRating.vue";

const route = useRoute();

const { data: venue, pending } = await useVenue(route.params.slug as string);

useHead(() => ({
    title: venue.value
        ? `${venue.value.name} | DailyBookings`
        : "DailyBookings",
}));

const serviceCount = computed(() => {
    if (!venue.value) return 0;

    return venue.value.serviceCategories.reduce(
        (total, category) => total + category.services.length,
        0,
    );
});

function handleBook(serviceId: string) {
    navigateTo(`/venues/${route.params.slug}/booking?service=${serviceId}`);
}

function handleBookNow() {
    navigateTo(`/venue/${route.params.slug}/booking`);
}

function handleShare() {
    if (typeof navigator === "undefined") return;

    navigator.share?.({
        title: venue.value?.name,
        url: window.location.href,
    });
}
</script>

<template>
    <div v-if="pending" class="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div class="space-y-6">
            <div class="h-4 w-32 animate-pulse bg-slate-100" />
            <div class="aspect-[16/7] w-full animate-pulse bg-slate-100" />
            <div class="grid gap-3 lg:grid-cols-[1fr_320px]">
                <div class="space-y-3">
                    <div class="h-8 w-2/3 animate-pulse bg-slate-100" />
                    <div class="h-4 w-1/3 animate-pulse bg-slate-100" />
                </div>

                <div class="hidden h-64 animate-pulse bg-slate-100 lg:block" />
            </div>
        </div>
    </div>

    <main v-else-if="venue" class="pb-24 lg:pb-16">
        <div class="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
            <nav
                class="mb-5 flex items-center gap-2 text-sm text-slate-400"
                aria-label="Breadcrumb"
            >
                <NuxtLink to="/" class="transition-colors hover:text-slate-900">
                    Home
                </NuxtLink>

                <ChevronRight class="h-3.5 w-3.5" />

                <NuxtLink
                    to="/venues"
                    class="transition-colors hover:text-slate-900"
                >
                    Venues
                </NuxtLink>

                <ChevronRight class="h-3.5 w-3.5" />

                <span class="truncate text-slate-600">
                    {{ venue.name }}
                </span>
            </nav>

            <PhotoGallery :images="venue.images" />

            <section class="border-b border-slate-200 py-8 lg:py-10">
                <div
                    class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
                >
                    <!-- Identity -->
                    <div class="min-w-0">
                        <!-- Category -->
                        <div
                            v-if="venue.category"
                            class="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-primary"
                        >
                            {{ venue.category }}
                        </div>

                        <!-- Name -->
                        <div
                            class="flex flex-wrap items-center gap-x-3 gap-y-2"
                        >
                            <h1
                                class="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl"
                            >
                                {{ venue.name }}
                            </h1>

                            <span
                                v-if="venue.verified"
                                class="border border-primary/20 bg-primary/5 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary"
                            >
                                Verified
                            </span>
                        </div>

                        <!-- Meta -->
                        <div
                            class="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500"
                        >
                            <div class="flex items-center gap-2">
                                <StarRating :rating="venue.rating" show-value />

                                <span class="text-slate-400">
                                    ({{ venue.reviewCount }} reviews)
                                </span>
                            </div>

                            <span
                                class="hidden h-4 w-px bg-slate-200 sm:block"
                            />

                            <div class="flex items-center gap-1.5">
                                <MapPin class="h-4 w-4" />

                                <span>
                                    {{ venue.address.suburb }},
                                    {{ venue.address.city }}
                                </span>
                            </div>

                            <span
                                class="hidden h-4 w-px bg-slate-200 sm:block"
                            />

                            <span> {{ serviceCount }} services </span>
                        </div>
                    </div>

                    <!-- Actions -->
                    <div class="flex shrink-0 items-center gap-2">
                        <button
                            type="button"
                            class="inline-flex h-10 items-center gap-2 border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:border-slate-950 hover:bg-slate-950 hover:text-white"
                            @click="handleShare"
                        >
                            <Share2 class="h-4 w-4" />
                            <span>Share</span>
                        </button>

                        <button
                            type="button"
                            class="inline-flex h-10 items-center gap-2 border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:border-slate-950 hover:bg-slate-950 hover:text-white"
                        >
                            <Heart class="h-4 w-4" />
                            <span>Save</span>
                        </button>
                    </div>
                </div>
            </section>
        </div>

        <div
            class="mx-auto grid max-w-7xl gap-12 px-4 pt-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8 lg:pt-12"
        >
            <!-- Main -->
            <div class="min-w-0 space-y-16">
                <!-- Services -->
                <section>
                    <div class="mb-6">
                        <p
                            class="text-xs font-semibold uppercase tracking-[0.16em] text-primary"
                        >
                            Services
                        </p>

                        <h2
                            class="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl"
                        >
                            Book a service
                        </h2>

                        <p
                            class="mt-2 max-w-2xl text-sm leading-6 text-slate-500"
                        >
                            Choose a service, compare options and book a time
                            that works for you.
                        </p>
                    </div>

                    <ServicesTabs
                        :categories="venue.serviceCategories"
                        @book="handleBook"
                    />
                </section>

                <section
                    v-if="venue.team?.length"
                    class="border-t border-slate-200 pt-12"
                >
                    <TeamCarousel :team="venue.team" />
                </section>

                <section class="border-t border-slate-200 pt-12">
                    <ReviewsSection :venue="venue" :preview-count="4" />
                </section>

                <section class="border-t border-slate-200 pt-12">
                    <AboutSection :venue="venue" />
                </section>
            </div>

            <aside class="hidden lg:block">
                <div class="sticky top-6">
                    <BookingSidebar :venue="venue" @book="handleBookNow" />
                </div>
            </aside>
        </div>

        <div
            class="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur lg:hidden"
        >
            <div class="mx-auto flex max-w-7xl items-center gap-4">
                <div class="min-w-0 flex-1">
                    <p class="truncate text-sm font-semibold text-slate-950">
                        {{ venue.name }}
                    </p>

                    <div
                        class="mt-0.5 flex items-center gap-2 text-xs text-slate-500"
                    >
                        <StarRating :rating="venue.rating" show-value />

                        <span> {{ venue.reviewCount }} reviews </span>
                    </div>
                </div>

                <button
                    type="button"
                    class="inline-flex h-11 shrink-0 items-center gap-2 bg-slate-950 px-6 text-sm font-semibold text-white transition hover:bg-primary"
                    @click="handleBookNow"
                >
                    <CalendarDays class="h-4 w-4" />
                    Book now
                </button>
            </div>
        </div>
    </main>
</template>
