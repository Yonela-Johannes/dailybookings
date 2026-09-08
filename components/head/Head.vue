<script setup lang="ts">
interface Props {
    title: string;
    description?: string;
}

withDefaults(defineProps<Props>(), {
    title: "",
    description: "",
});
</script>

<template>
    <header
        class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
    >
        <div>
            <h1 class="text-2xl font-black tracking-tight text-slate-900">
                {{ title }}
            </h1>

            <p v-if="description" class="mt-1 text-sm text-slate-500">
                {{ description }}
            </p>
        </div>
    </header>
</template>
