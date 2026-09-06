<script setup lang="ts">
import {
  Plus,
  Search,
  MoreVertical,
  Scissors,
  Clock,
  DollarSign,
  ChevronRight,
  GripVertical,
  Edit2,
  Trash2
} from 'lucide-vue-next'

definePageMeta({
  layout: 'business',
  middleware: 'auth'
})

// Mock services data
const categories = ref([
  {
    id: '1',
    name: 'Massage Therapy',
    services: [
      { id: '101', name: 'Deep Tissue Massage', duration: 60, price: 85, description: 'Intense pressure for chronic muscle tension.' },
      { id: '102', name: 'Swedish Massage', duration: 60, price: 75, description: 'Relaxing full body massage.' },
      { id: '103', name: 'Hot Stone Massage', duration: 90, price: 120, description: 'Using heated stones for deeper relaxation.' },
    ]
  },
  {
    id: '2',
    name: 'Facial Treatments',
    services: [
      { id: '201', name: 'Classic Facial', duration: 45, price: 65, description: 'Deep cleansing and hydration.' },
      { id: '202', name: 'Anti-Aging Facial', duration: 75, price: 95, description: 'Rejuvenating treatment for mature skin.' },
    ]
  }
])

const showAddCategory = ref(false)
const showAddService = ref(false)
</script>

<template>
  <div class="space-y-8">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-extrabold text-slate-900">Services</h1>
        <p class="text-slate-500">Create and manage your service menu and pricing.</p>
      </div>
      <div class="flex items-center gap-3">
        <UiButton label="Add Category" type="outline" :icon="Plus" @click="showAddCategory = true" />
        <UiButton label="Add Service" :icon="Plus" @click="showAddService = true" />
      </div>
    </div>

    <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div class="p-4 border-b border-slate-100 bg-slate-50/30 flex items-center gap-4">
        <div class="relative flex-1">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search services..."
            class="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
          />
        </div>
      </div>

      <div class="divide-y divide-slate-100">
        <div v-for="category in categories" :key="category.id" class="group/cat">
          <!-- Category Header -->
          <div class="px-6 py-4 bg-slate-50/50 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <GripVertical class="w-4 h-4 text-slate-300 cursor-grab" />
              <h2 class="text-sm font-black text-slate-900 uppercase tracking-widest">{{ category.name }}</h2>
              <span class="text-[10px] font-bold px-2 py-0.5 bg-white border border-slate-200 text-slate-400 rounded-full">
                {{ category.services.length }}
              </span>
            </div>
            <div class="flex items-center gap-2 opacity-0 group-hover/cat:opacity-100 transition-opacity">
              <button class="p-1.5 hover:bg-white rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
                <Edit2 class="w-4 h-4" />
              </button>
              <button class="p-1.5 hover:bg-white rounded-lg text-slate-400 hover:text-red-500 transition-colors">
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- Services List -->
          <div class="divide-y divide-slate-50">
            <div v-for="service in category.services" :key="service.id" class="px-6 py-5 hover:bg-slate-50 transition-colors group">
              <div class="flex items-center gap-4">
                <GripVertical class="w-4 h-4 text-slate-200 cursor-grab" />

                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-3 mb-1">
                    <h3 class="font-bold text-slate-900 truncate">{{ service.name }}</h3>
                    <span class="text-xs font-black text-primary bg-primary/5 px-2 py-0.5 rounded-full">${{ service.price }}</span>
                  </div>
                  <p class="text-sm text-slate-500 truncate max-w-xl">{{ service.description }}</p>
                </div>

                <div class="flex items-center gap-6 text-slate-400">
                  <div class="flex items-center gap-1.5 text-xs font-bold">
                    <Clock class="w-3.5 h-3.5" />
                    {{ service.duration }} min
                  </div>

                  <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button class="p-2 hover:bg-white border border-transparent hover:border-slate-200 rounded-xl text-slate-600 transition-all">
                      <Edit2 class="w-4 h-4" />
                    </button>
                    <button class="p-2 hover:bg-white border border-transparent hover:border-slate-200 rounded-xl text-slate-400 hover:text-slate-600 transition-all">
                      <MoreVertical class="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <button class="w-full px-6 py-4 text-left text-xs font-bold text-slate-400 hover:text-primary hover:bg-blue-50/30 transition-all flex items-center gap-2 group/add">
              <Plus class="w-4 h-4 group-hover/add:scale-110 transition-transform" />
              Add service to {{ category.name }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
