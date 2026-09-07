<script setup lang="ts">
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Store,
  CreditCard,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2
} from 'lucide-vue-next'
import { format, parseISO } from 'date-fns'

definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const route = useRoute()
const { data: booking, pending, error } = await useFetch(`/api/admin/bookings/${route.params.id}`)

const getStatusColor = (status: string) => {
  switch (status?.toUpperCase()) {
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
    <div class="flex items-center gap-4">
      <button @click="$router.back()" class="p-3 bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 hover:text-white transition-all">
        <ArrowLeft class="w-5 h-5" />
      </button>
      <div>
        <h1 class="text-3xl font-extrabold text-white uppercase italic tracking-tight">Transaction Detail</h1>
        <p class="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Auditing Reference #{{ (booking as any)?.id?.slice(-8) || '...' }}</p>
      </div>
    </div>

    <div v-if="pending" class="flex items-center justify-center py-40">
      <Loader2 class="w-10 h-10 text-teal-500 animate-spin" />
    </div>

    <div v-else-if="error" class="p-20 text-center bg-red-500/5 border border-red-500/20 rounded-[32px]">
       <AlertCircle class="w-12 h-12 text-red-500 mx-auto mb-4" />
       <h3 class="text-xl font-bold text-white">Entry Not Found</h3>
       <p class="text-slate-500 mt-2">The requested transaction record does not exist in the vault.</p>
    </div>

    <div v-else-if="booking" class="grid grid-cols-1 lg:grid-cols-3 gap-10">
      <!-- Main Info -->
      <div class="lg:col-span-2 space-y-10">
        <!-- Status Card -->
        <div class="bg-slate-900/40 border border-slate-800 rounded-[32px] p-10 flex flex-col md:flex-row md:items-center justify-between gap-8 relative overflow-hidden">
           <div class="absolute top-0 right-0 p-8 opacity-5">
              <CreditCard class="w-40 h-40 rotate-12" />
           </div>

           <div class="space-y-4 relative z-10">
              <div :class="['inline-flex px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-[0.2em]', getStatusColor(booking.status)]">
                 {{ booking.status }}
              </div>
              <h2 class="text-5xl font-black text-white italic tracking-tighter">R{{ Number(booking.priceTotal).toLocaleString() }}</h2>
              <div class="flex items-center gap-6 text-slate-500">
                 <div class="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                    <Calendar class="w-4 h-4 text-teal-500" />
                    {{ format(parseISO(booking.date), 'EEEE, MMMM do, yyyy') }}
                 </div>
                 <div class="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                    <Clock class="w-4 h-4 text-teal-500" />
                    {{ booking.startTime }} - {{ booking.endTime }}
                 </div>
              </div>
           </div>

           <div class="flex flex-wrap gap-3 relative z-10">
              <button class="px-6 py-3 bg-slate-800 text-white font-black rounded-xl hover:bg-slate-700 transition-all border border-slate-700 uppercase tracking-widest text-[10px]">Download Invoice</button>
              <button class="px-6 py-3 bg-red-500 text-slate-950 font-black rounded-xl hover:bg-red-400 transition-all uppercase tracking-widest text-[10px]">Void Record</button>
           </div>
        </div>

        <!-- Services -->
        <div class="bg-slate-900/40 border border-slate-800 rounded-[32px] overflow-hidden">
           <div class="p-8 border-b border-slate-800 bg-slate-900/20">
              <h3 class="text-xs font-black text-white uppercase tracking-[0.3em] italic">Line Items</h3>
           </div>
           <div class="divide-y divide-slate-800/50">
              <div v-for="s in booking.services" :key="s.id" class="p-8 flex items-center justify-between group hover:bg-slate-800/10 transition-colors">
                 <div class="flex items-center gap-6">
                    <div class="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-teal-500 group-hover:bg-teal-500 group-hover:text-slate-950 transition-all duration-500 shadow-inner">
                       <Store class="w-5 h-5" />
                    </div>
                    <div>
                       <div class="text-lg font-bold text-white tracking-tight">{{ s.service.name }}</div>
                       <div class="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                          {{ s.durationMinutes }} Min <span class="mx-2 text-slate-800">|</span> Provider: {{ s.employee?.name || 'Assigned' }}
                       </div>
                    </div>
                 </div>
                 <div class="text-xl font-black text-white italic">R{{ Number(s.price).toLocaleString() }}</div>
              </div>
           </div>
        </div>

        <!-- Notes -->
        <div v-if="booking.notes" class="bg-slate-900/40 border border-slate-800 rounded-[32px] p-8">
           <h3 class="text-xs font-black text-slate-500 uppercase tracking-[0.3em] mb-6 italic">Client Transmission</h3>
           <div class="bg-slate-950/40 p-8 rounded-2xl border border-slate-800/50 italic text-slate-300 leading-relaxed font-medium">
              "{{ booking.notes }}"
           </div>
        </div>
      </div>

      <!-- Side Column: Intelligence -->
      <div class="space-y-10">
        <!-- Client Profile -->
        <div class="bg-slate-900/40 border border-slate-800 rounded-[32px] overflow-hidden">
           <div class="p-8 border-b border-slate-800 bg-slate-900/20">
              <h3 class="text-xs font-black text-white uppercase tracking-[0.2em] italic">Client Profile</h3>
           </div>
           <div class="p-8 space-y-8">
              <div class="flex flex-col items-center text-center space-y-4">
                 <div class="w-24 h-24 rounded-3xl bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-teal-400 font-black text-4xl shadow-2xl overflow-hidden">
                    <img v-if="booking.user.profile?.avatarUrl" :src="booking.user.profile.avatarUrl" class="w-full h-full object-cover" />
                    <template v-else>{{ booking.user.fullName?.[0] }}</template>
                 </div>
                 <div>
                    <div class="text-xl font-bold text-white tracking-tight">{{ booking.user.fullName || 'Anonymous' }}</div>
                    <div class="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Verified Consumer</div>
                 </div>
              </div>

              <div class="space-y-4 pt-8 border-t border-slate-800/50">
                 <div class="flex items-center gap-4 text-slate-400">
                    <div class="w-8 h-8 rounded-lg bg-slate-950 flex items-center justify-center shrink-0 border border-slate-800">
                       <Mail class="w-4 h-4" />
                    </div>
                    <span class="text-xs font-bold truncate">{{ booking.user.email }}</span>
                 </div>
                 <div v-if="booking.user.profile?.phone" class="flex items-center gap-4 text-slate-400">
                    <div class="w-8 h-8 rounded-lg bg-slate-950 flex items-center justify-center shrink-0 border border-slate-800">
                       <Phone class="w-4 h-4" />
                    </div>
                    <span class="text-xs font-bold">{{ booking.user.profile.phone }}</span>
                 </div>
              </div>
           </div>
        </div>

        <!-- Venue Intelligence -->
        <div class="bg-slate-900/40 border border-slate-800 rounded-[32px] overflow-hidden">
           <div class="p-8 border-b border-slate-800 bg-slate-900/20">
              <h3 class="text-xs font-black text-white uppercase tracking-[0.2em] italic">Venue Node</h3>
           </div>
           <div class="p-8 space-y-8">
              <div>
                 <div class="text-lg font-bold text-white tracking-tight">{{ booking.venue.name }}</div>
                 <div class="text-[10px] text-teal-500 font-black uppercase tracking-widest mt-1">Active Provider</div>
              </div>

              <div class="space-y-4 pt-2">
                 <div class="flex items-start gap-4 text-slate-400">
                    <div class="w-8 h-8 rounded-lg bg-slate-950 flex items-center justify-center shrink-0 border border-slate-800 mt-1">
                       <MapPin class="w-4 h-4" />
                    </div>
                    <div class="text-xs font-bold leading-relaxed">
                       {{ booking.venue.address?.street }}<br />
                       {{ booking.venue.address?.suburb }}, {{ booking.venue.address?.city }}<br />
                       {{ booking.venue.address?.country }}
                    </div>
                 </div>
                 <div class="flex items-center gap-4 text-slate-400">
                    <div class="w-8 h-8 rounded-lg bg-slate-950 flex items-center justify-center shrink-0 border border-slate-800">
                       <Phone class="w-4 h-4" />
                    </div>
                    <span class="text-xs font-bold">{{ booking.venue.contact?.phone }}</span>
                 </div>
              </div>

              <NuxtLink :to="`/venue/${booking.venue.slug}`" target="_blank" class="block w-full py-4 text-center bg-slate-950 text-slate-400 font-black uppercase tracking-widest text-[10px] rounded-xl hover:text-white border border-slate-800 hover:border-slate-700 transition-all">
                 Inspect Public Node
              </NuxtLink>
           </div>
        </div>
      </div>
    </div>
  </div>
</template>
