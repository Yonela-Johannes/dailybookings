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

const loading = ref(false);
const error = ref("");
const sent = ref(false);

const route = useRoute();

const email = computed(() => {
    return typeof route.query.email === "string" ? route.query.email : "";
});

async function resendVerification() {
    if (!email.value || loading.value) return;

    loading.value = true;
    error.value = "";

    const { error: authError } = await client.auth.resend({
        type: "signup",
        email: email.value,
    });

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
                        <Mail class="h-6 w-6" />
                    </div>

                    <h1
                        class="mt-6 text-3xl font-semibold tracking-tight text-slate-950"
                    >
                        Check your email
                    </h1>

                    <p class="mt-3 text-sm leading-6 text-slate-500">
                        We've sent a verification link to your email address.
                    </p>
                </div>

                <div
                    class="border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
                >
                    <div class="text-center">
                        <div
                            class="mx-auto flex h-14 w-14 items-center justify-center bg-primary/10 text-primary"
                        >
                            <CheckCircle2 class="h-7 w-7" />
                        </div>

                        <p v-if="email" class="mt-5 text-sm text-slate-500">
                            Verification email sent to
                            <span class="font-medium text-slate-950">
                                {{ email }}
                            </span>
                        </p>

                        <p v-else class="mt-5 text-sm leading-6 text-slate-500">
                            Open the verification email we sent you and follow
                            the link to activate your account.
                        </p>

                        <div
                            v-if="error"
                            role="alert"
                            class="mt-5 border border-red-200 bg-red-50 px-4 py-3 text-left text-sm text-red-700"
                        >
                            {{ error }}
                        </div>

                        <button
                            v-if="email"
                            type="button"
                            :disabled="loading || sent"
                            class="mt-6 inline-flex h-11 items-center justify-center gap-2 border border-slate-200 px-5 text-sm font-semibold text-slate-950 hover:border-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
                            @click="resendVerification"
                        >
                            <Loader2
                                v-if="loading"
                                class="h-4 w-4 animate-spin"
                            />

                            {{
                                sent
                                    ? "Verification email sent"
                                    : "Resend verification email"
                            }}
                        </button>
                    </div>
                </div>

                <div class="mt-6 text-center">
                    <NuxtLink
                        to="/auth/login"
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
