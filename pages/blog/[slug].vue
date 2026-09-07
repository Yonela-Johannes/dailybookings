<script setup lang="ts">
import { Calendar, Clock, ArrowLeft, Share2, Facebook, Twitter, Linkedin, Loader2 } from 'lucide-vue-next'
import { NAVIGATION_PATHS } from '~/utils/constants'

const route = useRoute()
const slug = route.params.slug as string

const { data: post, pending } = useAsyncData(`blog-${slug}`, () =>
  $fetch(`/api/blog/${slug}`)
)

useHead(() => ({
  title: post.value ? `${post.value.title} | DailyBookings Blog` : 'Loading article...',
}))

function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-ZA", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}
</script>

<template>
  <main class="min-h-screen bg-white pb-24">
    <div v-if="pending" class="flex items-center justify-center py-40">
        <Loader2 class="h-8 w-8 animate-spin text-primary" />
    </div>

    <div v-else-if="post">
        <!-- Hero Header -->
        <header class="bg-slate-50 border-b border-slate-200 py-20 lg:py-32">
            <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                <NuxtLink to="/blog" class="group inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-primary mb-10 transition-colors">
                    <ArrowLeft class="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
                    Back to all stories
                </NuxtLink>

                <div class="space-y-6">
                    <div class="flex items-center gap-4">
                        <span class="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                            {{ post.category?.name || "Local" }}
                        </span>
                        <span class="h-1 w-1 rounded-full bg-slate-200" />
                        <span class="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                            {{ formatDate(post.createdAt) }}
                        </span>
                    </div>

                    <h1 class="text-4xl md:text-6xl font-bold text-slate-950 tracking-tight leading-[1.05]">
                        {{ post.title }}
                    </h1>

                    <p class="text-xl text-slate-600 leading-relaxed max-w-3xl">
                        {{ post.excerpt }}
                    </p>
                </div>
            </div>
        </header>

        <!-- Main Content -->
        <div class="mx-auto max-w-4xl px-4 pt-16 sm:px-6 lg:px-8">
            <!-- Featured Image -->
            <div class="relative aspect-[16/9] overflow-hidden border border-slate-200 bg-slate-50 mb-16">
                <img
                    :src="post.featuredImage || 'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1400&q=85'"
                    :alt="post.title"
                    class="h-full w-full object-cover"
                />
            </div>

            <!-- Article Body -->
            <div class="grid lg:grid-cols-[1fr_120px] gap-16">
                <article class="prose prose-slate prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-img:border prose-img:border-slate-200">
                    <div v-html="post.content" />
                </article>

                <!-- Sidebar / Actions -->
                <aside class="hidden lg:block">
                    <div class="sticky top-32 space-y-12">
                        <div class="space-y-6">
                            <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Share</p>
                            <div class="flex flex-col gap-4">
                                <button class="flex h-11 w-11 items-center justify-center border border-slate-200 text-slate-600 transition hover:border-slate-950 hover:bg-slate-950 hover:text-white">
                                    <Facebook class="h-4 w-4" />
                                </button>
                                <button class="flex h-11 w-11 items-center justify-center border border-slate-200 text-slate-600 transition hover:border-slate-950 hover:bg-slate-950 hover:text-white">
                                    <Linkedin class="h-4 w-4" />
                                </button>
                                <button class="flex h-11 w-11 items-center justify-center border border-slate-200 text-slate-600 transition hover:border-slate-950 hover:bg-slate-950 hover:text-white">
                                    <Share2 class="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>

            <!-- Footer Author/CTA -->
            <footer class="mt-24 pt-16 border-t border-slate-200">
                <div class="flex flex-col items-center text-center max-w-2xl mx-auto">
                    <div class="h-16 w-16 items-center justify-center border border-slate-200 bg-slate-50 text-primary flex mb-6">
                        <Calendar class="h-8 w-8" stroke-width="1.5" />
                    </div>
                    <h2 class="text-2xl font-bold text-slate-950">Book your next experience</h2>
                    <p class="mt-4 text-slate-600 leading-7">
                        DailyBookings connects you with the best local professionals. Discover greatness and book your time today.
                    </p>
                    <NuxtLink :to="NAVIGATION_PATHS.DISCOVER" class="mt-10 h-12 inline-flex items-center justify-center bg-primary px-10 text-sm font-bold text-white transition hover:bg-slate-950">
                        Explore services
                    </NuxtLink>
                </div>
            </footer>
        </div>
    </div>

    <div v-else class="mx-auto max-w-4xl px-4 py-40 text-center">
      <h1 class="text-2xl font-bold text-slate-950 tracking-tight">Article not found</h1>
      <p class="mt-4 text-slate-600">The story you're looking for doesn't exist or has been moved.</p>
      <NuxtLink to="/blog" class="mt-10 inline-flex h-11 items-center justify-center border-b-2 border-primary text-sm font-bold text-slate-950 hover:text-primary transition-colors">
          Back to all stories
      </NuxtLink>
    </div>
  </main>
  <Footer />
</template>
