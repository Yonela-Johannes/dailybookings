<script setup lang="ts">
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Plus,
  Filter,
  Search,
  Clock,
  User,
  AlertCircle
} from 'lucide-vue-next'
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  isSameDay,
  parseISO
} from 'date-fns'

definePageMeta({
  layout: 'business',
  middleware: 'auth'
})

const currentDate = ref(new Date())
const view = ref<'month' | 'week' | 'day'>('month')
const searchQuery = ref('')
const selectedEmployeeId = ref('all')

// Fetch Team for filtering
const { data: teamData } = await useFetch('/api/business/team', {
  query: { limit: 100 }
})
const employees = computed(() => (teamData.value as any)?.data || [])

// Fetch Venues for new appointment
const { data: venuesData } = await useFetch('/api/business/venues')
const venues = computed(() => (venuesData.value as any)?.data || [])

// Fetch Services for new appointment
const { data: servicesData } = await useFetch('/api/business/services')
const services = computed(() => (servicesData.value as any)?.data || [])

// Date range for fetching
const startDateParam = computed(() => format(startOfMonth(currentDate.value), 'yyyy-MM-dd'))
const endDateParam = computed(() => format(endOfMonth(currentDate.value), 'yyyy-MM-dd'))

// Fetch Bookings
const { data: bookingsResponse, refresh: refreshBookings } = await useFetch('/api/business/bookings', {
  query: {
    startDate: startDateParam,
    endDate: endDateParam,
    limit: 500
  },
  watch: [currentDate]
})

const bookings = computed(() => (bookingsResponse.value as any)?.data || [])

// Filtered Bookings
const filteredBookings = computed(() => {
  let filtered = bookings.value

  if (selectedEmployeeId.value !== 'all') {
    filtered = filtered.filter((b: any) =>
      b.services.some((s: any) => s.employeeId === selectedEmployeeId.value)
    )
  }

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    filtered = filtered.filter((b: any) =>
      b.user.fullName?.toLowerCase().includes(q) ||
      b.services.some((s: any) => s.service.name.toLowerCase().includes(q))
    )
  }

  return filtered
})

// Calendar Grid Logic
const calendarDays = computed(() => {
  const start = startOfMonth(currentDate.value)
  const end = endOfMonth(currentDate.value)

  const calendarStart = startOfWeek(start)
  const calendarEnd = endOfWeek(end)

  return eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd
  }).map(date => ({
    date,
    isCurrentMonth: isSameMonth(date, currentDate.value),
    isToday: isToday(date),
    bookings: filteredBookings.value.filter((b: any) => isSameDay(parseISO(b.date), date))
  }))
})

// UI State
const isDetailsOpen = ref(false)
const selectedBooking = ref<any>(null)
const isNewAppointmentOpen = ref(false)

const newAppt = ref({
  venueId: '',
  userEmail: '',
  serviceId: '',
  employeeId: '',
  date: '',
  startTime: '',
  notes: ''
})

watch(venues, (newVenues) => {
  if (newVenues.length > 0 && !newAppt.value.venueId) {
    newAppt.value.venueId = newVenues[0].id
  }
}, { immediate: true })

const openBookingDetails = (booking: any) => {
  selectedBooking.value = booking
  isDetailsOpen.value = true
}

const updateBookingStatus = async (status: string) => {
  if (!selectedBooking.value) return

  try {
    await $fetch(`/api/business/bookings/${selectedBooking.value.id}`, {
      method: 'PATCH',
      body: { status }
    })
    await refreshBookings()
    isDetailsOpen.value = false
  } catch (error) {
    console.error('Failed to update status', error)
  }
}

const createNewAppointment = async () => {
  try {
    await $fetch('/api/business/bookings', {
      method: 'POST',
      body: newAppt.value
    })
    await refreshBookings()
    isNewAppointmentOpen.value = false
    // Reset form
    newAppt.value = {
      venueId: venues.value[0]?.id || '',
      userEmail: '',
      serviceId: '',
      employeeId: '',
      date: '',
      startTime: '',
      notes: ''
    }
  } catch (error: any) {
    alert(error.data?.statusMessage || 'Failed to create appointment')
  }
}

// Navigation
const nextMonth = () => currentDate.value = addMonths(currentDate.value, 1)
const prevMonth = () => currentDate.value = subMonths(currentDate.value, 1)
const goToToday = () => currentDate.value = new Date()

// Status colors
const getStatusColor = (status: string) => {
  switch (status) {
    case 'CONFIRMED': return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    case 'COMPLETED': return 'bg-blue-50 text-blue-700 border-blue-200'
    case 'CANCELLED': return 'bg-rose-50 text-rose-700 border-rose-200'
    case 'NO_SHOW': return 'bg-slate-50 text-slate-700 border-slate-200'
    default: return 'bg-amber-50 text-amber-700 border-amber-200'
  }
}
</script>

<template>
  <div class="h-full flex flex-col space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-extrabold text-slate-900">Calendar</h1>
        <p class="text-slate-500 font-medium">Manage your appointments and staff schedules.</p>
      </div>
      <div class="flex items-center gap-2">
        <div class="bg-white border border-slate-200 rounded-xl p-1 flex">
          <button
            v-for="v in (['month', 'week', 'day'] as const)"
            :key="v"
            @click="view = v"
            :class="['px-4 py-1.5 text-xs font-bold rounded-lg transition-all', view === v ? 'bg-primary text-white shadow-sm' : 'text-slate-500 hover:text-slate-700']"
          >
            {{ v.charAt(0).toUpperCase() + v.slice(1) }}
          </button>
        </div>
        <UiButton label="New Appointment" :icon="Plus" class="!px-4" @click="isNewAppointmentOpen = true" />
      </div>
    </div>

    <!-- Calendar Controls -->
    <div class="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
      <div class="flex items-center gap-4">
        <h2 class="text-xl font-black text-slate-900 min-w-[200px] text-center sm:text-left">
          {{ format(currentDate, 'MMMM yyyy') }}
        </h2>
        <div class="flex items-center gap-1">
          <button @click="prevMonth" class="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors">
            <ChevronLeft class="w-5 h-5" />
          </button>
          <button @click="goToToday" class="px-3 py-1 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            Today
          </button>
          <button @click="nextMonth" class="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors">
            <ChevronRight class="w-5 h-5" />
          </button>
        </div>
      </div>

      <div class="flex items-center gap-3 w-full sm:w-auto">
        <!-- Employee Filter -->
        <div class="relative w-full sm:w-48">
          <Filter class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <select
            v-model="selectedEmployeeId"
            class="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none appearance-none cursor-pointer font-bold text-slate-700"
          >
            <option value="all">All Staff</option>
            <option v-for="emp in employees" :key="emp.id" :value="emp.id">{{ emp.name }}</option>
          </select>
        </div>

        <div class="relative flex-1 sm:w-64">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search bookings..."
            class="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
          />
        </div>
      </div>
    </div>

    <!-- Calendar Grid (Month View) -->
    <div v-if="view === 'month'" class="flex-1 bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden flex flex-col">
      <div class="grid grid-cols-7 border-b border-slate-100 bg-slate-50/50">
        <div v-for="day in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']" :key="day" class="py-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
          {{ day }}
        </div>
      </div>

      <div class="flex-1 grid grid-cols-7 auto-rows-fr overflow-y-auto">
        <div
          v-for="cell in calendarDays"
          :key="cell.date.toString()"
          class="border-r border-b border-slate-50 p-2 min-h-[120px] hover:bg-slate-50/30 transition-colors group relative"
          :class="[!cell.isCurrentMonth ? 'bg-slate-50/20 opacity-40' : '']"
        >
          <div class="flex justify-between items-center mb-2">
            <span :class="['text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full', cell.isToday ? 'bg-primary text-white shadow-md shadow-primary/30' : 'text-slate-400 group-hover:text-slate-600']">
              {{ format(cell.date, 'd') }}
            </span>
            <button
              v-if="cell.isCurrentMonth"
              @click="newAppt.date = format(cell.date, 'yyyy-MM-dd'); isNewAppointmentOpen = true"
              class="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-200 rounded text-slate-400 transition-all"
            >
              <Plus class="w-3 h-3" />
            </button>
          </div>

          <div class="space-y-1">
            <div
              v-for="booking in cell.bookings"
              :key="booking.id"
              @click="openBookingDetails(booking)"
              :class="[
                'px-2 py-1 border-l-2 rounded text-[10px] font-bold truncate cursor-pointer transition-all hover:scale-[1.02] shadow-sm',
                getStatusColor(booking.status)
              ]"
            >
              {{ booking.startTime }} {{ booking.user.fullName }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="flex-1 bg-white rounded-3xl border border-slate-100 shadow-sm flex items-center justify-center p-12 text-center text-slate-400">
      <div>
        <CalendarIcon class="w-12 h-12 mx-auto mb-4 opacity-20" />
        <p class="font-bold">{{ view.charAt(0).toUpperCase() + view.slice(1) }} view is coming soon.</p>
      </div>
    </div>

    <!-- Booking Details Slide-over -->
    <UiSlideover
      :show="isDetailsOpen"
      title="Booking Details"
      @close="isDetailsOpen = false"
    >
      <div v-if="selectedBooking" class="space-y-8">
        <!-- Customer Info -->
        <div class="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <User class="w-6 h-6 text-primary" />
          </div>
          <div class="overflow-hidden">
            <h3 class="font-black text-slate-900 truncate">{{ selectedBooking.user.fullName }}</h3>
            <p class="text-sm text-slate-500 font-medium truncate">{{ selectedBooking.user.email }}</p>
          </div>
        </div>

        <!-- Appointment Info -->
        <div class="space-y-4">
          <div class="flex items-center gap-3 text-slate-600">
            <div class="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
              <CalendarIcon class="w-5 h-5" />
            </div>
            <div>
              <p class="text-[10px] font-black uppercase tracking-wider text-slate-400">Date & Time</p>
              <p class="text-sm font-bold text-slate-900">{{ format(parseISO(selectedBooking.date), 'EEEE, MMMM do') }} @ {{ selectedBooking.startTime }}</p>
            </div>
          </div>

          <div class="flex items-center gap-3 text-slate-600">
            <div class="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
              <Clock class="w-5 h-5" />
            </div>
            <div>
              <p class="text-[10px] font-black uppercase tracking-wider text-slate-400">Duration & Price</p>
              <p class="text-sm font-bold text-slate-900">{{ selectedBooking.durationTotal }} min • R{{ selectedBooking.priceTotal }}</p>
            </div>
          </div>
        </div>

        <!-- Services -->
        <div>
          <h4 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Services</h4>
          <div class="space-y-2">
            <div
              v-for="bs in selectedBooking.services"
              :key="bs.id"
              class="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl shadow-sm"
            >
              <div>
                <p class="text-sm font-bold text-slate-900">{{ bs.service.name }}</p>
                <p v-if="bs.employee" class="text-xs text-slate-500 font-medium">with {{ bs.employee.name }}</p>
              </div>
              <p class="text-sm font-black text-slate-900">R{{ bs.price }}</p>
            </div>
          </div>
        </div>

        <!-- Notes -->
        <div v-if="selectedBooking.notes">
          <h4 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Notes</h4>
          <p class="text-sm font-medium text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
            {{ selectedBooking.notes }}
          </p>
        </div>

        <!-- Actions -->
        <div>
          <h4 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Update Status</h4>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="status in ['CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW']"
              :key="status"
              @click="updateBookingStatus(status)"
              :class="[
                'px-4 py-3 rounded-xl text-xs font-black transition-all border',
                selectedBooking.status === status
                  ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20'
                  : 'bg-white border-slate-100 text-slate-600 hover:border-primary/30 hover:bg-slate-50'
              ]"
            >
              {{ status }}
            </button>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex gap-3">
          <UiButton label="Close" type="secondary" class="flex-1" @click="isDetailsOpen = false" />
        </div>
      </template>
    </UiSlideover>

    <!-- New Appointment Slide-over -->
    <UiSlideover
      :show="isNewAppointmentOpen"
      title="New Appointment"
      @close="isNewAppointmentOpen = false"
    >
      <form @submit.prevent="createNewAppointment" class="space-y-6">
        <div class="space-y-5">
          <!-- Venue Selection -->
          <div v-if="venues.length > 1">
            <label class="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Venue</label>
            <select
              v-model="newAppt.venueId"
              class="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none appearance-none font-bold text-slate-700"
              required
            >
              <option v-for="v in venues" :key="v.id" :value="v.id">{{ v.name }}</option>
            </select>
          </div>

          <!-- Customer Email -->
          <div>
            <label class="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Customer Email</label>
            <div class="relative">
              <User class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                v-model="newAppt.userEmail"
                type="email"
                placeholder="customer@example.com"
                class="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none font-medium"
                required
              />
            </div>
            <p class="mt-1 text-[10px] text-slate-400 font-bold uppercase tracking-tight">Customer must have an account</p>
          </div>

          <!-- Service Selection -->
          <div>
            <label class="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Service</label>
            <select
              v-model="newAppt.serviceId"
              class="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none appearance-none font-bold text-slate-700"
              required
            >
              <option value="">Select a service</option>
              <option v-for="s in services" :key="s.id" :value="s.id">{{ s.name }} (R{{ s.price }})</option>
            </select>
          </div>

          <!-- Employee Selection -->
          <div>
            <label class="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Employee (Optional)</label>
            <select
              v-model="newAppt.employeeId"
              class="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none appearance-none font-bold text-slate-700"
            >
              <option value="">Any Staff</option>
              <option v-for="emp in employees" :key="emp.id" :value="emp.id">{{ emp.name }}</option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Date</label>
              <input
                v-model="newAppt.date"
                type="date"
                class="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none font-bold text-slate-700"
                required
              />
            </div>
            <div>
              <label class="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Time</label>
              <input
                v-model="newAppt.startTime"
                type="time"
                class="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none font-bold text-slate-700"
                required
              />
            </div>
          </div>

          <!-- Notes -->
          <div>
            <label class="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Notes</label>
            <textarea
              v-model="newAppt.notes"
              rows="3"
              class="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none font-medium resize-none"
              placeholder="Any special requests?"
            ></textarea>
          </div>
        </div>

        <div class="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3">
          <AlertCircle class="w-5 h-5 text-amber-500 shrink-0" />
          <p class="text-[10px] font-bold text-amber-700 leading-relaxed uppercase tracking-tight">
            Manual entry will bypass online payment requirements. The booking will be marked as CONFIRMED automatically.
          </p>
        </div>
      </form>

      <template #footer>
        <div class="flex gap-3">
          <UiButton label="Cancel" type="secondary" class="flex-1" @click="isNewAppointmentOpen = false" />
          <UiButton label="Create Appointment" class="flex-1" @click="createNewAppointment" />
        </div>
      </template>

    </UiSlideover>
  </div>
</template>

