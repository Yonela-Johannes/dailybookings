<script setup lang="ts">
import { ChevronDown, Search, ArrowRight, MessageSquare, BookOpen, ShieldQuestion } from "lucide-vue-next";
import { ref, computed } from "vue";
import { NAVIGATION_PATHS } from "~/utils/constants";

useHead({
    title: "Help Center | DailyBookings",
    meta: [
        { name: "description", content: "Find answers to frequently asked questions and get support for using DailyBookings." }
    ]
});

const searchQuery = ref("");
const openFaqId = ref<string | null>(null);

const faqs = [
    {
        id: "booking-1",
        category: "Bookings",
        question: "How do I make a booking?",
        answer: "Simply search for a service or business, select the treatments you want, choose your preferred professional, date and time, and confirm. You'll receive an instant confirmation via email."
    },
    {
        id: "booking-2",
        category: "Bookings",
        question: "Can I cancel or reschedule my appointment?",
        answer: "Yes, you can manage your bookings through your customer dashboard. Each business has its own cancellation policy, which you can see on their profile page before booking."
    },
    {
        id: "payment-1",
        category: "Payments",
        question: "Do I have to pay online?",
        answer: "It depends on the business. Some providers require an online deposit or full payment to secure your slot, while others allow you to pay at the venue."
    },
    {
        id: "account-1",
        category: "Account",
        question: "How do I create an account?",
        answer: "Click on 'Sign Up' in the menu. You can create an account using your email address and a password. This allows you to track your appointments and save your favourite businesses."
    },
    {
        id: "business-1",
        category: "For Businesses",
        question: "How do I list my business on DailyBookings?",
        answer: "Visit our 'For Business' page and follow the prompts to register. Our team will review your application and help you get set up with your profile, services, and calendar."
    }
];

const filteredFaqs = computed(() => {
    if (!searchQuery.value.trim()) return faqs;
    const query = searchQuery.value.toLowerCase();
    return faqs.filter(faq =>
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query) ||
        faq.category.toLowerCase().includes(query)
    );
});

const toggleFaq = (id: string) => {
    openFaqId.value = openFaqId.value === id ? null : id;
};

const categories = ["Bookings", "Payments", "Account", "For Businesses"];
</script>

<template>
    <main class="min-h-screen bg-white">
        <!-- Header -->
        <section class="border-b border-slate-200 bg-slate-50 py-20 lg:py-32">
            <div class="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
                <p class="mb-5 text-[10px] font-bold uppercase tracking-[0.22em] text-primary">
                    Help Center
                </p>

                <h1 class="mx-auto max-w-4xl text-4xl font-bold leading-[1.1] tracking-tight text-slate-950 md:text-6xl lg:text-7xl">
                    How can we help you today?
                </h1>

                <div class="mx-auto mt-10 max-w-2xl">
                    <div class="relative">
                        <Search class="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" stroke-width="1.8" />
                        <input
                            v-model="searchQuery"
                            type="text"
                            placeholder="Search for questions, categories or keywords..."
                            class="h-14 w-full border border-slate-200 bg-white pl-12 pr-4 text-sm text-slate-950 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
                        />
                    </div>
                </div>
            </div>
        </section>

        <!-- Main Content -->
        <section class="py-20 lg:py-32">
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div class="grid gap-16 lg:grid-cols-[1fr_320px]">
                    <!-- FAQs -->
                    <div>
                        <div v-if="filteredFaqs.length > 0" class="space-y-4">
                            <div
                                v-for="faq in filteredFaqs"
                                :key="faq.id"
                                class="border border-slate-200 bg-white transition-colors duration-200"
                                :class="openFaqId === faq.id ? 'border-primary' : 'hover:border-slate-300'"
                            >
                                <button
                                    type="button"
                                    class="flex w-full items-center justify-between px-6 py-5 text-left"
                                    @click="toggleFaq(faq.id)"
                                >
                                    <div class="flex items-center gap-4">
                                        <span class="text-[10px] font-bold uppercase tracking-wider text-primary">
                                            {{ faq.category }}
                                        </span>
                                        <h3 class="text-lg font-bold text-slate-950">
                                            {{ faq.question }}
                                        </h3>
                                    </div>
                                    <ChevronDown
                                        class="h-5 w-5 text-slate-400 transition-transform duration-300"
                                        :class="openFaqId === faq.id ? 'rotate-180 text-primary' : ''"
                                    />
                                </button>

                                <div
                                    v-if="openFaqId === faq.id"
                                    class="px-6 pb-6 pt-0 animate-in fade-in slide-in-from-top-2 duration-300"
                                >
                                    <div class="h-px w-full bg-slate-100 mb-6" />
                                    <p class="text-base leading-7 text-slate-600">
                                        {{ faq.answer }}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div v-else class="py-20 text-center">
                            <p class="text-lg text-slate-500">No results found for "{{ searchQuery }}". Try another search term.</p>
                        </div>
                    </div>

                    <!-- Sidebar -->
                    <aside class="space-y-10">
                        <!-- Contact Card -->
                        <div class="border border-slate-200 bg-slate-50 p-8">
                            <MessageSquare class="h-8 w-8 text-primary" stroke-width="1.8" />
                            <h4 class="mt-6 text-xl font-bold text-slate-950">Still need help?</h4>
                            <p class="mt-4 text-sm leading-6 text-slate-600">
                                If you can't find what you're looking for, our support team is just a message away.
                            </p>
                            <NuxtLink
                                :to="NAVIGATION_PATHS.CONTACT"
                                class="mt-8 group inline-flex items-center gap-2 text-sm font-bold text-primary uppercase tracking-wider"
                            >
                                Contact Support
                                <ArrowRight class="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                            </NuxtLink>
                        </div>

                        <!-- Resources -->
                        <div class="space-y-6 px-2">
                            <h4 class="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Resources</h4>
                            <ul class="space-y-4">
                                <li>
                                    <NuxtLink to="/blog" class="flex items-center gap-3 text-sm font-semibold text-slate-700 hover:text-primary transition-colors">
                                        <BookOpen class="h-4 w-4" />
                                        DailyBookings Blog
                                    </NuxtLink>
                                </li>
                                <li>
                                    <NuxtLink :to="NAVIGATION_PATHS.TERMS" class="flex items-center gap-3 text-sm font-semibold text-slate-700 hover:text-primary transition-colors">
                                        <ShieldQuestion class="h-4 w-4" />
                                        Terms of Service
                                    </NuxtLink>
                                </li>
                            </ul>
                        </div>
                    </aside>
                </div>
            </div>
        </section>

        <!-- Bottom CTA -->
        <section class="bg-slate-950 py-24 text-white lg:py-32">
            <div class="mx-auto max-w-3xl px-5 text-center">
                <h2 class="text-4xl font-bold leading-tight tracking-tight md:text-5xl">
                    Ready to get started?
                </h2>

                <p class="mx-auto mt-6 max-w-xl text-sm leading-6 text-white/70 md:text-base md:leading-7">
                    Join the thousands of users discovering and booking the best local services in South Africa.
                </p>

                <div class="mt-10 flex flex-wrap justify-center gap-6">
                    <NuxtLink
                        :to="NAVIGATION_PATHS.REGISTER"
                        class="group inline-flex h-12 items-center justify-center bg-primary px-8 text-sm font-bold text-white transition-colors hover:bg-primary/90"
                    >
                        Create an account
                    </NuxtLink>

                    <NuxtLink
                        :to="NAVIGATION_PATHS.BUSINESS"
                        class="group inline-flex h-12 items-center justify-center border border-white/20 px-8 text-sm font-bold text-white transition-colors hover:bg-white/10"
                    >
                        List your business
                    </NuxtLink>
                </div>
            </div>
        </section>
    </main>
    <Footer />
</template>
