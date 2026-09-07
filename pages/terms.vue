<script setup lang="ts">
import { ShieldCheck } from "lucide-vue-next";

useHead({
    title: "Terms of Service | DailyBookings",
    meta: [
        { name: "description", content: "Our terms and conditions for using the DailyBookings platform." }
    ]
});
</script>

<template>
  <main class="min-h-screen bg-white pb-24">
    <header class="bg-slate-50 border-b border-slate-200 py-20 lg:py-28">
        <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <p class="mb-5 text-[10px] font-bold uppercase tracking-[0.22em] text-primary">
                Legal
            </p>
            <h1 class="text-4xl md:text-6xl font-bold text-slate-950 tracking-tight">Terms of Service</h1>
            <p class="mt-6 text-slate-500 font-semibold uppercase tracking-widest text-[10px]">Last Updated: May 2024</p>
        </div>
    </header>

    <div class="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <article class="prose prose-slate prose-lg max-w-none prose-headings:text-slate-950 prose-headings:font-bold prose-headings:tracking-tight prose-p:text-slate-600 prose-p:leading-8">
        <div class="flex items-start gap-6 p-8 border border-slate-200 bg-slate-50 mb-12">
            <ShieldCheck class="h-8 w-8 text-primary shrink-0" stroke-width="1.5" />
            <p class="m-0 text-sm font-medium leading-6">
                Please read these terms carefully. By using DailyBookings, you agree to these rules. We've tried to keep them as straightforward as possible.
            </p>
        </div>

        <section>
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using DailyBookings, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services. We reserve the right to update these terms at any time.
          </p>
        </section>

        <section>
          <h2>2. Description of Service</h2>
          <p>
            DailyBookings provides a digital marketplace connecting customers with local service providers in South Africa. We facilitate discovery, scheduling, and payment but do not provide the actual services (such as haircuts, massages, or lessons). Each service is a direct contract between you and the provider.
          </p>
        </section>

        <section>
          <h2>3. User Accounts</h2>
          <p>
            To book a service, you may need to create an account. You are responsible for keeping your login details secure and for all actions taken through your account. You must provide accurate and truthful information during registration.
          </p>
        </section>

        <section>
          <h2>4. Bookings and Cancellations</h2>
          <p>
            When you book an appointment, you agree to the provider's specific pricing, duration, and cancellation policy. Cancellation policies vary by business and are clearly displayed on the venue's profile page. DailyBookings is not responsible for provider no-shows or quality of service.
          </p>
        </section>

        <section>
          <h2>5. Payments</h2>
          <p>
            Payments are handled through secure third-party processors. Depending on the provider, you may pay a deposit online or the full amount. In cases of refunds, the provider's cancellation policy will determine the eligibility and amount.
          </p>
        </section>
      </article>
    </div>
  </main>
  <Footer />
</template>
