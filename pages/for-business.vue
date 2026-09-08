<script setup lang="ts">
import {
    ArrowRight,
    BarChart3,
    CalendarCheck,
    CheckCircle2,
    Globe,
    LayoutDashboard,
    MessageSquare,
    Smartphone,
    TrendingUp,
    Users,
    Zap,
} from "lucide-vue-next";
import { NAVIGATION_PATHS } from "~/utils/constants";

useHead({
    title: "Become a Professional | DailyBookings Business",
    meta: [
        {
            name: "description",
            content:
                "List your business on DailyBookings and grow your reach with our powerful booking and management platform.",
        },
    ],
});

const features = [
    {
        title: "Smart Calendar",
        description:
            "Manage your appointments with a beautiful, intuitive interface designed for speed.",
        icon: CalendarCheck,
    },
    {
        title: "Team Management",
        description:
            "Add staff, set individual schedules and track performance across your whole team.",
        icon: Users,
    },
    {
        title: "Verified Reviews",
        description:
            "Build trust with reviews from real, verified customers who have completed bookings.",
        icon: CheckCircle2,
    },
    {
        title: "Business Analytics",
        description:
            "Understand your growth with detailed reports on revenue, popular services and peak times.",
        icon: BarChart3,
    },
    {
        title: "Instant Discovery",
        description:
            "Get discovered by local customers searching for your specific expertise in your area.",
        icon: Globe,
    },
    {
        title: "Mobile Ready",
        description:
            "Manage your entire business from any device, anywhere. Your calendar goes where you do.",
        icon: Smartphone,
    },
];

const steps = [
    {
        number: "01",
        title: "Create your profile",
        description:
            "Set up your venue, add your address, contact info and business hours.",
    },
    {
        number: "02",
        title: "Add your services",
        description:
            "List your treatments, set prices and durations. Organise them by categories.",
    },
    {
        number: "03",
        title: "Invite your team",
        description:
            "Add your staff members and assign them to the services they provide.",
    },
    {
        number: "04",
        title: "Get booked",
        description:
            "Open your calendar and start receiving bookings from local customers instantly.",
    },
];
</script>

<template>
    <main class="min-h-screen bg-white pt-16">
        <!-- Hero Section -->
        <section
            class="relative overflow-hidden border-b border-slate-200 bg-slate-950 py-24 text-white lg:py-32"
        >
            <div
                class="absolute inset-0 z-0 opacity-20"
                style="
                    background-image: radial-gradient(
                        circle at 2px 2px,
                        #33689c 1px,
                        transparent 0
                    );
                    background-size: 40px 40px;
                "
            />

            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
                <div class="max-w-3xl">
                    <p
                        class="mb-6 text-[10px] font-bold uppercase tracking-[0.25em] text-primary"
                    >
                        DailyBookings for Business
                    </p>

                    <h1
                        class="text-4xl font-bold leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl"
                    >
                        Get discovered. <br />Get booked. <br />
                        <span class="text-primary italic">Grow your business.</span>
                    </h1>

                    <p
                        class="mt-8 max-w-xl text-lg leading-relaxed text-slate-300 md:text-xl"
                    >
                        The ultimate platform for local professionals. Manage
                        your calendar, your team and your customers in one
                        powerful marketplace.
                    </p>

                    <div class="mt-10 flex flex-wrap gap-4">
                        <NuxtLink
                            :to="{ path: NAVIGATION_PATHS.REGISTER, query: { role: 'BUSINESS_OWNER' } }"
                            class="group inline-flex h-12 items-center justify-center bg-primary px-8 text-sm font-bold text-white transition-all hover:bg-white hover:text-slate-950"
                        >
                            Get Started
                            <ArrowRight
                                class="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                            />
                        </NuxtLink>

                        <NuxtLink
                            to="#features"
                            class="inline-flex h-12 items-center justify-center border border-white/20 px-8 text-sm font-bold text-white transition-colors hover:bg-white/10"
                        >
                            Explore Features
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </section>

        <!-- Features Grid -->
        <section id="features" class="py-24 lg:py-36">
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div class="max-w-2xl mb-16">
                    <h2
                        class="text-3xl font-bold tracking-tight text-slate-950 md:text-5xl"
                    >
                        Everything you need to <br />run a modern practice.
                    </h2>
                    <p class="mt-6 text-lg text-slate-600 leading-relaxed">
                        We've built DailyBookings to be more than just a booking
                        site. It's a partner in your growth.
                    </p>
                </div>

                <div class="grid gap-px bg-slate-200 border border-slate-200">
                    <div
                        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px"
                    >
                        <div
                            v-for="feature in features"
                            :key="feature.title"
                            class="bg-white p-10 lg:p-12 hover:bg-slate-50 transition-colors"
                        >
                            <div
                                class="mb-8 flex h-12 w-12 items-center justify-center border border-slate-200 bg-white text-primary shadow-sm"
                            >
                                <component :is="feature.icon" class="h-6 w-6" />
                            </div>

                            <h3
                                class="text-xl font-bold tracking-tight text-slate-950"
                            >
                                {{ feature.title }}
                            </h3>

                            <p
                                class="mt-4 text-sm leading-7 text-slate-600 font-medium"
                            >
                                {{ feature.description }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- How it works -->
        <section class="border-t border-slate-200 bg-slate-50 py-24 lg:py-36">
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div class="text-center max-w-3xl mx-auto mb-20">
                    <p
                        class="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-primary"
                    >
                        Getting Started
                    </p>
                    <h2
                        class="text-3xl font-bold tracking-tight text-slate-950 md:text-5xl"
                    >
                        Live in four simple steps.
                    </h2>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div
                        v-for="(step, idx) in steps"
                        :key="step.title"
                        class="relative"
                    >
                        <div
                            class="mb-6 text-4xl font-black text-slate-100 italic"
                        >
                            {{ step.number }}
                        </div>
                        <h3 class="text-lg font-bold text-slate-950 mb-3">
                            {{ step.title }}
                        </h3>
                        <p class="text-sm text-slate-500 leading-relaxed font-medium">
                            {{ step.description }}
                        </p>

                        <div v-if="idx < steps.length - 1" class="hidden lg:block absolute top-12 -right-4 translate-x-1/2">
                            <ArrowRight class="h-4 w-4 text-slate-200" />
                        </div>
                    </div>
                </div>

                <div class="mt-20 text-center">
                     <NuxtLink
                        :to="{ path: NAVIGATION_PATHS.REGISTER, query: { role: 'BUSINESS_OWNER' } }"
                        class="inline-flex h-14 items-center justify-center bg-slate-950 px-10 text-sm font-bold text-white transition-all hover:bg-primary shadow-xl"
                    >
                        Register your business today
                    </NuxtLink>
                </div>
            </div>
        </section>

        <!-- Business Impact Section -->
        <section class="py-24 lg:py-36 overflow-hidden">
             <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                 <div class="grid lg:grid-cols-2 gap-16 items-center">
                     <div class="relative aspect-[16/10] lg:aspect-square border border-slate-200 bg-slate-50 overflow-hidden shadow-2xl">
                        <img src="https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1200&q=80" alt="Business growth" class="w-full h-full object-cover" />
                        <div class="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent" />
                     </div>

                     <div class="max-w-xl">
                        <p class="mb-6 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Powerful Insights</p>
                        <h2 class="text-3xl font-bold tracking-tight text-slate-950 md:text-5xl leading-tight">
                            Understand your growth, <br />not just your bookings.
                        </h2>
                        <p class="mt-8 text-lg text-slate-600 leading-relaxed font-medium">
                            We provide the tools to see which services are performing, how your staff are being rated, and where your revenue is coming from.
                        </p>

                        <div class="mt-12 space-y-8">
                            <div class="flex gap-5">
                                <div class="h-10 w-10 shrink-0 border border-slate-100 bg-slate-50 flex items-center justify-center text-primary shadow-sm">
                                    <TrendingUp class="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 class="font-bold text-slate-950 uppercase tracking-wider text-xs mb-2">Revenue Tracking</h4>
                                    <p class="text-sm text-slate-500 leading-relaxed">Real-time insights into your daily, weekly and monthly earnings.</p>
                                </div>
                            </div>
                            <div class="flex gap-5">
                                <div class="h-10 w-10 shrink-0 border border-slate-100 bg-slate-50 flex items-center justify-center text-primary shadow-sm">
                                    <Zap class="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 class="font-bold text-slate-950 uppercase tracking-wider text-xs mb-2">Instant Notifications</h4>
                                    <p class="text-sm text-slate-500 leading-relaxed">Get alerted the moment a booking is made, cancelled or rescheduled.</p>
                                </div>
                            </div>
                        </div>
                     </div>
                 </div>
             </div>
        </section>

        <!-- Final CTA -->
        <section class="bg-primary py-24 text-white lg:py-32">
            <div class="mx-auto max-w-4xl px-5 text-center">
                <h2 class="text-4xl font-bold leading-tight tracking-tight md:text-6xl">
                    Built for greatness. <br />Made for you.
                </h2>

                <p class="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-white/90 md:text-xl">
                    Join the thousands of local professionals who trust DailyBookings to power their practice.
                </p>

                <div class="mt-12 flex flex-wrap justify-center gap-6">
                    <NuxtLink
                        :to="{ path: NAVIGATION_PATHS.REGISTER, query: { role: 'BUSINESS_OWNER' } }"
                        class="group inline-flex h-14 items-center justify-center bg-white px-12 text-sm font-bold text-slate-950 transition-all hover:bg-slate-950 hover:text-white uppercase tracking-widest"
                    >
                        Create your profile
                    </NuxtLink>

                     <NuxtLink
                        :to="NAVIGATION_PATHS.CONTACT"
                        class="group inline-flex h-14 items-center justify-center border-2 border-white px-12 text-sm font-bold text-white transition-all hover:bg-white hover:text-slate-950 uppercase tracking-widest"
                    >
                        Talk to Sales
                    </NuxtLink>
                </div>
            </div>
        </section>
    </main>
</template>
