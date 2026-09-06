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
        duration: 300,
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
        class="relative overflow-hidden py-16 md:py-[72px]"
    >
        <h2
            class="relative z-20 mb-10 text-center font-caveat text-3xl md:text-4xl font-bold text-[#f7f2e7]"
        >
            {{ heading }}
        </h2>

        <div class="group overflow-hidden">
            <div
                class="animate-marquee flex w-max gap-6 md:gap-[26px] group-hover:[animation-play-state:paused]"
                :style="{ animationDuration: `${duration}s` }"
            >
                <a
                    v-for="(category, index) in loopedCategories"
                    :key="`${category.name}-${index}`"
                    href="#"
                    :aria-hidden="
                        index >= props.categories.length ? 'true' : undefined
                    "
                    :tabindex="index >= props.categories.length ? -1 : 0"
                    class="relative block w-[180px] md:w-[230px] shrink-0 rounded-sm p-3 pb-[18px] text-[#2b2015] no-underline transition-transform duration-200 ease-out hover:z-30 hover:-translate-y-1.5 hover:scale-[1.035] hover:rotate-0 focus-visible:z-30 focus-visible:-translate-y-1.5 focus-visible:scale-[1.035] focus-visible:rotate-0 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-tape-teal"
                    :class="tiltFor(index)"
                >
                    <span
                        class="absolute -top-3 left-1/2 h-[26px] w-16 -translate-x-1/2 rotate-[-4deg] rounded-[1px] opacity-90 shadow-[0_2px_4px_rgba(0,0,0,.25)]"
                        :class="tapeFor(index)"
                    />

                    <img
                        :src="category.imageUrl || '/img/placeholder.jpg'"
                        :alt="
                            index < props.categories.length ? category.name : ''
                        "
                        loading="lazy"
                        class="block aspect-[4/3] w-full rounded-[1px] bg-[#ddd6c6] object-cover [filter:saturate(0.94)_contrast(1.02)]"
                    />

                    <span
                        class="mt-3 block font-caveat text-2xl font-semibold leading-tight"
                    >
                        {{ category.name }}
                    </span>

                    <span
                        v-if="category.available"
                        class="mt-0.5 block text-[0.72rem] font-medium text-[#5a4c39]"
                    >
                        Available online
                    </span>
                </a>
            </div>
        </div>
    </section>
</template>

<style scoped>
@keyframes marquee {
    from {
        transform: translateX(0);
    }
    to {
        transform: translateX(calc(-50% - 13px));
    }
}

.animate-marquee {
    animation-name: marquee;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
}

@media (prefers-reduced-motion: reduce) {
    .animate-marquee {
        animation: none;
        overflow-x: auto;
        scroll-snap-type: x proximity;
    }
    .animate-marquee > a {
        scroll-snap-align: start;
    }
}
</style>
