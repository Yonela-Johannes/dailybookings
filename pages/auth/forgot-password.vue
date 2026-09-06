<script setup lang="ts">
import { ref } from "vue";
import {
    ArrowLeft,
    ArrowRight,
    CalendarDays,
    CheckCircle2,
    Loader2,
    Mail,
} from "lucide-vue-next";

const client = useSupabaseClient();

const email = ref("");
const loading = ref(false);
const error = ref("");
const sent = ref(false);

async function handleResetRequest() {
    if (loading.value) return;

    loading.value = true;
    error.value = "";

    const { error: authError } = await client.auth.resetPasswordForEmail(
        email.value.trim(),
        {
            redirectTo: `${window.location.origin}/reset-password`,
        },
    );

    if (authError) {
        error.value = authError.message;
        loading.value = false;
        return;
    }

    sent.value = true;
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
                    <div
                        class="mx-auto flex h-12 w-12 items-center justify-center border border-slate-200 bg-white text-primary shadow-sm"
                    >
                        <CalendarDays class="h-6 w-6" />
                    </div>

                    <h1
                        class="mt-6 text-3xl font-semibold tracking-tight text-slate-950"
                    >
                        Forgot your password?
                    </h1>

                    <p class="mt-3 text-sm leading-6 text-slate-500">
                        Enter your email and we'll send you a secure link to
                        reset your password.
                    </p>
                </div>

                <div
                    class="border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
                >
                    <div v-if="sent" class="py-4 text-center">
                        <CheckCircle2
                            class="mx-auto h-10 w-10 text-primary"
                            stroke-width="1.6"
                        />

                        <h2 class="mt-5 text-lg font-semibold text-slate-950">
                            Check your inbox
                        </h2>

                        <p class="mt-2 text-sm leading-6 text-slate-500">
                            If an account exists for
                            <span class="font-medium text-slate-950">
                                {{ email }} </span
                            >, you'll receive a password reset link shortly.
                        </p>

                        <NuxtLink
                            to="/login"
                            class="mt-7 inline-flex h-11 items-center gap-2 bg-slate-950 px-5 text-sm font-semibold text-white hover:bg-primary"
                        >
                            Back to sign in
                            <ArrowRight class="h-4 w-4" />
                        </NuxtLink>
                    </div>

                    <form
                        v-else
                        class="space-y-5"
                        @submit.prevent="handleResetRequest"
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
                                    class="h-12 w-full border border-slate-200 pl-10 pr-4 text-sm outline-none placeholder:text-slate-400 focus:border-slate-950 focus:ring-1 focus:ring-slate-950"
                                />
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

                            {{ loading ? "Sending link…" : "Send reset link" }}

                            <ArrowRight v-if="!loading" class="h-4 w-4" />
                        </button>
                    </form>
                </div>

                <div class="mt-6 text-center">
                    <NuxtLink
                        to="/login"
                        class="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-950"
                    >
                        <ArrowLeft class="h-4 w-4" />
                        Back to sign in
                    </NuxtLink>
                </div>
            </div>
        </div>
    </main>
</template>
