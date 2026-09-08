<script setup lang="ts">
import ProviderCarousel from "./ProviderCarousel.vue";

const { data: discovery, pending } = await useDiscovery();

const mapVenueToProvider = (venue: any, tag?: string) => ({
    id: venue.id,
    slug: venue.slug,
    name: venue.name,
    image: venue.media?.[0]?.url || "",
    alt: venue.media?.[0]?.alt || venue.name,
    rating: venue.rating ?? 0,
    location: venue.address
        ? [venue.address.suburb, venue.address.city].filter(Boolean).join(", ")
        : "",
    category: venue.category?.name || "",
    reviews: venue.reviewCount ?? 0,
    tag: tag || (venue.rating >= 4.9 ? "Featured" : null),
    verified: venue.business?.verified || false,
});

const recommended = computed(
    () =>
        discovery.value?.recommended?.map((v) =>
            mapVenueToProvider(v, "Featured"),
        ) || [],
);

const trending = computed(
    () =>
        discovery.value?.trending?.map((v) =>
            mapVenueToProvider(v, "Trending"),
        ) || [],
);

const newArrivals = computed(
    () =>
        discovery.value?.newArrivals?.map((v) =>
            mapVenueToProvider(v, "New"),
        ) || [],
);
</script>

<template>
    <div
        v-if="pending"
        class="flex flex-col gap-10 overflow-hidden py-8 md:gap-14 md:py-12"
    >
        <section v-for="i in 3" :key="i" class="overflow-hidden">
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div class="mb-6 h-8 w-48 animate-pulse bg-slate-100" />
            </div>

            <div
                class="flex gap-5 overflow-hidden px-4 sm:px-6 lg:px-[max(2rem,calc((100vw-80rem)/2))]"
            >
                <div
                    v-for="j in 5"
                    :key="j"
                    class="aspect-[4/3] w-[250px] shrink-0 animate-pulse bg-slate-100 sm:w-[270px]"
                />
            </div>
        </section>
    </div>

    <div
        v-else
        class="flex flex-col gap-10 overflow-hidden py-8 md:gap-14 md:py-12"
    >
        <ProviderCarousel
            v-if="recommended.length"
            title="Recommended"
            :items="recommended"
        />

        <ProviderCarousel
            v-if="trending.length"
            title="Trending"
            :items="trending"
        />

        <ProviderCarousel
            v-if="newArrivals.length"
            title="New Arrivals"
            :items="newArrivals"
        />
    </div>
</template>
