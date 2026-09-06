<script setup lang="ts">
interface TimeSlot {
  startTime: string; // ISO string or format like "HH:mm"
  endTime: string;
}

const props = defineProps<{
  slots: TimeSlot[];
  selectedSlot?: TimeSlot | null;
}>();

const emit = defineEmits<{
  (e: 'select', slot: TimeSlot): void;
}>();

const formatTime = (time: string) => {
  // Simple check for "HH:mm" vs ISO
  if (time.includes('T')) {
    return new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  return time;
};

const isSelected = (slot: TimeSlot) => {
  return props.selectedSlot?.startTime === slot.startTime;
};
</script>

<template>
  <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
    <button
      v-for="slot in slots"
      :key="slot.startTime"
      @click="emit('select', slot)"
      class="py-3 px-4 text-sm font-medium rounded-lg border-2 transition-all duration-200"
      :class="[
        isSelected(slot)
          ? 'bg-[#33689C] border-[#33689C] text-white shadow-md'
          : 'bg-white border-slate-100 text-slate-700 hover:border-[#33689C]/50 hover:bg-blue-50/30'
      ]"
    >
      {{ formatTime(slot.startTime) }}
    </button>
  </div>
</template>
