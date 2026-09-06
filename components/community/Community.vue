<script setup lang="ts">
import { ArrowUpRight, Play } from "lucide-vue-next";

interface GalleryItem {
    id: number;
    type: "image" | "video";
    image: string;
    video?: string;
    title?: string;
    category?: string;
    description?: string;
    featured?: boolean;
    to?: string;
}

const items: GalleryItem[] = [
    {
        id: 1,
        type: "video",
        image: "/images/community/beauty-community.jpg",
        video: "/videos/makeup-2.mp4",
        category: "Beauty",
        title: "Made for the people who make us feel good.",
        featured: true,
    },
    {
        id: 2,
        type: "image",
        image: "/images/barber.jpg",
        category: "Barbers",
        title: "Local talent. Serious craft.",
    },
    {
        id: 3,
        type: "video",
        image: "/images/barber-video.jpg",
        video: "/videos/barber.mp4",
        category: "Community",
        title: "The people behind the booking.",
    },
    {
        id: 4,
        type: "image",
        image: "/images/photographer.jpg",
        category: "Photography",
        title: "Moments worth remembering.",
    },
    {
        id: 5,
        type: "video",
        image: "/images/community/photography-video.jpg",
        video: "/videos/photography.mp4",
        category: "Photography",
        title: "Turn your next moment into a memory.",
    },
];

const visibleItems = items.slice(0, 7);
</script>

<template>
    <section class="border-t border-slate-200 bg-white">
        <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <!-- Header -->
            <div class="mx-auto max-w-2xl text-center">
                <p
                    class="text-[10px] font-bold uppercase tracking-[0.2em] text-primary"
                >
                    Our community
                </p>

                <h2
                    class="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-[42px]"
                >
                    The people that make DailyBookings.
                </h2>

                <p
                    class="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-500 sm:text-base"
                >
                    Discover the businesses, professionals and people behind the
                    services you love.
                </p>
            </div>

            <!-- Gallery -->
            <div class="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                <!-- Large feature -->
                <NuxtLink
                    v-if="visibleItems[0]"
                    :to="visibleItems[0].to || '#'"
                    class="group relative col-span-2 row-span-2 min-h-[420px] overflow-hidden rounded-2xl bg-slate-100 sm:min-h-[560px]"
                >
                    <video
                        v-if="
                            visibleItems[0].type === 'video' &&
                            visibleItems[0].video
                        "
                        :src="visibleItems[0].video"
                        :poster="visibleItems[0].image"
                        autoplay
                        muted
                        loop
                        playsinline
                        class="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                    />

                    <img
                        v-else
                        :src="visibleItems[0].image"
                        :alt="visibleItems[0].title || ''"
                        loading="lazy"
                        class="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                    />

                    <div
                        class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
                    />

                    <!-- Play -->
                    <div
                        v-if="visibleItems[0].type === 'video'"
                        class="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-black/20 text-white backdrop-blur-sm"
                    >
                        <Play class="ml-0.5 h-4 w-4 fill-current" />
                    </div>

                    <div class="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                        <span
                            class="text-[10px] font-bold uppercase tracking-[0.16em] text-white/70"
                        >
                            {{ visibleItems[0].category }}
                        </span>

                        <h3
                            class="mt-2 max-w-xl text-2xl font-bold tracking-tight text-white sm:text-3xl"
                        >
                            {{ visibleItems[0].title }}
                        </h3>

                        <div
                            class="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white"
                        >
                            Discover more

                            <ArrowUpRight
                                class="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            />
                        </div>
                    </div>
                </NuxtLink>

                <!-- Item 2 -->
                <NuxtLink
                    v-if="visibleItems[1]"
                    :to="visibleItems[1].to || '#'"
                    class="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-slate-100"
                >
                    <img
                        :src="visibleItems[1].image"
                        :alt="visibleItems[1].title || ''"
                        loading="lazy"
                        class="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />

                    <div
                        class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"
                    />

                    <div class="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                        <span
                            class="text-[9px] font-bold uppercase tracking-[0.15em] text-white/70"
                        >
                            {{ visibleItems[1].category }}
                        </span>

                        <h3
                            class="mt-1.5 text-base font-semibold leading-5 text-white"
                        >
                            {{ visibleItems[1].title }}
                        </h3>
                    </div>
                </NuxtLink>

                <!-- Item 3 -->
                <div
                    v-if="visibleItems[2]"
                    class="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-slate-100"
                >
                    <video
                        v-if="visibleItems[2].video"
                        :src="visibleItems[2].video"
                        :poster="visibleItems[2].image"
                        autoplay
                        muted
                        loop
                        playsinline
                        class="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />

                    <img
                        v-else
                        :src="visibleItems[2].image"
                        :alt="visibleItems[2].title || ''"
                        loading="lazy"
                        class="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />

                    <div
                        class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"
                    />

                    <div
                        class="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-black/20 text-white backdrop-blur-sm"
                    >
                        <Play class="h-3.5 w-3.5 fill-current" />
                    </div>

                    <div class="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                        <span
                            class="text-[9px] font-bold uppercase tracking-[0.15em] text-white/70"
                        >
                            {{ visibleItems[2].category }}
                        </span>

                        <h3
                            class="mt-1.5 text-base font-semibold leading-5 text-white"
                        >
                            {{ visibleItems[2].title }}
                        </h3>
                    </div>
                </div>

                <!-- Item 4 -->
                <NuxtLink
                    v-if="visibleItems[3]"
                    :to="visibleItems[3].to || '#'"
                    class="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-slate-100"
                >
                    <img
                        :src="visibleItems[3].image"
                        :alt="visibleItems[3].title || ''"
                        loading="lazy"
                        class="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />

                    <div
                        class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"
                    />

                    <div class="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                        <span
                            class="text-[9px] font-bold uppercase tracking-[0.15em] text-white/70"
                        >
                            {{ visibleItems[3].category }}
                        </span>

                        <h3
                            class="mt-1.5 text-base font-semibold leading-5 text-white"
                        >
                            {{ visibleItems[3].title }}
                        </h3>
                    </div>
                </NuxtLink>

                <!-- Item 5 -->
                <div
                    v-if="visibleItems[4]"
                    class="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-slate-100"
                >
                    <video
                        v-if="visibleItems[4].video"
                        :src="visibleItems[4].video"
                        :poster="visibleItems[4].image"
                        autoplay
                        muted
                        loop
                        playsinline
                        class="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />

                    <div
                        class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"
                    />

                    <div
                        class="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-black/20 text-white backdrop-blur-sm"
                    >
                        <Play class="h-3.5 w-3.5 fill-current" />
                    </div>

                    <div class="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                        <span
                            class="text-[9px] font-bold uppercase tracking-[0.15em] text-white/70"
                        >
                            {{ visibleItems[4].category }}
                        </span>

                        <h3
                            class="mt-1.5 text-base font-semibold leading-5 text-white"
                        >
                            {{ visibleItems[4].title }}
                        </h3>
                    </div>
                </div>

                <!-- Item 6 -->
                <NuxtLink
                    v-if="visibleItems[5]"
                    :to="visibleItems[5].to || '#'"
                    class="group relative col-span-2 aspect-[16/7] overflow-hidden rounded-2xl bg-slate-100"
                >
                    <img
                        :src="visibleItems[5].image"
                        :alt="visibleItems[5].title || ''"
                        loading="lazy"
                        class="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />

                    <div
                        class="absolute inset-0 bg-gradient-to-r from-black/65 via-black/10 to-transparent"
                    />

                    <div
                        class="absolute inset-y-0 left-0 flex items-center p-5 sm:p-7"
                    >
                        <div>
                            <span
                                class="text-[9px] font-bold uppercase tracking-[0.15em] text-white/70"
                            >
                                {{ visibleItems[5].category }}
                            </span>

                            <h3
                                class="mt-1.5 max-w-xs text-lg font-semibold text-white sm:text-xl"
                            >
                                {{ visibleItems[5].title }}
                            </h3>
                        </div>
                    </div>
                </NuxtLink>

                <!-- Item 7 -->
                <NuxtLink
                    v-if="visibleItems[6]"
                    :to="visibleItems[6].to || '#'"
                    class="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-slate-100"
                >
                    <img
                        :src="visibleItems[6].image"
                        :alt="visibleItems[6].title || ''"
                        loading="lazy"
                        class="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />

                    <div
                        class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"
                    />

                    <div class="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                        <span
                            class="text-[9px] font-bold uppercase tracking-[0.15em] text-white/70"
                        >
                            {{ visibleItems[6].category }}
                        </span>

                        <h3
                            class="mt-1.5 text-base font-semibold leading-5 text-white"
                        >
                            {{ visibleItems[6].title }}
                        </h3>
                    </div>
                </NuxtLink>
            </div>

            <!-- CTA -->
            <div class="mt-10 flex justify-center">
                <NuxtLink
                    to="/community"
                    class="group inline-flex h-11 items-center gap-2 border border-slate-300 px-6 text-sm font-semibold text-slate-950 transition-colors hover:border-slate-950 hover:bg-slate-950 hover:text-white"
                >
                    Explore our community

                    <ArrowUpRight
                        class="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                </NuxtLink>
            </div>
        </div>
    </section>
</template>
