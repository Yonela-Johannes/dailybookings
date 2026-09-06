<script setup lang="ts">
import { Heart, Star } from "lucide-vue-next";

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
    provider: Provider;
}>();

const emit = defineEmits<{
    favorite: [id: string | number];
}>();
</script>

<template>
    <article class="group relative min-w-0">
        <!-- IMAGE -->
        <div class="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
            <img
                :src="props.provider.image"
                :alt="props.provider.alt"
                loading="lazy"
                class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.025]"
            />

            <div
                class="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/35 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />

            <button
                type="button"
                class="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center border border-white/30 bg-black/25 text-white backdrop-blur-sm transition-all hover:border-white/60 hover:bg-black/50 active:scale-95"
                :aria-label="`Add ${props.provider.name} to favorites`"
                @click.stop.prevent="emit('favorite', props.provider.id)"
            >
                <Heart class="h-[17px] w-[17px]" />
            </button>
            <div
                v-if="props.provider.tag"
                class="absolute bottom-3 left-3 z-10 bg-white px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-900 shadow-sm"
            >
                {{ props.provider.tag }}
            </div>
        </div>
        <div class="mt-4">
            <div class="flex items-start justify-between gap-3">
                <h3
                    class="min-w-0 truncate text-[15px] font-semibold leading-5 text-slate-950"
                >
                    {{ props.provider.name }}

                    <svg
                        v-if="props.provider.verified"
                        class="ml-1 inline-block h-3.5 w-3.5 align-[-2px] text-primary"
                        viewBox="0 0 32 32"
                        fill="currentColor"
                        aria-label="Verified provider"
                    >
                        <path
                            d="M28.233 12.853c-.472-.493-.96-1-1.143-1.447-.17-.409-.18-1.086-.19-1.742-.019-1.22-.039-2.603-1-3.564s-2.344-.981-3.564-1c-.656-.01-1.333-.02-1.742-.19-.445-.184-.954-.671-1.447-1.142C18.286 2.938 17.306 2 16 2s-2.284.939-3.148 1.768c-.492.47-1 .958-1.446 1.142-.406.17-1.086.18-1.742.19-1.22.019-2.603.039-3.564 1s-.975 2.344-1 3.564c-.01.656-.02 1.334-.19 1.742-.184.445-.671.954-1.142 1.446C2.938 13.715 2 14.696 2 16s.939 2.284 1.768 3.148c.47.492.958 1 1.142 1.446.17.409.18 1.086.19 1.742.019 1.22.039 2.603 1 3.564s2.344.981 3.564 1c.656.01 1.334.02 1.742.19.445.184.954.671 1.446 1.143C13.715 29.06 14.696 30 16 30s2.284-.939 3.148-1.767c.492-.472 1-.96 1.446-1.143.409-.17 1.086-.18 1.742-.19 1.22-.019 2.603-.039 3.564-1s.981-2.344 1-3.564c.01-.656.02-1.333.19-1.742.184-.445.671-.954 1.143-1.447C29.06 18.286 30 17.306 30 16s-.939-2.284-1.767-3.148m-6.526.854-7 7a1 1 0 0 1-1.415 0l-3-3a1 1 0 0 1 1.415-1.415L14 18.587l6.293-6.293a1 1 0 0 1 1.415 1.415"
                        />
                    </svg>
                </h3>

                <!-- RATING -->
                <div class="flex shrink-0 items-center gap-1">
                    <Star class="h-3.5 w-3.5 fill-amber-400 text-amber-400" />

                    <span
                        class="text-xs font-semibold tabular-nums text-slate-900"
                    >
                        {{ props.provider.rating.toFixed(1) }}
                    </span>
                </div>
            </div>

            <!-- LOCATION -->
            <p class="mt-1 truncate text-sm leading-5 text-slate-500">
                {{ props.provider.location }}
            </p>

            <p class="mt-0.5 truncate text-sm leading-5 text-slate-500">
                {{ props.provider.category }}
                <span class="mx-1 text-slate-300">·</span>
                {{ props.provider.reviews.toLocaleString() }} reviews
            </p>
        </div>

        <NuxtLink
            :to="`/venue/${props.provider.slug}`"
            class="absolute inset-0 z-10"
            :aria-label="`View ${props.provider.name}`"
        />

        <div class="pointer-events-none absolute inset-0 z-[15]" />
    </article>
</template>
