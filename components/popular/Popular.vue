<script setup lang="ts">
import { ArrowUpRight } from "lucide-vue-next";
import { CATEGORIES, NAVIGATION_PATHS } from "~/utils/constants";

const fallbackImage =
    "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=85";
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
                class="mt-10 grid grid-cols-2 gap-px overflow-hidden border border-slate-200 bg-slate-200 sm:grid-cols-3 lg:grid-cols-4"
            >
                <NuxtLink
                    v-for="category in CATEGORIES"
                    :key="category.slug"
                    :to="NAVIGATION_PATHS.CATEGORY(category.slug)"
                    class="group relative aspect-[4/5] overflow-hidden bg-slate-100"
                >
                    <img
                        :src="category.image || fallbackImage"
                        :alt="category.name"
                        loading="lazy"
                        class="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />

                    <div
                        class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/5 transition-colors duration-300 group-hover:from-black/90"
                    />

                    <div
                        class="absolute left-4 top-4 flex h-9 w-9 items-center justify-center border border-white/25 bg-black/20 text-white backdrop-blur-sm"
                    >
                        <component
                            :is="category.icon"
                            class="h-4 w-4"
                            stroke-width="1.8"
                        />
                    </div>

                    <div
                        class="absolute right-4 top-4 flex h-9 w-9 translate-y-1 items-center justify-center border border-white/25 bg-white/0 text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:bg-white group-hover:text-slate-950 group-hover:opacity-100"
                    >
                        <ArrowUpRight class="h-4 w-4" stroke-width="1.8" />
                    </div>

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
