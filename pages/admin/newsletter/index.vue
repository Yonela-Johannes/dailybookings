<script setup lang="ts">
import {
    Mail,
    Search,
    Trash2,
    Download,
    Loader2,
    ChevronLeft,
    ChevronRight,
    Filter
} from "lucide-vue-next";
import { format, parseISO } from "date-fns";
import Head from "~/components/head/Head.vue";

definePageMeta({
    layout: "admin",
    middleware: "auth",
});

const search = ref("");
const page = ref(1);

const {
    data: newsletterData,
    pending,
    refresh
} = useFetch<any>("/api/admin/newsletter", {
    query: {
        search,
        page,
        limit: 20
    },
    watch: [search, page]
});

const subscribers = computed(() => newsletterData.value?.data || []);
const meta = computed(() => newsletterData.value?.meta || { total: 0, page: 1, totalPages: 1 });

const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this subscriber?")) return;

    try {
        await $fetch(`/api/admin/newsletter/${id}`, {
            method: "DELETE"
        });
        refresh();
    } catch (error) {
        console.error("Failed to delete subscriber:", error);
    }
};

const exportCSV = () => {
    if (subscribers.value.length === 0) return;

    const headers = ["Email", "Status", "Joined"];
    const rows = subscribers.value.map((s: any) => [
        s.email,
        s.active ? "Active" : "Inactive",
        format(parseISO(s.createdAt), "yyyy-MM-dd")
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `newsletter-subscribers-${format(new Date(), "yyyy-MM-dd")}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
</script>

<template>
    <div class="space-y-8 pb-20">
        <Head
            title="Newsletter"
            description="Manage your audience and community subscriptions."
        />

        <div class="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
            <div class="flex items-center gap-3">
                <div class="border border-slate-200 bg-white px-4 py-2.5 text-[11px] font-semibold text-slate-600">
                    {{ meta.total }} subscribers
                </div>
                <div class="hidden border border-slate-200 bg-white px-4 py-2.5 text-[11px] font-medium text-slate-400 sm:block">
                    Page {{ meta.page }} of {{ meta.totalPages }}
                </div>
            </div>

            <button
                type="button"
                @click="exportCSV"
                class="inline-flex h-10 items-center gap-2 border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
                <Download class="h-4 w-4" />
                Export CSV
            </button>
        </div>

        <div class="overflow-hidden border border-slate-200 bg-white shadow-sm">
            <!-- Filters -->
            <div class="flex flex-col gap-4 border-b border-slate-200 bg-slate-50/40 p-5 lg:flex-row lg:items-end">
                <div class="w-full max-w-xl">
                    <label class="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                        Search subscribers
                    </label>
                    <div class="relative">
                        <Search class="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            v-model="search"
                            type="text"
                            placeholder="Search by email..."
                            class="h-10 w-full border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none transition-colors focus:border-slate-400"
                        />
                    </div>
                </div>

                <button
                    type="button"
                    @click="refresh"
                    class="inline-flex h-10 w-10 shrink-0 items-center justify-center border border-slate-200 bg-white text-slate-500 transition-colors hover:border-slate-300 hover:bg-slate-50"
                >
                    <Filter class="h-4 w-4" />
                </button>
            </div>

            <!-- Loading -->
            <div v-if="pending" class="flex min-h-[400px] items-center justify-center">
                <Loader2 class="h-6 w-6 animate-spin text-slate-400" />
            </div>

            <!-- Table -->
            <div v-else-if="subscribers.length" class="overflow-x-auto">
                <table class="w-full text-left">
                    <thead>
                        <tr class="border-b border-slate-200 bg-slate-50/60">
                            <th class="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Email</th>
                            <th class="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Status</th>
                            <th class="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Joined</th>
                            <th class="px-6 py-4 text-right text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        <tr v-for="subscriber in subscribers" :key="subscriber.id" class="group transition-colors hover:bg-slate-50/60">
                            <td class="px-6 py-5">
                                <div class="flex items-center gap-3">
                                    <div class="flex h-9 w-9 shrink-0 items-center justify-center border border-slate-200 bg-slate-50 text-slate-400">
                                        <Mail class="h-4 w-4" />
                                    </div>
                                    <span class="text-sm font-medium text-slate-900">{{ subscriber.email }}</span>
                                </div>
                            </td>
                            <td class="px-6 py-5">
                                <span :class="[
                                    'inline-flex border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
                                    subscriber.active ? 'border-teal-200 bg-teal-50 text-teal-700' : 'border-slate-200 bg-slate-50 text-slate-500'
                                ]">
                                    {{ subscriber.active ? 'Active' : 'Inactive' }}
                                </span>
                            </td>
                            <td class="px-6 py-5 text-sm text-slate-500">
                                {{ format(parseISO(subscriber.createdAt), "MMM d, yyyy") }}
                            </td>
                            <td class="px-6 py-5 text-right">
                                <button
                                    @click="handleDelete(subscriber.id)"
                                    class="inline-flex h-8 w-8 items-center justify-center border border-transparent text-slate-400 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                                >
                                    <Trash2 class="h-4 w-4" />
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Empty -->
            <div v-else class="flex min-h-[400px] flex-col items-center justify-center px-6 text-center">
                <div class="mb-5 flex h-14 w-14 items-center justify-center border border-slate-200 bg-slate-50 text-slate-300">
                    <Mail class="h-6 w-6" />
                </div>
                <h3 class="text-base font-semibold text-slate-900">No subscribers found</h3>
                <p class="mt-1 text-sm text-slate-400">Try adjusting your search or check back later.</p>
            </div>

            <!-- Pagination -->
            <div v-if="meta.totalPages > 1" class="flex items-center justify-between border-t border-slate-200 bg-slate-50/40 px-5 py-4">
                <p class="text-xs text-slate-400">
                    Showing page {{ meta.page }} of {{ meta.totalPages }}
                </p>
                <div class="flex items-center gap-2">
                    <button
                        :disabled="page === 1"
                        @click="page--"
                        class="inline-flex h-9 w-9 items-center justify-center border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 disabled:opacity-30"
                    >
                        <ChevronLeft class="h-4 w-4" />
                    </button>
                    <button
                        :disabled="page >= meta.totalPages"
                        @click="page++"
                        class="inline-flex h-9 w-9 items-center justify-center border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 disabled:opacity-30"
                    >
                        <ChevronRight class="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
