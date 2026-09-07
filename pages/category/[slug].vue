<script setup lang="ts">
import { MapPin, Star, ArrowRight } from 'lucide-vue-next'

const route = useRoute()
const slug = route.params.slug as string

const { data: venues, pending } = useAsyncData(`category-venues-${slug}`, () =>
  $fetch(`/api/venues`, { params: { category: slug } })
)

const { data: categories } = useAsyncData('categories', () => $fetch('/api/categories'))

const currentCategory = computed(() =>
  categories.value?.find((c: any) => c.slug === slug)
)

useHead({
  title: currentCategory.value ? `${currentCategory.value.name} in South Africa` : 'Venues by Category',
})
</script>

<template>
  <div class="bg-white min-h-screen">
    <!-- Header -->
    <header class="py-12 bg-slate-50 border-b border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav class="flex mb-4 text-xs font-semibold uppercase tracking-widest text-slate-400">
          <NuxtLink to="/" class="hover:text-primary">Home</NuxtLink>
          <span class="mx-2">/</span>
          <span class="text-slate-900">{{ currentCategory?.name || 'Category' }}</span>
        </nav>
        <h1 class="text-4xl font-bold text-slate-900 mb-2">
          {{ currentCategory?.name || 'Top Venues' }}
        </h1>
        <p class="text-slate-500 max-w-2xl">
          Discover and book top-rated {{ currentCategory?.name?.toLowerCase() || 'services' }} near you. Secure your appointment instantly.
        </p>
      </div>
    </header>

    <!-- Content -->
    <main class="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div v-if="pending" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="i in 6" :key="i" class="h-80 bg-slate-100 animate-pulse rounded-2xl" />
      </div>

      <div v-else-if="venues?.length" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <NuxtLink
          v-for="venue in venues"
          :key="venue.id"
          :to="`/venue/${venue.slug}`"
          class="group block"
        >
          <div class="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 mb-4">
            <img
              v-if="venue.media?.[0]?.url"
              :src="venue.media[0].url"
              :alt="venue.name"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div v-else class="w-full h-full flex items-center justify-center text-slate-300">
              <MapPin class="h-12 w-12" />
            </div>
            <div class="absolute top-4 right-4 bg-white/95 backdrop-blur px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
              <Star class="h-3.5 w-3.5 text-primary fill-primary" />
              <span class="text-xs font-bold text-slate-900">{{ venue.rating || 'N/A' }}</span>
            </div>
          </div>
          <h3 class="text-xl font-bold text-slate-900 mb-1 group-hover:text-primary transition-colors">
            {{ venue.name }}
          </h3>
          <div class="flex items-center gap-1.5 text-slate-500 text-sm mb-3">
            <MapPin class="h-3.5 w-3.5" />
            {{ venue.address?.city }}, {{ venue.address?.suburb }}
          </div>
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold uppercase tracking-widest text-primary">{{ venue.category?.name }}</span>
            <span class="inline-flex items-center text-sm font-bold text-slate-900">
              Book now <ArrowRight class="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </NuxtLink>
      </div>

      <div v-else class="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
        <p class="text-slate-500 mb-4">No venues found in this category yet.</p>
        <NuxtLink to="/" class="text-primary font-bold">Explore all venues</NuxtLink>
      </div>
    </main>
  </div>
  <Footer />
</template>
