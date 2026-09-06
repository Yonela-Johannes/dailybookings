<script setup lang="ts">
import { ArrowUpRight, Heart, Star } from "lucide-vue-next";

interface FeaturedProvider {
    id: string | number;
    slug: string;
    name: string;
    image: string;
    alt: string;
    rating: number;
    location: string;
    category: string;
    reviews: number;
    description?: string;
    verified?: boolean;
}

const props = defineProps<{
    providers: FeaturedProvider[];
}>();

const emit = defineEmits<{
    favorite: [id: string | number];
}>();
</script>

<template>
    <section class="border-t border-slate-200  text-black">
        <div
            class="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20 lg:px-8 lg:py-24"
        >
            <div
                class="flex flex-col justify-between gap-6 md:flex-row md:items-end"
            >
                <div class="max-w-2xl">
                    <p
                        class="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-primary"
                    >
                        DailyBookings
                    </p>

                    <h2
                        class="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
                    >
                        Featured
                    </h2>

                    <p
                        class="mt-4 max-w-xl text-sm leading-6 text-gray-600 sm:text-base"
                    >
                        Exceptional local businesses, selected to help you
                        discover your next great booking.
                    </p>
                </div>

                <NuxtLink
                    to="/services?featured=true"
                    class="group inline-flex w-fit items-center gap-2 border border-white/20 px-5 py-3 text-sm font-semibold text-white transition-colors hover:border-primary hover:bg-primary"
                >
                    Explore all

                    <ArrowUpRight
                        class="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                </NuxtLink>
            </div>

            <div
                class="mt-10 grid gap-px bg-white/10 md:grid-cols-2 lg:grid-cols-3"
            >
                <article
                    v-for="provider in props.providers"
                    :key="provider.id"
                    class="group relative overflow-hidden bg-slate-950"
                >
                    <div class="relative aspect-[4/5] overflow-hidden">
                        <img
                            :src="provider.image"
                            :alt="provider.alt"
                            loading="lazy"
                            class="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                        />

                        <div
                            class="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"
                        />

                        <div
                            class="absolute left-5 top-5 z-10 bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-950"
                        >
                            Featured
                        </div>

                        <button
                            type="button"
                            :aria-label="`Add ${provider.name} to favorites`"
                            class="absolute right-5 top-5 z-20 flex h-10 w-10 items-center justify-center border border-white/30 bg-black/20 text-white backdrop-blur-sm transition-colors hover:border-white hover:bg-black/50"
                            @click.stop.prevent="emit('favorite', provider.id)"
                        >
                            <Heart class="h-4 w-4" />
                        </button>

                        <div
                            class="absolute inset-x-0 bottom-0 z-10 p-5 sm:p-6"
                        >
                            <p
                                class="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/55"
                            >
                                {{ provider.category }}
                            </p>

                            <h3
                                class="mt-2 max-w-[90%] text-xl font-bold tracking-tight text-white sm:text-2xl"
                            >
                                {{ provider.name }}

                                <svg
                                    v-if="provider.verified"
                                    class="ml-1 inline-block h-4 w-4 align-[-2px] text-primary"
                                    viewBox="0 0 32 32"
                                    fill="currentColor"
                                    aria-label="Verified provider"
                                >
                                    <path
                                        d="M28.233 12.853c-.472-.493-.96-1-1.143-1.447-.17-.409-.18-1.086-.19-1.742-.019-1.22-.039-2.603-1-3.564s-2.344-.981-3.564-1c-.656-.01-1.333-.02-1.742-.19-.445-.184-.954-.671-1.447-1.142C18.286 2.938 17.306 2 16 2s-2.284.939-3.148 1.768c-.492.47-1 .958-1.446 1.142-.406.17-1.086.18-1.742.19-1.22.019-2.603.039-3.564 1s-.975 2.344-1 3.564c-.01.656-.02 1.334-.19 1.742-.184.445-.671.954-1.142 1.446C2.938 13.715 2 14.696 2 16s.939 2.284 1.768 3.148c.47.492.958 1 1.142 1.446.17.409.18 1.086.19 1.742.019 1.22.039 2.603 1 3.564s2.344.981 3.564 1c.656.01 1.334.02 1.742.19.445.184.671.671 1.143 1.143C13.715 29.06 14.696 30 16 30s2.284-.939 3.148-1.767c.492-.472 1-.96 1.446-1.143.409-.17 1.086-.18 1.742-.19 1.22-.019 2.603-1.019 3.564-1s.981-2.344 1-3.564c.01-.656.02-1.333.19-1.742.184-.445.671-.954 1.143-1.447C29.06 18.286 30 17.306 30 16s-.939-2.284-1.767-3.147m-6.526.854-7 7a1 1 0 0 1-1.415 0l-3-3a1 1 0 0 1 1.415-1.415L14 18.587l6.293-6.293a1 1 0 0 1 1.415 1.415"
                                    />
                                </svg>
                            </h3>

                            <p class="mt-1 text-sm text-white/60">
                                {{ provider.location }}
                            </p>

                            <div class="mt-4 flex items-center gap-2">
                                <div class="flex items-center gap-1">
                                    <Star
                                        class="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                                    />

                                    <span
                                        class="text-xs font-semibold text-white"
                                    >
                                        {{ provider.rating.toFixed(1) }}
                                    </span>
                                </div>

                                <span class="text-white/25">·</span>

                                <span class="text-xs text-white/55">
                                    {{ provider.reviews.toLocaleString() }}
                                    reviews
                                </span>
                            </div>
                        </div>
                    </div>

                    <NuxtLink
                        :to="`/a/${provider.slug}`"
                        :aria-label="`View ${provider.name}`"
                        class="absolute inset-0 z-10"
                    />
                    <div class="pointer-events-none absolute inset-0 z-[5]" />
                </article>
            </div>
        </div>
    </section>
</template>
