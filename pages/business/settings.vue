<script setup lang="ts">
import {
    Camera,
    MapPin,
    Phone,
    Globe,
    Clock,
    CreditCard,
    Save,
    Info,
    Mail,
    Instagram,
    Facebook,
    MessageCircle,
    Plus,
    Trash2,
    Loader2,
    Image as ImageIcon,
    Check,
    ChevronRight,
    ChevronDown,
    AlertCircle,
    ShieldCheck,
    Settings as SettingsIcon,
} from "lucide-vue-next";

definePageMeta({
    layout: "business",
    middleware: "auth",
});

const {
    data: venuesResponse,
    refresh: refreshVenues,
    pending: loadingVenues,
} = await useFetch("/api/business/venues");

const { data: categoriesResponse } = await useFetch("/api/categories");
const { data: communitiesResponse } = await useFetch("/api/communities");

const venues = computed(() => venuesResponse.value?.data || []);
const categories = computed(() => categoriesResponse.value?.data || []);
const communities = computed(() => communitiesResponse.value || []);

const selectedVenueId = ref<string | null>(null);

watchEffect(() => {
    if (venues.value.length > 0 && !selectedVenueId.value) {
        selectedVenueId.value = venues.value[0].id;
    }
});

const venue = computed(() =>
    venues.value.find((v: any) => v.id === selectedVenueId.value),
);

const form = ref({
    name: "",
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
    },
    schedules: [] as any[],
});

const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];

watch(
    venue,
    (newVenue) => {
        if (newVenue) {
            form.value = {
                name: newVenue.name || "",
                tagline: newVenue.tagline || "",
                description: newVenue.description || "",
                categoryId: newVenue.categoryId || "",
                communityId: newVenue.communityId || "",
                address: {
                    street: newVenue.address?.street || "",
                    suburb: newVenue.address?.suburb || "",
                    city: newVenue.address?.city || "",
                    region: newVenue.address?.region || "",
                    postalCode: newVenue.address?.postalCode || "",
                },
                contact: {
                    phone: newVenue.contact?.phone || "",
                    whatsapp: newVenue.contact?.whatsapp || "",
                    email: newVenue.contact?.email || "",
                    website: newVenue.contact?.website || "",
                    instagram: newVenue.contact?.instagram || "",
                    facebook: newVenue.contact?.facebook || "",
                },
                bookingConfig: {
                    instantConfirmation:
                        newVenue.bookingConfig?.instantConfirmation ?? true,
                    requiresDeposit:
                        newVenue.bookingConfig?.requiresDeposit ?? false,
                    depositPercentage:
                        newVenue.bookingConfig?.depositPercentage || 0,
                    cancellationPolicy:
                        newVenue.bookingConfig?.cancellationPolicy || "",
                    minimumNoticeMinutes:
                        newVenue.bookingConfig?.minimumNoticeMinutes || 60,
                },
                schedules: days.map((_, index) => {
                    const existing = newVenue.schedules?.find(
                        (s: any) => s.day === index,
                    );

                    return existing
                        ? { ...existing }
                        : {
                              day: index,
                              opens: "09:00",
                              closes: "17:00",
                              closed: false,
                          };
                }),
            };
        }
    },
    { immediate: true },
);

const activeTab = ref("general");

const tabs = [
    {
        id: "general",
        label: "Business Details",
        icon: Info,
    },
    {
        id: "location",
        label: "Location",
        icon: MapPin,
    },
    {
        id: "contact",
        label: "Contact",
        icon: Phone,
    },
    {
        id: "hours",
        label: "Opening Hours",
        icon: Clock,
    },
    {
        id: "booking",
        label: "Booking Settings",
        icon: CreditCard,
    },
    {
        id: "media",
        label: "Media",
        icon: ImageIcon,
    },
];

const saving = ref(false);

const saveStatus = ref<{
    type: "success" | "error";
    message: string;
} | null>(null);

const handleSave = async () => {
    if (!selectedVenueId.value || saving.value) return;

    saving.value = true;
    saveStatus.value = null;

    try {
        await $fetch(`/api/business/venues/${selectedVenueId.value}`, {
            method: "PATCH",
            body: form.value,
        });

        await refreshVenues();

        saveStatus.value = {
            type: "success",
            message: "Business settings saved successfully.",
        };

        setTimeout(() => {
            saveStatus.value = null;
        }, 4000);
    } catch (error: any) {
        saveStatus.value = {
            type: "error",
            message: error.data?.message || "Failed to save business settings.",
        };
    } finally {
        saving.value = false;
    }
};

const uploading = ref(false);

const handleLogoUpload = async (event: Event) => {
    const target = event.target as HTMLInputElement;

    if (target.files && target.files[0] && selectedVenueId.value) {
        uploading.value = true;

        const formData = new FormData();

        formData.append("file", target.files[0]);
        formData.append("venueId", selectedVenueId.value);
        formData.append("entityType", "VENUE");
        formData.append("category", "LOGO");

        try {
            await $fetch("/api/media/upload", {
                method: "POST",
                body: formData,
            });

            await refreshVenues();
        } catch (error) {
            console.error(error);
        } finally {
            uploading.value = false;
            target.value = "";
        }
    }
};

const handleGalleryUpload = async (event: Event) => {
    const target = event.target as HTMLInputElement;

    if (!target.files || !selectedVenueId.value) return;

    uploading.value = true;

    for (let i = 0; i < target.files.length; i++) {
        const formData = new FormData();

        formData.append("file", target.files[i]);
        formData.append("venueId", selectedVenueId.value);
        formData.append("entityType", "VENUE");
        formData.append("category", "GALLERY");

        try {
            await $fetch("/api/media/upload", {
                method: "POST",
                body: formData,
            });
        } catch (error) {
            console.error(error);
        }
    }

    await refreshVenues();

    uploading.value = false;
    target.value = "";
};

const logoUrl = computed(() => {
    return venue.value?.media?.find((m: any) => m.category === "LOGO")?.url;
});

const galleryMedia = computed(() => {
    return (
        venue.value?.media?.filter((m: any) => m.category === "GALLERY") || []
    );
});

const removeMedia = async (id: string) => {
    try {
        await $fetch("/api/media/delete", {
            method: "DELETE",
            query: { id },
        });

        await refreshVenues();
    } catch (error) {
        console.error(error);
    }
};
</script>

<template>
    <div class="mx-auto max-w-7xl space-y-6 pb-10">
        <div
            class="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between"
        >
            <div>
                <div
                    class="mb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary"
                >
                    Business Management
                </div>

                <h1
                    class="text-2xl font-semibold tracking-tight text-slate-900"
                >
                    Settings
                </h1>

                <p class="mt-1 text-sm text-slate-500">
                    Manage your business information, availability, bookings and
                    media.
                </p>
            </div>

            <div class="flex items-center gap-2">
                <div v-if="venues.length > 1" class="relative">
                    <select
                        v-model="selectedVenueId"
                        class="h-10 appearance-none border border-slate-200 bg-white pl-3 pr-9 text-xs font-medium text-slate-700 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                    >
                        <option v-for="v in venues" :key="v.id" :value="v.id">
                            {{ v.name }}
                        </option>
                    </select>

                    <ChevronDown
                        class="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"
                    />
                </div>

                <button
                    type="button"
                    :disabled="saving"
                    class="inline-flex h-10 items-center gap-2 bg-primary px-4 text-xs font-semibold text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                    @click="handleSave"
                >
                    <Loader2 v-if="saving" class="h-3.5 w-3.5 animate-spin" />

                    <Save v-else class="h-3.5 w-3.5" />

                    {{ saving ? "Saving..." : "Save Changes" }}
                </button>
            </div>
        </div>

        <Transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="-translate-y-2 opacity-0"
            enter-to-class="translate-y-0 opacity-100"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
        >
            <div
                v-if="saveStatus"
                :class="[
                    'flex items-center gap-3 border px-4 py-3',
                    saveStatus.type === 'success'
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                        : 'border-red-200 bg-red-50 text-red-700',
                ]"
            >
                <Check v-if="saveStatus.type === 'success'" class="h-4 w-4" />

                <AlertCircle v-else class="h-4 w-4" />

                <span class="text-xs font-medium">
                    {{ saveStatus.message }}
                </span>
            </div>
        </Transition>

        <div v-if="loadingVenues" class="border border-slate-200 bg-white">
            <div class="divide-y divide-slate-100">
                <div
                    v-for="index in 5"
                    :key="index"
                    class="flex items-center gap-4 p-4"
                >
                    <div class="h-8 w-8 animate-pulse bg-slate-100" />

                    <div class="flex-1 space-y-2">
                        <div class="h-3 w-40 animate-pulse bg-slate-100" />
                        <div class="h-3 w-64 animate-pulse bg-slate-100" />
                    </div>
                </div>
            </div>
        </div>

        <div
            v-else-if="!venue"
            class="border border-dashed border-slate-300 bg-white px-6 py-16 text-center"
        >
            <div
                class="mx-auto flex h-12 w-12 items-center justify-center border border-slate-200 bg-slate-50"
            >
                <SettingsIcon class="h-5 w-5 text-slate-400" />
            </div>

            <h3 class="mt-4 text-sm font-semibold text-slate-900">
                No Business Found
            </h3>

            <p class="mx-auto mt-1 max-w-md text-xs leading-5 text-slate-500">
                You currently have no business venue configured.
            </p>

            <UiButton
                label="Add Business"
                to="/business/venues/new"
                class="mt-5"
            />
        </div>

        <div
            v-else
            class="grid grid-cols-1 gap-6 lg:grid-cols-[220px_minmax(0,1fr)]"
        >
            <aside class="h-fit border border-slate-200 bg-white">
                <div class="border-b border-slate-200 px-4 py-3">
                    <p
                        class="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400"
                    >
                        Settings
                    </p>
                </div>

                <div class="p-2">
                    <button
                        v-for="tab in tabs"
                        :key="tab.id"
                        type="button"
                        :class="[
                            'flex h-10 w-full items-center justify-between border px-3 text-left text-xs font-medium transition-colors',
                            activeTab === tab.id
                                ? 'border-primary/10 bg-primary/5 text-primary'
                                : 'border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                        ]"
                        @click="activeTab = tab.id"
                    >
                        <span class="flex items-center gap-2.5">
                            <component :is="tab.icon" class="h-3.5 w-3.5" />

                            {{ tab.label }}
                        </span>

                        <ChevronRight
                            v-if="activeTab === tab.id"
                            class="h-3.5 w-3.5"
                        />
                    </button>
                </div>
            </aside>

            <div class="min-w-0">
                <div
                    v-if="activeTab === 'general'"
                    class="border border-slate-200 bg-white"
                >
                    <div class="border-b border-slate-200 px-5 py-4">
                        <div class="flex items-center gap-2">
                            <SettingsIcon class="h-4 w-4 text-primary" />

                            <div>
                                <h2
                                    class="text-sm font-semibold text-slate-900"
                                >
                                    Business Details
                                </h2>

                                <p class="mt-0.5 text-xs text-slate-500">
                                    Your business name, category and public
                                    description.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="p-5">
                        <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <div class="space-y-1.5">
                                <label
                                    class="text-xs font-semibold text-slate-700"
                                >
                                    Business Name
                                </label>

                                <input
                                    v-model="form.name"
                                    type="text"
                                    class="h-10 w-full border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                                />
                            </div>

                            <div class="space-y-1.5">
                                <label
                                    class="text-xs font-semibold text-slate-700"
                                >
                                    Category
                                </label>

                                <select
                                    v-model="form.categoryId"
                                    class="h-10 w-full border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                                >
                                    <option value="">Select Category</option>

                                    <option
                                        v-for="cat in categories"
                                        :key="cat.id"
                                        :value="cat.id"
                                    >
                                        {{ cat.name }}
                                    </option>
                                </select>
                            </div>

                            <div class="space-y-1.5 md:col-span-2">
                                <label
                                    class="text-xs font-semibold text-slate-700"
                                >
                                    Tagline
                                </label>

                                <input
                                    v-model="form.tagline"
                                    type="text"
                                    placeholder="A short description of your business"
                                    class="h-10 w-full border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                                />
                            </div>

                            <div class="space-y-1.5 md:col-span-2">
                                <label
                                    class="text-xs font-semibold text-slate-700"
                                >
                                    Description
                                </label>

                                <textarea
                                    v-model="form.description"
                                    rows="6"
                                    placeholder="Tell customers about your business..."
                                    class="w-full resize-none border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                                />
                            </div>
                            <div class="space-y-1.5 md:col-span-2">
                                <label
                                    class="text-xs font-semibold text-slate-700"
                                >
                                    Community (Optional)
                                </label>

                                <select
                                    v-model="form.communityId"
                                    class="h-10 w-full border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                                >
                                    <option value="">No Community</option>

                                    <option
                                        v-for="comm in communities"
                                        :key="comm.id"
                                        :value="comm.id"
                                    >
                                        {{ comm.name }}
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    v-if="activeTab === 'location'"
                    class="border border-slate-200 bg-white"
                >
                    <div class="border-b border-slate-200 px-5 py-4">
                        <div class="flex items-center gap-2">
                            <MapPin class="h-4 w-4 text-primary" />

                            <div>
                                <h2
                                    class="text-sm font-semibold text-slate-900"
                                >
                                    Location
                                </h2>

                                <p class="mt-0.5 text-xs text-slate-500">
                                    Where customers can find your business.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="p-5">
                        <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <div class="space-y-1.5 md:col-span-2">
                                <label
                                    class="text-xs font-semibold text-slate-700"
                                >
                                    Street Address
                                </label>

                                <input
                                    v-model="form.address.street"
                                    type="text"
                                    class="h-10 w-full border border-slate-200 px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                                />
                            </div>

                            <div class="space-y-1.5">
                                <label
                                    class="text-xs font-semibold text-slate-700"
                                >
                                    Suburb
                                </label>

                                <input
                                    v-model="form.address.suburb"
                                    type="text"
                                    class="h-10 w-full border border-slate-200 px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                                />
                            </div>

                            <div class="space-y-1.5">
                                <label
                                    class="text-xs font-semibold text-slate-700"
                                >
                                    City
                                </label>

                                <input
                                    v-model="form.address.city"
                                    type="text"
                                    class="h-10 w-full border border-slate-200 px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                                />
                            </div>

                            <div class="space-y-1.5">
                                <label
                                    class="text-xs font-semibold text-slate-700"
                                >
                                    Province / Region
                                </label>

                                <input
                                    v-model="form.address.region"
                                    type="text"
                                    class="h-10 w-full border border-slate-200 px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                                />
                            </div>

                            <div class="space-y-1.5">
                                <label
                                    class="text-xs font-semibold text-slate-700"
                                >
                                    Postal Code
                                </label>

                                <input
                                    v-model="form.address.postalCode"
                                    type="text"
                                    class="h-10 w-full border border-slate-200 px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                                />
                            </div>
                            <div class="space-y-1.5 md:col-span-2">
                                <label
                                    class="text-xs font-semibold text-slate-700"
                                >
                                    Community (Optional)
                                </label>

                                <select
                                    v-model="form.communityId"
                                    class="h-10 w-full border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                                >
                                    <option value="">No Community</option>

                                    <option
                                        v-for="comm in communities"
                                        :key="comm.id"
                                        :value="comm.id"
                                    >
                                        {{ comm.name }}
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    v-if="activeTab === 'contact'"
                    class="border border-slate-200 bg-white"
                >
                    <div class="border-b border-slate-200 px-5 py-4">
                        <div class="flex items-center gap-2">
                            <Phone class="h-4 w-4 text-primary" />

                            <div>
                                <h2
                                    class="text-sm font-semibold text-slate-900"
                                >
                                    Contact Information
                                </h2>

                                <p class="mt-0.5 text-xs text-slate-500">
                                    Public contact details and social profiles.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="p-5">
                        <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <div class="space-y-1.5">
                                <label
                                    class="text-xs font-semibold text-slate-700"
                                >
                                    Email
                                </label>

                                <div class="relative">
                                    <Mail
                                        class="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"
                                    />

                                    <input
                                        v-model="form.contact.email"
                                        type="email"
                                        class="h-10 w-full border border-slate-200 pl-9 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                                    />
                                </div>
                            </div>

                            <div class="space-y-1.5">
                                <label
                                    class="text-xs font-semibold text-slate-700"
                                >
                                    Phone
                                </label>

                                <div class="relative">
                                    <Phone
                                        class="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"
                                    />

                                    <input
                                        v-model="form.contact.phone"
                                        type="tel"
                                        class="h-10 w-full border border-slate-200 pl-9 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                                    />
                                </div>
                            </div>

                            <div class="space-y-1.5">
                                <label
                                    class="text-xs font-semibold text-slate-700"
                                >
                                    WhatsApp
                                </label>

                                <div class="relative">
                                    <MessageCircle
                                        class="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"
                                    />

                                    <input
                                        v-model="form.contact.whatsapp"
                                        type="tel"
                                        class="h-10 w-full border border-slate-200 pl-9 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                                    />
                                </div>
                            </div>

                            <div class="space-y-1.5">
                                <label
                                    class="text-xs font-semibold text-slate-700"
                                >
                                    Website
                                </label>

                                <div class="relative">
                                    <Globe
                                        class="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"
                                    />

                                    <input
                                        v-model="form.contact.website"
                                        type="text"
                                        class="h-10 w-full border border-slate-200 pl-9 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                                    />
                                </div>
                            </div>

                            <div class="space-y-1.5">
                                <label
                                    class="text-xs font-semibold text-slate-700"
                                >
                                    Instagram
                                </label>

                                <div class="relative">
                                    <Instagram
                                        class="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"
                                    />

                                    <input
                                        v-model="form.contact.instagram"
                                        type="text"
                                        class="h-10 w-full border border-slate-200 pl-9 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                                    />
                                </div>
                            </div>

                            <div class="space-y-1.5">
                                <label
                                    class="text-xs font-semibold text-slate-700"
                                >
                                    Facebook
                                </label>

                                <div class="relative">
                                    <Facebook
                                        class="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"
                                    />

                                    <input
                                        v-model="form.contact.facebook"
                                        type="text"
                                        class="h-10 w-full border border-slate-200 pl-9 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                                    />
                                </div>
                            </div>
                            <div class="space-y-1.5 md:col-span-2">
                                <label
                                    class="text-xs font-semibold text-slate-700"
                                >
                                    Community (Optional)
                                </label>

                                <select
                                    v-model="form.communityId"
                                    class="h-10 w-full border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                                >
                                    <option value="">No Community</option>

                                    <option
                                        v-for="comm in communities"
                                        :key="comm.id"
                                        :value="comm.id"
                                    >
                                        {{ comm.name }}
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    v-if="activeTab === 'hours'"
                    class="border border-slate-200 bg-white"
                >
                    <div class="border-b border-slate-200 px-5 py-4">
                        <div class="flex items-center gap-2">
                            <Clock class="h-4 w-4 text-primary" />

                            <div>
                                <h2
                                    class="text-sm font-semibold text-slate-900"
                                >
                                    Opening Hours
                                </h2>

                                <p class="mt-0.5 text-xs text-slate-500">
                                    Set when your business is available for
                                    bookings.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="divide-y divide-slate-100">
                        <div
                            v-for="schedule in form.schedules"
                            :key="schedule.day"
                            class="flex flex-col gap-4 p-4 sm:flex-row sm:items-center"
                        >
                            <div class="w-28 shrink-0">
                                <p class="text-xs font-semibold text-slate-900">
                                    {{ days[schedule.day] }}
                                </p>
                            </div>

                            <div
                                v-if="!schedule.closed"
                                class="flex flex-1 flex-col gap-3 sm:flex-row sm:items-end"
                            >
                                <div class="space-y-1">
                                    <label
                                        class="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400"
                                    >
                                        Opens
                                    </label>

                                    <input
                                        v-model="schedule.opens"
                                        type="time"
                                        class="h-9 border border-slate-200 px-2.5 text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                                    />
                                </div>

                                <div
                                    class="hidden pb-2 text-xs text-slate-400 sm:block"
                                >
                                    to
                                </div>

                                <div class="space-y-1">
                                    <label
                                        class="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400"
                                    >
                                        Closes
                                    </label>

                                    <input
                                        v-model="schedule.closes"
                                        type="time"
                                        class="h-9 border border-slate-200 px-2.5 text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                                    />
                                </div>
                            </div>

                            <div v-else class="flex-1 text-xs text-slate-400">
                                Closed
                            </div>

                            <label
                                class="flex cursor-pointer items-center gap-2"
                            >
                                <input
                                    v-model="schedule.closed"
                                    type="checkbox"
                                    class="h-4 w-4 border-slate-300 text-primary focus:ring-primary"
                                />

                                <span
                                    class="text-xs font-medium text-slate-600"
                                >
                                    Closed
                                </span>
                            </label>
                            <div class="space-y-1.5 md:col-span-2">
                                <label
                                    class="text-xs font-semibold text-slate-700"
                                >
                                    Community (Optional)
                                </label>

                                <select
                                    v-model="form.communityId"
                                    class="h-10 w-full border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                                >
                                    <option value="">No Community</option>

                                    <option
                                        v-for="comm in communities"
                                        :key="comm.id"
                                        :value="comm.id"
                                    >
                                        {{ comm.name }}
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    v-if="activeTab === 'booking'"
                    class="border border-slate-200 bg-white"
                >
                    <div class="border-b border-slate-200 px-5 py-4">
                        <div class="flex items-center gap-2">
                            <ShieldCheck class="h-4 w-4 text-primary" />

                            <div>
                                <h2
                                    class="text-sm font-semibold text-slate-900"
                                >
                                    Booking Settings
                                </h2>

                                <p class="mt-0.5 text-xs text-slate-500">
                                    Control confirmation, deposits and
                                    cancellation rules.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="divide-y divide-slate-100">
                        <div
                            class="flex items-center justify-between gap-6 p-5"
                        >
                            <div>
                                <h3 class="text-sm font-medium text-slate-900">
                                    Instant Confirmation
                                </h3>

                                <p class="mt-1 text-xs text-slate-500">
                                    Automatically confirm incoming bookings.
                                </p>
                            </div>

                            <input
                                v-model="form.bookingConfig.instantConfirmation"
                                type="checkbox"
                                class="h-4 w-4 shrink-0 border-slate-300 text-primary focus:ring-primary"
                            />
                        </div>

                        <div
                            class="flex items-center justify-between gap-6 p-5"
                        >
                            <div>
                                <h3 class="text-sm font-medium text-slate-900">
                                    Require Deposit
                                </h3>

                                <p class="mt-1 text-xs text-slate-500">
                                    Require customers to pay a deposit when
                                    booking.
                                </p>
                            </div>

                            <input
                                v-model="form.bookingConfig.requiresDeposit"
                                type="checkbox"
                                class="h-4 w-4 shrink-0 border-slate-300 text-primary focus:ring-primary"
                            />
                        </div>

                        <div
                            v-if="form.bookingConfig.requiresDeposit"
                            class="bg-slate-50/70 p-5"
                        >
                            <label class="text-xs font-semibold text-slate-700">
                                Deposit Percentage
                            </label>

                            <div class="mt-3 flex items-center gap-4">
                                <input
                                    v-model.number="
                                        form.bookingConfig.depositPercentage
                                    "
                                    type="range"
                                    min="0"
                                    max="100"
                                    class="flex-1 accent-primary"
                                />

                                <div
                                    class="flex h-9 w-16 items-center justify-center border border-slate-200 bg-white text-sm font-semibold text-slate-900"
                                >
                                    {{ form.bookingConfig.depositPercentage }}%
                                </div>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 gap-5 p-5">
                            <div class="space-y-1.5">
                                <label
                                    class="text-xs font-semibold text-slate-700"
                                >
                                    Minimum Notice
                                </label>

                                <div class="flex items-center gap-2">
                                    <input
                                        v-model.number="
                                            form.bookingConfig
                                                .minimumNoticeMinutes
                                        "
                                        type="number"
                                        min="0"
                                        class="h-10 w-40 border border-slate-200 px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                                    />

                                    <span class="text-xs text-slate-500">
                                        minutes
                                    </span>
                                </div>

                                <p class="text-[11px] text-slate-400">
                                    Minimum time required before a customer can
                                    make a booking.
                                </p>
                            </div>

                            <div class="space-y-1.5">
                                <label
                                    class="text-xs font-semibold text-slate-700"
                                >
                                    Cancellation Policy
                                </label>

                                <textarea
                                    v-model="
                                        form.bookingConfig.cancellationPolicy
                                    "
                                    rows="4"
                                    placeholder="Explain your cancellation policy..."
                                    class="w-full resize-none border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                                />
                            </div>
                            <div class="space-y-1.5 md:col-span-2">
                                <label
                                    class="text-xs font-semibold text-slate-700"
                                >
                                    Community (Optional)
                                </label>

                                <select
                                    v-model="form.communityId"
                                    class="h-10 w-full border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                                >
                                    <option value="">No Community</option>

                                    <option
                                        v-for="comm in communities"
                                        :key="comm.id"
                                        :value="comm.id"
                                    >
                                        {{ comm.name }}
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="activeTab === 'media'" class="space-y-6">
                    <div class="border border-slate-200 bg-white">
                        <div
                            class="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                        >
                            <div>
                                <div class="flex items-center gap-2">
                                    <Camera class="h-4 w-4 text-primary" />

                                    <h2
                                        class="text-sm font-semibold text-slate-900"
                                    >
                                        Business Logo
                                    </h2>
                                </div>

                                <p class="mt-1 text-xs text-slate-500">
                                    Your primary business image shown across the
                                    platform.
                                </p>
                            </div>

                            <span
                                v-if="uploading"
                                class="flex items-center gap-1.5 text-[10px] font-medium text-primary"
                            >
                                <Loader2 class="h-3.5 w-3.5 animate-spin" />
                                Uploading...
                            </span>
                        </div>

                        <div class="p-5">
                            <div
                                class="flex flex-col gap-5 sm:flex-row sm:items-center"
                            >
                                <div
                                    class="relative h-28 w-28 shrink-0 overflow-hidden border border-slate-200 bg-slate-50"
                                >
                                    <img
                                        v-if="logoUrl"
                                        :src="logoUrl"
                                        alt="Business logo"
                                        class="h-full w-full object-cover"
                                    />

                                    <div
                                        v-else
                                        class="flex h-full w-full items-center justify-center text-slate-300"
                                    >
                                        <Camera class="h-7 w-7" />
                                    </div>

                                    <label
                                        class="absolute bottom-2 right-2 flex h-7 w-7 cursor-pointer items-center justify-center bg-primary text-white shadow-sm hover:bg-primary/90"
                                    >
                                        <Plus class="h-3.5 w-3.5" />

                                        <input
                                            type="file"
                                            class="hidden"
                                            accept="image/*"
                                            @change="handleLogoUpload"
                                        />
                                    </label>
                                </div>

                                <div>
                                    <h3
                                        class="text-sm font-medium text-slate-900"
                                    >
                                        Update business logo
                                    </h3>

                                    <p
                                        class="mt-1 max-w-md text-xs leading-5 text-slate-500"
                                    >
                                        Use a clear square image. JPG, PNG and
                                        WEBP are supported.
                                    </p>

                                    <label
                                        class="mt-3 inline-flex cursor-pointer items-center gap-2 text-xs font-semibold text-primary hover:text-primary/80"
                                    >
                                        <Camera class="h-3.5 w-3.5" />
                                        Choose Image

                                        <input
                                            type="file"
                                            class="hidden"
                                            accept="image/*"
                                            @change="handleLogoUpload"
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="border border-slate-200 bg-white">
                        <div
                            class="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                        >
                            <div>
                                <div class="flex items-center gap-2">
                                    <ImageIcon class="h-4 w-4 text-primary" />

                                    <h2
                                        class="text-sm font-semibold text-slate-900"
                                    >
                                        Gallery
                                    </h2>
                                </div>

                                <p class="mt-1 text-xs text-slate-500">
                                    Add photos that showcase your business.
                                </p>
                            </div>

                            <label
                                class="inline-flex h-9 cursor-pointer items-center justify-center gap-2 bg-primary px-3 text-xs font-semibold text-white hover:bg-primary/90"
                            >
                                <Plus class="h-3.5 w-3.5" />
                                Add Photos

                                <input
                                    type="file"
                                    class="hidden"
                                    multiple
                                    accept="image/*"
                                    @change="handleGalleryUpload"
                                />
                            </label>
                        </div>

                        <div class="p-5">
                            <div
                                v-if="galleryMedia.length === 0"
                                class="border border-dashed border-slate-300 px-6 py-12 text-center"
                            >
                                <div
                                    class="mx-auto flex h-10 w-10 items-center justify-center border border-slate-200 bg-slate-50"
                                >
                                    <ImageIcon class="h-5 w-5 text-slate-300" />
                                </div>

                                <p
                                    class="mt-3 text-xs font-medium text-slate-500"
                                >
                                    No gallery images yet.
                                </p>

                                <p class="mt-1 text-[11px] text-slate-400">
                                    Add photos to help customers discover your
                                    business.
                                </p>
                            </div>

                            <div
                                v-else
                                class="grid grid-cols-2 gap-3 md:grid-cols-3"
                            >
                                <div
                                    v-for="item in galleryMedia"
                                    :key="item.id"
                                    class="group relative aspect-[4/3] overflow-hidden border border-slate-200 bg-slate-100"
                                >
                                    <img
                                        :src="item.url"
                                        alt=""
                                        class="h-full w-full object-cover"
                                    />

                                    <div
                                        class="absolute inset-0 flex items-end justify-end bg-gradient-to-t from-slate-900/50 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100"
                                    >
                                        <button
                                            type="button"
                                            class="flex h-8 w-8 items-center justify-center bg-white text-red-600 shadow-sm hover:bg-red-50"
                                            @click="removeMedia(item.id)"
                                        >
                                            <Trash2 class="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div class="space-y-1.5 md:col-span-2">
                                <label
                                    class="text-xs font-semibold text-slate-700"
                                >
                                    Community (Optional)
                                </label>

                                <select
                                    v-model="form.communityId"
                                    class="h-10 w-full border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                                >
                                    <option value="">No Community</option>

                                    <option
                                        v-for="comm in communities"
                                        :key="comm.id"
                                        :value="comm.id"
                                    >
                                        {{ comm.name }}
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
input[type="range"] {
    height: 5px;
    appearance: none;
    background: #e2e8f0;
}

input[type="range"]::-webkit-slider-thumb {
    appearance: none;
    width: 16px;
    height: 16px;
    background: #33689c;
    border: 2px solid white;
    border-radius: 50%;
    cursor: pointer;
}

input[type="range"]::-moz-range-thumb {
    width: 16px;
    height: 16px;
    background: #33689c;
    border: 2px solid white;
    border-radius: 50%;
    cursor: pointer;
}
</style>
