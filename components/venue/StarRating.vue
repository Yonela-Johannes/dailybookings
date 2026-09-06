<script setup lang="ts">
import { Star } from "lucide-vue-next";

withDefaults(
    defineProps<{
        rating: number;
        size?: "sm" | "md" | "lg";
        showValue?: boolean;
    }>(),
    {
        size: "md",
        showValue: false,
    },
);

const sizeClasses = {
    sm: "h-3.5 w-3.5",
    md: "h-4 w-4",
    lg: "h-5 w-5",
};
</script>

<template>
    <div
        class="inline-flex items-center gap-1.5"
        :aria-label="`${rating.toFixed(1)} out of 5 stars`"
    >
        <div class="flex items-center gap-0.5">
            <Star
                v-for="index in 5"
                :key="index"
                :class="[
                    sizeClasses[size],
                    index <= Math.round(rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'fill-slate-100 text-slate-200',
                ]"
                stroke-width="1.5"
                aria-hidden="true"
            />
        </div>

        <span
            v-if="showValue"
            class="text-sm font-semibold tabular-nums text-slate-950"
        >
            {{ rating.toFixed(1) }}
        </span>
    </div>
</template>
