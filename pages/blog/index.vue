<script setup lang="ts">
import { ArrowRight, Search, Loader2, Calendar } from "lucide-vue-next";
import { ref, onMounted } from "vue";
import { NAVIGATION_PATHS } from "~/utils/constants";

useHead({
    title: "Blog | DailyBookings",
    meta: [
        {
            name: "description",
            content:
                "Guides, local stories, and fresh perspectives on booking services in South Africa.",
        },
    ],
});

const route = useRoute();
const category = computed(() => route.query.category as string);

const {
    data: articles,
    refresh,
    pending,
} = useAsyncData(
    "articles",
    () =>
        $fetch("/api/blog", {
            params: {
                category: category.value,
            },
        }),
    {
        watch: [category],
    },
);

function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-ZA", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}
</script>

<template>
    <main class="min-h-screen bg-white">
        <!-- Journal Header -->
        <section class="border-b border-slate-200 bg-slate-50 py-24 lg:py-32">
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div
                    class="flex flex-col justify-between gap-12 lg:flex-row lg:items-end"
                >
                    <div class="max-w-3xl">
                        <p
                            class="mb-5 text-[10px] font-bold uppercase tracking-[0.22em] text-primary"
                        >
                            The DailyBookings Blog
                        </p>

                        <h1
                            class="text-4xl font-bold leading-[1.05] tracking-tight text-slate-950 md:text-6xl lg:text-7xl"
                        >
                            Stories, thoughts & local guides.
                        </h1>

                        <p
                            class="mt-7 max-w-2xl text-lg leading-relaxed text-slate-600 md:text-xl"
                        >
                            Thoughtful guides, honest conversations and fresh
                            perspectives on local services, entrepreneurship and
                            discovering the best of South Africa.
                        </p>
                    </div>

                    <div class="w-full lg:w-80">
                        <div class="relative">
                            <Search
                                class="absolute left-0 top-1/2 -translate-y-1/2 text-slate-400"
                                size="18"
                                stroke-width="1.7"
                            />

                            <input
                                placeholder="Search articles..."
                                class="h-12 w-full rounded-none border-0 border-b border-slate-200 bg-transparent pl-9 text-sm text-slate-950 outline-none transition-colors focus:border-primary placeholder:text-slate-400"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Featured Article -->
        <section
            v-if="!pending && articles?.length"
            class="border-b border-slate-200 py-20 lg:py-32"
        >
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <NuxtLink :to="`/blog/${articles[0].slug}`" class="group block">
                    <div
                        class="grid items-center gap-10 lg:grid-cols-[1.5fr_1fr] lg:gap-20"
                    >
                        <!-- Image -->
                        <div
                            class="relative aspect-[16/9] overflow-hidden border border-slate-200 bg-slate-100"
                        >
                            <img
                                :src="
                                    articles[0].featuredImage ||
                                    'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1200&q=80'
                                "
                                :alt="articles[0].title"
                                class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                            />
                            <div
                                class="absolute inset-0 bg-slate-950/5 transition-opacity duration-500 group-hover:opacity-0"
                            />
                        </div>

                        <!-- Content -->
                        <div class="max-w-xl">
                            <p
                                class="mb-5 text-[10px] font-bold uppercase tracking-[0.2em] text-primary"
                            >
                                Featured Story
                                <span class="mx-2 text-slate-200">·</span>
                                {{ articles[0].category?.name || "Local" }}
                            </p>

                            <h2
                                class="text-3xl font-bold leading-[1.1] tracking-tight text-slate-950 transition-colors duration-300 group-hover:text-primary md:text-5xl"
                            >
                                {{ articles[0].title }}
                            </h2>

                            <p
                                v-if="articles[0].excerpt"
                                class="mt-7 text-lg leading-relaxed text-slate-600"
                            >
                                {{ articles[0].excerpt }}
                            </p>

                            <div
                                class="group/link mt-9 inline-flex items-center gap-3 border-b-2 border-slate-950 pb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-950 transition-colors duration-300 group-hover:border-primary group-hover:text-primary"
                            >
                                Read Full Story
                                <ArrowRight
                                    size="14"
                                    class="transition-transform duration-300 group-hover/link:translate-x-1"
                                />
                            </div>
                        </div>
                    </div>
                </NuxtLink>
            </div>
        </section>

        <!-- Article Grid -->
        <section class="py-20 lg:py-32">
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div v-if="pending" class="flex justify-center py-24">
                    <Loader2 class="h-8 w-8 animate-spin text-primary" />
                </div>

                <div v-else-if="articles && articles.length > 1">
                    <div
                        class="mb-14 flex items-end justify-between border-b border-slate-200 pb-7"
                    >
                        <div>
                            <p
                                class="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-primary"
                            >
                                Latest Stories
                            </p>

                            <h2
                                class="text-3xl font-bold tracking-tight text-slate-950"
                            >
                                From the Blog
                            </h2>
                        </div>

                        <span
                            class="hidden text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 sm:block"
                        >
                            {{ articles.length }} Stories
                        </span>
                    </div>

                    <div
                        class="grid gap-x-10 gap-y-16 md:grid-cols-2 lg:grid-cols-3 lg:gap-x-14 lg:gap-y-20"
                    >
                        <NuxtLink
                            v-for="article in articles.slice(1)"
                            :key="article.id"
                            :to="`/blog/${article.slug}`"
                            class="group flex flex-col"
                        >
                            <div
                                class="relative mb-7 aspect-[4/3] overflow-hidden border border-slate-200 bg-slate-100"
                            >
                                <img
                                    :src="
                                        article.featuredImage ||
                                        'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80'
                                    "
                                    :alt="article.title"
                                    class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                                />
                                <div
                                    class="absolute inset-0 bg-slate-950/5 transition-opacity duration-500 group-hover:opacity-0"
                                />
                            </div>

                            <p
                                class="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-primary"
                            >
                                {{ article.category?.name || "Local" }}
                            </p>

                            <h3
                                class="text-2xl font-bold leading-tight tracking-tight text-slate-950 transition-colors duration-300 group-hover:text-primary"
                            >
                                {{ article.title }}
                            </h3>

                            <p
                                v-if="article.excerpt"
                                class="mt-4 line-clamp-3 text-sm leading-relaxed text-slate-500"
                            >
                                {{ article.excerpt }}
                            </p>

                            <div
                                class="mt-7 flex items-center justify-between border-t border-slate-100 pt-5 text-[10px] font-bold uppercase tracking-[0.16em]"
                            >
                                <span class="text-slate-400">
                                    {{ formatDate(article.createdAt) }}
                                </span>

                                <span
                                    class="flex items-center gap-2 text-slate-950 transition-colors group-hover:text-primary"
                                >
                                    Read More
                                    <ArrowRight size="13" />
                                </span>
                            </div>
                        </NuxtLink>
                    </div>
                </div>

                <div v-else-if="!pending" class="py-24 text-center">
                    <p class="text-lg text-slate-500">
                        No stories found yet. Come back soon.
                    </p>
                </div>
            </div>
        </section>
    </main>
</template>
