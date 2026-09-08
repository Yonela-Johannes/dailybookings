<script setup lang="ts">
import { ArrowUpRight } from "lucide-vue-next";
import { NAVIGATION_PATHS } from "~/utils/constants";

const { data: discovery, pending } = await useDiscovery();

const popularCategories = computed(() =>
  (discovery.value?.popularCategories || [])
    .filter(category => category?.status?.toLowerCase() === 'active')
    .slice(0, 4)
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
                        class="text-3xl font-semibold tracking-[-0.03em] text-slate-950 sm:text-4xl"
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
                    class="group inline-flex h-10 w-fit shrink-0 items-center gap-2 border border-slate-200 px-4 text-sm font-medium text-slate-900 transition-all duration-200 hover:border-slate-950 hover:bg-slate-950 hover:text-white"
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
                class="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
            >
                <div
                    v-for="i in 4"
                    :key="i"
                    class="aspect-[4/5] animate-pulse rounded-lg bg-slate-100"
                />
            </div>

            <div
                v-else-if="popularCategories.length"
                class="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
            >
                <NuxtLink
                    v-for="category in popularCategories"
                    :key="category.slug"
                    :to="NAVIGATION_PATHS.CATEGORY(category.slug)"
                    class="group relative aspect-[4/5] overflow-hidden rounded-lg bg-slate-100"
                >
                    <img
                        :src="category.imageUrl"
                        :alt="category.name"
                        loading="lazy"
                        class="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                    />

                    <div
                        class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100"
                    />

                    <div class="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                        <div
                            class="mb-3 text-[9px] font-semibold uppercase tracking-[0.16em] text-white/65"
                        >
                            {{ category._count?.venues || 0 }} venues
                        </div>

                        <h3
                            class="text-lg font-semibold tracking-[-0.02em] text-white sm:text-xl"
                        >
                            {{ category.name }}
                        </h3>

                        <p
                            v-if="category.description"
                            class="mt-1.5 line-clamp-2 text-xs leading-5 text-white/70 sm:text-sm"
                        >
                            {{ category.description }}
                        </p>

                        <div
                            class="mt-4 flex h-8 w-8 items-center justify-center border border-white/30 bg-white/10 text-white backdrop-blur-sm transition-all duration-300 group-hover:border-white group-hover:bg-white group-hover:text-slate-950"
                        >
                            <ArrowUpRight
                                class="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                stroke-width="1.8"
                            />
                        </div>
                    </div>
                </NuxtLink>
            </div>

            <div
                v-else
                class="mt-10 border border-slate-200 px-6 py-12 text-center"
            >
                <p class="text-sm font-medium text-slate-900">
                    No categories available yet.
                </p>

                <p class="mt-1 text-sm text-slate-500">
                    Check back soon for more local services.
                </p>
            </div>
        </div>
    </section>
</template>
