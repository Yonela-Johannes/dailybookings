<script setup lang="ts">
import {
    ArrowUpRight,
    BriefcaseBusiness,
    Camera,
    Car,
    Dumbbell,
    GraduationCap,
    HandHeart,
    House,
    Scissors,
    Sparkles,
} from "lucide-vue-next";

interface Category {
    name: string;
    description: string;
    image: string;
    to: string;
    icon: unknown;
}

const categories: Category[] = [
    {
        name: "Beauty",
        description: "Hair, nails, skincare & more",
        image: "/images/categories/beauty.jpg",
        to: "/categories/beauty",
        icon: Sparkles,
    },
    {
        name: "Hair",
        description: "Salons, barbers & stylists",
        image: "/images/categories/hair.jpg",
        to: "/categories/hair",
        icon: Scissors,
    },
    {
        name: "Wellness",
        description: "Massage, spa & wellbeing",
        image: "/images/categories/wellness.jpg",
        to: "/categories/wellness",
        icon: HandHeart,
    },
    {
        name: "Fitness",
        description: "Trainers, gyms & classes",
        image: "/images/categories/fitness.jpg",
        to: "/categories/fitness",
        icon: Dumbbell,
    },
    {
        name: "Photography",
        description: "Photographers & studios",
        image: "/images/categories/photography.jpg",
        to: "/categories/photography",
        icon: Camera,
    },
    {
        name: "Tutors",
        description: "Learn from local experts",
        image: "/images/categories/tutors.jpg",
        to: "/categories/tutors",
        icon: GraduationCap,
    },
    {
        name: "Home Services",
        description: "Trusted help for your home",
        image: "/images/categories/home-services.jpg",
        to: "/categories/home-services",
        icon: House,
    },
    {
        name: "Business",
        description: "Professional services",
        image: "/images/categories/business.jpg",
        to: "/categories/business",
        icon: BriefcaseBusiness,
    },
    {
        name: "Transport",
        description: "Drivers, cars & transfers",
        image: "/images/categories/transport.jpg",
        to: "/categories/transport",
        icon: Car,
    },
];

const fallbackImage =
    "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=85";
</script>

<template>
    <section class="border-t border-slate-200 bg-white">
        <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <!-- Header -->
            <div
                class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
            >
                <div class="max-w-2xl">
                    <p
                        class="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-primary"
                    >
                        Explore
                    </p>

                    <h2
                        class="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl"
                    >
                        Popular categories
                    </h2>

                    <p
                        class="mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-base"
                    >
                        Find trusted professionals for the things you do, need
                        and love.
                    </p>
                </div>

                <NuxtLink
                    to="/categories"
                    class="group inline-flex h-10 w-fit shrink-0 items-center gap-2 border border-slate-200 px-4 text-sm font-semibold text-slate-900 transition-colors hover:border-slate-900 hover:bg-slate-950 hover:text-white"
                >
                    View all categories

                    <ArrowUpRight
                        class="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                </NuxtLink>
            </div>

            <!-- Categories -->
            <div
                class="mt-10 grid grid-cols-2 gap-px overflow-hidden bg-slate-200 border border-slate-200 sm:grid-cols-3 lg:grid-cols-5"
            >
                <NuxtLink
                    v-for="category in categories"
                    :key="category.name"
                    :to="category.to"
                    class="group relative aspect-[4/5] overflow-hidden bg-slate-100"
                >
                    <!-- Image -->
                    <img
                        :src="category.image || fallbackImage"
                        :alt="category.name"
                        loading="lazy"
                        class="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />

                    <!-- Overlay -->
                    <div
                        class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/5 transition-colors duration-300 group-hover:from-black/85"
                    />

                    <!-- Icon -->
                    <div
                        class="absolute left-4 top-4 flex h-9 w-9 items-center justify-center border border-white/25 bg-black/20 text-white backdrop-blur-sm"
                    >
                        <component :is="category.icon" class="h-4 w-4" />
                    </div>

                    <!-- Arrow -->
                    <div
                        class="absolute right-4 top-4 flex h-9 w-9 translate-y-1 items-center justify-center border border-white/25 bg-white/0 text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:bg-white group-hover:text-slate-950 group-hover:opacity-100"
                    >
                        <ArrowUpRight class="h-4 w-4" />
                    </div>

                    <!-- Content -->
                    <div class="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                        <h3
                            class="text-lg font-semibold tracking-tight text-white"
                        >
                            {{ category.name }}
                        </h3>

                        <p
                            class="mt-1 text-xs leading-5 text-white/70 sm:text-sm"
                        >
                            {{ category.description }}
                        </p>
                    </div>
                </NuxtLink>
            </div>
        </div>
    </section>
</template>
