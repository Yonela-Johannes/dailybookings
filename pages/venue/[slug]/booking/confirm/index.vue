<script setup lang="ts">
import {
  Calendar,
  Clock,
  User,
  ChevronLeft,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  ArrowRight
} from 'lucide-vue-next'
import { format, parseISO } from 'date-fns'

const route = useRoute()
const slug = route.params.slug as string
const { data: venue } = await useVenue(slug)

const cart = useBookingCart()
const bookingDateTime = useBookingDateTime()
const { user } = useAuth()
const { createBooking } = useBookings()

const isBooking = ref(false)
const bookingId = ref<string | null>(null)
const error = ref<string | null>(null)

const selectedDate = computed(() => bookingDateTime.date.value)
const selectedTime = computed(() => bookingDateTime.time.value)
const selectedEmployee = computed(() => {
  if (!venue.value || !bookingDateTime.employeeId.value) return null
  return venue.value.team.find(e => e.id === bookingDateTime.employeeId.value)
})

const totalAmount = computed(() => cart.total.value)

// Redirect if no services or date/time selected
onMounted(() => {
  if (cart.lines.value.length === 0 || !selectedDate.value || !selectedTime.value) {
    navigateTo(`/venue/${slug}`)
  }
})

const handleConfirmBooking = async () => {
  if (!user.value) {
    // Save current path to redirect back after login
    const returnUrl = route.fullPath
    navigateTo(`/auth/login?redirect=${encodeURIComponent(returnUrl)}`)
    return
  }

  isBooking.value = true
  error.value = null

  try {
    const bookingData = {
      venueId: venue.value?.id,
      serviceIds: cart.lines.value.map(l => l.service.id),
      date: selectedDate.value,
      startTime: selectedTime.value,
      employeeId: bookingDateTime.employeeId.value,
    }

    const response = (await createBooking(bookingData)) as any
    bookingId.value = response.id
    cart.clear()
    bookingDateTime.reset()
  } catch (err: any) {
    error.value = err.message || 'Failed to create booking. Please try again.'
  } finally {
    isBooking.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
      <!-- Success State -->
      <div v-if="bookingId" class="bg-white rounded-3xl p-8 text-center shadow-xl border border-slate-100 animate-in fade-in zoom-in duration-300">
        <div class="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 class="w-10 h-10" />
        </div>
        <h1 class="text-3xl font-extrabold text-slate-900 mb-2">Booking Confirmed!</h1>
        <p class="text-slate-600 mb-8 text-lg">Your appointment at <span class="font-bold text-primary">{{ venue?.name }}</span> has been successfully scheduled.</p>

        <div class="bg-slate-50 rounded-2xl p-6 mb-8 text-left inline-block w-full max-w-md">
          <div class="flex justify-between mb-2">
            <span class="text-slate-500">Booking ID</span>
            <span class="font-mono font-bold text-slate-900">#{{ bookingId }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-500">Date & Time</span>
            <span class="font-bold text-slate-900">{{ format(parseISO(selectedDate || new Date().toISOString()), 'PPP') }} at {{ selectedTime }}</span>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink
            to="/dashboard"
            class="px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
          >
            Go to Dashboard
          </NuxtLink>
          <NuxtLink
            to="/"
            class="px-8 py-4 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all"
          >
            Return Home
          </NuxtLink>
        </div>
      </div>

      <!-- Confirmation Form -->
      <div v-else class="space-y-8">
        <div class="flex items-center gap-4 mb-2">
          <button @click="$router.back()" class="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <ChevronLeft class="w-6 h-6 text-slate-600" />
          </button>
          <h1 class="text-3xl font-extrabold text-slate-900">Confirm Booking</h1>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Left Column: Details -->
          <div class="md:col-span-2 space-y-6">
            <!-- Venue & Services -->
            <section class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 class="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <CreditCard class="w-5 h-5 text-primary" />
                Booking Summary
              </h2>

              <div class="space-y-4">
                <div v-for="line in cart.lines.value" :key="line.service.id" class="flex justify-between items-start py-3 border-b border-slate-50 last:border-0">
                  <div>
                    <h3 class="font-bold text-slate-800">{{ line.service.name }}</h3>
                    <p class="text-sm text-slate-500">{{ line.service.durationMinutes }} mins</p>
                  </div>
                  <span class="font-bold text-slate-900">R{{ line.service.price }}</span>
                </div>

                <div class="flex justify-between items-center pt-4 text-lg">
                  <span class="font-bold text-slate-900">Total</span>
                  <span class="font-extrabold text-primary text-2xl">R{{ totalAmount }}</span>
                </div>
              </div>
            </section>

            <!-- Appointment Details -->
            <section class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 class="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Calendar class="w-5 h-5 text-primary" />
                Appointment Details
              </h2>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="p-4 bg-slate-50 rounded-xl">
                  <div class="text-sm text-slate-500 mb-1">Date</div>
                  <div class="font-bold text-slate-900 flex items-center gap-2">
                    <Calendar class="w-4 h-4 text-slate-400" />
                    {{ selectedDate ? format(parseISO(selectedDate), 'PPP') : 'Not selected' }}
                  </div>
                </div>

                <div class="p-4 bg-slate-50 rounded-xl">
                  <div class="text-sm text-slate-500 mb-1">Time</div>
                  <div class="font-bold text-slate-900 flex items-center gap-2">
                    <Clock class="w-4 h-4 text-slate-400" />
                    {{ selectedTime || 'Not selected' }}
                  </div>
                </div>

                <div v-if="selectedEmployee" class="p-4 bg-slate-50 rounded-xl sm:col-span-2">
                  <div class="text-sm text-slate-500 mb-1">Professional</div>
                  <div class="flex items-center gap-3">
                    <img v-if="selectedEmployee.avatarUrl" :src="selectedEmployee.avatarUrl" class="w-8 h-8 rounded-full" />
                    <div v-else class="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                      {{ selectedEmployee.name.charAt(0) }}
                    </div>
                    <span class="font-bold text-slate-900">{{ selectedEmployee.name }}</span>
                  </div>
                </div>
              </div>
            </section>

            <!-- User Details -->
            <section class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 class="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <User class="w-5 h-5 text-primary" />
                Your Information
              </h2>

              <div v-if="user" class="space-y-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Email</label>
                    <div class="text-slate-900 font-medium">{{ user.email }}</div>
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Status</label>
                    <div class="text-green-600 font-bold flex items-center gap-1 text-sm">
                      <CheckCircle2 class="w-4 h-4" />
                      Logged in
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="p-4 bg-blue-50 text-blue-700 rounded-xl flex items-start gap-3">
                <AlertCircle class="w-5 h-5 shrink-0" />
                <p class="text-sm">You need to be logged in to confirm your booking. We'll redirect you to the login page.</p>
              </div>
            </section>
          </div>

          <!-- Right Column: Actions -->
          <div class="space-y-6">
            <div class="bg-white rounded-2xl p-6 shadow-xl border border-primary/10 sticky top-24">
              <div class="text-center mb-6">
                <div class="text-slate-500 text-sm mb-1">Total to pay</div>
                <div class="text-4xl font-black text-slate-900">R{{ totalAmount }}</div>
              </div>

              <div v-if="error" class="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-start gap-2">
                <AlertCircle class="w-4 h-4 shrink-0 mt-0.5" />
                {{ error }}
              </div>

              <UiButton
                :label="isBooking ? 'Processing...' : 'Confirm Booking'"
                :loading="isBooking"
                class="w-full !py-4 !text-lg !rounded-xl"
                @click="handleConfirmBooking"
              />

              <p class="text-[10px] text-slate-400 text-center mt-4 uppercase font-bold tracking-widest">
                Secure 256-bit SSL encryption
              </p>
            </div>

            <div class="bg-slate-100 rounded-2xl p-6">
              <h4 class="font-bold text-slate-700 mb-2">Cancellation Policy</h4>
              <p class="text-xs text-slate-500 leading-relaxed">
                Free cancellation up to 24 hours before your appointment. Late cancellations may be subject to a fee.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
