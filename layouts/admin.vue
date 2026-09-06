<script setup lang="ts">
import {
  BarChart3,
  Store,
  Users,
  ShieldCheck,
  Settings,
  LogOut,
  Bell,
  Search
} from 'lucide-vue-next'

const navItems = [
  { label: 'Overview', icon: BarChart3, to: '/admin' },
  { label: 'Venues', icon: Store, to: '/admin/venues' },
  { label: 'Users', icon: Users, to: '/admin/users' },
  { label: 'Security', icon: ShieldCheck, to: '/admin/security' },
  { label: 'Settings', icon: Settings, to: '/admin/settings' },
]

const { logout } = useAuth()
const handleLogout = async () => {
  await logout()
  navigateTo('/auth/login')
}
</script>

<template>
  <div class="min-h-screen bg-slate-900 flex text-slate-300">
    <!-- Sidebar -->
    <aside class="w-64 bg-slate-950 border-r border-slate-800 hidden md:flex flex-col sticky top-0 h-screen">
      <div class="p-6 border-b border-slate-800 flex items-center gap-3">
        <div class="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center text-slate-900 font-black">A</div>
        <span class="font-extrabold text-white tracking-tight">DailyBookings <span class="text-teal-500">Admin</span></span>
      </div>

      <nav class="flex-1 p-4 space-y-1">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 px-4 py-3 text-slate-400 font-bold rounded-xl hover:bg-slate-900 hover:text-white transition-all group"
          active-class="bg-teal-500/10 !text-teal-400"
        >
          <component :is="item.icon" class="w-5 h-5" />
          {{ item.label }}
        </NuxtLink>
      </nav>

      <div class="p-4 border-t border-slate-800 space-y-4">
        <button
          @click="handleLogout"
          class="w-full flex items-center gap-3 px-4 py-3 text-slate-500 font-bold rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-all"
        >
          <LogOut class="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col min-h-screen overflow-hidden bg-slate-900">
      <!-- Top Header -->
      <header class="h-16 bg-slate-950/50 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-8 sticky top-0 z-10">
        <div class="relative w-96 hidden md:block">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search venues, users, or transactions..."
            class="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
          />
        </div>

        <div class="flex items-center gap-4">
          <button class="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-colors relative">
            <Bell class="w-5 h-5" />
            <span class="absolute top-2 right-2 w-2 h-2 bg-teal-500 rounded-full border-2 border-slate-950"></span>
          </button>
          <div class="w-8 h-8 rounded-full bg-teal-500/20 border border-teal-500/50 flex items-center justify-center text-teal-500 font-bold text-xs">
            JD
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <div class="p-8 flex-1 overflow-y-auto">
        <slot />
      </div>
    </main>
  </div>
</template>
