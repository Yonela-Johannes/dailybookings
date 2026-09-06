<script setup lang="ts">
import { computed } from "vue";
import {
    CalendarCheck,
    ChevronDown,
    Clock3,
    MapPin,
    ShieldCheck,
} from "lucide-vue-next";
import StarRating from "./StarRating.vue";
import type { Venue } from "~/types/venue";

const props = defineProps<{
    venue: Venue;
}>();

const emit = defineEmits<{
    book: [];
}>();

const hoursOpen = ref(false);

const todayIndex = computed(() => {
    const day = new Date().getDay();
    return day === 0 ? 6 : day - 1;
});

const today = computed(() => props.venue.hours?.[todayIndex.value]);

const todayLabel = computed(() => {
    if (!today.value || today.value.closed) {
        return "Closed today";
    }

    return `Open today · ${today.value.opens} – ${today.value.closes}`;
});

const serviceCount = computed(
    () =>
        props.venue.serviceCategories?.reduce(
            (total, category) => total + category.services.length,
            0,
        ) ?? 0,
);
</script>

<template>
    <aside class="border border-slate-200 bg-white">
        <!-- Booking header -->
        <div class="p-6">
            <div class="flex items-start justify-between gap-4">
                <div>
                    <p
                        class="text-xs font-semibold uppercase tracking-[0.14em] text-primary"
                    >
                        Book with us
                    </p>

                    <h2
                        class="mt-2 text-xl font-semibold tracking-tight text-slate-950"
                    >
                        {{ venue.name }}
                    </h2>
                </div>

                <div
                    v-if="venue.verified"
                    class="flex h-8 w-8 shrink-0 items-center justify-center border border-slate-200"
                    title="Verified business"
                >
                    <ShieldCheck
                        class="h-4 w-4 text-primary"
                        stroke-width="1.8"
                    />
                </div>
            </div>

            <!-- Rating -->
            <div class="mt-4 flex items-center gap-2">
                <StarRating :rating="venue.rating" show-value size="sm" />

                <span class="text-sm text-slate-400">
                    {{ venue.reviewCount }} reviews
                </span>
            </div>

            <!-- Quick information -->
            <div class="mt-6 space-y-3 border-t border-slate-100 pt-5">
                <div class="flex items-center gap-3 text-sm">
                    <CalendarCheck
                        class="h-4 w-4 shrink-0 text-slate-400"
                        stroke-width="1.7"
                    />

                    <span class="text-slate-600">
                        {{ serviceCount }} services available
                    </span>
                </div>

                <div class="flex items-center gap-3 text-sm">
                    <Clock3
                        class="h-4 w-4 shrink-0 text-slate-400"
                        stroke-width="1.7"
                    />

                    <span
                        :class="
                            today?.closed ? 'text-slate-400' : 'text-slate-600'
                        "
                    >
                        {{ todayLabel }}
                    </span>
                </div>

                <div class="flex items-start gap-3 text-sm">
                    <MapPin
                        class="mt-0.5 h-4 w-4 shrink-0 text-slate-400"
                        stroke-width="1.7"
                    />

                    <span class="leading-5 text-slate-600">
                        {{ venue.address.suburb }},
                        {{ venue.address.city }}
                    </span>
                </div>
            </div>

            <!-- CTA -->
            <button
                type="button"
                class="mt-6 flex h-12 w-full items-center justify-center gap-2 bg-slate-950 px-5 text-sm font-semibold text-white transition-colors hover:bg-primary"
                @click="emit('book')"
            >
                Book now

                <CalendarCheck class="h-4 w-4" stroke-width="1.8" />
            </button>

            <p class="mt-3 text-center text-xs text-slate-400">
                Choose your service, date and time next
            </p>
        </div>

        <!-- Hours -->
        <div class="border-t border-slate-100">
            <button
                type="button"
                class="flex w-full items-center justify-between px-6 py-4 text-left"
                :aria-expanded="hoursOpen"
                @click="hoursOpen = !hoursOpen"
            >
                <span class="text-sm font-medium text-slate-950">
                    Opening hours
                </span>

                <ChevronDown
                    class="h-4 w-4 text-slate-400 transition-transform"
                    :class="{ 'rotate-180': hoursOpen }"
                    stroke-width="1.7"
                />
            </button>

            <div v-if="hoursOpen" class="border-t border-slate-100 px-6 py-4">
                <ul class="space-y-3">
                    <li
                        v-for="row in venue.hours"
                        :key="row.day"
                        class="flex items-center justify-between text-sm"
                    >
                        <span
                            :class="
                                row.closed ? 'text-slate-400' : 'text-slate-600'
                            "
                        >
                            {{ row.day }}
                        </span>

                        <span
                            :class="
                                row.closed
                                    ? 'text-slate-400'
                                    : 'font-medium text-slate-950'
                            "
                        >
                            {{
                                row.closed
                                    ? "Closed"
                                    : `${row.opens} – ${row.closes}`
                            }}
                        </span>
                    </li>
                </ul>
            </div>
        </div>

        <!-- Address -->
        <div class="border-t border-slate-100 p-6">
            <div class="flex items-start gap-3">
                <MapPin
                    class="mt-0.5 h-4 w-4 shrink-0 text-slate-400"
                    stroke-width="1.7"
                />

                <div>
                    <p class="text-sm leading-5 text-slate-600">
                        {{ venue.address.street }}<br />
                        {{ venue.address.suburb }},
                        {{ venue.address.city }}
                    </p>

                    <a
                        :href="`https://maps.google.com/?q=${venue.address.lat},${venue.address.lng}`"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="mt-3 inline-block text-sm font-medium text-slate-950 underline decoration-slate-300 underline-offset-4 hover:decoration-primary"
                    >
                        Get directions
                    </a>
                </div>
            </div>
        </div>
    </aside>
</template>
