<script setup lang="ts">
import {
  Search,
  UserPlus,
  MoreVertical,
  Mail,
  Calendar,
  Shield,
  Ban,
  Filter,
  Loader2
} from 'lucide-vue-next'

definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const search = ref('')
const roleFilter = ref('')
const page = ref(1)

const { data: usersData, pending, refresh } = useFetch('/api/admin/users', {
  query: {
    search,
    role: roleFilter,
    page,
    limit: 10
  },
  watch: [search, roleFilter, page]
})

const users = computed(() => usersData.value?.users || [])
const meta = computed(() => usersData.value?.meta || { total: 0, page: 1, totalPages: 1 })

const getRoleBadge = (role: string) => {
  switch (role) {
    case 'PLATFORM_ADMIN': return 'bg-purple-500/10 text-purple-400 border-purple-500/20'
    case 'BUSINESS_OWNER': return 'bg-teal-500/10 text-teal-400 border-teal-500/20'
    case 'CUSTOMER': return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
    default: return 'bg-slate-800 text-slate-400 border-slate-700'
  }
}

const updateRole = async (userId: string, role: string) => {
  try {
    await $fetch(`/api/admin/users/${userId}`, {
      method: 'PATCH',
      body: { role }
    })
    refresh()
  } catch (error) {
    console.error('Failed to update user role:', error)
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
            v-model="search"
            type="text"
            placeholder="Search by name or email..."
            class="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:ring-2 focus:ring-teal-500/20 outline-none"
          />
        </div>
        <div class="flex items-center gap-2 w-full sm:w-auto">
          <select v-model="roleFilter" class="bg-slate-900 border border-slate-800 text-slate-400 text-xs font-bold px-4 py-2 rounded-xl focus:ring-2 focus:ring-teal-500/20 outline-none flex-1 sm:flex-none">
            <option value="">All Roles</option>
            <option value="PLATFORM_ADMIN">Admins</option>
            <option value="BUSINESS_OWNER">Business Owners</option>
            <option value="CUSTOMER">Customers</option>
          </select>
          <button @click="refresh" class="p-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-400 hover:text-white transition-colors">
            <Filter class="w-5 h-5" />
          </button>
        </div>
      </div>

      <div class="overflow-x-auto min-h-[400px]">
        <div v-if="pending" class="flex items-center justify-center py-20">
          <Loader2 class="w-8 h-8 text-teal-500 animate-spin" />
        </div>
        <table v-else class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-slate-800 bg-slate-950">
              <th class="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">User</th>
              <th class="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Role</th>
              <th class="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Joined Date</th>
              <th class="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Activity</th>
              <th class="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800">
            <tr v-for="user in users" :key="user.id" class="hover:bg-slate-900/50 transition-colors group">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-teal-500 font-bold overflow-hidden">
                    <img v-if="user.profile?.avatarUrl" :src="user.profile.avatarUrl" class="w-full h-full object-cover" />
                    <template v-else>{{ user.fullName?.charAt(0) || user.email.charAt(0) }}</template>
                  </div>
                  <div>
                    <div class="font-bold text-white">{{ user.fullName || 'No Name' }}</div>
                    <div class="text-xs text-slate-500 flex items-center gap-1">
                      <Mail class="w-3 h-3" />
                      {{ user.email }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <span :class="['px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest rounded-full border', getRoleBadge(user.role)]">
                  {{ user.role?.replace('_', ' ') }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <Calendar class="w-3.5 h-3.5 text-slate-600" />
                  {{ new Date(user.createdAt).toLocaleDateString() }}
                </div>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  {{ user._count?.bookings }} Bookings
                </div>
                <div class="text-[10px] font-bold text-slate-600">
                  {{ user._count?.businesses }} Businesses
                </div>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <div class="relative group/menu">
                    <button class="p-2 text-slate-500 hover:text-white rounded-lg hover:bg-slate-800 transition-colors">
                      <Shield class="w-5 h-5" />
                    </button>
                    <!-- Simple Role Dropdown on Hover for demo, could be a real menu -->
                    <div class="absolute right-0 bottom-full mb-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-xl hidden group-hover/menu:block z-10 p-2">
                      <button @click="updateRole(user.id, 'CUSTOMER')" class="w-full text-left px-3 py-2 text-xs text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg">Make Customer</button>
                      <button @click="updateRole(user.id, 'BUSINESS_OWNER')" class="w-full text-left px-3 py-2 text-xs text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg">Make Business Owner</button>
                      <button @click="updateRole(user.id, 'PLATFORM_ADMIN')" class="w-full text-left px-3 py-2 text-xs text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg">Make Admin</button>
                    </div>
                  </div>
                  <button class="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors" title="Ban User">
                    <Ban class="w-5 h-5" />
                  </button>
                  <button class="p-2 text-slate-500 hover:text-white rounded-lg hover:bg-slate-800 transition-colors">
                    <MoreVertical class="w-5 h-5" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="users.length === 0 && !pending">
              <td colspan="5" class="px-6 py-20 text-center text-slate-500">
                No users found matching your search.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="p-6 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
        <div class="text-xs font-bold text-slate-500 uppercase tracking-widest">
          Showing {{ users.length }} of {{ meta.total }} users
        </div>
        <div class="flex items-center gap-2">
          <button
            :disabled="page === 1"
            @click="page--"
            class="px-4 py-2 bg-slate-900 border border-slate-800 text-slate-500 font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors"
          >
            Previous
          </button>
          <button
            :disabled="page >= meta.totalPages"
            @click="page++"
            class="px-4 py-2 bg-slate-900 border border-slate-800 text-white font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
