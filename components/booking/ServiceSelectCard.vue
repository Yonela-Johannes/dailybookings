<script setup lang="ts">
import { ref } from 'vue'
import {
  Check,
  ChevronDown,
  Clock3,
  Plus,
  Sparkles,
} from 'lucide-vue-next'
import type { VenueService } from '~/types/venue'

defineProps<{
  service: VenueService
  selected: boolean
}>()

const emit = defineEmits<{
  toggle: []
}>()

const expanded = ref(false)

function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60)
  const minutesRemaining = minutes % 60

  if (hours && minutesRemaining) {
    return `${hours} hr ${minutesRemaining} min`
  }

  if (hours) {
    return `${hours} hr`
  }

  return `${minutesRemaining} min`
}
</script>

<template>
  <article
    class="relative py-5 first:pt-4 last:pb-4"
  >
    <div class="flex items-start gap-5">
      <!-- Service information -->
      <div class="min-w-0 flex-1">
        <div class="flex flex-wrap items-center gap-x-2 gap-y-1">
          <h3
            class="text-[15px] font-semibold text-slate-950"
          >
            {{ service.name }}
          </h3>

          <span
            v-if="service.popular"
            class="inline-flex items-center gap-1 text-xs font-medium text-primary"
          >
            <Sparkles
              class="h-3.5 w-3.5"
              stroke-width="1.8"
            />

            Popular
          </span>
        </div>

        <!-- Description -->
        <button
          v-if="service.description"
          type="button"
          class="mt-1 block text-left"
          :aria-expanded="expanded"
          @click="expanded = !expanded"
        >
          <p
            class="text-sm leading-5 text-slate-500"
            :class="{ 'line-clamp-2': !expanded }"
          >
            {{ service.description }}
          </p>

          <span
            class="mt-1 inline-flex items-center gap-1 text-xs font-medium text-slate-700"
          >
            {{ expanded ? 'Show less' : 'More details' }}

            <ChevronDown
              class="h-3.5 w-3.5 transition-transform"
              :class="{ 'rotate-180': expanded }"
              stroke-width="1.8"
            />
          </span>
        </button>

        <!-- Meta -->
        <div class="mt-3 flex items-center gap-4">
          <span class="inline-flex items-center gap-1.5 text-xs text-slate-400">
            <Clock3
              class="h-3.5 w-3.5"
              stroke-width="1.7"
            />

            {{ formatDuration(service.durationMinutes) }}
          </span>

          <span class="text-sm font-semibold text-slate-950">
            {{ service.priceIsFrom ? 'From ' : '' }}R{{ service.price }}
          </span>
        </div>
      </div>

      <!-- Selection control -->
      <button
        type="button"
        :aria-pressed="selected"
        :aria-label="
          selected
            ? `Remove ${service.name}`
            : `Select ${service.name}`
        "
        class="flex h-10 w-10 shrink-0 items-center justify-center border transition-colors"
        :class="
          selected
            ? 'border-primary bg-primary text-white'
            : 'border-slate-300 bg-white text-slate-500 hover:border-slate-950 hover:text-slate-950'
        "
        @click="emit('toggle')"
      >
        <Check
          v-if="selected"
          class="h-4 w-4"
          stroke-width="2"
        />

        <Plus
          v-else
          class="h-4 w-4"
          stroke-width="1.8"
        />
      </button>
    </div>
  </article>
</template>
