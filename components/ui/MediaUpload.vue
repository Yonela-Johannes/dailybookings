<script setup lang="ts">
import { ref } from 'vue'
import { Upload, X, Loader2 } from 'lucide-vue-next'
import type { Media } from '~/types/venue'

const props = defineProps<{
  venueId: string
  entityType: 'VENUE' | 'EMPLOYEE' | 'PORTFOLIO'
  category?: string
  label?: string
}>()

const emit = defineEmits<{
  (e: 'uploaded', media: Media): void
}>()

const fileInput = ref<HTMLInputElement | null>(null)
const uploading = ref(false)
const error = ref<string | null>(null)
const previewUrl = ref<string | null>(null)

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    if (file.size > 10 * 1024 * 1024) {
      error.value = 'File is too large. Max size is 10MB.'
      return
    }
    previewUrl.value = URL.createObjectURL(file)
    error.value = null
  }
}

const clearSelection = () => {
  previewUrl.value = null
  if (fileInput.value) fileInput.value.value = ''
  error.value = null
}

const uploadFile = async () => {
  const file = fileInput.value?.files?.[0]
  if (!file) return

  uploading.value = true
  error.value = null

  const formData = new FormData()
  formData.append('file', file)
  formData.append('venueId', props.venueId)
  formData.append('entityType', props.entityType)
  if (props.category) formData.append('category', props.category)

  try {
    const response = await $fetch<Media>('/api/media/upload', {
      method: 'POST',
      body: formData
    })

    emit('uploaded', response)
    clearSelection()
  } catch (err: any) {
    error.value = err.data?.message || err.statusMessage || 'Failed to upload media'
  } finally {
    uploading.value = false
  }
}
</script>

<template>
  <div class="space-y-4">
    <div
      class="border-2 border-dashed border-slate-300 rounded-xl p-8 transition-colors hover:border-[#33689C] group relative text-center"
      :class="{ 'border-[#33689C] bg-blue-50/50': previewUrl }"
    >
      <input
        ref="fileInput"
        type="file"
        accept="image/*,video/*"
        class="hidden"
        @change="handleFileSelect"
      />

      <div v-if="!previewUrl" class="flex flex-col items-center justify-center cursor-pointer" @click="fileInput?.click()">
        <div class="p-3 rounded-full bg-slate-100 text-slate-500 group-hover:bg-[#33689C] group-hover:text-white transition-colors">
          <Upload class="w-6 h-6" />
        </div>
        <p class="mt-4 text-sm font-medium text-slate-900">{{ label || 'Click to upload media' }}</p>
        <p class="mt-1 text-xs text-slate-500">Supports JPG, PNG, MP4 up to 10MB</p>
      </div>

      <div v-else class="relative aspect-video rounded-lg overflow-hidden bg-slate-100 max-w-md mx-auto">
        <img v-if="!fileInput?.files?.[0]?.type.startsWith('video')" :src="previewUrl" class="w-full h-full object-cover" />
        <video v-else :src="previewUrl" class="w-full h-full object-cover" controls />
        <button
          @click="clearSelection"
          class="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
        >
          <X class="w-4 h-4" />
        </button>
      </div>
    </div>

    <div v-if="error" class="text-sm text-red-600 font-medium text-center">
      {{ error }}
    </div>

    <div v-if="previewUrl" class="flex justify-center gap-3">
      <button
        @click="clearSelection"
        class="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900"
        :disabled="uploading"
      >
        Cancel
      </button>
      <button
        @click="uploadFile"
        :disabled="uploading"
        class="inline-flex items-center px-4 py-2 bg-[#33689C] text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-[#2a5580] disabled:opacity-50"
      >
        <Loader2 v-if="uploading" class="w-4 h-4 mr-2 animate-spin" />
        {{ uploading ? 'Uploading...' : 'Confirm Upload' }}
      </button>
    </div>
  </div>
</template>
