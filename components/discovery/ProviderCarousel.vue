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
    tag?: "Featured" | "Best in Class" | "Trending" | "New" | null;
    verified?: boolean;
}

const props = defineProps<{
    title: string;
    items: Provider[];
}>();

const { toggleFavorite, isFavorite } = useFavorites();
const { toggleLike, isLiked } = useLikes();

const scrollerRef = ref<HTMLElement | null>(null);

const canScrollPrev = ref(false);
const canScrollNext = ref(false);
const isDragging = ref(false);

const startX = ref(0);
const startScrollLeft = ref(0);

let resizeObserver: ResizeObserver | null = null;

const updateScrollState = () => {
    const el = scrollerRef.value;

    if (!el) return;

    const maxScroll = el.scrollWidth - el.clientWidth;

    canScrollPrev.value = el.scrollLeft > 2;
    canScrollNext.value = el.scrollLeft < maxScroll - 2;
};

const getCardWidth = () => {
    const el = scrollerRef.value;

    if (!el) return 280;

    const card = el.querySelector<HTMLElement>("[data-provider-card]");

    if (!card) {
        return el.clientWidth * 0.8;
    }

    const styles = window.getComputedStyle(el);
    const gap = parseFloat(styles.columnGap || styles.gap || "0");

    return card.offsetWidth + gap;
};

const scrollToCard = (direction: "prev" | "next") => {
    const el = scrollerRef.value;

    if (!el) return;

    const amount = getCardWidth() * (direction === "next" ? 1 : -1);

    el.scrollBy({
        left: amount,
        behavior: "smooth",
    });
};

const handleFavorite = async (id: string | number) => {
    try {
        await toggleFavorite(String(id));
    } catch {
        //
    }
};

const handleLike = async (id: string | number) => {
    try {
        await toggleLike(String(id));
    } catch {
        //
    }
};

const handlePointerDown = (event: PointerEvent) => {
    const el = scrollerRef.value;

    if (!el || event.pointerType === "touch") return;

    isDragging.value = true;
    startX.value = event.clientX;
    startScrollLeft.value = el.scrollLeft;

    el.setPointerCapture?.(event.pointerId);
};

const handlePointerMove = (event: PointerEvent) => {
    const el = scrollerRef.value;

    if (!el || !isDragging.value) return;

    const distance = event.clientX - startX.value;

    el.scrollLeft = startScrollLeft.value - distance;
};

const handlePointerUp = (event: PointerEvent) => {
    const el = scrollerRef.value;

    if (!el) return;

    isDragging.value = false;
    el.releasePointerCapture?.(event.pointerId);
};

const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === "ArrowRight") {
        event.preventDefault();
        scrollToCard("next");
    }

    if (event.key === "ArrowLeft") {
        event.preventDefault();
        scrollToCard("prev");
    }
};

onMounted(async () => {
    await nextTick();

    updateScrollState();

    const el = scrollerRef.value;

    if (!el) return;

    el.addEventListener("scroll", updateScrollState, {
        passive: true,
    });

    el.addEventListener("keydown", handleKeydown);

    resizeObserver = new ResizeObserver(() => {
        updateScrollState();
    });

    resizeObserver.observe(el);
});

onBeforeUnmount(() => {
    const el = scrollerRef.value;

    el?.removeEventListener("scroll", updateScrollState);
    el?.removeEventListener("keydown", handleKeydown);

    resizeObserver?.disconnect();
});
</script>

<template>
    <section class="w-full overflow-hidden">
        <div
            class="mx-auto flex max-w-7xl items-end justify-between px-4 sm:px-6 lg:px-8"
        >
            <div class="min-w-0">
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

            <div class="hidden items-center gap-2 md:flex">
                <button
                    type="button"
                    aria-label="Previous providers"
                    :disabled="!canScrollPrev"
                    class="flex h-10 w-10 items-center justify-center border border-slate-200 bg-white text-slate-900 transition-all duration-200 hover:border-slate-400 hover:bg-slate-50 active:scale-95 disabled:pointer-events-none disabled:opacity-30"
                    @click="scrollToCard('prev')"
                >
                    <ChevronLeft class="h-4 w-4" />
                </button>

                <button
                    type="button"
                    aria-label="Next providers"
                    :disabled="!canScrollNext"
                    class="flex h-10 w-10 items-center justify-center border border-slate-200 bg-white text-slate-900 transition-all duration-200 hover:border-slate-400 hover:bg-slate-50 active:scale-95 disabled:pointer-events-none disabled:opacity-30"
                    @click="scrollToCard('next')"
                >
                    <ChevronRight class="h-4 w-4" />
                </button>
            </div>
        </div>

        <div class="relative mt-6 overflow-hidden">
            <div
                ref="scrollerRef"
                class="carousel-scroller flex cursor-grab gap-5 overflow-x-auto overscroll-x-contain px-4 pb-3 select-none snap-x snap-mandatory scroll-px-4 scroll-smooth [scrollbar-width:none] sm:px-6 sm:scroll-px-6 lg:px-[max(2rem,calc((100vw-80rem)/2))] lg:scroll-px-[max(2rem,calc((100vw-80rem)/2))] [&::-webkit-scrollbar]:hidden"
                :class="{ 'cursor-grabbing': isDragging }"
                tabindex="0"
                @pointerdown="handlePointerDown"
                @pointermove="handlePointerMove"
                @pointerup="handlePointerUp"
                @pointercancel="handlePointerUp"
            >
                <div
                    v-for="item in props.items"
                    :key="item.id"
                    data-provider-card
                    class="w-[250px] shrink-0 snap-start sm:w-[270px] lg:w-[calc((min(80rem,100vw)-3.75rem)/4)]"
                >
                    <ProviderCard
                        :provider="item"
                        :is-favorite="isFavorite(String(item.id))"
                        :is-liked="isLiked(String(item.id))"
                        @favorite="handleFavorite"
                        @like="handleLike"
                    />
                </div>

                <div aria-hidden="true" class="w-1 shrink-0 lg:w-2" />
            </div>

            <Transition
                enter-active-class="transition-opacity duration-200"
                leave-active-class="transition-opacity duration-200"
                enter-from-class="opacity-0"
                leave-to-class="opacity-0"
            >
                <div
                    v-if="canScrollPrev"
                    class="pointer-events-none absolute inset-y-0 left-0 hidden w-16 bg-gradient-to-r from-white via-white/70 to-transparent lg:block"
                />
            </Transition>

            <Transition
                enter-active-class="transition-opacity duration-200"
                leave-active-class="transition-opacity duration-200"
                enter-from-class="opacity-0"
                leave-to-class="opacity-0"
            >
                <div
                    v-if="canScrollNext"
                    class="pointer-events-none absolute inset-y-0 right-0 hidden w-16 bg-gradient-to-l from-white via-white/70 to-transparent lg:block"
                />
            </Transition>
        </div>
    </section>
</template>

<style scoped>
.carousel-scroller {
    touch-action: pan-x;
    -webkit-overflow-scrolling: touch;
}

.carousel-scroller:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: -2px;
}
</style>
