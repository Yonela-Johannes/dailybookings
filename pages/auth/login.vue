<script setup lang="ts">
import { ref } from "vue";
import {
    ArrowRight,
    CalendarDays,
    Eye,
    EyeOff,
    Loader2,
    Lock,
    Mail,
    ShieldCheck,
} from "lucide-vue-next";

const client = useSupabaseClient();

const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");
const showPassword = ref(false);

async function handleLogin() {
    if (loading.value) return;

    loading.value = true;
    error.value = "";

    const { error: authError } = await client.auth.signInWithPassword({
        email: email.value.trim(),
        password: password.value,
    });

    if (authError) {
        error.value = getAuthError(authError.message);
        loading.value = false;
        return;
    }

    await navigateTo("/dashboard");
}

function getAuthError(message: string) {
    if (message.toLowerCase().includes("invalid login credentials")) {
        return "The email or password you entered is incorrect.";
    }

    if (message.toLowerCase().includes("email not confirmed")) {
        return "Please verify your email address before signing in.";
    }

    return "We could not sign you in. Please check your details and try again.";
}
</script>

<template>
    <main class="min-h-[calc(100dvh-80px)] bg-slate-50">
        <div
            class="mx-auto flex min-h-[calc(100dvh-80px)] max-w-7xl items-center justify-center px-4 py-12 sm:px-6 lg:py-20"
        >
            <div class="w-full max-w-md">
                <!-- Header -->
                <div class="mb-8 text-center">
                    <div
                        class="mx-auto flex h-12 w-12 items-center justify-center border border-slate-200 bg-white text-primary shadow-sm"
                    >
                        <CalendarDays class="h-6 w-6" stroke-width="1.8" />
                    </div>
                    <h1
                        class="mt-6 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl"
                    >
                        Welcome back
                    </h1>

                    <p
                        class="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500"
                    >
                        Sign in to manage your bookings, appointments, and
                        favourite businesses.
                    </p>
                </div>

                <!-- Form -->
                <div
                    class="border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
                >
                    <form class="space-y-5" @submit.prevent="handleLogin">
                        <!-- Error -->
                        <div
                            v-if="error"
                            role="alert"
                            class="border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700"
                        >
                            {{ error }}
                        </div>

                        <!-- Email -->
                        <div class="space-y-2">
                            <label
                                for="email"
                                class="block text-sm font-medium text-slate-900"
                            >
                                Email address
                            </label>

                            <div class="relative">
                                <Mail
                                    class="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                                    stroke-width="1.8"
                                />

                                <input
                                    id="email"
                                    v-model="email"
                                    type="email"
                                    name="email"
                                    autocomplete="email"
                                    inputmode="email"
                                    required
                                    placeholder="you@example.com"
                                    class="h-12 w-full border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-950 outline-none transition-colors placeholder:text-slate-400 focus:border-slate-950 focus:ring-1 focus:ring-slate-950"
                                />
                            </div>
                        </div>

                        <!-- Password -->
                        <div class="space-y-2">
                            <div
                                class="flex items-center justify-between gap-4"
                            >
                                <label
                                    for="password"
                                    class="block text-sm font-medium text-slate-900"
                                >
                                    Password
                                </label>

                                <NuxtLink
                                    to="/forgot-password"
                                    class="text-xs font-medium text-slate-500 transition-colors hover:text-primary"
                                >
                                    Forgot password?
                                </NuxtLink>
                            </div>

                            <div class="relative">
                                <Lock
                                    class="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                                    stroke-width="1.8"
                                />

                                <input
                                    id="password"
                                    v-model="password"
                                    :type="showPassword ? 'text' : 'password'"
                                    name="password"
                                    autocomplete="current-password"
                                    required
                                    placeholder="Enter your password"
                                    class="h-12 w-full border border-slate-200 bg-white pl-10 pr-11 text-sm text-slate-950 outline-none transition-colors placeholder:text-slate-400 focus:border-slate-950 focus:ring-1 focus:ring-slate-950"
                                />

                                <button
                                    type="button"
                                    :aria-label="
                                        showPassword
                                            ? 'Hide password'
                                            : 'Show password'
                                    "
                                    class="absolute right-0 top-0 flex h-12 w-11 items-center justify-center text-slate-400 transition-colors hover:text-slate-950"
                                    @click="showPassword = !showPassword"
                                >
                                    <EyeOff
                                        v-if="showPassword"
                                        class="h-4 w-4"
                                        stroke-width="1.8"
                                    />
                                    <Eye
                                        v-else
                                        class="h-4 w-4"
                                        stroke-width="1.8"
                                    />
                                </button>
                            </div>
                        </div>

                        <!-- Submit -->
                        <button
                            type="submit"
                            :disabled="loading"
                            class="flex h-12 w-full items-center justify-center gap-2 bg-slate-950 px-5 text-sm font-semibold text-white transition-colors hover:bg-primary disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <Loader2
                                v-if="loading"
                                class="h-4 w-4 animate-spin"
                                stroke-width="2"
                            />

                            <span>
                                {{ loading ? "Signing in…" : "Sign in" }}
                            </span>

                            <ArrowRight
                                v-if="!loading"
                                class="h-4 w-4"
                                stroke-width="1.8"
                            />
                        </button>
                    </form>

                    <!-- Divider -->
                    <div class="my-7 flex items-center gap-4">
                        <div class="h-px flex-1 bg-slate-100" />

                        <span class="text-xs text-slate-400">
                            Secure account access
                        </span>

                        <div class="h-px flex-1 bg-slate-100" />
                    </div>

                    <!-- Security -->
                    <div class="flex items-start gap-3">
                        <ShieldCheck
                            class="mt-0.5 h-4 w-4 shrink-0 text-primary"
                            stroke-width="1.8"
                        />

                        <p class="text-xs leading-5 text-slate-500">
                            Your account is securely authenticated and your
                            booking information is protected.
                        </p>
                    </div>
                </div>

                <!-- Register -->
                <p class="mt-6 text-center text-sm text-slate-500">
                    Don't have an account?
                    <NuxtLink
                        to="/register"
                        class="ml-1 font-semibold text-slate-950 transition-colors hover:text-primary"
                    >
                        Create an account
                    </NuxtLink>
                </p>

                <!-- Business -->
                <div class="mt-8 border-t border-slate-200 pt-6 text-center">
                    <p class="text-xs text-slate-400">Are you a business?</p>

                    <NuxtLink
                        to="/for-business"
                        class="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-slate-700 transition-colors hover:text-primary"
                    >
                        Manage your business on DailyBookings
                        <ArrowRight class="h-3.5 w-3.5" stroke-width="1.8" />
                    </NuxtLink>
                </div>
            </div>
        </div>
    </main>
</template>
