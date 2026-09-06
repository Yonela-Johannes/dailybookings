<script setup lang="ts">
import { computed, ref } from "vue";
import { ArrowRight, ChevronDown, Clock3, Sparkles } from "lucide-vue-next";
import type { VenueServiceCategory } from "~/types/venue";

const props = defineProps<{
    categories: VenueServiceCategory[];
}>();

const emit = defineEmits<{
    book: [serviceId: string];
}>();

const activeId = ref(props.categories[0]?.id);

const active = computed(() => {
    return (
        props.categories.find((category) => category.id === activeId.value) ??
        props.categories[0]
    );
});

const expandedServices = ref<string[]>([]);

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

function formatPrice(service: VenueServiceCategory["services"][number]) {
    const amount = `R${service.price}`;

    return service.priceIsFrom ? `From ${amount}` : amount;
}

function toggleDescription(serviceId: string) {
    if (expandedServices.value.includes(serviceId)) {
        expandedServices.value = expandedServices.value.filter(
            (id) => id !== serviceId,
        );
        return;
    }

    expandedServices.value.push(serviceId);
}

function isExpanded(serviceId: string) {
    return expandedServices.value.includes(serviceId);
}
</script>

<template>
    <section
        aria-labelledby="services-heading"
        class="border-t border-slate-200 pt-10 sm:pt-12"
    >
        <!-- Heading -->
        <div class="mb-8">
            <p
                class="text-xs font-semibold uppercase tracking-[0.18em] text-primary"
            >
                Services
            </p>

            ```
            <h2
                id="services-heading"
                class="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl"
            >
                Book a service
            </h2>

            <p
                class="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-[15px]"
            >
                Choose the service that works for you and continue to select
                your preferred date and time.
            </p>
        </div>

        <!-- Categories -->
        <div
            v-if="categories.length > 1"
            class="-mx-4 mb-7 overflow-x-auto border-b border-slate-200 px-4 scrollbar-none sm:mx-0 sm:px-0"
        >
            <div
                class="flex min-w-max"
                role="tablist"
                aria-label="Service categories"
            >
                <button
                    v-for="category in categories"
                    :key="category.id"
                    type="button"
                    role="tab"
                    :aria-selected="category.id === active?.id"
                    class="relative mr-7 shrink-0 px-0.5 pb-4 text-sm font-medium transition-colors"
                    :class="
                        category.id === active?.id
                            ? 'text-slate-950'
                            : 'text-slate-400 hover:text-slate-700'
                    "
                    @click="activeId = category.id"
                >
                    {{ category.name }}

                    <span
                        class="absolute inset-x-0 bottom-0 h-0.5 transition-opacity"
                        :class="
                            category.id === active?.id
                                ? 'bg-primary opacity-100'
                                : 'opacity-0'
                        "
                    />
                </button>
            </div>
        </div>

        <!-- Category heading -->
        <div v-if="active" class="mb-2 flex items-end justify-between gap-4">
            <div>
                <h3 class="text-base font-semibold text-slate-950">
                    {{ active.name }}
                </h3>

                <p class="mt-1 text-sm text-slate-400">
                    {{ active.services.length }}
                    service{{ active.services.length === 1 ? "" : "s" }}
                </p>
            </div>
        </div>

        <!-- Service list -->
        <div
            v-if="active?.services.length"
            class="divide-y divide-slate-200 border-y border-slate-200"
        >
            <article
                v-for="service in active.services"
                :key="service.id"
                class="py-5 sm:py-6"
            >
                <div class="flex items-start gap-5">
                    <div class="min-w-0 flex-1">
                        <div
                            class="flex flex-wrap items-center gap-x-2 gap-y-1"
                        >
                            <h4
                                class="text-[15px] font-semibold text-slate-950 sm:text-base"
                            >
                                {{ service.name }}
                            </h4>

                            <span
                                v-if="service.popular"
                                class="inline-flex items-center gap-1 text-xs font-medium text-primary"
                            >
                                <Sparkles
                                    class="h-3.5 w-3.5"
                                    stroke-width="1.8"
                                />
                                Popular
                            </span>
                        </div>

                        <!-- Description -->
                        <div v-if="service.description" class="mt-1.5 max-w-xl">
                            <p
                                class="text-sm leading-5 text-slate-500"
                                :class="{
                                    'line-clamp-2': !isExpanded(service.id),
                                }"
                            >
                                {{ service.description }}
                            </p>

                            <button
                                type="button"
                                class="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-slate-700 transition-colors hover:text-slate-950"
                                :aria-expanded="isExpanded(service.id)"
                                @click="toggleDescription(service.id)"
                            >
                                {{
                                    isExpanded(service.id)
                                        ? "Show less"
                                        : "More details"
                                }}

                                <ChevronDown
                                    class="h-3.5 w-3.5 transition-transform"
                                    :class="{
                                        'rotate-180': isExpanded(service.id),
                                    }"
                                    stroke-width="1.8"
                                />
                            </button>
                        </div>

                        <!-- Meta -->
                        <div
                            class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2"
                        >
                            <span
                                class="inline-flex items-center gap-1.5 text-xs text-slate-400"
                            >
                                <Clock3
                                    class="h-3.5 w-3.5"
                                    stroke-width="1.7"
                                />

                                {{ formatDuration(service.durationMinutes) }}
                            </span>

                            <span class="text-sm font-semibold text-slate-950">
                                {{ formatPrice(service) }}
                            </span>
                        </div>
                    </div>

                    <!-- Book -->
                    <button
                        type="button"
                        class="hidden h-10 shrink-0 items-center justify-center gap-2 border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-950 transition-colors hover:border-slate-950 hover:bg-slate-950 hover:text-white sm:flex"
                        @click="emit('book', service.id)"
                    >
                        Book

                        <ArrowRight class="h-4 w-4" stroke-width="1.8" />
                    </button>

                    <button
                        type="button"
                        class="flex h-10 w-10 shrink-0 items-center justify-center border border-slate-300 bg-white text-slate-950 transition-colors hover:border-slate-950 hover:bg-slate-950 hover:text-white sm:hidden"
                        :aria-label="`Book ${service.name}`"
                        @click="emit('book', service.id)"
                    >
                        <ArrowRight class="h-4 w-4" stroke-width="1.8" />
                    </button>
                </div>
            </article>
        </div>

        <!-- Empty -->
        <div v-else class="border-y border-slate-200 py-12 text-center">
            <p class="text-sm text-slate-500">
                No services are available in this category right now.
            </p>
        </div>
    </section>
</template>
