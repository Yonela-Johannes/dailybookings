<script setup lang="ts">
import {
    Apple,
    ChevronDown,
    Facebook,
    Instagram,
    Linkedin,
    Smartphone,
} from "lucide-vue-next";
import { ref } from "vue";

const openSection = ref<string | null>(null);

const toggleSection = (section: string) => {
    openSection.value = openSection.value === section ? null : section;
};

const footerSections = [
    {
        id: "customers",
        title: "For Customers",
        links: [
            {
                label: "Find a Service",
                to: "/services",
            },
            {
                label: "Explore Categories",
                to: "/categories",
            },
            {
                label: "How DailyBookings Works",
                to: "/how-it-works",
            },
            {
                label: "Popular Services",
                to: "/services",
            },
            {
                label: "Help & Support",
                to: "/help",
            },
        ],
    },
    {
        id: "business",
        title: "For Businesses",
        links: [
            {
                label: "Become a Provider",
                to: "/providers",
            },
            {
                label: "Why DailyBookings?",
                to: "/providers",
            },
            {
                label: "How It Works",
                to: "/providers/how-it-works",
            },
            {
                label: "Provider Features",
                to: "/providers/features",
            },
            {
                label: "Pricing",
                to: "/providers/pricing",
            },
            {
                label: "Get Started",
                to: "/providers",
            },
        ],
    },
    {
        id: "dailybookings",
        title: "DailyBookings",
        links: [
            {
                label: "About Us",
                to: "/about",
            },
            {
                label: "Careers",
                to: "/careers",
            },
            {
                label: "Blog",
                to: "/blog",
            },
            {
                label: "Contact Us",
                to: "/contact",
            },
            {
                label: "Help Centre",
                to: "/help",
            },
            {
                label: "Sitemap",
                to: "/sitemap",
            },
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
            <!-- MAIN FOOTER -->
            <div
                class="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.25fr_1fr_1fr_1fr_1fr]"
            >
                <!-- BRAND -->
                <div>
                    <NuxtLink to="/" class="inline-flex items-center">
                        <img
                            src="/logo.png"
                            alt="DailyBookings"
                            class="h-9 w-auto rounded-md"
                        />
                    </NuxtLink>

                    <p class="mt-6 max-w-xs text-sm leading-6 text-slate-500">
                        Discover trusted local professionals and book services
                        that fit your life.
                    </p>

                    <!-- LOCATION -->
                    <div class="mt-5 text-sm leading-6 text-slate-500">
                        <p>South Africa</p>
                        <p>Made for local communities.</p>
                    </div>

                    <!-- GET THE APP -->
                    <div class="mt-7">
                        <p class="mb-3 text-sm font-semibold text-slate-900">
                            Get the app
                        </p>

                        <NuxtLink
                            to="/app"
                            class="inline-flex h-10 items-center gap-2 border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-900 transition-colors hover:border-slate-900 hover:bg-slate-900 hover:text-white"
                        >
                            <Smartphone class="h-4 w-4" />
                            Get the app
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
                            <component :is="social.icon" class="h-4 w-4" />
                        </a>
                    </div>
                </div>

                <!-- FOOTER COLUMNS -->
                <div
                    v-for="section in footerSections"
                    :key="section.id"
                    class="border-t border-slate-200 pt-5 md:border-0 md:pt-0"
                >
                    <!-- SECTION TITLE -->
                    <button
                        type="button"
                        class="flex w-full items-center justify-between text-left md:pointer-events-none"
                        @click="toggleSection(section.id)"
                    >
                        <span class="text-sm font-semibold text-slate-900">
                            {{ section.title }}
                        </span>

                        <ChevronDown
                            class="h-4 w-4 text-slate-400 transition-transform duration-200 md:hidden"
                            :class="
                                openSection === section.id ? 'rotate-180' : ''
                            "
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

                <!-- SOCIAL / APP -->
                <div class="border-t border-slate-200 pt-5 md:border-0 md:pt-0">
                    <p class="text-sm font-semibold text-slate-900">
                        Find us on social
                    </p>

                    <ul class="mt-5 space-y-3">
                        <li v-for="social in socialLinks" :key="social.label">
                            <a
                                :href="social.href"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="inline-flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-primary"
                            >
                                <component :is="social.icon" class="h-4 w-4" />

                                {{ social.label }}
                            </a>
                        </li>
                    </ul>

                    <!-- MOBILE APP -->
                    <div class="mt-7">
                        <p class="text-sm font-semibold text-slate-900">
                            Mobile app
                        </p>

                        <NuxtLink
                            to="/app"
                            class="mt-3 inline-flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-primary"
                        >
                            <Apple class="h-4 w-4" />
                            Download DailyBookings
                        </NuxtLink>
                    </div>
                </div>
            </div>

            <!-- DIVIDER -->
            <div class="mt-14 border-t border-slate-200 lg:mt-20" />

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
                        to="/terms"
                        class="transition-colors hover:text-slate-700"
                    >
                        Terms
                    </NuxtLink>

                    <NuxtLink
                        to="/privacy"
                        class="transition-colors hover:text-slate-700"
                    >
                        Privacy
                    </NuxtLink>

                    <NuxtLink
                        to="/help"
                        class="transition-colors hover:text-slate-700"
                    >
                        Help
                    </NuxtLink>
                </div>
            </div>
        </div>
    </footer>
</template>
