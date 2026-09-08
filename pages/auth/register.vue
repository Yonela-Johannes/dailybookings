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
    Mail,
    User,
} from "lucide-vue-next";

const { register } = useAuth();
const route = useRoute();

const firstName = ref("");
const lastName = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");

const loading = ref(false);
const error = ref("");
const showPassword = ref(false);
const showConfirmPassword = ref(false);

const selectedRole = ref(route.query.role as string || "CUSTOMER");
const isAdminFlow = computed(() => route.query.role === "PLATFORM_ADMIN" || selectedRole.value === "PLATFORM_ADMIN");

const role = computed(() => {
    if (selectedRole.value === "PLATFORM_ADMIN") return "PLATFORM_ADMIN";
    if (selectedRole.value === "BUSINESS_OWNER") return "BUSINESS_OWNER";
    return "CUSTOMER";
});

const passwordRequirements = computed(() => [
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

async function handleRegister() {
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

    const { error: authError } = await register({
        email: email.value.trim(),
        password: password.value,
        options: {
            data: {
                first_name: firstName.value.trim(),
                last_name: lastName.value.trim(),
                full_name:
                    `${firstName.value.trim()} ${lastName.value.trim()}`.trim(),
                role: role.value,
            },
        },
    });

    if (authError) {
        error.value = authError.message;
        loading.value = false;
        return;
    }

    await navigateTo({
        path: "/auth/verify-email",
        query: { email: email.value.trim() }
    });
}
</script>

<template>
    <main class="min-h-[calc(100dvh-80px)] bg-slate-50">
        <div
            class="mx-auto flex min-h-[calc(100dvh-80px)] max-w-7xl items-center justify-center px-4 py-12 sm:px-6 lg:py-20"
        >
            <div class="w-full max-w-md">
                <div class="mb-8 text-center">
                    <h1
                        class="mt-6 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl"
                    >
                        Create your account
                    </h1>

                    <p class="mt-3 text-sm leading-6 text-slate-500">
                        Join DailyBookings and keep all your appointments in one
                        place.
                    </p>
                </div>

                <div
                    class="border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
                >
                    <form class="space-y-5" @submit.prevent="handleRegister">
                        <div
                            v-if="error"
                            role="alert"
                            class="border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700"
                        >
                            {{ error }}
                        </div>

                        <div class="grid gap-5 sm:grid-cols-2">
                            <div class="space-y-2">
                                <label
                                    for="first-name"
                                    class="block text-sm font-medium text-slate-900"
                                >
                                    First name
                                </label>

                                <div class="relative">
                                    <User
                                        class="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                                    />

                                    <input
                                        id="first-name"
                                        v-model="firstName"
                                        type="text"
                                        autocomplete="given-name"
                                        required
                                        placeholder="Tyler"
                                        class="h-12 w-full border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-slate-950 focus:ring-1 focus:ring-slate-950"
                                    />
                                </div>
                            </div>

                            <div class="space-y-2">
                                <label
                                    for="last-name"
                                    class="block text-sm font-medium text-slate-900"
                                >
                                    Last name
                                </label>

                                <input
                                    id="last-name"
                                    v-model="lastName"
                                    type="text"
                                    autocomplete="family-name"
                                    required
                                    placeholder="Johannes"
                                    class="h-12 w-full border border-slate-200 bg-white px-4 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-slate-950 focus:ring-1 focus:ring-slate-950"
                                />
                            </div>
                        </div>

                        <div class="space-y-2">
                            <label class="block text-sm font-medium text-slate-900">
                                I want to:
                            </label>
                            <div :class="['grid gap-3', isAdminFlow ? 'grid-cols-3' : 'grid-cols-2']">
                                <button
                                    type="button"
                                    @click="selectedRole = 'CUSTOMER'"
                                    :class="[
                                        'h-12 border text-sm font-medium transition-all',
                                        selectedRole === 'CUSTOMER'
                                            ? 'border-slate-950 bg-slate-950 text-white'
                                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                                    ]"
                                >
                                    Book Services
                                </button>
                                <button
                                    type="button"
                                    @click="selectedRole = 'BUSINESS_OWNER'"
                                    :class="[
                                        'h-12 border text-sm font-medium transition-all',
                                        selectedRole === 'BUSINESS_OWNER'
                                            ? 'border-slate-950 bg-slate-950 text-white'
                                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                                    ]"
                                >
                                    List my Business
                                </button>
                                <button
                                    v-if="isAdminFlow"
                                    type="button"
                                    @click="selectedRole = 'PLATFORM_ADMIN'"
                                    :class="[
                                        'h-12 border text-sm font-medium transition-all',
                                        selectedRole === 'PLATFORM_ADMIN'
                                            ? 'border-slate-950 bg-slate-950 text-white'
                                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                                    ]"
                                >
                                    Platform Admin
                                </button>
                            </div>
                        </div>

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
                                />

                                <input
                                    id="email"
                                    v-model="email"
                                    type="email"
                                    autocomplete="email"
                                    required
                                    placeholder="you@example.com"
                                    class="h-12 w-full border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-slate-950 focus:ring-1 focus:ring-slate-950"
                                />
                            </div>
                        </div>

                        <div class="space-y-2">
                            <label
                                for="password"
                                class="block text-sm font-medium text-slate-900"
                            >
                                Password
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
                                    placeholder="Create a password"
                                    class="h-12 w-full border border-slate-200 bg-white pl-10 pr-11 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-slate-950 focus:ring-1 focus:ring-slate-950"
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
                                    v-for="requirement in passwordRequirements"
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
                                    placeholder="Repeat your password"
                                    class="h-12 w-full border border-slate-200 bg-white pl-10 pr-11 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-slate-950 focus:ring-1 focus:ring-slate-950"
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

                        <p class="text-xs leading-5 text-slate-400">
                            By creating an account, you agree to our
                            <NuxtLink
                                to="/terms"
                                class="text-slate-700 hover:text-primary"
                            >
                                Terms
                            </NuxtLink>
                            and
                            <NuxtLink
                                to="/privacy"
                                class="text-slate-700 hover:text-primary"
                            >
                                Privacy Policy </NuxtLink
                            >.
                        </p>

                        <button
                            type="submit"
                            :disabled="loading"
                            class="flex h-12 w-full items-center justify-center gap-2 bg-slate-950 px-5 text-sm font-semibold text-white transition-colors hover:bg-primary disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <Loader2
                                v-if="loading"
                                class="h-4 w-4 animate-spin"
                            />

                            {{
                                loading ? "Creating account…" : "Create account"
                            }}

                            <ArrowRight v-if="!loading" class="h-4 w-4" />
                        </button>
                    </form>
                </div>

                <p class="mt-6 text-center text-sm text-slate-500">
                    Already have an account?
                    <NuxtLink
                        to="/auth/login"
                        class="ml-1 font-semibold text-slate-950 hover:text-primary"
                    >
                        Sign in
                    </NuxtLink>
                </p>
            </div>
        </div>
    </main>
</template>
