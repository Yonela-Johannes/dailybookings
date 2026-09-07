<script setup lang="ts">
import {
  Search,
  Filter,
  Calendar,
  Clock,
  User,
  Store,
  CreditCard,
  MoreVertical,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Download
} from 'lucide-vue-next'
import { format, parseISO } from 'date-fns'

definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const statusFilter = ref('')
const page = ref(1)

const { data: bookingsData, pending, refresh } = useFetch('/api/admin/bookings', {
  query: {
    status: statusFilter,
    page,
    limit: 10
  },
  watch: [statusFilter, page]
})

const bookings = computed(() => bookingsData.value?.data || [])
const meta = computed(() => bookingsData.value?.meta || { total: 0, page: 1, totalPages: 1 })

const getStatusColor = (status: string) => {
  switch (status.toUpperCase()) {
    case 'CONFIRMED':
    case 'COMPLETED': return 'text-teal-400 bg-teal-400/10 border-teal-400/20'
    case 'PENDING': return 'text-amber-400 bg-amber-400/10 border-amber-400/20'
    case 'CANCELLED': return 'text-red-400 bg-red-400/10 border-red-400/20'
    default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20'
  }
}
</script>

<template>
  <div class="space-y-8">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-extrabold text-white uppercase italic tracking-tight">Global Bookings</h1>
        <p class="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Unified Platform Transaction Log</p>
      </div>
      <button class="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white font-black rounded-xl hover:bg-slate-800 transition-all border border-slate-800 uppercase tracking-widest text-xs">
        <Download class="w-4 h-4" />
        Export CSV
      </button>
    </div>

    <!-- Table Container -->
    <div class="bg-slate-950/50 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
      <div class="p-6 border-b border-slate-800 bg-slate-900/50 flex flex-col sm:flex-row items-center gap-4">
        <div class="flex items-center gap-4 w-full sm:w-auto">
          <select v-model="statusFilter" class="bg-slate-900 border border-slate-800 text-slate-400 text-xs font-bold px-5 py-3 rounded-xl focus:ring-2 focus:ring-teal-500/20 outline-none w-full sm:w-48 appearance-none cursor-pointer">
            <option value="">All Transactions</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
        <div class="flex-1"></div>
        <button @click="refresh" class="p-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-400 hover:text-white transition-colors">
          <Filter class="w-5 h-5" />
        </button>
      </div>

      <div class="overflow-x-auto min-h-[500px]">
        <div v-if="pending" class="flex items-center justify-center py-40">
          <Loader2 class="w-10 h-10 text-teal-500 animate-spin" />
        </div>

        <table v-else class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-slate-800 bg-slate-950/40">
              <th class="px-8 py-5 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Transaction ID</th>
              <th class="px-8 py-5 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Client</th>
              <th class="px-8 py-5 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Venue</th>
              <th class="px-8 py-5 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Schedule</th>
              <th class="px-8 py-5 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Status</th>
              <th class="px-8 py-5 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Value</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800/50">
            <tr v-for="booking in bookings" :key="booking.id" class="hover:bg-slate-900/40 transition-all group">
              <td class="px-8 py-6 font-mono text-[10px] text-slate-600 group-hover:text-teal-500 transition-colors uppercase">
                #{{ booking.id.slice(-8) }}
              </td>
              <td class="px-8 py-6">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-teal-500 font-bold text-xs">
                    {{ booking.user?.fullName?.[0] || 'G' }}
                  </div>
                  <div>
                    <div class="text-xs font-bold text-white">{{ booking.user?.fullName || 'Guest' }}</div>
                    <div class="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{{ booking.user?.email }}</div>
                  </div>
                </div>
              </td>
              <td class="px-8 py-6">
                <div class="text-xs font-bold text-slate-300">{{ booking.venue?.name }}</div>
                <div class="text-[9px] text-slate-600 font-black uppercase tracking-tighter italic">Slug: {{ booking.venue?.slug }}</div>
              </td>
              <td class="px-8 py-6">
                <div class="flex items-center gap-2 text-xs font-bold text-slate-400">
                  <Calendar class="w-3 h-3 text-slate-600" />
                  {{ format(parseISO(booking.date), 'PP') }}
                </div>
                <div class="flex items-center gap-2 text-[10px] text-slate-500 mt-1 font-black uppercase">
                  <Clock class="w-3 h-3 text-slate-700" />
                  {{ booking.startTime }} - {{ booking.endTime }}
                </div>
              </td>
              <td class="px-8 py-6">
                <span :class="['px-3 py-1 text-[9px] font-black uppercase rounded-full border tracking-[0.1em]', getStatusColor(booking.status)]">
                  {{ booking.status }}
                </span>
              </td>
              <td class="px-8 py-6 text-right">
                <div class="text-sm font-black text-white italic tracking-tighter">R{{ booking.priceTotal.toLocaleString() }}</div>
                <div class="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1">{{ booking.services?.length }} Service(s)</div>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="bookings.length === 0 && !pending" class="p-20 text-center text-slate-500">
           <div class="mb-4 flex justify-center opacity-20">
              <CreditCard class="w-16 h-16" />
           </div>
           <p class="font-bold uppercase tracking-widest text-xs">No transactions recorded in this cycle</p>
        </div>
      </div>

      <!-- Pagination -->
      <div class="p-8 bg-slate-950/40 border-t border-slate-800 flex items-center justify-between">
        <div class="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
          Page {{ meta.page }} of {{ meta.totalPages }} <span class="mx-2 text-slate-800">|</span> {{ meta.total }} Records
        </div>
        <div class="flex items-center gap-3">
          <button
            :disabled="page === 1"
            @click="page--"
            class="p-2 bg-slate-900 border border-slate-800 text-slate-500 font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800 transition-all"
          >
            <ChevronLeft class="w-5 h-5" />
          </button>
          <button
            :disabled="page >= meta.totalPages"
            @click="page++"
            class="p-2 bg-slate-900 border border-slate-800 text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800 transition-all"
          >
            <ChevronRight class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
