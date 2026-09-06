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
  ChevronRight,
  Info
} from 'lucide-vue-next'

definePageMeta({
  layout: 'business',
  middleware: 'auth'
})

const venue = ref({
  name: 'Zen Harmony Spa',
  tagline: 'Premium Wellness & Relaxation',
  email: 'hello@zenharmony.com',
  phone: '+1 (555) 000-1111',
  website: 'www.zenharmony.com',
  address: {
    street: '123 Wellness Way',
    city: 'San Francisco',
    state: 'CA',
    zip: '94103'
  },
  description: 'We provide high-quality massage therapy and facial treatments in a serene environment.'
})

const activeTab = ref('general')
const tabs = [
  { id: 'general', label: 'General Info', icon: Info },
  { id: 'location', label: 'Location', icon: MapPin },
  { id: 'hours', label: 'Operating Hours', icon: Clock },
  { id: 'billing', label: 'Subscriptions', icon: CreditCard },
  { id: 'security', label: 'Security', icon: Shield },
]

const saving = ref(false)
const handleSave = () => {
  saving.value = true
  setTimeout(() => saving.value = false, 1000)
}
</script>

<template>
  <div class="space-y-8">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-extrabold text-slate-900">Settings</h1>
        <p class="text-slate-500">Manage your venue profile and business preferences.</p>
      </div>
      <UiButton label="Save Changes" :loading="saving" :icon="Save" @click="handleSave" />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <!-- Tabs Navigation -->
      <div class="lg:col-span-1 space-y-1">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="['w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition-all', activeTab === tab.id ? 'bg-white text-primary shadow-sm border border-slate-100' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50']"
        >
          <component :is="tab.icon" class="w-5 h-5" />
          {{ tab.label }}
        </button>
      </div>

      <!-- Settings Form -->
      <div class="lg:col-span-3 space-y-8">
        <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div class="p-6 border-b border-slate-100">
            <h2 class="text-xl font-bold text-slate-900">Venue Profile</h2>
            <p class="text-sm text-slate-500">This information will be visible to your customers.</p>
          </div>

          <div class="p-8 space-y-8">
            <!-- Logo/Cover Upload -->
            <div class="flex flex-col sm:flex-row items-center gap-8">
              <div class="relative group">
                <div class="w-24 h-24 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 group-hover:border-primary group-hover:bg-blue-50/50 transition-all">
                  <Camera class="w-8 h-8" />
                </div>
                <button class="absolute -bottom-2 -right-2 p-1.5 bg-white border border-slate-200 rounded-lg shadow-sm text-primary hover:bg-slate-50 transition-colors">
                  <Edit2 class="w-4 h-4" />
                </button>
              </div>
              <div class="flex-1 text-center sm:text-left">
                <h3 class="font-bold text-slate-900 mb-1">Venue Logo</h3>
                <p class="text-xs text-slate-500 mb-4">Recommended size: 512x512px. PNG, JPG or WEBP.</p>
                <UiButton label="Upload New Photo" type="outline" class="!py-1.5 !px-4 !text-xs" />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-xs font-black text-slate-400 uppercase tracking-widest">Venue Name</label>
                <input v-model="venue.name" type="text" class="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
              </div>
              <div class="space-y-2">
                <label class="text-xs font-black text-slate-400 uppercase tracking-widest">Tagline</label>
                <input v-model="venue.tagline" type="text" class="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
              </div>
              <div class="md:col-span-2 space-y-2">
                <label class="text-xs font-black text-slate-400 uppercase tracking-widest">Description</label>
                <textarea v-model="venue.description" rows="4" class="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none resize-none"></textarea>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="space-y-2">
                <label class="text-xs font-black text-slate-400 uppercase tracking-widest">Email Address</label>
                <div class="relative">
                  <Mail class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input v-model="venue.email" type="email" class="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
                </div>
              </div>
              <div class="space-y-2">
                <label class="text-xs font-black text-slate-400 uppercase tracking-widest">Phone Number</label>
                <div class="relative">
                  <Phone class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input v-model="venue.phone" type="tel" class="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
                </div>
              </div>
              <div class="space-y-2">
                <label class="text-xs font-black text-slate-400 uppercase tracking-widest">Website</label>
                <div class="relative">
                  <Globe class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input v-model="venue.website" type="text" class="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Danger Zone -->
        <div class="bg-red-50/50 rounded-2xl border border-red-100 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 class="text-red-700 font-bold">Delete Venue</h3>
            <p class="text-xs text-red-600/70">Permanently remove your venue and all associated data from the platform.</p>
          </div>
          <button class="px-6 py-2 bg-white border border-red-200 text-red-600 text-sm font-bold rounded-xl hover:bg-red-50 transition-colors">
            Deactivate Venue
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
