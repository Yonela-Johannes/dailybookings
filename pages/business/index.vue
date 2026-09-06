<script setup lang="ts">
import {
  TrendingUp,
  Users,
  Calendar,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Star
} from 'lucide-vue-next'

definePageMeta({
  layout: 'business',
  middleware: 'auth'
})

// Mock stats - In real app, fetch from /api/business/stats
const stats = [
  { label: 'Total Revenue', value: '$12,840', change: '+12.5%', trend: 'up', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'New Bookings', value: '156', change: '+18.2%', trend: 'up', icon: Calendar, color: 'text-primary', bg: 'bg-blue-50' },
  { label: 'Avg. Rating', value: '4.9', change: '+0.1', trend: 'up', icon: Star, color: 'text-amber-500', bg: 'bg-amber-50' },
  { label: 'Active Customers', value: '892', change: '-2.4%', trend: 'down', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
]

const recentBookings = [
  { id: 1, customer: 'Sarah Miller', service: 'Full Body Massage', date: 'Today, 2:00 PM', status: 'confirmed', amount: '$85' },
  { id: 2, customer: 'John Doe', service: 'Haircut & Styling', date: 'Today, 3:30 PM', status: 'pending', amount: '$45' },
  { id: 3, customer: 'Emily Chen', service: 'Manicure', date: 'Tomorrow, 10:00 AM', status: 'confirmed', amount: '$35' },
  { id: 4, customer: 'Michael Ross', service: 'Facial', date: 'Tomorrow, 11:30 AM', status: 'confirmed', amount: '$70' },
]
</script>

<template>
  <div class="space-y-8">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-extrabold text-slate-900">Dashboard Overview</h1>
        <p class="text-slate-500">Welcome back! Here's what's happening with your business today.</p>
      </div>
      <div class="flex items-center gap-3">
        <select class="bg-white border border-slate-200 text-slate-700 text-sm font-bold px-4 py-2 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none">
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>This month</option>
          <option>This year</option>
        </select>
        <UiButton label="Download Report" type="outline" />
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="stat in stats" :key="stat.label" class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <div :class="['w-12 h-12 rounded-xl flex items-center justify-center', stat.bg, stat.color]">
            <component :is="stat.icon" class="w-6 h-6" />
          </div>
          <div :class="['flex items-center text-xs font-bold px-2 py-1 rounded-full', stat.trend === 'up' ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50']">
            <component :is="stat.trend === 'up' ? ArrowUpRight : ArrowDownRight" class="w-3 h-3 mr-1" />
            {{ stat.change }}
          </div>
        </div>
        <div class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">{{ stat.label }}</div>
        <div class="text-2xl font-black text-slate-900">{{ stat.value }}</div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Recent Bookings -->
      <div class="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div class="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 class="text-xl font-bold text-slate-900">Recent Bookings</h2>
          <NuxtLink to="/business/calendar" class="text-sm font-bold text-primary hover:underline">View Calendar</NuxtLink>
        </div>

        <div class="divide-y divide-slate-100">
          <div v-for="booking in recentBookings" :key="booking.id" class="p-6 hover:bg-slate-50 transition-colors group">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
                  {{ booking.customer.charAt(0) }}
                </div>
                <div>
                  <h3 class="font-bold text-slate-900">{{ booking.customer }}</h3>
                  <div class="text-sm text-slate-500 flex items-center gap-2">
                    <span class="font-medium text-primary">{{ booking.service }}</span>
                    <span>•</span>
                    <span>{{ booking.date }}</span>
                  </div>
                </div>
              </div>
              <div class="flex items-center gap-6">
                <div class="text-right hidden sm:block">
                  <div class="text-sm font-bold text-slate-900">{{ booking.amount }}</div>
                  <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Paid</div>
                </div>
                <span :class="['px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full border',
                  booking.status === 'confirmed' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-yellow-50 text-yellow-700 border-yellow-100']">
                  {{ booking.status }}
                </span>
                <button class="p-2 text-slate-400 hover:text-slate-600 rounded-lg">
                  <MoreVertical class="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="p-6 bg-slate-50/50 text-center">
          <UiButton label="View All Bookings" type="outline" class="!px-8" />
        </div>
      </div>

      <!-- Quick Actions & Tips -->
      <div class="space-y-8">
        <div class="bg-primary rounded-2xl p-6 text-white shadow-xl shadow-blue-200">
          <h2 class="text-xl font-bold mb-2">Grow your business</h2>
          <p class="text-blue-100 text-sm mb-6 leading-relaxed">Promote your services with a featured spot on the discovery page to reach 3x more customers.</p>
          <UiButton label="Get Started" class="w-full !bg-white !text-primary !border-0" />
        </div>

        <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 class="text-lg font-bold text-slate-900 mb-4">Quick Links</h2>
          <div class="space-y-2">
            <NuxtLink to="/business/services" class="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors group">
              <span class="font-bold text-slate-600 group-hover:text-primary">Manage Services</span>
              <UiButton label="Edit" type="outline" class="!py-1 !px-3 !text-xs" />
            </NuxtLink>
            <NuxtLink to="/business/team" class="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors group">
              <span class="font-bold text-slate-600 group-hover:text-primary">Team Schedule</span>
              <UiButton label="Manage" type="outline" class="!py-1 !px-3 !text-xs" />
            </NuxtLink>
            <NuxtLink to="/business/settings" class="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors group">
              <span class="font-bold text-slate-600 group-hover:text-primary">Venue Profile</span>
              <UiButton label="Setup" type="outline" class="!py-1 !px-3 !text-xs" />
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
