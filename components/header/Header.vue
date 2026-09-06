<script setup lang="ts">
import {
    ArrowLeft,
    ArrowRight,
    BriefcaseBusiness,
    CalendarDays,
    ChevronRight,
    CircleEllipsis,
    GraduationCap,
    HeartPulse,
    House,
    LayoutDashboard,
    LogOut,
    Menu,
    Search,
    X,
} from "lucide-vue-next";
import { onBeforeUnmount, onMounted, ref } from "vue";

const user = useSupabaseUser();
const client = useSupabaseClient();

const isScrolled = ref(false);
const menuOpen = ref(false);
const exploreOpen = ref(false);
const activeCategory = ref<string | null>(null);

const exploreCategories = [
    {
        name: "Business",
        description: "Professional services for businesses and teams.",
        icon: BriefcaseBusiness,
        services: [
            "Business Consulting",
            "Marketing Services",
            "Web Design",
            "Graphic Design",
            "Accounting",
            "Virtual Assistants",
        ],
    },
    {
        name: "Events & Entertainers",
        description: "Find professionals to make your event memorable.",
        icon: CalendarDays,
        services: [
            "Photographers",
            "DJs",
            "Catering",
            "Event Planners",
            "Magicians",
            "Musicians",
        ],
    },
    {
        name: "Health & Wellness",
        description: "Look after your body, mind and wellbeing.",
        icon: HeartPulse,
        services: [
            "Personal Trainers",
            "Massage",
            "Life Coaching",
            "Nutritionists",
            "Yoga",
            "Therapists",
        ],
    },
    {
        name: "House & Home",
        description: "Trusted professionals for your home.",
        icon: House,
        services: [
            "House Cleaning",
            "Garden Services",
            "Plumbers",
            "Electricians",
            "Handymen",
            "Moving Services",
        ],
    },
    {
        name: "Lessons & Training",
        description: "Learn something new or improve your skills.",
        icon: GraduationCap,
        services: [
            "Tutors",
            "Driving Lessons",
            "Music Lessons",
            "Language Lessons",
            "Fitness Training",
            "Career Coaching",
        ],
    },
    {
        name: "More",
        description: "Discover more services on DailyBookings.",
        icon: CircleEllipsis,
        services: [
            "Beauty",
            "Photography",
            "Pet Services",
            "Technology",
            "Creative Services",
            "Other Services",
        ],
    },
];

const popularServices = [
    "Dog & Pet Grooming",
    "Dog Training",
    "Dog Walking",
    "Life Coaching",
    "Limousine Hire",
    "Magician",
    "Private Investigators",
];

const handleScroll = () => {
    isScrolled.value = window.scrollY > 20;
};

onMounted(() => {
    handleScroll();

    window.addEventListener("scroll", handleScroll, {
        passive: true,
    });

    window.addEventListener("keydown", handleKeydown);
});

onBeforeUnmount(() => {
    window.removeEventListener("scroll", handleScroll);
    window.removeEventListener("keydown", handleKeydown);
});

const closeMenu = () => {
    menuOpen.value = false;
    exploreOpen.value = false;
    activeCategory.value = null;
};

const toggleMenu = () => {
    menuOpen.value = !menuOpen.value;

    if (!menuOpen.value) {
        exploreOpen.value = false;
        activeCategory.value = null;
    }
};

const openExplore = () => {
    exploreOpen.value = true;
    activeCategory.value = null;
};

const closeExplore = () => {
    exploreOpen.value = false;
    activeCategory.value = null;
};

const selectCategory = (category: string) => {
    activeCategory.value = category;
};

const getActiveCategory = () => {
    return exploreCategories.find(
        (category) => category.name === activeCategory.value,
    );
};

const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
        if (activeCategory.value) {
            activeCategory.value = null;
        } else if (exploreOpen.value) {
            exploreOpen.value = false;
        } else if (menuOpen.value) {
            closeMenu();
        }
    }
};

const handleLogout = async () => {
    closeMenu();
    await client.auth.signOut();

    navigateTo("/auth/login");
};
</script>

<template>
    <header
        class="fixed inset-x-0 top-0 z-[100] w-full transition-all duration-300"
        :class="
            isScrolled || menuOpen
                ? 'border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-md'
                : 'border-b border-transparent bg-transparent'
        "
    >
        <nav
            class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
        >
            <NuxtLink
                to="/"
                class="relative z-10 flex shrink-0 items-center"
                @click="closeMenu"
            >
                <img
                    :src="
                        isScrolled || menuOpen
                            ? '/logo.png'
                            : '/logo-inverse.png'
                    "
                    alt="DailyBookings"
                    class="object-cover hidden h-10 w-auto md:block rounded-md"
                />

                <img
                    :src="
                        isScrolled || menuOpen
                            ? '/mobile-logo.png'
                            : '/mobile-logo-inverse.png'
                    "
                    alt="DailyBookings"
                    class="block h-8 w-auto md:hidden rounded-md"
                />
            </NuxtLink>

            <!-- RIGHT SIDE -->
            <div class="flex items-center gap-1 sm:gap-2">
                <!-- FIND BUSINESS -->
                <Transition
                    enter-active-class="transition duration-200 ease-out"
                    enter-from-class="opacity-0 -translate-y-1"
                    enter-to-class="opacity-100 translate-y-0"
                    leave-active-class="transition duration-150 ease-in"
                    leave-from-class="opacity-100 translate-y-0"
                    leave-to-class="opacity-0 -translate-y-1"
                >
                    <NuxtLink
                        v-if="isScrolled"
                        to="/services"
                        class="hidden h-10 items-center gap-2 px-3 text-sm font-semibold text-slate-700 transition-colors hover:text-primary sm:inline-flex"
                    >
                        <Search class="h-4 w-4" />
                        Find Business
                    </NuxtLink>
                </Transition>

                <!-- FOR BUSINESS -->
                <NuxtLink
                    to="/providers"
                    class="hidden h-10 items-center px-3 text-sm font-semibold transition-colors md:inline-flex"
                    :class="
                        isScrolled
                            ? 'text-slate-700 hover:text-primary'
                            : 'border-white/60 text-white hover:bg-white/10'
                    "
                >
                    For Business
                </NuxtLink>

                <!-- SIGN IN / SIGN UP -->
                <NuxtLink
                    v-if="!user"
                    to="/auth/login"
                    class="hidden h-10 items-center border-b px-4 text-sm font-semibold transition-all sm:inline-flex"
                    :class="
                        isScrolled
                            ? 'border-slate-300 text-slate-900 hover:bg-slate-100'
                            : 'border-white/60 text-white hover:bg-white/10'
                    "
                >
                    Sign In / Sign Up
                </NuxtLink>

                <!-- AUTHENTICATED USER -->
                <NuxtLink
                    v-else
                    to="/dashboard"
                    class="hidden h-10 items-center gap-2 px-3 text-sm font-semibold transition-colors sm:inline-flex"
                    :class="
                        isScrolled
                            ? 'text-slate-700 hover:text-primary'
                            : 'text-white hover:text-white/80'
                    "
                >
                    <LayoutDashboard class="h-4 w-4" />
                    Dashboard
                </NuxtLink>

                <!-- MENU -->
                <button
                    type="button"
                    class="inline-flex h-10 items-center gap-2 border px-4 text-sm font-semibold transition-all"
                    :class="
                        isScrolled || menuOpen
                            ? 'border-slate-300 text-slate-900 hover:bg-slate-100'
                            : 'border-white/60 text-white hover:bg-white/10'
                    "
                    aria-label="Toggle menu"
                    aria-haspopup="true"
                    :aria-expanded="menuOpen"
                    @click="toggleMenu"
                >
                    <span class="hidden sm:inline">
                        {{ menuOpen ? "Close" : "Menu" }}
                    </span>

                    <X v-if="menuOpen" class="h-4 w-4" />

                    <Menu v-else class="h-4 w-4" />
                </button>
            </div>
        </nav>

        <!-- MENU PANEL -->
        <Transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="opacity-0 -translate-y-2"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-2"
        >
            <div
                v-if="menuOpen"
                class="border-t border-slate-200 bg-white shadow-lg"
            >
                <div class="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
                    <template v-if="!exploreOpen">
                        <div class="grid gap-6 md:grid-cols-[1fr_280px]">
                            <!-- LEFT -->
                            <div>
                                <div class="mb-3 px-3">
                                    <p
                                        class="text-xs font-semibold uppercase tracking-wider text-slate-400"
                                    >
                                        Explore
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    class="group flex w-full items-center justify-between px-3 py-3 text-left transition-colors hover:bg-slate-100"
                                    @click="openExplore"
                                >
                                    <div class="flex items-center gap-3">
                                        <div
                                            class="flex h-9 w-9 items-center justify-center bg-slate-100 text-slate-700 transition-colors group-hover:bg-primary/10 group-hover:text-primary"
                                        >
                                            <Search class="h-4 w-4" />
                                        </div>

                                        <div>
                                            <p
                                                class="text-sm font-semibold text-slate-900"
                                            >
                                                Explore services
                                            </p>

                                            <p
                                                class="mt-0.5 text-xs text-slate-500"
                                            >
                                                Find professionals by category
                                            </p>
                                        </div>
                                    </div>

                                    <ChevronRight
                                        class="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-0.5"
                                    />
                                </button>

                                <!-- POPULAR SERVICES -->
                                <div class="mt-5">
                                    <div class="mb-2 px-3">
                                        <p
                                            class="text-xs font-semibold uppercase tracking-wider text-slate-400"
                                        >
                                            Popular services
                                        </p>
                                    </div>

                                    <div
                                        class="grid grid-cols-1 sm:grid-cols-2"
                                    >
                                        <NuxtLink
                                            v-for="service in popularServices"
                                            :key="service"
                                            :to="`/services?search=${encodeURIComponent(service)}`"
                                            class="flex items-center justify-between px-3 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-100 hover:text-primary"
                                            @click="closeMenu"
                                        >
                                            <span>{{ service }}</span>

                                            <ArrowRight
                                                class="h-3.5 w-3.5 text-slate-300"
                                            />
                                        </NuxtLink>
                                    </div>
                                </div>
                            </div>

                            <!-- RIGHT -->
                            <div
                                class="border-t border-slate-200 pt-4 md:border-l md:border-t-0 md:pl-5 md:pt-0"
                            >
                                <p
                                    class="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400"
                                >
                                    Account
                                </p>

                                <!-- AUTHENTICATED -->
                                <template v-if="user">
                                    <NuxtLink
                                        to="/dashboard"
                                        class="flex items-center gap-3 px-3 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
                                        @click="closeMenu"
                                    >
                                        <LayoutDashboard class="h-4 w-4" />
                                        Dashboard
                                    </NuxtLink>

                                    <button
                                        type="button"
                                        class="flex w-full items-center gap-3 px-3 py-3 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
                                        @click="handleLogout"
                                    >
                                        <LogOut class="h-4 w-4" />
                                        Sign Out
                                    </button>
                                </template>

                                <!-- GUEST -->
                                <NuxtLink
                                    v-else
                                    to="/auth/login"
                                    class="flex items-center justify-center bg-primary px-3 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
                                    @click="closeMenu"
                                >
                                    Sign In / Sign Up
                                </NuxtLink>

                                <div
                                    class="mt-4 border-t border-slate-200 pt-4"
                                >
                                    <NuxtLink
                                        to="/help"
                                        class="flex items-center px-3 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
                                        @click="closeMenu"
                                    >
                                        Help & Support
                                    </NuxtLink>

                                    <NuxtLink
                                        to="/providers"
                                        class="flex items-center justify-between px-3 py-3 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-100"
                                        @click="closeMenu"
                                    >
                                        For businesses

                                        <ArrowRight class="h-4 w-4" />
                                    </NuxtLink>
                                </div>
                            </div>
                        </div>
                    </template>

                    <!-- ================================================= -->
                    <!-- EXPLORE CATEGORIES -->
                    <!-- ================================================= -->

                    <template v-else>
                        <!-- BACK -->
                        <button
                            type="button"
                            class="mb-4 inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold text-slate-600 transition-colors hover:text-slate-900"
                            @click="closeExplore"
                        >
                            <ArrowLeft class="h-4 w-4" />
                            Explore
                        </button>

                        <!-- CATEGORY DETAIL -->
                        <template v-if="activeCategory">
                            <div
                                v-if="getActiveCategory()"
                                class="grid gap-6 md:grid-cols-[280px_1fr]"
                            >
                                <!-- CATEGORY INTRO -->
                                <div
                                    class="border-b border-slate-200 pb-5 md:border-b-0 md:border-r md:pb-0 md:pr-6"
                                >
                                    <div
                                        class="flex h-11 w-11 items-center justify-center bg-slate-100 text-slate-700"
                                    >
                                        <component
                                            :is="getActiveCategory()?.icon"
                                            class="h-5 w-5"
                                        />
                                    </div>

                                    <h3
                                        class="mt-4 text-lg font-semibold text-slate-900"
                                    >
                                        {{ getActiveCategory()?.name }}
                                    </h3>

                                    <p
                                        class="mt-2 text-sm leading-6 text-slate-500"
                                    >
                                        {{ getActiveCategory()?.description }}
                                    </p>
                                </div>

                                <!-- SERVICES -->
                                <div>
                                    <p
                                        class="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400"
                                    >
                                        Services
                                    </p>

                                    <div class="grid sm:grid-cols-2">
                                        <NuxtLink
                                            v-for="service in getActiveCategory()
                                                ?.services"
                                            :key="service"
                                            :to="`/services?search=${encodeURIComponent(service)}`"
                                            class="flex items-center justify-between px-3 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-primary"
                                            @click="closeMenu"
                                        >
                                            {{ service }}

                                            <ChevronRight
                                                class="h-4 w-4 text-slate-300"
                                            />
                                        </NuxtLink>
                                    </div>
                                </div>
                            </div>
                        </template>

                        <!-- CATEGORY GRID -->
                        <template v-else>
                            <div
                                class="grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-3"
                            >
                                <button
                                    v-for="category in exploreCategories"
                                    :key="category.name"
                                    type="button"
                                    class="group flex items-center gap-3 px-3 py-4 text-left transition-colors hover:bg-slate-100"
                                    @click="selectCategory(category.name)"
                                >
                                    <div
                                        class="flex h-10 w-10 shrink-0 items-center justify-center bg-slate-100 text-slate-600 transition-colors group-hover:bg-primary/10 group-hover:text-primary"
                                    >
                                        <component
                                            :is="category.icon"
                                            class="h-5 w-5"
                                        />
                                    </div>

                                    <div class="min-w-0 flex-1">
                                        <p
                                            class="text-sm font-semibold text-slate-900"
                                        >
                                            {{ category.name }}
                                        </p>

                                        <p
                                            class="mt-0.5 truncate text-xs text-slate-500"
                                        >
                                            {{ category.description }}
                                        </p>
                                    </div>

                                    <ChevronRight
                                        class="h-4 w-4 shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5"
                                    />
                                </button>
                            </div>
                        </template>
                    </template>
                </div>
            </div>
        </Transition>
    </header>
</template>
