<script setup lang="ts">
import BookingHeader from "~/components/booking/BookingHeader.vue";
import ServiceSelectList from "~/components/booking/ServiceSelectList.vue";
import CartSidebar from "~/components/booking/CartSidebar.vue";
import MobileCartBar from "~/components/booking/MobileCartBar.vue";
import { useBookingCart } from "~/composables/useBookingCart";

const route = useRoute();

const { data: venue, pending } = await useVenue(route.params.slug as string);

const cart = useBookingCart();

const steps = ["Services", "Time", "Confirm"];

const venueSlug = computed(() => route.params.slug as string);

function goBack() {
    navigateTo(`/venue/${venueSlug.value}`);
}

function close() {
    navigateTo(`/venue/${venueSlug.value}`);
}

function goToTime() {
    if (!cart.count.value) return;

    navigateTo(`/venue/${venueSlug.value}/booking/time`);
}

watch(
    venue,
    (value) => {
        if (value) {
            cart.setVenue(value.id);
        }
    },
    { immediate: true },
);

useHead(() => ({
    title: venue.value
        ? `Book ${venue.value.name} | DailyBookings`
        : "Book | DailyBookings",
}));
</script>

<template>
    <div v-if="pending" class="min-h-dvh bg-slate-50">
        <div class="mx-auto max-w-5xl px-4 py-16 text-center">
            <p class="text-sm text-slate-400">Loading booking…</p>
        </div>
    </div>

    <div v-else-if="venue" class="min-h-dvh bg-slate-50 pb-24 lg:pb-0">
        <BookingHeader
            title="Select services"
            :steps="steps"
            :active-step="0"
            @back="goBack"
            @close="close"
        />

        <main
            class="mx-auto grid max-w-6xl gap-10 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:py-10"
        >
            <section aria-labelledby="services-title">
                <div class="mb-7">
                    <p
                        class="text-xs font-semibold uppercase tracking-[0.14em] text-primary"
                    >
                        Step 1 of 3
                    </p>

                    <h1
                        id="services-title"
                        class="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl"
                    >
                        Choose your services
                    </h1>

                    <p class="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                        Select one or more services you'd like to book at
                        {{ venue.name }}.
                    </p>
                </div>

                <ServiceSelectList :categories="venue.serviceCategories" />
            </section>

            <aside class="hidden lg:block">
                <div class="sticky top-24">
                    <CartSidebar :venue="venue" @continue="goToTime" />
                </div>
            </aside>
        </main>

        <MobileCartBar @continue="goToTime" />
    </div>
</template>
