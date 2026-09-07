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
  Trash2,
  Loader2,
  X,
  AlertCircle
} from 'lucide-vue-next'
import { z } from 'zod'

definePageMeta({
  layout: 'business',
  middleware: 'auth'
})

// Validation Schemas
const categorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters")
})

const serviceSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  durationMinutes: z.number().int().min(1, "Duration must be at least 1 minute"),
  price: z.number().min(0, "Price cannot be negative"),
  serviceCategoryId: z.string().uuid("Please select a category")
})

// Data Fetching
const { data: venuesRes } = await useFetch('/api/business/venues')
const venues = computed(() => venuesRes.value?.data || [])
const selectedVenueId = ref(venues.value[0]?.id || '')

const { data: categoriesRes, pending, refresh } = await useFetch('/api/business/services', {
  query: { venueId: selectedVenueId },
  watch: [selectedVenueId]
})

const categories = computed(() => categoriesRes.value?.data || [])

// UI State
const showSlideOver = ref(false)
const slideOverType = ref<'category' | 'service'>('category')
const slideOverMode = ref<'add' | 'edit'>('add')
const selectedItem = ref<any>(null)
const isSubmitting = ref(false)
const errors = ref<Record<string, string>>({})

// Form Data
const categoryForm = reactive({
  name: ''
})

const serviceForm = reactive({
  name: '',
  description: '',
  durationMinutes: 30,
  price: 0,
  serviceCategoryId: ''
})

// Actions
const openCategoryForm = (category?: any) => {
  slideOverType.value = 'category'
  slideOverMode.value = category ? 'edit' : 'add'
  selectedItem.value = category || null
  categoryForm.name = category?.name || ''
  errors.value = {}
  showSlideOver.value = true
}

const openServiceForm = (service?: any, categoryId?: string) => {
  slideOverType.value = 'service'
  slideOverMode.value = service ? 'edit' : 'add'
  selectedItem.value = service || null
  serviceForm.name = service?.name || ''
  serviceForm.description = service?.description || ''
  serviceForm.durationMinutes = service?.durationMinutes || 30
  serviceForm.price = service ? Number(service.price) : 0
  serviceForm.serviceCategoryId = service?.serviceCategoryId || categoryId || (categories.value[0]?.id || '')
  errors.value = {}
  showSlideOver.value = true
}

const handleSubmit = async () => {
  errors.value = {}
  isSubmitting.value = true

  try {
    if (slideOverType.value === 'category') {
      const result = categorySchema.safeParse(categoryForm)
      if (!result.success) {
        result.error.issues.forEach(issue => {
          errors.value[issue.path[0]] = issue.message
        })
        return
      }

      await $fetch('/api/business/services', {
        method: 'POST',
        body: {
          action: slideOverMode.value === 'add' ? 'createCategory' : 'updateCategory',
          id: selectedItem.value?.id,
          data: {
            ...categoryForm,
            venueId: selectedVenueId.value
          }
        }
      })
    } else {
      const result = serviceSchema.safeParse(serviceForm)
      if (!result.success) {
        result.error.issues.forEach(issue => {
          errors.value[issue.path[0]] = issue.message
        })
        return
      }

      await $fetch('/api/business/services', {
        method: 'POST',
        body: {
          action: slideOverMode.value === 'add' ? 'createService' : 'updateService',
          id: selectedItem.value?.id,
          data: serviceForm
        }
      })
    }

    await refresh()
    showSlideOver.value = false
  } catch (err: any) {
    console.error(err)
    alert(err.data?.message || err.message || 'Operation failed')
  } finally {
    isSubmitting.value = false
  }
}

const handleDelete = async (type: 'category' | 'service', id: string) => {
  if (!confirm(`Are you sure you want to delete this ${type}?`)) return

  try {
    await $fetch('/api/business/services', {
      method: 'POST',
      body: {
        action: type === 'category' ? 'deleteCategory' : 'deleteService',
        id
      }
    })
    await refresh()
  } catch (err: any) {
    alert(err.message)
  }
}
</script>

<template>
  <div class="space-y-8 pb-20">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div>
        <h1 class="text-4xl font-black text-slate-900 italic tracking-tighter">Services</h1>
        <p class="text-slate-500 font-medium">Create and manage your service menu and pricing.</p>
      </div>
      <div class="flex items-center gap-3">
        <select
          v-if="venues.length > 1"
          v-model="selectedVenueId"
          class="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
        >
          <option v-for="venue in venues" :key="venue.id" :value="venue.id">{{ venue.name }}</option>
        </select>
        <UiButton label="Add Category" type="outline" :icon="Plus" @click="openCategoryForm()" />
        <UiButton label="Add Service" :icon="Plus" @click="openServiceForm()" />
      </div>
    </div>

    <!-- Main Content -->
    <div v-if="pending" class="space-y-6">
      <div v-for="i in 3" :key="i" class="bg-white rounded-3xl border border-slate-100 p-8 animate-pulse">
        <div class="h-6 w-48 bg-slate-100 rounded-lg mb-6"></div>
        <div class="space-y-4">
          <div v-for="j in 2" :key="j" class="h-20 bg-slate-50 rounded-2xl"></div>
        </div>
      </div>
    </div>

    <div v-else-if="categories.length === 0" class="flex flex-col items-center justify-center py-20 px-6 bg-white rounded-3xl border border-slate-100 shadow-sm text-center">
      <div class="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-300 mb-6">
        <Scissors class="w-10 h-10" />
      </div>
      <h3 class="text-xl font-bold text-slate-900 mb-2 italic">No services yet</h3>
      <p class="text-slate-500 max-w-xs mb-8 font-medium">Start by adding your first service category to build your menu.</p>
      <UiButton label="Add First Category" :icon="Plus" @click="openCategoryForm()" />
    </div>

    <div v-else class="space-y-6">
      <div v-for="category in categories" :key="category.id" class="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden group/cat">
        <!-- Category Header -->
        <div class="px-8 py-6 bg-slate-50/30 border-b border-slate-50 flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 group-hover/cat:text-teal-600 group-hover/cat:border-teal-100 transition-colors">
              <GripVertical class="w-5 h-5 cursor-grab" />
            </div>
            <div>
              <h2 class="text-sm font-black text-slate-950 uppercase tracking-[0.2em]">{{ category.name }}</h2>
              <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">{{ category.services.length }} Services</span>
            </div>
          </div>
          <div class="flex items-center gap-2 opacity-0 group-hover/cat:opacity-100 transition-all duration-300 translate-x-4 group-hover/cat:translate-x-0">
            <button
              @click="openCategoryForm(category)"
              class="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-primary hover:border-primary/30 transition-all shadow-sm"
            >
              <Edit2 class="w-4 h-4" />
            </button>
            <button
              @click="handleDelete('category', category.id)"
              class="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-red-500 hover:border-red-100 transition-all shadow-sm"
            >
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Services List -->
        <div class="divide-y divide-slate-50">
          <div v-for="service in category.services" :key="service.id" class="px-8 py-6 hover:bg-slate-50/50 transition-all group">
            <div class="flex items-center gap-6">
              <div class="hidden sm:block">
                <GripVertical class="w-4 h-4 text-slate-200 cursor-grab" />
              </div>

              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-3 mb-1.5">
                  <h3 class="font-bold text-slate-900 group-hover:text-teal-600 transition-colors">{{ service.name }}</h3>
                  <div class="h-1 w-1 bg-slate-200 rounded-full"></div>
                  <span class="text-xs font-black text-teal-600 bg-teal-50 px-3 py-1 rounded-full italic">${{ service.price }}</span>
                </div>
                <p class="text-sm text-slate-500 font-medium line-clamp-1">{{ service.description }}</p>
              </div>

              <div class="flex items-center gap-8">
                <div class="flex flex-col items-end gap-1">
                  <div class="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <Clock class="w-3 h-3" />
                    {{ service.durationMinutes }} min
                  </div>
                </div>

                <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                  <button
                    @click="openServiceForm(service)"
                    class="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-primary hover:border-primary/30 transition-all shadow-sm"
                  >
                    <Edit2 class="w-4 h-4" />
                  </button>
                  <button
                    @click="handleDelete('service', service.id)"
                    class="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-600 hover:border-slate-300 transition-all shadow-sm"
                  >
                    <MoreVertical class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <button
            @click="openServiceForm(null, category.id)"
            class="w-full px-8 py-5 text-left text-[10px] font-black text-slate-400 hover:text-teal-600 hover:bg-teal-50/30 transition-all flex items-center gap-3 group/add uppercase tracking-[0.2em]"
          >
            <div class="w-6 h-6 rounded-lg bg-slate-50 group-hover/add:bg-teal-500/10 flex items-center justify-center transition-colors">
              <Plus class="w-3.5 h-3.5 group-hover/add:scale-110 transition-transform" />
            </div>
            Add service to {{ category.name }}
          </button>
        </div>
      </div>
    </div>

    <!-- Slide-over (Forms) -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="showSlideOver" class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-end">
          <Transition
            enter-active-class="transition duration-500 cubic-bezier(0.16, 1, 0.3, 1)"
            enter-from-class="translate-x-full"
            enter-to-class="translate-x-0"
            leave-active-class="transition duration-300 cubic-bezier(0.7, 0, 0.84, 0)"
            leave-from-class="translate-x-0"
            leave-to-class="translate-x-full"
            appear
          >
            <div class="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col border-l border-slate-100">
              <!-- Header -->
              <div class="px-8 py-8 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 class="text-2xl font-black text-slate-900 italic tracking-tighter capitalize">
                    {{ slideOverMode }} {{ slideOverType }}
                  </h2>
                  <p class="text-sm text-slate-500 font-medium mt-1">Fill in the details below.</p>
                </div>
                <button @click="showSlideOver = false" class="p-3 hover:bg-slate-50 rounded-2xl text-slate-400 hover:text-slate-600 transition-all">
                  <X class="w-6 h-6" />
                </button>
              </div>

              <!-- Form -->
              <div class="flex-1 overflow-y-auto px-8 py-10 space-y-8">
                <template v-if="slideOverType === 'category'">
                  <div class="space-y-2">
                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Category Name</label>
                    <input
                      v-model="categoryForm.name"
                      type="text"
                      placeholder="e.g. Massage Therapy"
                      class="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary/5 focus:border-primary/30 outline-none transition-all"
                      :class="{'border-red-200 bg-red-50/30': errors.name}"
                    />
                    <p v-if="errors.name" class="text-[10px] font-bold text-red-500 uppercase tracking-widest flex items-center gap-1 mt-1">
                      <AlertCircle class="w-3 h-3" />
                      {{ errors.name }}
                    </p>
                  </div>
                </template>

                <template v-else>
                  <div class="space-y-2">
                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Service Name</label>
                    <input
                      v-model="serviceForm.name"
                      type="text"
                      placeholder="e.g. Deep Tissue Massage"
                      class="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary/5 focus:border-primary/30 outline-none transition-all"
                      :class="{'border-red-200 bg-red-50/30': errors.name}"
                    />
                    <p v-if="errors.name" class="text-[10px] font-bold text-red-500 uppercase tracking-widest flex items-center gap-1 mt-1">
                      <AlertCircle class="w-3 h-3" />
                      {{ errors.name }}
                    </p>
                  </div>

                  <div class="space-y-2">
                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Description</label>
                    <textarea
                      v-model="serviceForm.description"
                      rows="4"
                      placeholder="Describe the service..."
                      class="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary/5 focus:border-primary/30 outline-none transition-all resize-none"
                    ></textarea>
                  </div>

                  <div class="grid grid-cols-2 gap-6">
                    <div class="space-y-2">
                      <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Duration (Min)</label>
                      <input
                        v-model.number="serviceForm.durationMinutes"
                        type="number"
                        class="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary/5 focus:border-primary/30 outline-none transition-all"
                        :class="{'border-red-200 bg-red-50/30': errors.durationMinutes}"
                      />
                    </div>
                    <div class="space-y-2">
                      <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Price ($)</label>
                      <input
                        v-model.number="serviceForm.price"
                        type="number"
                        class="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary/5 focus:border-primary/30 outline-none transition-all"
                        :class="{'border-red-200 bg-red-50/30': errors.price}"
                      />
                    </div>
                  </div>

                  <div class="space-y-2">
                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Category</label>
                    <select
                      v-model="serviceForm.serviceCategoryId"
                      class="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary/5 focus:border-primary/30 outline-none transition-all"
                      :class="{'border-red-200 bg-red-50/30': errors.serviceCategoryId}"
                    >
                      <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                    </select>
                  </div>
                </template>
              </div>

              <!-- Footer -->
              <div class="p-8 border-t border-slate-100 bg-slate-50/30 flex items-center gap-4">
                <UiButton
                  label="Cancel"
                  type="outline"
                  class="flex-1 !py-4"
                  @click="showSlideOver = false"
                />
                <UiButton
                  :label="slideOverMode === 'add' ? 'Create' : 'Save Changes'"
                  class="flex-[2] !py-4 shadow-xl shadow-teal-500/20 !bg-teal-500 hover:!bg-teal-400 !text-slate-950 font-black uppercase tracking-widest text-xs"
                  :loading="isSubmitting"
                  @click="handleSubmit"
                />
              </div>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
