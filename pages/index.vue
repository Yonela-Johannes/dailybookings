<script setup lang="ts">
import { CalendarCheck, Clock, Shield, ArrowRight } from "lucide-vue-next";
import PinboardReel from "~/components/PinboardReel.vue";

const { data: discovery } = await useDiscovery();

const pinboardCategories = computed(() => {
    return discovery.value?.popularCategories?.map((cat: any) => ({
        name: cat.name,
        imageUrl: cat.imageUrl || '/img/placeholder.jpg',
        available: true
    })) || [];
});
</script>

<template>
    <Hero />
    <Popular />
    <PinboardReel
        v-if="pinboardCategories.length > 0"
        :categories="pinboardCategories"
    />
    <HowItWorks />
    <Discovery />
    <Community />
    <Blogs />
    <Download />
    <Newsletter />
</template>
