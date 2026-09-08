<script setup lang="ts">
import { Cookie } from "lucide-vue-next";

useHead({
    title: "Cookie Policy | DailyBookings",
    meta: [
        {
            name: "description",
            content:
                "How DailyBookings uses cookies to enhance your experience.",
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
                    Legal
                </p>
                <h1
                    class="text-4xl md:text-6xl font-bold text-slate-950 tracking-tight"
                >
                    Cookie Policy
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
                    <Cookie
                        class="h-8 w-8 text-primary shrink-0"
                        stroke-width="1.5"
                    />
                    <p class="m-0 text-sm font-medium leading-6">
                        We use cookies to make DailyBookings work better for
                        you. By using our site, you consent to our use of
                        cookies as described in this policy.
                    </p>
                </div>

                <section>
                    <h2>1. What are Cookies?</h2>
                    <p>
                        Cookies are small text files stored on your device when
                        you visit a website. They help us remember your
                        preferences, keep you logged in, and understand how you
                        interact with our platform.
                    </p>
                </section>

                <section>
                    <h2>2. How We Use Cookies</h2>
                    <p>
                        We use essential cookies for authentication and core
                        functionality. We also use analytical cookies to help us
                        improve the site's performance and marketing cookies to
                        show you relevant local services.
                    </p>
                </section>

                <section>
                    <h2>3. Managing Cookies</h2>
                    <p>
                        You can control or disable cookies through your browser
                        settings. However, please note that disabling certain
                        cookies may prevent you from using key features of
                        DailyBookings, such as staying signed in.
                    </p>
                </section>
            </article>
        </div>
    </main>
</template>
