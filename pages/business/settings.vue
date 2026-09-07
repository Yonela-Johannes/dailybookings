<script setup lang="ts">
import {
  Camera,
  MapPin,
  Phone,
  Globe,
  Clock,
  Shield,
  CreditCard,
  Save,
  Info,
  Mail,
  Instagram,
  Facebook,
  MessageCircle,
  Plus,
  Trash2,
  Loader2,
  Image as ImageIcon,
  Check
} from 'lucide-vue-next'

definePageMeta({
  layout: 'business',
  middleware: 'auth'
})

const { data: venuesResponse, refresh: refreshVenues, pending: loadingVenues } = await useFetch('/api/business/venues')
const { data: categoriesResponse } = await useFetch('/api/categories')

const venues = computed(() => venuesResponse.value?.data || [])
const categories = computed(() => categoriesResponse.value?.data || [])

const selectedVenueId = ref<string | null>(null)

// Select first venue by default
watchEffect(() => {
  if (venues.value.length > 0 && !selectedVenueId.value) {
    selectedVenueId.value = venues.value[0].id
  }
})

const venue = computed(() => venues.value.find(v => v.id === selectedVenueId.value))

const form = ref({
  name: '',
  tagline: '',
  description: '',
  categoryId: '',
  address: {
    street: '',
    suburb: '',
    city: '',
    region: '',
    postalCode: ''
  },
  contact: {
    phone: '',
    whatsapp: '',
    email: '',
    website: '',
    instagram: '',
    facebook: ''
  },
  bookingConfig: {
    instantConfirmation: true,
    requiresDeposit: false,
    depositPercentage: 0,
    cancellationPolicy: '',
    minimumNoticeMinutes: 60
  },
  schedules: [] as any[]
})

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

// Initialize form when venue changes
watch(venue, (newVenue) => {
  if (newVenue) {
    form.value = {
      name: newVenue.name || '',
      tagline: newVenue.tagline || '',
      description: newVenue.description || '',
      categoryId: newVenue.categoryId || '',
      address: {
        street: newVenue.address?.street || '',
        suburb: newVenue.address?.suburb || '',
        city: newVenue.address?.city || '',
        region: newVenue.address?.region || '',
        postalCode: newVenue.address?.postalCode || ''
      },
      contact: {
        phone: newVenue.contact?.phone || '',
        whatsapp: newVenue.contact?.whatsapp || '',
        email: newVenue.contact?.email || '',
        website: newVenue.contact?.website || '',
        instagram: newVenue.contact?.instagram || '',
        facebook: newVenue.contact?.facebook || ''
      },
      bookingConfig: {
        instantConfirmation: newVenue.bookingConfig?.instantConfirmation ?? true,
        requiresDeposit: newVenue.bookingConfig?.requiresDeposit ?? false,
        depositPercentage: newVenue.bookingConfig?.depositPercentage || 0,
        cancellationPolicy: newVenue.bookingConfig?.cancellationPolicy || '',
        minimumNoticeMinutes: newVenue.bookingConfig?.minimumNoticeMinutes || 60
      },
      schedules: days.map((_, index) => {
        const existing = newVenue.schedules?.find((s: any) => s.day === index)
        return existing ? { ...existing } : { day: index, opens: '09:00', closes: '17:00', closed: false }
      })
    }
  }
}, { immediate: true })

const activeTab = ref('general')
const tabs = [
  { id: 'general', label: 'General', icon: Info },
  { id: 'location', label: 'Location', icon: MapPin },
  { id: 'contact', label: 'Contact', icon: Phone },
  { id: 'hours', label: 'Hours', icon: Clock },
  { id: 'booking', label: 'Booking', icon: CreditCard },
  { id: 'media', label: 'Media', icon: ImageIcon },
]

const saving = ref(false)
const saveStatus = ref<{ type: 'success' | 'error', message: string } | null>(null)

const handleSave = async () => {
  if (!selectedVenueId.value) return

  saving.value = true
  saveStatus.value = null
  try {
    await $fetch(`/api/business/venues/${selectedVenueId.value}`, {
      method: 'PATCH',
      body: form.value
    })
    await refreshVenues()
    saveStatus.value = { type: 'success', message: 'Settings updated successfully' }
    setTimeout(() => saveStatus.value = null, 3000)
  } catch (error: any) {
    saveStatus.value = { type: 'error', message: error.data?.message || 'Failed to save settings' }
  } finally {
    saving.value = false
  }
}

const logoFile = ref<File | null>(null)
const galleryFiles = ref<FileList | null>(null)
const uploading = ref(false)

const handleLogoUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0] && selectedVenueId.value) {
    uploading.value = true
    const formData = new FormData()
    formData.append('file', target.files[0])
    formData.append('venueId', selectedVenueId.value)
    formData.append('entityType', 'VENUE')
    formData.append('category', 'LOGO')

    try {
      await $fetch('/api/media/upload', {
        method: 'POST',
        body: formData
      })
      await refreshVenues()
    } catch (error) {
      console.error(error)
    } finally {
      uploading.value = false
    }
  }
}

const handleGalleryUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && selectedVenueId.value) {
    uploading.value = true
    for (let i = 0; i < target.files.length; i++) {
      const formData = new FormData()
      formData.append('file', target.files[i])
      formData.append('venueId', selectedVenueId.value)
      formData.append('entityType', 'VENUE')
      formData.append('category', 'GALLERY')

      try {
        await $fetch('/api/media/upload', {
          method: 'POST',
          body: formData
        })
      } catch (error) {
        console.error(error)
      }
    }
    await refreshVenues()
    uploading.value = false
  }
}

const logoUrl = computed(() => {
  return venue.value?.media?.find((m: any) => m.category === 'LOGO')?.url
})

const galleryMedia = computed(() => {
  return venue.value?.media?.filter((m: any) => m.category === 'GALLERY') || []
})

const removeMedia = async (id: string) => {
  try {
    await $fetch(`/api/media/delete`, {
      method: 'DELETE',
      query: { id }
    })
    await refreshVenues()
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <div class="space-y-8">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div>
        <h1 class="text-3xl font-extrabold text-slate-900">Venue Settings</h1>
        <p class="text-slate-500">Manage your venue profile, location, and business preferences.</p>
      </div>

      <div class="flex flex-col sm:flex-row items-center gap-4">
        <!-- Venue Selector -->
        <div v-if="venues.length > 1" class="w-full sm:w-64">
          <select
            v-model="selectedVenueId"
            class="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none"
          >
            <option v-for="v in venues" :key="v.id" :value="v.id">{{ v.name }}</option>
          </select>
        </div>
        <UiButton
          label="Save Changes"
          :loading="saving"
          :icon="Save"
          class="w-full sm:w-auto"
          @click="handleSave"
        />
      </div>
    </div>

    <!-- Status Message -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform -translate-y-4 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="saveStatus"
           :class="[
             'p-4 rounded-xl border flex items-center gap-3',
             saveStatus.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-rose-50 border-rose-100 text-rose-800'
           ]">
        <Check v-if="saveStatus.type === 'success'" class="w-5 h-5 text-emerald-500" />
        <Info v-else class="w-5 h-5 text-rose-500" />
        <span class="text-sm font-bold">{{ saveStatus.message }}</span>
      </div>
    </Transition>

    <div v-if="loadingVenues" class="flex flex-col items-center justify-center py-20">
      <Loader2 class="w-10 h-10 text-primary animate-spin mb-4" />
      <p class="text-slate-500 font-medium">Loading settings...</p>
    </div>

    <div v-else-if="!venue" class="bg-white rounded-2xl border border-slate-100 p-12 text-center">
      <div class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <Info class="w-8 h-8 text-slate-300" />
      </div>
      <h3 class="text-lg font-bold text-slate-900">No venue found</h3>
      <p class="text-slate-500 mb-6">You haven't created any venues yet.</p>
      <UiButton label="Create Venue" to="/business/venues/new" />
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <!-- Tabs Navigation -->
      <div class="lg:col-span-1 space-y-2">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition-all',
            activeTab === tab.id
              ? 'bg-primary text-white shadow-md shadow-primary/20'
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
          ]"
        >
          <component :is="tab.icon" class="w-5 h-5" />
          {{ tab.label }}
        </button>
      </div>

      <!-- Settings Form Content -->
      <div class="lg:col-span-3 space-y-8">
        <!-- General Info -->
        <div v-if="activeTab === 'general'" class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div class="p-6 border-b border-slate-100 bg-slate-50/50">
            <h2 class="text-xl font-bold text-slate-900">General Information</h2>
            <p class="text-sm text-slate-500">Core details about your business.</p>
          </div>
          <div class="p-8 space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-xs font-black text-slate-400 uppercase tracking-widest">Venue Name</label>
                <input v-model="form.name" type="text" class="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
              </div>
              <div class="space-y-2">
                <label class="text-xs font-black text-slate-400 uppercase tracking-widest">Category</label>
                <select v-model="form.categoryId" class="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none">
                  <option value="">Select Category</option>
                  <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                </select>
              </div>
              <div class="md:col-span-2 space-y-2">
                <label class="text-xs font-black text-slate-400 uppercase tracking-widest">Tagline</label>
                <input v-model="form.tagline" type="text" class="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
              </div>
              <div class="md:col-span-2 space-y-2">
                <label class="text-xs font-black text-slate-400 uppercase tracking-widest">Description</label>
                <textarea v-model="form.description" rows="4" class="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none resize-none"></textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- Location -->
        <div v-if="activeTab === 'location'" class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div class="p-6 border-b border-slate-100 bg-slate-50/50">
            <h2 class="text-xl font-bold text-slate-900">Location Details</h2>
            <p class="text-sm text-slate-500">Where customers can find you.</p>
          </div>
          <div class="p-8 space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="md:col-span-2 space-y-2">
                <label class="text-xs font-black text-slate-400 uppercase tracking-widest">Street Address</label>
                <input v-model="form.address.street" type="text" class="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
              </div>
              <div class="space-y-2">
                <label class="text-xs font-black text-slate-400 uppercase tracking-widest">Suburb</label>
                <input v-model="form.address.suburb" type="text" class="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
              </div>
              <div class="space-y-2">
                <label class="text-xs font-black text-slate-400 uppercase tracking-widest">City</label>
                <input v-model="form.address.city" type="text" class="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
              </div>
              <div class="space-y-2">
                <label class="text-xs font-black text-slate-400 uppercase tracking-widest">Region / State</label>
                <input v-model="form.address.region" type="text" class="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
              </div>
              <div class="space-y-2">
                <label class="text-xs font-black text-slate-400 uppercase tracking-widest">Postal Code</label>
                <input v-model="form.address.postalCode" type="text" class="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
              </div>
            </div>
          </div>
        </div>

        <!-- Contact -->
        <div v-if="activeTab === 'contact'" class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div class="p-6 border-b border-slate-100 bg-slate-50/50">
            <h2 class="text-xl font-bold text-slate-900">Contact & Social</h2>
            <p class="text-sm text-slate-500">How customers can reach you.</p>
          </div>
          <div class="p-8 space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-xs font-black text-slate-400 uppercase tracking-widest">Public Email</label>
                <div class="relative">
                  <Mail class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input v-model="form.contact.email" type="email" class="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
                </div>
              </div>
              <div class="space-y-2">
                <label class="text-xs font-black text-slate-400 uppercase tracking-widest">Phone Number</label>
                <div class="relative">
                  <Phone class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input v-model="form.contact.phone" type="tel" class="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
                </div>
              </div>
              <div class="space-y-2">
                <label class="text-xs font-black text-slate-400 uppercase tracking-widest">WhatsApp</label>
                <div class="relative">
                  <MessageCircle class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input v-model="form.contact.whatsapp" type="tel" class="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
                </div>
              </div>
              <div class="space-y-2">
                <label class="text-xs font-black text-slate-400 uppercase tracking-widest">Website</label>
                <div class="relative">
                  <Globe class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input v-model="form.contact.website" type="text" class="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
                </div>
              </div>
              <div class="space-y-2">
                <label class="text-xs font-black text-slate-400 uppercase tracking-widest">Instagram</label>
                <div class="relative">
                  <Instagram class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input v-model="form.contact.instagram" type="text" class="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
                </div>
              </div>
              <div class="space-y-2">
                <label class="text-xs font-black text-slate-400 uppercase tracking-widest">Facebook</label>
                <div class="relative">
                  <Facebook class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input v-model="form.contact.facebook" type="text" class="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Hours -->
        <div v-if="activeTab === 'hours'" class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div class="p-6 border-b border-slate-100 bg-slate-50/50">
            <h2 class="text-xl font-bold text-slate-900">Operating Hours</h2>
            <p class="text-sm text-slate-500">Set your weekly schedule.</p>
          </div>
          <div class="p-8 space-y-4">
            <div v-for="(schedule, index) in form.schedules" :key="index"
                 class="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl border border-slate-50"
                 :class="{ 'bg-slate-50/30': schedule.closed }">
              <div class="w-32 font-bold text-slate-700">{{ days[schedule.day] }}</div>

              <div class="flex items-center gap-4 flex-1">
                <template v-if="!schedule.closed">
                  <input v-model="schedule.opens" type="time" class="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                  <span class="text-slate-400 text-xs font-bold uppercase">to</span>
                  <input v-model="schedule.closes" type="time" class="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                </template>
                <div v-else class="flex-1 text-slate-400 text-sm font-medium italic">Closed all day</div>
              </div>

              <label class="flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" v-model="schedule.closed" class="w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary" />
                <span class="text-sm font-bold text-slate-600">Closed</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Booking Config -->
        <div v-if="activeTab === 'booking'" class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div class="p-6 border-b border-slate-100 bg-slate-50/50">
            <h2 class="text-xl font-bold text-slate-900">Booking Configuration</h2>
            <p class="text-sm text-slate-500">Control how customers book your services.</p>
          </div>
          <div class="p-8 space-y-8">
            <div class="space-y-6">
              <div class="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div>
                  <h3 class="font-bold text-slate-900">Instant Confirmation</h3>
                  <p class="text-xs text-slate-500">Approve bookings automatically without manual review.</p>
                </div>
                <input type="checkbox" v-model="form.bookingConfig.instantConfirmation" class="w-6 h-6 text-primary rounded-lg border-slate-300 focus:ring-primary" />
              </div>

              <div class="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div>
                  <h3 class="font-bold text-slate-900">Require Deposit</h3>
                  <p class="text-xs text-slate-500">Customers must pay a deposit to secure their booking.</p>
                </div>
                <input type="checkbox" v-model="form.bookingConfig.requiresDeposit" class="w-6 h-6 text-primary rounded-lg border-slate-300 focus:ring-primary" />
              </div>

              <div v-if="form.bookingConfig.requiresDeposit" class="space-y-2 pl-4 border-l-2 border-primary/20">
                <label class="text-xs font-black text-slate-400 uppercase tracking-widest">Deposit Percentage (%)</label>
                <input v-model.number="form.bookingConfig.depositPercentage" type="number" min="0" max="100" class="w-32 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
              </div>
            </div>

            <div class="grid grid-cols-1 gap-6">
              <div class="space-y-2">
                <label class="text-xs font-black text-slate-400 uppercase tracking-widest">Minimum Notice (Minutes)</label>
                <input v-model.number="form.bookingConfig.minimumNoticeMinutes" type="number" class="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
                <p class="text-[10px] text-slate-400">Prevent last-minute bookings. E.g., 60 means customers can't book less than an hour in advance.</p>
              </div>
              <div class="space-y-2">
                <label class="text-xs font-black text-slate-400 uppercase tracking-widest">Cancellation Policy</label>
                <textarea v-model="form.bookingConfig.cancellationPolicy" rows="3" class="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none resize-none" placeholder="e.g. Free cancellation up to 24 hours before the appointment."></textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- Media -->
        <div v-if="activeTab === 'media'" class="space-y-8">
          <!-- Logo -->
          <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div class="p-6 border-b border-slate-100 bg-slate-50/50">
              <h2 class="text-xl font-bold text-slate-900">Venue Logo</h2>
              <p class="text-sm text-slate-500">Your profile picture shown in search results.</p>
            </div>
            <div class="p-8">
              <div class="flex items-center gap-8">
                <div class="relative group">
                  <div v-if="logoUrl" class="w-32 h-32 rounded-2xl overflow-hidden border-2 border-slate-100">
                    <img :src="logoUrl" class="w-full h-full object-cover" />
                  </div>
                  <div v-else class="w-32 h-32 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400">
                    <Camera class="w-10 h-10" />
                  </div>
                  <label class="absolute -bottom-2 -right-2 p-2 bg-primary text-white rounded-xl shadow-lg cursor-pointer hover:scale-105 transition-transform">
                    <Plus class="w-4 h-4" />
                    <input type="file" class="hidden" accept="image/*" @change="handleLogoUpload" />
                  </label>
                </div>
                <div class="flex-1">
                  <h3 class="font-bold text-slate-900 mb-1">Upload New Logo</h3>
                  <p class="text-xs text-slate-500 mb-4">Recommended size: 512x512px. Square aspect ratio works best.</p>
                  <div v-if="uploading" class="flex items-center gap-2 text-primary text-sm font-bold">
                    <Loader2 class="w-4 h-4 animate-spin" />
                    Uploading...
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Gallery -->
          <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div class="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div>
                <h2 class="text-xl font-bold text-slate-900">Photo Gallery</h2>
                <p class="text-sm text-slate-500">Showcase your venue and work.</p>
              </div>
              <label class="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl cursor-pointer hover:bg-slate-800 transition-colors">
                Add Photos
                <input type="file" class="hidden" multiple accept="image/*" @change="handleGalleryUpload" />
              </label>
            </div>
            <div class="p-8">
              <div v-if="galleryMedia.length === 0" class="flex flex-col items-center justify-center py-10 border-2 border-dashed border-slate-100 rounded-2xl">
                <ImageIcon class="w-10 h-10 text-slate-200 mb-2" />
                <p class="text-sm text-slate-400 font-medium">No photos in gallery yet</p>
              </div>
              <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div v-for="item in galleryMedia" :key="item.id" class="relative group aspect-square rounded-xl overflow-hidden border border-slate-100">
                  <img :src="item.url" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button @click="removeMedia(item.id)" class="p-2 bg-white text-red-500 rounded-lg hover:bg-red-50 transition-colors">
                      <Trash2 class="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
