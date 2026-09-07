<script setup lang="ts">
import {
  Search,
  Filter,
  MoreVertical,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ExternalLink,
  MapPin,
  Star,
  Loader2,
  Clock,
  User,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Plus
} from 'lucide-vue-next'
import { format, parseISO } from 'date-fns'

definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const search = ref('')
const statusFilter = ref('')
const page = ref(1)

const { data: venuesData, pending, refresh } = useFetch('/api/admin/venues', {
  query: {
    search,
    status: statusFilter,
    page,
    limit: 10
  },
  watch: [search, statusFilter, page]
})

const venues = computed(() => venuesData.value?.venues || [])
const meta = computed(() => venuesData.value?.meta || { total: 0, page: 1, totalPages: 1 })

const getStatusStyles = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'active': return 'bg-teal-500/10 text-teal-500 border-teal-500/20 shadow-[0_0_8px_rgba(20,184,166,0.1)]'
    case 'pending': return 'bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-[0_0_8px_rgba(245,158,11,0.1)]'
    case 'suspended': return 'bg-red-500/10 text-red-500 border-red-500/20 shadow-[0_0_8px_rgba(239,68,68,0.1)]'
    default: return 'bg-slate-800 text-slate-400 border-slate-700'
  }
}

const updateStatus = async (venueId: string, status: string) => {
  try {
    await $fetch(`/api/admin/venues/${venueId}/verify`, {
      method: 'PATCH',
      body: { status }
    })
    refresh()
  } catch (error) {
    console.error('Failed to update venue status:', error)
  }
}

const toggleVerification = async (venueId: string, verified: boolean) => {
  try {
    await $fetch(`/api/admin/venues/${venueId}/verify`, {
      method: 'PATCH',
      body: { verified }
    })
    refresh()
  } catch (error) {
    console.error('Failed to toggle verification:', error)
  }
}
</script>

<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div class="space-y-1">
        <h1 class="text-3xl font-black text-white uppercase italic tracking-tight">Venue Moderation</h1>
        <p class="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Business Network Trust Authority</p>
      </div>
      <div class="flex items-center gap-3">
        <div class="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
           Total Nodes: {{ meta.total }}
        </div>
      </div>
    </div>

    <!-- Table Container -->
    <div class="bg-slate-950/50 border border-slate-800 rounded-[32px] overflow-hidden shadow-2xl">
      <div class="p-6 border-b border-slate-800 bg-slate-900/50 flex flex-col sm:flex-row items-center gap-6">
        <div class="relative flex-1 w-full max-w-sm">
          <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            v-model="search"
            type="text"
            placeholder="Filter by name, slug, or owner..."
            class="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-white focus:ring-2 focus:ring-teal-500/20 outline-none transition-all placeholder:text-slate-600 font-bold"
          />
        </div>
        <div class="flex items-center gap-3 w-full sm:w-auto">
          <select v-model="statusFilter" class="bg-slate-900 border border-slate-800 text-slate-400 text-xs font-black px-6 py-3 rounded-2xl focus:ring-2 focus:ring-teal-500/20 outline-none w-full sm:w-48 appearance-none cursor-pointer uppercase tracking-widest text-center">
            <option value="">Global Status</option>
            <option value="ACTIVE">Operational</option>
            <option value="PENDING">Awaiting Audit</option>
            <option value="SUSPENDED">Terminated</option>
          </select>
          <button @click="refresh" class="p-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-400 hover:text-white transition-all">
            <Filter class="w-5 h-5" />
          </button>
        </div>
      </div>

      <div class="overflow-x-auto min-h-[500px]">
        <div v-if="pending" class="flex items-center justify-center py-40">
          <Loader2 class="w-10 h-10 text-teal-500 animate-spin" />
        </div>

        <table v-else class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-slate-800 bg-slate-950/40">
              <th class="px-8 py-5 text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">Business Entity</th>
              <th class="px-8 py-5 text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">Owner Authority</th>
              <th class="px-8 py-5 text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">Operational Status</th>
              <th class="px-8 py-5 text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] text-right">Ecosystem Value</th>
              <th class="px-8 py-5 text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800/50">
            <tr v-for="venue in venues" :key="venue.id" class="hover:bg-slate-900/40 transition-all group">
              <td class="px-8 py-6">
                <div class="flex items-center gap-5">
                  <div class="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-teal-400 font-black text-xl overflow-hidden shadow-inner relative group-hover:border-teal-500/50 transition-all duration-500">
                    <img v-if="venue.media?.[0]?.url" :src="venue.media[0].url" class="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                    <template v-else>{{ venue.name.charAt(0) }}</template>
                  </div>
                  <div class="min-w-0">
                    <div class="font-black text-white flex items-center gap-3 text-lg italic tracking-tight truncate">
                      {{ venue.name }}
                      <NuxtLink :to="`/venue/${venue.slug}`" target="_blank" title="View Public Page">
                        <ExternalLink class="w-4 h-4 text-slate-600 hover:text-teal-400 transition-colors" />
                      </NuxtLink>
                    </div>
                    <div class="text-[10px] text-slate-500 flex items-center gap-2 mt-1 font-bold uppercase tracking-widest">
                      <MapPin class="w-3 h-3 text-teal-500" />
                      {{ venue.address?.city || 'N/A' }} <span class="text-slate-800">/</span> {{ venue.category?.name || 'Standard' }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-8 py-6">
                <div class="flex items-center gap-3">
                   <div class="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 font-bold text-[10px]">
                      {{ venue.business?.owner?.fullName?.[0] || 'O' }}
                   </div>
                   <div class="min-w-0">
                      <div class="text-xs font-black text-slate-300 truncate uppercase tracking-widest">{{ venue.business?.owner?.fullName || 'Root Owner' }}</div>
                      <div class="text-[9px] text-slate-600 font-bold truncate">{{ venue.business?.owner?.email }}</div>
                   </div>
                </div>
              </td>
              <td class="px-8 py-6">
                 <div class="flex flex-col gap-2">
                    <span :class="['inline-flex w-fit px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full border', getStatusStyles(venue.status)]">
                      {{ venue.status }}
                    </span>
                    <button
                      @click="toggleVerification(venue.id, !venue.business?.verified)"
                      :class="['text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-colors', venue.business?.verified ? 'text-teal-500' : 'text-slate-600 hover:text-white']"
                    >
                       <ShieldCheck :class="['w-3 h-3', venue.business?.verified ? 'fill-teal-500/20' : '']" />
                       {{ venue.business?.verified ? 'Verified Business' : 'Unverified Identity' }}
                    </button>
                 </div>
              </td>
              <td class="px-8 py-6 text-right">
                <div class="text-lg font-black text-white italic tracking-tighter">{{ venue._count?.bookings }} <span class="text-[10px] font-bold text-slate-600 not-italic uppercase tracking-widest ml-1">Orders</span></div>
                <div class="flex items-center justify-end gap-1.5 text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">
                  <Star class="w-3 h-3 text-amber-500 fill-amber-500" />
                  {{ venue.rating.toFixed(1) }} <span class="text-slate-800">|</span> {{ venue._count?.reviews }} Feedbacks
                </div>
              </td>
              <td class="px-8 py-6 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button
                    v-if="venue.status === 'PENDING' || venue.status === 'SUSPENDED'"
                    @click="updateStatus(venue.id, 'ACTIVE')"
                    class="p-2.5 bg-teal-500/10 text-teal-500 border border-teal-500/20 rounded-xl hover:bg-teal-500 hover:text-slate-950 transition-all shadow-lg shadow-teal-500/5"
                    title="Activate Node"
                  >
                    <CheckCircle2 class="w-5 h-5" />
                  </button>
                  <button
                    v-if="venue.status !== 'SUSPENDED'"
                    @click="updateStatus(venue.id, 'SUSPENDED')"
                    class="p-2.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-500/5"
                    title="Suspend Node"
                  >
                    <XCircle class="w-5 h-5" />
                  </button>
                  <button class="p-2.5 bg-slate-900 text-slate-500 hover:text-white border border-slate-800 rounded-xl transition-all">
                    <MoreVertical class="w-5 h-5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="venues.length === 0 && !pending" class="p-40 text-center text-slate-500">
           <div class="mb-6 flex justify-center opacity-10">
              <Store class="w-24 h-24" />
           </div>
           <p class="font-black uppercase tracking-[0.3em] text-xs">No matching ecosystem nodes detected</p>
        </div>
      </div>

      <!-- Pagination -->
      <div class="p-8 bg-slate-950/40 border-t border-slate-800 flex items-center justify-between">
        <div class="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">
          Sector {{ meta.page }} / {{ meta.totalPages }} <span class="mx-3 text-slate-800">|</span> Global Map: {{ meta.total }} Entities
        </div>
        <div class="flex items-center gap-4">
          <button
            :disabled="page === 1"
            @click="page--"
            class="p-3 bg-slate-900 border border-slate-800 text-slate-500 font-bold rounded-2xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800 transition-all shadow-lg"
          >
            <ChevronLeft class="w-5 h-5" />
          </button>
          <button
            :disabled="page >= meta.totalPages"
            @click="page++"
            class="p-3 bg-slate-900 border border-slate-800 text-white font-bold rounded-2xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800 transition-all shadow-lg"
          >
            <ChevronRight class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
