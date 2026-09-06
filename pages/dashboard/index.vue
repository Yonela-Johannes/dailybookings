<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Calendar,
  Clock,
  User,
  Mail,
  TrendingUp,
  CalendarDays,
  CheckCircle2,
  Clock3,
  XCircle,
  MoreVertical
} from 'lucide-vue-next'
import { format, isAfter, isBefore, parseISO } from 'date-fns'

definePageMeta({
  middleware: 'auth'
})

// Mock data - In real app, fetch from /api/bookings
const { data: bookings, pending } = await useAsyncData('dashboard-bookings', async () => {
  // Simulate fetch delay
  await new Promise(r => setTimeout(r, 500))
  return [
    {
      id: 1,
      customerName: 'Alice Johnson',
      customerEmail: 'alice@example.com',
      serviceName: 'Deep Tissue Massage',
      startTime: '2024-06-20T10:00:00Z',
      status: 'confirmed',
      notes: 'Focus on lower back'
    },
    {
      id: 2,
      customerName: 'Bob Smith',
      customerEmail: 'bob@example.com',
      serviceName: 'Swedish Massage',
      startTime: '2024-06-20T14:30:00Z',
      status: 'pending',
      notes: ''
    },
    {
      id: 3,
      customerName: 'Charlie Brown',
      customerEmail: 'charlie@example.com',
      serviceName: 'Facial Treatment',
      startTime: '2024-06-15T11:00:00Z',
      status: 'confirmed',
      notes: 'First time client'
    }
  ]
})

const now = new Date()

const upcomingBookings = computed(() => {
  if (!bookings.value) return []
  return bookings.value
    .filter(b => isAfter(parseISO(b.startTime), now))
    .sort((a, b) => parseISO(a.startTime).getTime() - parseISO(b.startTime).getTime())
})

const pastBookings = computed(() => {
  if (!bookings.value) return []
  return bookings.value
    .filter(b => isBefore(parseISO(b.startTime), now))
    .sort((a, b) => parseISO(b.startTime).getTime() - parseISO(a.startTime).getTime())
})

const stats = computed(() => {
  if (!bookings.value) return { total: 0, upcoming: 0, revenue: 0 }
  return {
    total: bookings.value.length,
    upcoming: upcomingBookings.value.length,
    today: upcomingBookings.value.filter(b => {
      const date = parseISO(b.startTime)
      return format(date, 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd')
    }).length
  }
})

const getStatusColor = (status: string) => {
  switch (status) {
    case 'confirmed': return 'bg-green-50 text-green-700 border-green-100'
    case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-100'
    case 'cancelled': return 'bg-red-50 text-red-700 border-red-100'
    default: return 'bg-slate-50 text-slate-700 border-slate-100'
  }
}
</script>

<template>
  <div class="space-y-8">
    <header class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-extrabold text-slate-900">Dashboard</h1>
        <p class="text-slate-500 text-lg">Manage your appointments and business stats</p>
      </div>
      <NuxtLink
        to="/b/demo"
        target="_blank"
        class="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
      >
        View Public Page
      </NuxtLink>
    </header>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <div class="w-10 h-10 bg-blue-50 text-primary rounded-xl flex items-center justify-center">
            <TrendingUp class="w-5 h-5" />
          </div>
        </div>
        <div class="text-3xl font-extrabold text-slate-900">{{ stats.total }}</div>
        <div class="text-sm font-medium text-slate-500">Total Bookings</div>
      </div>

      <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <div class="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
            <CalendarDays class="w-5 h-5" />
          </div>
        </div>
        <div class="text-3xl font-extrabold text-slate-900">{{ stats.upcoming }}</div>
        <div class="text-sm font-medium text-slate-500">Upcoming Appointments</div>
      </div>

      <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <div class="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
            <Clock3 class="w-5 h-5" />
          </div>
        </div>
        <div class="text-3xl font-extrabold text-slate-900">{{ stats.today }}</div>
        <div class="text-sm font-medium text-slate-500">Scheduled for Today</div>
      </div>
    </div>

    <!-- Bookings List -->
    <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div class="p-6 border-b border-slate-100 flex items-center justify-between">
        <h2 class="text-xl font-bold text-slate-900">Upcoming Bookings</h2>
      </div>

      <div v-if="pending" class="p-12 text-center">
        <div class="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
      </div>

      <div v-else-if="upcomingBookings.length > 0" class="divide-y divide-slate-100">
        <div v-for="booking in upcomingBookings" :key="booking.id" class="p-6 hover:bg-slate-50/50 transition-colors group">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0 font-bold">
                {{ booking.customerName.charAt(0) }}
              </div>
              <div class="space-y-1">
                <div class="flex items-center gap-3">
                  <h3 class="font-bold text-slate-900">{{ booking.customerName }}</h3>
                  <span
                    class="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border"
                    :class="getStatusColor(booking.status)"
                  >
                    {{ booking.status }}
                  </span>
                </div>
                <div class="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
                  <div class="flex items-center gap-1.5">
                    <Calendar class="w-3.5 h-3.5" />
                    {{ format(parseISO(booking.startTime), 'PPP') }}
                  </div>
                  <div class="flex items-center gap-1.5">
                    <Clock class="w-3.5 h-3.5" />
                    {{ format(parseISO(booking.startTime), 'p') }}
                  </div>
                  <div class="font-medium text-primary">
                    {{ booking.serviceName }}
                  </div>
                </div>
              </div>
            </div>

            <div class="flex items-center gap-3 md:self-center">
              <button class="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors">
                <MoreVertical class="w-5 h-5" />
              </button>
            </div>
          </div>
          <div v-if="booking.notes" class="mt-4 ml-16 p-3 bg-slate-50 rounded-lg text-sm text-slate-600 italic">
            "{{ booking.notes }}"
          </div>
        </div>
      </div>

      <div v-else class="p-12 text-center text-slate-500 italic">
        No upcoming bookings found.
      </div>
    </div>

    <!-- Past Bookings (Simplified) -->
    <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div class="p-6 border-b border-slate-100">
        <h2 class="text-xl font-bold text-slate-900">Recent History</h2>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/50">
              <th class="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Customer</th>
              <th class="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Date</th>
              <th class="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Service</th>
              <th class="px-6 py-3 text-xs font-bold text-slate-500 uppercase text-right">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="booking in pastBookings.slice(0, 5)" :key="booking.id" class="hover:bg-slate-50/30 transition-colors">
              <td class="px-6 py-4 font-medium text-slate-900">{{ booking.customerName }}</td>
              <td class="px-6 py-4 text-sm text-slate-500">{{ format(parseISO(booking.startTime), 'MMM d, yyyy') }}</td>
              <td class="px-6 py-4 text-sm text-slate-500">{{ booking.serviceName }}</td>
              <td class="px-6 py-4 text-right">
                <span class="text-xs font-bold text-slate-400 uppercase">{{ booking.status }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
