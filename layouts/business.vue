<script setup lang="ts">
import {
  LayoutDashboard,
  Calendar,
  Scissors,
  Users,
  Settings,
  ChevronRight,
  LogOut,
  Bell,
  MessageSquare,
  Menu,
  X
} from 'lucide-vue-next'

const navItems = [
  { label: 'Overview', icon: LayoutDashboard, to: '/business' },
  { label: 'Calendar', icon: Calendar, to: '/business/calendar' },
  { label: 'Services', icon: Scissors, to: '/business/services' },
  { label: 'Team', icon: Users, to: '/business/team' },
  { label: 'Reviews', icon: MessageSquare, to: '/business/reviews' },
  { label: 'Settings', icon: Settings, to: '/business/settings' },
]

const { dbUser, logout } = useAuth()

const handleLogout = async () => {
  await logout()
  navigateTo('/auth/login')
}

const initials = computed(() => {
  if (!dbUser.value?.fullName) return 'B'
  return dbUser.value.fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase()
})

const mainVenueSlug = computed(() => dbUser.value?.businesses?.[0]?.venues?.[0]?.slug)

const isMobileMenuOpen = ref(false)
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex">
    <!-- Sidebar -->
    <aside class="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col sticky top-0 h-screen">
      <div class="p-6 border-b border-slate-100 flex items-center gap-3">
        <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-black">D</div>
        <span class="font-extrabold text-slate-900 tracking-tight">DailyBookings</span>
      </div>

      <nav class="flex-1 p-4 space-y-1">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 px-4 py-3 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors group"
          active-class="bg-primary/5 !text-primary"
        >
          <component :is="item.icon" class="w-5 h-5 group-hover:scale-110 transition-transform" />
          {{ item.label }}
        </NuxtLink>
      </nav>

      <div class="p-4 border-t border-slate-100 space-y-4">
        <div class="flex items-center gap-3 px-4 py-2">
          <div class="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 text-xs font-bold overflow-hidden">
            <img v-if="dbUser?.profile?.avatarUrl" :src="dbUser.profile.avatarUrl" class="w-full h-full object-cover" />
            <template v-else>{{ initials }}</template>
          </div>
          <div class="overflow-hidden">
            <div class="text-sm font-bold text-slate-900 truncate">{{ dbUser?.fullName || 'Business Owner' }}</div>
            <div class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Business Owner</div>
          </div>
        </div>
        <button
          @click="handleLogout"
          class="w-full flex items-center gap-3 px-4 py-3 text-red-600 font-bold rounded-xl hover:bg-red-50 transition-colors"
        >
          <LogOut class="w-5 h-5" />
          Logout
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
        <div v-if="isMobileMenuOpen" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] lg:hidden">
          <Transition
            enter-active-class="transition duration-500 ease-out"
            enter-from-class="-translate-x-full"
            enter-to-class="translate-x-0"
            leave-active-class="transition duration-300 ease-in"
            leave-from-class="translate-x-0"
            leave-to-class="-translate-x-full"
          >
            <div class="w-72 bg-white h-full flex flex-col shadow-2xl">
               <div class="p-6 border-b border-slate-100 flex items-center justify-between">
                  <div class="flex items-center gap-3">
                     <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-black">D</div>
                     <span class="font-extrabold text-slate-900">DailyBookings</span>
                  </div>
                  <button @click="isMobileMenuOpen = false" class="p-2 text-slate-400">
                     <X class="w-6 h-6" />
                  </button>
               </div>

               <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
                  <NuxtLink
                    v-for="item in navItems"
                    :key="item.to"
                    :to="item.to"
                    @click="isMobileMenuOpen = false"
                    class="flex items-center gap-3 px-4 py-3 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors"
                    active-class="bg-primary/5 !text-primary"
                  >
                    <component :is="item.icon" class="w-5 h-5" />
                    <span>{{ item.label }}</span>
                  </NuxtLink>
               </nav>

               <div class="p-4 border-t border-slate-100">
                  <button @click="handleLogout" class="w-full flex items-center gap-3 px-4 py-3 text-red-600 font-bold rounded-xl hover:bg-red-50 transition-colors">
                    <LogOut class="w-5 h-5" />
                    Logout
                  </button>
               </div>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col min-h-screen overflow-hidden">
      <!-- Top Header -->
      <header class="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
        <div class="flex items-center gap-4">
          <button @click="isMobileMenuOpen = true" class="lg:hidden p-2 text-slate-400 hover:text-slate-600">
            <Menu class="w-6 h-6" />
          </button>
          <h2 class="text-lg font-bold text-slate-900 md:hidden truncate max-w-[150px]">DailyBookings</h2>
        </div>
        <div class="hidden md:block"></div>

        <div class="flex items-center gap-4">
          <button class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors relative">
            <Bell class="w-5 h-5" />
            <span class="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-white"></span>
          </button>
          <NuxtLink v-if="mainVenueSlug" :to="`/venue/${mainVenueSlug}`" target="_blank" class="text-xs font-bold text-primary hover:underline px-3 py-1 bg-primary/5 rounded-full">
            View Public Page
          </NuxtLink>
        </div>
      </header>

      <!-- Page Content -->
      <div class="p-8 flex-1 overflow-y-auto">
        <slot />
      </div>
    </main>
  </div>
</template>
