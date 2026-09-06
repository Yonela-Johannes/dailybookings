<script setup lang="ts">
import { Heart, Sparkles, ShieldCheck, ArrowRight, MapPin, Users, CalendarCheck } from "lucide-vue-next";
import { NAVIGATION_PATHS } from "~/utils/constants";

useHead({
    title: "About Us | DailyBookings",
    meta: [
        { name: "description", content: "Discover the story behind DailyBookings and our mission to simplify local bookings in South Africa." }
    ]
});
</script>

<template>
    <main class="min-h-screen bg-white">
        <!-- Editorial Hero -->
        <section class="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-slate-950">
            <img
                src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=2000&q=80"
                alt="DailyBookings Community"
                class="absolute inset-0 h-full w-full object-cover opacity-60"
            />

            <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

            <div class="relative z-10 max-w-4xl px-5 text-center">
                <p class="mb-6 text-[11px] font-bold uppercase tracking-[0.28em] text-primary">
                    Our Story
                </p>

                <h1 class="text-4xl font-bold leading-[1.1] tracking-tight text-white md:text-6xl lg:text-7xl">
                    Connecting local talent with the community.
                </h1>

                <p class="mx-auto mt-8 max-w-2xl text-lg text-white/80">
                    DailyBookings was built to bridge the gap between South Africa's finest professionals and the people who need them.
                </p>
            </div>
        </section>

        <!-- Philosophy -->
        <section class="py-24 lg:py-36">
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div class="grid items-center gap-14 lg:grid-cols-2 lg:gap-28">
                    <div>
                        <p class="mb-6 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                            Our Philosophy
                        </p>

                        <h2 class="max-w-2xl text-3xl font-bold tracking-tight text-slate-950 md:text-5xl">
                            Greatness is local. Booking it should be simple.
                        </h2>
                    </div>

                    <div class="max-w-xl space-y-7">
                        <p class="text-base leading-7 text-slate-600 md:text-lg md:leading-8">
                            We believe that every community has incredible talent—from world-class stylists and tutors to dedicated handymen and wellness experts. But finding and booking them shouldn't be a chore.
                        </p>

                        <p class="text-base leading-7 text-slate-600 md:text-lg md:leading-8">
                            DailyBookings was founded with a clear mission: to create a trusted local marketplace where quality services and simple, instant bookings live together. We're here to help you discover greatness in your own backyard.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Values -->
        <section class="border-y border-slate-200 bg-slate-50 py-24 lg:py-36">
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div class="mb-16 max-w-2xl">
                    <p class="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                        What We Believe
                    </p>

                    <h2 class="text-3xl font-bold tracking-tight text-slate-950 md:text-5xl">
                        Designed with trust at the core.
                    </h2>
                </div>

                <div class="grid gap-12 md:grid-cols-3 lg:gap-20">
                    <div>
                        <div class="mb-7 flex h-14 w-14 items-center justify-center border border-slate-200 bg-white">
                            <Users class="h-6 w-6 text-primary" />
                        </div>

                        <h3 class="mb-4 text-xl font-bold tracking-tight text-slate-950">
                            Community First
                        </h3>

                        <p class="leading-7 text-slate-600">
                            We exist to serve local businesses and their customers. Every feature we build is designed to strengthen the bond between providers and their communities.
                        </p>
                    </div>

                    <div>
                        <div class="mb-7 flex h-14 w-14 items-center justify-center border border-slate-200 bg-white">
                            <CalendarCheck class="h-6 w-6 text-primary" />
                        </div>

                        <h3 class="mb-4 text-xl font-bold tracking-tight text-slate-950">
                            Effortless Access
                        </h3>

                        <p class="leading-7 text-slate-600">
                            Time is your most valuable resource. We're committed to making the discovery and booking process as seamless as possible, so you can get back to what matters.
                        </p>
                    </div>

                    <div>
                        <div class="mb-7 flex h-14 w-14 items-center justify-center border border-slate-200 bg-white">
                            <ShieldCheck class="h-6 w-6 text-primary" />
                        </div>

                        <h3 class="mb-4 text-xl font-bold tracking-tight text-slate-950">
                            Unwavering Trust
                        </h3>

                        <p class="leading-7 text-slate-600">
                            Verified reviews, secure payments, and clear policies. You should feel confident every time you book a service through DailyBookings.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Stats/Reach -->
        <section class="py-24 lg:py-36">
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div class="grid gap-12 lg:grid-cols-2 lg:gap-24 items-center">
                    <div class="relative aspect-[4/5] overflow-hidden border border-slate-200">
                        <img
                            src="https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1200&q=80"
                            alt="DailyBookings in action"
                            class="h-full w-full object-cover"
                        />
                    </div>

                    <div class="max-w-2xl">
                        <p class="mb-6 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                            Our Impact
                        </p>

                        <h2 class="text-3xl font-bold tracking-tight text-slate-950 md:text-5xl leading-tight">
                            Empowering thousands of local businesses across South Africa.
                        </h2>

                        <div class="mt-12 grid grid-cols-2 gap-8 border-t border-slate-100 pt-10">
                            <div>
                                <p class="text-4xl font-bold text-slate-950">500+</p>
                                <p class="mt-2 text-sm text-slate-500 uppercase tracking-wider font-semibold">Service Providers</p>
                            </div>
                            <div>
                                <p class="text-4xl font-bold text-slate-950">10k+</p>
                                <p class="mt-2 text-sm text-slate-500 uppercase tracking-wider font-semibold">Monthly Bookings</p>
                            </div>
                        </div>

                        <div class="mt-10">
                             <NuxtLink
                                :to="NAVIGATION_PATHS.DISCOVER"
                                class="group inline-flex items-center gap-2 border-b-2 border-primary pb-1 text-sm font-bold text-slate-950 transition-colors hover:text-primary"
                            >
                                Discover local greatness
                                <ArrowRight class="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                            </NuxtLink>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Final CTA -->
        <section class="bg-slate-950 py-24 text-white lg:py-32">
            <div class="mx-auto max-w-3xl px-5 text-center">
                <p class="mb-5 text-[10px] font-bold uppercase tracking-[0.25em] text-primary">
                    Your Journey Starts Here
                </p>

                <h2 class="text-4xl font-bold leading-tight tracking-tight md:text-5xl">
                    Experience your community.
                </h2>

                <p class="mx-auto mt-5 max-w-xl text-sm leading-6 text-white/70 md:text-base md:leading-7">
                    Discover local experts, read verified reviews, and book your next appointment in seconds.
                </p>

                <div class="mt-10 flex flex-wrap justify-center gap-6">
                    <NuxtLink
                        :to="NAVIGATION_PATHS.DISCOVER"
                        class="group inline-flex h-12 items-center justify-center bg-primary px-8 text-sm font-bold text-white transition-colors hover:bg-primary/90"
                    >
                        Find a Service
                    </NuxtLink>

                    <NuxtLink
                        :to="NAVIGATION_PATHS.BUSINESS"
                        class="group inline-flex h-12 items-center justify-center border border-white/20 px-8 text-sm font-bold text-white transition-colors hover:bg-white/10"
                    >
                        For Businesses
                    </NuxtLink>
                </div>
            </div>
        </section>
    </main>
    <Footer />
</template>
