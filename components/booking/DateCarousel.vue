<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
    selectedDate?: string;
}>();

const emit = defineEmits<{
    select: [date: string];
}>();

const dates = computed(() => {
    return Array.from({ length: 14 }).map((_, i) => {
        const date = new Date();

        date.setDate(date.getDate() + i);

        return {
            value: date.toISOString().slice(0, 10),
            day: date.toLocaleDateString("en-ZA", {
                weekday: "short",
            }),
            number: date.getDate(),
            month: date.toLocaleDateString("en-ZA", {
                month: "short",
            }),
        };
    });
});
</script>

<template>
    <section class="space-y-4">
        <div>
            <h2 class="text-lg font-semibold text-stone-900">Select date</h2>
            <p class="text-sm text-stone-500">
                Choose your preferred appointment day.
            </p>
        </div>

        <div class="-mx-4 overflow-x-auto px-4 scrollbar-none">
            <div class="flex gap-3 pb-2">
                <button
                    v-for="date in dates"
                    :key="date.value"
                    type="button"
                    class="min-w-[88px] rounded-3xl border p-4 text-center transition-all"
                    :class="
                        selectedDate === date.value
                            ? 'border-emerald-600 bg-emerald-600 text-white'
                            : 'border-stone-200 bg-white hover:border-stone-300'
                    "
                    @click="emit('select', date.value)"
                >
                    <p class="text-xs opacity-80">
                        {{ date.day }}
                    </p>

                    <p class="mt-1 text-xl font-bold">
                        {{ date.number }}
                    </p>

                    <p class="text-xs">
                        {{ date.month }}
                    </p>
                </button>
            </div>
        </div>
    </section>
</template>
