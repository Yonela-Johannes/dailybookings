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
  Star
} from 'lucide-vue-next'

definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const venues = ref([
  { id: 1, name: 'Zen Harmony Spa', owner: 'Alice Johnson', status: 'verified', location: 'San Francisco, CA', rating: 4.8, revenue: '$12,400' },
  { id: 2, name: 'Downtown Cuts', owner: 'Bob Smith', status: 'pending', location: 'New York, NY', rating: 0, revenue: '$0' },
  { id: 3, name: 'FitLife Gym', owner: 'Charlie Brown', status: 'suspended', location: 'Austin, TX', rating: 4.2, revenue: '$8,200' },
  { id: 4, name: 'Serenity Nails', owner: 'Diana Prince', status: 'verified', location: 'Chicago, IL', rating: 4.9, revenue: '$15,100' },
])

const getStatusStyles = (status: string) => {
  switch (status) {
    case 'verified': return 'bg-teal-500/10 text-teal-500 border-teal-500/20'
    case 'pending': return 'bg-amber-500/10 text-amber-500 border-amber-500/20'
    case 'suspended': return 'bg-red-500/10 text-red-500 border-red-500/20'
    default: return 'bg-slate-800 text-slate-400 border-slate-700'
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
            type="text"
            placeholder="Search by name, owner or location..."
            class="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:ring-2 focus:ring-teal-500/20 outline-none"
          />
        </div>
        <div class="flex items-center gap-2 w-full sm:w-auto">
          <select class="bg-slate-900 border border-slate-800 text-slate-400 text-xs font-bold px-4 py-2 rounded-xl focus:ring-2 focus:ring-teal-500/20 outline-none flex-1 sm:flex-none">
            <option>All Statuses</option>
            <option>Verified</option>
            <option>Pending</option>
            <option>Suspended</option>
          </select>
          <button class="p-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-400 hover:text-white transition-colors">
            <Filter class="w-5 h-5" />
          </button>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-slate-800 bg-slate-950">
              <th class="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Venue</th>
              <th class="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Owner</th>
              <th class="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
              <th class="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Revenue</th>
              <th class="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800">
            <tr v-for="venue in venues" :key="venue.id" class="hover:bg-slate-900/50 transition-colors group">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-teal-500 font-bold">
                    {{ venue.name.charAt(0) }}
                  </div>
                  <div>
                    <div class="font-bold text-white flex items-center gap-2">
                      {{ venue.name }}
                      <NuxtLink :to="`/venue/${venue.id}`" target="_blank" class="opacity-0 group-hover:opacity-100 transition-opacity">
                        <ExternalLink class="w-3 h-3 text-slate-500 hover:text-teal-400" />
                      </NuxtLink>
                    </div>
                    <div class="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin class="w-3 h-3" />
                      {{ venue.location }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-slate-300">{{ venue.owner }}</div>
                <div class="text-[10px] font-bold text-slate-600 uppercase">Registered Apr 2024</div>
              </td>
              <td class="px-6 py-4">
                <span :class="['px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest rounded-full border', getStatusStyles(venue.status)]">
                  {{ venue.status }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="text-sm font-bold text-white">{{ venue.revenue }}</div>
                <div class="flex items-center justify-end gap-1 text-[10px] font-bold text-slate-500">
                  <Star class="w-3 h-3 text-amber-500 fill-amber-500" />
                  {{ venue.rating || 'N/A' }}
                </div>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button v-if="venue.status !== 'verified'" class="p-2 text-teal-500 hover:bg-teal-500/10 rounded-lg transition-colors" title="Verify">
                    <CheckCircle2 class="w-5 h-5" />
                  </button>
                  <button v-if="venue.status !== 'suspended'" class="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors" title="Suspend">
                    <XCircle class="w-5 h-5" />
                  </button>
                  <button class="p-2 text-slate-500 hover:text-white rounded-lg hover:bg-slate-800 transition-colors">
                    <MoreVertical class="w-5 h-5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="p-6 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
        <div class="text-xs font-bold text-slate-500 uppercase tracking-widest">Showing 4 of 1,204 venues</div>
        <div class="flex items-center gap-2">
          <button class="px-4 py-2 bg-slate-900 border border-slate-800 text-slate-500 font-bold rounded-lg cursor-not-allowed">Previous</button>
          <button class="px-4 py-2 bg-slate-900 border border-slate-800 text-white font-bold rounded-lg hover:bg-slate-800 transition-colors">Next</button>
        </div>
      </div>
    </div>
  </div>
</template>
