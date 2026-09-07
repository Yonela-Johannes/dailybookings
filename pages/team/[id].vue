<script setup lang="ts">
import { Star, MapPin, Calendar, Clock, ArrowRight, User } from 'lucide-vue-next'

const route = useRoute()
const id = route.params.id as string

const { data: employee, pending, error } = useAsyncData(`employee-${id}`, () =>
  $fetch(`/api/employees/${id}`)
)

useHead({
  title: employee.value ? `${employee.value.name} - ${employee.value.title}` : 'Team Member',
})
</script>

<template>
  <div class="bg-white min-h-screen">
    <div v-if="employee" class="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <!-- Profile Header -->
      <div class="flex flex-col md:flex-row gap-12 items-start mb-16">
        <div class="w-full md:w-80 shrink-0">
          <div class="aspect-square rounded-3xl overflow-hidden bg-slate-100 shadow-xl shadow-slate-200/50">
            <img
              v-if="employee.imageUrl"
              :src="employee.imageUrl"
              :alt="employee.name"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center text-slate-300">
              <User class="h-24 w-24" />
            </div>
          </div>
        </div>

        <div class="flex-1">
          <div class="flex flex-wrap items-center gap-4 mb-4">
            <h1 class="text-4xl font-bold text-slate-900">{{ employee.name }}</h1>
            <div class="flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold">
              <Star class="h-4 w-4 fill-primary" />
              {{ employee.rating }} ({{ employee.reviewCount }} reviews)
            </div>
          </div>
          <p class="text-xl text-slate-500 mb-6 font-medium">{{ employee.title }}</p>

          <div class="flex flex-wrap gap-6 mb-8 text-slate-600">
            <NuxtLink :to="`/venue/${employee.venue.slug}`" class="flex items-center gap-2 hover:text-primary transition-colors">
              <MapPin class="h-5 w-5 text-slate-400" />
              <span class="underline decoration-slate-200 underline-offset-4">{{ employee.venue.name }}</span>
            </NuxtLink>
            <div class="flex items-center gap-2">
              <Calendar class="h-5 w-5 text-slate-400" />
              <span>Next available today</span>
            </div>
          </div>

          <div class="max-w-3xl">
            <h2 class="text-lg font-bold text-slate-900 mb-3">About</h2>
            <p class="text-slate-600 leading-relaxed">
              {{ employee.bio || `${employee.name} is a dedicated ${employee.title} at ${employee.venue.name}, providing top-quality services to all clients.` }}
            </p>
          </div>
        </div>
      </div>

      <div class="grid lg:grid-cols-3 gap-12">
        <!-- Services -->
        <div class="lg:col-span-2">
          <h2 class="text-2xl font-bold text-slate-900 mb-8">Specialized Services</h2>
          <div class="space-y-4">
            <div
              v-for="service in employee.services"
              :key="service.id"
              class="p-6 border border-slate-200 rounded-2xl flex items-center justify-between group hover:border-primary transition-colors"
            >
              <div>
                <h3 class="font-bold text-slate-900 mb-1">{{ service.name }}</h3>
                <div class="flex items-center gap-4 text-sm text-slate-500">
                  <span class="flex items-center gap-1"><Clock class="h-4 w-4" /> {{ service.durationMinutes }} min</span>
                  <span class="font-bold text-slate-900">R{{ service.price }}</span>
                </div>
              </div>
              <NuxtLink
                :to="`/venue/${employee.venue.slug}`"
                class="h-10 px-4 bg-slate-900 text-white text-sm font-bold rounded-lg flex items-center gap-2 group-hover:bg-primary transition-colors"
              >
                Book <ArrowRight class="h-4 w-4" />
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Working Hours -->
        <div class="bg-slate-50 p-8 rounded-3xl border border-slate-200">
          <h2 class="text-xl font-bold text-slate-900 mb-6">Working Hours</h2>
          <div class="space-y-4">
            <div
              v-for="day in ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']"
              :key="day"
              class="flex justify-between text-sm py-2 border-b border-slate-200 last:border-0"
            >
              <span class="font-medium text-slate-600">{{ day }}</span>
              <span class="text-slate-900 font-bold">09:00 - 18:00</span>
            </div>
          </div>
          <div class="mt-8 pt-8 border-t border-slate-200">
            <p class="text-xs text-slate-500 leading-relaxed text-center">
              Hours may vary on public holidays. Please check availability in the booking flow.
            </p>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="pending" class="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div class="h-96 bg-slate-50 animate-pulse rounded-3xl" />
    </div>

    <div v-else class="max-w-7xl mx-auto px-4 py-20 text-center">
      <h1 class="text-2xl font-bold text-slate-900">Member not found</h1>
      <p class="text-slate-500 mt-2">The team member you are looking for does not exist or has been removed.</p>
      <NuxtLink to="/" class="mt-8 inline-block text-primary font-bold">Back to home</NuxtLink>
    </div>
  </div>
  <Footer />
</template>
