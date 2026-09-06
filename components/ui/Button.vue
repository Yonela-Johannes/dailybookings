<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next';

interface Props {
  label: string;
  loading?: boolean;
  disabled?: boolean;
  type?: 'primary' | 'secondary' | 'outline';
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  disabled: false,
  type: 'primary',
});

const buttonClasses = {
  primary: 'bg-[#33689C] text-white hover:bg-[#2a5580] shadow-sm',
  secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200 shadow-sm',
  outline: 'border-2 border-[#33689C] text-[#33689C] hover:bg-[#33689C] hover:text-white transition-colors',
};
</script>

<template>
  <button
    :disabled="disabled || loading"
    class="relative inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#33689C] disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
    :class="buttonClasses[type]"
  >
    <Loader2 v-if="loading" class="w-4 h-4 mr-2 animate-spin" />
    <span :class="{ 'opacity-0': loading }">{{ label }}</span>
    <div v-if="loading" class="absolute inset-0 flex items-center justify-center">
      <Loader2 class="w-5 h-5 animate-spin" />
    </div>
  </button>
</template>
