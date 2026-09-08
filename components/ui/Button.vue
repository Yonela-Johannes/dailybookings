<script setup lang="ts">
import { Loader2 } from "lucide-vue-next";
import type { Component } from "vue";

interface Props {
    label?: string;
    loading?: boolean;
    disabled?: boolean;
    variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
    icon?: Component;
    iconPosition?: "left" | "right";
    size?: "sm" | "md" | "lg";
    buttonType?: "button" | "submit" | "reset";
}

const props = withDefaults(defineProps<Props>(), {
    loading: false,
    disabled: false,
    variant: "primary",
    iconPosition: "left",
    size: "md",
    buttonType: "button",
});

const variantClasses = {
    primary:
        "bg-[#33689C] text-white border border-[#33689C] hover:bg-[#2C5B88] hover:border-[#2C5B88] focus-visible:ring-[#33689C]/30",

    secondary:
        "bg-slate-100 text-slate-900 border border-slate-100 hover:bg-slate-200 focus-visible:ring-slate-400/30",

    outline:
        "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 focus-visible:ring-slate-400/30",

    ghost: "bg-transparent text-slate-600 border border-transparent hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-slate-400/30",

    danger: "bg-red-600 text-white border border-red-600 hover:bg-red-700 hover:border-red-700 focus-visible:ring-red-500/30",
};

const sizeClasses = {
    sm: {
        wrapper: "h-8 px-3 text-xs",
        icon: "h-3.5 w-3.5",
    },

    md: {
        wrapper: "h-10 px-4 text-sm",
        icon: "h-4 w-4",
    },

    lg: {
        wrapper: "h-12 px-6 text-base",
        icon: "h-5 w-5",
    },
};

const currentSize = computed(() => sizeClasses[props.size]);
</script>

<template>
    <button
        :type="buttonType"
        :disabled="disabled || loading"
        :aria-busy="loading"
        :aria-disabled="disabled || loading"
        class="relative inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap font-semibold transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        :class="[variantClasses[variant], currentSize.wrapper]"
    >
        <!-- Loading -->
        <template v-if="loading">
            <Loader2
                :class="[currentSize.icon, 'shrink-0 animate-spin']"
                aria-hidden="true"
            />

            <span v-if="label">
                {{ label }}
            </span>

            <span v-else class="sr-only"> Loading </span>
        </template>

        <!-- Default -->
        <template v-else>
            <component
                v-if="icon && iconPosition === 'left'"
                :is="icon"
                :class="[currentSize.icon, 'shrink-0']"
                aria-hidden="true"
            />

            <span v-if="label">
                {{ label }}
            </span>

            <slot v-else />

            <component
                v-if="icon && iconPosition === 'right'"
                :is="icon"
                :class="[currentSize.icon, 'shrink-0']"
                aria-hidden="true"
            />
        </template>
    </button>
</template>
