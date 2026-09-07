<script setup lang="ts">
import { ArrowRight, Briefcase, MapPin, Search } from "lucide-vue-next";

useHead({
    title: "Careers | DailyBookings",
    meta: [
        {
            name: "description",
            content:
                "Join the team at DailyBookings and help us build the future of local services in South Africa.",
        },
    ],
});

const jobs = [
    {
        id: "eng-1",
        title: "Senior Full Stack Engineer",
        team: "Engineering",
        location: "Cape Town / Remote",
        type: "Full-time",
    },
    {
        id: "prod-1",
        title: "Product Designer (UI/UX)",
        team: "Product",
        location: "Remote",
        type: "Full-time",
    },
    {
        id: "ops-1",
        title: "Business Development Manager",
        team: "Operations",
        location: "Johannesburg",
        type: "Full-time",
    },
];
</script>

<template>
    <main class="min-h-screen bg-white">
        <!-- Header -->
        <header
            class="bg-slate-950 text-white py-24 lg:py-36 relative overflow-hidden"
        >
            <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2000&q=80"
                alt="Team collaboration"
                class="absolute inset-0 h-full w-full object-cover opacity-20"
            />
            <div
                class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center"
            >
                <p
                    class="mb-5 text-[10px] font-bold uppercase tracking-[0.25em] text-primary"
                >
                    Join the Team
                </p>
                <h1
                    class="text-4xl md:text-7xl font-bold tracking-tight leading-[1.05]"
                >
                    Build the future of <br />local marketplace.
                </h1>
                <p
                    class="mt-8 text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed"
                >
                    We're on a mission to simplify local bookings and empower
                    businesses across South Africa. We need your help.
                </p>
            </div>
        </header>

        <!-- Why Us -->
        <section class="py-24 lg:py-32 bg-white">
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div class="grid gap-16 lg:grid-cols-2 lg:gap-24 items-center">
                    <div class="max-w-xl">
                        <h2
                            class="text-3xl font-bold tracking-tight text-slate-950 md:text-5xl leading-tight"
                        >
                            Why work with DailyBookings?
                        </h2>
                        <p class="mt-8 text-lg text-slate-600 leading-8">
                            We are a small, dedicated team obsessed with
                            creating a platform that genuinely helps local
                            communities. We value autonomy, clear communication,
                            and high-quality craftsmanship.
                        </p>

                        <ul class="mt-10 space-y-6">
                            <li class="flex gap-4">
                                <div
                                    class="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-1"
                                >
                                    <ArrowRight class="h-3.5 w-3.5" />
                                </div>
                                <div>
                                    <p class="font-bold text-slate-950">
                                        Meaningful Impact
                                    </p>
                                    <p class="mt-1 text-slate-600">
                                        Help local business owners grow their
                                        reach and simplify their operations.
                                    </p>
                                </div>
                            </li>
                            <li class="flex gap-4">
                                <div
                                    class="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-1"
                                >
                                    <ArrowRight class="h-3.5 w-3.5" />
                                </div>
                                <div>
                                    <p class="font-bold text-slate-950">
                                        Flexible Culture
                                    </p>
                                    <p class="mt-1 text-slate-600">
                                        We focus on outcomes, not hours. Enjoy a
                                        mix of remote and office-based work.
                                    </p>
                                </div>
                            </li>
                            <li class="flex gap-4">
                                <div
                                    class="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-1"
                                >
                                    <ArrowRight class="h-3.5 w-3.5" />
                                </div>
                                <div>
                                    <p class="font-bold text-slate-950">
                                        Modern Stack
                                    </p>
                                    <p class="mt-1 text-slate-600">
                                        Work with Nuxt 3, Supabase, and the
                                        latest web technologies to build a fast,
                                        scalable platform.
                                    </p>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div
                        class="relative aspect-square lg:aspect-[4/5] overflow-hidden border border-slate-200"
                    >
                        <img
                            src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1000&q=80"
                            alt="Our Office Culture"
                            class="h-full w-full object-cover"
                        />
                    </div>
                </div>
            </div>
        </section>

        <!-- Open Roles -->
        <section class="py-24 lg:py-32 bg-slate-50 border-t border-slate-200">
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div
                    class="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6"
                >
                    <div>
                        <h2
                            class="text-3xl font-bold tracking-tight text-slate-950 md:text-5xl"
                        >
                            Open Positions
                        </h2>
                        <p class="mt-4 text-lg text-slate-600">
                            Explore our current vacancies across South Africa.
                        </p>
                    </div>

                    <div class="relative w-full md:w-80">
                        <Search
                            class="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
                        />
                        <input
                            type="text"
                            placeholder="Filter by role or team..."
                            class="h-11 w-full pl-10 pr-4 border border-slate-200 bg-white text-sm outline-none focus:border-primary"
                        />
                    </div>
                </div>

                <div class="grid gap-4">
                    <div
                        v-for="job in jobs"
                        :key="job.id"
                        class="group flex flex-col sm:flex-row sm:items-center justify-between p-6 sm:p-8 bg-white border border-slate-200 hover:border-primary transition-all duration-300"
                    >
                        <div class="space-y-1">
                            <h3 class="text-xl font-bold text-slate-950">
                                {{ job.title }}
                            </h3>
                            <div
                                class="flex flex-wrap gap-4 text-sm text-slate-500 font-medium"
                            >
                                <span class="flex items-center gap-1.5"
                                    ><Briefcase class="h-3.5 w-3.5" />
                                    {{ job.team }}</span
                                >
                                <span class="flex items-center gap-1.5"
                                    ><MapPin class="h-3.5 w-3.5" />
                                    {{ job.location }}</span
                                >
                                <span class="flex items-center gap-1.5">{{
                                    job.type
                                }}</span>
                            </div>
                        </div>

                        <button
                            class="mt-6 sm:mt-0 h-11 px-6 border border-slate-950 text-sm font-bold text-slate-950 transition hover:bg-slate-950 hover:text-white uppercase tracking-wider"
                        >
                            Apply Now
                        </button>
                    </div>
                </div>

                <div class="mt-16 text-center">
                    <p class="text-slate-500">
                        Don't see a role that fits? Send your CV to
                        <a
                            href="mailto:careers@dailybookings.co.za"
                            class="text-primary font-bold"
                            >careers@dailybookings.co.za</a
                        >
                        and we'll keep you in mind.
                    </p>
                </div>
            </div>
        </section>
    </main>
</template>
