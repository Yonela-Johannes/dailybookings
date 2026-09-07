<script setup lang="ts">
import { ChevronLeft, ChevronRight, Images } from "lucide-vue-next";

import type { Media } from "~/types/venue";

const props = defineProps<{
    images: Media[];
}>();

const emit = defineEmits<{
    open: [index: number];
}>();

const visibleImages = computed(() => props.images.slice(0, 5));

function openGallery(index = 0) {
    emit("open", index);
}
</script>

<template>
    <section
        v-if="visibleImages.length"
        class="group relative"
        aria-label="Venue photos"
    >
        <!-- Desktop -->
        <div
            class="hidden overflow-hidden rounded-2xl bg-slate-100 sm:grid sm:h-[460px] sm:grid-cols-2 sm:grid-rows-2 sm:gap-2 lg:h-[520px]"
        >
            <!-- Main image -->
            <button
                type="button"
                class="group/main relative row-span-2 overflow-hidden text-left"
                @click="openGallery(0)"
            >
                <img
                    :src="visibleImages[0]?.url || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200'"
                    :alt="visibleImages[0]?.alt || ''"
                    class="h-full w-full object-cover transition-transform duration-700 group-hover/main:scale-[1.02]"
                />

                <div
                    class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-60"
                />
            </button>

            <button
                v-for="(image, index) in visibleImages.slice(1, 5)"
                :key="image.id || image.url"
                type="button"
                class="group/image relative overflow-hidden text-left"
                @click="openGallery(index + 1)"
            >
                <img
                    :src="image.url"
                    :alt="image.alt || ''"
                    class="h-full w-full object-cover transition-transform duration-700 group-hover/image:scale-[1.03]"
                />

                <div
                    class="absolute inset-0 bg-black/0 transition-colors group-hover/image:bg-black/10"
                />

                <!-- Last image -->
                <div
                    v-if="
                        index === visibleImages.slice(1, 5).length - 1 &&
                        images.length > 5
                    "
                    class="absolute inset-0 flex items-center justify-center bg-black/25"
                >
                    <span
                        class="inline-flex items-center gap-2 border border-white/40 bg-black/40 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm"
                    >
                        <Images class="h-4 w-4" />
                        View all {{ images.length }} photos
                    </span>
                </div>
            </button>
        </div>

        <!-- Mobile -->
        <div class="sm:hidden">
            <button
                type="button"
                class="relative block aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-100"
                @click="openGallery(0)"
            >
                <img
                    :src="visibleImages[0]?.url"
                    :alt="visibleImages[0]?.alt || ''"
                    class="h-full w-full object-cover"
                />

                <div
                    class="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/60 to-transparent px-4 pb-4 pt-12"
                >
                    <span
                        class="inline-flex items-center gap-2 border border-white/30 bg-black/30 px-3 py-2 text-xs font-medium text-white backdrop-blur-sm"
                    >
                        <Images class="h-3.5 w-3.5" />
                        {{ images.length }} photos
                    </span>

                    <span class="text-xs font-medium text-white">
                        View gallery
                    </span>
                </div>
            </button>

            <div
                v-if="visibleImages.length > 1"
                class="mt-2 grid grid-cols-4 gap-2"
            >
                <button
                    v-for="(image, index) in visibleImages.slice(1, 5)"
                    :key="image.id || image.url"
                    type="button"
                    class="aspect-square overflow-hidden rounded-xl bg-slate-100"
                    @click="openGallery(index + 1)"
                >
                    <img
                        :src="image.url"
                        :alt="image.alt || ''"
                        class="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                </button>
            </div>
        </div>
    </section>
</template>
