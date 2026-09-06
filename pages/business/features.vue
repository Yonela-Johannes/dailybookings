<script setup lang="ts">
import {
    BarChart3,
    Calendar,
    CheckCircle2,
    Globe,
    MessageSquare,
    ShieldCheck,
    Smartphone,
    Users,
} from "lucide-vue-next";
import { NAVIGATION_PATHS } from "~/utils/constants";

useHead({
    title: "Professional Features | DailyBookings Business",
});

const features = [
    {
        title: "Booking Management",
        description: "Accept, reschedule or cancel bookings with ease. Keep track of your entire day at a glance.",
        icon: Calendar
    },
    {
        title: "Team Collaboration",
        description: "Add multiple staff members, manage their schedules and assign specific services to experts.",
        icon: Users
    },
    {
        title: "Business Analytics",
        description: "Detailed reports on your revenue, client retention and most popular treatments.",
        icon: BarChart3
    },
    {
        title: "Verified Reviews",
        description: "Collect and display verified feedback from real clients to build your local reputation.",
        icon: CheckCircle2
    },
    {
        title: "Mobile Dashboard",
        description: "Our platform is fully responsive. Manage your business from your phone, tablet or desktop.",
        icon: Smartphone
    },
    {
        title: "Secure Payments",
        description: "Integrated payment options for deposits or full upfront payments where required.",
        icon: ShieldCheck
    }
];
</script>

<template>
    <main class="min-h-screen bg-white pt-16">
        <section class="border-b border-slate-200 bg-slate-50 py-20 lg:py-32">
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
                <p class="mb-5 text-[10px] font-bold uppercase tracking-[0.22em] text-primary">
                    Core Capabilities
                </p>

                <h1 class="mx-auto max-w-4xl text-4xl font-bold leading-[1.1] tracking-tight text-slate-950 md:text-6xl lg:text-7xl">
                    Everything you need <br />to manage your craft.
                </h1>

                <p class="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-slate-600 md:text-xl">
                    Powerful features designed for local professionals, but simple enough to use every day.
                </p>
            </div>
        </section>

        <section class="py-24 lg:py-36">
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div class="grid gap-px bg-slate-200 border border-slate-200">
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px">
                        <div v-for="f in features" :key="f.title" class="bg-white p-12 hover:bg-slate-50 transition-colors">
                            <div class="mb-8 flex h-12 w-12 items-center justify-center border border-slate-200 bg-white text-primary shadow-sm">
                                <component :is="f.icon" class="h-6 w-6" />
                            </div>
                            <h3 class="text-xl font-bold text-slate-950 tracking-tight">{{ f.title }}</h3>
                            <p class="mt-4 text-sm leading-7 text-slate-600 font-medium">
                                {{ f.description }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Visual Highlight -->
        <section class="bg-slate-950 py-24 lg:py-36 overflow-hidden">
             <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                 <div class="grid lg:grid-cols-2 gap-20 items-center">
                     <div class="max-w-xl">
                        <h2 class="text-3xl font-bold tracking-tight text-white md:text-5xl leading-tight">
                            Your business, <br />in your pocket.
                        </h2>
                        <p class="mt-8 text-lg text-slate-400 leading-relaxed font-medium">
                            We've optimized every view for mobile, so you never miss a booking. Whether you're in the salon, at a studio, or on the move, DailyBookings is with you.
                        </p>
                        <div class="mt-10">
                            <NuxtLink :to="NAVIGATION_PATHS.REGISTER" class="inline-flex h-12 items-center justify-center bg-primary px-8 text-sm font-bold text-white transition-all hover:bg-white hover:text-slate-950 uppercase tracking-widest">
                                Get started for free
                            </NuxtLink>
                        </div>
                     </div>
                     <div class="relative aspect-[16/10] bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                         <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80" alt="Dashboard preview" class="w-full h-full object-cover opacity-80" />
                     </div>
                 </div>
             </div>
        </section>
    </main>
    <Footer />
</template>
