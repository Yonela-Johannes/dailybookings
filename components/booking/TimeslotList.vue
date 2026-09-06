<script setup lang="ts">
defineProps<{
    slots: string[];
    selected?: string;
}>();

const emit = defineEmits<{
    select: [time: string];
}>();
</script>

<template>
    <section class="space-y-4">
        <div>
            <h2 class="text-lg font-semibold text-stone-900">
                Available times
            </h2>

            <p class="text-sm text-stone-500">
                Times shown are based on selected services.
            </p>
        </div>

        <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <button
                v-for="slot in slots"
                :key="slot"
                type="button"
                class="rounded-2xl border px-4 py-4 text-center text-sm font-medium transition-all"
                :class="
                    selected === slot
                        ? 'border-emerald-600 bg-emerald-600 text-white'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                "
                @click="emit('select', slot)"
            >
                {{ slot }}
            </button>
        </div>
    </section>
</template>
