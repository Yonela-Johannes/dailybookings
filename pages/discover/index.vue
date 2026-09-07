<script setup lang="ts">
import {
  Search,
  MapPin,
  ChevronRight,
  Star,
  Heart,
  Filter,
  ArrowRight,
  Loader2,
  Sparkles,
  Scissors,
  HeartPulse,
  Dumbbell,
  Camera,
  GraduationCap,
  House,
  BriefcaseBusiness
} from 'lucide-vue-next'
import { NAVIGATION_PATHS, POPULAR_SERVICES, LOCATIONS } from "~/utils/constants";

useHead({
    title: "Discover Local Services | DailyBookings",
    meta: [
        { name: "description", content: "Explore top-rated local professionals and services across South Africa." }
    ]
});

const { data: discoveryData, pending } = await useDiscovery();

const ICON_MAP: Record<string, any> = {
    sparkles: Sparkles,
    scissors: Scissors,
    'heart-pulse': HeartPulse,
    dumbbell: Dumbbell,
    camera: Camera,
    'graduation-cap': GraduationCap,
    house: House,
    'briefcase-business': BriefcaseBusiness,
};

const getCategoryIcon = (iconName: string | null) => {
    return ICON_MAP[iconName || 'sparkles'] || Sparkles;
};

const searchQuery = ref('')
const locationQuery = ref('')

const handleSearch = () => {
    if (!searchQuery.value && !locationQuery.value) return;
    navigateTo({
        path: NAVIGATION_PATHS.SEARCH,
        query: {
            search: searchQuery.value || undefined,
            location: locationQuery.value || undefined,
        },
    });
};
</script>

<template>
  <main class="min-h-screen bg-white">
    <!-- Editorial Header -->
    <header class="bg-slate-950 py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div class="absolute inset-0 opacity-20">
        <div class="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
        <div class="absolute bottom-0 right-0 w-96 h-96 bg-primary rounded-full blur-[120px] translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div class="max-w-5xl mx-auto relative z-10 text-center">
        <p class="mb-6 text-[10px] font-bold uppercase tracking-[0.28em] text-primary">
            Explore South Africa
        </p>
        <h1 class="text-4xl md:text-7xl font-bold text-white mb-8 tracking-tight leading-[1.05]">
          Discover local greatness.
        </h1>
        <p class="text-slate-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
          The best hair, beauty, wellness and professional services in your community, all bookable in seconds.
        </p>

        <!-- Search Bar -->
        <form
            class="bg-white p-2 shadow-2xl flex flex-col md:flex-row gap-px max-w-4xl mx-auto"
            @submit.prevent="handleSearch"
        >
          <div class="flex-1 relative flex items-center px-4 py-4 focus-within:bg-slate-50 transition-colors">
            <Search class="w-5 h-5 text-slate-400 shrink-0" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="What are you looking for?"
              class="w-full pl-3 text-sm text-slate-950 font-semibold border-0 focus:ring-0 outline-none placeholder:text-slate-400 bg-transparent"
            />
          </div>
          <div class="hidden md:block w-px h-10 bg-slate-100 self-center"></div>
          <div class="flex-1 relative flex items-center px-4 py-4 focus-within:bg-slate-50 transition-colors">
            <MapPin class="w-5 h-5 text-slate-400 shrink-0" />
            <input
              v-model="locationQuery"
              type="text"
              placeholder="Where? (e.g. Sandton)"
              class="w-full pl-3 text-sm text-slate-950 font-semibold border-0 focus:ring-0 outline-none placeholder:text-slate-400 bg-transparent"
            />
          </div>
          <button
            type="submit"
            class="bg-primary text-white px-10 py-4 text-sm font-bold transition-all hover:bg-slate-950 flex items-center justify-center gap-2"
          >
            Search
            <ArrowRight class="w-4 h-4" />
          </button>
        </form>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-32">
      <!-- Categories Grid -->
      <section>
        <div class="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div class="max-w-2xl">
            <p class="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Browse</p>
            <h2 class="text-3xl md:text-4xl font-bold text-slate-950 tracking-tight">Popular Categories</h2>
          </div>
          <NuxtLink :to="NAVIGATION_PATHS.DISCOVER" class="text-sm font-bold text-slate-950 border-b-2 border-primary pb-1 hover:text-primary transition-colors">
            View All Categories
          </NuxtLink>
        </div>

        <div v-if="pending" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-px bg-slate-200 border border-slate-200 overflow-hidden">
            <div v-for="i in 8" :key="i" class="bg-white p-10 animate-pulse h-40"></div>
        </div>

        <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-px bg-slate-200 border border-slate-200 overflow-hidden">
          <NuxtLink
            v-for="cat in discoveryData?.popularCategories"
            :key="cat.name"
            :to="NAVIGATION_PATHS.CATEGORY(cat.slug)"
            class="group bg-white p-10 text-center hover:bg-slate-50 transition-all duration-300 flex flex-col items-center"
          >
            <div class="mb-6 flex h-14 w-14 items-center justify-center border border-slate-100 bg-slate-50 text-slate-950 group-hover:border-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <component :is="getCategoryIcon(cat.icon)" class="h-6 w-6" stroke-width="1.5" />
            </div>
            <h3 class="font-bold text-slate-950 mb-2 uppercase tracking-wider text-xs">{{ cat.name }}</h3>
            <p v-if="cat.description" class="text-[10px] font-medium text-slate-400 uppercase tracking-[0.15em]">{{ cat.description }}</p>
          </NuxtLink>
        </div>
      </section>

      <!-- Featured Providers Section -->
      <section>
        <div class="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div class="max-w-2xl">
            <p class="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Handpicked</p>
            <h2 class="text-3xl md:text-4xl font-bold text-slate-950 tracking-tight">Featured Professionals</h2>
          </div>
          <div class="flex gap-4">
             <button class="h-11 px-5 border border-slate-200 text-sm font-bold flex items-center gap-2 hover:border-slate-950 transition-colors">
                <Filter class="w-4 h-4" />
                Filter
             </button>
          </div>
        </div>

        <div v-if="pending" class="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div v-for="i in 3" :key="i" class="animate-pulse bg-slate-50 border border-slate-100 h-[450px]"></div>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-10">
          <NuxtLink
            v-for="venue in discoveryData?.recommended"
            :key="venue.id"
            :to="NAVIGATION_PATHS.VENUE(venue.slug)"
            class="group block h-full border border-slate-100 bg-white hover:border-slate-200 transition-all duration-500 flex flex-col"
          >
            <!-- Image Area -->
            <div class="relative aspect-[4/5] overflow-hidden bg-slate-50 border-b border-slate-100">
              <img
                :src="venue.media?.find(m => m.featured)?.url || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80'"
                :alt="venue.name"
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />

              <div class="absolute top-5 left-5">
                <div class="px-3 py-1.5 bg-white text-slate-950 text-[9px] font-bold uppercase tracking-[0.2em] shadow-sm">
                  {{ venue.category?.name }}
                </div>
              </div>
            </div>

            <div class="p-8 flex-1 flex flex-col">
              <div class="flex justify-between items-start mb-4">
                <h3 class="text-2xl font-bold text-slate-950 leading-tight">{{ venue.name }}</h3>
                <div class="flex items-center gap-1.5 text-primary">
                  <Star class="w-4 h-4 fill-primary" />
                  <span class="text-sm font-bold">{{ venue.rating }}</span>
                </div>
              </div>

              <p class="text-slate-500 text-sm mb-8 line-clamp-2 leading-relaxed">
                {{ venue.tagline || venue.description }}
              </p>

              <div class="mt-auto pt-8 border-t border-slate-100 flex items-center justify-between">
                <div class="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <MapPin class="w-3.5 h-3.5 text-primary" stroke-width="2" />
                  {{ venue.address?.suburb }}, {{ venue.address?.city }}
                </div>

                <span class="group-hover:translate-x-1 transition-transform">
                    <ArrowRight class="w-5 h-5 text-slate-950" stroke-width="1.5" />
                </span>
              </div>
            </div>
          </NuxtLink>
        </div>
      </section>

      <!-- Trending Section -->
      <section class="bg-slate-50 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 py-24 border-y border-slate-200">
        <div class="max-w-7xl mx-auto">
          <div class="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div class="max-w-2xl">
                <p class="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Trending</p>
                <h2 class="text-3xl md:text-4xl font-bold text-slate-950 tracking-tight">Local Favourites</h2>
                <p class="mt-4 text-slate-600 max-w-xl">The services your community is booking right now.</p>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div v-for="service in discoveryData?.trendingServices?.slice(0, 4)" :key="service.id" class="bg-white p-8 border border-slate-200 group hover:border-primary transition-colors flex flex-col">
              <div class="w-12 h-12 border border-slate-100 bg-slate-50 text-slate-950 flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white transition-all">
                <ArrowRight class="w-5 h-5" stroke-width="1.5" />
              </div>
              <h3 class="text-lg font-bold text-slate-950 mb-3">{{ service.name }}</h3>
              <p class="text-sm text-slate-500 mb-8 leading-relaxed">Discover top-rated providers offering {{ service.name.toLowerCase() }} in your area.</p>

              <NuxtLink
                :to="`${NAVIGATION_PATHS.SEARCH}?search=${encodeURIComponent(service.name)}`"
                class="mt-auto text-[10px] font-bold text-slate-950 uppercase tracking-[0.2em] flex items-center gap-2 group-hover:text-primary transition-colors"
              >
                Find Venues
                <ArrowRight class="w-3.5 h-3.5" />
              </NuxtLink>
            </div>
          </div>
        </div>
      </section>
    </div>
  </main>
</template>
