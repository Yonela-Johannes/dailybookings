<script setup lang="ts">
import { Facebook, Instagram, Mail, MapPin, Phone, Send, Loader2, ArrowRight } from "lucide-vue-next";
import { ref } from "vue";

useHead({
    title: "Contact Us | DailyBookings",
    meta: [
        { name: "description", content: "Have a question or need help? Get in touch with the DailyBookings team." }
    ]
});

const form = ref({
    name: "",
    email: "",
    subject: "",
    message: ""
});

const loading = ref(false);
const submitted = ref(false);

async function handleSubmit() {
    if (loading.value) return;
    loading.value = true;

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    loading.value = false;
    submitted.value = true;
    form.value = { name: "", email: "", subject: "", message: "" };
}
</script>

<template>
    <main class="min-h-screen bg-white">
        <!-- Header -->
        <section class="border-b border-slate-200 bg-slate-50 py-20 lg:py-28">
            <div class="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
                <p class="mb-5 text-[10px] font-bold uppercase tracking-[0.22em] text-primary">
                    Get In Touch
                </p>

                <h1 class="mx-auto max-w-4xl text-4xl font-bold leading-[1.1] tracking-tight text-slate-950 md:text-6xl lg:text-7xl">
                    We're here to help you.
                </h1>

                <p class="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-slate-600 md:text-xl">
                    Whether you're a customer with a question or a business looking to join our community, our team is ready to assist.
                </p>
            </div>
        </section>

        <!-- Main Content -->
        <section class="py-20 lg:py-32">
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div class="grid gap-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
                    <!-- Contact Information -->
                    <div>
                        <p class="mb-4 text-[10px] font-bold uppercase tracking-[0.22em] text-primary">
                            Direct Support
                        </p>

                        <h2 class="max-w-md text-3xl font-bold leading-tight tracking-tight text-slate-950 md:text-4xl">
                            Let's start a conversation.
                        </h2>

                        <p class="mt-6 max-w-md leading-relaxed text-slate-600">
                            Have a question about a booking, need technical assistance, or interested in partnership opportunities? Reach out and we'll get back to you within 24 hours.
                        </p>

                        <div class="mt-12 border-t border-slate-200">
                            <!-- Email -->
                            <div class="flex gap-6 border-b border-slate-200 py-8">
                                <div class="flex h-11 w-11 shrink-0 items-center justify-center border border-slate-200 bg-slate-50 text-primary">
                                    <Mail size={20} strokeWidth={1.8} />
                                </div>

                                <div>
                                    <h3 class="text-sm font-bold text-slate-950 uppercase tracking-wider">
                                        Email Us
                                    </h3>

                                    <div class="mt-3 space-y-1">
                                        <p class="text-sm text-slate-600">
                                            hello@dailybookings.co.za
                                        </p>
                                        <p class="text-sm text-slate-600">
                                            support@dailybookings.co.za
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <!-- Phone -->
                            <div class="flex gap-6 border-b border-slate-200 py-8">
                                <div class="flex h-11 w-11 shrink-0 items-center justify-center border border-slate-200 bg-slate-50 text-primary">
                                    <Phone size={20} strokeWidth={1.8} />
                                </div>

                                <div>
                                    <h3 class="text-sm font-bold text-slate-950 uppercase tracking-wider">
                                        Call Us
                                    </h3>

                                    <p class="mt-3 text-sm text-slate-600">
                                        +27 (0) 21 456 7890
                                    </p>

                                    <p class="mt-3 text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
                                        Mon — Fri, 9am — 5pm
                                    </p>
                                </div>
                            </div>

                            <!-- Location -->
                            <div class="flex gap-6 py-8">
                                <div class="flex h-11 w-11 shrink-0 items-center justify-center border border-slate-200 bg-slate-50 text-primary">
                                    <MapPin size={20} strokeWidth={1.8} />
                                </div>

                                <div>
                                    <h3 class="text-sm font-bold text-slate-950 uppercase tracking-wider">
                                        Main Office
                                    </h3>

                                    <p class="mt-3 max-w-xs text-sm leading-relaxed text-slate-600">
                                        123 Bree Street, Cape Town CBD<br />
                                        South Africa, 8001
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Contact Form -->
                    <div class="border border-slate-200 bg-slate-50 p-8 sm:p-10 lg:p-14">
                        <div v-if="!submitted">
                            <div class="mb-10">
                                <p class="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-primary">
                                    Send A Message
                                </p>

                                <h2 class="text-3xl font-bold tracking-tight text-slate-950">
                                    How can we help?
                                </h2>
                            </div>

                            <form class="space-y-7" @submit.prevent="handleSubmit">
                                <div class="grid gap-7 sm:grid-cols-2">
                                    <div class="space-y-2">
                                        <label for="full-name" class="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                                            Full Name
                                        </label>

                                        <input
                                            id="full-name"
                                            v-model="form.name"
                                            type="text"
                                            required
                                            placeholder="Your name"
                                            class="h-12 w-full border-0 border-b border-slate-200 bg-white px-4 text-sm text-slate-950 outline-none transition-colors focus:border-primary placeholder:text-slate-400"
                                        />
                                    </div>

                                    <div class="space-y-2">
                                        <label for="email" class="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                                            Email Address
                                        </label>

                                        <input
                                            id="email"
                                            v-model="form.email"
                                            type="email"
                                            required
                                            placeholder="you@example.com"
                                            class="h-12 w-full border-0 border-b border-slate-200 bg-white px-4 text-sm text-slate-950 outline-none transition-colors focus:border-primary placeholder:text-slate-400"
                                        />
                                    </div>
                                </div>

                                <div class="space-y-2">
                                    <label for="subject" class="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                                        Subject
                                    </label>

                                    <input
                                        id="subject"
                                        v-model="form.subject"
                                        type="text"
                                        required
                                        placeholder="What is this regarding?"
                                        class="h-12 w-full border-0 border-b border-slate-200 bg-white px-4 text-sm text-slate-950 outline-none transition-colors focus:border-primary placeholder:text-slate-400"
                                    />
                                </div>

                                <div class="space-y-2">
                                    <label for="message" class="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                                        Message
                                    </label>

                                    <textarea
                                        id="message"
                                        v-model="form.message"
                                        required
                                        placeholder="Tell us more about your request..."
                                        class="min-h-[160px] w-full resize-y border-0 border-b border-slate-200 bg-white px-4 py-4 text-sm text-slate-950 outline-none transition-colors focus:border-primary placeholder:text-slate-400"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    :disabled="loading"
                                    class="group flex h-14 w-full items-center justify-center bg-primary text-sm font-bold text-white transition-colors hover:bg-slate-950 disabled:opacity-50"
                                >
                                    <Loader2 v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
                                    <span>{{ loading ? 'Sending Message...' : 'Send Message' }}</span>
                                    <Send v-if="!loading" class="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-0.5" />
                                </button>
                            </form>
                        </div>

                        <!-- Success State -->
                        <div v-else class="flex flex-col items-center justify-center py-10 text-center">
                            <div class="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <Send class="h-8 w-8" />
                            </div>
                            <h3 class="mt-8 text-2xl font-bold text-slate-950">Message Sent</h3>
                            <p class="mt-4 max-w-xs text-slate-600">
                                Thank you for reaching out. We've received your message and will be in touch shortly.
                            </p>
                            <button
                                type="button"
                                class="mt-10 text-sm font-bold text-primary underline underline-offset-4 hover:text-slate-950"
                                @click="submitted = false"
                            >
                                Send another message
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>
</template>
