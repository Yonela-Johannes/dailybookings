<script setup lang="ts">
import { ArrowRight, ArrowUpRight } from "lucide-vue-next";

interface BlogPost {
    title: string;
    excerpt: string;
    category: string;
    date: string;
    readTime: string;
    image: string;
    to: string;
}

const posts: BlogPost[] = [
    {
        title: "How to find the right professional for you",
        excerpt:
            "A simple guide to choosing trusted service providers and getting the most from your booking.",
        category: "Guides",
        date: "Sep 04, 2026",
        readTime: "5 min read",
        image: "/images/blog/find-the-right-professional.jpg",
        to: "/blog/how-to-find-the-right-professional",
    },
    {
        title: "The best local services to book this month",
        excerpt:
            "From beauty and wellness to home services, discover what's worth booking right now.",
        category: "Discover",
        date: "Aug 28, 2026",
        readTime: "4 min read",
        image: "/images/blog/local-services.jpg",
        to: "/blog/best-local-services",
    },
    {
        title: "Why booking local makes a difference",
        excerpt:
            "Meet the people behind local businesses and see how your next booking can support your community.",
        category: "Community",
        date: "Aug 21, 2026",
        readTime: "6 min read",
        image: "/images/blog/booking-local.jpg",
        to: "/blog/booking-local",
    },
];

const featuredPost = posts[0];
const secondaryPosts = posts.slice(1);
</script>

<template>
    <section class="border-t border-slate-200 bg-white">
        <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <!-- Header -->
            <div
                class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
            >
                <div class="max-w-2xl">
                    <p
                        class="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-primary"
                    >
                        From DailyBookings
                    </p>

                    <h2
                        class="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl"
                    >
                        Ideas, guides & local stories.
                    </h2>

                    <p
                        class="mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-base"
                    >
                        Discover useful advice, local businesses and inspiration
                        for your next booking.
                    </p>
                </div>

                <NuxtLink
                    to="/blog"
                    class="group inline-flex h-10 w-fit shrink-0 items-center gap-2 border border-slate-200 px-4 text-sm font-semibold text-slate-900 transition-colors hover:border-slate-900 hover:bg-slate-950 hover:text-white"
                >
                    Visit the blog

                    <ArrowUpRight
                        class="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                </NuxtLink>
            </div>

            <!-- Blog grid -->
            <div class="mt-10 grid gap-6 lg:grid-cols-[1.25fr_1fr]">
                <!-- Featured article -->
                <NuxtLink
                    :to="featuredPost.to"
                    class="group relative min-h-[440px] overflow-hidden bg-slate-900 lg:min-h-[520px]"
                >
                    <img
                        :src="featuredPost.image"
                        :alt="featuredPost.title"
                        loading="lazy"
                        class="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />

                    <div
                        class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/5"
                    />

                    <div class="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                        <div class="flex items-center gap-3">
                            <span
                                class="bg-white px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-950"
                            >
                                {{ featuredPost.category }}
                            </span>

                            <span class="text-xs text-white/70">
                                {{ featuredPost.readTime }}
                            </span>
                        </div>

                        <h3
                            class="mt-4 max-w-2xl text-2xl font-bold tracking-tight text-white sm:text-3xl"
                        >
                            {{ featuredPost.title }}
                        </h3>

                        <p
                            class="mt-3 max-w-xl text-sm leading-6 text-white/70"
                        >
                            {{ featuredPost.excerpt }}
                        </p>

                        <div
                            class="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white"
                        >
                            Read article

                            <ArrowRight
                                class="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                            />
                        </div>
                    </div>
                </NuxtLink>

                <!-- Secondary articles -->
                <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
                    <NuxtLink
                        v-for="post in secondaryPosts"
                        :key="post.to"
                        :to="post.to"
                        class="group grid grid-cols-[140px_1fr] border border-slate-200 bg-white sm:grid-cols-[180px_1fr] lg:grid-cols-[200px_1fr]"
                    >
                        <!-- Image -->
                        <div
                            class="relative min-h-[180px] overflow-hidden bg-slate-100"
                        >
                            <img
                                :src="post.image"
                                :alt="post.title"
                                loading="lazy"
                                class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                            />
                        </div>

                        <!-- Content -->
                        <div class="flex flex-col justify-center p-5 sm:p-6">
                            <div class="flex items-center gap-3">
                                <span
                                    class="text-[10px] font-bold uppercase tracking-[0.12em] text-primary"
                                >
                                    {{ post.category }}
                                </span>

                                <span class="text-[11px] text-slate-400">
                                    {{ post.readTime }}
                                </span>
                            </div>

                            <h3
                                class="mt-3 text-base font-semibold leading-5 tracking-tight text-slate-950 transition-colors group-hover:text-primary sm:text-lg"
                            >
                                {{ post.title }}
                            </h3>

                            <p
                                class="mt-2 line-clamp-2 text-xs leading-5 text-slate-500 sm:text-sm"
                            >
                                {{ post.excerpt }}
                            </p>

                            <div
                                class="mt-4 flex items-center gap-1.5 text-xs font-semibold text-slate-900"
                            >
                                Read more

                                <ArrowRight
                                    class="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1"
                                />
                            </div>
                        </div>
                    </NuxtLink>
                </div>
            </div>

            <!-- Bottom categories -->
            <div
                class="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-slate-200 pt-6"
            >
                <span
                    class="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400"
                >
                    Explore
                </span>

                <NuxtLink
                    to="/blog/guides"
                    class="text-sm text-slate-500 transition-colors hover:text-primary"
                >
                    Guides
                </NuxtLink>

                <NuxtLink
                    to="/blog/beauty"
                    class="text-sm text-slate-500 transition-colors hover:text-primary"
                >
                    Beauty
                </NuxtLink>

                <NuxtLink
                    to="/blog/wellness"
                    class="text-sm text-slate-500 transition-colors hover:text-primary"
                >
                    Wellness
                </NuxtLink>

                <NuxtLink
                    to="/blog/business"
                    class="text-sm text-slate-500 transition-colors hover:text-primary"
                >
                    Business
                </NuxtLink>

                <NuxtLink
                    to="/blog/community"
                    class="text-sm text-slate-500 transition-colors hover:text-primary"
                >
                    Community
                </NuxtLink>
            </div>
        </div>
    </section>
</template>
