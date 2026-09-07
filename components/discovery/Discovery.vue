<script setup lang="ts">
import ProviderCarousel from "./ProviderCarousel.vue";

const { data: discovery, pending } = await useDiscovery();

const mapVenueToProvider = (venue: any, tag?: string) => ({
    id: venue.id,
    slug: venue.slug,
    name: venue.name,
    image: venue.media?.[0]?.url || "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1600",
    alt: venue.media?.[0]?.alt || venue.name,
    rating: venue.rating,
    location: venue.address ? `${venue.address.suburb}, ${venue.address.city}` : "",
    category: venue.category?.name || "",
    reviews: venue.reviewCount,
    tag: tag || (venue.rating >= 4.9 ? "Featured" : null),
    verified: venue.business?.verified || false,
});

const recommended = computed(() =>
    discovery.value?.recommended?.map(v => mapVenueToProvider(v, "Featured")) || []
);

const trending = computed(() =>
    discovery.value?.trending?.map(v => mapVenueToProvider(v, "Trending")) || []
);

const newArrivals = computed(() =>
    discovery.value?.newArrivals?.map(v => mapVenueToProvider(v, "New")) || []
);
</script>

<template>
    <div v-if="pending" class="flex flex-col gap-10 py-8 md:gap-14 md:py-12">
        <div v-for="i in 3" :key="i" class="space-y-4 px-4 sm:px-6 lg:px-8">
            <div class="h-8 w-48 animate-pulse bg-slate-100" />
            <div class="flex gap-5 overflow-hidden">
                <div v-for="j in 4" :key="j" class="aspect-[4/3] w-[270px] shrink-0 animate-pulse bg-slate-100" />
            </div>
        </div>
    </div>

    <div v-else class="flex flex-col gap-10 py-8 md:gap-14 md:py-12">
        <ProviderCarousel v-if="recommended.length" title="Recommended" :items="recommended" />
        <ProviderCarousel v-if="trending.length" title="Trending" :items="trending" />
        <ProviderCarousel v-if="newArrivals.length" title="New Arrivals" :items="newArrivals" />
    </div>
</template>
