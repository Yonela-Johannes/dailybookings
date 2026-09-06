<script setup lang="ts">
import { ref, computed } from 'vue'
import { Calendar, Clock, User, Mail, FileText, CheckCircle2, ChevronRight } from 'lucide-vue-next'
import ServiceSelectCard from '~/components/booking/ServiceSelectCard.vue'
import TimeSlotPicker from '~/components/booking/TimeSlotPicker.vue'
import { format } from 'date-fns'

const route = useRoute()
const slug = route.params.slug as string

// Mock business data - In real app, fetch from Supabase
const { data: business, pending: loadingBusiness } = await useAsyncData(`business-${slug}`, async () => {
  // Simulate fetch
  return {
    id: 'biz_123',
    name: 'Serenity Spa',
    description: 'Boutique wellness and relaxation center offering premium massage and skincare treatments.',
    services: [
      { id: 1, name: 'Deep Tissue Massage', duration: 60, price: 95 },
      { id: 2, name: 'Swedish Massage', duration: 60, price: 80 },
      { id: 3, name: 'Facial Treatment', duration: 45, price: 65 },
    ]
  }
})

const selectedService = ref<any>(null)
const selectedDate = ref(format(new Date(), 'yyyy-MM-dd'))
const selectedSlot = ref<any>(null)
const step = ref(1) // 1: Service, 2: Date/Time, 3: Details, 4: Success

const form = ref({
  name: '',
  email: '',
  notes: ''
})

const isSubmitting = ref(false)

// Fetch slots when date or service changes
const { data: slots, pending: loadingSlots } = await useAsyncData(
  'slots',
  () => $fetch('/api/slots', {
    query: {
      businessId: business.value?.id,
      serviceId: selectedService.value?.id,
      date: selectedDate.value
    }
  }),
  { watch: [selectedDate, selectedService] }
)

const canMoveToDateTime = computed(() => selectedService.value !== null)
const canMoveToDetails = computed(() => selectedSlot.value !== null)

const handleBooking = async () => {
  isSubmitting.ref = true
  try {
    await $fetch('/api/bookings', {
      method: 'POST',
      body: {
        businessId: business.value?.id,
        serviceId: selectedService.value?.id,
        startTime: selectedSlot.value.startTime,
        endTime: selectedSlot.value.endTime,
        customerName: form.value.name,
        customerEmail: form.value.email,
        notes: form.value.notes
      }
    })
    step.value = 4
  } catch (e) {
    alert('Booking failed. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}

const nextStep = () => {
  if (step.value < 3) step.value++
}

const prevStep = () => {
  if (step.value > 1) step.value--
}
</script>

<template>
  <div class="max-w-4xl mx-auto py-8">
    <div v-if="loadingBusiness" class="text-center py-20">
      <div class="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
    </div>

    <div v-else-if="business" class="space-y-8">
      <!-- Business Header -->
      <header class="text-center space-y-4">
        <h1 class="text-4xl font-extrabold text-slate-900">{{ business.name }}</h1>
        <p class="text-lg text-slate-600 max-w-2xl mx-auto">{{ business.description }}</p>
      </header>

      <!-- Success State -->
      <div v-if="step === 4" class="bg-white rounded-[2rem] p-12 text-center shadow-xl border border-slate-100 animate-in fade-in zoom-in duration-500">
        <div class="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 class="w-10 h-10" />
        </div>
        <h2 class="text-3xl font-bold text-slate-900 mb-2">Booking Confirmed!</h2>
        <p class="text-slate-600 mb-8">We've sent a confirmation email to {{ form.email }}.</p>
        <button
          @click="step = 1; selectedService = null; selectedSlot = null"
          class="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors"
        >
          Book Another Appointment
        </button>
      </div>

      <!-- Booking Flow -->
      <div v-else class="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden">
        <!-- Progress Bar -->
        <div class="flex border-b border-slate-100">
          <div
            v-for="i in 3" :key="i"
            class="flex-1 py-4 text-center text-xs font-bold uppercase tracking-wider border-b-2 transition-colors"
            :class="[step >= i ? 'border-primary text-primary' : 'border-transparent text-slate-400']"
          >
            Step {{ i }}
          </div>
        </div>

        <div class="p-8">
          <!-- Step 1: Service Selection -->
          <div v-if="step === 1" class="space-y-6">
            <h2 class="text-2xl font-bold flex items-center gap-2">
              <span class="w-8 h-8 rounded-full bg-blue-50 text-primary flex items-center justify-center text-sm italic font-serif">1</span>
              Select a Service
            </h2>
            <div class="grid gap-4">
              <ServiceSelectCard
                v-for="service in business.services"
                :key="service.id"
                :service="service"
                :selected="selectedService?.id === service.id"
                @click="selectedService = service; nextStep()"
              />
            </div>
          </div>

          <!-- Step 2: Date & Time -->
          <div v-if="step === 2" class="space-y-8">
            <h2 class="text-2xl font-bold flex items-center gap-2">
              <span class="w-8 h-8 rounded-full bg-blue-50 text-primary flex items-center justify-center text-sm italic font-serif">2</span>
              Choose Date & Time
            </h2>

            <div class="space-y-4">
              <label class="block text-sm font-bold text-slate-700">Select Date</label>
              <input
                type="date"
                v-model="selectedDate"
                class="w-full p-3 rounded-xl border-2 border-slate-100 focus:border-primary focus:ring-0 outline-none transition-all"
              />
            </div>

            <div class="space-y-4">
              <label class="block text-sm font-bold text-slate-700">Available Slots</label>
              <div v-if="loadingSlots" class="grid grid-cols-4 gap-3">
                <div v-for="i in 8" :key="i" class="h-12 bg-slate-50 animate-pulse rounded-lg"></div>
              </div>
              <TimeSlotPicker
                v-else-if="slots && slots.length > 0"
                :slots="slots"
                :selected-slot="selectedSlot"
                @select="(slot) => { selectedSlot = slot; nextStep() }"
              />
              <p v-else class="text-slate-500 py-4 italic">No slots available for this date.</p>
            </div>

            <div class="flex justify-between pt-4">
              <button @click="prevStep" class="text-slate-500 font-semibold hover:text-slate-700">Back</button>
            </div>
          </div>

          <!-- Step 3: Details -->
          <div v-if="step === 3" class="space-y-8">
            <h2 class="text-2xl font-bold flex items-center gap-2">
              <span class="w-8 h-8 rounded-full bg-blue-50 text-primary flex items-center justify-center text-sm italic font-serif">3</span>
              Your Details
            </h2>

            <!-- Booking Summary -->
            <div class="bg-slate-50 rounded-xl p-4 flex flex-wrap gap-6 text-sm">
              <div class="flex items-center gap-2 text-slate-600">
                <CheckCircle2 class="w-4 h-4 text-green-500" />
                {{ selectedService?.name }}
              </div>
              <div class="flex items-center gap-2 text-slate-600">
                <Calendar class="w-4 h-4 text-primary" />
                {{ format(new Date(selectedDate), 'PPP') }}
              </div>
              <div class="flex items-center gap-2 text-slate-600">
                <Clock class="w-4 h-4 text-primary" />
                {{ new Date(selectedSlot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
              </div>
            </div>

            <form @submit.prevent="handleBooking" class="space-y-6">
              <div class="grid gap-6 md:grid-cols-2">
                <div class="space-y-2">
                  <label class="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <User class="w-4 h-4" /> Name
                  </label>
                  <input
                    v-model="form.name" required
                    placeholder="John Doe"
                    class="w-full p-3 rounded-xl border-2 border-slate-100 focus:border-primary focus:ring-0 outline-none"
                  />
                </div>
                <div class="space-y-2">
                  <label class="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Mail class="w-4 h-4" /> Email
                  </label>
                  <input
                    v-model="form.email" type="email" required
                    placeholder="john@example.com"
                    class="w-full p-3 rounded-xl border-2 border-slate-100 focus:border-primary focus:ring-0 outline-none"
                  />
                </div>
              </div>
              <div class="space-y-2">
                <label class="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <FileText class="w-4 h-4" /> Notes (Optional)
                </label>
                <textarea
                  v-model="form.notes" rows="3"
                  placeholder="Anything we should know?"
                  class="w-full p-3 rounded-xl border-2 border-slate-100 focus:border-primary focus:ring-0 outline-none"
                ></textarea>
              </div>

              <div class="flex justify-between items-center pt-4">
                <button type="button" @click="prevStep" class="text-slate-500 font-semibold hover:text-slate-700">Back</button>
                <button
                  type="submit"
                  :disabled="isSubmitting"
                  class="px-10 py-4 bg-primary text-white font-bold rounded-xl hover:scale-105 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                >
                  {{ isSubmitting ? 'Confirming...' : 'Confirm Booking' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
