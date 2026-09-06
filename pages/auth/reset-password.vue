<script setup lang="ts">
import { ref } from "vue";
import {
    ArrowRight,
    CalendarDays,
    Check,
    Eye,
    EyeOff,
    Loader2,
    Lock,
} from "lucide-vue-next";

const client = useSupabaseClient();

const password = ref("");
const confirmPassword = ref("");
const loading = ref(false);
const error = ref("");
const success = ref(false);

const showPassword = ref(false);
const showConfirmPassword = ref(false);

const requirements = computed(() => [
    {
        label: "At least 8 characters",
        valid: password.value.length >= 8,
    },
    {
        label: "One uppercase letter",
        valid: /[A-Z]/.test(password.value),
    },
    {
        label: "One number",
        valid: /\d/.test(password.value),
    },
]);

async function handleReset() {
    if (loading.value) return;

    error.value = "";

    if (password.value !== confirmPassword.value) {
        error.value = "Your passwords do not match.";
        return;
    }

    if (password.value.length < 8) {
        error.value = "Your password must contain at least 8 characters.";
        return;
    }

    loading.value = true;

    const { error: authError } = await client.auth.updateUser({
        password: password.value,
    });

    if (authError) {
        error.value = authError.message;
        loading.value = false;
        return;
    }

    success.value = true;
    loading.value = false;
}
</script>

<template>
    <main class="min-h-[calc(100dvh-80px)] bg-slate-50">
        <div
            class="mx-auto flex min-h-[calc(100dvh-80px)] max-w-7xl items-center justify-center px-4 py-12 sm:px-6"
        >
            <div class="w-full max-w-md">
                <div class="mb-8 text-center">
                    <h1
                        class="mt-6 text-3xl font-semibold tracking-tight text-slate-950"
                    >
                        Create a new password
                    </h1>

                    <p class="mt-3 text-sm leading-6 text-slate-500">
                        Choose a new password for your DailyBookings account.
                    </p>
                </div>

                <div
                    class="border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
                >
                    <div v-if="success" class="py-4 text-center">
                        <Check
                            class="mx-auto h-10 w-10 text-primary"
                            stroke-width="1.8"
                        />

                        <h2 class="mt-5 text-lg font-semibold text-slate-950">
                            Password updated
                        </h2>

                        <p class="mt-2 text-sm leading-6 text-slate-500">
                            Your password has been changed successfully.
                        </p>

                        <NuxtLink
                            to="/auth/login"
                            class="mt-7 inline-flex h-11 items-center gap-2 bg-slate-950 px-5 text-sm font-semibold text-white hover:bg-primary"
                        >
                            Sign in
                            <ArrowRight class="h-4 w-4" />
                        </NuxtLink>
                    </div>

                    <form
                        v-else
                        class="space-y-5"
                        @submit.prevent="handleReset"
                    >
                        <div
                            v-if="error"
                            role="alert"
                            class="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                        >
                            {{ error }}
                        </div>

                        <div class="space-y-2">
                            <label
                                for="password"
                                class="block text-sm font-medium text-slate-900"
                            >
                                New password
                            </label>

                            <div class="relative">
                                <Lock
                                    class="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                                />

                                <input
                                    id="password"
                                    v-model="password"
                                    :type="showPassword ? 'text' : 'password'"
                                    autocomplete="new-password"
                                    required
                                    placeholder="Enter your new password"
                                    class="h-12 w-full border border-slate-200 pl-10 pr-11 text-sm outline-none placeholder:text-slate-400 focus:border-slate-950 focus:ring-1 focus:ring-slate-950"
                                />

                                <button
                                    type="button"
                                    class="absolute right-0 top-0 flex h-12 w-11 items-center justify-center text-slate-400 hover:text-slate-950"
                                    @click="showPassword = !showPassword"
                                >
                                    <EyeOff
                                        v-if="showPassword"
                                        class="h-4 w-4"
                                    />
                                    <Eye v-else class="h-4 w-4" />
                                </button>
                            </div>

                            <div class="space-y-1.5 pt-1">
                                <div
                                    v-for="requirement in requirements"
                                    :key="requirement.label"
                                    class="flex items-center gap-2 text-xs"
                                    :class="
                                        requirement.valid
                                            ? 'text-primary'
                                            : 'text-slate-400'
                                    "
                                >
                                    <Check class="h-3.5 w-3.5" />
                                    {{ requirement.label }}
                                </div>
                            </div>
                        </div>

                        <div class="space-y-2">
                            <label
                                for="confirm-password"
                                class="block text-sm font-medium text-slate-900"
                            >
                                Confirm password
                            </label>

                            <div class="relative">
                                <Lock
                                    class="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                                />

                                <input
                                    id="confirm-password"
                                    v-model="confirmPassword"
                                    :type="
                                        showConfirmPassword
                                            ? 'text'
                                            : 'password'
                                    "
                                    autocomplete="new-password"
                                    required
                                    placeholder="Repeat your new password"
                                    class="h-12 w-full border border-slate-200 pl-10 pr-11 text-sm outline-none placeholder:text-slate-400 focus:border-slate-950 focus:ring-1 focus:ring-slate-950"
                                />

                                <button
                                    type="button"
                                    class="absolute right-0 top-0 flex h-12 w-11 items-center justify-center text-slate-400 hover:text-slate-950"
                                    @click="
                                        showConfirmPassword =
                                            !showConfirmPassword
                                    "
                                >
                                    <EyeOff
                                        v-if="showConfirmPassword"
                                        class="h-4 w-4"
                                    />
                                    <Eye v-else class="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            :disabled="loading"
                            class="flex h-12 w-full items-center justify-center gap-2 bg-slate-950 text-sm font-semibold text-white hover:bg-primary disabled:opacity-60"
                        >
                            <Loader2
                                v-if="loading"
                                class="h-4 w-4 animate-spin"
                            />

                            {{
                                loading
                                    ? "Updating password…"
                                    : "Update password"
                            }}

                            <ArrowRight v-if="!loading" class="h-4 w-4" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </main>
</template>
