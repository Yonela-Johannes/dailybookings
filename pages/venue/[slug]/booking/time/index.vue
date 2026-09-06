<script setup lang="ts">
import { computed } from 'vue'
import BookingHeader from '~/components/booking/BookingHeader.vue'
import DateCarousel from '~/components/booking/DateCarousel.vue'
import TimeslotList from '~/components/booking/TimeslotList.vue'
import CartSidebar from '~/components/booking/CartSidebar.vue'
import MobileCartBar from '~/components/booking/MobileCartBar.vue'
import { useBookingCart, useBookingDateTime } from '~/composables/useBookingCart'

const route = useRoute()
const { data: venue, pending } = await useVenue(route.params.slug as string)

const cart = useBookingCart()
const dateTime = useBookingDateTime()

const steps = ['Services', 'Time', 'Confirm']

// Default date
if (!dateTime.date.value) {
  dateTime.selectDate(new Date().toISOString().slice(0, 10))
}

const slots = computed(() => {
  if (!dateTime.date.value) return []

  const isToday =
    dateTime.date.value === new Date().toISOString().slice(0, 10)

  const all = [
    '9:50 AM',
    '10:00 AM',
    '1:20 PM',
    '1:30 PM',
    '1:40 PM',
    '1:50 PM',
    '2:00 PM',
    '4:00 PM',
    '4:10 PM',
  ]

  return isToday ? all : all.slice(1)
})

function goBack() {
  navigateTo(`/venues/${route.params.slug}/booking`)
}

function close() {
  navigateTo(`/venues/${route.params.slug}`)
}

function goToConfirm() {
  if (!dateTime.time.value) return

  navigateTo(`/venues/${route.params.slug}/booking/confirm`)
}
</script>

<template>
  <div v-if="pending" class="py-16 text-center text-stone-400">Loading…</div>

  <div v-else-if="venue" class="min-h-dvh bg-stone-50 pb-24 lg:pb-0">
    <BookingHeader
      title="Select date and time"
      :steps="steps"
      :active-step="1"
      @back="goBack"
      @close="close"
    />

    <div
      class="mx-auto grid max-w-6xl gap-10 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px]"
    >
      <div class="min-w-0 space-y-8">
        <DateCarousel
          :selected-date="dateTime.date.value"
          @select="dateTime.selectDate"
        />

        <TimeslotList
          :slots="slots"
          :selected="dateTime.time.value"
          @select="dateTime.selectTime"
        />
      </div>

      <div class="hidden lg:block">
        <div class="sticky top-24">
          <CartSidebar
            :venue="venue"
            :disabled="!dateTime.time.value"
            @continue="goToConfirm"
          />
        </div>
      </div>
    </div>

    <MobileCartBar @continue="goToConfirm" />
  </div>
</template>
