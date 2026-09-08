<script setup lang="ts">
import {
    Apple,
    BriefcaseBusiness,
    ChevronDown,
    Facebook,
    HelpCircle,
    Instagram,
    Linkedin,
    Search,
    Shield,
    Smartphone,
    Users,
} from "lucide-vue-next";
import { ref } from "vue";
import { NAVIGATION_PATHS } from "~/utils/constants";

const openSection = ref<string | null>(null);

const toggleSection = (section: string) => {
    openSection.value = openSection.value === section ? null : section;
};

const footerSections = [
    {
        id: "customers",
        title: "For Customers",
        icon: Search,
        links: [
            {
                label: "Find a Service",
                to: NAVIGATION_PATHS.DISCOVER,
            },
            {
                label: "Browse Categories",
                to: NAVIGATION_PATHS.DISCOVER,
            },
            {
                label: "Local Communities",
                to: "/community",
            },
            {
                label: "How DailyBookings Works",
                to: "/how-it-works",
            },
            {
                label: "Book with Confidence",
                to: NAVIGATION_PATHS.PRIVACY,
            },
            {
                label: "Help & Support",
                to: NAVIGATION_PATHS.HELP,
            },
        ],
    },

    {
        id: "business",
        title: "For Businesses",
        icon: BriefcaseBusiness,
        links: [
            {
                label: "Become a Professional",
                to: "/for-business",
            },
            {
                label: "Professional Features",
                to: NAVIGATION_PATHS.BUSINESS_FEATURES,
            },
            {
                label: "Pricing",
                to: NAVIGATION_PATHS.BUSINESS_PRICING,
            },
            {
                label: "Success Stories",
                to: NAVIGATION_PATHS.BLOG,
            },
            {
                label: "Business Resources",
                to: NAVIGATION_PATHS.BUSINESS_FEATURES,
            },
        ],
    },

    {
        id: "dailybookings",
        title: "DailyBookings",
        icon: Users,
        links: [
            {
                label: "About Us",
                to: NAVIGATION_PATHS.ABOUT,
            },
            {
                label: "Careers",
                to: NAVIGATION_PATHS.CAREERS,
            },
            {
                label: "Blog",
                to: NAVIGATION_PATHS.BLOG,
            },
            {
                label: "Contact Us",
                to: NAVIGATION_PATHS.CONTACT,
            },
            {
                label: "Press & Media",
                to: NAVIGATION_PATHS.ABOUT,
            },
        ],
    },
    {
        id: "legal",
        title: "Legal",
        icon: Shield,
        links: [
            { label: "Privacy Policy", to: NAVIGATION_PATHS.PRIVACY },
            { label: "Terms of Service", to: NAVIGATION_PATHS.TERMS },
            { label: "Trust & Safety", to: NAVIGATION_PATHS.PRIVACY },
            { label: "Cookie Policy", to: NAVIGATION_PATHS.COOKIES },
            { label: "Community Guidelines", to: NAVIGATION_PATHS.TERMS },
        ],
    },
];

const socialLinks = [
    {
        label: "Facebook",
        href: "#",
        icon: Facebook,
    },
    {
        label: "Instagram",
        href: "#",
        icon: Instagram,
    },
    {
        label: "LinkedIn",
        href: "#",
        icon: Linkedin,
    },
];
</script>

<template>
    <footer class="border-t border-slate-200 bg-slate-50 text-slate-900">
        <div class="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <div
                class="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.35fr_1fr_1fr_1fr_1fr]"
            >
                <div>
                    <NuxtLink
                        :to="NAVIGATION_PATHS.HOME"
                        class="inline-flex items-center"
                    >
                        <div class="flex items-center overflow-hidden">
                            <img
                                src="/mobile-logo.png"
                                alt="DailyBookings"
                                class="h-6 w-auto object-contain"
                            />
                            <img
                                src="/logo.png"
                                alt="DailyBookings"
                                class="hidden h-8 w-auto object-contain md:block"
                            />
                        </div>
                    </NuxtLink>
                    <p class="mt-6 max-w-xs text-sm leading-6 text-slate-500">
                        Discover trusted local professionals and book services
                        that fit your life.
                    </p>

                    <div class="mt-5 text-sm leading-6 text-slate-500">
                        <p>South Africa</p>
                        <p>Made for local communities.</p>
                    </div>

                    <!-- APP -->
                    <div class="mt-7">
                        <p
                            class="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900"
                        >
                            <Smartphone
                                class="h-4 w-4 text-primary"
                                stroke-width="1.8"
                            />
                            Get the app
                        </p>

                        <NuxtLink
                            to="/"
                            class="inline-flex h-10 items-center gap-2 border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-900 transition-colors hover:border-slate-900 hover:bg-slate-900 hover:text-white"
                        >
                            <Apple class="h-4 w-4" stroke-width="1.8" />
                            Download the app
                        </NuxtLink>
                    </div>

                    <!-- SOCIAL ICONS -->
                    <div class="mt-7 flex items-center gap-2">
                        <a
                            v-for="social in socialLinks"
                            :key="social.label"
                            :href="social.href"
                            :aria-label="social.label"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="flex h-10 w-10 items-center justify-center border border-slate-200 bg-white text-slate-500 transition-colors hover:border-primary hover:bg-primary hover:text-white"
                        >
                            <component
                                :is="social.icon"
                                class="h-4 w-4"
                                stroke-width="1.8"
                            />
                        </a>
                    </div>
                </div>

                <!-- FOOTER SECTIONS -->
                <div
                    v-for="section in footerSections"
                    :key="section.id"
                    class="border-t border-slate-200 pt-5 md:border-0 md:pt-0"
                >
                    <!-- SECTION HEADER -->
                    <button
                        type="button"
                        class="flex w-full items-center justify-between text-left md:pointer-events-none"
                        @click="toggleSection(section.id)"
                    >
                        <span class="flex items-center gap-2.5">
                            <component
                                :is="section.icon"
                                class="h-4 w-4 text-primary"
                                stroke-width="1.8"
                            />

                            <span class="text-sm font-semibold text-slate-900">
                                {{ section.title }}
                            </span>
                        </span>

                        <ChevronDown
                            class="h-4 w-4 text-slate-400 transition-transform duration-200 md:hidden"
                            :class="
                                openSection === section.id ? 'rotate-180' : ''
                            "
                            stroke-width="1.8"
                        />
                    </button>

                    <!-- LINKS -->
                    <div
                        class="grid overflow-hidden transition-all duration-200 md:mt-5 md:block"
                        :class="
                            openSection === section.id
                                ? 'grid-rows-[1fr]'
                                : 'grid-rows-[0fr] md:grid-rows-[1fr]'
                        "
                    >
                        <div class="min-h-0">
                            <ul class="space-y-3 pt-4 md:pt-0">
                                <li
                                    v-for="link in section.links"
                                    :key="link.label"
                                >
                                    <NuxtLink
                                        :to="link.to"
                                        class="text-sm text-slate-500 transition-colors hover:text-primary"
                                    >
                                        {{ link.label }}
                                    </NuxtLink>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <!-- SOCIAL / COMMUNITY -->
            <div
                class="mt-14 grid gap-8 border-t border-slate-200 pt-10 md:grid-cols-2 lg:mt-16 lg:grid-cols-[1fr_auto]"
            >
                <div>
                    <p
                        class="flex items-center gap-2 text-sm font-semibold text-slate-900"
                    >
                        <Users
                            class="h-4 w-4 text-primary"
                            stroke-width="1.8"
                        />
                        Stay connected
                    </p>

                    <p class="mt-2 max-w-lg text-sm leading-6 text-slate-500">
                        Follow DailyBookings for local businesses, services,
                        stories and inspiration from our community.
                    </p>
                </div>

                <div class="flex items-center gap-2">
                    <a
                        v-for="social in socialLinks"
                        :key="social.label"
                        :href="social.href"
                        :aria-label="social.label"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="flex h-10 w-10 items-center justify-center border border-slate-200 bg-white text-slate-500 transition-colors hover:border-primary hover:bg-primary hover:text-white"
                    >
                        <component
                            :is="social.icon"
                            class="h-4 w-4"
                            stroke-width="1.8"
                        />
                    </a>
                </div>
            </div>

            <!-- DIVIDER -->
            <div class="mt-10 border-t border-slate-200 lg:mt-12" />

            <!-- BOTTOM -->
            <div
                class="flex flex-col gap-4 py-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between"
            >
                <p>
                    © {{ new Date().getFullYear() }} DailyBookings. All rights
                    reserved.
                </p>

                <div class="flex flex-wrap gap-x-5 gap-y-2">
                    <NuxtLink
                        :to="NAVIGATION_PATHS.TERMS"
                        class="transition-colors hover:text-slate-700"
                    >
                        Terms
                    </NuxtLink>

                    <NuxtLink
                        :to="NAVIGATION_PATHS.PRIVACY"
                        class="transition-colors hover:text-slate-700"
                    >
                        Privacy
                    </NuxtLink>

                    <NuxtLink
                        :to="NAVIGATION_PATHS.COOKIES"
                        class="transition-colors hover:text-slate-700"
                    >
                        Cookies
                    </NuxtLink>

                    <NuxtLink
                        :to="NAVIGATION_PATHS.HELP"
                        class="inline-flex items-center gap-1.5 transition-colors hover:text-slate-700"
                    >
                        <HelpCircle class="h-3.5 w-3.5" stroke-width="1.8" />
                        Help
                    </NuxtLink>
                </div>
            </div>
        </div>
    </footer>
</template>
