<script setup lang="ts">
import {
  Search,
  UserPlus,
  MoreVertical,
  Mail,
  Calendar,
  Shield,
  Ban,
  Filter
} from 'lucide-vue-next'

definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const users = ref([
  { id: 1, name: 'Emma Wilson', email: 'emma.w@example.com', role: 'admin', joined: 'Jan 12, 2024', status: 'active' },
  { id: 2, name: 'Liam Neeson', email: 'liam.n@example.com', role: 'user', joined: 'Feb 05, 2024', status: 'active' },
  { id: 3, name: 'Sophia Loren', email: 'sophia.l@example.com', role: 'business_owner', joined: 'Mar 20, 2024', status: 'banned' },
  { id: 4, name: 'Noah Ark', email: 'noah.a@example.com', role: 'user', joined: 'Apr 01, 2024', status: 'active' },
])

const getRoleBadge = (role: string) => {
  switch (role) {
    case 'admin': return 'bg-purple-500/10 text-purple-400 border-purple-500/20'
    case 'business_owner': return 'bg-teal-500/10 text-teal-400 border-teal-500/20'
    default: return 'bg-slate-800 text-slate-400 border-slate-700'
  }
}
</script>

<template>
  <div class="space-y-8">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-extrabold text-white">User Management</h1>
        <p class="text-slate-500">Manage platform users, roles, and permissions.</p>
      </div>
      <UiButton label="Add Platform Admin" :icon="UserPlus" class="!bg-teal-500 !text-slate-950 hover:!bg-teal-400" />
    </div>

    <!-- Table Container -->
    <div class="bg-slate-950/50 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      <div class="p-4 border-b border-slate-800 bg-slate-900/50 flex flex-col sm:flex-row items-center gap-4">
        <div class="relative flex-1 w-full">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by name or email..."
            class="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:ring-2 focus:ring-teal-500/20 outline-none"
          />
        </div>
        <div class="flex items-center gap-2 w-full sm:w-auto">
          <select class="bg-slate-900 border border-slate-800 text-slate-400 text-xs font-bold px-4 py-2 rounded-xl focus:ring-2 focus:ring-teal-500/20 outline-none flex-1 sm:flex-none">
            <option>All Roles</option>
            <option>Admins</option>
            <option>Business Owners</option>
            <option>Regular Users</option>
          </select>
          <button class="p-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-400 hover:text-white transition-colors">
            <Filter class="w-5 h-5" />
          </button>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-slate-800 bg-slate-950">
              <th class="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">User</th>
              <th class="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Role</th>
              <th class="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Joined Date</th>
              <th class="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Status</th>
              <th class="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800">
            <tr v-for="user in users" :key="user.id" class="hover:bg-slate-900/50 transition-colors group">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-teal-500 font-bold">
                    {{ user.name.charAt(0) }}
                  </div>
                  <div>
                    <div class="font-bold text-white">{{ user.name }}</div>
                    <div class="text-xs text-slate-500 flex items-center gap-1">
                      <Mail class="w-3 h-3" />
                      {{ user.email }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <span :class="['px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest rounded-full border', getRoleBadge(user.role)]">
                  {{ user.role.replace('_', ' ') }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <Calendar class="w-3.5 h-3.5 text-slate-600" />
                  {{ user.joined }}
                </div>
              </td>
              <td class="px-6 py-4 text-right">
                <span :class="['text-[10px] font-black uppercase tracking-widest', user.status === 'active' ? 'text-teal-500' : 'text-red-500']">
                  {{ user.status }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button class="p-2 text-slate-500 hover:text-white rounded-lg hover:bg-slate-800 transition-colors" title="Edit Permissions">
                    <Shield class="w-5 h-5" />
                  </button>
                  <button v-if="user.status !== 'banned'" class="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors" title="Ban User">
                    <Ban class="w-5 h-5" />
                  </button>
                  <button class="p-2 text-slate-500 hover:text-white rounded-lg hover:bg-slate-800 transition-colors">
                    <MoreVertical class="w-5 h-5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
