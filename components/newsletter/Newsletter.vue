<script setup lang="ts">
import { ArrowRight, Loader2, Mail } from "lucide-vue-next";
import { ref } from "vue";

const email = ref("");
const submitted = ref(false);
const loading = ref(false);

const handleSubmit = async () => {
    const value = email.value.trim();

    if (!value || loading.value) return;

    loading.value = true;

    try {
        await $fetch("/api/newsletter/subscribe", {
            method: "POST",
            body: { email: value },
        });

        submitted.value = true;
        email.value = "";
    } catch (error: any) {
        console.error("Newsletter signup failed:", error);
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <section class="border-t border-slate-200 bg-white">
        <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <div
                class="grid border border-slate-200 bg-slate-50 lg:grid-cols-[1fr_1.15fr]"
            >
                <!-- Content -->
                <div
                    class="border-b border-slate-200 p-7 sm:p-10 lg:border-b-0 lg:border-r lg:p-12"
                >
                    <div
                        class="flex h-11 w-11 items-center justify-center border border-slate-200 bg-white text-primary"
                    >
                        <Mail class="h-5 w-5" />
                    </div>

                    <p
                        class="mt-8 text-[10px] font-bold uppercase tracking-[0.18em] text-primary"
                    >
                        Stay in the know
                    </p>

                    <h2
                        class="mt-3 max-w-lg text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl"
                    >
                        Good things are worth knowing about.
                    </h2>

                    <p
                        class="mt-4 max-w-md text-sm leading-6 text-slate-500 sm:text-base"
                    >
                        Get local recommendations, new businesses, useful tips
                        and the latest from DailyBookings.
                    </p>
                </div>

                <!-- Form -->
                <div class="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
                    <div v-if="!submitted">
                        <p class="text-sm font-semibold text-slate-950">
                            Join the DailyBookings community
                        </p>

                        <p class="mt-2 text-sm leading-6 text-slate-500">
                            No spam. Just useful things worth opening.
                        </p>

                        <form class="mt-7" @submit.prevent="handleSubmit">
                            <label for="newsletter-email" class="sr-only">
                                Email address
                            </label>

                            <div
                                class="flex border border-slate-300 bg-white flex-row"
                            >
                                <input
                                    id="newsletter-email"
                                    v-model="email"
                                    type="email"
                                    autocomplete="email"
                                    required
                                    placeholder="Your email address"
                                    class="h-12 min-w-0 flex-1 border-0 bg-transparent px-4 text-sm text-slate-950 outline-none placeholder:text-slate-400 focus:ring-0"
                                />

                                <button
                                    type="submit"
                                    :disabled="loading"
                                    class="group hidden md:flex h-12 shrink-0 items-center justify-center gap-2 bg-slate-950 px-6 text-sm font-semibold text-white transition-colors hover:bg-primary disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {{ loading ? "Joining..." : "Subscribe" }}

                                    <ArrowRight
                                        v-if="!loading"
                                        class="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                                    />
                                </button>

                                <button
                                    type="submit"
                                    :disabled="loading"
                                    class="group md:hidden flex h-12 shrink-0 items-center justify-center gap-2 bg-slate-950 px-6 text-sm font-semibold text-white transition-colors hover:bg-primary disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <Loader2
                                        v-if="loading"
                                        class="h-4 w-4 animate-spin"
                                    />

                                    <ArrowRight
                                        v-else
                                        class="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                                    />
                                </button>
                            </div>

                            <p
                                class="mt-4 text-[11px] leading-5 text-slate-400"
                            >
                                By subscribing, you agree to receive
                                DailyBookings updates. You can unsubscribe
                                anytime.
                            </p>
                        </form>
                    </div>

                    <!-- Success -->
                    <div v-else class="py-4">
                        <div
                            class="flex h-11 w-11 items-center justify-center border border-primary bg-primary text-white"
                        >
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                class="h-5 w-5"
                            >
                                <path
                                    stroke-linecap="square"
                                    stroke-linejoin="miter"
                                    d="m5 12 4 4L19 6"
                                />
                            </svg>
                        </div>

                        <h3
                            class="mt-6 text-2xl font-bold tracking-tight text-slate-950"
                        >
                            You're on the list.
                        </h3>

                        <p
                            class="mt-2 max-w-md text-sm leading-6 text-slate-500"
                        >
                            We'll send the good stuff your way. Thanks for
                            joining DailyBookings.
                        </p>

                        <button
                            type="button"
                            class="mt-6 text-sm font-semibold text-slate-950 underline decoration-slate-300 underline-offset-4 transition-colors hover:text-primary"
                            @click="submitted = false"
                        >
                            Subscribe another email
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
