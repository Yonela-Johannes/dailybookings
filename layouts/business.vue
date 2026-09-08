<script setup lang="ts">
import {
    LayoutDashboard,
    Calendar,
    Scissors,
    Users,
    Settings,
    LogOut,
    Bell,
    Search,
    MessageSquare,
    Menu,
    X,
    ChevronRight,
} from "lucide-vue-next";

const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, to: "/business" },
    { label: "Calendar", icon: Calendar, to: "/business/calendar" },
    { label: "Services", icon: Scissors, to: "/business/services" },
    { label: "Team", icon: Users, to: "/business/team" },
    { label: "Reviews", icon: MessageSquare, to: "/business/reviews" },
    { label: "Settings", icon: Settings, to: "/business/settings" },
];

const { dbUser, logout } = useAuth();
const route = useRoute();

const isMobileMenuOpen = ref(false);

const handleLogout = async () => {
    await logout();
    await navigateTo("/auth/login");
};

const initials = computed(() => {
    if (!dbUser.value?.fullName) return "B";

    return dbUser.value.fullName
        .split(" ")
        .filter(Boolean)
        .map((name: string) => name[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
});

const mainVenueSlug = computed(
    () => dbUser.value?.businesses?.[0]?.venues?.[0]?.slug,
);

const isActive = (to: string) => {
    if (to === "/business") {
        return route.path === "/business";
    }

    return route.path === to || route.path.startsWith(`${to}/`);
};

watch(
    () => route.path,
    () => {
        isMobileMenuOpen.value = false;
    },
);
</script>

<template>
    <div
        class="flex min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-primary/10 selection:text-primary"
    >
        <aside
            class="sticky top-0 z-50 hidden h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-white lg:flex"
        >
            <div class="flex h-20 items-center border-b border-slate-200 px-6">
                <NuxtLink
                    to="/"
                    class="group flex items-center"
                    aria-label="DailyBookings home"
                >
                    <div class="flex items-center overflow-hidden">
                        <img
                            src="/mobile-logo.png"
                            alt=""
                            class="h-7 w-auto object-contain"
                        />

                        <img
                            src="/logo.png"
                            alt="DailyBookings"
                            class="h-7 w-auto object-contain"
                        />
                    </div>
                </NuxtLink>
            </div>

            <nav
                class="custom-scrollbar flex-1 overflow-y-auto px-4 py-6"
                aria-label="Business navigation"
            >
                <div
                    class="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400"
                >
                    Business
                </div>

                <div class="space-y-1">
                    <NuxtLink
                        v-for="item in navItems"
                        :key="item.to"
                        :to="item.to"
                        class="group relative flex h-10 items-center gap-3 border border-transparent px-3 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900"
                        :class="
                            isActive(item.to)
                                ? '!border-primary/10 !bg-primary/5 !text-primary'
                                : ''
                        "
                    >
                        <component
                            :is="item.icon"
                            class="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
                        />

                        <span>{{ item.label }}</span>

                        <ChevronRight
                            v-if="isActive(item.to)"
                            class="ml-auto h-3.5 w-3.5"
                        />
                    </NuxtLink>
                </div>
            </nav>

            <div class="border-t border-slate-200 p-4">
                <NuxtLink
                    to="/profile"
                    class="flex items-center gap-3 border border-slate-200 bg-slate-50 px-3 py-3 transition-colors hover:bg-white"
                >
                    <div
                        class="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden border border-slate-200 bg-white text-xs font-bold text-primary"
                    >
                        <img
                            v-if="dbUser?.profile?.avatarUrl"
                            :src="dbUser.profile.avatarUrl"
                            :alt="dbUser.fullName || 'Business owner'"
                            class="h-full w-full object-cover"
                        />

                        <template v-else>
                            {{ initials }}
                        </template>
                    </div>

                    <div class="min-w-0 flex-1">
                        <div
                            class="truncate text-xs font-semibold text-slate-900"
                        >
                            {{ dbUser?.fullName || "Business Owner" }}
                        </div>

                        <div class="mt-0.5 truncate text-[10px] text-slate-400">
                            {{ dbUser?.email }}
                        </div>
                    </div>
                </NuxtLink>

                <button
                    type="button"
                    @click="handleLogout"
                    class="mt-2 flex h-10 w-full items-center gap-3 border border-transparent px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400 transition-colors hover:border-red-100 hover:bg-red-50 hover:text-red-600"
                >
                    <LogOut class="h-4 w-4" />
                    Sign out
                </button>
            </div>
        </aside>

        <Teleport to="body">
            <Transition
                enter-active-class="transition duration-300 ease-out"
                enter-from-class="opacity-0"
                enter-to-class="opacity-100"
                leave-active-class="transition duration-200 ease-in"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0"
            >
                <div
                    v-if="isMobileMenuOpen"
                    class="fixed inset-0 z-[100] bg-slate-950/40 lg:hidden"
                    @click="isMobileMenuOpen = false"
                >
                    <Transition
                        enter-active-class="transition duration-300 ease-out"
                        enter-from-class="-translate-x-full"
                        enter-to-class="translate-x-0"
                        leave-active-class="transition duration-200 ease-in"
                        leave-from-class="translate-x-0"
                        leave-to-class="-translate-x-full"
                    >
                        <aside
                            class="flex h-full w-72 flex-col bg-white shadow-2xl"
                            @click.stop
                        >
                            <div
                                class="flex h-20 items-center justify-between border-b border-slate-200 px-6"
                            >
                                <NuxtLink to="/" class="flex items-center">
                                    <div
                                        class="flex items-center overflow-hidden"
                                    >
                                        <img
                                            src="/mobile-logo.png"
                                            alt=""
                                            class="h-6 w-auto object-contain"
                                        />

                                        <img
                                            src="/logo.png"
                                            alt="DailyBookings"
                                            class="h-6 w-auto object-contain"
                                        />
                                    </div>
                                </NuxtLink>

                                <button
                                    type="button"
                                    @click="isMobileMenuOpen = false"
                                    class="inline-flex h-9 w-9 items-center justify-center border border-slate-200 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-900"
                                    aria-label="Close navigation"
                                >
                                    <X class="h-5 w-5" />
                                </button>
                            </div>

                            <nav
                                class="custom-scrollbar flex-1 overflow-y-auto px-4 py-6"
                                aria-label="Mobile business navigation"
                            >
                                <div
                                    class="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400"
                                >
                                    Business
                                </div>

                                <div class="space-y-1">
                                    <NuxtLink
                                        v-for="item in navItems"
                                        :key="item.to"
                                        :to="item.to"
                                        class="flex h-11 items-center gap-3 border border-transparent px-3 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900"
                                        :class="
                                            isActive(item.to)
                                                ? '!border-primary/10 !bg-primary/5 !text-primary'
                                                : ''
                                        "
                                    >
                                        <component
                                            :is="item.icon"
                                            class="h-4 w-4 shrink-0"
                                        />

                                        <span>{{ item.label }}</span>

                                        <ChevronRight
                                            v-if="isActive(item.to)"
                                            class="ml-auto h-3.5 w-3.5"
                                        />
                                    </NuxtLink>
                                </div>
                            </nav>

                            <div class="border-t border-slate-200 p-4">
                                <NuxtLink
                                    to="/profile"
                                    class="flex items-center gap-3 border border-slate-200 bg-slate-50 px-3 py-3"
                                >
                                    <div
                                        class="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden border border-slate-200 bg-white text-xs font-bold text-primary"
                                    >
                                        <img
                                            v-if="dbUser?.profile?.avatarUrl"
                                            :src="dbUser.profile.avatarUrl"
                                            :alt="
                                                dbUser.fullName ||
                                                'Business owner'
                                            "
                                            class="h-full w-full object-cover"
                                        />

                                        <template v-else>
                                            {{ initials }}
                                        </template>
                                    </div>

                                    <div class="min-w-0">
                                        <div
                                            class="truncate text-xs font-semibold text-slate-900"
                                        >
                                            {{
                                                dbUser?.fullName ||
                                                "Business Owner"
                                            }}
                                        </div>

                                        <div
                                            class="mt-0.5 text-[10px] text-slate-400"
                                        >
                                            Business Owner
                                        </div>
                                    </div>
                                </NuxtLink>

                                <button
                                    type="button"
                                    @click="handleLogout"
                                    class="mt-2 flex h-10 w-full items-center gap-3 border border-transparent px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400 transition-colors hover:border-red-100 hover:bg-red-50 hover:text-red-600"
                                >
                                    <LogOut class="h-4 w-4" />
                                    Sign out
                                </button>
                            </div>
                        </aside>
                    </Transition>
                </div>
            </Transition>
        </Teleport>

        <main class="flex min-h-screen min-w-0 flex-1 flex-col">
            <header
                class="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8"
            >
                <div class="flex min-w-0 flex-1 items-center gap-4">
                    <button
                        type="button"
                        @click="isMobileMenuOpen = true"
                        class="inline-flex h-9 w-9 items-center justify-center border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900 lg:hidden"
                        aria-label="Open navigation"
                    >
                        <Menu class="h-5 w-5" />
                    </button>

                    <div class="group relative hidden w-full max-w-md sm:block">
                        <Search
                            class="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-primary"
                        />

                        <input
                            type="search"
                            placeholder="Search..."
                            aria-label="Search"
                            class="h-10 w-full border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
                        />
                    </div>
                </div>

                <div class="ml-4 flex items-center gap-3">
                    <button
                        type="button"
                        class="relative inline-flex h-9 w-9 items-center justify-center border border-transparent text-slate-400 transition-colors hover:border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                        aria-label="Notifications"
                    >
                        <Bell class="h-4 w-4" />

                        <span
                            class="absolute right-2 top-2 h-1.5 w-1.5 bg-primary"
                        />
                    </button>

                    <div class="hidden h-6 w-px bg-slate-200 sm:block" />

                    <NuxtLink
                        v-if="mainVenueSlug"
                        :to="`/venue/${mainVenueSlug}`"
                        target="_blank"
                        class="hidden rounded-none bg-slate-900 px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.12em] text-white transition-colors hover:bg-primary sm:block"
                    >
                        Live Site
                    </NuxtLink>

                    <NuxtLink to="/profile" class="flex items-center gap-3">
                        <div class="hidden text-right sm:block">
                            <div
                                class="max-w-[140px] truncate text-xs font-semibold text-slate-900"
                            >
                                {{ dbUser?.fullName || "Business Owner" }}
                            </div>

                            <div
                                class="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-400"
                            >
                                Business Owner
                            </div>
                        </div>

                        <div
                            class="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden border border-slate-200 bg-slate-50 text-xs font-bold text-primary"
                        >
                            <img
                                v-if="dbUser?.profile?.avatarUrl"
                                :src="dbUser.profile.avatarUrl"
                                :alt="dbUser.fullName || 'Business Owner'"
                                class="h-full w-full object-cover"
                            />

                            <template v-else>
                                {{ initials }}
                            </template>
                        </div>
                    </NuxtLink>
                </div>
            </header>

            <div
                class="custom-scrollbar relative flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8 lg:py-8"
            >
                <div
                    class="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-primary/[0.025] to-transparent"
                />

                <div class="relative z-10 mx-auto max-w-7xl">
                    <slot />
                </div>
            </div>
        </main>
    </div>
</template>

<style>
.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #e2e8f0;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #cbd5e1;
}
</style>
