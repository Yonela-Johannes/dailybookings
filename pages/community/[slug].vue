<script setup lang="ts">
import { MapPin, Users, Store, ArrowLeft, Loader2, Check, UserPlus, UserMinus, Star, ArrowUpRight } from "lucide-vue-next";
import { formatDistanceToNow } from "date-fns";

const route = useRoute();
const { user } = useAuth();
const { data: community, pending, refresh } = await useFetch<any>(`/api/communities/${route.params.slug}`);

useHead(() => ({
    title: community.value ? `${community.value.name} | DailyBookings` : "Community",
}));

const isSubmitting = ref(false);

const handleJoinToggle = async () => {
    if (!user.value) return navigateTo('/auth/login');
    if (isSubmitting.value) return;

    isSubmitting.value = true;
    try {
        await $fetch('/api/communities/join', {
            method: 'POST',
            body: {
                communityId: community.value.id,
                action: community.value.isMember ? 'leave' : 'join'
            }
        });
        await refresh();
    } catch (error) {
        console.error('Action failed:', error);
    } finally {
        isSubmitting.value = false;
    }
};
</script>

<template>
    <main class="min-h-screen bg-slate-50 pt-24 pb-20">
        <div v-if="pending" class="flex items-center justify-center py-40">
            <Loader2 class="w-12 h-12 text-primary animate-spin" />
        </div>

        <div v-else-if="community" class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <NuxtLink to="/community" class="mb-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-primary transition-colors">
                <ArrowLeft class="w-3.5 h-3.5" />
                All Communities
            </NuxtLink>

            <!-- Hero -->
            <div class="relative overflow-hidden border border-slate-200 bg-white shadow-sm mb-12">
                <div class="grid lg:grid-cols-2">
                    <div class="p-8 lg:p-12">
                        <div class="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-5">
                            <MapPin class="w-3 h-3" />
                            Local Neighborhood
                        </div>
                        <h1 class="text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 mb-6">{{ community.name }}</h1>
                        <p class="text-lg text-slate-600 leading-relaxed mb-8">{{ community.description || 'Welcome to the ' + community.name + ' community. Discover local excellence.' }}</p>

                        <div class="flex flex-wrap items-center gap-6 mb-10">
                            <div class="flex items-center gap-2">
                                <div class="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center text-primary border border-slate-100">
                                    <Store class="w-5 h-5" />
                                </div>
                                <div>
                                    <div class="text-sm font-bold text-slate-900">{{ community._count?.venues }}</div>
                                    <div class="text-[10px] text-slate-400 uppercase tracking-widest">Venues</div>
                                </div>
                            </div>
                            <div class="flex items-center gap-2">
                                <div class="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center text-primary border border-slate-100">
                                    <Users class="w-5 h-5" />
                                </div>
                                <div>
                                    <div class="text-sm font-bold text-slate-900">{{ community._count?.members }}</div>
                                    <div class="text-[10px] text-slate-400 uppercase tracking-widest">Members</div>
                                </div>
                            </div>
                        </div>

                        <button
                            @click="handleJoinToggle"
                            :disabled="isSubmitting"
                            class="inline-flex h-12 items-center justify-center gap-2 px-8 text-sm font-bold uppercase tracking-widest transition-all"
                            :class="[
                                community.isMember
                                ? 'bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-600'
                                : 'bg-primary text-white hover:bg-slate-950 shadow-lg shadow-primary/20'
                            ]"
                        >
                            <Loader2 v-if="isSubmitting" class="w-4 h-4 animate-spin" />
                            <template v-else>
                                <component :is="community.isMember ? UserMinus : UserPlus" class="w-4 h-4" />
                                {{ community.isMember ? 'Leave Community' : 'Join Community' }}
                            </template>
                        </button>
                    </div>
                    <div class="aspect-[16/9] lg:aspect-auto bg-slate-100 border-t lg:border-t-0 lg:border-l border-slate-200 overflow-hidden">
                        <img v-if="community.imageUrl" :src="community.imageUrl" class="h-full w-full object-cover" />
                        <div v-else class="h-full w-full flex items-center justify-center text-slate-200">
                            <MapPin class="w-32 h-32" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Businesses -->
            <div class="space-y-8">
                <div class="flex items-center justify-between border-b border-slate-200 pb-5">
                    <h2 class="text-2xl font-bold text-slate-900 tracking-tight">Professionals in {{ community.name }}</h2>
                    <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">{{ community.venues?.length || 0 }} Results</span>
                </div>

                <div v-if="community.venues?.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <NuxtLink
                        v-for="venue in community.venues"
                        :key="venue.id"
                        :to="`/venue/${venue.slug}`"
                        class="group bg-white border border-slate-200 overflow-hidden hover:border-primary transition-all flex flex-col"
                    >
                        <div class="aspect-[4/3] overflow-hidden relative">
                            <img :src="venue.media?.[0]?.url || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800'" class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            <div class="absolute top-4 left-4">
                                <span class="bg-white/95 backdrop-blur px-2 py-1 text-[9px] font-black uppercase tracking-widest text-slate-900 border border-slate-100 shadow-sm">{{ venue.category?.name }}</span>
                            </div>
                        </div>
                        <div class="p-6 flex-1 flex flex-col">
                            <div class="flex items-start justify-between gap-4 mb-2">
                                <h3 class="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors">{{ venue.name }}</h3>
                                <div class="flex items-center gap-1 text-primary">
                                    <Star class="w-3.5 h-3.5 fill-current" />
                                    <span class="text-xs font-bold">{{ venue.rating }}</span>
                                </div>
                            </div>
                            <p class="text-sm text-slate-500 line-clamp-2 mb-6 leading-relaxed">{{ venue.tagline || venue.description }}</p>

                            <div class="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                                <div class="flex items-center gap-2 text-slate-400">
                                    <MapPin class="w-3.5 h-3.5 text-primary" />
                                    {{ venue.address?.suburb }}
                                </div>
                                <span class="flex items-center gap-2 text-slate-900">
                                    View
                                    <ArrowUpRight class="w-4 h-4" />
                                </span>
                            </div>
                        </div>
                    </NuxtLink>
                </div>

                <div v-else class="py-20 text-center bg-white border border-slate-200">
                    <Store class="w-12 h-12 text-slate-200 mx-auto mb-4" />
                    <p class="text-slate-500">No businesses found in this community yet.</p>
                </div>
            </div>
        </div>
    </main>
</template>
