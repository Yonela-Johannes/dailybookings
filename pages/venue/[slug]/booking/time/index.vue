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

const serviceIds = computed(() => cart.lines.value.map(l => l.service.id))
const { data: slots, pending: slotsPending, refresh } = await useAvailability(route.params.slug as string).getAvailability(
  dateTime.date,
  serviceIds
)

watch([() => dateTime.date.value, () => serviceIds.value], () => {
  refresh()
})

const steps = ['Services', 'Time', 'Confirm']

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
