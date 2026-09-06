<script setup lang="ts">
import {
    ArrowUpRight,
    Sparkles,
    Scissors,
    HeartPulse,
    Dumbbell,
    Camera,
    GraduationCap,
    House,
    BriefcaseBusiness,
} from "lucide-vue-next";
import { NAVIGATION_PATHS } from "~/utils/constants";

const { data: discovery, pending } = await useDiscovery();

const ICON_MAP: Record<string, any> = {
    sparkles: Sparkles,
    scissors: Scissors,
    "heart-pulse": HeartPulse,
    dumbbell: Dumbbell,
    camera: Camera,
    "graduation-cap": GraduationCap,
    house: House,
    "briefcase-business": BriefcaseBusiness,
};

const fallbackImage =
    "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=85";

const popularCategories = computed(
    () => discovery.value?.popularCategories || [],
);
</script>

<template>
    <section class="border-t border-slate-200 bg-white">
        <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
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
                        Find trusted local professionals for the things you
                        need, do and love.
                    </p>
                </div>

                <NuxtLink
                    :to="NAVIGATION_PATHS.DISCOVER"
                    class="group inline-flex h-10 w-fit shrink-0 items-center gap-2 border border-slate-200 px-4 text-sm font-semibold text-slate-900 transition-colors hover:border-slate-950 hover:bg-slate-950 hover:text-white"
                >
                    View all categories

                    <ArrowUpRight
                        class="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        stroke-width="1.8"
                    />
                </NuxtLink>
            </div>

            <div
                v-if="pending"
                class="mt-10 grid grid-cols-2 gap-px overflow-hidden border border-slate-200 bg-slate-200 sm:grid-cols-3 lg:grid-cols-4"
            >
                <div
                    v-for="i in 8"
                    :key="i"
                    class="aspect-[4/5] animate-pulse bg-slate-100"
                />
            </div>

            <div class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <NuxtLink
                    v-for="category in popularCategories"
                    :key="category.slug"
                    :to="NAVIGATION_PATHS.CATEGORY(category.slug)"
                    class="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-xl"
                >
                    <div
                        class="absolute right-0 top-0 h-32 w-32 translate-x-10 -translate-y-10 rounded-full bg-primary/5 transition-transform duration-500 group-hover:scale-125"
                    />

                    <img
                        :src="category.imageUrl || fallbackImage"
                        :alt="category.name"
                        loading="lazy"
                        class="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                    <div class="relative mt-6">
                        <h3
                            class="text-xl font-semibold tracking-tight text-slate-950"
                        >
                            {{ category.name }}
                        </h3>

                        <p
                            v-if="category.description"
                            class="mt-2 line-clamp-2 text-sm leading-6 text-slate-500"
                        >
                            {{ category.description }}
                        </p>

                        <div class="mt-5 flex items-center justify-between">
                            <div class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                {{ category._count?.venues || 0 }} Venues
                            </div>
                            <div
                                class="flex h-9 w-9 items-center justify-center rounded-full text-slate-200 border border-slate-200 transition-all duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-white"
                            >
                                <ArrowUpRight class="h-4 w-4" />
                            </div>
                        </div>
                    </div>
                </NuxtLink>
            </div>
        </div>
    </section>
</template>
