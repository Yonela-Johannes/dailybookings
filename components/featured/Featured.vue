<script setup lang="ts">
import FeaturedProviders from "./FeaturedProviders.vue";

const featured = [
    {
        id: 1,
        slug: "rose-blvd-beauty-bar-sea-point-cape-town",
        name: "Rose Blvd Beauty Bar",
        image: "/images/providers/rose-blvd.jpg",
        alt: "Rose Blvd Beauty Bar",
        rating: 4.9,
        location: "Sea Point, Cape Town",
        category: "Beauty",
        reviews: 5012,
        verified: true,
    },
    {
        id: 2,
        slug: "mbokodo-hair-salon-sandton",
        name: "Mbokodo Hair Salon",
        image: "/images/providers/mbokodo.jpg",
        alt: "Mbokodo Hair Salon",
        rating: 4.8,
        location: "Sandton, Johannesburg",
        category: "Hair",
        reviews: 136,
        verified: true,
    },
    {
        id: 3,
        slug: "example-photography",
        name: "Example Photography",
        image: "/images/providers/photography.jpg",
        alt: "Photography studio",
        rating: 5.0,
        location: "Cape Town",
        category: "Photography",
        reviews: 248,
    },
];

const handleFavorite = (id: string | number) => {
    console.log("favorite:", id);
};
</script>

<template>
    <FeaturedProviders :providers="featured" @favorite="handleFavorite" />
</template>
