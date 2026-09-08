<script setup lang="ts">
import {
    Plus,
    Scissors,
    Clock,
    ChevronRight,
    Edit2,
    Trash2,
    AlertCircle,
    Layers,
    ChevronDown,
} from "lucide-vue-next";
import { z } from "zod";

definePageMeta({
    layout: "business",
    middleware: "auth",
});

const categorySchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
});

const serviceSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    description: z.string().optional(),
    durationMinutes: z
        .number()
        .int()
        .min(1, "Duration must be at least 1 minute"),
    price: z.number().min(0, "Price cannot be negative"),
    serviceCategoryId: z.string().uuid("Please select a category"),
});

const { data: venuesRes } = await useFetch("/api/business/venues");

const venues = computed(() => venuesRes.value?.data || []);

const selectedVenueId = ref(venues.value[0]?.id || "");

const {
    data: categoriesRes,
    pending,
    refresh,
} = await useFetch("/api/business/services", {
    query: {
        venueId: selectedVenueId,
    },
    watch: [selectedVenueId],
});

const categories = computed(() => categoriesRes.value?.data || []);

const showSlideOver = ref(false);
const slideOverType = ref<"category" | "service">("category");
const slideOverMode = ref<"add" | "edit">("add");
const selectedItem = ref<any>(null);
const isSubmitting = ref(false);
const errors = ref<Record<string, string>>({});

const categoryForm = reactive({
    name: "",
});

const serviceForm = reactive({
    name: "",
    description: "",
    durationMinutes: 30,
    price: 0,
    serviceCategoryId: "",
});

const openCategoryForm = (category?: any) => {
    slideOverType.value = "category";
    slideOverMode.value = category ? "edit" : "add";
    selectedItem.value = category || null;

    categoryForm.name = category?.name || "";
    errors.value = {};

    showSlideOver.value = true;
};

const openServiceForm = (service?: any, categoryId?: string) => {
    slideOverType.value = "service";
    slideOverMode.value = service ? "edit" : "add";
    selectedItem.value = service || null;

    serviceForm.name = service?.name || "";
    serviceForm.description = service?.description || "";
    serviceForm.durationMinutes = service?.durationMinutes || 30;
    serviceForm.price = service ? Number(service.price) : 0;
    serviceForm.serviceCategoryId =
        service?.serviceCategoryId ||
        categoryId ||
        categories.value[0]?.id ||
        "";

    errors.value = {};
    showSlideOver.value = true;
};

const handleSubmit = async () => {
    errors.value = {};
    isSubmitting.value = true;

    try {
        if (slideOverType.value === "category") {
            const result = categorySchema.safeParse(categoryForm);

            if (!result.success) {
                result.error.issues.forEach((issue) => {
                    errors.value[String(issue.path[0])] = issue.message;
                });

                return;
            }

            await $fetch("/api/business/services", {
                method: "POST",
                body: {
                    action:
                        slideOverMode.value === "add"
                            ? "createCategory"
                            : "updateCategory",
                    id: selectedItem.value?.id,
                    data: {
                        ...categoryForm,
                        venueId: selectedVenueId.value,
                    },
                },
            });
        } else {
            const result = serviceSchema.safeParse(serviceForm);

            if (!result.success) {
                result.error.issues.forEach((issue) => {
                    errors.value[String(issue.path[0])] = issue.message;
                });

                return;
            }

            await $fetch("/api/business/services", {
                method: "POST",
                body: {
                    action:
                        slideOverMode.value === "add"
                            ? "createService"
                            : "updateService",
                    id: selectedItem.value?.id,
                    data: serviceForm,
                },
            });
        }

        await refresh();
        showSlideOver.value = false;
    } catch (err: any) {
        console.error(err);

        alert(err.data?.message || err.message || "Operation failed");
    } finally {
        isSubmitting.value = false;
    }
};

const handleDelete = async (type: "category" | "service", id: string) => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) {
        return;
    }

    try {
        await $fetch("/api/business/services", {
            method: "POST",
            body: {
                action:
                    type === "category" ? "deleteCategory" : "deleteService",
                id,
            },
        });

        await refresh();
    } catch (err: any) {
        alert(err.message);
    }
};
</script>

<template>
    <div class="space-y-8 pb-12">
        <div
            class="flex flex-col gap-5 border-b border-slate-200 pb-7 md:flex-row md:items-end md:justify-between"
        >
            <div>
                <div
                    class="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400"
                >
                    Business Operations
                </div>

                <h1
                    class="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl"
                >
                    Services
                </h1>

                <p class="mt-1.5 text-sm text-slate-500">
                    Manage your services, pricing and service categories.
                </p>
            </div>

            <div class="flex flex-wrap items-center gap-2">
                <div v-if="venues.length > 1" class="relative">
                    <select
                        v-model="selectedVenueId"
                        class="h-10 appearance-none border border-slate-200 bg-white pl-3 pr-9 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-600 outline-none transition-colors focus:border-primary/30"
                    >
                        <option
                            v-for="venue in venues"
                            :key="venue.id"
                            :value="venue.id"
                        >
                            {{ venue.name }}
                        </option>
                    </select>

                    <ChevronDown
                        class="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"
                    />
                </div>

                <button
                    type="button"
                    class="inline-flex h-10 items-center gap-2 border border-slate-200 bg-white px-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
                    @click="openCategoryForm()"
                >
                    <Plus class="h-3.5 w-3.5" />
                    Add Category
                </button>

                <button
                    type="button"
                    class="inline-flex h-10 items-center gap-2 bg-primary px-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-slate-900"
                    @click="openServiceForm()"
                >
                    <Plus class="h-3.5 w-3.5" />
                    New Service
                </button>
            </div>
        </div>

        <div v-if="pending" class="space-y-5">
            <div
                v-for="i in 2"
                :key="i"
                class="animate-pulse border border-slate-200 bg-white"
            >
                <div class="border-b border-slate-200 px-6 py-5">
                    <div class="h-4 w-36 bg-slate-100" />
                    <div class="mt-2 h-3 w-20 bg-slate-100" />
                </div>

                <div class="divide-y divide-slate-100">
                    <div
                        v-for="j in 2"
                        :key="j"
                        class="flex items-center gap-5 px-6 py-6"
                    >
                        <div class="h-9 w-9 bg-slate-100" />

                        <div class="flex-1">
                            <div class="h-3 w-32 bg-slate-100" />
                            <div class="mt-2 h-2.5 w-64 bg-slate-100" />
                        </div>

                        <div class="h-7 w-16 bg-slate-100" />
                    </div>
                </div>
            </div>
        </div>

        <div
            v-else-if="categories.length === 0"
            class="flex min-h-[420px] flex-col items-center justify-center border border-slate-200 bg-white px-6 text-center"
        >
            <div
                class="mb-5 flex h-12 w-12 items-center justify-center border border-slate-200 bg-slate-50"
            >
                <Scissors class="h-5 w-5 text-slate-300" />
            </div>

            <h3 class="text-sm font-semibold text-slate-900">
                No services yet
            </h3>

            <p class="mt-1 max-w-sm text-xs leading-relaxed text-slate-400">
                Create a service category and add your first service to make it
                available to customers.
            </p>

            <button
                type="button"
                class="mt-5 inline-flex h-10 items-center gap-2 bg-primary px-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-slate-900"
                @click="openCategoryForm()"
            >
                <Plus class="h-3.5 w-3.5" />
                Add Category
            </button>
        </div>

        <div v-else class="space-y-5">
            <section
                v-for="category in categories"
                :key="category.id"
                class="overflow-hidden border border-slate-200 bg-white"
            >
                <div
                    class="flex items-center justify-between border-b border-slate-200 bg-slate-50/60 px-4 py-4 sm:px-6"
                >
                    <div class="flex min-w-0 items-center gap-3">
                        <div
                            class="flex h-9 w-9 shrink-0 items-center justify-center border border-slate-200 bg-white text-slate-400"
                        >
                            <Layers class="h-4 w-4" />
                        </div>

                        <div class="min-w-0">
                            <h2
                                class="truncate text-sm font-semibold text-slate-950"
                            >
                                {{ category.name }}
                            </h2>

                            <p
                                class="mt-0.5 text-[10px] uppercase tracking-[0.1em] text-slate-400"
                            >
                                {{ category.services.length }}
                                {{
                                    category.services.length === 1
                                        ? "service"
                                        : "services"
                                }}
                            </p>
                        </div>
                    </div>

                    <div class="flex items-center gap-1">
                        <button
                            type="button"
                            class="flex h-8 w-8 items-center justify-center border border-transparent text-slate-400 transition-colors hover:border-slate-200 hover:bg-white hover:text-slate-900"
                            title="Edit category"
                            @click="openCategoryForm(category)"
                        >
                            <Edit2 class="h-3.5 w-3.5" />
                        </button>

                        <button
                            type="button"
                            class="flex h-8 w-8 items-center justify-center border border-transparent text-slate-400 transition-colors hover:border-rose-100 hover:bg-rose-50 hover:text-rose-600"
                            title="Delete category"
                            @click="handleDelete('category', category.id)"
                        >
                            <Trash2 class="h-3.5 w-3.5" />
                        </button>
                    </div>
                </div>

                <div
                    v-if="category.services.length"
                    class="divide-y divide-slate-100"
                >
                    <div
                        v-for="service in category.services"
                        :key="service.id"
                        class="group flex flex-col gap-4 px-4 py-5 transition-colors hover:bg-slate-50/60 sm:flex-row sm:items-center sm:px-6"
                    >
                        <div class="flex min-w-0 flex-1 items-start gap-4">
                            <div
                                class="flex h-9 w-9 shrink-0 items-center justify-center border border-slate-200 bg-slate-50 text-slate-400"
                            >
                                <Scissors class="h-4 w-4" />
                            </div>

                            <div class="min-w-0">
                                <div class="flex flex-wrap items-center gap-2">
                                    <h3
                                        class="text-sm font-semibold text-slate-900 transition-colors group-hover:text-primary"
                                    >
                                        {{ service.name }}
                                    </h3>

                                    <span
                                        class="border border-slate-200 bg-slate-50 px-2 py-1 text-[9px] font-semibold text-slate-700"
                                    >
                                        R{{
                                            Number(
                                                service.price,
                                            ).toLocaleString()
                                        }}
                                    </span>
                                </div>

                                <p
                                    class="mt-1 max-w-2xl truncate text-xs text-slate-400"
                                >
                                    {{
                                        service.description ||
                                        "No service description provided."
                                    }}
                                </p>
                            </div>
                        </div>

                        <div
                            class="flex items-center justify-between gap-4 sm:justify-end"
                        >
                            <div
                                class="flex items-center gap-2 text-[10px] font-medium text-slate-500"
                            >
                                <Clock class="h-3.5 w-3.5 text-slate-400" />
                                {{ service.durationMinutes }}
                                mins
                            </div>

                            <div class="flex items-center gap-1">
                                <button
                                    type="button"
                                    class="flex h-8 w-8 items-center justify-center border border-transparent text-slate-400 transition-colors hover:border-slate-200 hover:bg-white hover:text-slate-900"
                                    title="Edit service"
                                    @click="openServiceForm(service)"
                                >
                                    <Edit2 class="h-3.5 w-3.5" />
                                </button>

                                <button
                                    type="button"
                                    class="flex h-8 w-8 items-center justify-center border border-transparent text-slate-400 transition-colors hover:border-rose-100 hover:bg-rose-50 hover:text-rose-600"
                                    title="Delete service"
                                    @click="handleDelete('service', service.id)"
                                >
                                    <Trash2 class="h-3.5 w-3.5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-else class="px-6 py-8 text-center">
                    <p class="text-xs text-slate-400">
                        No services in this category.
                    </p>
                </div>

                <button
                    type="button"
                    class="flex w-full items-center gap-3 border-t border-slate-100 px-4 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400 transition-colors hover:bg-slate-50 hover:text-primary sm:px-6"
                    @click="openServiceForm(undefined, category.id)"
                >
                    <span
                        class="flex h-7 w-7 items-center justify-center border border-slate-200 bg-white"
                    >
                        <Plus class="h-3.5 w-3.5" />
                    </span>

                    Add service to {{ category.name }}

                    <ChevronRight class="ml-auto h-3.5 w-3.5 text-slate-300" />
                </button>
            </section>
        </div>

        <UiSlideover
            :show="showSlideOver"
            :title="
                slideOverMode === 'add'
                    ? `New ${
                          slideOverType === 'category' ? 'Category' : 'Service'
                      }`
                    : `Edit ${
                          slideOverType === 'category' ? 'Category' : 'Service'
                      }`
            "
            @close="showSlideOver = false"
        >
            <div class="space-y-6">
                <div v-if="slideOverType === 'category'" class="space-y-6">
                    <div class="space-y-2">
                        <label
                            class="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400"
                        >
                            Category Name
                        </label>

                        <input
                            v-model="categoryForm.name"
                            type="text"
                            placeholder="e.g. Hair Services"
                            class="h-11 w-full border bg-white px-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-primary/30"
                            :class="
                                errors.name
                                    ? 'border-rose-200 bg-rose-50/20'
                                    : 'border-slate-200'
                            "
                        />

                        <p
                            v-if="errors.name"
                            class="flex items-center gap-1 text-[10px] text-rose-600"
                        >
                            <AlertCircle class="h-3 w-3" />
                            {{ errors.name }}
                        </p>
                    </div>

                    <div class="border border-slate-200 bg-slate-50 p-4">
                        <p class="text-xs leading-relaxed text-slate-500">
                            Categories help organize your services and make them
                            easier for customers to discover.
                        </p>
                    </div>
                </div>

                <div v-else class="space-y-6">
                    <div class="space-y-2">
                        <label
                            class="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400"
                        >
                            Service Name
                        </label>

                        <input
                            v-model="serviceForm.name"
                            type="text"
                            placeholder="e.g. Deep Tissue Massage"
                            class="h-11 w-full border bg-white px-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-primary/30"
                            :class="
                                errors.name
                                    ? 'border-rose-200 bg-rose-50/20'
                                    : 'border-slate-200'
                            "
                        />

                        <p
                            v-if="errors.name"
                            class="flex items-center gap-1 text-[10px] text-rose-600"
                        >
                            <AlertCircle class="h-3 w-3" />
                            {{ errors.name }}
                        </p>
                    </div>

                    <div class="space-y-2">
                        <label
                            class="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400"
                        >
                            Description
                        </label>

                        <textarea
                            v-model="serviceForm.description"
                            rows="4"
                            placeholder="Describe this service..."
                            class="w-full resize-none border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-primary/30"
                        />
                    </div>

                    <div class="grid grid-cols-2 gap-3">
                        <div class="space-y-2">
                            <label
                                class="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400"
                            >
                                Duration
                            </label>

                            <div class="relative">
                                <input
                                    v-model.number="serviceForm.durationMinutes"
                                    type="number"
                                    min="1"
                                    class="h-11 w-full border border-slate-200 bg-white px-3 pr-12 text-sm text-slate-900 outline-none focus:border-primary/30"
                                />

                                <span
                                    class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400"
                                >
                                    MIN
                                </span>
                            </div>

                            <p
                                v-if="errors.durationMinutes"
                                class="text-[10px] text-rose-600"
                            >
                                {{ errors.durationMinutes }}
                            </p>
                        </div>

                        <div class="space-y-2">
                            <label
                                class="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400"
                            >
                                Price
                            </label>

                            <div class="relative">
                                <span
                                    class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400"
                                >
                                    R
                                </span>

                                <input
                                    v-model.number="serviceForm.price"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    class="h-11 w-full border border-slate-200 bg-white pl-7 pr-3 text-sm text-slate-900 outline-none focus:border-primary/30"
                                />
                            </div>

                            <p
                                v-if="errors.price"
                                class="text-[10px] text-rose-600"
                            >
                                {{ errors.price }}
                            </p>
                        </div>
                    </div>

                    <div class="space-y-2">
                        <label
                            class="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400"
                        >
                            Category
                        </label>

                        <div class="relative">
                            <select
                                v-model="serviceForm.serviceCategoryId"
                                class="h-11 w-full appearance-none border border-slate-200 bg-white px-3 pr-9 text-xs text-slate-900 outline-none focus:border-primary/30"
                            >
                                <option
                                    v-for="category in categories"
                                    :key="category.id"
                                    :value="category.id"
                                >
                                    {{ category.name }}
                                </option>
                            </select>

                            <ChevronDown
                                class="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"
                            />
                        </div>

                        <p
                            v-if="errors.serviceCategoryId"
                            class="text-[10px] text-rose-600"
                        >
                            {{ errors.serviceCategoryId }}
                        </p>
                    </div>
                </div>
            </div>

            <template #footer>
                <div class="flex gap-3 border-t border-slate-200 p-6">
                    <UiButton
                        label="Cancel"
                        type="outline"
                        class="flex-1 !py-3"
                        :disabled="isSubmitting"
                        @click="showSlideOver = false"
                    />

                    <UiButton
                        :label="
                            slideOverMode === 'add' ? 'Create' : 'Save Changes'
                        "
                        :loading="isSubmitting"
                        class="flex-[2] !py-3"
                        @click="handleSubmit"
                    />
                </div>
            </template>
        </UiSlideover>
    </div>
</template>
