<script setup lang="ts">
import { MapPin, Search } from "lucide-vue-next";
import { onBeforeUnmount, onMounted, ref } from "vue";

const heroVideo = ref("/videos/hero.mp4");
let mediaQuery: MediaQueryList | null = null;

const searchQuery = ref("");
const locationQuery = ref("");

const updateHeroVideo = () => {
    if (!mediaQuery) return;

    heroVideo.value = mediaQuery.matches
        ? "/videos/mobile-hero.mp4"
        : "/videos/hero.mp4";
};

const handleSearch = () => {
    const query = searchQuery.value.trim();
    const location = locationQuery.value.trim();

    if (!query && !location) return;

    // Connect to your search page/API here.
    //
    // Example:
    // navigateTo({
    //     path: "/search",
    //     query: {
    //         q: query || undefined,
    //         location: location || undefined,
    //     },
    // });
};

const categories = [
    {
        name: "Beauty",
        path: "/categories/beauty",
    },
    {
        name: "Wellness",
        path: "/categories/wellness",
    },
    {
        name: "Tutors",
        path: "/categories/tutors",
    },
    {
        name: "Photography",
        path: "/categories/photography",
    },
    {
        name: "Fitness",
        path: "/categories/fitness",
    },
    {
        name: "Events",
        path: "/categories/events",
    },
    {
        name: "Business",
        path: "/categories/business",
    },
    {
        name: "Home Services",
        path: "/categories/home-services",
    },
];

onMounted(() => {
    mediaQuery = window.matchMedia("(max-width: 767px)");

    updateHeroVideo();

    mediaQuery.addEventListener("change", updateHeroVideo);
});

onBeforeUnmount(() => {
    mediaQuery?.removeEventListener("change", updateHeroVideo);
});
</script>

<template>
    <section
        class="relative min-h-[620px] overflow-hidden bg-slate-950 text-white md:min-h-[700px]"
    >
        <!-- HERO VIDEO -->
        <video
            :key="heroVideo"
            :src="heroVideo"
            autoplay
            muted
            loop
            playsinline
            preload="auto"
            aria-hidden="true"
            class="absolute inset-0 z-0 h-full w-full object-cover"
        />

        <!-- OVERLAY -->
        <div
            class="absolute inset-0 z-[1] bg-gradient-to-b from-black/45 via-black/90 to-black/95"
        />

        <!-- HERO CONTENT -->
        <div
            class="relative z-10 mx-auto flex min-h-[620px] max-w-7xl items-center px-4 sm:px-6 md:min-h-[700px] lg:px-8"
        >
            <div class="flex w-full flex-col items-center text-center">
                <!-- TITLE -->
                <div class="max-w-3xl">
                    <h1
                        class="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
                    >
                        Only for greatness.
                    </h1>

                    <p
                        class="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg"
                    >
                        Discover trusted local professionals and book services
                        that fit your life.
                    </p>
                </div>

                <!-- SEARCH -->
                <form
                    class="mt-9 w-full max-w-4xl bg-white p-2 shadow-2xl md:mt-11"
                    @submit.prevent="handleSearch"
                >
                    <div
                        class="grid grid-cols-1 gap-1 md:grid-cols-[1fr_1fr_auto]"
                    >
                        <!-- SERVICE -->
                        <div
                            class="flex h-14 items-center px-4 transition-colors focus-within:bg-slate-50"
                        >
                            <Search class="h-5 w-5 shrink-0 text-slate-400" />

                            <input
                                v-model="searchQuery"
                                type="search"
                                autocomplete="off"
                                placeholder="What are you looking for?"
                                class="h-full w-full bg-transparent px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                            />
                        </div>

                        <!-- LOCATION -->
                        <div
                            class="flex h-14 items-center border-t border-slate-100 px-4 transition-colors focus-within:bg-slate-50 md:border-l md:border-t-0"
                        >
                            <MapPin class="h-5 w-5 shrink-0 text-slate-400" />

                            <input
                                v-model="locationQuery"
                                type="text"
                                autocomplete="off"
                                placeholder="Where?"
                                class="h-full w-full bg-transparent px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                            />
                        </div>

                        <!-- SEARCH BUTTON -->
                        <button
                            type="submit"
                            class="h-14 bg-primary px-8 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
                        >
                            Search
                        </button>
                    </div>
                </form>

                <!-- POPULAR -->
                <div
                    class="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm"
                >
                    <span class="text-white/45"> Popular: </span>

                    <button
                        type="button"
                        class="text-white/75 transition-colors hover:text-white"
                        @click="searchQuery = 'Hair salon'"
                    >
                        Hair salon
                    </button>

                    <button
                        type="button"
                        class="text-white/75 transition-colors hover:text-white"
                        @click="searchQuery = 'Barber'"
                    >
                        Barber
                    </button>

                    <button
                        type="button"
                        class="text-white/75 transition-colors hover:text-white"
                        @click="searchQuery = 'Massage'"
                    >
                        Massage
                    </button>

                    <button
                        type="button"
                        class="text-white/75 transition-colors hover:text-white"
                        @click="searchQuery = 'Tutor'"
                    >
                        Tutor
                    </button>
                </div>
            </div>
        </div>

        <!-- CATEGORY BAR -->
        <div
            class="absolute inset-x-0 bottom-0 z-20 border-t border-white/10 bg-black/20 backdrop-blur-md"
        >
            <div class="mx-auto text-center max-w-7xl px-4 sm:px-6 lg:px-8">
                <nav
                    class="flex items-center justify-center text-center mx-auto gap-1 overflow-x-auto py-3 scrollbar-hide"
                    aria-label="Service categories"
                >
                    <NuxtLink
                        v-for="category in categories"
                        :key="category.path"
                        :to="category.path"
                        class="shrink-0 whitespace-nowrap px-4 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                    >
                        {{ category.name }}
                    </NuxtLink>

                    <button
                        type="button"
                        class="shrink-0 whitespace-nowrap px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                    >
                        More
                    </button>
                </nav>
            </div>
        </div>
    </section>
</template>
