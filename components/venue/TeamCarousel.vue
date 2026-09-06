<script setup lang="ts">
import { ArrowRight, ChevronLeft, ChevronRight, Star } from "lucide-vue-next";

import type { VenueEmployee } from "~/types/venue";

defineProps<{
    team: VenueEmployee[];
}>();

const carousel = ref<HTMLElement | null>(null);

function initials(name: string) {
    return name
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
}

function scroll(direction: "left" | "right") {
    if (!carousel.value) return;

    carousel.value.scrollBy({
        left: direction === "left" ? -280 : 280,
        behavior: "smooth",
    });
}
</script>

<template>
    <section v-if="team.length" aria-labelledby="team-heading">
        <!-- Header -->
        <div class="mb-6 flex items-end justify-between gap-4">
            <div>
                <p
                    class="text-xs font-semibold uppercase tracking-[0.16em] text-primary"
                >
                    The people
                </p>

                <h2
                    id="team-heading"
                    class="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl"
                >
                    Meet the team
                </h2>

                <p class="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                    Get to know the people behind the service.
                </p>
            </div>

            <!-- Desktop controls -->
            <div v-if="team.length > 3" class="hidden gap-2 sm:flex">
                <button
                    type="button"
                    aria-label="Previous team members"
                    class="inline-flex h-10 w-10 items-center justify-center border border-slate-200 bg-white text-slate-700 transition hover:border-slate-950 hover:bg-slate-950 hover:text-white"
                    @click="scroll('left')"
                >
                    <ChevronLeft class="h-4 w-4" />
                </button>

                <button
                    type="button"
                    aria-label="Next team members"
                    class="inline-flex h-10 w-10 items-center justify-center border border-slate-200 bg-white text-slate-700 transition hover:border-slate-950 hover:bg-slate-950 hover:text-white"
                    @click="scroll('right')"
                >
                    <ChevronRight class="h-4 w-4" />
                </button>
            </div>
        </div>

        <!-- Team carousel -->
        <div
            ref="carousel"
            class="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 scrollbar-none sm:mx-0 sm:px-0"
        >
            <article
                v-for="member in team"
                :key="member.id"
                class="w-[190px] shrink-0 snap-start sm:w-[210px]"
            >
                <!-- Portrait -->
                <div
                    class="relative aspect-[4/5] overflow-hidden rounded-xl bg-slate-100"
                >
                    <img
                        v-if="member.image?.url || member.avatarUrl"
                        :src="member.image?.url || member.avatarUrl"
                        :alt="member.image?.alt || member.name"
                        class="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
                    />

                    <div
                        v-else
                        class="flex h-full w-full items-center justify-center bg-slate-100 text-3xl font-semibold text-slate-400"
                    >
                        {{ initials(member.name) }}
                    </div>

                    <!-- Rating -->
                    <div
                        v-if="member.rating"
                        class="absolute bottom-3 left-3 flex items-center gap-1 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-950 shadow-sm"
                    >
                        <Star
                            class="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                            stroke-width="1.5"
                        />

                        {{ member.rating.toFixed(1) }}
                    </div>
                </div>

                <!-- Details -->
                <div class="pt-4">
                    <h3 class="font-medium text-slate-950">
                        {{ member.name }}
                    </h3>

                    <p v-if="member.title" class="mt-1 text-sm text-slate-500">
                        {{ member.title }}
                    </p>

                    <p
                        v-if="member.reviewCount"
                        class="mt-1 text-xs text-slate-400"
                    >
                        {{ member.reviewCount }} reviews
                    </p>
                </div>
            </article>
        </div>

        <!-- Mobile hint -->
        <div
            v-if="team.length > 2"
            class="mt-4 flex items-center gap-2 text-xs font-medium text-slate-400 sm:hidden"
        >
            <span>Swipe to see the team</span>
            <ArrowRight class="h-3.5 w-3.5" />
        </div>
    </section>
</template>
