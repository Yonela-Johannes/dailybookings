<script setup lang="ts">
import {
    ArrowRight,
    Clock3,
    MapPin,
    ShieldCheck,
    Star,
    X,
} from "lucide-vue-next";
import StarRating from "~/components/venue/StarRating.vue";
import { useBookingCart } from "~/composables/useBookingCart";
import type { Venue } from "~/types/venue";

defineProps<{
    venue: Venue;
}>();

const emit = defineEmits<{
    continue: [];
}>();

const cart = useBookingCart();

function formatDuration(minutes: number) {
    const hours = Math.floor(minutes / 60);
    const remaining = minutes % 60;

    if (hours && remaining) {
        return `${hours} hr ${remaining} min`;
    }

    if (hours) {
        return `${hours} hr`;
    }

    return `${remaining} min`;
}
</script>

<template>
    <aside class="border border-slate-200 bg-white">
        <!-- Venue -->
        <div class="p-5 sm:p-6">
            <div class="flex items-center gap-3">
                <img
                    :src="venue.images[0]?.url"
                    :alt="venue.name"
                    class="h-14 w-14 shrink-0 rounded-xl object-cover"
                />

                <div class="min-w-0">
                    <div class="flex items-center gap-1.5">
                        <p
                            class="truncate text-sm font-semibold text-slate-950"
                        >
                            {{ venue.name }}
                        </p>

                        <ShieldCheck
                            v-if="venue.verified"
                            class="h-3.5 w-3.5 shrink-0 text-primary"
                            stroke-width="1.8"
                            aria-label="Verified business"
                        />
                    </div>

                    <div class="mt-1 flex items-center gap-1.5">
                        <StarRating :rating="venue.rating" size="sm" />

                        <span class="text-xs text-slate-400">
                            {{ venue.rating.toFixed(1) }}
                            ({{ venue.reviewCount }})
                        </span>
                    </div>

                    <div
                        class="mt-1 flex items-center gap-1 text-xs text-slate-400"
                    >
                        <MapPin class="h-3 w-3" stroke-width="1.7" />

                        <span class="truncate">
                            {{ venue.address.suburb }},
                            {{ venue.address.city }}
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Services -->
        <div class="border-t border-slate-100">
            <div class="flex items-center justify-between px-5 py-4 sm:px-6">
                <h2 class="text-sm font-semibold text-slate-950">
                    Your services
                </h2>

                <span v-if="cart.count.value" class="text-xs text-slate-400">
                    {{ cart.count.value }}
                    {{ cart.count.value === 1 ? "service" : "services" }}
                </span>
            </div>

            <!-- Empty -->
            <div
                v-if="!cart.lines.value.length"
                class="border-t border-slate-100 px-5 py-8 sm:px-6"
            >
                <p class="text-sm leading-5 text-slate-500">
                    Select a service to get started. Your selections will appear
                    here.
                </p>
            </div>

            <!-- Selected services -->
            <ul
                v-else
                class="divide-y divide-slate-100 border-t border-slate-100"
            >
                <li
                    v-for="line in cart.lines.value"
                    :key="line.service.id"
                    class="px-5 py-4 sm:px-6"
                >
                    <div class="flex items-start gap-3">
                        <div class="min-w-0 flex-1">
                            <p class="text-sm font-medium text-slate-950">
                                {{ line.service.name }}
                            </p>

                            <div
                                class="mt-1 flex items-center gap-1.5 text-xs text-slate-400"
                            >
                                <Clock3
                                    class="h-3.5 w-3.5"
                                    stroke-width="1.7"
                                />

                                {{
                                    formatDuration(line.service.durationMinutes)
                                }}
                            </div>
                        </div>

                        <div class="flex shrink-0 items-center gap-3">
                            <span class="text-sm font-semibold text-slate-950">
                                R{{ line.service.price }}
                            </span>

                            <button
                                type="button"
                                :aria-label="`Remove ${line.service.name}`"
                                class="flex h-7 w-7 items-center justify-center text-slate-400 transition-colors hover:text-slate-950"
                                @click="cart.remove(line.service.id)"
                            >
                                <X class="h-4 w-4" stroke-width="1.8" />
                            </button>
                        </div>
                    </div>
                </li>
            </ul>
        </div>

        <!-- Summary -->
        <div
            v-if="cart.lines.value.length"
            class="border-t border-slate-100 px-5 py-5 sm:px-6"
        >
            <div class="space-y-2">
                <div class="flex items-center justify-between text-sm">
                    <span class="text-slate-500"> Duration </span>

                    <span class="font-medium text-slate-950">
                        {{ formatDuration(cart.totalDuration.value) }}
                    </span>
                </div>

                <div class="flex items-center justify-between">
                    <span class="text-sm font-semibold text-slate-950">
                        Total
                    </span>

                    <span
                        class="text-lg font-semibold tracking-tight text-slate-950"
                    >
                        R{{ cart.total.value }}
                    </span>
                </div>
            </div>

            <button
                type="button"
                class="mt-5 flex h-12 w-full items-center justify-center gap-2 bg-slate-950 px-5 text-sm font-semibold text-white transition-colors hover:bg-primary"
                @click="emit('continue')"
            >
                Choose date & time

                <ArrowRight class="h-4 w-4" stroke-width="1.8" />
            </button>

            <p class="mt-3 text-center text-xs leading-5 text-slate-400">
                You'll choose your preferred date and time next.
            </p>
        </div>
    </aside>
</template>
