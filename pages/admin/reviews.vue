<script setup lang="ts">
import {
  Search,
  Filter,
  Star,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  User,
  Store
} from 'lucide-vue-next'
import { format, parseISO } from 'date-fns'

definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const ratingFilter = ref('')
const page = ref(1)

const { data: reviewsResponse, pending, refresh } = useFetch('/api/admin/reviews', {
  query: {
    rating: ratingFilter,
    page,
    limit: 10
  },
  watch: [ratingFilter, page]
})

const reviews = computed(() => reviewsResponse.value?.data || [])
const meta = computed(() => reviewsResponse.value?.meta || { total: 0, page: 1, totalPages: 1 })

const handleDelete = async (id: string) => {
  if (!confirm('Are you sure you want to delete this review? This action is permanent.')) return

  try {
    await $fetch(`/api/admin/reviews/${id}`, {
      method: 'DELETE'
    })
    refresh()
  } catch (error) {
    console.error('Failed to delete review:', error)
  }
}
</script>

<template>
  <div class="space-y-8">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-extrabold text-white uppercase italic tracking-tight">Content Moderation</h1>
        <p class="text-slate-500 font-bold uppercase tracking-widest text-[10px]">User Reviews & Feedback Audit</p>
      </div>
      <div class="flex items-center gap-3">
         <div class="px-6 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Total: {{ meta.total }}
         </div>
      </div>
    </div>

    <!-- Table Container -->
    <div class="bg-slate-950/50 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
      <div class="p-6 border-b border-slate-800 bg-slate-900/50 flex flex-col sm:flex-row items-center gap-4">
        <div class="flex items-center gap-4 w-full sm:w-auto">
          <select v-model="ratingFilter" class="bg-slate-900 border border-slate-800 text-slate-400 text-xs font-bold px-5 py-3 rounded-xl focus:ring-2 focus:ring-teal-500/20 outline-none w-full sm:w-48 appearance-none cursor-pointer text-center">
            <option value="">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
        <div class="flex-1"></div>
        <button @click="refresh" class="p-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-400 hover:text-white transition-colors">
          <Filter class="w-5 h-5" />
        </button>
      </div>

      <div class="overflow-x-auto min-h-[500px]">
        <div v-if="pending" class="flex items-center justify-center py-40">
          <Loader2 class="w-10 h-10 text-teal-500 animate-spin" />
        </div>

        <div v-else-if="reviews.length === 0" class="p-20 text-center text-slate-500">
           <div class="mb-4 flex justify-center opacity-20">
              <MessageSquare class="w-16 h-16" />
           </div>
           <p class="font-bold uppercase tracking-widest text-xs">No feedback found for this criteria</p>
        </div>

        <div v-else class="divide-y divide-slate-800/50">
           <div v-for="review in reviews" :key="review.id" class="p-8 hover:bg-slate-900/40 transition-all group">
              <div class="flex flex-col lg:flex-row gap-8">
                 <div class="w-full lg:w-64 space-y-4 shrink-0">
                    <div class="flex items-center gap-3">
                       <div class="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-teal-500 font-bold text-xs">
                          {{ review.user?.fullName?.[0] || 'U' }}
                       </div>
                       <div class="min-w-0 flex-1">
                          <div class="text-xs font-bold text-white truncate">{{ review.user?.fullName || 'Verified User' }}</div>
                          <div class="text-[9px] text-slate-500 font-bold uppercase tracking-widest truncate">{{ review.user?.email }}</div>
                       </div>
                    </div>

                    <div class="flex items-center gap-3 p-3 bg-slate-950/40 rounded-xl border border-slate-800/50">
                       <Store class="w-4 h-4 text-teal-500" />
                       <div class="min-w-0">
                          <div class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Venue</div>
                          <div class="text-xs font-bold text-slate-300 truncate">{{ review.venue?.name }}</div>
                       </div>
                    </div>
                 </div>

                 <div class="flex-1 space-y-4">
                    <div class="flex items-center justify-between">
                       <div class="flex items-center gap-3">
                          <div class="flex items-center gap-0.5">
                             <Star v-for="i in 5" :key="i" :class="['w-4 h-4', i <= review.rating ? 'fill-teal-500 text-teal-500' : 'text-slate-800']" />
                          </div>
                          <span class="text-[10px] font-black text-slate-600 uppercase tracking-widest">{{ format(parseISO(review.createdAt), 'PP') }}</span>
                       </div>

                       <button
                         @click="handleDelete(review.id)"
                         class="p-2 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                       >
                          <Trash2 class="w-5 h-5" />
                       </button>
                    </div>

                    <div class="bg-slate-900/60 p-6 rounded-2xl border border-slate-800/50 relative overflow-hidden">
                       <div class="absolute top-0 right-0 p-2 opacity-5">
                          <MessageSquare class="w-20 h-20 rotate-12" />
                       </div>
                       <p class="text-slate-300 text-sm leading-relaxed relative z-10 italic">"{{ review.body }}"</p>
                    </div>

                    <div class="flex items-center gap-4">
                       <span v-if="review.verified" class="flex items-center gap-1.5 px-3 py-1 bg-teal-500/5 border border-teal-500/10 rounded-full text-[9px] font-black text-teal-500 uppercase tracking-widest">
                          <CheckCircle2 class="w-3 h-3" />
                          Verified Client
                       </span>
                       <span v-if="review.serviceName" class="text-[9px] font-bold text-slate-600 uppercase tracking-widest">
                          Service: <span class="text-slate-400 font-black">{{ review.serviceName }}</span>
                       </span>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>

      <!-- Pagination -->
      <div class="p-8 bg-slate-950/40 border-t border-slate-800 flex items-center justify-between">
        <div class="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
          Cycle {{ meta.page }} / {{ meta.totalPages }} <span class="mx-2 text-slate-800">|</span> {{ meta.total }} Responses
        </div>
        <div class="flex items-center gap-3">
          <button
            :disabled="page === 1"
            @click="page--"
            class="p-2 bg-slate-900 border border-slate-800 text-slate-500 font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800 transition-all"
          >
            <ChevronLeft class="w-5 h-5" />
          </button>
          <button
            :disabled="page >= meta.totalPages"
            @click="page++"
            class="p-2 bg-slate-900 border border-slate-800 text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800 transition-all"
          >
            <ChevronRight class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
