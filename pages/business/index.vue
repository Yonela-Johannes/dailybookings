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
  ArrowDownRight,
  Loader2,
  DollarSign,
  Star,
  CheckCircle2,
  AlertCircle
} from 'lucide-vue-next'
import { format, parseISO } from 'date-fns'

definePageMeta({
  layout: 'business',
  middleware: 'auth'
})

const { data: businessData, pending, error } = useFetch('/api/business')

const stats = computed(() => [
  { label: 'Today\'s Bookings', value: businessData.value?.todayBookingsCount || 0, change: '+12%', trend: 'up', icon: Calendar, color: 'text-teal-600', bg: 'bg-teal-50' },
  { label: 'Today\'s Revenue', value: `R${(businessData.value?.todayRevenue || 0).toLocaleString()}`, change: '+8%', trend: 'up', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'Network Reach', value: businessData.value?.totalBookingsCount || 0, change: '+5%', trend: 'up', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Reputation', value: '4.9', change: '+0.2', trend: 'up', icon: Star, color: 'text-amber-600', bg: 'bg-amber-50' },
])

const upcomingBookings = computed(() => businessData.value?.upcomingBookings || [])

const getStatusColor = (status: string) => {
  switch (status.toUpperCase()) {
    case 'CONFIRMED': return 'text-emerald-700 bg-emerald-50 border-emerald-100'
    case 'PENDING': return 'text-amber-700 bg-amber-50 border-amber-100'
    case 'CANCELLED': return 'text-rose-700 bg-rose-50 border-rose-100'
    default: return 'text-slate-600 bg-slate-50 border-slate-100'
  }
}
</script>

<template>
  <div class="space-y-10 pb-20">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div>
        <h1 class="text-4xl font-black text-slate-900 italic tracking-tighter uppercase">Executive Suite</h1>
        <p class="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">Operational Intelligence & Control</p>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <NuxtLink
          v-if="businessData?.mainVenueSlug"
          :to="`/venue/${businessData.mainVenueSlug}`"
          target="_blank"
          class="flex items-center gap-2 px-6 py-3 bg-white border-2 border-slate-950 text-slate-950 font-black rounded-xl hover:bg-slate-50 transition-all uppercase tracking-widest text-[10px] shadow-sm"
        >
          Explore Public Node
        </NuxtLink>
        <NuxtLink to="/business/calendar" class="flex items-center gap-2 px-6 py-3 bg-primary text-white font-black rounded-xl hover:bg-slate-900 transition-all shadow-xl shadow-primary/10 uppercase tracking-widest text-[10px]">
          <Plus class="w-4 h-4" />
          Schedule Entry
        </NuxtLink>
      </div>
    </div>

    <!-- Error State -->
    <div v-if="error" class="p-8 bg-rose-50 border-2 border-rose-100 rounded-3xl flex items-center gap-5">
       <AlertCircle class="w-8 h-8 text-rose-500 shrink-0" />
       <div>
          <h3 class="font-black text-rose-900 uppercase tracking-tighter italic text-lg">System Disconnect</h3>
          <p class="text-rose-700 font-medium text-sm">We're having trouble retrieving your business stream. Please refresh the connection.</p>
       </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <template v-if="pending">
        <div v-for="i in 4" :key="i" class="bg-white border border-slate-100 p-8 rounded-[32px] animate-pulse">
          <div class="h-14 w-14 bg-slate-100 rounded-2xl mb-6"></div>
          <div class="h-4 w-24 bg-slate-100 rounded mb-3"></div>
          <div class="h-8 w-16 bg-slate-100 rounded"></div>
        </div>
      </template>

      <div v-else v-for="stat in stats" :key="stat.label"
        class="bg-white border border-slate-100 p-8 rounded-[32px] group hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 relative overflow-hidden"
      >
        <div class="flex items-center justify-between mb-8 relative z-10">
          <div :class="['w-14 h-14 rounded-2xl flex items-center justify-center border transition-transform duration-500 group-hover:scale-110', stat.bg, stat.color, stat.color.replace('text-', 'border-').replace('600', '200')]">
            <component :is="stat.icon" class="w-6 h-6" />
          </div>
          <div :class="['flex items-center gap-1 text-[10px] font-black px-3 py-1.5 rounded-full border', stat.trend === 'up' ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 'text-rose-600 bg-rose-50 border-rose-100']">
            <ArrowUpRight v-if="stat.trend === 'up'" class="w-3 h-3" />
            <ArrowDownRight v-else class="w-3 h-3" />
            {{ stat.change }}
          </div>
        </div>

        <div class="relative z-10">
          <div class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{{ stat.label }}</div>
          <div class="text-4xl font-black text-slate-950 italic tracking-tighter">{{ stat.value }}</div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
      <!-- Upcoming Feed -->
      <div class="lg:col-span-2 space-y-10">
        <div class="bg-white border border-slate-100 rounded-[40px] overflow-hidden shadow-sm">
          <div class="p-8 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20">
                <Clock class="w-5 h-5" />
              </div>
              <div>
                <h2 class="text-xl font-black text-slate-900 uppercase tracking-tight italic">Operations Queue</h2>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Client Engagements Today</p>
              </div>
            </div>
            <NuxtLink to="/business/calendar" class="text-[10px] font-black text-primary hover:text-slate-950 transition-colors uppercase tracking-[0.2em] flex items-center gap-2">
              Full Schedule
              <ChevronRight class="w-3 h-3" />
            </NuxtLink>
          </div>

          <div v-if="pending" class="p-8 space-y-4">
            <div v-for="i in 3" :key="i" class="h-20 bg-slate-50 rounded-3xl animate-pulse"></div>
          </div>
          <div v-else-if="upcomingBookings.length === 0" class="p-24 text-center">
            <div class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar class="w-10 h-10 text-slate-200" />
            </div>
            <h3 class="text-xl font-black text-slate-900 italic uppercase tracking-tighter">Queue Dormant</h3>
            <p class="text-slate-500 text-sm font-medium mt-2">No synchronized bookings detected for the current cycle.</p>
          </div>
          <div v-else class="divide-y divide-slate-50">
            <div v-for="booking in upcomingBookings" :key="booking.id" class="p-8 hover:bg-slate-50/50 transition-all duration-300 group">
              <div class="flex items-center justify-between gap-6">
                <div class="flex items-center gap-6 min-w-0">
                  <div class="w-16 h-16 rounded-2xl bg-slate-950 flex flex-col items-center justify-center shadow-2xl relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                    <span class="text-[10px] font-black text-primary uppercase tracking-tighter leading-none mb-1">{{ booking.startTime.split(':')[0] }}</span>
                    <span class="text-[14px] font-black text-white italic tracking-tighter leading-none">{{ booking.startTime.split(':')[1] }}</span>
                    <div class="absolute bottom-0 left-0 w-full h-1 bg-primary"></div>
                  </div>
                  <div class="min-w-0">
                    <h3 class="text-xl font-black text-slate-950 group-hover:text-primary transition-colors truncate italic tracking-tighter">{{ booking.user?.fullName || 'Anonymous Client' }}</h3>
                    <div class="flex items-center gap-3 mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      <span class="text-slate-600">{{ booking.services?.map(s => s.service.name).join(', ') }}</span>
                      <span class="w-1.5 h-1.5 bg-slate-200 rounded-full"></span>
                      <span class="text-slate-900 font-black">R{{ Number(booking.priceTotal).toLocaleString() }}</span>
                    </div>
                  </div>
                </div>
                <div class="flex items-center gap-4 shrink-0">
                  <NuxtLink :to="`/business/calendar`" class="px-6 py-3 bg-slate-50 border border-slate-200 text-slate-950 font-black rounded-xl hover:bg-white transition-all uppercase tracking-widest text-[10px]">
                    Inspect
                  </NuxtLink>
                  <button class="p-2.5 text-slate-300 hover:text-slate-950 transition-colors">
                    <MoreVertical class="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Control Sidebar -->
      <div class="space-y-10">
        <!-- Premium Action -->
        <div class="bg-slate-950 rounded-[40px] p-10 text-white relative overflow-hidden group shadow-2xl shadow-slate-900/20">
          <div class="relative z-10 space-y-6">
            <div class="inline-flex px-3 py-1 bg-primary/20 border border-primary/30 rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-primary">Network Node Priority</div>
            <div>
               <h3 class="text-2xl font-black italic tracking-tighter leading-tight">Elevate Your <br />Reach Today</h3>
               <p class="text-xs font-bold text-slate-500 uppercase tracking-widest mt-2 leading-relaxed">Upgrade to Professional Tier</p>
            </div>
            <button class="w-full py-4 bg-white text-slate-950 font-black rounded-2xl hover:bg-primary hover:text-white transition-all uppercase text-[10px] tracking-widest shadow-xl">
              Activate Suite
            </button>
          </div>
          <TrendingUp class="absolute -bottom-6 -right-6 w-40 h-40 opacity-5 -rotate-12 group-hover:scale-110 group-hover:rotate-0 transition-all duration-700" />
        </div>

        <!-- Quick Terminal -->
        <div class="bg-white border border-slate-100 rounded-[40px] p-10 space-y-8 shadow-sm">
          <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Command Center</h3>
          <div class="grid grid-cols-2 gap-4">
            <NuxtLink to="/business/team" class="flex flex-col items-center justify-center p-6 bg-slate-50 border border-slate-100 rounded-3xl hover:border-primary/30 hover:bg-white transition-all group shadow-inner">
              <Users class="w-6 h-6 text-slate-400 group-hover:text-primary mb-3 transition-colors" />
              <span class="text-[9px] font-black uppercase text-slate-600 tracking-widest">Personnel</span>
            </NuxtLink>
            <NuxtLink to="/business/services" class="flex flex-col items-center justify-center p-6 bg-slate-50 border border-slate-100 rounded-3xl hover:border-primary/30 hover:bg-white transition-all group shadow-inner">
              <Scissors class="w-6 h-6 text-slate-400 group-hover:text-primary mb-3 transition-colors" />
              <span class="text-[9px] font-black uppercase text-slate-600 tracking-widest">Manifest</span>
            </NuxtLink>
            <NuxtLink to="/business/reviews" class="flex flex-col items-center justify-center p-6 bg-slate-50 border border-slate-100 rounded-3xl hover:border-primary/30 hover:bg-white transition-all group shadow-inner">
              <MessageSquare class="w-6 h-6 text-slate-400 group-hover:text-primary mb-3 transition-colors" />
              <span class="text-[9px] font-black uppercase text-slate-600 tracking-widest">Feedbacks</span>
            </NuxtLink>
            <NuxtLink to="/business/settings" class="flex flex-col items-center justify-center p-6 bg-slate-50 border border-slate-100 rounded-3xl hover:border-primary/30 hover:bg-white transition-all group shadow-inner">
              <Settings class="w-6 h-6 text-slate-400 group-hover:text-primary mb-3 transition-colors" />
              <span class="text-[9px] font-black uppercase text-slate-600 tracking-widest">Configure</span>
            </NuxtLink>
          </div>
        </div>

        <!-- Ecosystem Awareness -->
        <div class="bg-emerald-50/50 border border-emerald-100 rounded-[40px] p-10 space-y-6">
           <div class="flex items-center gap-3">
              <CheckCircle2 class="w-5 h-5 text-emerald-600" />
              <span class="text-[10px] font-black text-emerald-900 uppercase tracking-widest">Node Health Optimal</span>
           </div>
           <p class="text-xs text-emerald-800 font-medium leading-relaxed">Your venue is performing in the top 15% of the local sector this cycle. Maintain high availability to maximize intake.</p>
        </div>
      </div>
    </div>
  </div>
</template>
