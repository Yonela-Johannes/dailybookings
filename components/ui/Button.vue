<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next';
import type { Component } from 'vue';

interface Props {
  label?: string;
  loading?: boolean;
  disabled?: boolean;
  type?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  icon?: Component;
  iconPosition?: 'left' | 'right';
  size?: 'sm' | 'md' | 'lg';
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  disabled: false,
  type: 'primary',
  iconPosition: 'left',
  size: 'md'
});

const buttonClasses = {
  primary: 'bg-[#33689C] text-white hover:bg-[#2a5580] shadow-sm',
  secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200 shadow-sm',
  outline: 'border border-slate-200 text-slate-600 hover:bg-slate-50',
  ghost: 'text-slate-600 hover:bg-slate-100',
  danger: 'bg-red-500 text-white hover:bg-red-600 shadow-sm',
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-6 py-2.5 text-sm',
  lg: 'px-8 py-3 text-base',
};
</script>

<template>
  <button
    :disabled="disabled || loading"
    class="relative inline-flex items-center justify-center font-bold transition-all duration-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#33689C] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] gap-2"
    :class="[buttonClasses[type], sizeClasses[size]]"
  >
    <template v-if="!loading">
      <component v-if="icon && iconPosition === 'left'" :is="icon" class="w-4 h-4" />
      <span v-if="label">{{ label }}</span>
      <slot v-else></slot>
      <component v-if="icon && iconPosition === 'right'" :is="icon" class="w-4 h-4" />
    </template>

    <div v-if="loading" class="flex items-center justify-center gap-2">
      <Loader2 class="w-4 h-4 animate-spin" />
      <span v-if="label">{{ label }}</span>
    </div>
  </button>
</template>
