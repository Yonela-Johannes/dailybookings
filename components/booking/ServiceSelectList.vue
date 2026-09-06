<script setup lang="ts">
import { computed, ref } from "vue";
import type { VenueServiceCategory } from "~/types/venue";
import { useBookingCart } from "~/composables/useBookingCart";
import ServiceSelectCard from "./ServiceSelectCard.vue";

const props = defineProps<{
    categories: VenueServiceCategory[];
}>();

const cart = useBookingCart();

const activeId = ref(props.categories[0]?.id);

const activeCategory = computed(() => {
    return (
        props.categories.find((category) => category.id === activeId.value) ??
        props.categories[0]
    );
});

function selectCategory(id: string) {
    activeId.value = id;
}
</script>

<template>
    <div class="space-y-6">
        <!-- Category navigation -->
        <div
            class="sticky top-16 z-20 -mx-4 border-b border-slate-200 bg-slate-50/95 px-4 backdrop-blur sm:top-[65px] sm:mx-0 sm:px-0"
        >
            <div
                class="flex overflow-x-auto scrollbar-none"
                role="tablist"
                aria-label="Service categories"
            >
                <button
                    v-for="category in categories"
                    :key="category.id"
                    type="button"
                    role="tab"
                    :aria-selected="category.id === activeId"
                    class="relative shrink-0 px-1 py-4 mr-7 text-sm font-medium transition-colors"
                    :class="
                        category.id === activeId
                            ? 'text-slate-950'
                            : 'text-slate-400 hover:text-slate-700'
                    "
                    @click="selectCategory(category.id)"
                >
                    {{ category.name }}

                    <span
                        class="absolute inset-x-0 bottom-0 h-0.5 transition-opacity"
                        :class="
                            category.id === activeId
                                ? 'bg-primary opacity-100'
                                : 'opacity-0'
                        "
                    />
                </button>
            </div>
        </div>

        <!-- Selection summary -->
        <div
            v-if="cart.count.value"
            class="flex items-center justify-between border border-primary/20 bg-primary/5 px-4 py-3"
        >
            <p class="text-sm font-medium text-slate-950">
                {{ cart.count.value }}
                service{{ cart.count.value === 1 ? "" : "s" }} selected
            </p>

            <p class="text-sm font-semibold text-primary">
                R{{ cart.total.value }}
            </p>
        </div>

        <!-- Active category -->
        <section
            v-if="activeCategory"
            :aria-labelledby="`category-${activeCategory.id}`"
            class="space-y-3"
        >
            <div>
                <h2
                    :id="`category-${activeCategory.id}`"
                    class="text-lg font-semibold tracking-tight text-slate-950"
                >
                    {{ activeCategory.name }}
                </h2>

                <p class="mt-1 text-sm text-slate-500">
                    {{ activeCategory.services.length }}
                    service{{ activeCategory.services.length === 1 ? "" : "s" }}
                </p>
            </div>

            <div class="divide-y divide-slate-200 border-y border-slate-200">
                <ServiceSelectCard
                    v-for="service in activeCategory.services"
                    :key="service.id"
                    :service="service"
                    :selected="cart.isSelected(service.id)"
                    @toggle="cart.toggle(service)"
                />
            </div>
        </section>

        <!-- Empty state -->
        <div v-else class="border-y border-slate-200 py-12 text-center">
            <p class="text-sm text-slate-500">
                No services are available right now.
            </p>
        </div>
    </div>
</template>
