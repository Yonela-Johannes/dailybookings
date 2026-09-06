<script setup lang="ts">
import { X } from 'lucide-vue-next'

const props = defineProps<{
  show: boolean
  title: string
}>()

const emit = defineEmits(['close'])
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition ease-in-out duration-300 transform"
      enter-from-class="translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition ease-in-out duration-300 transform"
      leave-from-class="translate-x-0"
      leave-to-class="translate-x-full"
    >
      <div v-if="show" class="fixed inset-0 overflow-hidden z-[100]">
        <div class="absolute inset-0 overflow-hidden">
          <div
            class="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
            @click="emit('close')"
          ></div>

          <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <div class="pointer-events-auto w-screen max-w-md">
              <div class="flex h-full flex-col overflow-y-scroll bg-white shadow-2xl border-l border-slate-100">
                <div class="px-6 py-6 border-b border-slate-50">
                  <div class="flex items-start justify-between">
                    <h2 class="text-xl font-extrabold text-slate-900">{{ title }}</h2>
                    <div class="ml-3 flex h-7 items-center">
                      <button
                        type="button"
                        class="rounded-xl bg-white text-slate-400 hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/20 p-1 transition-colors hover:bg-slate-50"
                        @click="emit('close')"
                      >
                        <span class="sr-only">Close panel</span>
                        <X class="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
                <div class="relative flex-1 px-6 py-8">
                  <slot></slot>
                </div>
                <div v-if="$slots.footer" class="border-t border-slate-50 px-6 py-6 bg-slate-50/50">
                  <slot name="footer"></slot>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
