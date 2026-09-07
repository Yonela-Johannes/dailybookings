<script setup lang="ts">
import {
  Users,
  Store,
  CreditCard,
  TrendingUp,
  AlertCircle,
  Clock,
  ShieldCheck,
  MoreVertical,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  CheckCircle2,
  XCircle,
  UserPlus
} from 'lucide-vue-next'
import { format, parseISO } from 'date-fns'

definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const { data: adminStats, pending: statsPending } = useFetch('/api/admin')
const { data: pendingVenuesData, pending: venuesPending } = useFetch('/api/admin/venues', {
  query: { status: 'PENDING', limit: 5 }
})

const stats = computed(() => [
  { label: 'Total Users', value: adminStats.value?.totalUsers?.toLocaleString() || '0', change: '+2.5%', trend: 'up', icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { label: 'Active Venues', value: adminStats.value?.totalVenues?.toLocaleString() || '0', change: '+4.2%', trend: 'up', icon: Store, color: 'text-teal-400', bg: 'bg-teal-400/10' },
  { label: 'Total Bookings', value: adminStats.value?.totalBookings?.toLocaleString() || '0', change: '+12.5%', trend: 'up', icon: Calendar, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  { label: 'Revenue', value: `R${(adminStats.value?.totalRevenue || 0).toLocaleString()}`, change: '+8.2%', trend: 'up', icon: TrendingUp, color: 'text-amber-400', bg: 'bg-amber-400/10' },
])

const pendingVerifications = computed(() => pendingVenuesData.value?.venues || [])

const getStatusColor = (status: string) => {
  switch (status.toUpperCase()) {
    case 'CONFIRMED':
    case 'COMPLETED':
    case 'ACTIVE': return 'text-teal-400 bg-teal-400/10 border-teal-400/20'
    case 'PENDING': return 'text-amber-400 bg-amber-400/10 border-amber-400/20'
    case 'CANCELLED':
    case 'SUSPENDED': return 'text-red-400 bg-red-400/10 border-red-400/20'
    default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20'
  }
}
</script>

<template>
  <div class="space-y-10 pb-20">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div class="space-y-1">
        <h1 class="text-4xl font-black text-white italic tracking-tighter uppercase">Platform Master</h1>
        <p class="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Real-time Ecosystem Intelligence</p>
      </div>
      <div class="flex items-center gap-3">
         <div class="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-3">
            <div class="w-2 h-2 rounded-full bg-teal-500 animate-pulse shadow-[0_0_8px_rgba(20,184,166,0.8)]"></div>
            <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Network Operational</span>
         </div>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <template v-if="statsPending">
        <div v-for="i in 4" :key="i" class="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl animate-pulse">
          <div class="h-12 w-12 bg-slate-800 rounded-2xl mb-6"></div>
          <div class="h-4 w-24 bg-slate-800 rounded mb-3"></div>
          <div class="h-8 w-16 bg-slate-800 rounded"></div>
        </div>
      </template>

      <div v-else v-for="stat in stats" :key="stat.label"
        class="bg-slate-900/40 border border-slate-800 p-8 rounded-3xl group hover:border-teal-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-teal-500/5 relative overflow-hidden"
      >
        <div class="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
           <component :is="stat.icon" class="w-24 h-24 rotate-12" />
        </div>

        <div class="flex items-center justify-between mb-8 relative z-10">
          <div :class="['w-14 h-14 rounded-2xl flex items-center justify-center border transition-transform duration-500 group-hover:scale-110', stat.bg, stat.color, stat.color.replace('text-', 'border-').replace('400', '500/20')]">
            <component :is="stat.icon" class="w-7 h-7" />
          </div>
          <div :class="['flex items-center gap-1 text-[10px] font-black px-3 py-1.5 rounded-full border', stat.trend === 'up' ? 'text-teal-400 bg-teal-400/5 border-teal-400/10' : 'text-red-400 bg-red-400/5 border-red-400/10']">
            <ArrowUpRight v-if="stat.trend === 'up'" class="w-3 h-3" />
            <ArrowDownRight v-else class="w-3 h-3" />
            {{ stat.change }}
          </div>
        </div>

        <div class="relative z-10">
          <div class="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">{{ stat.label }}</div>
          <div class="text-4xl font-black text-white italic tracking-tighter">{{ stat.value }}</div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
      <!-- Left Column: Pending & Activity -->
      <div class="lg:col-span-2 space-y-10">
        <!-- Pending Verifications -->
        <div class="bg-slate-900/40 border border-slate-800 rounded-[32px] overflow-hidden">
          <div class="p-8 border-b border-slate-800 bg-slate-900/20 flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 bg-amber-400/10 rounded-xl flex items-center justify-center text-amber-400 border border-amber-400/20">
                <ShieldCheck class="w-5 h-5" />
              </div>
              <div>
                <h2 class="text-lg font-black text-white uppercase tracking-tight italic">Pending Verifications</h2>
                <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Business Trust Validation Queue</p>
              </div>
            </div>
            <NuxtLink to="/admin/venues" class="text-[10px] font-black text-slate-500 hover:text-teal-400 transition-colors uppercase tracking-[0.2em]">View All</NuxtLink>
          </div>

          <div v-if="venuesPending" class="p-8 space-y-4">
            <div v-for="i in 3" :key="i" class="h-20 bg-slate-800/50 rounded-2xl animate-pulse"></div>
          </div>

          <div v-else-if="pendingVerifications.length === 0" class="p-20 text-center">
            <div class="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-800">
              <CheckCircle2 class="w-10 h-10 text-slate-700" />
            </div>
            <h3 class="text-xl font-black text-white italic uppercase tracking-tighter">Queue Clear</h3>
            <p class="text-slate-500 text-sm font-medium mt-2">All business entities are currently validated.</p>
          </div>

          <div v-else class="divide-y divide-slate-800/50">
            <div v-for="venue in pendingVerifications" :key="venue.id" class="p-8 hover:bg-slate-800/20 transition-all duration-300 group">
              <div class="flex items-center justify-between gap-6">
                <div class="flex items-center gap-5 min-w-0">
                  <div class="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-teal-400 font-black text-2xl overflow-hidden shadow-inner">
                    <img v-if="venue.media?.[0]?.url" :src="venue.media[0].url" class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                    <template v-else>{{ venue.name.charAt(0) }}</template>
                  </div>
                  <div class="min-w-0">
                    <h3 class="text-lg font-bold text-white group-hover:text-teal-400 transition-colors truncate tracking-tight">{{ venue.name }}</h3>
                    <div class="flex items-center gap-3 mt-1 text-[10px] font-black uppercase tracking-widest text-slate-500">
                      <span class="text-slate-400">{{ venue.business?.owner?.fullName || 'N/A' }}</span>
                      <span class="w-1 h-1 bg-slate-700 rounded-full"></span>
                      <span>{{ venue.category?.name || 'Standard' }}</span>
                    </div>
                  </div>
                </div>

                <div class="flex items-center gap-4 shrink-0">
                   <div class="text-right hidden sm:block">
                      <div class="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 justify-end">
                        <Clock class="w-3 h-3" />
                        {{ format(parseISO(venue.createdAt), 'MMM d, yyyy') }}
                      </div>
                      <div class="text-[9px] font-bold text-slate-600 mt-1 uppercase">Received Request</div>
                   </div>
                   <NuxtLink :to="`/admin/venues`" class="px-6 py-3 bg-teal-500 text-slate-950 font-black rounded-xl hover:bg-teal-400 transition-all shadow-lg shadow-teal-500/10 uppercase tracking-widest text-[10px]">
                      Manage
                   </NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Transactions -->
        <div class="bg-slate-900/40 border border-slate-800 rounded-[32px] overflow-hidden">
           <div class="p-8 border-b border-slate-800 bg-slate-900/20 flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 bg-purple-400/10 rounded-xl flex items-center justify-center text-purple-400 border border-purple-400/20">
                <CreditCard class="w-5 h-5" />
              </div>
              <div>
                <h2 class="text-lg font-black text-white uppercase tracking-tight italic">Recent Bookings</h2>
                <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Global Transaction Ledger</p>
              </div>
            </div>
            <NuxtLink to="/admin/bookings" class="text-[10px] font-black text-slate-500 hover:text-teal-400 transition-colors uppercase tracking-[0.2em]">View Journal</NuxtLink>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b border-slate-800/50 bg-slate-950/20">
                  <th class="px-8 py-5 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Consumer</th>
                  <th class="px-8 py-5 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Destination</th>
                  <th class="px-8 py-5 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Value</th>
                  <th class="px-8 py-5 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800/30">
                <tr v-for="booking in adminStats?.recentBookings" :key="booking.id" class="hover:bg-slate-800/10 transition-colors group">
                  <td class="px-8 py-5">
                    <div class="text-xs font-bold text-white group-hover:text-teal-400 transition-colors">{{ booking.user?.fullName || 'Anonymous' }}</div>
                    <div class="text-[10px] text-slate-600 font-medium">{{ booking.user?.email }}</div>
                  </td>
                  <td class="px-8 py-5">
                    <div class="text-xs font-bold text-slate-300">{{ booking.venue?.name }}</div>
                    <div class="text-[9px] text-slate-600 uppercase font-black tracking-widest">{{ format(parseISO(booking.date), 'MMM d') }} @ {{ booking.startTime }}</div>
                  </td>
                  <td class="px-8 py-5">
                    <span class="text-xs font-black text-white italic">R{{ Number(booking.priceTotal).toLocaleString() }}</span>
                  </td>
                  <td class="px-8 py-5 text-right">
                    <span :class="['px-3 py-1 text-[9px] font-black uppercase rounded-full border tracking-widest', getStatusColor(booking.status)]">
                      {{ booking.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Right Column: System Intel -->
      <div class="space-y-10">
        <!-- System Health -->
        <div class="bg-slate-900/40 border border-slate-800 rounded-[32px] p-8 space-y-8">
           <h3 class="text-xs font-black text-slate-500 uppercase tracking-[0.3em]">System Intelligence</h3>

           <div class="space-y-6">
              <div class="flex items-center justify-between">
                 <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-400">
                       <ShieldCheck class="w-4 h-4" />
                    </div>
                    <span class="text-xs font-bold text-slate-300 uppercase tracking-widest">Auth Protocol</span>
                 </div>
                 <span class="text-[10px] font-black text-teal-500 uppercase">Secure</span>
              </div>

              <div class="flex items-center justify-between">
                 <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                       <Store class="w-4 h-4" />
                    </div>
                    <span class="text-xs font-bold text-slate-300 uppercase tracking-widest">Search Index</span>
                 </div>
                 <span class="text-[10px] font-black text-blue-500 uppercase">Optimized</span>
              </div>
           </div>
        </div>

        <!-- Recent Users -->
        <div class="bg-slate-900/40 border border-slate-800 rounded-[32px] overflow-hidden">
           <div class="p-8 border-b border-slate-800 flex items-center justify-between bg-slate-900/20">
              <h3 class="text-xs font-black text-white uppercase tracking-[0.2em] italic">New Citizens</h3>
              <UserPlus class="w-4 h-4 text-slate-600" />
           </div>

           <div class="divide-y divide-slate-800/50">
              <div v-for="user in adminStats?.recentUsers" :key="user.id" class="p-6 hover:bg-slate-800/10 transition-all flex items-center gap-4 group">
                 <div class="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500 font-black text-sm group-hover:text-teal-500 transition-colors uppercase shadow-inner">
                    {{ user.fullName?.[0] || user.email?.[0] }}
                 </div>
                 <div class="min-w-0 flex-1">
                    <div class="text-xs font-bold text-white truncate">{{ user.fullName || 'No Name' }}</div>
                    <div class="text-[9px] text-slate-600 font-bold uppercase tracking-widest truncate">{{ user.role }}</div>
                 </div>
                 <div class="text-right text-[8px] font-black text-slate-700 uppercase tracking-tighter">
                    {{ format(parseISO(user.createdAt), 'HH:mm') }}
                 </div>
              </div>
           </div>

           <NuxtLink to="/admin/users" class="block w-full py-4 text-center text-[9px] font-black text-slate-600 hover:text-white uppercase tracking-[0.3em] bg-slate-950/20 hover:bg-slate-900/50 transition-all">
              Manage Population
           </NuxtLink>
        </div>

        <!-- Performance Graph Placeholder (Pinky style) -->
        <div class="bg-slate-900/40 border border-slate-800 rounded-[32px] p-8">
          <div class="flex items-center justify-between mb-8">
            <h3 class="text-xs font-black text-white uppercase tracking-[0.2em] italic">Ecosystem Growth</h3>
            <TrendingUp class="w-4 h-4 text-teal-500" />
          </div>

          <div class="h-48 flex items-end gap-3 px-2">
            <div v-for="(h, i) in [35, 65, 45, 85, 55, 95, 75]" :key="i"
              class="flex-1 bg-teal-500/10 rounded-t-xl relative group transition-all hover:bg-teal-500/30 border-t border-teal-500/20"
              :style="{ height: h + '%' }"
            >
              <div class="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] font-black px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all shadow-2xl border border-slate-700">
                {{ h }}%
              </div>
            </div>
          </div>

          <div class="flex justify-between text-[8px] font-black text-slate-700 uppercase tracking-[0.3em] mt-6 pt-6 border-t border-slate-800/50">
            <span>Cycle 01</span>
            <span>Cycle 07</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
