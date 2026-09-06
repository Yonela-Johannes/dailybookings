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
  Loader2
} from 'lucide-vue-next'

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
  switch (status.toLowerCase()) {
    case 'active':
    case 'verified': return 'bg-teal-500/10 text-teal-500 border-teal-500/20'
    case 'pending': return 'bg-amber-500/10 text-amber-500 border-amber-500/20'
    case 'suspended': return 'bg-red-500/10 text-red-500 border-red-500/20'
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
</script>

<template>
  <div class="space-y-8">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-extrabold text-white">Venue Management</h1>
        <p class="text-slate-500">Monitor, verify, and manage all venues on the platform.</p>
      </div>
      <div class="flex items-center gap-3">
        <button class="px-6 py-2.5 bg-teal-500 text-slate-950 font-black rounded-xl hover:bg-teal-400 transition-all shadow-lg shadow-teal-500/20">
          Export Data
        </button>
      </div>
    </div>

    <!-- Table Container -->
    <div class="bg-slate-950/50 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      <div class="p-4 border-b border-slate-800 bg-slate-900/50 flex flex-col sm:flex-row items-center gap-4">
        <div class="relative flex-1 w-full">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            v-model="search"
            type="text"
            placeholder="Search by name or slug..."
            class="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:ring-2 focus:ring-teal-500/20 outline-none"
          />
        </div>
        <div class="flex items-center gap-2 w-full sm:w-auto">
          <select v-model="statusFilter" class="bg-slate-900 border border-slate-800 text-slate-400 text-xs font-bold px-4 py-2 rounded-xl focus:ring-2 focus:ring-teal-500/20 outline-none flex-1 sm:flex-none">
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="PENDING">Pending</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
          <button @click="refresh" class="p-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-400 hover:text-white transition-colors">
            <Filter class="w-5 h-5" />
          </button>
        </div>
      </div>

      <div class="overflow-x-auto min-h-[400px]">
        <div v-if="pending" class="flex items-center justify-center py-20">
          <Loader2 class="w-8 h-8 text-teal-500 animate-spin" />
        </div>
        <table v-else class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-slate-800 bg-slate-950">
              <th class="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Venue</th>
              <th class="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Owner</th>
              <th class="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
              <th class="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Activity</th>
              <th class="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800">
            <tr v-for="venue in venues" :key="venue.id" class="hover:bg-slate-900/50 transition-colors group">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-teal-500 font-bold overflow-hidden">
                    <img v-if="venue.image" :src="venue.image" class="w-full h-full object-cover" />
                    <template v-else>{{ venue.name.charAt(0) }}</template>
                  </div>
                  <div>
                    <div class="font-bold text-white flex items-center gap-2">
                      {{ venue.name }}
                      <NuxtLink :to="`/venue/${venue.slug}`" target="_blank" class="opacity-0 group-hover:opacity-100 transition-opacity">
                        <ExternalLink class="w-3 h-3 text-slate-500 hover:text-teal-400" />
                      </NuxtLink>
                    </div>
                    <div class="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin class="w-3 h-3" />
                      {{ venue.city }}, {{ venue.country }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-slate-300">{{ venue.business?.owner?.fullName || 'N/A' }}</div>
                <div class="text-[10px] font-bold text-slate-600 uppercase">{{ venue.business?.owner?.email }}</div>
              </td>
              <td class="px-6 py-4">
                <span :class="['px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest rounded-full border', getStatusStyles(venue.status)]">
                  {{ venue.status }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="text-sm font-bold text-white">{{ venue._count?.bookings }} Bookings</div>
                <div class="flex items-center justify-end gap-1 text-[10px] font-bold text-slate-500">
                  <Star class="w-3 h-3 text-amber-500 fill-amber-500" />
                  {{ venue._count?.reviews }} Reviews
                </div>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button
                    v-if="venue.status === 'PENDING'"
                    @click="updateStatus(venue.id, 'ACTIVE')"
                    class="p-2 text-teal-500 hover:bg-teal-500/10 rounded-lg transition-colors"
                    title="Verify"
                  >
                    <CheckCircle2 class="w-5 h-5" />
                  </button>
                  <button
                    v-if="venue.status !== 'SUSPENDED'"
                    @click="updateStatus(venue.id, 'SUSPENDED')"
                    class="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Suspend"
                  >
                    <XCircle class="w-5 h-5" />
                  </button>
                  <button
                    v-if="venue.status === 'SUSPENDED'"
                    @click="updateStatus(venue.id, 'ACTIVE')"
                    class="p-2 text-amber-500 hover:bg-amber-500/10 rounded-lg transition-colors"
                    title="Reactivate"
                  >
                    <AlertTriangle class="w-5 h-5" />
                  </button>
                  <button class="p-2 text-slate-500 hover:text-white rounded-lg hover:bg-slate-800 transition-colors">
                    <MoreVertical class="w-5 h-5" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="venues.length === 0 && !pending">
              <td colspan="5" class="px-6 py-20 text-center text-slate-500">
                No venues found matching your filters.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="p-6 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
        <div class="text-xs font-bold text-slate-500 uppercase tracking-widest">
          Showing {{ venues.length }} of {{ meta.total }} venues
        </div>
        <div class="flex items-center gap-2">
          <button
            :disabled="page === 1"
            @click="page--"
            class="px-4 py-2 bg-slate-900 border border-slate-800 text-slate-500 font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors"
          >
            Previous
          </button>
          <button
            :disabled="page >= meta.totalPages"
            @click="page++"
            class="px-4 py-2 bg-slate-900 border border-slate-800 text-white font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
