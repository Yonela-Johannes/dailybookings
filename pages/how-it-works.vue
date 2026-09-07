<script setup lang="ts">
import {
    ArrowRight,
    CalendarCheck,
    CheckCircle2,
    ChevronRight,
    Search,
    ShieldCheck,
    Sparkles,
    UserRound,
} from "lucide-vue-next";
import { NAVIGATION_PATHS } from "~/utils/constants";

useHead({
    title: "How DailyBookings Works",
    meta: [
        {
            name: "description",
            content:
                "Discover trusted local professionals, explore their services, and book appointments through DailyBookings.",
        },
    ],
});

const steps = [
    {
        number: "01",
        icon: Search,
        title: "Discover",
        description:
            "Start with what you need. Search for a service, browse a category, or discover professionals near you.",
    },
    {
        number: "02",
        icon: UserRound,
        title: "Explore",
        description:
            "Compare local professionals, their services, prices, locations, availability and the work they do.",
    },
    {
        number: "03",
        icon: ShieldCheck,
        title: "Choose with confidence",
        description:
            "See ratings, reviews and business information before you decide who is right for you.",
    },
    {
        number: "04",
        icon: CalendarCheck,
        title: "Book",
        description:
            "Choose your service, professional, date and time. Confirm your booking without unnecessary back and forth.",
    },
    {
        number: "05",
        icon: Sparkles,
        title: "Return",
        description:
            "Keep discovering great local professionals and make your next booking even easier.",
    },
];

const benefits = [
    "Discover services in your area",
    "Compare professionals before booking",
    "See transparent service information",
    "Choose a professional that fits your needs",
    "Book your preferred date and time",
    "Keep your bookings organised",
];
</script>

<template>
    <div class="bg-white text-slate-950">
        <!-- HERO -->
        <section class="border-b border-slate-200 bg-slate-50">
            <div
                class="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-32"
            >
                <div class="max-w-3xl">
                    <p
                        class="text-xs font-semibold uppercase tracking-[0.2em] text-primary"
                    >
                        How it works
                    </p>
                    <h1
                        class="mt-5 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl"
                    >
                        Finding the right local professional should be simple.
                    </h1>

                    <p
                        class="mt-6 max-w-2xl text-base leading-7 text-slate-500 sm:text-lg sm:leading-8"
                    >
                        DailyBookings helps you discover trusted local
                        professionals, understand what they offer and book a
                        service that fits your life.
                    </p>

                    <div class="mt-9 flex flex-col gap-3 sm:flex-row">
                        <NuxtLink
                            :to="NAVIGATION_PATHS.DISCOVER"
                            class="inline-flex h-12 items-center justify-center gap-2 bg-slate-950 px-6 text-sm font-semibold text-white transition-colors hover:bg-primary"
                        >
                            Start exploring
                            <ArrowRight class="h-4 w-4" stroke-width="1.8" />
                        </NuxtLink>

                        <NuxtLink
                            :to="
                                NAVIGATION_PATHS.CATEGORIES ||
                                NAVIGATION_PATHS.DISCOVER
                            "
                            class="inline-flex h-12 items-center justify-center gap-2 border border-slate-300 bg-white px-6 text-sm font-semibold text-slate-950 transition-colors hover:border-slate-950 hover:bg-slate-950 hover:text-white"
                        >
                            Explore categories
                            <ChevronRight class="h-4 w-4" stroke-width="1.8" />
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </section>

        <!-- JOURNEY -->
        <section>
            <div class="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
                <div class="max-w-2xl">
                    <p
                        class="text-xs font-semibold uppercase tracking-[0.2em] text-primary"
                    >
                        The DailyBookings journey
                    </p>

                    <h2
                        class="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl"
                    >
                        From “I need this” to “I’m booked.”
                    </h2>

                    <p class="mt-4 text-base leading-7 text-slate-500">
                        Everything is designed around making local services
                        easier to discover, compare and book.
                    </p>
                </div>

                <div class="mt-14 border-t border-slate-200">
                    <article
                        v-for="step in steps"
                        :key="step.number"
                        class="grid gap-6 border-b border-slate-200 py-8 sm:grid-cols-[90px_52px_minmax(0,1fr)] sm:items-start sm:gap-8 lg:py-10"
                    >
                        <span
                            class="text-sm font-semibold tabular-nums text-slate-300"
                        >
                            {{ step.number }}
                        </span>

                        <div
                            class="flex h-12 w-12 items-center justify-center border border-slate-200 bg-slate-50 text-primary"
                        >
                            <component
                                :is="step.icon"
                                class="h-5 w-5"
                                stroke-width="1.7"
                            />
                        </div>

                        <div class="max-w-2xl">
                            <h3 class="text-xl font-semibold text-slate-950">
                                {{ step.title }}
                            </h3>

                            <p
                                class="mt-2 text-sm leading-6 text-slate-500 sm:text-base"
                            >
                                {{ step.description }}
                            </p>
                        </div>
                    </article>
                </div>
            </div>
        </section>

        <!-- DISCOVERY -->
        <section class="border-y border-slate-200 bg-slate-50">
            <div
                class="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-20 lg:px-8 lg:py-28"
            >
                <div>
                    <p
                        class="text-xs font-semibold uppercase tracking-[0.2em] text-primary"
                    >
                        Discover locally
                    </p>

                    <h2
                        class="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl"
                    >
                        Start with what you need.
                    </h2>

                    <p class="mt-5 max-w-xl text-base leading-7 text-slate-500">
                        Whether you know exactly what you're looking for or
                        simply want to see what's available nearby,
                        DailyBookings gives you different ways to discover local
                        services.
                    </p>

                    <div class="mt-8 grid gap-3 sm:grid-cols-2">
                        <div
                            v-for="benefit in benefits"
                            :key="benefit"
                            class="flex items-start gap-3 border-t border-slate-200 pt-4"
                        >
                            <CheckCircle2
                                class="mt-0.5 h-4 w-4 shrink-0 text-primary"
                                stroke-width="1.8"
                            />

                            <span class="text-sm leading-5 text-slate-600">
                                {{ benefit }}
                            </span>
                        </div>
                    </div>
                </div>

                <!-- VISUAL -->
                <div class="relative overflow-hidden rounded-2xl bg-slate-900">
                    <img
                        src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1400&q=85"
                        alt="Professional providing a local beauty service"
                        class="aspect-[4/5] w-full object-cover opacity-90"
                    />

                    <div
                        class="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"
                    />

                    <div class="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                        <p
                            class="text-xs font-semibold uppercase tracking-[0.18em] text-white/60"
                        >
                            Discover
                        </p>

                        <p
                            class="mt-2 max-w-sm text-xl font-semibold leading-tight text-white sm:text-2xl"
                        >
                            Great local services are closer than you think.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <!-- TRUST -->
        <section>
            <div class="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
                <div class="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
                    <div>
                        <p
                            class="text-xs font-semibold uppercase tracking-[0.2em] text-primary"
                        >
                            Choose with confidence
                        </p>

                        <h2
                            class="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl"
                        >
                            Know who you're booking.
                        </h2>
                    </div>

                    <div>
                        <p class="text-lg leading-8 text-slate-600">
                            A good booking starts with knowing what to expect.
                            That's why business profiles bring the important
                            details together before you commit.
                        </p>

                        <div
                            class="mt-10 grid gap-0 border-y border-slate-200 sm:grid-cols-2"
                        >
                            <div
                                class="border-b border-slate-200 py-6 sm:border-r sm:pr-8"
                            >
                                <ShieldCheck
                                    class="h-5 w-5 text-primary"
                                    stroke-width="1.7"
                                />

                                <h3
                                    class="mt-4 text-sm font-semibold text-slate-950"
                                >
                                    Reviews & ratings
                                </h3>

                                <p
                                    class="mt-2 text-sm leading-6 text-slate-500"
                                >
                                    See what other customers thought about their
                                    experience.
                                </p>
                            </div>

                            <div class="border-b border-slate-200 py-6 sm:pl-8">
                                <CalendarCheck
                                    class="h-5 w-5 text-primary"
                                    stroke-width="1.7"
                                />

                                <h3
                                    class="mt-4 text-sm font-semibold text-slate-950"
                                >
                                    Services & availability
                                </h3>

                                <p
                                    class="mt-2 text-sm leading-6 text-slate-500"
                                >
                                    Understand what's offered and choose a time
                                    that works for you.
                                </p>
                            </div>

                            <div
                                class="py-6 sm:border-r sm:border-slate-200 sm:pr-8"
                            >
                                <UserRound
                                    class="h-5 w-5 text-primary"
                                    stroke-width="1.7"
                                />

                                <h3
                                    class="mt-4 text-sm font-semibold text-slate-950"
                                >
                                    Meet the professional
                                </h3>

                                <p
                                    class="mt-2 text-sm leading-6 text-slate-500"
                                >
                                    Learn more about the people behind the
                                    services you choose.
                                </p>
                            </div>

                            <div class="py-6 sm:pl-8">
                                <Search
                                    class="h-5 w-5 text-primary"
                                    stroke-width="1.7"
                                />

                                <h3
                                    class="mt-4 text-sm font-semibold text-slate-950"
                                >
                                    Compare your options
                                </h3>

                                <p
                                    class="mt-2 text-sm leading-6 text-slate-500"
                                >
                                    Take your time and find the service and
                                    professional that feels right.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- BOOKING -->
        <section class="bg-slate-950 text-white">
            <div class="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
                <div class="grid gap-12 lg:grid-cols-[1fr_auto] lg:items-end">
                    <div class="max-w-2xl">
                        <p
                            class="text-xs font-semibold uppercase tracking-[0.2em] text-primary"
                        >
                            Ready when you are
                        </p>

                        <h2
                            class="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl"
                        >
                            Find someone great. Book with confidence.
                        </h2>

                        <p
                            class="mt-5 max-w-xl text-base leading-7 text-white/60"
                        >
                            Explore local professionals and take the next step
                            when you've found the right one.
                        </p>
                    </div>

                    <NuxtLink
                        :to="NAVIGATION_PATHS.DISCOVER"
                        class="inline-flex h-12 items-center justify-center gap-2 bg-white px-6 text-sm font-semibold text-slate-950 transition-colors hover:bg-primary hover:text-white"
                    >
                        Explore services
                        <ArrowRight class="h-4 w-4" stroke-width="1.8" />
                    </NuxtLink>
                </div>
            </div>
        </section>
    </div>
    <Footer />
</template>
