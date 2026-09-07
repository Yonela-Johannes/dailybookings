<script setup lang="ts">
import {
    Plus,
    Search,
    MoreVertical,
    Edit2,
    Trash2,
    LayoutGrid,
    Loader2,
    X,
    Upload,
} from "lucide-vue-next";
import { ref, computed } from "vue";
import Slideover from "~/components/ui/Slideover.vue";

definePageMeta({
    layout: "admin",
    middleware: "auth",
});

const { data: response, pending, refresh } = await useFetch("/api/admin/categories");

const categories = computed(() => response.value?.data || []);

const isSlideoverOpen = ref(false);
const isSaving = ref(false);
const editingCategory = ref<any>(null);

const form = ref({
    name: "",
    slug: "",
    description: "",
    imageUrl: "",
    icon: "",
    status: "ACTIVE",
});

function openCreate() {
    editingCategory.value = null;
    form.value = {
        name: "",
        slug: "",
        description: "",
        imageUrl: "",
        icon: "CircleEllipsis",
        status: "ACTIVE",
    };
    isSlideoverOpen.value = true;
}

function openEdit(category: any) {
    editingCategory.value = category;
    form.value = {
        name: category.name,
        slug: category.slug,
        description: category.description || "",
        imageUrl: category.imageUrl || "",
        icon: category.icon || "CircleEllipsis",
        status: category.status,
    };
    isSlideoverOpen.value = true;
}

async function handleSave() {
    isSaving.value = true;
    try {
        if (editingCategory.value) {
            await $fetch(`/api/admin/categories/${editingCategory.value.id}`, {
                method: "PATCH",
                body: form.value,
            });
        } else {
            await $fetch("/api/admin/categories", {
                method: "POST",
                body: form.value,
            });
        }
        await refresh();
        isSlideoverOpen.value = false;
    } catch (error) {
        console.error("Failed to save category", error);
    } finally {
        isSaving.value = false;
    }
}

async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
        await $fetch(`/api/admin/categories/${id}`, {
            method: "DELETE",
        });
        await refresh();
    } catch (error) {
        console.error("Failed to delete category", error);
        alert("Could not delete category. Ensure no venues are linked to it.");
    }
}

function updateSlug() {
    if (!editingCategory.value) {
        form.value.slug = form.value.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
    }
}
</script>

<template>
    <div class="space-y-8">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 class="text-3xl font-extrabold text-white italic">
                    Categories
                </h1>
                <p class="text-slate-500">
                    Manage the marketplace service categories.
                </p>
            </div>
            <button
                @click="openCreate"
                class="flex items-center gap-2 px-6 py-2.5 bg-teal-500 text-slate-950 font-black rounded-xl hover:bg-teal-400 transition-all shadow-lg shadow-teal-500/20 uppercase tracking-widest text-sm"
            >
                <Plus class="w-5 h-5" />
                Add Category
            </button>
        </div>

        <div
            class="bg-slate-950/50 border border-slate-800 rounded-2xl overflow-hidden"
        >
            <div
                class="p-4 border-b border-slate-800 bg-slate-900/50 flex items-center gap-4"
            >
                <div class="relative flex-1">
                    <Search
                        class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"
                    />
                    <input
                        type="text"
                        placeholder="Search categories..."
                        class="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:ring-2 focus:ring-teal-500/20 outline-none"
                    />
                </div>
            </div>

            <div v-if="pending" class="p-20 flex justify-center">
                <Loader2 class="w-8 h-8 text-teal-500 animate-spin" />
            </div>

            <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-800">
                <div
                    v-for="category in categories"
                    :key="category.id"
                    class="bg-slate-900 p-6 flex items-start gap-5 hover:bg-slate-900/80 transition-colors group"
                >
                    <div class="w-16 h-16 shrink-0 border border-slate-800 bg-slate-950 rounded-xl overflow-hidden">
                        <img v-if="category.imageUrl" :src="category.imageUrl" class="w-full h-full object-cover opacity-60" />
                        <div v-else class="w-full h-full flex items-center justify-center text-slate-700">
                            <LayoutGrid class="w-8 h-8" />
                        </div>
                    </div>

                    <div class="flex-1 min-w-0">
                        <div class="flex items-center justify-between">
                            <h3 class="text-lg font-bold text-white truncate">{{ category.name }}</h3>
                            <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button @click="openEdit(category)" class="p-1.5 hover:bg-slate-800 text-slate-500 hover:text-teal-400 rounded-lg">
                                    <Edit2 class="w-4 h-4" />
                                </button>
                                <button @click="handleDelete(category.id)" class="p-1.5 hover:bg-slate-800 text-slate-500 hover:text-red-500 rounded-lg">
                                    <Trash2 class="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <p class="text-[10px] font-black text-teal-500 uppercase tracking-widest mt-1">{{ category.slug }}</p>
                        <p class="mt-2 text-xs text-slate-500 line-clamp-2 leading-relaxed">{{ category.description || 'No description' }}</p>

                        <div class="mt-4 flex items-center gap-3">
                            <span :class="['px-2 py-0.5 text-[8px] font-black uppercase rounded-full border', category.status === 'ACTIVE' ? 'bg-teal-500/10 text-teal-500 border-teal-500/20' : 'bg-slate-800 text-slate-500 border-slate-700']">
                                {{ category.status }}
                            </span>
                             <span class="text-[10px] font-bold text-slate-700">
                                {{ category._count?.venues || 0 }} Venues
                            </span>
                        </div>
                    </div>
                </div>

                <div v-if="categories.length === 0" class="col-span-full py-20 text-center bg-slate-950/50">
                     <p class="text-slate-500 italic">No categories found. Create your first one above.</p>
                </div>
            </div>
        </div>

        <Slideover
            :open="isSlideoverOpen"
            :title="editingCategory ? 'Edit Category' : 'Add Category'"
            @close="isSlideoverOpen = false"
        >
            <form @submit.prevent="handleSave" class="space-y-8">
                <div class="space-y-6">
                    <!-- Image Upload simulated -->
                    <div class="space-y-2">
                        <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Category Image URL</label>
                        <input
                            v-model="form.imageUrl"
                            type="url"
                            placeholder="https://images.unsplash.com/..."
                            class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-950 focus:ring-2 focus:ring-teal-500/20 outline-none"
                        />
                    </div>

                    <div class="space-y-2">
                        <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Name</label>
                        <input
                            v-model="form.name"
                            type="text"
                            required
                            @input="updateSlug"
                            placeholder="e.g. Wellness"
                            class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-950 focus:ring-2 focus:ring-teal-500/20 outline-none"
                        />
                    </div>

                    <div class="space-y-2">
                        <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Slug</label>
                        <input
                            v-model="form.slug"
                            type="text"
                            required
                            placeholder="e.g. wellness"
                            class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-950 focus:ring-2 focus:ring-teal-500/20 outline-none"
                        />
                    </div>

                    <div class="space-y-2">
                        <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</label>
                        <textarea
                            v-model="form.description"
                            rows="3"
                            placeholder="What services are in this category?"
                            class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-950 focus:ring-2 focus:ring-teal-500/20 outline-none resize-none"
                        ></textarea>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-2">
                            <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Icon Key</label>
                            <input
                                v-model="form.icon"
                                type="text"
                                placeholder="e.g. Sparkles"
                                class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-950 focus:ring-2 focus:ring-teal-500/20 outline-none"
                            />
                        </div>
                        <div class="space-y-2">
                            <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</label>
                            <select
                                v-model="form.status"
                                class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-950 focus:ring-2 focus:ring-teal-500/20 outline-none"
                            >
                                <option value="ACTIVE">Active</option>
                                <option value="INACTIVE">Inactive</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div class="flex gap-4 pt-4">
                    <button
                        type="submit"
                        :disabled="isSaving"
                        class="flex-1 bg-teal-500 text-slate-950 py-4 font-black uppercase tracking-[0.2em] text-xs hover:bg-teal-400 transition-colors disabled:opacity-50"
                    >
                        {{ isSaving ? 'Saving...' : (editingCategory ? 'Update Category' : 'Create Category') }}
                    </button>
                </div>
            </form>
        </Slideover>
    </div>
</template>
