<script setup lang="ts">
import { Lock } from "lucide-vue-next";

useHead({
    title: "Privacy Policy | DailyBookings",
    meta: [
        {
            name: "description",
            content:
                "How we handle and protect your personal information at DailyBookings.",
        },
    ],
});
</script>

<template>
    <main class="min-h-screen bg-white pb-24">
        <header class="bg-slate-50 border-b border-slate-200 py-20 lg:py-28">
            <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                <p
                    class="mb-5 text-[10px] font-bold uppercase tracking-[0.22em] text-primary"
                >
                    Privacy
                </p>
                <h1
                    class="text-4xl md:text-6xl font-bold text-slate-950 tracking-tight"
                >
                    Privacy Policy
                </h1>
                <p
                    class="mt-6 text-slate-500 font-semibold uppercase tracking-widest text-[10px]"
                >
                    Last Updated: May 2024
                </p>
            </div>
        </header>

        <div class="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
            <article
                class="prose prose-slate prose-lg max-w-none prose-headings:text-slate-950 prose-headings:font-bold prose-headings:tracking-tight prose-p:text-slate-600 prose-p:leading-8"
            >
                <div
                    class="flex items-start gap-6 p-8 border border-slate-200 bg-slate-50 mb-12"
                >
                    <Lock
                        class="h-8 w-8 text-primary shrink-0"
                        stroke-width="1.5"
                    />
                    <p class="m-0 text-sm font-medium leading-6">
                        Your privacy is vital to us. This policy explains what
                        data we collect, how we use it, and how we protect your
                        personal information in accordance with South African
                        law.
                    </p>
                </div>

                <section>
                    <h2>1. Information We Collect</h2>
                    <p>
                        When you use DailyBookings, we collect information
                        necessary to provide our service. This includes your
                        name, email address, phone number, and booking history.
                        If you are a business, we also collect business details
                        and verification documents.
                    </p>
                </section>

                <section>
                    <h2>2. How We Use Your Data</h2>
                    <p>
                        We use your data to facilitate bookings, process
                        payments, and improve our platform. Service providers
                        receive only the data required to perform the service
                        (e.g., your name and phone number). We do not sell your
                        personal data to third parties.
                    </p>
                </section>

                <section>
                    <h2>3. Data Security</h2>
                    <p>
                        We implement industry-standard security measures to
                        protect your data. All transactions are encrypted, and
                        we use secure authentication systems (Supabase Auth) to
                        manage user accounts.
                    </p>
                </section>

                <section>
                    <h2>4. Your Rights</h2>
                    <p>
                        Under POPIA (Protection of Personal Information Act),
                        you have the right to access, correct, or request the
                        deletion of your personal information. You can manage
                        most of your data directly through your account
                        settings.
                    </p>
                </section>
            </article>
        </div>
    </main>
</template>
