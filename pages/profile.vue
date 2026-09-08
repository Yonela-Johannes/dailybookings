<script setup lang="ts">
import {
    User,
    Mail,
    Phone,
    FileText,
    Camera,
    Loader2,
    Check,
    AlertCircle,
    ArrowLeft
} from "lucide-vue-next";

definePageMeta({
    middleware: "auth",
});

const { dbUser, fetchDbUser } = useAuth();
const saving = ref(false);
const saveStatus = ref<{ type: 'success' | 'error', message: string } | null>(null);

const form = ref({
    fullName: "",
    phone: "",
    bio: "",
    avatarUrl: ""
});

watch(dbUser, (user) => {
    if (user) {
        form.value = {
            fullName: user.fullName || "",
            phone: user.profile?.phone || "",
            bio: user.profile?.bio || "",
            avatarUrl: user.profile?.avatarUrl || ""
        };
    }
}, { immediate: true });

const handleSave = async () => {
    saving.value = true;
    saveStatus.value = null;

    try {
        await $fetch("/api/auth/profile", {
            method: "PATCH",
            body: form.value
        });

        await fetchDbUser();
        saveStatus.value = { type: 'success', message: 'Profile updated successfully.' };

        setTimeout(() => {
            saveStatus.value = null;
        }, 3000);
    } catch (err: any) {
        saveStatus.value = { type: 'error', message: err.data?.message || 'Failed to update profile.' };
    } finally {
        saving.value = false;
    }
};

const handleAvatarUploaded = (data: any) => {
    form.value.avatarUrl = data.url;
};

const goBack = () => {
    const role = dbUser.value?.role;
    if (role === 'PLATFORM_ADMIN') navigateTo('/admin');
    else if (role === 'BUSINESS_OWNER') navigateTo('/business');
    else navigateTo('/dashboard');
};
</script>

<template>
    <div class="min-h-screen bg-slate-50 pt-20">
        <div class="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
            <button
                @click="goBack"
                class="mb-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-400 hover:text-primary transition-colors"
            >
                <ArrowLeft class="h-3.5 w-3.5" />
                Back to Dashboard
            </button>

            <div class="border border-slate-200 bg-white shadow-sm">
                <div class="border-b border-slate-200 px-6 py-4">
                    <h1 class="text-xl font-bold text-slate-900">Account Profile</h1>
                    <p class="mt-1 text-sm text-slate-500">Manage your personal information and how you appear on the platform.</p>
                </div>

                <div class="p-6 space-y-8">
                    <!-- Status Messages -->
                    <Transition
                        enter-active-class="transition duration-200 ease-out"
                        enter-from-class="-translate-y-2 opacity-0"
                        enter-to-class="translate-y-0 opacity-100"
                        leave-active-class="transition duration-150 ease-in"
                        leave-from-class="opacity-100"
                        leave-to-class="opacity-0"
                    >
                        <div v-if="saveStatus" :class="[
                            'flex items-center gap-3 border px-4 py-3 text-sm font-medium',
                            saveStatus.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-red-200 bg-red-50 text-red-700'
                        ]">
                            <Check v-if="saveStatus.type === 'success'" class="h-4 w-4" />
                            <AlertCircle v-else class="h-4 w-4" />
                            {{ saveStatus.message }}
                        </div>
                    </Transition>

                    <!-- Avatar -->
                    <div class="flex flex-col items-center gap-4 sm:flex-row">
                        <div class="relative group h-24 w-24 shrink-0 overflow-hidden border border-slate-200 bg-slate-50">
                            <img v-if="form.avatarUrl" :src="form.avatarUrl" class="h-full w-full object-cover" />
                            <div v-else class="flex h-full w-full items-center justify-center text-2xl font-bold text-slate-300">
                                {{ form.fullName?.[0] || dbUser?.email?.[0]?.toUpperCase() }}
                            </div>
                        </div>

                        <div class="space-y-1 text-center sm:text-left">
                            <h3 class="text-sm font-semibold text-slate-900">Profile Picture</h3>
                            <p class="text-xs text-slate-500 mb-3">JPG, PNG or WEBP. Max 2MB.</p>
                            <UiMediaUpload
                                entity-type="VENUE"
                                label="Change Photo"
                                class="!p-0"
                                @uploaded="handleAvatarUploaded"
                            />
                        </div>
                    </div>

                    <div class="grid gap-6 sm:grid-cols-2">
                        <div class="space-y-1.5">
                            <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Full Name</label>
                            <div class="relative">
                                <User class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <input
                                    v-model="form.fullName"
                                    type="text"
                                    class="h-11 w-full border border-slate-200 pl-10 pr-4 text-sm outline-none focus:border-primary"
                                    placeholder="Enter your full name"
                                />
                            </div>
                        </div>

                        <div class="space-y-1.5">
                            <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Email Address</label>
                            <div class="relative">
                                <Mail class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <input
                                    :value="dbUser?.email"
                                    disabled
                                    type="email"
                                    class="h-11 w-full border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-500 outline-none cursor-not-allowed"
                                />
                            </div>
                            <p class="text-[10px] text-slate-400">Email cannot be changed.</p>
                        </div>

                        <div class="space-y-1.5">
                            <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Phone Number</label>
                            <div class="relative">
                                <Phone class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <input
                                    v-model="form.phone"
                                    type="tel"
                                    class="h-11 w-full border border-slate-200 pl-10 pr-4 text-sm outline-none focus:border-primary"
                                    placeholder="+27..."
                                />
                            </div>
                        </div>

                        <div class="space-y-1.5 sm:col-span-2">
                            <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Short Bio</label>
                            <div class="relative">
                                <FileText class="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                <textarea
                                    v-model="form.bio"
                                    rows="4"
                                    class="w-full border border-slate-200 pl-10 pr-4 py-3 text-sm outline-none focus:border-primary resize-none"
                                    placeholder="Tell us a bit about yourself..."
                                />
                            </div>
                        </div>
                    </div>

                    <div class="flex justify-end pt-4">
                        <UiButton
                            :label="saving ? 'Saving Changes...' : 'Save Profile'"
                            :loading="saving"
                            class="bg-primary text-white hover:bg-slate-900 px-8"
                            @click="handleSave"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
