<script setup lang="ts">
import {
  Plus,
  Search,
  Mail,
  Phone,
  Calendar,
  Star,
  MoreVertical,
  Settings,
  ShieldCheck,
  Clock,
  UserPlus
} from 'lucide-vue-next'

definePageMeta({
  layout: 'business',
  middleware: 'auth'
})

const team = ref([
  {
    id: '1',
    name: 'Sarah Miller',
    title: 'Senior Therapist',
    email: 'sarah.m@example.com',
    phone: '+1 234 567 890',
    rating: 4.9,
    reviewCount: 124,
    status: 'active',
    avatar: ''
  },
  {
    id: '2',
    name: 'Michael Chen',
    title: 'Esthetician',
    email: 'm.chen@example.com',
    phone: '+1 234 567 891',
    rating: 4.8,
    reviewCount: 86,
    status: 'active',
    avatar: ''
  },
  {
    id: '3',
    name: 'Jessica Alba',
    title: 'Massage Specialist',
    email: 'j.alba@example.com',
    phone: '+1 234 567 892',
    rating: 5.0,
    reviewCount: 42,
    status: 'on_leave',
    avatar: ''
  },
])

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-green-50 text-green-700 border-green-100'
    case 'on_leave': return 'bg-amber-50 text-amber-700 border-amber-100'
    case 'inactive': return 'bg-slate-50 text-slate-700 border-slate-100'
    default: return 'bg-slate-50 text-slate-700 border-slate-100'
  }
}
</script>

<template>
  <div class="space-y-8">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-extrabold text-slate-900">Team Members</h1>
        <p class="text-slate-500">Manage your staff, their roles, and availability.</p>
      </div>
      <UiButton label="Invite Member" :icon="UserPlus" />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Add Member Card -->
      <button class="h-full min-h-[240px] rounded-2xl border-2 border-dashed border-slate-200 hover:border-primary hover:bg-blue-50/30 transition-all flex flex-col items-center justify-center group">
        <div class="w-12 h-12 bg-slate-100 group-hover:bg-primary/10 rounded-full flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors mb-4">
          <Plus class="w-6 h-6" />
        </div>
        <span class="font-bold text-slate-900">Add Team Member</span>
        <span class="text-xs text-slate-400 mt-1">Setup schedule and permissions</span>
      </button>

      <!-- Member Cards -->
      <div v-for="member in team" :key="member.id" class="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
        <div class="p-6">
          <div class="flex justify-between items-start mb-6">
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 text-xl font-black">
                {{ member.name.charAt(0) }}
              </div>
              <div>
                <h3 class="font-bold text-slate-900 group-hover:text-primary transition-colors">{{ member.name }}</h3>
                <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">{{ member.title }}</p>
              </div>
            </div>
            <button class="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-50 transition-colors">
              <MoreVertical class="w-5 h-5" />
            </button>
          </div>

          <div class="space-y-3 mb-6">
            <div class="flex items-center gap-3 text-sm text-slate-600">
              <Mail class="w-4 h-4 text-slate-400" />
              {{ member.email }}
            </div>
            <div class="flex items-center gap-3 text-sm text-slate-600">
              <Phone class="w-4 h-4 text-slate-400" />
              {{ member.phone }}
            </div>
          </div>

          <div class="flex items-center justify-between pt-6 border-t border-slate-50">
            <div class="flex items-center gap-1.5">
              <Star class="w-4 h-4 text-amber-400 fill-amber-400" />
              <span class="text-sm font-bold text-slate-900">{{ member.rating }}</span>
              <span class="text-[10px] font-bold text-slate-400">({{ member.reviewCount }} reviews)</span>
            </div>
            <span :class="['px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border', getStatusColor(member.status)]">
              {{ member.status.replace('_', ' ') }}
            </span>
          </div>
        </div>

        <div class="px-6 py-4 bg-slate-50/50 flex items-center justify-between border-t border-slate-50">
          <button class="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-primary transition-colors">
            <Clock class="w-3.5 h-3.5" />
            Schedule
          </button>
          <button class="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-primary transition-colors">
            <Settings class="w-3.5 h-3.5" />
            Settings
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
