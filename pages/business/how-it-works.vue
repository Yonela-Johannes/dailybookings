<script setup lang="ts">
import {
    ArrowRight,
    CheckCircle2,
    Clock,
    LayoutDashboard,
    Search,
    Users,
} from "lucide-vue-next";
import { NAVIGATION_PATHS } from "~/utils/constants";

useHead({
    title: "How it Works for Professionals | DailyBookings Business",
});

const steps = [
    {
        title: "List your business",
        description:
            "Create a professional profile that showcases your work, location and values.",
        icon: Search,
    },
    {
        title: "Setup your menu",
        description:
            "Add your services with clear pricing and durations. Organise by category.",
        icon: LayoutDashboard,
    },
    {
        title: "Manage your team",
        description:
            "Invite your staff and set their specific schedules and specialties.",
        icon: Users,
    },
    {
        title: "Open your calendar",
        description:
            "Set your working hours and start receiving instant bookings from customers.",
        icon: Clock,
    },
];
</script>

<template>
    <main class="min-h-screen bg-white pt-16">
        <section class="border-b border-slate-200 bg-slate-50 py-20 lg:py-32">
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
                <p class="mb-5 text-[10px] font-bold uppercase tracking-[0.22em] text-primary">
                    For Professionals
                </p>

                <h1 class="mx-auto max-w-4xl text-4xl font-bold leading-[1.1] tracking-tight text-slate-950 md:text-6xl lg:text-7xl">
                    Simple, transparent <br />and built for growth.
                </h1>

                <p class="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-slate-600 md:text-xl">
                    DailyBookings handles the logistics so you can focus on your craft. Here's how we help you succeed.
                </p>
            </div>
        </section>

        <section class="py-24 lg:py-36">
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div class="grid gap-16 lg:grid-cols-2 lg:items-center">
                    <div class="space-y-12">
                        <div v-for="(step, idx) in steps" :key="step.title" class="flex gap-8 group">
                            <div class="flex h-14 w-14 shrink-0 items-center justify-center border border-slate-200 bg-white text-primary shadow-sm transition-colors group-hover:border-primary group-hover:bg-primary group-hover:text-white">
                                <component :is=\"step.icon\" class=\"h-6 w-6\" />
                            </div>
                            <div>
                                <h3 class=\"text-xl font-bold text-slate-950\">{{ step.title }}</h3>
                                <p class=\"mt-3 text-base leading-7 text-slate-600 font-medium\">
                                    {{ step.description }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class=\"relative aspect-square overflow-hidden border border-slate-200 bg-slate-100 shadow-2xl\">
                         <img src=\"https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1000&q=80\" alt=\"Team working\" class=\"h-full w-full object-cover\" />
                    </div>
                </div>
            </div>
        </section>

        <!-- CTA -->
        <section class=\"bg-slate-950 py-24 text-white lg:py-32\">
            <div class=\"mx-auto max-w-3xl px-5 text-center\">
                <h2 class=\"text-4xl font-bold leading-tight tracking-tight md:text-5xl\">
                    Start your journey today.
                </h2>
                <p class=\"mx-auto mt-6 max-w-xl text-sm leading-6 text-white/70 md:text-base md:leading-7\">
                    Join the local community of professionals growing their business with DailyBookings.
                </p>
                <div class=\"mt-10\">
                    <NuxtLink :to=\"NAVIGATION_PATHS.REGISTER\" class=\"inline-flex h-14 items-center justify-center bg-primary px-10 text-sm font-bold text-white transition-all hover:bg-white hover:text-slate-950 uppercase tracking-widest\">
                        Create your account
                    </NuxtLink>
                </div>
            </div>
        </section>
    </main>
    <Footer />
</template>
