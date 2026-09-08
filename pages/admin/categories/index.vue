<script setup lang="ts">
import {
    Plus,
    Edit2,
    Trash2,
    ArrowUpRight,
    Layers,
    Loader2,
    Store,
} from "lucide-vue-next";
import { computed, ref } from "vue";
import Head from "~/components/head/Head.vue";

definePageMeta({
    layout: "admin",
    middleware: "auth",
});

interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    imageUrl?: string | null;
    icon?: string | null;
    status: "ACTIVE" | "INACTIVE";
    _count?: {
        venues?: number;
    };
}

interface CategoryForm {
    name: string;
    slug: string;
    description: string;
    imageUrl: string;
    icon: string;
    status: "ACTIVE" | "INACTIVE";
}

const {
    data: response,
    pending,
    refresh,
} = await useFetch<{ data: Category[] }>("/api/admin/categories");

const categories = computed(() => response.value?.data ?? []);

const isSlideoverOpen = ref(false);
const isSaving = ref(false);
const editingCategory = ref<Category | null>(null);

const form = ref<CategoryForm>({
    name: "",
    slug: "",
    description: "",
    imageUrl: "",
    icon: "CircleEllipsis",
    status: "ACTIVE",
});

function resetForm() {
    form.value = {
        name: "",
        slug: "",
        description: "",
        imageUrl: "",
        icon: "CircleEllipsis",
        status: "ACTIVE",
    };
}

function openCreate() {
    editingCategory.value = null;
    resetForm();
    isSlideoverOpen.value = true;
}

function openEdit(category: Category) {
    editingCategory.value = category;

    form.value = {
        name: category.name ?? "",
        slug: category.slug ?? "",
        description: category.description ?? "",
        imageUrl: category.imageUrl ?? "",
        icon: category.icon ?? "CircleEllipsis",
        status: category.status ?? "ACTIVE",
    };

    isSlideoverOpen.value = true;
}

function closeSlideover() {
    if (isSaving.value) return;

    isSlideoverOpen.value = false;
    editingCategory.value = null;
}

function updateSlug() {
    if (editingCategory.value) return;

    form.value.slug = form.value.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

async function handleSave() {
    if (!form.value.name.trim()) return;

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
        closeSlideover();
    } catch (error: any) {
        alert(
            error?.data?.statusMessage ||
                error?.data?.message ||
                "Failed to save category",
        );
    } finally {
        isSaving.value = false;
    }
}

async function handleDelete(id: string) {
    const confirmed = window.confirm(
        "Are you sure you want to delete this category? Linked businesses will remain but will no longer have a category.",
    );

    if (!confirmed) return;

    try {
        await $fetch(`/api/admin/categories/${id}`, {
            method: "DELETE",
        });

        await refresh();
    } catch (error: any) {
        alert(
            error?.data?.statusMessage ||
                error?.data?.message ||
                "Failed to delete category",
        );
    }
}
</script>

<template>
    <div class="space-y-8 pb-20">
        <Head
            title="Categories"
            description="Manage the service categories used across DailyBookings"
        />

        <div
            class="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between"
        >
            <div class="flex items-center gap-3">
                <div
                    class="border border-slate-200 bg-white px-4 py-2.5 text-[11px] font-semibold text-slate-600"
                >
                    {{ categories.length }} categories
                </div>

                <div
                    class="hidden border border-slate-200 bg-white px-4 py-2.5 text-[11px] font-medium text-slate-400 sm:block"
                >
                    {{
                        categories.filter(
                            (category) => category.status === "ACTIVE",
                        ).length
                    }}
                    active
                </div>
            </div>

            <UiButton label="Add category" :icon="Plus" @click="openCreate" />
        </div>

        <!-- Loading -->
        <div
            v-if="pending"
            class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
            <div
                v-for="i in 6"
                :key="i"
                class="h-[380px] animate-pulse border border-slate-200 bg-white"
            />
        </div>

        <!-- Categories -->
        <div
            v-else
            class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
            <article
                v-for="category in categories"
                :key="category.id"
                class="group flex min-h-[380px] flex-col overflow-hidden border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-lg"
            >
                <!-- Image -->
                <div class="relative aspect-[16/9] overflow-hidden bg-slate-50">
                    <img
                        v-if="category.imageUrl"
                        :src="category.imageUrl"
                        :alt="category.name"
                        class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />

                    <div
                        v-else
                        class="flex h-full w-full items-center justify-center text-slate-200"
                    >
                        <Layers class="h-12 w-12" />
                    </div>

                    <div
                        class="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-950/30 to-transparent"
                    />

                    <span
                        :class="[
                            'absolute top-4 left-4 border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide backdrop-blur-sm',
                            category.status === 'ACTIVE'
                                ? 'border-teal-200 bg-white/95 text-teal-700'
                                : 'border-slate-200 bg-white/95 text-slate-500',
                        ]"
                    >
                        {{ category.status }}
                    </span>
                </div>

                <!-- Content -->
                <div class="flex flex-1 flex-col p-6">
                    <div class="flex items-start justify-between gap-4">
                        <div class="min-w-0">
                            <h3
                                class="truncate text-xl font-bold tracking-tight text-slate-900"
                            >
                                {{ category.name }}
                            </h3>

                            <p
                                class="mt-1 truncate font-mono text-[11px] text-slate-400"
                            >
                                /{{ category.slug }}
                            </p>
                        </div>

                        <div class="flex shrink-0 items-center gap-1.5">
                            <button
                                type="button"
                                aria-label="Edit category"
                                title="Edit category"
                                class="inline-flex h-9 w-9 items-center justify-center border border-slate-200 bg-white text-slate-400 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                                @click="openEdit(category)"
                            >
                                <Edit2 class="h-4 w-4" />
                            </button>

                            <button
                                type="button"
                                aria-label="Delete category"
                                title="Delete category"
                                class="inline-flex h-9 w-9 items-center justify-center border border-slate-200 bg-white text-slate-400 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                                @click="handleDelete(category.id)"
                            >
                                <Trash2 class="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    <p
                        class="mt-5 line-clamp-3 text-sm leading-6 text-slate-500"
                    >
                        {{
                            category.description ||
                            "Businesses offering services in this category."
                        }}
                    </p>

                    <div
                        class="mt-auto flex items-center justify-between border-t border-slate-100 pt-5"
                    >
                        <div>
                            <div
                                class="text-lg font-bold tracking-tight text-slate-900"
                            >
                                {{ category._count?.venues ?? 0 }}
                            </div>

                            <div class="text-xs text-slate-400">
                                {{
                                    category._count?.venues === 1
                                        ? "business"
                                        : "businesses"
                                }}
                            </div>
                        </div>

                        <NuxtLink
                            :to="`/category/${category.slug}`"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="View category"
                            class="inline-flex h-9 w-9 items-center justify-center border border-slate-200 bg-slate-50 text-slate-400 transition-colors hover:border-slate-800 hover:bg-slate-900 hover:text-white"
                        >
                            <ArrowUpRight class="h-4 w-4" />
                        </NuxtLink>
                    </div>
                </div>
            </article>

            <!-- Empty -->
            <div
                v-if="categories.length === 0"
                class="col-span-full flex min-h-[480px] flex-col items-center justify-center border border-slate-200 bg-white px-6 text-center"
            >
                <div
                    class="mb-5 flex h-14 w-14 items-center justify-center border border-slate-200 bg-slate-50"
                >
                    <Store class="h-6 w-6 text-slate-300" />
                </div>

                <h3 class="text-base font-semibold text-slate-900">
                    No categories yet
                </h3>

                <p class="mt-1 max-w-sm text-sm leading-6 text-slate-400">
                    Create your first service category to help customers
                    discover businesses on DailyBookings.
                </p>

                <UiButton
                    class="mt-6"
                    label="Add category"
                    :icon="Plus"
                    @click="openCreate"
                />
            </div>
        </div>

        <!-- Category editor -->
        <UiSlideover
            :show="isSlideoverOpen"
            :title="editingCategory ? 'Edit category' : 'Add category'"
            @close="closeSlideover"
        >
            <form
                id="category-form"
                class="space-y-8"
                @submit.prevent="handleSave"
            >
                <!-- Image -->
                <div class="space-y-3">
                    <label
                        class="block text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400"
                    >
                        Category image
                    </label>

                    <div
                        v-if="form.imageUrl"
                        class="group/preview relative aspect-video overflow-hidden border border-slate-200 bg-slate-50"
                    >
                        <img
                            :src="form.imageUrl"
                            :alt="form.name || 'Category image'"
                            class="h-full w-full object-cover"
                        />

                        <div
                            class="absolute inset-0 flex items-center justify-center bg-slate-950/40 opacity-0 transition-opacity group-hover/preview:opacity-100"
                        >
                            <button
                                type="button"
                                @click="form.imageUrl = ''"
                                class="inline-flex h-10 w-10 items-center justify-center border border-white/20 bg-white text-red-600 shadow-lg transition-colors hover:bg-red-50"
                                aria-label="Remove category image"
                            >
                                <Trash2 class="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    <UiMediaUpload
                        v-else
                        entity-type="CATEGORY"
                        label="Upload category image"
                        @uploaded="(data) => (form.imageUrl = data.url)"
                    />
                </div>

                <!-- Name -->
                <div class="space-y-2">
                    <label
                        for="category-name"
                        class="block text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400"
                    >
                        Name
                    </label>

                    <input
                        id="category-name"
                        v-model="form.name"
                        type="text"
                        required
                        placeholder="e.g. Wellness & Spa"
                        class="h-11 w-full border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-slate-400"
                        @input="updateSlug"
                    />
                </div>

                <!-- Slug -->
                <div class="space-y-2">
                    <label
                        for="category-slug"
                        class="block text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400"
                    >
                        Slug
                    </label>

                    <input
                        id="category-slug"
                        v-model="form.slug"
                        type="text"
                        required
                        placeholder="wellness-spa"
                        class="h-11 w-full border border-slate-200 bg-slate-50 px-4 font-mono text-sm text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-slate-400"
                    />

                    <p class="text-xs text-slate-400">
                        Used in the public category URL.
                    </p>
                </div>

                <!-- Description -->
                <div class="space-y-2">
                    <label
                        for="category-description"
                        class="block text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400"
                    >
                        Description
                    </label>

                    <textarea
                        id="category-description"
                        v-model="form.description"
                        rows="4"
                        placeholder="Describe the services customers can find in this category..."
                        class="w-full resize-none border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-slate-400"
                    />
                </div>

                <!-- Icon / Status -->
                <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div class="space-y-2">
                        <label
                            for="category-icon"
                            class="block text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400"
                        >
                            Icon
                        </label>

                        <input
                            id="category-icon"
                            v-model="form.icon"
                            type="text"
                            placeholder="e.g. Sparkles"
                            class="h-11 w-full border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-slate-400"
                        />
                    </div>

                    <div class="space-y-2">
                        <label
                            for="category-status"
                            class="block text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400"
                        >
                            Status
                        </label>

                        <select
                            id="category-status"
                            v-model="form.status"
                            class="h-11 w-full border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition-colors focus:border-slate-400"
                        >
                            <option value="ACTIVE">Active</option>
                            <option value="INACTIVE">Inactive</option>
                        </select>
                    </div>
                </div>
            </form>

            <template #footer>
                <div class="flex gap-3">
                    <UiButton
                        label="Cancel"
                        variant="outline"
                        class="flex-1"
                        :disabled="isSaving"
                        @click="closeSlideover"
                    />

                    <UiButton
                        :label="
                            editingCategory ? 'Save changes' : 'Create category'
                        "
                        :loading="isSaving"
                        button-type="submit"
                        form="category-form"
                        class="flex-[2]"
                    />
                </div>
            </template>
        </UiSlideover>
    </div>
</template>
