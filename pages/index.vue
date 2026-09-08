<script setup lang="ts">
import { CalendarCheck, Clock, Shield, ArrowRight } from "lucide-vue-next";
import PinboardReel from "~/components/PinboardReel.vue";

const { data: discovery } = await useDiscovery();

</script>

<template>
    <Hero />
    <Popular />
    <PinboardReel/>
    <HowItWorks />
    <Discovery />
    <Community />
    <Blogs />
    <Download />
    <Newsletter />
</template>
