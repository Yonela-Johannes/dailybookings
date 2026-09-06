<script setup lang="ts">
import {
    Check,
    Clock3,
    Mail,
    MapPin,
    Phone,
    ShieldCheck,
} from "lucide-vue-next";
import type { Venue } from "~/types/venue";

defineProps<{
    venue: Venue;
}>();
</script>

<template>
    <section
        aria-labelledby="about-heading"
        class="border-t border-slate-100 pt-10 lg:pt-12"
    >
        <!-- Heading -->
        <div class="mb-8">
            <p
                class="text-xs font-semibold uppercase tracking-[0.16em] text-primary"
            >
                About the business
            </p>

            <h2
                id="about-heading"
                class="mt-2 text-2xl font-semibold tracking-tight text-slate-950"
            >
                Get to know {{ venue.name }}
            </h2>
        </div>

        <!-- Description -->
        <div class="max-w-3xl">
            <p class="whitespace-pre-line text-[15px] leading-7 text-slate-600">
                {{ venue.description }}
            </p>
        </div>

        <!-- Amenities -->
        <div
            v-if="venue.amenities?.length"
            class="mt-10 border-t border-slate-100 pt-8"
        >
            <div class="flex items-center gap-2">
                <ShieldCheck class="h-4 w-4 text-primary" stroke-width="1.8" />

                <h3 class="text-sm font-semibold text-slate-950">
                    Good to know
                </h3>
            </div>

            <ul class="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2">
                <li
                    v-for="amenity in venue.amenities"
                    :key="amenity"
                    class="flex items-start gap-3 text-sm text-slate-600"
                >
                    <span
                        class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border border-slate-200"
                    >
                        <Check class="h-3 w-3 text-primary" stroke-width="2" />
                    </span>

                    <span>{{ amenity }}</span>
                </li>
            </ul>
        </div>

        <!-- Location + contact -->
        <div
            class="mt-10 grid gap-8 border-t border-slate-100 pt-8 sm:grid-cols-2"
        >
            <!-- Location -->
            <div>
                <div class="flex items-center gap-2">
                    <MapPin class="h-4 w-4 text-primary" stroke-width="1.8" />

                    <h3 class="text-sm font-semibold text-slate-950">
                        Location
                    </h3>
                </div>

                <address
                    class="mt-4 not-italic text-sm leading-6 text-slate-600"
                >
                    <p>{{ venue.address.street }}</p>
                    <p>
                        {{ venue.address.suburb }},
                        {{ venue.address.city }}
                    </p>
                    <p v-if="venue.address.region">
                        {{ venue.address.region }}
                    </p>
                </address>

                <a
                    :href="`https://maps.google.com/?q=${venue.address.lat},${venue.address.lng}`"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="mt-4 inline-flex items-center text-sm font-medium text-slate-950 underline decoration-slate-300 underline-offset-4 transition-colors hover:decoration-primary"
                >
                    Get directions
                </a>
            </div>

            <!-- Contact -->
            <div>
                <div class="flex items-center gap-2">
                    <Phone class="h-4 w-4 text-primary" stroke-width="1.8" />

                    <h3 class="text-sm font-semibold text-slate-950">
                        Contact
                    </h3>
                </div>

                <div class="mt-4 space-y-3 text-sm">
                    <a
                        v-if="venue.phone"
                        :href="`tel:${venue.phone}`"
                        class="flex items-center gap-3 text-slate-600 transition-colors hover:text-slate-950"
                    >
                        <Phone
                            class="h-4 w-4 text-slate-400"
                            stroke-width="1.7"
                        />

                        {{ venue.phone }}
                    </a>

                    <a
                        v-if="venue.email"
                        :href="`mailto:${venue.email}`"
                        class="flex items-center gap-3 text-slate-600 transition-colors hover:text-slate-950"
                    >
                        <Mail
                            class="h-4 w-4 text-slate-400"
                            stroke-width="1.7"
                        />

                        {{ venue.email }}
                    </a>
                </div>
            </div>
        </div>

        <!-- Hours -->
        <div
            v-if="venue.hours?.length"
            class="mt-10 border-t border-slate-100 pt-8"
        >
            <div class="flex items-center gap-2">
                <Clock3 class="h-4 w-4 text-primary" stroke-width="1.8" />

                <h3 class="text-sm font-semibold text-slate-950">
                    Opening hours
                </h3>
            </div>

            <div class="mt-5 max-w-xl">
                <div
                    v-for="row in venue.hours"
                    :key="row.day"
                    class="flex items-center justify-between border-b border-slate-100 py-3 text-sm last:border-0"
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
                                ? 'font-medium text-slate-400'
                                : 'font-medium text-slate-950'
                        "
                    >
                        {{
                            row.closed
                                ? "Closed"
                                : `${row.opens} – ${row.closes}`
                        }}
                    </span>
                </div>
            </div>
        </div>
    </section>
</template>
