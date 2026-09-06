<script setup lang="ts">
import {
  Calendar,
  Users,
  TrendingUp,
  Clock,
  ChevronRight,
  MoreVertical,
  Plus,
  ArrowUpRight,
  Loader2
} from 'lucide-vue-next'

definePageMeta({
  layout: 'business',
  middleware: 'auth'
})

const { data: businessData, pending } = useFetch('/api/business')

const stats = computed(() => [
  { label: 'Today\'s Bookings', value: businessData.value?.todayBookingsCount || 0, change: '+12%', trend: 'up', icon: Calendar, color: 'text-teal-500' },
  { label: 'Today\'s Revenue', value: `R${(businessData.value?.todayRevenue || 0).toLocaleString()}`, change: '+8%', trend: 'up', icon: TrendingUp, color: 'text-teal-500' },
  { label: 'Total Bookings', value: businessData.value?.totalBookingsCount || 0, change: '+5%', trend: 'up', icon: Users, color: 'text-teal-500' },
  { label: 'Avg. Rating', value: '4.9', change: '+0.2', trend: 'up', icon: ArrowUpRight, color: 'text-teal-500' },
])

const upcomingBookings = computed(() => businessData.value?.upcomingBookings || [])
</script>

<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-extrabold text-white italic">Business Dashboard</h1>
        <p class="text-slate-500">Welcome back! Here's what's happening today.</p>
      </div>
      <div class="flex items-center gap-3">
        <NuxtLink to="/business/calendar" class="flex items-center gap-2 px-6 py-2.5 bg-teal-500 text-slate-950 font-black rounded-xl hover:bg-teal-400 transition-all shadow-lg shadow-teal-500/20 uppercase tracking-widest text-sm">
          <Plus class="w-5 h-5" />
          New Booking
        </NuxtLink>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <template v-if="pending">
        <div v-for="i in 4" :key="i" class="bg-slate-950/50 border border-slate-800 p-6 rounded-2xl animate-pulse">
          <div class="h-10 w-10 bg-slate-900 rounded-xl mb-4"></div>
          <div class="h-4 w-20 bg-slate-900 rounded mb-2"></div>
          <div class="h-8 w-16 bg-slate-900 rounded"></div>
        </div>
      </template>
      <div v-else v-for="stat in stats" :key="stat.label" class="bg-slate-950/50 border border-slate-800 p-6 rounded-2xl group hover:border-teal-500/30 transition-colors">
        <div class="flex items-center justify-between mb-4">
          <div :class="['w-10 h-10 rounded-xl flex items-center justify-center bg-slate-900 border border-slate-800', stat.color]">
            <component :is="stat.icon" class="w-5 h-5" />
          </div>
          <div :class="['text-[10px] font-black px-2 py-1 rounded-full bg-teal-500/10 text-teal-500 uppercase tracking-widest']">
            {{ stat.change }}
          </div>
        </div>
        <div class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{{ stat.label }}</div>
        <div class="text-2xl font-black text-white group-hover:text-teal-400 transition-colors italic">{{ stat.value }}</div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Upcoming Bookings -->
      <div class="lg:col-span-2 space-y-6">
        <div class="bg-slate-950/50 border border-slate-800 rounded-2xl overflow-hidden">
          <div class="p-6 border-b border-slate-800 flex items-center justify-between">
            <h2 class="text-xl font-bold text-white flex items-center gap-2 italic">
              <Clock class="w-5 h-5 text-teal-500" />
              Upcoming Today
            </h2>
            <NuxtLink to="/business/calendar" class="text-[10px] font-black text-slate-500 hover:text-white transition-colors uppercase tracking-widest flex items-center gap-1">
              View Calendar
              <ChevronRight class="w-4 h-4" />
            </NuxtLink>
          </div>

          <div v-if="pending" class="p-6 space-y-4">
            <div v-for="i in 3" :key="i" class="h-16 bg-slate-900/50 rounded-xl animate-pulse"></div>
          </div>
          <div v-else-if="upcomingBookings.length === 0" class="p-12 text-center">
            <Calendar class="w-12 h-12 text-slate-800 mx-auto mb-4" />
            <h3 class="text-white font-bold mb-1 uppercase tracking-widest">No bookings today</h3>
            <p class="text-slate-500 text-sm">Take some time to relax or update your services.</p>
          </div>
          <div v-else class="divide-y divide-slate-800">
            <div v-for="booking in upcomingBookings" :key="booking.id" class="p-6 hover:bg-slate-900/50 transition-colors group">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center">
                    <span class="text-[10px] font-black text-teal-500 uppercase tracking-tighter">{{ booking.startTime.split(':')[0] }}:{{ booking.startTime.split(':')[1] }}</span>
                  </div>
                  <div>
                    <h3 class="font-bold text-white group-hover:text-teal-400 transition-colors">{{ booking.user?.fullName || 'Guest' }}</h3>
                    <div class="flex items-center gap-3 text-xs text-slate-500">
                      <span>{{ booking.services?.map(s => s.service.name).join(', ') }}</span>
                      <span class="text-slate-700">•</span>
                      <span class="text-white font-bold">${{ booking.priceTotal }}</span>
                    </div>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <button class="px-4 py-2 bg-slate-800 text-white font-black rounded-lg hover:bg-slate-700 transition-colors text-[10px] border border-slate-700 uppercase tracking-widest">
                    Details
                  </button>
                  <button class="p-2 text-slate-500 hover:text-white rounded-lg hover:bg-slate-800 transition-colors">
                    <MoreVertical class="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions / Sidebar -->
      <div class="space-y-6">
        <div class="bg-teal-500 rounded-2xl p-6 text-slate-950 relative overflow-hidden group shadow-2xl shadow-teal-500/10">
          <div class="relative z-10">
            <h3 class="text-xl font-black mb-2 uppercase italic tracking-tighter">Premium Plan</h3>
            <p class="text-sm font-bold opacity-80 mb-6 leading-tight">Your trial ends in 4 days. Upgrade now to keep all features.</p>
            <button class="w-full py-3 bg-slate-950 text-white font-black rounded-xl hover:bg-slate-900 transition-all uppercase text-xs tracking-widest shadow-xl">
              Upgrade Now
            </button>
          </div>
          <TrendingUp class="absolute -bottom-4 -right-4 w-32 h-32 opacity-10 -rotate-12 group-hover:scale-110 transition-transform duration-500" />
        </div>

        <div class="bg-slate-950/50 border border-slate-800 rounded-2xl p-6">
          <h3 class="text-lg font-bold text-white mb-4 italic">Quick Actions</h3>
          <div class="grid grid-cols-2 gap-3">
            <NuxtLink to="/business/team" class="flex flex-col items-center justify-center p-4 bg-slate-900 border border-slate-800 rounded-xl hover:border-teal-500/50 transition-colors group">
              <Users class="w-6 h-6 text-slate-500 group-hover:text-teal-400 mb-2" />
              <span class="text-[10px] font-black uppercase text-slate-400">Team</span>
            </NuxtLink>
            <NuxtLink to="/business/calendar" class="flex flex-col items-center justify-center p-4 bg-slate-900 border border-slate-800 rounded-xl hover:border-teal-500/50 transition-colors group">
              <Calendar class="w-6 h-6 text-slate-500 group-hover:text-teal-400 mb-2" />
              <span class="text-[10px] font-black uppercase text-slate-400">Slots</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
