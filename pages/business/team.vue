<script setup lang="ts">
import {
    Plus,
    Star,
    MoreVertical,
    Settings,
    Clock,
    UserPlus,
    Trash2,
    Loader2,
    AlertCircle,
    Users,
    Mail,
    Phone,
} from "lucide-vue-next";

definePageMeta({
    layout: "business",
    middleware: "auth",
});

interface Employee {
    id: string;
    name: string;
    title: string | null;
    bio: string | null;
    imageUrl: string | null;
    venueId: string;
    status: string;
    schedules: EmployeeSchedule[];
    venue: {
        id: string;
        name: string;
    };
    _count: {
        reviews: number;
    };
}

interface EmployeeSchedule {
    id?: string;
    day: number;
    startTime: string | null;
    endTime: string | null;
    isWorking: boolean;
}

const {
    data: teamData,
    pending,
    refresh,
    error: fetchError,
} = useFetch("/api/business/team");
const { data: venuesData } = useFetch("/api/business/venues");

const team = computed<Employee[]>(() => teamData.value?.data || []);
const venues = computed(() => venuesData.value?.data || []);

const isSlideoverOpen = ref(false);
const isEditing = ref(false);
const submitting = ref(false);
const activeTab = ref<"details" | "schedule">("details");

const defaultForm = {
    id: "",
    name: "",
    title: "",
    bio: "",
    imageUrl: "",
    venueId: "",
};

const form = ref({ ...defaultForm });

const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];

const createDefaultSchedule = () =>
    Array.from({ length: 7 }, (_, i) => ({
        day: i,
        startTime: "09:00",
        endTime: "17:00",
        isWorking: true,
    }));

const schedule = ref<EmployeeSchedule[]>(createDefaultSchedule());

const openAddMember = () => {
    isEditing.value = false;
    form.value = { ...defaultForm };

    if (venues.value.length > 0) {
        form.value.venueId = venues.value[0].id;
    }

    schedule.value = createDefaultSchedule();
    activeTab.value = "details";
    isSlideoverOpen.value = true;
};

const openEditMember = (member: Employee) => {
    isEditing.value = true;

    form.value = {
        id: member.id,
        name: member.name,
        title: member.title || "",
        bio: member.bio || "",
        imageUrl: member.imageUrl || "",
        venueId: member.venueId,
    };

    const memberSchedules = member.schedules || [];

    schedule.value = Array.from({ length: 7 }, (_, i) => {
        const existing = memberSchedules.find((item) => item.day === i);

        return existing
            ? { ...existing }
            : {
                  day: i,
                  startTime: "09:00",
                  endTime: "17:00",
                  isWorking: false,
              };
    });

    activeTab.value = "details";
    isSlideoverOpen.value = true;
};

const openSchedule = (member: Employee) => {
    openEditMember(member);
    activeTab.value = "schedule";
};

const handleSave = async () => {
    submitting.value = true;

    try {
        const payload = {
            action: isEditing.value ? "update" : "create",
            id: isEditing.value ? form.value.id : undefined,
            venueId: !isEditing.value ? form.value.venueId : undefined,
            data: {
                name: form.value.name,
                title: form.value.title,
                bio: form.value.bio,
                imageUrl: form.value.imageUrl,
                schedules: schedule.value.map((item) => ({
                    day: item.day,
                    startTime: item.isWorking ? item.startTime : null,
                    endTime: item.isWorking ? item.endTime : null,
                    isWorking: item.isWorking,
                })),
            },
        };

        await $fetch("/api/business/team", {
            method: "POST",
            body: payload,
        });

        await refresh();
        isSlideoverOpen.value = false;
    } catch (err: any) {
        alert(err.data?.message || "Failed to save team member");
    } finally {
        submitting.value = false;
    }
};

const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this team member?")) return;

    try {
        await $fetch("/api/business/team", {
            method: "POST",
            body: {
                action: "delete",
                id,
            },
        });

        await refresh();
    } catch (err: any) {
        alert(err.data?.message || "Failed to delete team member");
    }
};

const handleUploaded = (media: any) => {
    form.value.imageUrl = media.url;
};

const getStatusColor = (status: string) => {
    switch (status) {
        case "active":
            return "bg-emerald-50 text-emerald-700 border-emerald-100";
        case "on_leave":
            return "bg-amber-50 text-amber-700 border-amber-100";
        case "inactive":
            return "bg-slate-50 text-slate-600 border-slate-200";
        default:
            return "bg-slate-50 text-slate-600 border-slate-200";
    }
};

const getStatusLabel = (status: string) => {
    return status.replace(/_/g, " ");
};
</script>

<template>
    <div class="mx-auto max-w-7xl space-y-6">
        <div
            class="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between"
        >
            <div>
                <div
                    class="mb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary"
                >
                    Business Operations
                </div>

                <h1
                    class="text-2xl font-semibold tracking-tight text-slate-900"
                >
                    Team
                </h1>

                <p class="mt-1 text-sm text-slate-500">
                    Manage your staff, roles and availability across your
                    venues.
                </p>
            </div>

            <UiButton
                label="Add Team Member"
                :icon="UserPlus"
                class="bg-primary text-white hover:bg-primary/90"
                @click="openAddMember"
            />
        </div>

        <div v-if="pending" class="border border-slate-200 bg-white">
            <div class="divide-y divide-slate-100">
                <div
                    v-for="index in 4"
                    :key="index"
                    class="flex items-center gap-4 p-4"
                >
                    <div
                        class="h-12 w-12 animate-pulse rounded-md bg-slate-100"
                    />

                    <div class="flex-1 space-y-2">
                        <div class="h-4 w-40 animate-pulse bg-slate-100" />
                        <div class="h-3 w-28 animate-pulse bg-slate-100" />
                    </div>

                    <div
                        class="hidden h-8 w-24 animate-pulse bg-slate-100 sm:block"
                    />
                    <div class="h-8 w-8 animate-pulse bg-slate-100" />
                </div>
            </div>
        </div>

        <div v-else-if="fetchError" class="border border-red-200 bg-red-50 p-6">
            <div class="flex items-start gap-3">
                <AlertCircle class="mt-0.5 h-5 w-5 shrink-0 text-red-500" />

                <div>
                    <h3 class="text-sm font-semibold text-red-900">
                        Failed to load team
                    </h3>

                    <p class="mt-1 text-sm text-red-600">
                        {{
                            fetchError.statusMessage ||
                            "An unexpected error occurred."
                        }}
                    </p>

                    <UiButton label="Try Again" class="mt-4" @click="refresh" />
                </div>
            </div>
        </div>

        <div
            v-else-if="team.length === 0"
            class="border border-dashed border-slate-300 bg-white px-6 py-16 text-center"
        >
            <div
                class="mx-auto flex h-12 w-12 items-center justify-center border border-slate-200 bg-slate-50 text-slate-400"
            >
                <Users class="h-5 w-5" />
            </div>

            <h3 class="mt-4 text-base font-semibold text-slate-900">
                No team members yet
            </h3>

            <p class="mx-auto mt-1 max-w-md text-sm text-slate-500">
                Add your first team member to start managing staff availability
                and schedules.
            </p>

            <UiButton
                label="Add Team Member"
                :icon="Plus"
                class="mt-5 bg-primary text-white hover:bg-primary/90"
                @click="openAddMember"
            />
        </div>

        <div v-else class="border border-slate-200 bg-white">
            <div
                class="flex items-center justify-between border-b border-slate-200 px-4 py-3"
            >
                <div>
                    <h2 class="text-sm font-semibold text-slate-900">
                        Team Members
                    </h2>

                    <p class="mt-0.5 text-xs text-slate-500">
                        {{ team.length }}
                        {{ team.length === 1 ? "member" : "members" }}
                    </p>
                </div>

                <button
                    type="button"
                    class="inline-flex items-center gap-2 border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    @click="openAddMember"
                >
                    <Plus class="h-3.5 w-3.5" />
                    Add Member
                </button>
            </div>

            <div class="divide-y divide-slate-100">
                <div
                    v-for="member in team"
                    :key="member.id"
                    class="group flex flex-col gap-4 p-4 transition-colors hover:bg-slate-50/60 lg:flex-row lg:items-center"
                >
                    <div class="flex min-w-0 flex-1 items-center gap-4">
                        <div
                            class="h-12 w-12 shrink-0 overflow-hidden border border-slate-200 bg-slate-100"
                        >
                            <img
                                v-if="member.imageUrl"
                                :src="member.imageUrl"
                                :alt="member.name"
                                class="h-full w-full object-cover"
                            />

                            <div
                                v-else
                                class="flex h-full w-full items-center justify-center text-sm font-semibold text-slate-500"
                            >
                                {{ member.name.charAt(0).toUpperCase() }}
                            </div>
                        </div>

                        <div class="min-w-0">
                            <div class="flex flex-wrap items-center gap-2">
                                <h3
                                    class="truncate text-sm font-semibold text-slate-900"
                                >
                                    {{ member.name }}
                                </h3>

                                <span
                                    :class="[
                                        'border px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em]',
                                        getStatusColor(member.status),
                                    ]"
                                >
                                    {{ getStatusLabel(member.status) }}
                                </span>
                            </div>

                            <p class="mt-0.5 text-xs text-slate-500">
                                {{ member.title || "Staff Member" }}
                            </p>

                            <div
                                class="mt-1.5 flex items-center gap-2 text-[11px] text-slate-400"
                            >
                                <span class="flex items-center gap-1">
                                    <Star
                                        class="h-3 w-3 fill-amber-400 text-amber-400"
                                    />
                                    4.0
                                </span>

                                <span class="text-slate-300">•</span>

                                <span>
                                    {{ member._count?.reviews || 0 }} reviews
                                </span>
                            </div>
                        </div>
                    </div>

                    <div class="hidden min-w-[180px] lg:block">
                        <p
                            class="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400"
                        >
                            Venue
                        </p>

                        <p
                            class="mt-1 truncate text-xs font-medium text-slate-700"
                        >
                            {{ member.venue?.name || "Unassigned" }}
                        </p>
                    </div>

                    <div class="hidden min-w-[130px] lg:block">
                        <p
                            class="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400"
                        >
                            Availability
                        </p>

                        <p class="mt-1 text-xs font-medium text-slate-700">
                            {{
                                member.schedules?.filter((s) => s.isWorking)
                                    .length || 0
                            }}
                            working days
                        </p>
                    </div>

                    <div class="flex items-center gap-2 lg:ml-auto">
                        <button
                            type="button"
                            class="inline-flex h-9 items-center gap-2 border border-slate-200 bg-white px-3 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-primary"
                            @click="openSchedule(member)"
                        >
                            <Clock class="h-3.5 w-3.5" />
                            Schedule
                        </button>

                        <button
                            type="button"
                            class="inline-flex h-9 items-center gap-2 border border-slate-200 bg-white px-3 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-primary"
                            @click="openEditMember(member)"
                        >
                            <Settings class="h-3.5 w-3.5" />
                            Edit
                        </button>

                        <div class="relative group/menu">
                            <button
                                type="button"
                                class="flex h-9 w-9 items-center justify-center border border-slate-200 bg-white text-slate-400 hover:bg-slate-50 hover:text-slate-700"
                            >
                                <MoreVertical class="h-4 w-4" />
                            </button>

                            <div
                                class="absolute right-0 top-full z-20 mt-1 hidden w-40 border border-slate-200 bg-white py-1 shadow-lg group-hover/menu:block"
                            >
                                <button
                                    type="button"
                                    class="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                    @click="openEditMember(member)"
                                >
                                    <Settings class="h-3.5 w-3.5" />
                                    Edit Details
                                </button>

                                <button
                                    type="button"
                                    class="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-medium text-red-600 hover:bg-red-50"
                                    @click="handleDelete(member.id)"
                                >
                                    <Trash2 class="h-3.5 w-3.5" />
                                    Delete Member
                                </button>
                            </div>
                        </div>
                    </div>

                    <div
                        class="flex items-center justify-between border-t border-slate-100 pt-3 lg:hidden"
                    >
                        <div>
                            <p
                                class="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400"
                            >
                                Venue
                            </p>

                            <p class="mt-1 text-xs font-medium text-slate-700">
                                {{ member.venue?.name || "Unassigned" }}
                            </p>
                        </div>

                        <div>
                            <p
                                class="text-right text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400"
                            >
                                Schedule
                            </p>

                            <p
                                class="mt-1 text-right text-xs font-medium text-slate-700"
                            >
                                {{
                                    member.schedules?.filter((s) => s.isWorking)
                                        .length || 0
                                }}
                                days
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <UiSlideover
            :show="isSlideoverOpen"
            :title="isEditing ? 'Edit Team Member' : 'Add Team Member'"
            @close="isSlideoverOpen = false"
        >
            <div class="space-y-6">
                <div class="border-b border-slate-200">
                    <div class="flex">
                        <button
                            v-for="tab in ['details', 'schedule']"
                            :key="tab"
                            type="button"
                            class="border-b-2 px-4 py-3 text-xs font-semibold capitalize transition-colors"
                            :class="
                                activeTab === tab
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-slate-500 hover:text-slate-700'
                            "
                            @click="activeTab = tab as 'details' | 'schedule'"
                        >
                            {{ tab }}
                        </button>
                    </div>
                </div>

                <div v-show="activeTab === 'details'" class="space-y-6">
                    <div class="space-y-2">
                        <label class="text-xs font-semibold text-slate-700">
                            Member Photo
                        </label>

                        <div
                            v-if="form.imageUrl"
                            class="relative mx-auto h-24 w-24 overflow-hidden border border-slate-200 group"
                        >
                            <img
                                :src="form.imageUrl"
                                class="h-full w-full object-cover"
                            />

                            <button
                                type="button"
                                class="absolute inset-0 flex items-center justify-center bg-slate-900/50 text-white opacity-0 transition-opacity group-hover:opacity-100"
                                @click="form.imageUrl = ''"
                            >
                                <Trash2 class="h-4 w-4" />
                            </button>
                        </div>

                        <UiMediaUpload
                            v-else
                            :venue-id="form.venueId || venues[0]?.id"
                            entity-type="EMPLOYEE"
                            label="Upload staff photo"
                            @uploaded="handleUploaded"
                        />
                    </div>

                    <div class="space-y-5">
                        <div class="space-y-1.5">
                            <label class="text-xs font-semibold text-slate-700">
                                Full Name
                            </label>

                            <input
                                v-model="form.name"
                                type="text"
                                placeholder="e.g. John Smith"
                                class="h-10 w-full border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                            />
                        </div>

                        <div class="space-y-1.5">
                            <label class="text-xs font-semibold text-slate-700">
                                Professional Title
                            </label>

                            <input
                                v-model="form.title"
                                type="text"
                                placeholder="e.g. Senior Hair Stylist"
                                class="h-10 w-full border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                            />
                        </div>

                        <div v-if="!isEditing" class="space-y-1.5">
                            <label class="text-xs font-semibold text-slate-700">
                                Assign to Venue
                            </label>

                            <select
                                v-model="form.venueId"
                                class="h-10 w-full border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                            >
                                <option
                                    v-for="venue in venues"
                                    :key="venue.id"
                                    :value="venue.id"
                                >
                                    {{ venue.name }}
                                </option>
                            </select>
                        </div>

                        <div class="space-y-1.5">
                            <label class="text-xs font-semibold text-slate-700">
                                Short Bio
                            </label>

                            <textarea
                                v-model="form.bio"
                                rows="4"
                                placeholder="Brief description of experience and specialties..."
                                class="w-full resize-none border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                            />
                        </div>
                    </div>
                </div>

                <div v-show="activeTab === 'schedule'" class="space-y-2">
                    <div class="mb-4">
                        <h3 class="text-sm font-semibold text-slate-900">
                            Working Schedule
                        </h3>

                        <p class="mt-1 text-xs text-slate-500">
                            Set the days and hours this team member is
                            available.
                        </p>
                    </div>

                    <div
                        v-for="(day, index) in schedule"
                        :key="index"
                        class="border border-slate-200 bg-white"
                    >
                        <div
                            class="flex items-center justify-between px-3 py-3"
                        >
                            <div>
                                <p class="text-xs font-semibold text-slate-900">
                                    {{ days[day.day] }}
                                </p>

                                <p
                                    v-if="day.isWorking"
                                    class="mt-0.5 text-[11px] text-slate-400"
                                >
                                    {{ day.startTime }} – {{ day.endTime }}
                                </p>

                                <p
                                    v-else
                                    class="mt-0.5 text-[11px] text-slate-400"
                                >
                                    Not working
                                </p>
                            </div>

                            <label
                                class="relative inline-flex cursor-pointer items-center"
                            >
                                <input
                                    v-model="day.isWorking"
                                    type="checkbox"
                                    class="peer sr-only"
                                />

                                <div
                                    class="h-5 w-9 border border-slate-300 bg-slate-100 transition peer-checked:border-primary peer-checked:bg-primary after:absolute after:left-[3px] after:top-[3px] after:h-3.5 after:w-3.5 after:bg-white after:shadow-sm after:transition-all peer-checked:after:translate-x-4"
                                />
                            </label>
                        </div>

                        <div
                            v-if="day.isWorking"
                            class="grid grid-cols-2 gap-3 border-t border-slate-100 bg-slate-50/50 p-3"
                        >
                            <div class="space-y-1">
                                <label
                                    class="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400"
                                >
                                    Starts
                                </label>

                                <input
                                    v-model="day.startTime"
                                    type="time"
                                    class="h-9 w-full border border-slate-200 bg-white px-2.5 text-xs text-slate-700 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                                />
                            </div>

                            <div class="space-y-1">
                                <label
                                    class="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400"
                                >
                                    Ends
                                </label>

                                <input
                                    v-model="day.endTime"
                                    type="time"
                                    class="h-9 w-full border border-slate-200 bg-white px-2.5 text-xs text-slate-700 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <template #footer>
                <div class="flex gap-2">
                    <UiButton
                        label="Cancel"
                        class="flex-1 border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                        @click="isSlideoverOpen = false"
                    />

                    <UiButton
                        :label="
                            submitting
                                ? 'Saving...'
                                : isEditing
                                  ? 'Update Member'
                                  : 'Add Member'
                        "
                        :icon="
                            submitting ? Loader2 : isEditing ? Settings : Plus
                        "
                        :disabled="submitting"
                        class="flex-[2] bg-primary text-white hover:bg-primary/90"
                        @click="handleSave"
                    />
                </div>
            </template>
        </UiSlideover>
    </div>
</template>
