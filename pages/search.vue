<script setup lang="ts">
import {
  Search,
  MapPin,
  Filter,
  Star,
  Heart,
  ChevronDown,
  LayoutGrid,
  List,
  SlidersHorizontal,
  Navigation,
  ArrowRight,
  Loader2,
} from 'lucide-vue-next'
import { CATEGORIES, NAVIGATION_PATHS, POPULAR_SERVICES, LOCATIONS } from "~/utils/constants";

const route = useRoute()

const { data: searchResults, pending, refresh } = await useAsyncData('search-results', () => $fetch('/api/search', {
  params: {
    q: route.query.search,
    category: route.query.category,
    location: route.query.location
  }
}))

const viewMode = ref<'grid' | 'list'>('grid')
const sortBy = ref('popular')

watch(() => route.query, () => {
    refresh()
})

const searchQuery = ref(route.query.search as string || '')
const locationQuery = ref(route.query.location as string || '')

const handleSearch = () => {
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
  <main class="bg-white min-h-screen">
    <!-- Search Bar (Sticky-ish) -->
    <div class="bg-white border-b border-slate-200 sticky top-16 z-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <form class="flex flex-col md:flex-row gap-px border border-slate-200 bg-slate-200 overflow-hidden" @submit.prevent="handleSearch">
          <div class="flex-1 bg-white flex items-center px-4 py-3 focus-within:bg-slate-50 transition-colors">
            <Search class="w-5 h-5 text-slate-400 shrink-0" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search services..."
              class="w-full pl-3 text-sm text-slate-950 font-semibold border-0 focus:ring-0 outline-none placeholder:text-slate-400"
            />
          </div>
          <div class="flex-1 bg-white flex items-center px-4 py-3 focus-within:bg-slate-50 transition-colors">
            <MapPin class="w-5 h-5 text-slate-400 shrink-0" />
            <input
              v-model="locationQuery"
              type="text"
              placeholder="Location (e.g. Cape Town)"
              class="w-full pl-3 text-sm text-slate-950 font-semibold border-0 focus:ring-0 outline-none placeholder:text-slate-400"
            />
          </div>
          <button type="submit" class="bg-primary px-10 py-4 text-sm font-bold text-white hover:bg-slate-950 transition-all flex items-center justify-center gap-2">
            Update Search
          </button>
        </form>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="flex flex-col lg:flex-row gap-16">
        <!-- Sidebar Filters -->
        <aside class="w-full lg:w-64 space-y-12 hidden lg:block">
          <div>
            <h3 class="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-6">Categories</h3>
            <div class="space-y-4">
              <NuxtLink
                v-for="cat in CATEGORIES"
                :key="cat.slug"
                :to="{ path: NAVIGATION_PATHS.SEARCH, query: { ...route.query, category: cat.slug } }"
                class="flex items-center justify-between group"
                :class="route.query.category === cat.slug ? 'text-primary' : 'text-slate-600 hover:text-slate-950'"
              >
                <span class="text-sm font-semibold transition-colors">{{ cat.name }}</span>
                <ArrowRight class="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all" />
              </NuxtLink>
            </div>
          </div>

          <div>
            <h3 class="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-6">Filters</h3>
            <div class="space-y-6">
                 <!-- Rating -->
                 <div class="space-y-3">
                    <p class="text-xs font-bold text-slate-950">Minimum Rating</p>
                    <div class="flex flex-wrap gap-2">
                        <button v-for="r in [4.5, 4.0, 3.5]" :key="r" class="px-3 py-1.5 border border-slate-200 text-xs font-bold hover:border-slate-950 transition-colors">
                            {{ r }}+
                        </button>
                    </div>
                 </div>
            </div>
          </div>
        </aside>

        <!-- Results Area -->
        <div class="flex-1">
          <div class="flex items-center justify-between mb-10 pb-6 border-b border-slate-100">
            <div>
              <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Search Results</p>
              <h2 class="mt-2 text-2xl font-bold text-slate-950">
                {{ searchResults?.length || 0 }} results found
                <span v-if="route.query.search" class="text-slate-400 font-medium ml-2">for "{{ route.query.search }}"</span>
              </h2>
            </div>

            <div class="flex items-center gap-6">
              <div class="flex border border-slate-200 bg-slate-50 p-1">
                <button
                  @click="viewMode = 'grid'"
                  :class="['p-2 transition-all', viewMode === 'grid' ? 'bg-white text-slate-950 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600']"
                >
                  <LayoutGrid class="w-4 h-4" />
                </button>
                <button
                  @click="viewMode = 'list'"
                  :class="['p-2 transition-all', viewMode === 'list' ? 'bg-white text-slate-950 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600']"
                >
                  <List class="w-4 h-4" />
                </button>
              </div>

              <div class="relative hidden sm:block">
                <select v-model="sortBy" class="appearance-none bg-white border border-slate-200 px-4 py-2 pr-10 text-xs font-bold uppercase tracking-widest text-slate-950 outline-none focus:border-primary">
                    <option value="popular">Most Popular</option>
                    <option value="rating">Highest Rated</option>
                    <option value="newest">New Arrivals</option>
                </select>
                <ChevronDown class="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div v-for="i in 4" :key="i" class="animate-pulse bg-slate-50 border border-slate-100 h-[400px]"></div>
          </div>

          <div v-else-if="searchResults?.length > 0" :class="[viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-10' : 'space-y-10']">
            <NuxtLink
                v-for="venue in searchResults"
                :key="venue.id"
                :to="NAVIGATION_PATHS.VENUE(venue.slug)"
                class="group block border border-slate-100 bg-white hover:border-slate-200 transition-all duration-300 flex"
                :class="viewMode === 'grid' ? 'flex-col' : 'flex-row items-center gap-8'"
            >
              <div :class="['relative overflow-hidden bg-slate-50 border-slate-100', viewMode === 'grid' ? 'aspect-[4/3] border-b' : 'aspect-square w-64 border-r']">
                <img :src="venue.portfolio?.find(m => m.featured)?.url || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80'" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />

                <div class="absolute top-4 left-4">
                    <div class="px-2 py-1 bg-white text-slate-950 text-[8px] font-bold uppercase tracking-[0.2em] shadow-sm">
                        {{ venue.category?.name }}
                    </div>
                </div>
              </div>

              <div class="p-8 flex-1 flex flex-col">
                <div class="flex justify-between items-start mb-4">
                  <h3 class="text-xl font-bold text-slate-950 group-hover:text-primary transition-colors">{{ venue.name }}</h3>
                  <div class="flex items-center gap-1 text-primary">
                    <Star class="w-3.5 h-3.5 fill-primary" />
                    <span class="text-xs font-bold">{{ venue.rating }}</span>
                  </div>
                </div>

                <p class="text-sm text-slate-500 mb-8 line-clamp-2 leading-relaxed">
                  {{ venue.tagline || venue.description }}
                </p>

                <div class="mt-auto pt-8 border-t border-slate-100 flex items-center justify-between">
                   <div class="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                        <MapPin class="w-3 h-3 text-primary" stroke-width="2" />
                        {{ venue.address?.suburb }}, {{ venue.address?.city }}
                    </div>

                   <ArrowRight class="w-5 h-5 text-slate-950 transition-transform group-hover:translate-x-1" stroke-width="1.5" />
                </div>
              </div>
            </NuxtLink>
          </div>

          <div v-else class="py-24 text-center border-2 border-dashed border-slate-100">
            <div class="w-16 h-16 bg-slate-50 flex items-center justify-center mx-auto mb-8">
              <Search class="w-8 h-8 text-slate-200" />
            </div>
            <h3 class="text-2xl font-bold text-slate-950 mb-4">No venues found</h3>
            <p class="text-slate-500 max-w-sm mx-auto mb-10">Try adjusting your search terms or filters to find what you're looking for.</p>
            <NuxtLink :to="NAVIGATION_PATHS.SEARCH" class="text-sm font-bold text-primary border-b-2 border-primary pb-1 hover:text-slate-950 hover:border-slate-950 transition-colors">
                Clear all filters
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </main>
  <Footer />
</template>
