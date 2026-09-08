<script setup lang="ts">
import {
    Plus,
    Edit2,
    Trash2,
    Users,
    Store,
    Loader2,
    Search,
    ChevronLeft,
    ChevronRight,
    MapPin,
    ArrowUpRight,
    Image as ImageIcon,
} from "lucide-vue-next";
import Head from "~/components/head/Head.vue";

definePageMeta({
    layout: "admin",
    middleware: "auth",
});

const search = ref("");
const page = ref(1);

const { data: response, pending, refresh } = await useFetch<any>("/api/admin/communities", {
    query: { search, page, limit: 10 },
    watch: [search, page],
});

const communities = computed(() => response.value?.data || []);
const meta = computed(() => response.value?.meta || { total: 0, page: 1, totalPages: 1 });

const isSlideoverOpen = ref(false);
const isSaving = ref(false);
const editingCommunity = ref<any>(null);

const form = ref({
    name: "",
    slug: "",
    description: "",
    imageUrl: "",
    status: "ACTIVE",
});

function openCreate() {
    editingCommunity.value = null;
    form.value = {
        name: "",
        slug: "",
        description: "",
        imageUrl: "",
        status: "ACTIVE",
    };
    isSlideoverOpen.value = true;
}

function openEdit(community: any) {
    editingCommunity.value = community;
    form.value = {
        name: community.name,
        slug: community.slug,
        description: community.description || "",
        imageUrl: community.imageUrl || "",
        status: community.status,
    };
    isSlideoverOpen.value = true;
}

async function handleSave() {
    isSaving.value = true;
    try {
        if (editingCommunity.value) {
            await $fetch(`/api/admin/communities/${editingCommunity.value.id}`, {
                method: "PATCH",
                body: form.value,
            });
        } else {
            await $fetch("/api/admin/communities", {
                method: "POST",
                body: form.value,
            });
        }
        await refresh();
        isSlideoverOpen.value = false;
    } catch (error: any) {
        alert(error.data?.statusMessage || "Failed to save community");
    } finally {
        isSaving.value = false;
    }
}

async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this community?")) return;
    try {
        await $fetch(`/api/admin/communities/${id}`, { method: "DELETE" });
        await refresh();
    } catch (error: any) {
        alert(error.data?.statusMessage || "Failed to delete community");
    }
}

function updateSlug() {
    if (editingCommunity.value) return;
    form.value.slug = form.value.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}
</script>

<template>
    <div class="space-y-8 pb-20">
        <Head
            title="Communities"
            description="Manage local neighborhood and service communities"
        />

        <div class="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
            <div class="flex items-center gap-3">
                <div class="border border-slate-200 bg-white px-4 py-2.5 text-[11px] font-semibold text-slate-600">
                    {{ meta.total }} communities
                </div>
            </div>

            <UiButton label="Add community" :icon="Plus" @click="openCreate" />
        </div>

        <div class="overflow-hidden border border-slate-200 bg-white shadow-sm">
            <div class="flex flex-col gap-4 border-b border-slate-200 bg-slate-50/40 p-5 lg:flex-row lg:items-end">
                <div class="w-full max-w-xl">
                    <label class="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                        Search communities
                    </label>
                    <div class="relative">
                        <Search class="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            v-model="search"
                            type="text"
                            placeholder="Search by name or slug..."
                            class="h-10 w-full border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none transition-colors focus:border-slate-400"
                        />
                    </div>
                </div>
            </div>

            <div v-if="pending" class="flex min-h-[400px] items-center justify-center">
                <Loader2 class="h-6 w-6 animate-spin text-slate-400" />
            </div>

            <div v-else-if="communities.length" class="overflow-x-auto">
                <table class="w-full text-left">
                    <thead>
                        <tr class="border-b border-slate-200 bg-slate-50/60">
                            <th class="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Community</th>
                            <th class="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Status</th>
                            <th class="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Activity</th>
                            <th class="px-6 py-4 text-right text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        <tr v-for="community in communities" :key="community.id" class="group transition-colors hover:bg-slate-50/60">
                            <td class="px-6 py-5">
                                <div class="flex items-center gap-4">
                                    <div class="h-12 w-12 shrink-0 overflow-hidden border border-slate-200 bg-slate-50">
                                        <img v-if="community.imageUrl" :src="community.imageUrl" class="h-full w-full object-cover" />
                                        <div v-else class="flex h-full w-full items-center justify-center text-slate-300">
                                            <MapPin class="h-5 w-5" />
                                        </div>
                                    </div>
                                    <div class="min-w-0">
                                        <div class="flex items-center gap-2">
                                            <span class="text-sm font-semibold text-slate-900">{{ community.name }}</span>
                                            <NuxtLink :to="`/community/${community.slug}`" target="_blank" class="text-slate-400 hover:text-primary">
                                                <ArrowUpRight class="h-3.5 w-3.5" />
                                            </NuxtLink>
                                        </div>
                                        <p class="mt-0.5 text-xs text-slate-400">/{{ community.slug }}</p>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-5">
                                <span :class="[
                                    'inline-flex border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
                                    community.status === 'ACTIVE' ? 'border-teal-200 bg-teal-50 text-teal-700' : 'border-slate-200 bg-slate-50 text-slate-500'
                                ]">
                                    {{ community.status }}
                                </span>
                            </td>
                            <td class="px-6 py-5">
                                <div class="flex items-center gap-4">
                                    <div>
                                        <div class="text-sm font-semibold text-slate-900">{{ community._count?.venues }}</div>
                                        <div class="text-[10px] uppercase text-slate-400">Venues</div>
                                    </div>
                                    <div class="h-8 w-px bg-slate-100"></div>
                                    <div>
                                        <div class="text-sm font-semibold text-slate-900">{{ community._count?.members }}</div>
                                        <div class="text-[10px] uppercase text-slate-400">Members</div>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-5 text-right">
                                <div class="flex items-center justify-end gap-2">
                                    <button @click="openEdit(community)" class="h-8 w-8 flex items-center justify-center text-slate-400 hover:text-slate-900 border border-transparent hover:border-slate-200 transition-colors">
                                        <Edit2 class="h-3.5 w-3.5" />
                                    </button>
                                    <button @click="handleDelete(community.id)" class="h-8 w-8 flex items-center justify-center text-slate-400 hover:text-red-600 border border-transparent hover:border-red-100 transition-colors">
                                        <Trash2 class="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div v-else class="flex min-h-[400px] flex-col items-center justify-center p-12 text-center">
                <div class="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                    <MapPin class="h-6 w-6 text-slate-300" />
                </div>
                <p class="text-sm font-medium text-slate-900">No communities found</p>
                <p class="text-xs text-slate-500 mt-1">Create a community to group local businesses.</p>
            </div>

            <div v-if="meta.totalPages > 1" class="flex items-center justify-between border-t border-slate-200 bg-slate-50/40 px-5 py-4">
                <p class="text-xs text-slate-400">Showing page {{ meta.page }} of {{ meta.totalPages }}</p>
                <div class="flex items-center gap-2">
                    <button :disabled="page === 1" @click="page--" class="h-9 w-9 flex items-center justify-center border border-slate-200 bg-white disabled:opacity-30">
                        <ChevronLeft class="h-4 w-4" />
                    </button>
                    <button :disabled="page >= meta.totalPages" @click="page++" class="h-9 w-9 flex items-center justify-center border border-slate-200 bg-white disabled:opacity-30">
                        <ChevronRight class="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>

        <!-- Slideover -->
        <UiSlideover
            :show="isSlideoverOpen"
            :title="editingCommunity ? 'Edit Community' : 'Add Community'"
            @close="isSlideoverOpen = false"
        >
            <form id="community-form" class="space-y-6" @submit.prevent="handleSave">
                <div class="space-y-3">
                    <label class="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Image</label>
                    <div v-if="form.imageUrl" class="relative aspect-video border border-slate-200 overflow-hidden">
                        <img :src="form.imageUrl" class="h-full w-full object-cover" />
                        <button type="button" @click="form.imageUrl = ''" class="absolute top-2 right-2 p-1.5 bg-white text-red-600 shadow-sm">
                            <Trash2 class="h-3.5 w-3.5" />
                        </button>
                    </div>
                    <UiMediaUpload v-else entity-type="COMMUNITY" label="Upload community image" @uploaded="(d) => form.imageUrl = d.url" />
                </div>

                <div class="space-y-1.5">
                    <label class="text-xs font-semibold text-slate-700">Name</label>
                    <input v-model="form.name" type="text" required placeholder="e.g. Sandton Wellness" class="h-10 w-full border border-slate-200 px-3 text-sm outline-none focus:border-primary" @input="updateSlug" />
                </div>

                <div class="space-y-1.5">
                    <label class="text-xs font-semibold text-slate-700">Slug</label>
                    <input v-model="form.slug" type="text" required placeholder="sandton-wellness" class="h-10 w-full border border-slate-200 px-3 text-sm font-mono outline-none focus:border-primary" />
                </div>

                <div class="space-y-1.5">
                    <label class="text-xs font-semibold text-slate-700">Description</label>
                    <textarea v-model="form.description" rows="4" placeholder="Describe this community..." class="w-full border border-slate-200 p-3 text-sm outline-none focus:border-primary resize-none" />
                </div>

                <div class="space-y-1.5">
                    <label class="text-xs font-semibold text-slate-700">Status</label>
                    <select v-model="form.status" class="h-10 w-full border border-slate-200 bg-white px-3 text-sm outline-none focus:border-primary">
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                    </select>
                </div>
            </form>

            <template #footer>
                <div class="flex gap-3">
                    <UiButton label="Cancel" variant="outline" class="flex-1" @click="isSlideoverOpen = false" />
                    <UiButton :label="editingCommunity ? 'Save Changes' : 'Create Community'" button-type="submit" form="community-form" class="flex-[2]" :loading="isSaving" />
                </div>
            </template>
        </UiSlideover>
    </div>
</template>
