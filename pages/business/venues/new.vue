<script setup lang="ts">
import {
    Save,
    ArrowLeft,
    Info,
    MapPin,
    Phone,
    Settings as SettingsIcon,
    Loader2,
    Check,
    AlertCircle
} from "lucide-vue-next";

definePageMeta({
    layout: "business",
    middleware: "auth",
});

const { data: categoriesResponse } = await useFetch("/api/categories");
const categories = computed(() => categoriesResponse.value?.data || []);

const { data: communitiesResponse } = await useFetch("/api/communities");
const communities = computed(() => communitiesResponse.value || []);

const form = ref({
    name: "",
    slug: "",
    tagline: "",
    description: "",
    categoryId: "",
    communityId: "",
    address: {
        street: "",
        suburb: "",
        city: "",
        region: "",
        postalCode: "",
    },
    contact: {
        phone: "",
        whatsapp: "",
        email: "",
        website: "",
        instagram: "",
        facebook: "",
    },
    bookingConfig: {
        instantConfirmation: true,
        requiresDeposit: false,
        depositPercentage: 0,
        cancellationPolicy: "",
        minimumNoticeMinutes: 60,
    }
});

const saving = ref(false);
const error = ref<string | null>(null);

const updateSlug = () => {
    form.value.slug = form.value.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
};

const handleCreate = async () => {
    if (saving.value) return;
    saving.value = true;
    error.value = null;

    try {
        const venue = await $fetch("/api/business/venues", {
            method: "POST",
            body: form.value,
        });

        // After creation, redirect to settings to complete hours/media
        await navigateTo("/business/settings");
    } catch (err: any) {
        error.value = err.data?.statusMessage || err.data?.message || "Failed to create business venue.";
    } finally {
        saving.value = false;
    }
};
</script>

<template>
    <div class="mx-auto max-w-4xl space-y-8 pb-20">
        <!-- Header -->
        <div class="flex flex-col gap-5 border-b border-slate-200 pb-7 sm:flex-row sm:items-end sm:justify-between">
            <div>
                <NuxtLink
                    to="/business/settings"
                    class="mb-4 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 transition-colors hover:text-primary"
                >
                    <ArrowLeft class="h-3 w-3" />
                    Back to settings
                </NuxtLink>

                <h1 class="text-3xl font-bold tracking-tight text-slate-950">
                    Register New Venue
                </h1>

                <p class="mt-1.5 text-sm text-slate-500">
                    List your business venue to start receiving bookings.
                </p>
            </div>

            <button
                type="button"
                :disabled="saving"
                class="inline-flex h-11 items-center gap-2 bg-primary px-6 text-xs font-semibold uppercase tracking-widest text-white transition-all hover:bg-slate-900 disabled:opacity-50"
                @click="handleCreate"
            >
                <Loader2 v-if="saving" class="h-4 w-4 animate-spin" />
                <Save v-else class="h-4 w-4" />
                {{ saving ? 'Creating...' : 'Create Venue' }}
            </button>
        </div>

        <div v-if="error" class="flex items-center gap-3 border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            <AlertCircle class="h-4 w-4" />
            <span class="text-xs font-medium">{{ error }}</span>
        </div>

        <!-- Form Sections -->
        <div class="space-y-6">
            <!-- General Info -->
            <section class="border border-slate-200 bg-white shadow-sm">
                <div class="flex items-center gap-3 border-b border-slate-100 px-6 py-4 bg-slate-50/50">
                    <Info class="h-4 w-4 text-primary" />
                    <h2 class="text-sm font-semibold text-slate-900">General Information</h2>
                </div>

                <div class="p-6 space-y-6">
                    <div class="grid gap-6 sm:grid-cols-2">
                        <div class="space-y-1.5">
                            <label class="text-xs font-semibold text-slate-700">Business Name</label>
                            <input
                                v-model="form.name"
                                type="text"
                                required
                                placeholder="e.g. The Wellness Studio"
                                class="h-10 w-full border border-slate-200 px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                                @input="updateSlug"
                            />
                        </div>

                        <div class="space-y-1.5">
                            <label class="text-xs font-semibold text-slate-700">Category</label>
                            <select
                                v-model="form.categoryId"
                                required
                                class="h-10 w-full border border-slate-200 bg-white px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                            >
                                <option value="">Select Category</option>
                                <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                            </select>
                        </div>

                        <div class="space-y-1.5">
                            <label class="text-xs font-semibold text-slate-700">Community (Optional)</label>
                            <select
                                v-model="form.communityId"
                                class="h-10 w-full border border-slate-200 bg-white px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                            >
                                <option value="">No Community</option>
                                <option v-for="comm in communities" :key="comm.id" :value="comm.id">{{ comm.name }}</option>
                            </select>
                        </div>
                    </div>

                    <div class="space-y-1.5">
                        <label class="text-xs font-semibold text-slate-700">URL Slug</label>
                        <input
                            v-model="form.slug"
                            type="text"
                            required
                            placeholder="wellness-studio"
                            class="h-10 w-full border border-slate-200 bg-slate-50 px-3 font-mono text-sm outline-none focus:border-primary"
                        />
                    </div>

                    <div class="space-y-1.5">
                        <label class="text-xs font-semibold text-slate-700">Tagline</label>
                        <input
                            v-model="form.tagline"
                            type="text"
                            placeholder="A short catchphrase for your business"
                            class="h-10 w-full border border-slate-200 px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                        />
                    </div>

                    <div class="space-y-1.5">
                        <label class="text-xs font-semibold text-slate-700">Description</label>
                        <textarea
                            v-model="form.description"
                            rows="4"
                            placeholder="Describe your services and what makes your business unique..."
                            class="w-full resize-none border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                        />
                    </div>
                </div>
            </section>

            <!-- Location -->
            <section class="border border-slate-200 bg-white shadow-sm">
                <div class="flex items-center gap-3 border-b border-slate-100 px-6 py-4 bg-slate-50/50">
                    <MapPin class="h-4 w-4 text-primary" />
                    <h2 class="text-sm font-semibold text-slate-900">Location Details</h2>
                </div>

                <div class="p-6 space-y-6">
                    <div class="space-y-1.5">
                        <label class="text-xs font-semibold text-slate-700">Street Address</label>
                        <input
                            v-model="form.address.street"
                            type="text"
                            required
                            class="h-10 w-full border border-slate-200 px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                        />
                    </div>

                    <div class="grid gap-6 sm:grid-cols-2">
                        <div class="space-y-1.5">
                            <label class="text-xs font-semibold text-slate-700">Suburb</label>
                            <input
                                v-model="form.address.suburb"
                                type="text"
                                required
                                class="h-10 w-full border border-slate-200 px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                            />
                        </div>

                        <div class="space-y-1.5">
                            <label class="text-xs font-semibold text-slate-700">City</label>
                            <input
                                v-model="form.address.city"
                                type="text"
                                required
                                class="h-10 w-full border border-slate-200 px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                            />
                        </div>

                        <div class="space-y-1.5">
                            <label class="text-xs font-semibold text-slate-700">Region / Province</label>
                            <input
                                v-model="form.address.region"
                                type="text"
                                required
                                class="h-10 w-full border border-slate-200 px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                            />
                        </div>

                        <div class="space-y-1.5">
                            <label class="text-xs font-semibold text-slate-700">Postal Code</label>
                            <input
                                v-model="form.address.postalCode"
                                type="text"
                                required
                                class="h-10 w-full border border-slate-200 px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                            />
                        </div>
                    </div>
                </div>
            </section>

            <!-- Contact -->
            <section class="border border-slate-200 bg-white shadow-sm">
                <div class="flex items-center gap-3 border-b border-slate-100 px-6 py-4 bg-slate-50/50">
                    <Phone class="h-4 w-4 text-primary" />
                    <h2 class="text-sm font-semibold text-slate-900">Contact Information</h2>
                </div>

                <div class="p-6 space-y-6">
                    <div class="grid gap-6 sm:grid-cols-2">
                        <div class="space-y-1.5">
                            <label class="text-xs font-semibold text-slate-700">Email Address</label>
                            <input
                                v-model="form.contact.email"
                                type="email"
                                required
                                class="h-10 w-full border border-slate-200 px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                            />
                        </div>

                        <div class="space-y-1.5">
                            <label class="text-xs font-semibold text-slate-700">Phone Number</label>
                            <input
                                v-model="form.contact.phone"
                                type="tel"
                                required
                                class="h-10 w-full border border-slate-200 px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                            />
                        </div>
                    </div>
                </div>
            </section>
        </div>

        <div class="flex items-center justify-end gap-4 border-t border-slate-200 pt-8">
            <NuxtLink
                to="/business/settings"
                class="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900"
            >
                Cancel
            </NuxtLink>

            <button
                type="button"
                :disabled="saving"
                class="inline-flex h-12 items-center gap-2 bg-slate-950 px-8 text-xs font-bold uppercase tracking-[0.2em] text-white transition-all hover:bg-primary disabled:opacity-50 shadow-xl shadow-slate-900/10"
                @click="handleCreate"
            >
                <Loader2 v-if="saving" class="h-4 w-4 animate-spin" />
                {{ saving ? 'Creating...' : 'Register Venue' }}
            </button>
        </div>
    </div>
</template>
