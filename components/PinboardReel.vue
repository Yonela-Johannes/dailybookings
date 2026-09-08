<script setup lang="ts">
interface Category {
    name: string;
    imageUrl: string;
    available?: boolean;
}

const props = withDefaults(
    defineProps<{
        categories: Category[];
        heading?: string;
        duration?: number;
    }>(),
    {
        heading: "What are you looking for today?",
        duration: 32,
    },
);

const loopedCategories = computed(() => [
    ...props.categories,
    ...props.categories,
]);

const tiltClasses = [
    "-rotate-3",
    "rotate-2",
    "-rotate-1",
    "rotate-2",
    "-rotate-2",
    "rotate-1",
];

const tapeClasses = ["bg-tape-mustard", "bg-tape-teal", "bg-tape-plum"];

function tiltFor(index: number) {
    return tiltClasses[index % tiltClasses.length];
}

function tapeFor(index: number) {
    return tapeClasses[index % tapeClasses.length];
}
</script>

<template>
    <section
        aria-label="Browse service categories"
        class="w-full overflow-hidden py-14 md:py-20"
    >
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div class="mb-8 md:mb-10">
                <p
                    class="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-primary"
                >
                    Explore
                </p>

                <h2
                    class="font-caveat text-3xl font-bold leading-tight tracking-tight text-slate-950 md:text-4xl"
                >
                    {{ heading }}
                </h2>
            </div>
        </div>

        <div class="relative w-full overflow-hidden">
            <div class="category-marquee">
                <div
                    class="category-track flex w-max gap-5 pr-5 md:gap-6 md:pr-6"
                    :style="{ '--marquee-duration': `${duration}s` }"
                >
                    <a
                        v-for="(category, index) in loopedCategories"
                        :key="`${category.name}-${index}`"
                        href="#"
                        :aria-hidden="
                            index >= props.categories.length
                                ? 'true'
                                : undefined
                        "
                        :tabindex="index >= props.categories.length ? -1 : 0"
                        class="category-card group relative block w-[180px] shrink-0 rounded-sm bg-[#f7f2e7] p-3 pb-4 text-[#2b2015] no-underline shadow-[0_2px_10px_rgba(0,0,0,0.06)] transition-transform duration-300 ease-out hover:z-30 hover:-translate-y-2 hover:scale-[1.035] hover:rotate-0 focus-visible:z-30 focus-visible:-translate-y-2 focus-visible:scale-[1.035] focus-visible:rotate-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary md:w-[230px]"
                        :class="tiltFor(index)"
                    >
                        <!-- Tape -->
                        <span
                            class="absolute -top-3 left-1/2 z-20 h-[26px] w-16 -translate-x-1/2 rotate-[-4deg] rounded-[1px] opacity-90 shadow-[0_2px_4px_rgba(0,0,0,.2)]"
                            :class="tapeFor(index)"
                        />

                        <div
                            class="relative aspect-[4/3] w-full overflow-hidden rounded-[1px] bg-[#ddd6c6]"
                        >
                            <img
                                :src="
                                    category.imageUrl || '/img/placeholder.jpg'
                                "
                                :alt="
                                    index < props.categories.length
                                        ? category.name
                                        : ''
                                "
                                loading="lazy"
                                draggable="false"
                                class="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                            />

                            <div
                                class="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/[0.03]"
                            />
                        </div>

                        <!-- Content -->
                        <span
                            class="mt-3 block truncate font-caveat text-2xl font-semibold leading-tight"
                        >
                            {{ category.name }}
                        </span>

                        <span
                            v-if="category.available"
                            class="mt-0.5 block text-[11px] font-medium text-[#5a4c39]"
                        >
                            Available online
                        </span>
                    </a>
                </div>
            </div>

            <div
                class="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-12 bg-gradient-to-r from-white to-transparent md:block"
            />

            <div
                class="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-12 bg-gradient-to-l from-white to-transparent md:block"
            />
        </div>
    </section>
</template>

<style scoped>
.category-marquee {
    width: 100%;
    overflow: hidden;
}

.category-track {
    animation: category-marquee var(--marquee-duration) linear infinite;
    will-change: transform;
    transform: translate3d(0, 0, 0);
}

.category-marquee:hover .category-track {
    animation-play-state: paused;
}

.category-card {
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
}

@keyframes category-marquee {
    from {
        transform: translate3d(0, 0, 0);
    }

    to {
        transform: translate3d(calc(-50% - 0.625rem), 0, 0);
    }
}

@media (min-width: 768px) {
    @keyframes category-marquee {
        from {
            transform: translate3d(0, 0, 0);
        }

        to {
            transform: translate3d(calc(-50% - 0.75rem), 0, 0);
        }
    }
}

@media (prefers-reduced-motion: reduce) {
    .category-track {
        animation: none;
        overflow-x: auto;
    }
}
</style>
