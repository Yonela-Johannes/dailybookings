<script setup lang="ts">
import {
  Star,
  MessageSquare,
  Search,
  Filter,
  CheckCircle2,
  MoreVertical,
  Loader2
} from 'lucide-vue-next'
import { format, parseISO } from 'date-fns'

definePageMeta({
  layout: 'business',
  middleware: 'auth'
})

const { data: reviewsResponse, pending } = await useFetch('/api/business/reviews')
const reviews = computed(() => reviewsResponse.value?.data || [])
const meta = computed(() => reviewsResponse.value?.meta || { total: 0 })

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase()
}
</script>

<template>
  <div class="space-y-8">
    <div>
      <h1 class="text-3xl font-extrabold text-slate-900 italic">Customer Reviews</h1>
      <p class="text-slate-500">Manage feedback and build your business reputation.</p>
    </div>

    <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div class="p-6 border-b border-slate-100 flex items-center justify-between">
        <h2 class="text-xl font-bold text-slate-900 flex items-center gap-2">
          <MessageSquare class="w-5 h-5 text-primary" />
          All Reviews
        </h2>
        <div class="flex items-center gap-2">
           <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">{{ meta.total }} Reviews</span>
        </div>
      </div>

      <div v-if="pending" class="p-20 flex justify-center">
        <Loader2 class="w-10 h-10 text-primary animate-spin" />
      </div>

      <div v-else-if="reviews.length === 0" class="p-20 text-center">
        <div class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <MessageSquare class="w-8 h-8 text-slate-200" />
        </div>
        <h3 class="text-lg font-bold text-slate-900">No reviews yet</h3>
        <p class="text-slate-500">Complete some bookings to start receiving feedback.</p>
      </div>

      <div v-else class="divide-y divide-slate-100">
        <div v-for="review in reviews" :key="review.id" class="p-8 hover:bg-slate-50/50 transition-colors group">
          <div class="flex flex-col md:flex-row gap-6">
            <div class="shrink-0">
               <div class="w-14 h-14 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 font-black overflow-hidden">
                  <img v-if="review.user?.profile?.avatarUrl" :src="review.user.profile.avatarUrl" class="w-full h-full object-cover" />
                  <span v-else>{{ getInitials(review.user?.fullName || 'G') }}</span>
               </div>
            </div>

            <div class="flex-1 space-y-4">
               <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 class="font-bold text-slate-950 text-lg">{{ review.user?.fullName || 'Verified Customer' }}</h3>
                    <div class="flex items-center gap-2 mt-1">
                      <div class="flex items-center gap-0.5">
                        <Star v-for="i in 5" :key="i"
                          :class="['w-4 h-4', i <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200']"
                        />
                      </div>
                      <span class="text-slate-300">•</span>
                      <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">{{ format(parseISO(review.createdAt), 'PP') }}</span>
                    </div>
                  </div>

                  <div class="flex items-center gap-2">
                    <span v-if="review.verified" class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">
                       <CheckCircle2 class="w-3 h-3" />
                       Verified Booking
                    </span>
                  </div>
               </div>

               <div class="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                 <p class="text-slate-700 leading-relaxed italic">"{{ review.body }}"</p>
               </div>

               <div class="flex items-center justify-between pt-2">
                 <div class="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    <span>Service: <span class="text-slate-900">{{ review.serviceName || 'Standard Session' }}</span></span>
                    <span v-if="review.employeeName">Professional: <span class="text-slate-900">{{ review.employeeName }}</span></span>
                 </div>

                 <button class="p-2 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors">
                    <MoreVertical class="w-5 h-5" />
                 </button>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
