<script setup lang="ts">
import {
    ArrowLeft,
    Calendar,
    Clock,
    User,
    Store,
    CreditCard,
    MapPin,
    Phone,
    Mail,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Loader2,
    Layers,
    ArrowUpRight,
    ExternalLink,
} from "lucide-vue-next";
import { format, parseISO } from "date-fns";

definePageMeta({
    layout: "admin",
    middleware: "auth",
});

const route = useRoute();
const {
    data: booking,
    pending,
    error,
    refresh,
} = await useFetch(`/api/admin/bookings/${route.params.id}`);

const updateStatus = async (status: string) => {
  try {
    await $fetch(`/api/business/bookings/${route.params.id}`, {
      method: 'PATCH',
      body: { status }
    })
    refresh()
  } catch (error) {
    console.error('Failed to update booking status:', error)
  }
}

const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
        case "CONFIRMED":
        case "COMPLETED":
            return "text-teal-600 bg-teal-50 border-teal-100 shadow-sm";
        case "PENDING":
            return "text-amber-600 bg-amber-50 border-amber-100 shadow-sm";
        case "CANCELLED":
            return "text-red-600 bg-red-50 border-red-100 shadow-sm";
        default:
            return "text-slate-500 bg-slate-50 border-slate-100";
    }
};
</script>

<template>
    <div class="space-y-10 pb-20">
        <div class="flex items-center gap-6">
            <button
                @click="$router.back()"
                class="p-4 bg-white border border-slate-200 rounded-[20px] text-slate-400 hover:text-primary transition-all shadow-sm hover:shadow-lg hover:scale-105 active:scale-95"
            >
                <ArrowLeft class="w-6 h-6" />
            </button>
            <div>
                <h1
                    class="text-4xl font-black text-slate-900 uppercase italic tracking-tighter leading-none"
                >
                    Audit Record
                </h1>
                <p
                    class="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1"
                >
                    Transaction Forensic Reference #{{
                        (booking as any)?.id?.slice(-8).toUpperCase() || "..."
                    }}
                </p>
            </div>
        </div>

        <div v-if="pending" class="flex items-center justify-center py-40">
            <Loader2 class="w-12 h-12 text-primary animate-spin" />
        </div>

        <div
            v-else-if="error"
            class="p-20 text-center bg-rose-50 border-2 border-rose-100 rounded-[40px]"
        >
            <AlertCircle class="w-16 h-16 text-rose-500 mx-auto mb-6" />
            <h3
                class="text-2xl font-black text-rose-900 uppercase italic tracking-tighter"
            >
                Vault Entry Missing
            </h3>
            <p class="text-rose-700 mt-2 font-medium">
                The requested transaction record could not be located in the
                secure data index.
            </p>
        </div>

        <div v-else-if="booking" class="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <!-- Main Audit Stream -->
            <div class="lg:col-span-2 space-y-12">
                <!-- Status & Value Node -->
                <div
                    class="bg-white border border-slate-100 rounded-[48px] p-12 flex flex-col md:flex-row md:items-center justify-between gap-10 relative overflow-hidden shadow-sm"
                >
                    <div class="absolute top-0 right-0 p-10 opacity-[0.02]">
                        <CreditCard class="w-64 h-64 rotate-12" />
                    </div>

                    <div class="space-y-6 relative z-10">
                        <div
                            :class="[
                                'inline-flex px-5 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-[0.3em] italic shadow-sm',
                                getStatusColor(booking.status),
                            ]"
                        >
                            {{ booking.status }}
                        </div>
                        <h2
                            class="text-7xl font-black text-slate-950 italic tracking-tighter leading-none"
                        >
                            R{{ Number(booking.priceTotal).toLocaleString() }}
                        </h2>
                        <div
                            class="flex flex-wrap items-center gap-8 text-slate-400"
                        >
                            <div
                                class="flex items-center gap-2.5 text-xs font-black uppercase tracking-[0.2em]"
                            >
                                <Calendar class="w-4 h-4 text-primary" />
                                {{
                                    format(
                                        parseISO(booking.date),
                                        "EEEE, MMMM do, yyyy",
                                    )
                                }}
                            </div>
                            <div
                                class="flex items-center gap-2.5 text-xs font-black uppercase tracking-[0.2em]"
                            >
                                <Clock class="w-4 h-4 text-primary" />
                                {{ booking.startTime }}
                                <span class="text-slate-200">-</span>
                                {{ booking.endTime }}
                            </div>
                        </div>
                    </div>

           <div class="flex flex-col gap-3 relative z-10 w-full md:w-auto">
              <div class="grid grid-cols-2 gap-2 mb-2">
                 <button
                   v-for="status in ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED']"
                   :key="status"
                   @click="updateStatus(status)"
                   :class="['px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all border',
                     booking.status === status ? 'bg-primary border-primary text-white' : 'bg-white border-slate-100 text-slate-400 hover:border-primary/20']"
                 >
                    {{ status }}
                 </button>
              </div>
              <button class="px-8 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-primary transition-all shadow-xl uppercase tracking-widest text-[10px] italic">Download Manifest</button>
           </div>
                </div>

                <!-- Service Manifest -->
                <div
                    class="bg-white border border-slate-100 rounded-[48px] overflow-hidden shadow-sm"
                >
                    <div
                        class="p-10 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between"
                    >
                        <h3
                            class="text-[10px] font-black text-slate-900 uppercase tracking-[0.4em] italic"
                        >
                            Line Item Analytics
                        </h3>
                        <Layers class="w-5 h-5 text-slate-200" />
                    </div>
                    <div class="divide-y divide-slate-50">
                        <div
                            v-for="s in booking.services"
                            :key="s.id"
                            class="p-10 flex items-center justify-between group hover:bg-slate-50/50 transition-all"
                        >
                            <div class="flex items-center gap-8">
                                <div
                                    class="w-16 h-16 rounded-[24px] bg-slate-100 border border-slate-200 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-700 shadow-inner"
                                >
                                    <Store class="w-6 h-6" stroke-width="1.5" />
                                </div>
                                <div>
                                    <div
                                        class="text-2xl font-black text-slate-900 italic tracking-tighter"
                                    >
                                        {{ s.service.name }}
                                    </div>
                                    <div
                                        class="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-2 flex items-center gap-3"
                                    >
                                        {{ s.durationMinutes }} MIN CYCLE
                                        <span
                                            class="w-1 h-1 bg-slate-200 rounded-full"
                                        ></span>
                                        AGENT:
                                        <span class="text-slate-900">{{
                                            s.employee?.name || "Automated"
                                        }}</span>
                                    </div>
                                </div>
                            </div>
                            <div
                                class="text-3xl font-black text-slate-950 italic tracking-tighter"
                            >
                                R{{ Number(s.price).toLocaleString() }}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Transmission Narrative -->
                <div
                    v-if="booking.notes"
                    class="bg-white border border-slate-100 rounded-[48px] p-10 shadow-sm relative overflow-hidden"
                >
                    <div
                        class="absolute -left-4 -top-4 text-9xl text-slate-50 font-serif leading-none italic select-none"
                    >
                        "
                    </div>
                    <h3
                        class="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-8 italic relative z-10 ml-2"
                    >
                        Client Context
                    </h3>
                    <div
                        class="bg-slate-50/50 p-10 rounded-[32px] border border-slate-100 italic text-slate-600 text-lg leading-relaxed font-medium relative z-10"
                    >
                        {{ booking.notes }}
                    </div>
                </div>
            </div>

            <!-- Side Intel Column -->
            <div class="space-y-12">
                <!-- Consumer Identity -->
                <div
                    class="bg-white border border-slate-100 rounded-[48px] overflow-hidden shadow-sm"
                >
                    <div
                        class="p-10 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between"
                    >
                        <h3
                            class="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] italic"
                        >
                            Consumer Node
                        </h3>
                        <User class="w-5 h-5 text-slate-200" />
                    </div>
                    <div class="p-10">
                        <div
                            class="flex flex-col items-center text-center space-y-6"
                        >
                            <div
                                class="w-32 h-32 rounded-[40px] bg-slate-100 border-4 border-white flex items-center justify-center text-primary font-black text-5xl shadow-2xl overflow-hidden ring-1 ring-slate-100"
                            >
                                <img
                                    v-if="booking.user.profile?.avatarUrl"
                                    :src="booking.user.profile.avatarUrl"
                                    class="w-full h-full object-cover"
                                />
                                <template v-else>{{
                                    booking.user.fullName?.[0].toUpperCase()
                                }}</template>
                            </div>
                            <div>
                                <div
                                    class="text-2xl font-black text-slate-950 italic tracking-tighter"
                                >
                                    {{
                                        booking.user.fullName ||
                                        "Citizen Anonymous"
                                    }}
                                </div>
                                <div
                                    class="text-[10px] text-teal-600 font-black uppercase tracking-widest mt-2 bg-teal-50 px-3 py-1 rounded-full border border-teal-100 inline-block"
                                >
                                    Verified Identity
                                </div>
                            </div>
                        </div>

                        <div
                            class="space-y-5 mt-10 pt-10 border-t border-slate-50"
                        >
                            <div
                                class="flex items-center gap-5 text-slate-500 group"
                            >
                                <div
                                    class="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 group-hover:border-primary group-hover:text-primary transition-colors duration-500"
                                >
                                    <Mail class="w-4 h-4" />
                                </div>
                                <span
                                    class="text-xs font-black truncate uppercase tracking-widest"
                                    >{{ booking.user.email }}</span
                                >
                            </div>
                            <div
                                v-if="booking.user.profile?.phone"
                                class="flex items-center gap-5 text-slate-500 group"
                            >
                                <div
                                    class="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 group-hover:border-primary group-hover:text-primary transition-colors duration-500"
                                >
                                    <Phone class="w-4 h-4" />
                                </div>
                                <span
                                    class="text-xs font-black uppercase tracking-widest"
                                    >{{ booking.user.profile.phone }}</span
                                >
                            </div>
                        </div>

                        <button
                            class="w-full py-5 bg-slate-950 text-slate-400 font-black uppercase tracking-widest text-[10px] rounded-[20px] hover:text-white mt-10 hover:bg-primary transition-all shadow-xl"
                        >
                            Inspect Full History
                        </button>
                    </div>
                </div>

                <!-- Establishment Node -->
                <div
                    class="bg-white border border-slate-100 rounded-[48px] overflow-hidden shadow-sm"
                >
                    <div
                        class="p-10 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between"
                    >
                        <h3
                            class="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] italic"
                        >
                            Provider Node
                        </h3>
                        <Store class="w-5 h-5 text-slate-200" />
                    </div>
                    <div class="p-10 space-y-10">
                        <div>
                            <div
                                class="text-2xl font-black text-slate-900 italic tracking-tighter"
                            >
                                {{ booking.venue.name }}
                            </div>
                            <div
                                class="text-[10px] text-primary font-black uppercase tracking-widest mt-2"
                            >
                                Active Network Point
                            </div>
                        </div>

                        <div class="space-y-6">
                            <div class="flex items-start gap-5 text-slate-500">
                                <div
                                    class="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 mt-1 shadow-inner"
                                >
                                    <MapPin class="w-4 h-4 text-primary" />
                                </div>
                                <div
                                    class="text-xs font-black uppercase leading-relaxed tracking-widest"
                                >
                                    {{ booking.venue.address?.street }}<br />
                                    {{ booking.venue.address?.suburb }},
                                    {{ booking.venue.address?.city }}<br />
                                    <span class="text-slate-300">{{
                                        booking.venue.address?.country
                                    }}</span>
                                </div>
                            </div>
                            <div class="flex items-center gap-5 text-slate-500">
                                <div
                                    class="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 shadow-inner"
                                >
                                    <Phone class="w-4 h-4 text-primary" />
                                </div>
                                <span
                                    class="text-xs font-black uppercase tracking-widest"
                                    >{{ booking.venue.contact?.phone }}</span
                                >
                            </div>
                        </div>

                        <NuxtLink
                            :to="`/venue/${booking.venue.slug}`"
                            target="_blank"
                            class="flex items-center justify-center gap-3 w-full py-5 bg-white text-primary font-black uppercase tracking-widest text-[10px] rounded-[20px] hover:bg-slate-50 border border-primary/20 transition-all"
                        >
                            <ExternalLink class="w-4 h-4" />
                            Explore Public Node
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
