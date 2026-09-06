<script setup lang="ts">
import { ArrowLeft, Check, ChevronRight, X } from "lucide-vue-next";

withDefaults(
    defineProps<{
        title: string;
        steps: string[];
        activeStep: number;
    }>(),
    {
        steps: () => [],
        activeStep: 0,
    },
);

const emit = defineEmits<{
    back: [];
    close: [];
}>();
</script>

<template>
    <header
        class="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur"
    >
        <div
            class="mx-auto flex min-h-16 w-full max-w-6xl items-center gap-4 px-4 sm:px-6"
        >
            <!-- Back -->
            <button
                type="button"
                class="flex h-10 shrink-0 items-center gap-2 border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 transition-colors hover:border-slate-950 hover:text-slate-950"
                @click="emit('back')"
            >
                <ArrowLeft class="h-4 w-4" stroke-width="1.8" />

                <span class="hidden sm:inline"> Back </span>
            </button>

            <!-- Center -->
            <div class="min-w-0 flex-1 text-center">
                <!-- Desktop progress -->
                <nav
                    aria-label="Booking progress"
                    class="hidden items-center justify-center sm:flex"
                >
                    <ol class="flex items-center">
                        <li
                            v-for="(step, index) in steps"
                            :key="step"
                            class="flex items-center"
                        >
                            <div class="flex items-center gap-2">
                                <span
                                    class="flex h-6 w-6 items-center justify-center border text-xs font-semibold"
                                    :class="
                                        index < activeStep
                                            ? 'border-primary bg-primary text-white'
                                            : index === activeStep
                                              ? 'border-slate-950 bg-slate-950 text-white'
                                              : 'border-slate-200 bg-white text-slate-400'
                                    "
                                >
                                    <Check
                                        v-if="index < activeStep"
                                        class="h-3.5 w-3.5"
                                        stroke-width="2"
                                    />

                                    <span v-else>
                                        {{ index + 1 }}
                                    </span>
                                </span>

                                <span
                                    class="text-sm"
                                    :class="
                                        index === activeStep
                                            ? 'font-semibold text-slate-950'
                                            : index < activeStep
                                              ? 'font-medium text-slate-600'
                                              : 'text-slate-400'
                                    "
                                >
                                    {{ step }}
                                </span>
                            </div>

                            <ChevronRight
                                v-if="index < steps.length - 1"
                                class="mx-3 h-4 w-4 text-slate-300"
                                stroke-width="1.5"
                            />
                        </li>
                    </ol>
                </nav>

                <!-- Mobile -->
                <div class="sm:hidden">
                    <p class="text-xs font-medium text-slate-400">
                        Step {{ activeStep + 1 }} of {{ steps.length }}
                    </p>

                    <p class="truncate text-sm font-semibold text-slate-950">
                        {{ title }}
                    </p>
                </div>

                <!-- Desktop title -->
                <p class="mt-1 hidden truncate text-xs text-slate-400 sm:block">
                    {{ title }}
                </p>
            </div>

            <!-- Close -->
            <button
                type="button"
                aria-label="Close booking"
                class="flex h-10 w-10 shrink-0 items-center justify-center border border-slate-200 bg-white text-slate-500 transition-colors hover:border-slate-950 hover:text-slate-950"
                @click="emit('close')"
            >
                <X class="h-4 w-4" stroke-width="1.8" />
            </button>
        </div>
    </header>
</template>
