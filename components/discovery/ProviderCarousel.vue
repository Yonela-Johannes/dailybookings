<script setup lang="ts">
import { ChevronLeft, ChevronRight } from "lucide-vue-next";
import { nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import ProviderCard from "./ProviderCard.vue";

interface Provider {
    id: string | number;
    slug: string;
    name: string;
    image: string;
    alt: string;
    rating: number;
    location: string;
    category: string;
    reviews: number;
    tag?: "Featured" | "Best in Class" | null;
    verified?: boolean;
}

const props = defineProps<{
    title: string;
    items: Provider[];
}>();

const scrollerRef = ref<HTMLElement | null>(null);

const canScrollPrev = ref(false);
const canScrollNext = ref(false);

const updateScrollState = () => {
    const el = scrollerRef.value;

    if (!el) return;

    canScrollPrev.value = el.scrollLeft > 4;

    canScrollNext.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 4;
};

const scrollByAmount = (direction: "prev" | "next") => {
    const el = scrollerRef.value;

    if (!el) return;

    const amount = el.clientWidth * 0.82 * (direction === "next" ? 1 : -1);

    el.scrollBy({
        left: amount,
        behavior: "smooth",
    });
};

const handleFavorite = (id: string | number) => {
    console.log("favorite toggled:", id);

    // Connect to your favorites API/composable here.
};

let resizeObserver: ResizeObserver | null = null;

onMounted(async () => {
    await nextTick();

    updateScrollState();

    scrollerRef.value?.addEventListener("scroll", updateScrollState, {
        passive: true,
    });

    resizeObserver = new ResizeObserver(updateScrollState);

    if (scrollerRef.value) {
        resizeObserver.observe(scrollerRef.value);
    }
});

onBeforeUnmount(() => {
    scrollerRef.value?.removeEventListener("scroll", updateScrollState);

    resizeObserver?.disconnect();
});
</script>

<template>
    <section class="w-full">
        <!-- HEADER -->
        <div
            class="mx-auto flex max-w-7xl items-end justify-between px-4 sm:px-6 lg:px-8"
        >
            <div>
                <p
                    class="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-primary"
                >
                    Discover
                </p>

                <h2
                    class="text-2xl font-bold tracking-tight text-slate-950 md:text-3xl"
                >
                    {{ props.title }}
                </h2>
            </div>

            <!-- DESKTOP CONTROLS -->
            <div class="hidden items-center gap-2 md:flex">
                <button
                    type="button"
                    aria-label="Previous providers"
                    :disabled="!canScrollPrev"
                    class="flex h-10 w-10 items-center justify-center border border-slate-200 bg-white text-slate-900 transition-colors hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-30"
                    @click="scrollByAmount('prev')"
                >
                    <ChevronLeft class="h-4 w-4" />
                </button>

                <button
                    type="button"
                    aria-label="Next providers"
                    :disabled="!canScrollNext"
                    class="flex h-10 w-10 items-center justify-center border border-slate-200 bg-white text-slate-900 transition-colors hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-30"
                    @click="scrollByAmount('next')"
                >
                    <ChevronRight class="h-4 w-4" />
                </button>
            </div>
        </div>

        <!-- CAROUSEL -->
        <div class="relative mt-6">
            <div
                ref="scrollerRef"
                class="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-4 pb-3 [scrollbar-width:none] sm:px-6 lg:px-[max(2rem,calc((100vw-80rem)/2))] [&::-webkit-scrollbar]:hidden"
            >
                <div
                    v-for="item in props.items"
                    :key="item.id"
                    class="w-[250px] shrink-0 snap-start sm:w-[270px] lg:w-[calc((min(80rem,100vw)-3.75rem)/4)]"
                >
                    <ProviderCard :provider="item" @favorite="handleFavorite" />
                </div>
            </div>

            <!-- LEFT FADE -->
            <div
                v-if="canScrollPrev"
                class="pointer-events-none absolute bottom-0 left-0 top-0 hidden w-12 bg-gradient-to-r from-white to-transparent lg:block"
            />

            <!-- RIGHT FADE -->
            <div
                v-if="canScrollNext"
                class="pointer-events-none absolute bottom-0 right-0 top-0 hidden w-12 bg-gradient-to-l from-white to-transparent lg:block"
            />
        </div>
    </section>
</template>
