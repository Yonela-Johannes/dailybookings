<script setup lang="ts">
import ProviderCarousel from "./ProviderCarousel.vue";

const recommended = [
    {
        id: 1,
        slug: "rose-blvd-beauty-bar-sea-point-cape-town",
        name: "Rose Blvd Beauty Bar SEA POINT",
        image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1600",
        alt: "Nail spa interior at Rose Blvd Beauty Bar Sea Point",
        rating: 4.9,
        location: "Sea Point, Cape Town",
        category: "Nails",
        reviews: 5012,
        tag: "Featured",
    },
    {
        id: 2,
        slug: "mbokodo-hair-salon-sandton",
        name: "Mbokodo Hair Salon",
        image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=1200",
        alt: "Interior of Mbokodo Hair Salon",
        rating: 4.8,
        location: "Sandton, Johannesburg",
        category: "Hair Salon",
        reviews: 136,
        tag: "Featured",
        verified: true,
    },
    {
        id: 3,
        slug: "boa-beauty-bar-durbanville-cape-town",
        name: "BOA Beauty Bar Durbanville",
        image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200",
        alt: "Interior of BOA Beauty Bar Durbanville",
        rating: 4.7,
        location: "Durbanville, Cape Town",
        category: "Nails",
        reviews: 8854,
        tag: "Featured",
    },
    {
        id: 4,
        slug: "kallos-house-of-beauty-cape-town",
        name: "Kallos House of Beauty",
        image: "https://images.unsplash.com/photo-1519415510236-718bdfcd89c1?w=1200",
        alt: "Interior of Kallos House of Beauty",
        rating: 5.0,
        location: "Eversdal, Cape Town",
        category: "Beauty Salon",
        reviews: 788,
        tag: "Featured",
    },
];

const trending = [
    {
        id: 5,
        slug: "the-barber-sandton",
        name: "The Barber Sandton",
        image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1200",
        alt: "Barber chairs at The Barber Sandton",
        rating: 5.0,
        location: "Sandton, Johannesburg",
        category: "Barber",
        reviews: 1250,
        tag: "Trending",
    },
    {
        id: 6,
        slug: "urban-glow-spa-pretoria",
        name: "Urban Glow Spa",
        image: "https://images.unsplash.com/photo-1544161515-4ae6ce6db87e?w=1200",
        alt: "Interior of Urban Glow Spa",
        rating: 4.9,
        location: "Brooklyn, Pretoria",
        category: "Spa & Wellness",
        reviews: 890,
        tag: "Top Rated",
        verified: true,
    },
    {
        id: 7,
        slug: "the-photographer-stellenbosch",
        name: "Studio Stellenbosch",
        image: "https://images.unsplash.com/photo-1520853502340-599adeb22424?w=1200",
        alt: "Photography studio interior",
        rating: 5.0,
        location: "Stellenbosch",
        category: "Photography",
        reviews: 450,
        tag: "Best in Class",
    },
    {
        id: 8,
        slug: "fitness-elite-umhlanga",
        name: "Fitness Elite",
        image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200",
        alt: "Gym interior at Fitness Elite",
        rating: 4.9,
        location: "Umhlanga, Durban",
        category: "Fitness",
        reviews: 670,
        tag: "Premium",
        verified: true,
    },
];

const newArrivals = [
    {
        id: 9,
        slug: "bloom-beauty-somerset-west",
        name: "Bloom Beauty",
        image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1200",
        alt: "Beauty salon interior at Bloom Beauty",
        rating: 5.0,
        location: "Somerset West",
        category: "Beauty",
        reviews: 45,
        tag: "New",
    },
    {
        id: 10,
        slug: "gentlemans-grooming-waterfront",
        name: "V&A Grooming",
        image: "https://images.unsplash.com/photo-1512690196252-7e804f911679?w=1200",
        alt: "Interior of V&A Grooming",
        rating: 4.9,
        location: "Waterfront, Cape Town",
        category: "Barber",
        reviews: 120,
        tag: "New",
    },
];
</script>

<template>
    <div class="flex flex-col gap-10 py-8 md:gap-14 md:py-12">
        <ProviderCarousel title="Recommended" :items="recommended" />
        <ProviderCarousel title="Trending" :items="trending" />
        <ProviderCarousel title="New Arrivals" :items="newArrivals" />
    </div>
</template>
