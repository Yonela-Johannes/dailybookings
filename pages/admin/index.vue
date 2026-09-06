<script setup lang="ts">
import {
  Users,
  Store,
  CreditCard,
  TrendingUp,
  AlertCircle,
  Clock,
  ShieldCheck,
  MoreVertical
} from 'lucide-vue-next'

definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const { data: adminStats, pending: statsPending, error: statsError } = useFetch('/api/admin')
const { data: pendingVenuesData, pending: venuesPending, error: venuesError } = useFetch('/api/admin/venues', {
  query: { status: 'PENDING', limit: 5 }
})

const stats = computed(() => [
  { label: 'Total Users', value: adminStats.value?.totalUsers?.toLocaleString() || '0', change: '+2.5%', trend: 'up', icon: Users, color: 'text-blue-400' },
  { label: 'Active Venues', value: adminStats.value?.totalVenues?.toLocaleString() || '0', change: '+4.2%', trend: 'up', icon: Store, color: 'text-teal-400' },
  { label: 'Total Bookings', value: adminStats.value?.totalBookings?.toLocaleString() || '0', change: '+12.5%', trend: 'up', icon: CreditCard, color: 'text-purple-400' },
  { label: 'Revenue', value: `$${(adminStats.value?.totalRevenue || 0).toLocaleString()}`, change: '+8.2%', trend: 'up', icon: TrendingUp, color: 'text-amber-400' },
])

const pendingVerifications = computed(() => pendingVenuesData.value?.venues || [])
</script>

<template>
  <div class="space-y-8">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-extrabold text-white">Platform Overview</h1>
        <p class="text-slate-500">Global performance and system health monitoring.</p>
      </div>
      <div class="flex items-center gap-3">
        <button class="px-4 py-2 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 transition-colors border border-slate-700">
          Systems Status: <span class="text-teal-400">Optimal</span>
        </button>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <template v-if="statsPending">
        <div v-for="i in 4" :key="i" class="bg-slate-950/50 border border-slate-800 p-6 rounded-2xl animate-pulse">
          <div class="h-12 w-12 bg-slate-900 rounded-xl mb-4"></div>
          <div class="h-4 w-24 bg-slate-900 rounded mb-2"></div>
          <div class="h-8 w-16 bg-slate-900 rounded"></div>
        </div>
      </template>
      <div v-else v-for="stat in stats" :key="stat.label" class="bg-slate-950/50 border border-slate-800 p-6 rounded-2xl">
        <div class="flex items-center justify-between mb-4">
          <div :class="['w-12 h-12 rounded-xl flex items-center justify-center bg-slate-900 border border-slate-800', stat.color]">
            <component :is="stat.icon" class="w-6 h-6" />
          </div>
          <div :class="['flex items-center text-xs font-bold px-2 py-1 rounded-full', stat.trend === 'up' ? 'text-teal-400 bg-teal-400/10' : 'text-red-400 bg-red-400/10']">
            {{ stat.change }}
          </div>
        </div>
        <div class="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{{ stat.label }}</div>
        <div class="text-2xl font-black text-white">{{ stat.value }}</div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- System Alerts & Verifications -->
      <div class="lg:col-span-2 space-y-8">
        <div class="bg-slate-950/50 border border-slate-800 rounded-2xl overflow-hidden">
          <div class="p-6 border-b border-slate-800 flex items-center justify-between">
            <h2 class="text-xl font-bold text-white flex items-center gap-2">
              <ShieldCheck class="w-5 h-5 text-teal-500" />
              Pending Verifications
            </h2>
            <span v-if="!venuesPending" class="px-2 py-1 bg-teal-500/10 text-teal-500 text-[10px] font-black uppercase rounded-full tracking-widest">
              {{ pendingVerifications.length }} Required
            </span>
          </div>

          <div v-if="venuesPending" class="p-6 space-y-4">
            <div v-for="i in 3" :key="i" class="h-16 bg-slate-900/50 rounded-xl animate-pulse"></div>
          </div>
          <div v-else-if="pendingVerifications.length === 0" class="p-12 text-center">
            <div class="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck class="w-8 h-8 text-slate-700" />
            </div>
            <h3 class="text-white font-bold mb-1">All Caught Up!</h3>
            <p class="text-slate-500 text-sm">No venues are currently awaiting verification.</p>
          </div>
          <div v-else class="divide-y divide-slate-800">
            <div v-for="venue in pendingVerifications" :key="venue.id" class="p-6 hover:bg-slate-900/50 transition-colors group">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-teal-500 font-black text-xl overflow-hidden">
                    <img v-if="venue.image" :src="venue.image" class="w-full h-full object-cover" />
                    <template v-else>{{ venue.name.charAt(0) }}</template>
                  </div>
                  <div>
                    <h3 class="font-bold text-white group-hover:text-teal-400 transition-colors">{{ venue.name }}</h3>
                    <div class="flex items-center gap-3 text-sm text-slate-500">
                      <span>{{ venue.business?.owner?.fullName || 'N/A' }}</span>
                      <span class="text-slate-700">•</span>
                      <span>{{ venue.category?.name || 'Uncategorized' }}</span>
                    </div>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <div class="text-right mr-4 hidden sm:block">
                    <div class="text-xs text-slate-500 flex items-center gap-1 justify-end">
                      <Clock class="w-3 h-3" />
                      {{ new Date(venue.createdAt).toLocaleDateString() }}
                    </div>
                  </div>
                  <NuxtLink :to="`/admin/venues`" class="px-4 py-2 bg-teal-500 text-slate-950 font-bold rounded-lg hover:bg-teal-400 transition-colors text-xs">
                    Manage
                  </NuxtLink>
                  <button class="p-2 text-slate-500 hover:text-white rounded-lg hover:bg-slate-800 transition-colors">
                    <MoreVertical class="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div v-if="pendingVerifications.length > 0" class="p-4 text-center">
            <NuxtLink to="/admin/venues" class="text-xs font-bold text-slate-500 hover:text-white transition-colors">View All Verification Requests</NuxtLink>
          </div>
        </div>

        <div class="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-6 flex items-start gap-4">
          <AlertCircle class="w-6 h-6 text-amber-500 shrink-0" />
          <div>
            <h3 class="font-bold text-amber-500 mb-1">System Notice</h3>
            <p class="text-sm text-slate-400 leading-relaxed">Database maintenance scheduled for Saturday, June 22nd at 02:00 UTC. Expect potential latency for up to 15 minutes.</p>
          </div>
        </div>
      </div>

      <!-- Growth Chart Placeholder -->
      <div class="bg-slate-950/50 border border-slate-800 rounded-2xl p-6 flex flex-col">
        <h2 class="text-lg font-bold text-white mb-6">Revenue Growth</h2>
        <div class="flex-1 flex items-end gap-2 px-2 pb-4">
          <div v-for="h in [40, 60, 45, 70, 85, 65, 90]" :key="h" class="flex-1 bg-teal-500/20 rounded-t-lg relative group transition-all hover:bg-teal-500/40" :style="{ height: h + '%' }">
            <div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
              ${{ h }}k
            </div>
          </div>
        </div>
        <div class="flex justify-between text-[10px] font-bold text-slate-600 uppercase tracking-widest pt-4 border-t border-slate-800">
          <span>Mon</span>
          <span>Sun</span>
        </div>
      </div>
    </div>
  </div>
</template>
