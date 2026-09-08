<script setup lang="ts">
import { MapPin, Users, ArrowRight, Loader2, Store } from "lucide-vue-next";

const { data: communities, pending } = await useFetch<any[]>("/api/communities");

useHead({
    title: "Communities | DailyBookings",
    meta: [
        { name: "description", content: "Discover local neighborhoods and join communities of professionals." }
    ]
});
</script>

<template>
    <main class="min-h-screen bg-slate-50 pt-24 pb-20">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div class="max-w-2xl mb-12">
                <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-3">Our Communities</p>
                <h1 class="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">Local Neighborhoods</h1>
                <p class="mt-4 text-lg text-slate-600">Discover and join communities of local businesses and professionals near you.</p>
            </div>

            <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div v-for="i in 3" :key="i" class="h-64 animate-pulse bg-white border border-slate-200" />
            </div>

            <div v-else-if="communities?.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <NuxtLink
                    v-for="community in communities"
                    :key="community.id"
                    :to="`/community/${community.slug}`"
                    class="group relative overflow-hidden border border-slate-200 bg-white transition-all hover:border-primary hover:shadow-xl"
                >
                    <div class="aspect-[16/9] overflow-hidden bg-slate-100">
                        <img v-if="community.imageUrl" :src="community.imageUrl" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        <div v-else class="flex h-full w-full items-center justify-center text-slate-200">
                            <MapPin class="h-12 w-12" />
                        </div>
                    </div>
                    <div class="p-6">
                        <h2 class="text-xl font-bold text-slate-900">{{ community.name }}</h2>
                        <p class="mt-2 text-sm text-slate-500 line-clamp-2">{{ community.description || 'No description provided.' }}</p>

                        <div class="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-[10px] font-bold uppercase tracking-widest">
                            <div class="flex items-center gap-4 text-slate-400">
                                <div class="flex items-center gap-1.5">
                                    <Store class="h-3.5 w-3.5" />
                                    {{ community._count?.venues }} Venues
                                </div>
                                <div class="flex items-center gap-1.5">
                                    <Users class="h-3.5 w-3.5" />
                                    {{ community._count?.members }} Members
                                </div>
                            </div>
                            <ArrowRight class="h-4 w-4 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                        </div>
                    </div>
                </NuxtLink>
            </div>

            <div v-else class="py-24 text-center bg-white border-2 border-dashed border-slate-200">
                <p class="text-slate-500">No active communities found. Check back soon!</p>
            </div>
        </div>
    </main>
</template>
