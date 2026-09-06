<script setup lang="ts">
import { MapPin, Search } from "lucide-vue-next";
import { onBeforeUnmount, onMounted, ref } from "vue";
import { NAVIGATION_PATHS } from "~/utils/constants";

const { data: discovery } = await useDiscovery();

const heroVideo = ref("/videos/hero.mp4");
const searchQuery = ref("");
const locationQuery = ref("");

let mediaQuery: MediaQueryList | null = null;

function updateHeroVideo() {
    if (!mediaQuery) return;

    heroVideo.value = mediaQuery.matches
        ? "/videos/mobile-hero.mp4"
        : "/videos/hero.mp4";
}

function handleSearch() {
    const search = searchQuery.value.trim();
    const location = locationQuery.value.trim();

    if (!search && !location) return;

    navigateTo({
        path: NAVIGATION_PATHS.SEARCH,
        query: {
            ...(search ? { search } : {}),
            ...(location ? { location } : {}),
        },
    });
}

function selectPopularService(service: string) {
    searchQuery.value = service;
}

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
        <video
            :key="heroVideo"
            :src="heroVideo"
            autoplay
            muted
            loop
            playsinline
            preload="metadata"
            aria-hidden="true"
            class="absolute inset-0 z-0 h-full w-full object-cover"
        />
        <div
            class="absolute inset-0 z-[1] bg-gradient-to-b from-black/45 via-black/75 to-black/95"
            aria-hidden="true"
        />
        <div
            class="relative z-10 mx-auto flex min-h-[620px] max-w-7xl items-center px-4 sm:px-6 md:min-h-[700px] lg:px-8"
        >
            <div class="flex w-full flex-col items-center text-center">
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

                <form
                    class="mt-9 w-full max-w-4xl bg-white p-2 shadow-2xl md:mt-11"
                    @submit.prevent="handleSearch"
                >
                    <div
                        class="grid grid-cols-1 gap-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]"
                    >
                        <div
                            class="flex h-14 min-w-0 items-center px-4 transition-colors focus-within:bg-slate-50"
                        >
                            <Search
                                class="h-5 w-5 shrink-0 text-slate-400"
                                stroke-width="1.8"
                                aria-hidden="true"
                            />

                            <input
                                v-model="searchQuery"
                                type="search"
                                name="search"
                                autocomplete="off"
                                placeholder="What are you looking for?"
                                class="h-full min-w-0 w-full bg-transparent px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                            />
                        </div>

                        <div
                            class="flex h-14 min-w-0 items-center border-t border-slate-100 px-4 transition-colors focus-within:bg-slate-50 md:border-l md:border-t-0"
                        >
                            <MapPin
                                class="h-5 w-5 shrink-0 text-slate-400"
                                stroke-width="1.8"
                                aria-hidden="true"
                            />

                            <input
                                v-model="locationQuery"
                                type="text"
                                name="location"
                                autocomplete="off"
                                placeholder="Where?"
                                class="h-full min-w-0 w-full bg-transparent px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                            />
                        </div>

                        <button
                            type="submit"
                            class="h-14 bg-primary px-8 text-sm font-semibold text-white transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-white"
                        >
                            Search
                        </button>
                    </div>
                </form>

                <div
                    class="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm"
                >
                    <span class="text-white/45"> Popular: </span>

                    <button
                        v-for="service in discovery?.trendingServices?.slice(0, 4)"
                        :key="service.id"
                        type="button"
                        class="text-white/75 transition-colors hover:text-white"
                        @click="selectPopularService(service.name)"
                    >
                        {{ service.name }}
                    </button>
                </div>
            </div>
        </div>
    </section>
</template>
