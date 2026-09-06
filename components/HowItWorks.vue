<script setup lang="ts">
import {
    ArrowRight,
    CalendarCheck,
    Search,
    UserRoundCheck,
} from "lucide-vue-next";

interface Step {
    number: string;
    title: string;
    description: string;
    icon: unknown;
}

const steps: Step[] = [
    {
        number: "01",
        title: "Find what you need",
        description:
            "Search for a service, explore categories, and discover trusted professionals near you.",
        icon: Search,
    },
    {
        number: "02",
        title: "Choose your professional",
        description:
            "Compare profiles, reviews, services and availability to find the right person for you.",
        icon: UserRoundCheck,
    },
    {
        number: "03",
        title: "Book your time",
        description:
            "Pick a time that works for you and confirm your booking. It's that simple.",
        icon: CalendarCheck,
    },
];
</script>

<template>
    <section class="border-t border-slate-200 bg-slate-50">
        <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <!-- Header -->
            <div
                class="flex flex-col gap-5 md:flex-row md:items-end md:justify-between"
            >
                <div class="max-w-2xl">
                    <p
                        class="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-primary"
                    >
                        How it works
                    </p>

                    <h2
                        class="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl"
                    >
                        Booking made simple.
                    </h2>

                    <p
                        class="mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-base"
                    >
                        From finding the right professional to securing your
                        time, DailyBookings keeps everything in one place.
                    </p>
                </div>
            </div>

            <!-- Steps -->
            <div
                class="mt-12 grid border border-slate-200 bg-white md:grid-cols-3"
            >
                <div
                    v-for="(step, index) in steps"
                    :key="step.number"
                    class="group relative border-b border-slate-200 p-7 last:border-b-0 md:border-b-0 md:border-r md:p-8 md:last:border-r-0 lg:p-10"
                >
                    <!-- Step number -->
                    <div class="flex items-start justify-between">
                        <span
                            class="text-xs font-bold tracking-[0.16em] text-primary"
                        >
                            {{ step.number }}
                        </span>

                        <div
                            class="flex h-10 w-10 items-center justify-center border border-slate-200 text-slate-900 transition-colors duration-200 group-hover:border-primary group-hover:bg-primary group-hover:text-white"
                        >
                            <component
                                :is="step.icon"
                                class="h-[18px] w-[18px]"
                            />
                        </div>
                    </div>

                    <!-- Content -->
                    <div class="mt-14">
                        <h3
                            class="text-xl font-semibold tracking-tight text-slate-950"
                        >
                            {{ step.title }}
                        </h3>

                        <p
                            class="mt-3 max-w-sm text-sm leading-6 text-slate-500"
                        >
                            {{ step.description }}
                        </p>
                    </div>

                    <!-- Connector -->
                    <div
                        v-if="index < steps.length - 1"
                        class="absolute -right-3 top-1/2 z-10 hidden h-6 w-6 -translate-y-1/2 items-center justify-center border border-slate-200 bg-white text-slate-400 md:flex"
                    >
                        <ArrowRight class="h-3.5 w-3.5" />
                    </div>
                </div>
            </div>

            <!-- Bottom CTA -->
            <div
                class="mt-8 flex flex-col gap-4 border-t border-slate-200 pt-7 sm:flex-row sm:items-center sm:justify-between"
            >
                <p class="text-sm text-slate-500">
                    Ready to find your next booking?
                </p>

                <NuxtLink
                    to="/services"
                    class="group inline-flex h-11 w-fit items-center gap-2 bg-slate-950 px-5 text-sm font-semibold text-white transition-colors hover:bg-primary"
                >
                    Explore services

                    <ArrowRight
                        class="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                    />
                </NuxtLink>
            </div>
        </div>
    </section>
</template>
