<script setup lang="ts">
import { Check, ArrowRight } from "lucide-vue-next";
import { NAVIGATION_PATHS } from "~/utils/constants";

useHead({
    title: "Simple Pricing | DailyBookings Business",
});

const plans = [
    {
        name: "Starter",
        price: "0",
        description:
            "Perfect for individuals and solo professionals just starting out.",
        features: [
            "Online profile",
            "Up to 20 bookings / month",
            "Core calendar management",
            "Verified reviews",
            "Basic analytics",
        ],
    },
    {
        name: "Professional",
        price: "450",
        description: "Best for growing businesses and small teams.",
        featured: true,
        features: [
            "Unlimited bookings",
            "Team management (up to 5 staff)",
            "Advanced analytics",
            "Service categories",
            "Priority discovery listing",
            "Customer database",
        ],
    },
    {
        name: "Enterprise",
        price: "950",
        description: "For larger studios and multiple locations.",
        features: [
            "Multiple venues",
            "Unlimited staff",
            "Custom branding",
            "Dedicated support",
            "Full reporting API",
            "Advanced marketing tools",
        ],
    },
];
</script>

<template>
    <main class="min-h-screen bg-white pt-16">
        <section class="border-b border-slate-200 bg-slate-50 py-20 lg:py-32">
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
                <p
                    class="mb-5 text-[10px] font-bold uppercase tracking-[0.22em] text-primary"
                >
                    Transparency
                </p>

                <h1
                    class="mx-auto max-w-4xl text-4xl font-bold leading-[1.1] tracking-tight text-slate-950 md:text-6xl lg:text-7xl"
                >
                    One simple price. <br />No hidden surprises.
                </h1>

                <p
                    class="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-slate-600 md:text-xl"
                >
                    We believe in supporting local growth. Choose the plan that
                    fits your current size and scale as you grow.
                </p>
            </div>
        </section>

        <section class="py-24 lg:py-36 bg-white">
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div class="grid gap-8 lg:grid-cols-3">
                    <div
                        v-for="plan in plans"
                        :key="plan.name"
                        class="flex flex-col border border-slate-200 p-8 lg:p-10 relative overflow-hidden"
                        :class="
                            plan.featured
                                ? 'border-primary shadow-2xl shadow-primary/5 ring-1 ring-primary'
                                : ''
                        "
                    >
                        <div
                            v-if="plan.featured"
                            class="absolute top-0 right-0"
                        >
                            <div
                                class="bg-primary text-white text-[9px] font-bold uppercase tracking-widest px-4 py-1 rotate-45 translate-x-3 translate-y-3"
                            >
                                Popular
                            </div>
                        </div>

                        <div class="mb-8">
                            <h3 class="text-xl font-bold text-slate-950">
                                {{ plan.name }}
                            </h3>
                            <p
                                class="mt-4 text-sm text-slate-500 font-medium leading-relaxed"
                            >
                                {{ plan.description }}
                            </p>
                        </div>

                        <div class="mb-10 flex items-baseline gap-1">
                            <span
                                class="text-sm font-bold text-slate-500 uppercase"
                                >R</span
                            >
                            <span
                                class="text-5xl font-black text-slate-950 tracking-tighter"
                                >{{ plan.price }}</span
                            >
                            <span
                                class="text-sm font-bold text-slate-400 uppercase"
                                >/ month</span
                            >
                        </div>

                        <ul class="mb-12 space-y-5 flex-1">
                            <li
                                v-for="feat in plan.features"
                                :key="feat"
                                class="flex gap-3 text-sm"
                            >
                                <Check
                                    class="h-4 w-4 text-primary shrink-0 mt-0.5"
                                    stroke-width="3"
                                />
                                <span class="text-slate-600 font-medium">{{
                                    feat
                                }}</span>
                            </li>
                        </ul>

                        <NuxtLink
                            :to="NAVIGATION_PATHS.REGISTER"
                            class="inline-flex h-12 items-center justify-center text-sm font-bold uppercase tracking-widest transition-all"
                            :class="
                                plan.featured
                                    ? 'bg-primary text-white hover:bg-slate-950 shadow-lg'
                                    : 'bg-slate-50 text-slate-950 border border-slate-200 hover:border-slate-950 hover:bg-white'
                            "
                        >
                            Select {{ plan.name }}
                        </NuxtLink>
                    </div>
                </div>

                <div class="mt-20 text-center border-t border-slate-100 pt-16">
                    <p class="text-slate-500 font-medium">
                        All prices are in South African Rand (ZAR). No long-term
                        contracts. Cancel anytime.
                    </p>
                </div>
            </div>
        </section>

        <!-- FAQ Mini -->
        <section class="py-24 bg-slate-50 border-t border-slate-200">
            <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                <h2 class="text-3xl font-bold text-slate-950 mb-12 text-center">
                    Frequently asked questions
                </h2>
                <div class="space-y-12">
                    <div>
                        <h4 class="font-bold text-slate-950 mb-3">
                            Can I change plans later?
                        </h4>
                        <p class="text-slate-600 leading-7">
                            Yes, you can upgrade or downgrade your plan at any
                            time through your dashboard. Changes take effect on
                            your next billing cycle.
                        </p>
                    </div>
                    <div>
                        <h4 class="font-bold text-slate-950 mb-3">
                            Do you take a commission?
                        </h4>
                        <p class="text-slate-600 leading-7">
                            We do not take a commission on your bookings. You
                            pay a flat monthly fee to use the platform. Standard
                            payment processing fees may apply if you use our
                            integrated payment gateway.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    </main>
</template>
