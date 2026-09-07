<script setup lang="ts">
import {
  Plus,
  Mail,
  Phone,
  Star,
  MoreVertical,
  Settings,
  Clock,
  UserPlus,
  Trash2,
  ChevronRight,
  Loader2,
  AlertCircle
} from 'lucide-vue-next'

definePageMeta({
  layout: 'business',
  middleware: 'auth'
})

// Types from the API
interface Employee {
  id: string
  name: string
  title: string | null
  bio: string | null
  imageUrl: string | null
  venueId: string
  status: string
  schedules: EmployeeSchedule[]
  venue: {
    id: string
    name: string
  }
  _count: {
    reviews: number
  }
}

interface EmployeeSchedule {
  id?: string
  day: number
  startTime: string | null
  endTime: string | null
  isWorking: boolean
}

// Fetching data
const { data: teamData, pending, refresh, error: fetchError } = useFetch('/api/business/team')
const { data: venuesData } = useFetch('/api/business/venues')

const team = computed(() => teamData.value?.data || [])
const venues = computed(() => venuesData.value?.data || [])

// Form State
const isSlideoverOpen = ref(false)
const isEditing = ref(false)
const submitting = ref(false)
const activeTab = ref<'details' | 'schedule'>('details')

const defaultForm = {
  id: '',
  name: '',
  title: '',
  bio: '',
  imageUrl: '',
  venueId: ''
}

const form = ref({ ...defaultForm })

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const schedule = ref<EmployeeSchedule[]>(
  Array.from({ length: 7 }, (_, i) => ({
    day: i,
    startTime: '09:00',
    endTime: '17:00',
    isWorking: true
  }))
)

// Methods
const openAddMember = () => {
  isEditing.value = false
  form.value = { ...defaultForm }
  if (venues.value.length > 0) {
    form.value.venueId = venues.value[0].id
  }
  schedule.value = Array.from({ length: 7 }, (_, i) => ({
    day: i,
    startTime: '09:00',
    endTime: '17:00',
    isWorking: true
  }))
  activeTab.value = 'details'
  isSlideoverOpen.value = true
}

const openEditMember = (member: Employee) => {
  isEditing.value = true
  form.value = {
    id: member.id,
    name: member.name,
    title: member.title || '',
    bio: member.bio || '',
    imageUrl: member.imageUrl || '',
    venueId: member.venueId
  }

  // Initialize schedule from member data or defaults
  const memberSchedules = member.schedules || []
  schedule.value = Array.from({ length: 7 }, (_, i) => {
    const existing = memberSchedules.find(s => s.day === i)
    return existing ? { ...existing } : {
      day: i,
      startTime: '09:00',
      endTime: '17:00',
      isWorking: false
    }
  })

  activeTab.value = 'details'
  isSlideoverOpen.value = true
}

const handleSave = async () => {
  submitting.value = true
  try {
    const payload = {
      action: isEditing.value ? 'update' : 'create',
      id: isEditing.value ? form.value.id : undefined,
      venueId: !isEditing.value ? form.value.venueId : undefined,
      data: {
        name: form.value.name,
        title: form.value.title,
        bio: form.value.bio,
        imageUrl: form.value.imageUrl,
        schedules: schedule.value.map(s => ({
          day: s.day,
          startTime: s.isWorking ? s.startTime : null,
          endTime: s.isWorking ? s.endTime : null,
          isWorking: s.isWorking
        }))
      }
    }

    await $fetch('/api/business/team', {
      method: 'POST',
      body: payload
    })

    await refresh()
    isSlideoverOpen.value = false
  } catch (err: any) {
    alert(err.data?.message || 'Failed to save team member')
  } finally {
    submitting.value = false
  }
}

const handleDelete = async (id: string) => {
  if (!confirm('Are you sure you want to delete this team member?')) return

  try {
    await $fetch('/api/business/team', {
      method: 'POST',
      body: {
        action: 'delete',
        id
      }
    })
    await refresh()
  } catch (err: any) {
    alert(err.data?.message || 'Failed to delete team member')
  }
}

const handleUploaded = (media: any) => {
  form.value.imageUrl = media.url
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-emerald-50 text-emerald-700 border-emerald-100'
    case 'on_leave': return 'bg-amber-50 text-amber-700 border-amber-100'
    case 'inactive': return 'bg-slate-50 text-slate-700 border-slate-100'
    default: return 'bg-slate-50 text-slate-700 border-slate-100'
  }
}
</script>

<template>
  <div class="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div>
        <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">Team Members</h1>
        <p class="text-slate-500 mt-1">Manage your staff, their roles, and availability across all venues.</p>
      </div>
      <UiButton
        label="Invite Member"
        :icon="UserPlus"
        class="bg-primary hover:bg-primary/90 text-white shadow-sm"
        @click="openAddMember"
      />
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
      <Loader2 class="w-10 h-10 text-primary animate-spin mb-4" />
      <p class="text-slate-500 font-medium">Loading team members...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="fetchError" class="flex flex-col items-center justify-center py-20 bg-red-50 rounded-3xl border border-red-100">
      <AlertCircle class="w-12 h-12 text-red-500 mb-4" />
      <h3 class="text-lg font-bold text-red-900">Failed to load team</h3>
      <p class="text-red-600 mt-2">{{ fetchError.statusMessage || 'An unexpected error occurred' }}</p>
      <UiButton label="Try Again" class="mt-6" @click="refresh" />
    </div>

    <!-- Empty State -->
    <div v-else-if="team.length === 0" class="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-200">
      <div class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mb-6">
        <UserPlus class="w-10 h-10" />
      </div>
      <h3 class="text-xl font-bold text-slate-900">No team members yet</h3>
      <p class="text-slate-500 mt-2 text-center max-w-md">Start building your team by inviting your first staff member to your business.</p>
      <UiButton label="Add your first member" :icon="Plus" class="mt-8" @click="openAddMember" />
    </div>

    <!-- Team Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Add Member Placeholder -->
      <button
        @click="openAddMember"
        class="group relative flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-white p-8 text-center hover:border-primary hover:bg-blue-50/30 transition-all duration-300"
      >
        <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-all duration-300">
          <Plus class="h-7 w-7" />
        </div>
        <span class="mt-4 block text-base font-bold text-slate-900">Add Team Member</span>
        <span class="mt-1 block text-sm text-slate-400">Setup schedule and permissions</span>
      </button>

      <!-- Member Cards -->
      <div v-for="member in team" :key="member.id" class="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group">
        <div class="p-8">
          <div class="flex justify-between items-start mb-6">
            <div class="flex items-center gap-5">
              <div v-if="member.imageUrl" class="w-16 h-16 rounded-2xl overflow-hidden border border-slate-100 ring-2 ring-slate-50">
                <img :src="member.imageUrl" :alt="member.name" class="w-full h-full object-cover" />
              </div>
              <div v-else class="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 text-2xl font-black ring-2 ring-slate-50">
                {{ member.name.charAt(0) }}
              </div>
              <div>
                <h3 class="font-bold text-slate-900 group-hover:text-primary transition-colors text-lg">{{ member.name }}</h3>
                <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">{{ member.title || 'Staff Member' }}</p>
                <div class="flex items-center gap-1.5 mt-2">
                  <div class="flex items-center gap-0.5">
                    <Star v-for="i in 5" :key="i" class="w-3 h-3" :class="i <= 4 ? 'text-amber-400 fill-amber-400' : 'text-slate-200'" />
                  </div>
                  <span class="text-[10px] font-bold text-slate-500">({{ member._count?.reviews || 0 }} reviews)</span>
                </div>
              </div>
            </div>

            <div class="relative group/menu">
              <button class="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-50 transition-colors">
                <MoreVertical class="w-5 h-5" />
              </button>
              <div class="absolute right-0 top-full mt-1 hidden group-hover/menu:block z-10 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2">
                <button
                  @click="openEditMember(member)"
                  class="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors text-left"
                >
                  <Settings class="w-4 h-4" />
                  Edit Details
                </button>
                <button
                  @click="handleDelete(member.id)"
                  class="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                >
                  <Trash2 class="w-4 h-4" />
                  Delete Member
                </button>
              </div>
            </div>
          </div>

          <div class="space-y-4 py-6 border-t border-slate-50">
            <div class="flex items-center justify-between text-sm">
              <span class="text-slate-500">Primary Venue</span>
              <span class="font-bold text-slate-900">{{ member.venue?.name }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-slate-500">Status</span>
              <span :class="['px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full border', getStatusColor(member.status)]">
                {{ member.status.replace('_', ' ') }}
              </span>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4 pt-6 border-t border-slate-50">
            <button
              @click="openEditMember(member); activeTab = 'schedule'"
              class="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-50 text-slate-600 hover:bg-primary/10 hover:text-primary transition-all text-xs font-bold"
            >
              <Clock class="w-3.5 h-3.5" />
              Schedule
            </button>
            <button
              @click="openEditMember(member)"
              class="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-50 text-slate-600 hover:bg-primary/10 hover:text-primary transition-all text-xs font-bold"
            >
              <Settings class="w-3.5 h-3.5" />
              Settings
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Slideover Form -->
    <UiSlideover
      :show="isSlideoverOpen"
      :title="isEditing ? 'Edit Team Member' : 'Invite Team Member'"
      @close="isSlideoverOpen = false"
    >
      <div class="space-y-8">
        <!-- Tabs -->
        <div class="flex p-1 bg-slate-100 rounded-2xl">
          <button
            v-for="tab in ['details', 'schedule']"
            :key="tab"
            @click="activeTab = tab as any"
            class="flex-1 py-2 text-sm font-bold rounded-xl capitalize transition-all"
            :class="activeTab === tab ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'"
          >
            {{ tab }}
          </button>
        </div>

        <!-- Details Tab -->
        <div v-show="activeTab === 'details'" class="space-y-6">
          <!-- Avatar Upload -->
          <div class="space-y-2">
            <label class="text-sm font-bold text-slate-900">Member Photo</label>
            <div v-if="form.imageUrl" class="relative w-32 h-32 mx-auto group">
              <img :src="form.imageUrl" class="w-full h-full object-cover rounded-3xl ring-4 ring-slate-50 shadow-lg" />
              <button
                @click="form.imageUrl = ''"
                class="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
            <UiMediaUpload
              v-else
              :venue-id="form.venueId || venues[0]?.id"
              entity-type="EMPLOYEE"
              label="Upload staff photo"
              @uploaded="handleUploaded"
            />
          </div>

          <div class="grid grid-cols-1 gap-6">
            <div class="space-y-2">
              <label class="text-sm font-bold text-slate-900">Full Name</label>
              <input
                v-model="form.name"
                type="text"
                placeholder="e.g. John Smith"
                class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-slate-900"
              />
            </div>

            <div class="space-y-2">
              <label class="text-sm font-bold text-slate-900">Professional Title</label>
              <input
                v-model="form.title"
                type="text"
                placeholder="e.g. Senior Hair Stylist"
                class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-slate-900"
              />
            </div>

            <div v-if="!isEditing" class="space-y-2">
              <label class="text-sm font-bold text-slate-900">Assign to Venue</label>
              <select
                v-model="form.venueId"
                class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-slate-900 bg-white"
              >
                <option v-for="venue in venues" :key="venue.id" :value="venue.id">
                  {{ venue.name }}
                </option>
              </select>
            </div>

            <div class="space-y-2">
              <label class="text-sm font-bold text-slate-900">Short Bio</label>
              <textarea
                v-model="form.bio"
                rows="4"
                placeholder="Brief description of experience and specialties..."
                class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-slate-900 resize-none"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Schedule Tab -->
        <div v-show="activeTab === 'schedule'" class="space-y-4">
          <div v-for="(day, index) in schedule" :key="index" class="p-4 rounded-2xl border border-slate-100 bg-slate-50/50">
            <div class="flex items-center justify-between mb-3">
              <span class="text-sm font-bold text-slate-900">{{ days[day.day] }}</span>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="day.isWorking" class="sr-only peer">
                <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div v-if="day.isWorking" class="grid grid-cols-2 gap-3 transition-all">
              <div class="space-y-1">
                <label class="text-[10px] font-bold text-slate-400 uppercase">Starts</label>
                <input
                  type="time"
                  v-model="day.startTime"
                  class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-primary/10 outline-none"
                />
              </div>
              <div class="space-y-1">
                <label class="text-[10px] font-bold text-slate-400 uppercase">Ends</label>
                <input
                  type="time"
                  v-model="day.endTime"
                  class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-primary/10 outline-none"
                />
              </div>
            </div>
            <div v-else class="text-xs text-slate-400 font-medium py-2">
              Staff is not working on this day.
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex gap-3">
          <UiButton
            label="Cancel"
            class="flex-1 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            @click="isSlideoverOpen = false"
          />
          <UiButton
            :label="submitting ? 'Saving...' : (isEditing ? 'Update Member' : 'Add Member')"
            :icon="submitting ? Loader2 : (isEditing ? Settings : Plus)"
            :disabled="submitting"
            class="flex-[2] bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
            @click="handleSave"
          />
        </div>
      </template>
    </UiSlideover>
  </div>
</template>

<style scoped>
/* Custom scrollbar for the slideover */
:deep(.overflow-y-scroll) {
  scrollbar-width: thin;
  scrollbar-color: #E2E8F0 transparent;
}
:deep(.overflow-y-scroll::-webkit-scrollbar) {
  width: 6px;
}
:deep(.overflow-y-scroll::-webkit-scrollbar-thumb) {
  background-color: #E2E8F0;
  border-radius: 20px;
}
</style>
