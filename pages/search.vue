<script setup lang="ts">
import {
    Search,
    MapPin,
    Star,
    Bookmark,
    ChevronDown,
    LayoutGrid,
    List,
    ArrowUpRight,
    X,
} from "lucide-vue-next";
import { NAVIGATION_PATHS } from "~/utils/constants";

const route = useRoute();
const { toggleFavorite, isFavorite } = useFavorites();

const searchQuery = ref((route.query.search as string) || "");
const locationQuery = ref((route.query.location as string) || "");
const minRating = ref(
    route.query.rating ? parseFloat(route.query.rating as string) : 0,
);

const viewMode = ref<"grid" | "list">("grid");
const sortBy = ref("popular");
const showMapMobile = ref(false);

const {
    data: searchResultsRes,
    pending,
    refresh,
} = await useAsyncData(
    "search-results",
    () =>
        $fetch<any>("/api/search", {
            params: {
                q: searchQuery.value || undefined,
                category: route.query.category || undefined,
                loc: locationQuery.value || undefined,
                minRating: minRating.value || undefined,
            },
        }),
    {
        watch: [searchQuery, locationQuery, minRating],
    },
);

const searchResults = computed(() => searchResultsRes.value?.data || []);

const mapPoints = computed(() =>
    searchResults.value
        .map((venue: any) => ({
            id: venue.id,
            name: venue.name,
            latitude: venue.address?.lat || 0,
            longitude: venue.address?.lng || 0,
            slug: venue.slug,
            category: venue.category?.name,
        }))
        .filter((point: any) => point.latitude !== 0 && point.longitude !== 0),
);

watch(
    () => route.query,
    () => {
        searchQuery.value = (route.query.search as string) || "";
        locationQuery.value = (route.query.location as string) || "";
        minRating.value = route.query.rating
            ? parseFloat(route.query.rating as string)
            : 0;

        refresh();
    },
);

const handleSearch = () => {
    navigateTo({
        path: NAVIGATION_PATHS.SEARCH,
        query: {
            search: searchQuery.value || undefined,
            location: locationQuery.value || undefined,
            rating: minRating.value || undefined,
            category: route.query.category || undefined,
        },
    });
};

const handleRatingFilter = (rating: number) => {
    minRating.value = minRating.value === rating ? 0 : rating;
    handleSearch();
};

const handleFavorite = async (venueId: string) => {
    await toggleFavorite(venueId);
};
</script>

<template>
    <main class="min-h-screen bg-white pt-16">
        <!-- Search -->
        <section
            class="sticky top-16 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-sm"
        >
            <div class="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                <form
                    class="flex flex-col border border-slate-200 bg-white sm:flex-row"
                    @submit.prevent="handleSearch"
                >
                    <div
                        class="flex min-w-0 flex-1 items-center border-b border-slate-200 px-4 sm:border-b-0 sm:border-r"
                    >
                        <Search class="h-4 w-4 shrink-0 text-slate-400" />

                        <input
                            v-model="searchQuery"
                            type="text"
                            placeholder="Search services, businesses..."
                            class="w-full border-0 bg-transparent px-3 py-3 text-sm text-slate-950 outline-none ring-0 placeholder:text-slate-400 focus:ring-0"
                        />
                    </div>

                    <div
                        class="flex min-w-0 flex-1 items-center border-b border-slate-200 px-4 sm:border-b-0 sm:border-r"
                    >
                        <MapPin class="h-4 w-4 shrink-0 text-slate-400" />

                        <input
                            v-model="locationQuery"
                            type="text"
                            placeholder="Location"
                            class="w-full border-0 bg-transparent px-3 py-3 text-sm text-slate-950 outline-none ring-0 placeholder:text-slate-400 focus:ring-0"
                        />
                    </div>

                    <button
                        type="submit"
                        class="flex h-12 items-center justify-center gap-2 bg-slate-950 px-7 text-sm font-semibold text-white transition-colors hover:bg-primary"
                    >
                        <Search class="h-4 w-4" />
                        Search
                    </button>
                </form>
            </div>
        </section>

        <!-- Content -->
        <div class="mx-auto max-w-8xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
            <div class="grid gap-10 xl:grid-cols-[220px_minmax(0,1fr)_580px]">
                <!-- Filters -->
                <aside class="hidden xl:block">
                    <div class="sticky top-36">
                        <div class="border-b border-slate-200 pb-4">
                            <p
                                class="text-[10px] font-bold uppercase tracking-[0.18em] text-primary"
                            >
                                Refine
                            </p>

                            <h2
                                class="mt-2 text-sm font-semibold text-slate-950"
                            >
                                Filters
                            </h2>
                        </div>

                        <div class="py-6">
                            <p
                                class="mb-3 text-xs font-semibold text-slate-950"
                            >
                                Minimum rating
                            </p>

                            <div class="flex flex-wrap gap-2">
                                <button
                                    v-for="rating in [4.5, 4, 3.5]"
                                    :key="rating"
                                    type="button"
                                    class="border px-3 py-2 text-xs font-medium transition-colors"
                                    :class="
                                        minRating === rating
                                            ? 'border-slate-950 bg-slate-950 text-white'
                                            : 'border-slate-200 text-slate-600 hover:border-slate-950 hover:text-slate-950'
                                    "
                                    @click="handleRatingFilter(rating)"
                                >
                                    {{ rating }}+
                                </button>
                            </div>
                        </div>
                    </div>
                </aside>

                <!-- Results -->
                <section class="min-w-0">
                    <!-- Results header -->
                    <div
                        class="mb-6 flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between"
                    >
                        <div>
                            <p
                                class="text-[10px] font-bold uppercase tracking-[0.18em] text-primary"
                            >
                                Discover
                            </p>

                            <h1
                                class="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950"
                            >
                                {{ searchResults.length }} businesses
                            </h1>

                            <p
                                v-if="route.query.search"
                                class="mt-1 text-sm text-slate-500"
                            >
                                Results for
                                <span class="font-medium text-slate-900">
                                    “{{ route.query.search }}”
                                </span>
                            </p>
                        </div>

                        <div class="flex items-center gap-2">
                            <div class="flex border border-slate-200">
                                <button
                                    type="button"
                                    class="flex h-9 w-9 items-center justify-center transition-colors"
                                    :class="
                                        viewMode === 'grid'
                                            ? 'bg-slate-950 text-white'
                                            : 'text-slate-400 hover:text-slate-950'
                                    "
                                    aria-label="Grid view"
                                    @click="viewMode = 'grid'"
                                >
                                    <LayoutGrid class="h-4 w-4" />
                                </button>

                                <button
                                    type="button"
                                    class="flex h-9 w-9 items-center justify-center transition-colors"
                                    :class="
                                        viewMode === 'list'
                                            ? 'bg-slate-950 text-white'
                                            : 'text-slate-400 hover:text-slate-950'
                                    "
                                    aria-label="List view"
                                    @click="viewMode = 'list'"
                                >
                                    <List class="h-4 w-4" />
                                </button>
                            </div>

                            <div class="relative hidden sm:block">
                                <select
                                    v-model="sortBy"
                                    class="h-9 appearance-none border border-slate-200 bg-white px-3 pr-8 text-xs font-medium text-slate-700 outline-none focus:border-slate-950"
                                >
                                    <option value="popular">
                                        Most Popular
                                    </option>

                                    <option value="rating">
                                        Highest Rated
                                    </option>

                                    <option value="newest">New Arrivals</option>
                                </select>

                                <ChevronDown
                                    class="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"
                                />
                            </div>
                        </div>
                    </div>

                    <!-- Mobile map -->
                    <div class="mb-5 flex xl:hidden">
                        <button
                            type="button"
                            class="inline-flex h-9 items-center gap-2 border border-slate-200 px-3 text-xs font-semibold text-slate-900 transition-colors hover:border-slate-950"
                            @click="showMapMobile = true"
                        >
                            <MapPin class="h-3.5 w-3.5" />
                            View map
                        </button>
                    </div>

                    <!-- Loading -->
                    <div
                        v-if="pending"
                        class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-"
                    >
                        <div
                            v-for="i in 6"
                            :key="i"
                            class="overflow-hidden border border-slate-200"
                        >
                            <div
                                class="aspect-[4/3] animate-pulse bg-slate-100"
                            />

                            <div class="space-y-3 p-5">
                                <div
                                    class="h-4 w-2/3 animate-pulse bg-slate-100"
                                />
                                <div
                                    class="h-3 w-1/2 animate-pulse bg-slate-100"
                                />
                                <div
                                    class="h-3 w-3/4 animate-pulse bg-slate-100"
                                />
                            </div>
                        </div>
                    </div>

                    <!-- Results -->
                    <div
                        v-else-if="searchResults.length"
                        :class="
                            viewMode === 'grid'
                                ? 'grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'
                                : 'space-y-4'
                        "
                    >
                        <article
                            v-for="venue in searchResults"
                            :key="venue.id"
                            class="group relative overflow-hidden border border-slate-200 bg-white transition-colors hover:border-slate-300"
                            :class="
                                viewMode === 'list'
                                    ? 'flex flex-col sm:flex-row'
                                    : ''
                            "
                        >
                            <!-- Image -->
                            <NuxtLink
                                :to="NAVIGATION_PATHS.VENUE(venue.slug)"
                                :class="
                                    viewMode === 'list'
                                        ? 'relative block aspect-[4/3] shrink-0 overflow-hidden bg-slate-100 sm:aspect-auto sm:h-auto sm:w-56'
                                        : 'relative block aspect-[4/3] overflow-hidden bg-slate-100'
                                "
                            >
                                <img
                                    :src="
                                        venue.media?.[0]?.url ||
                                        'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80'
                                    "
                                    :alt="venue.name"
                                    loading="lazy"
                                    class="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.025]"
                                />

                                <div
                                    class="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                                />

                                <div
                                    v-if="venue.category?.name"
                                    class="absolute left-3 top-3 bg-white px-2.5 py-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-900"
                                >
                                    {{ venue.category.name }}
                                </div>
                            </NuxtLink>

                            <!-- Favorite -->
                            <button
                                type="button"
                                class="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center border border-white/40 bg-black/25 text-white backdrop-blur-sm transition-all hover:bg-black/50 active:scale-95"
                                :class="{
                                    '!border-white/90 !bg-white/90 !text-primary':
                                        isFavorite(venue.id),
                                }"
                                :aria-label="`Save ${venue.name}`"
                                @click.stop.prevent="handleFavorite(venue.id)"
                            >
                                <Bookmark
                                    class="h-4 w-4"
                                    :class="{
                                        'fill-current': isFavorite(venue.id),
                                    }"
                                />
                            </button>

                            <!-- Content -->
                            <div
                                class="flex min-w-0 flex-1 flex-col p-5 sm:p-6"
                            >
                                <div
                                    class="flex items-start justify-between gap-4"
                                >
                                    <NuxtLink
                                        :to="NAVIGATION_PATHS.VENUE(venue.slug)"
                                        class="min-w-0"
                                    >
                                        <h2
                                            class="truncate text-base font-semibold tracking-[-0.01em] text-slate-950 transition-colors group-hover:text-primary"
                                        >
                                            {{ venue.name }}
                                        </h2>
                                    </NuxtLink>

                                    <div
                                        class="flex shrink-0 items-center gap-1"
                                    >
                                        <Star
                                            class="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                                        />

                                        <span
                                            class="text-xs font-semibold tabular-nums text-slate-900"
                                        >
                                            {{
                                                Number(
                                                    venue.rating || 0,
                                                ).toFixed(1)
                                            }}
                                        </span>
                                    </div>
                                </div>

                                <p
                                    class="mt-2 line-clamp-2 text-sm leading-5 text-slate-500"
                                >
                                    {{
                                        venue.tagline ||
                                        venue.description ||
                                        "Discover this local business."
                                    }}
                                </p>

                                <div
                                    class="mt-auto flex items-end justify-between gap-4 pt-5"
                                >
                                    <div class="min-w-0">
                                        <div
                                            class="flex items-center gap-1.5 text-xs text-slate-500"
                                        >
                                            <MapPin
                                                class="h-3.5 w-3.5 shrink-0 text-slate-400"
                                            />

                                            <span class="truncate">
                                                {{
                                                    venue.address?.suburb ||
                                                    venue.address?.city ||
                                                    "Location unavailable"
                                                }}
                                            </span>
                                        </div>

                                        <p
                                            v-if="venue.category?.name"
                                            class="mt-1 text-xs text-slate-400"
                                        >
                                            {{ venue.category.name }}
                                        </p>
                                    </div>

                                    <NuxtLink
                                        :to="NAVIGATION_PATHS.VENUE(venue.slug)"
                                        class="flex h-8 w-8 shrink-0 items-center justify-center border border-slate-200 text-slate-500 transition-all group-hover:border-slate-950 group-hover:bg-slate-950 group-hover:text-white"
                                        :aria-label="`View ${venue.name}`"
                                    >
                                        <ArrowUpRight class="h-4 w-4" />
                                    </NuxtLink>
                                </div>
                            </div>
                        </article>
                    </div>

                    <!-- Empty -->
                    <div
                        v-else
                        class="border border-slate-200 px-6 py-20 text-center"
                    >
                        <div
                            class="mx-auto flex h-12 w-12 items-center justify-center border border-slate-200"
                        >
                            <Search class="h-5 w-5 text-slate-400" />
                        </div>

                        <h2
                            class="mt-6 text-lg font-semibold tracking-tight text-slate-950"
                        >
                            No businesses found
                        </h2>

                        <p
                            class="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500"
                        >
                            Try another service, business name, location, or
                            rating.
                        </p>

                        <NuxtLink
                            :to="NAVIGATION_PATHS.SEARCH"
                            class="mt-6 inline-flex border-b border-slate-950 pb-1 text-sm font-semibold text-slate-950 transition-colors hover:border-primary hover:text-primary"
                        >
                            Clear search
                        </NuxtLink>
                    </div>
                </section>

                <!-- Desktop Map -->
                <aside class="hidden xl:block">
                    <div
                        class="sticky top-36 h-[calc(100vh-180px)] overflow-hidden border border-slate-200"
                    >
                        <LocationMap :points="mapPoints" />
                    </div>
                </aside>
            </div>
        </div>

        <!-- Mobile Map -->
        <Teleport to="body">
            <Transition
                enter-active-class="transition duration-200 ease-out"
                enter-from-class="opacity-0"
                enter-to-class="opacity-100"
                leave-active-class="transition duration-150 ease-in"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0"
            >
                <div v-if="showMapMobile" class="fixed inset-0 z-[70] bg-white">
                    <div class="relative h-full w-full">
                        <button
                            type="button"
                            class="absolute right-4 top-4 z-[80] flex h-10 w-10 items-center justify-center border border-slate-200 bg-white shadow-sm"
                            aria-label="Close map"
                            @click="showMapMobile = false"
                        >
                            <X class="h-5 w-5" />
                        </button>

                        <LocationMap :points="mapPoints" />
                    </div>
                </div>
            </Transition>
        </Teleport>
    </main>

    <Footer />
</template>
