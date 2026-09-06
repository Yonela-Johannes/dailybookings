<script setup lang="ts">
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Plus,
  Filter,
  Search,
  Clock,
  User
} from 'lucide-vue-next'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, addMonths, subMonths } from 'date-fns'

definePageMeta({
  layout: 'business',
  middleware: 'auth'
})

const currentDate = ref(new Date())
const view = ref<'month' | 'week' | 'day'>('month')

const days = computed(() => {
  const start = startOfMonth(currentDate.value)
  const end = endOfMonth(currentDate.value)
  return eachDayOfInterval({ start, end })
})

const nextMonth = () => currentDate.value = addMonths(currentDate.value, 1)
const prevMonth = () => currentDate.value = subMonths(currentDate.value, 1)
const goToToday = () => currentDate.value = new Date()

// Mock appointments
const appointments = [
  { id: 1, date: new Date(), time: '10:00 AM', customer: 'Alice J.', service: 'Massage' },
  { id: 2, date: new Date(), time: '02:30 PM', customer: 'Bob S.', service: 'Haircut' },
]

const getAppointmentsForDay = (day: Date) => {
  return appointments.filter(a => format(a.date, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd'))
}
</script>

<template>
  <div class="h-full flex flex-col space-y-6">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-extrabold text-slate-900">Calendar</h1>
        <p class="text-slate-500">Manage your appointments and staff schedules.</p>
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
        <UiButton label="New Appointment" :icon="Plus" class="!px-4" />
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
        <div class="relative flex-1 sm:w-64">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search appointments..."
            class="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          />
        </div>
        <button class="p-2 bg-slate-50 border border-slate-100 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors">
          <Filter class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Calendar Grid (Month View) -->
    <div v-if="view === 'month'" class="flex-1 bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden flex flex-col">
      <div class="grid grid-cols-7 border-b border-slate-100 bg-slate-50/50">
        <div v-for="day in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']" :key="day" class="py-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
          {{ day }}
        </div>
      </div>

      <div class="flex-1 grid grid-cols-7 grid-rows-5 auto-rows-fr">
        <!-- We'd need to pad the start of the month here in a real implementation -->
        <div
          v-for="day in days"
          :key="day.toString()"
          class="border-r border-b border-slate-50 p-2 min-h-[120px] hover:bg-slate-50/30 transition-colors group"
        >
          <div class="flex justify-between items-center mb-2">
            <span :class="['text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full', isToday(day) ? 'bg-primary text-white' : 'text-slate-400 group-hover:text-slate-600']">
              {{ format(day, 'd') }}
            </span>
            <button v-if="isToday(day) || getAppointmentsForDay(day).length > 0" class="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-200 rounded text-slate-400 transition-all">
              <Plus class="w-3 h-3" />
            </button>
          </div>

          <div class="space-y-1">
            <div
              v-for="appt in getAppointmentsForDay(day)"
              :key="appt.id"
              class="px-2 py-1 bg-blue-50 border-l-2 border-primary rounded text-[10px] font-bold text-primary truncate cursor-pointer hover:bg-blue-100 transition-colors"
            >
              {{ appt.time }} {{ appt.customer }}
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
  </div>
</template>
