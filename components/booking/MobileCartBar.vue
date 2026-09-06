<script setup lang="ts">
import {
  ArrowRight,
  Clock3,
} from 'lucide-vue-next'
import { useBookingCart } from '~/composables/useBookingCart'

const emit = defineEmits<{
  continue: []
}>()

const cart = useBookingCart()

function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60)
  const remaining = minutes % 60

  if (hours && remaining) {
    return `${hours} hr ${remaining} min`
  }

  if (hours) {
    return `${hours} hr`
  }

  return `${remaining} min`
}
</script>

<template>
  <Transition
    enter-active-class="transition duration-200"
    enter-from-class="translate-y-full opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transition duration-150"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="translate-y-full opacity-0"
  >
    <div
      v-if="cart.count.value"
      class="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur sm:px-6 lg:hidden"
    >
      <div class="mx-auto flex max-w-2xl items-center gap-4">
        <!-- Summary -->
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-2">
            <p class="text-sm font-semibold text-slate-950">
              {{ cart.count.value }}
              service{{ cart.count.value === 1 ? '' : 's' }}
            </p>

            <span class="h-1 w-1 bg-slate-300" />

            <div class="flex items-center gap-1 text-xs text-slate-400">
              <Clock3
                class="h-3.5 w-3.5"
                stroke-width="1.7"
              />

              {{ formatDuration(cart.totalDuration.value) }}
            </div>
          </div>

          <p class="mt-0.5 text-sm font-semibold text-slate-950">
            R{{ cart.total.value }}
          </p>
        </div>

        <!-- Continue -->
        <button
          type="button"
          class="flex h-11 shrink-0 items-center gap-2 bg-slate-950 px-5 text-sm font-semibold text-white transition-colors hover:bg-primary"
          @click="emit('continue')"
        >
          Continue

          <ArrowRight
            class="h-4 w-4"
            stroke-width="1.8"
          />
        </button>
      </div>
    </div>
  </Transition>
</template>
