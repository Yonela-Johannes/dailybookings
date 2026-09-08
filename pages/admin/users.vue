<script setup lang="ts">
import {
    Search,
    UserPlus,
    MoreVertical,
    Mail,
    Calendar,
    Shield,
    Filter,
    Loader2,
    ChevronLeft,
    ChevronRight,
    Trash2,
    Users,
} from "lucide-vue-next";
import { format, parseISO } from "date-fns";

definePageMeta({
    layout: "admin",
    middleware: "auth",
});

const search = ref("");
const roleFilter = ref("");
const page = ref(1);

const {
    data: usersData,
    pending,
    refresh,
} = useFetch("/api/admin/users", {
    query: {
        search,
        role: roleFilter,
        page,
        limit: 10,
    },
    watch: [search, roleFilter, page],
});

const users = computed(() => usersData.value?.users || []);

const meta = computed(
    () =>
        usersData.value?.meta || {
            total: 0,
            page: 1,
            totalPages: 1,
        },
);

const isSlideoverOpen = ref(false);
const isSaving = ref(false);
const newUser = ref({
    email: "",
    fullName: "",
    password: "",
    role: "CUSTOMER",
});

const openAddUser = () => {
    newUser.value = {
        email: "",
        fullName: "",
        password: "",
        role: "CUSTOMER",
    };
    isSlideoverOpen.value = true;
};

const handleCreateUser = async () => {
    isSaving.value = true;
    try {
        await $fetch("/api/admin/users", {
            method: "POST",
            body: newUser.value,
        });
        await refresh();
        isSlideoverOpen.value = false;
    } catch (error: any) {
        alert(error.data?.statusMessage || "Failed to create user");
    } finally {
        isSaving.value = false;
    }
};

const getRoleBadge = (role: string) => {
    switch (role) {
        case "PLATFORM_ADMIN":
            return "bg-purple-50 text-purple-700 border-purple-200";

        case "BUSINESS_OWNER":
            return "bg-teal-50 text-teal-700 border-teal-200";

        case "CUSTOMER":
            return "bg-blue-50 text-blue-700 border-blue-200";

        default:
            return "bg-slate-50 text-slate-600 border-slate-200";
    }
};

const updateRole = async (userId: string, role: string) => {
    try {
        await $fetch(`/api/admin/users/${userId}`, {
            method: "PATCH",
            body: { role },
        });

        refresh();
    } catch (error) {
        console.error("Failed to update user role:", error);
    }
};

const handleDelete = async (id: string) => {
    if (
        !confirm(
            "Are you sure you want to delete this account? All associated businesses and data will be permanently removed.",
        )
    ) {
        return;
    }

    try {
        await $fetch(`/api/admin/users/${id}`, {
            method: "DELETE",
        });

        refresh();
    } catch (error: any) {
        alert(error.data?.statusMessage || "Failed to delete user");
    }
};
</script>

<template>
    <div class="space-y-8 pb-20">
        <!-- Page Header -->
        <Head
            title="Users"
            description="Manage customers, business owners and platform administrators"
        />

        <!-- Actions -->
        <div
            class="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between"
        >
            <div class="flex items-center gap-3">
                <div
                    class="border border-slate-200 bg-white px-4 py-2.5 text-[11px] font-semibold text-slate-600"
                >
                    {{ meta.total }} users
                </div>

                <div
                    class="hidden border border-slate-200 bg-white px-4 py-2.5 text-[11px] font-medium text-slate-400 sm:block"
                >
                    Page {{ meta.page }} of {{ meta.totalPages }}
                </div>
            </div>

            <UiButton
                label="Add user"
                :icon="UserPlus"
                class="h-10 shadow-none"
                variant="outline"
                @click="openAddUser"
            />
        </div>

        <!-- Users Table -->
        <div class="overflow-hidden border border-slate-200 bg-white shadow-sm">
            <!-- Filters -->
            <div
                class="flex flex-col gap-4 border-b border-slate-200 bg-slate-50/40 p-5 lg:flex-row lg:items-end"
            >
                <div class="w-full max-w-xl">
                    <label
                        for="user-search"
                        class="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400"
                    >
                        Search users
                    </label>

                    <div class="relative">
                        <Search
                            class="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            id="user-search"
                            v-model="search"
                            type="text"
                            placeholder="Search by name or email..."
                            class="h-10 w-full border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-slate-400"
                        />
                    </div>
                </div>

                <div class="flex gap-3">
                    <div class="flex-1 lg:w-56 lg:flex-none">
                        <label
                            for="role-filter"
                            class="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400"
                        >
                            Role
                        </label>

                        <select
                            id="role-filter"
                            v-model="roleFilter"
                            class="h-10 w-full border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-slate-400"
                        >
                            <option value="">All roles</option>
                            <option value="PLATFORM_ADMIN">
                                Platform admin
                            </option>
                            <option value="BUSINESS_OWNER">
                                Business owner
                            </option>
                            <option value="CUSTOMER">Customer</option>
                        </select>
                    </div>

                    <button
                        type="button"
                        @click="refresh"
                        class="mt-auto inline-flex h-10 w-10 shrink-0 items-center justify-center border border-slate-200 bg-white text-slate-500 transition-colors hover:border-slate-300 hover:bg-slate-50"
                        aria-label="Refresh users"
                    >
                        <Filter class="h-4 w-4" />
                    </button>
                </div>
            </div>

            <!-- Loading -->
            <div
                v-if="pending"
                class="flex min-h-[520px] items-center justify-center"
            >
                <Loader2 class="h-6 w-6 animate-spin text-slate-400" />
            </div>

            <!-- Table -->
            <div v-else-if="users.length" class="overflow-x-auto">
                <table class="w-full min-w-[1000px] text-left">
                    <thead>
                        <tr class="border-b border-slate-200 bg-slate-50/60">
                            <th
                                class="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400"
                            >
                                User
                            </th>

                            <th
                                class="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400"
                            >
                                Role
                            </th>

                            <th
                                class="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400"
                            >
                                Joined
                            </th>

                            <th
                                class="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400"
                            >
                                Activity
                            </th>

                            <th
                                class="px-6 py-4 text-right text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400"
                            >
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody class="divide-y divide-slate-100">
                        <tr
                            v-for="user in users"
                            :key="user.id"
                            class="group transition-colors hover:bg-slate-50/60"
                        >
                            <!-- User -->
                            <td class="px-6 py-5">
                                <div class="flex items-center gap-3">
                                    <div
                                        class="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden border border-slate-200 bg-slate-50 text-sm font-bold text-slate-600"
                                    >
                                        <img
                                            v-if="user.profile?.avatarUrl"
                                            :src="user.profile.avatarUrl"
                                            :alt="user.fullName || 'User'"
                                            class="h-full w-full object-cover"
                                        />

                                        <template v-else>
                                            {{
                                                user.fullName?.charAt(0) ||
                                                user.email
                                                    ?.charAt(0)
                                                    ?.toUpperCase()
                                            }}
                                        </template>
                                    </div>

                                    <div class="min-w-0">
                                        <div
                                            class="max-w-[260px] truncate text-sm font-semibold text-slate-900"
                                        >
                                            {{
                                                user.fullName || "Unnamed user"
                                            }}
                                        </div>

                                        <div
                                            class="mt-1 flex max-w-[260px] items-center gap-1.5 truncate text-xs text-slate-400"
                                        >
                                            <Mail
                                                class="h-3.5 w-3.5 shrink-0"
                                            />
                                            {{ user.email }}
                                        </div>
                                    </div>
                                </div>
                            </td>

                            <!-- Role -->
                            <td class="px-6 py-5">
                                <span
                                    :class="[
                                        'inline-flex border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide',
                                        getRoleBadge(user.role),
                                    ]"
                                >
                                    {{
                                        user.role
                                            ?.replace(/_/g, " ")
                                            .toLowerCase()
                                    }}
                                </span>
                            </td>

                            <!-- Joined -->
                            <td class="px-6 py-5">
                                <div
                                    class="flex items-center gap-2 text-sm font-medium text-slate-700"
                                >
                                    <Calendar class="h-4 w-4 text-slate-400" />

                                    {{
                                        format(
                                            parseISO(user.createdAt),
                                            "MMM d, yyyy",
                                        )
                                    }}
                                </div>
                            </td>

                            <!-- Activity -->
                            <td class="px-6 py-5">
                                <div
                                    class="text-sm font-semibold text-slate-900"
                                >
                                    {{ user._count?.bookings || 0 }}
                                    <span class="font-normal text-slate-400">
                                        bookings
                                    </span>
                                </div>

                                <div class="mt-1 text-xs text-slate-400">
                                    {{ user._count?.businesses || 0 }}
                                    {{
                                        user._count?.businesses === 1
                                            ? "business"
                                            : "businesses"
                                    }}
                                </div>
                            </td>

                            <!-- Actions -->
                            <td class="px-6 py-5">
                                <div
                                    class="flex items-center justify-end gap-2"
                                >
                                    <div class="relative group/menu">
                                        <button
                                            type="button"
                                            class="inline-flex h-9 w-9 items-center justify-center border border-slate-200 bg-white text-slate-400 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                                            aria-label="Change user role"
                                        >
                                            <Shield class="h-4 w-4" />
                                        </button>

                                        <div
                                            class="absolute right-0 bottom-full z-50 mb-2 hidden w-52 border border-slate-200 bg-white p-2 shadow-xl group-hover/menu:block"
                                        >
                                            <div
                                                class="px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-400"
                                            >
                                                Change role
                                            </div>

                                            <button
                                                type="button"
                                                @click="
                                                    updateRole(
                                                        user.id,
                                                        'CUSTOMER',
                                                    )
                                                "
                                                class="block w-full px-3 py-2.5 text-left text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
                                            >
                                                Customer
                                            </button>

                                            <button
                                                type="button"
                                                @click="
                                                    updateRole(
                                                        user.id,
                                                        'BUSINESS_OWNER',
                                                    )
                                                "
                                                class="block w-full px-3 py-2.5 text-left text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-teal-700"
                                            >
                                                Business owner
                                            </button>

                                            <button
                                                type="button"
                                                @click="
                                                    updateRole(
                                                        user.id,
                                                        'PLATFORM_ADMIN',
                                                    )
                                                "
                                                class="block w-full px-3 py-2.5 text-left text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-purple-700"
                                            >
                                                Platform admin
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        @click="handleDelete(user.id)"
                                        class="inline-flex h-9 w-9 items-center justify-center border border-slate-200 bg-white text-slate-400 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                                        title="Delete account"
                                        aria-label="Delete account"
                                    >
                                        <Trash2 class="h-4 w-4" />
                                    </button>

                                    <button
                                        type="button"
                                        class="inline-flex h-9 w-9 items-center justify-center border border-slate-800 bg-slate-900 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
                                        aria-label="More actions"
                                    >
                                        <MoreVertical class="h-4 w-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Empty -->
            <div
                v-else
                class="flex min-h-[520px] flex-col items-center justify-center px-6 text-center"
            >
                <div
                    class="mb-5 flex h-14 w-14 items-center justify-center border border-slate-200 bg-slate-50"
                >
                    <Users class="h-6 w-6 text-slate-300" />
                </div>

                <h3 class="text-base font-semibold text-slate-900">
                    No users found
                </h3>

                <p class="mt-1 max-w-sm text-sm text-slate-400">
                    Try adjusting your search or role filter.
                </p>
            </div>

            <!-- Pagination -->
            <div
                class="flex flex-col gap-4 border-t border-slate-200 bg-slate-50/40 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
                <p class="text-xs text-slate-400">
                    Showing page
                    <span class="font-semibold text-slate-600">
                        {{ meta.page }}
                    </span>
                    of
                    <span class="font-semibold text-slate-600">
                        {{ meta.totalPages }}
                    </span>
                    · {{ meta.total }} total
                </p>

                <div class="flex items-center gap-2">
                    <button
                        type="button"
                        :disabled="page === 1"
                        @click="page--"
                        class="inline-flex h-9 w-9 items-center justify-center border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-30"
                        aria-label="Previous page"
                    >
                        <ChevronLeft class="h-4 w-4" />
                    </button>

                    <button
                        type="button"
                        :disabled="page >= meta.totalPages"
                        @click="page++"
                        class="inline-flex h-9 w-9 items-center justify-center border border-slate-200 bg-white text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-30"
                        aria-label="Next page"
                    >
                        <ChevronRight class="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>

        <!-- Add User Slideover -->
        <UiSlideover
            :show="isSlideoverOpen"
            title="Add New User"
            @close="isSlideoverOpen = false"
        >
            <form id="add-user-form" class="space-y-6" @submit.prevent="handleCreateUser">
                <div class="space-y-1.5">
                    <label class="text-xs font-semibold text-slate-700">Full Name</label>
                    <input
                        v-model="newUser.fullName"
                        type="text"
                        required
                        placeholder="e.g. John Doe"
                        class="h-10 w-full border border-slate-200 px-3 text-sm outline-none focus:border-primary"
                    />
                </div>

                <div class="space-y-1.5">
                    <label class="text-xs font-semibold text-slate-700">Email Address</label>
                    <input
                        v-model="newUser.email"
                        type="email"
                        required
                        placeholder="john@example.com"
                        class="h-10 w-full border border-slate-200 px-3 text-sm outline-none focus:border-primary"
                    />
                </div>

                <div class="space-y-1.5">
                    <label class="text-xs font-semibold text-slate-700">Password</label>
                    <input
                        v-model="newUser.password"
                        type="password"
                        required
                        minlength="8"
                        class="h-10 w-full border border-slate-200 px-3 text-sm outline-none focus:border-primary"
                    />
                </div>

                <div class="space-y-1.5">
                    <label class="text-xs font-semibold text-slate-700">Role</label>
                    <select
                        v-model="newUser.role"
                        required
                        class="h-10 w-full border border-slate-200 bg-white px-3 text-sm outline-none focus:border-primary"
                    >
                        <option value="CUSTOMER">Customer</option>
                        <option value="BUSINESS_OWNER">Business Owner</option>
                        <option value="PLATFORM_ADMIN">Platform Admin</option>
                    </select>
                </div>
            </form>

            <template #footer>
                <div class="flex gap-3">
                    <UiButton
                        label="Cancel"
                        variant="outline"
                        class="flex-1"
                        @click="isSlideoverOpen = false"
                    />
                    <UiButton
                        label="Create User"
                        button-type="submit"
                        form="add-user-form"
                        class="flex-[2]"
                        :loading="isSaving"
                    />
                </div>
            </template>
        </UiSlideover>
    </div>
</template>
