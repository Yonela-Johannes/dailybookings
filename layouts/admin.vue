<script setup lang="ts">
import {
  LayoutDashboard,
  Store,
  Users,
  ShieldCheck,
  Settings,
  LogOut,
  Bell,
  Search,
  MessageSquare,
  Calendar,
  Layers,
  FileText,
  Menu,
  X
} from 'lucide-vue-next'

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/admin' },
  { label: 'Categories', icon: Layers, to: '/admin/categories' },
  { label: 'Venues', icon: Store, to: '/admin/venues' },
  { label: 'Users', icon: Users, to: '/admin/users' },
  { label: 'Bookings', icon: Calendar, to: '/admin/bookings' },
  { label: 'Reviews', icon: MessageSquare, to: '/admin/reviews' },
  { label: 'Blog', icon: FileText, to: '/admin/blog' },
]

const { dbUser, logout } = useAuth()
const handleLogout = async () => {
  await logout()
  navigateTo('/auth/login')
}

const initials = computed(() => {
  if (!dbUser.value?.fullName) return 'A'
  return dbUser.value.fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase()
})

const isMobileMenuOpen = ref(false)
</script>

<template>
  <div class="min-h-screen bg-slate-950 flex text-slate-300 font-sans selection:bg-teal-500/30 selection:text-teal-200">
    <!-- Sidebar -->
    <aside class="w-72 bg-slate-950 border-r border-slate-900 hidden lg:flex flex-col sticky top-0 h-screen z-50">
      <div class="p-8 border-b border-slate-900 flex items-center gap-4">
        <div class="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center text-slate-950 font-black shadow-lg shadow-teal-500/20">D</div>
        <div class="flex flex-col">
          <span class="font-black text-white text-lg leading-tight uppercase tracking-tighter italic">DailyBookings</span>
          <span class="text-[10px] font-bold text-teal-500 uppercase tracking-[0.2em] leading-none">Admin Control</span>
        </div>
      </div>

      <nav class="flex-1 p-6 space-y-2 overflow-y-auto custom-scrollbar">
        <div class="mb-4 px-4 text-[10px] font-black text-slate-600 uppercase tracking-widest">Main Menu</div>
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-4 px-4 py-3 text-slate-400 font-bold rounded-xl hover:bg-slate-900 hover:text-white transition-all duration-300 group relative overflow-hidden"
          active-class="bg-teal-500/10 !text-teal-400 border border-teal-500/20 shadow-lg shadow-teal-500/5"
        >
          <component :is="item.icon" class="w-5 h-5 transition-transform group-hover:scale-110" />
          <span class="text-sm">{{ item.label }}</span>
          <div v-if="$route.path === item.to" class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-teal-500 rounded-r-full shadow-[0_0_12px_rgba(20,184,166,0.5)]"></div>
        </NuxtLink>
      </nav>

      <div class="p-6 border-t border-slate-900 space-y-6">
        <div class="flex items-center gap-4 px-4 py-2">
           <div class="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-teal-500 font-black shadow-inner overflow-hidden">
             <img v-if="dbUser?.profile?.avatarUrl" :src="dbUser.profile.avatarUrl" class="w-full h-full object-cover" />
             <template v-else>{{ initials }}</template>
           </div>
           <div class="flex flex-col min-w-0">
             <span class="text-sm font-bold text-white truncate">{{ dbUser?.fullName || 'Admin' }}</span>
             <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest truncate">{{ dbUser?.email }}</span>
           </div>
        </div>
        <button
          @click="handleLogout"
          class="w-full flex items-center gap-4 px-4 py-4 text-slate-500 font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-red-500/10 hover:text-red-400 border border-transparent hover:border-red-500/20 transition-all duration-300"
        >
          <LogOut class="w-4 h-4" />
          System Logout
        </button>
      </div>
    </aside>

    <!-- Mobile Sidebar -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="isMobileMenuOpen" class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100] lg:hidden">
          <Transition
            enter-active-class="transition duration-500 ease-out"
            enter-from-class="-translate-x-full"
            enter-to-class="translate-x-0"
            leave-active-class="transition duration-300 ease-in"
            leave-from-class="translate-x-0"
            leave-to-class="-translate-x-full"
          >
            <div class="w-72 bg-slate-950 border-r border-slate-900 h-full flex flex-col">
               <div class="p-8 border-b border-slate-900 flex items-center justify-between">
                  <div class="flex items-center gap-4">
                     <div class="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center text-slate-950 font-black shadow-lg">D</div>
                     <span class="font-black text-white italic tracking-tighter">DailyBookings</span>
                  </div>
                  <button @click="isMobileMenuOpen = false" class="p-2 text-slate-500">
                     <X class="w-6 h-6" />
                  </button>
               </div>

               <nav class="flex-1 p-6 space-y-2 overflow-y-auto">
                  <NuxtLink
                    v-for="item in navItems"
                    :key="item.to"
                    :to="item.to"
                    @click="isMobileMenuOpen = false"
                    class="flex items-center gap-4 px-4 py-3 text-slate-400 font-bold rounded-xl hover:bg-slate-900 hover:text-white transition-all"
                    active-class="bg-teal-500/10 !text-teal-400 border border-teal-500/20"
                  >
                    <component :is="item.icon" class="w-5 h-5" />
                    <span class="text-sm">{{ item.label }}</span>
                  </NuxtLink>
               </nav>

               <div class="p-6 border-t border-slate-900">
                  <button @click="handleLogout" class="w-full flex items-center gap-4 px-4 py-4 text-slate-500 font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-all">
                    <LogOut class="w-4 h-4" />
                    System Logout
                  </button>
               </div>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col min-h-screen overflow-hidden bg-slate-950">
      <!-- Top Header -->
      <header class="h-20 bg-slate-950/80 backdrop-blur-xl border-b border-slate-900 flex items-center justify-between px-10 sticky top-0 z-40">
        <div class="flex items-center gap-4 lg:gap-8 flex-1">
          <button @click="isMobileMenuOpen = true" class="lg:hidden p-2 text-slate-400 hover:text-white">
            <Menu class="w-6 h-6" />
          </button>

          <div class="relative w-full max-w-md group hidden sm:block">
            <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-teal-500 transition-colors" />
            <input
              type="text"
              placeholder="Search global records..."
              class="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-800 rounded-2xl text-xs text-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500/30 outline-none transition-all placeholder:text-slate-600 font-bold"
            />
          </div>
        </div>

        <div class="flex items-center gap-6">
          <button class="p-3 text-slate-500 hover:text-white hover:bg-slate-900 rounded-xl transition-all relative border border-transparent hover:border-slate-800 group">
            <Bell class="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span class="absolute top-3 right-3 w-2 h-2 bg-teal-500 rounded-full border-2 border-slate-950 shadow-[0_0_8px_rgba(20,184,166,0.6)]"></span>
          </button>

          <div class="h-8 w-px bg-slate-900 mx-2"></div>

          <div class="flex items-center gap-3">
             <div class="text-right hidden sm:block">
                <div class="text-xs font-black text-white uppercase tracking-widest">{{ dbUser?.fullName || 'Administrator' }}</div>
                <div class="text-[10px] font-bold text-teal-500 uppercase tracking-[0.2em]">Platform Root</div>
             </div>
             <div class="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 font-black shadow-lg">
                {{ initials }}
             </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <div class="p-10 flex-1 overflow-y-auto custom-scrollbar relative">
        <!-- Background Accents -->
        <div class="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-teal-500/5 to-transparent pointer-events-none"></div>
        <slot />
      </div>
    </main>
  </div>
</template>

<style>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #1e293b;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #334155;
}
</style>
