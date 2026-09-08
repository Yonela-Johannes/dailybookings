<script setup lang="ts">
import { Plus, Edit2, Trash2, FileText, ArrowUpRight, Search as SearchIcon, ChevronLeft, ChevronRight, Loader2 } from "lucide-vue-next";
import { format, parseISO } from "date-fns";
import Head from "~/components/head/Head.vue";

definePageMeta({
    layout: "admin",
    middleware: "auth",
});

const search = ref("");
const page = ref(1);

const {
    data: blogResponse,
    pending,
    refresh,
} = await useFetch("/api/admin/blog", {
    query: {
        search,
        page,
        limit: 10,
    },
    watch: [search, page],
});

const { data: categoriesResponse } = await useFetch("/api/blog/categories");

const blogs = computed(() => blogResponse.value?.data || []);

const meta = computed(() => {
    return (
        blogResponse.value?.meta || {
            total: 0,
            page: 1,
            totalPages: 1,
        }
    );
});

const categories = computed(() => categoriesResponse.value || []);

const isSlideoverOpen = ref(false);
const isSaving = ref(false);
const editingBlog = ref<any>(null);

const form = ref({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    featuredImage: "",
    categoryId: "",
    published: false,
});

const openCreate = () => {
    editingBlog.value = null;

    form.value = {
        title: "",
        slug: "",
        content: "",
        excerpt: "",
        featuredImage: "",
        categoryId: categories.value[0]?.id || "",
        published: false,
    };

    isSlideoverOpen.value = true;
};

const openEdit = (blog: any) => {
    editingBlog.value = blog;

    form.value = {
        title: blog.title,
        slug: blog.slug,
        content: blog.content,
        excerpt: blog.excerpt || "",
        featuredImage: blog.featuredImage || "",
        categoryId: blog.categoryId || "",
        published: blog.published,
    };

    isSlideoverOpen.value = true;
};

const closeSlideover = () => {
    if (isSaving.value) return;

    isSlideoverOpen.value = false;
};

const handleSave = async () => {
    if (isSaving.value) return;

    isSaving.value = true;

    try {
        if (editingBlog.value) {
            await $fetch(`/api/admin/blog/${editingBlog.value.id}`, {
                method: "PATCH",
                body: form.value,
            });
        } else {
            await $fetch("/api/admin/blog", {
                method: "POST",
                body: form.value,
            });
        }

        await refresh();
        isSlideoverOpen.value = false;
    } catch (error) {
        console.error("Failed to save blog", error);
    } finally {
        isSaving.value = false;
    }
};

const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
        "Are you sure you want to delete this article?",
    );

    if (!confirmed) return;

    try {
        await $fetch(`/api/admin/blog/${id}`, {
            method: "DELETE",
        });

        await refresh();
    } catch (error) {
        console.error("Failed to delete blog", error);
    }
};

const updateSlug = () => {
    if (editingBlog.value) return;

    form.value.slug = form.value.title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
};

const togglePublished = async (blog: any) => {
    try {
        await $fetch(`/api/admin/blog/${blog.id}`, {
            method: "PATCH",
            body: { published: !blog.published },
        });

        refresh();
    } catch (error) {
        console.error("Failed to update blog status", error);
    }
};
</script>

<template>
    <div class="space-y-10">
        <Head title="Blogs" description="Stories, guides & local insights" />

        <!-- Page actions -->
        <div class="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
            <div class="flex-1 max-w-md relative">
                <SearchIcon class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                    v-model="search"
                    type="text"
                    placeholder="Search articles..."
                    class="h-11 w-full border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none transition-colors focus:border-slate-900"
                />
            </div>

            <button
                type="button"
                class="group flex h-11 items-center gap-2  bg-slate-950 px-5 text-sm font-bold text-white transition-all duration-300 hover:bg-teal-500"
                @click="openCreate"
            >
                <Plus
                    class="h-4 w-4 transition-transform duration-300 group-hover:rotate-90"
                />
                New article
            </button>
        </div>

        <!-- Loading -->
        <div
            v-if="pending"
            class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
            <div
                v-for="i in 3"
                :key="i"
                class="overflow-hidden  border border-slate-200 bg-white"
            >
                <div class="aspect-video animate-pulse bg-slate-100" />

                <div class="space-y-4 p-6">
                    <div class="h-3 w-24 animate-pulse rounded bg-slate-100" />
                    <div class="h-6 w-3/4 animate-pulse rounded bg-slate-100" />
                    <div
                        class="h-4 w-full animate-pulse rounded bg-slate-100"
                    />
                    <div class="h-4 w-2/3 animate-pulse rounded bg-slate-100" />
                </div>
            </div>
        </div>

        <!-- Empty -->
        <div
            v-else-if="blogs.length === 0"
            class=" border border-slate-200 bg-white px-6 py-24 text-center"
        >
            <div
                class="mx-auto mb-6 flex h-14 w-14 items-center justify-center  bg-slate-50"
            >
                <FileText class="h-6 w-6 text-slate-400" />
            </div>

            <h3 class="text-xl font-bold tracking-tight text-slate-900">
                No articles yet
            </h3>

            <p class="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Create your first story, guide or local insight for the
                DailyBookings community.
            </p>

            <button
                type="button"
                class="mt-6 inline-flex h-10 items-center gap-2  bg-slate-950 px-5 text-sm font-bold text-white transition-colors hover:bg-teal-500"
                @click="openCreate"
            >
                <Plus class="h-4 w-4" />
                Create article
            </button>
        </div>

        <!-- Blog grid -->
        <div v-if="!pending" class="space-y-10">
            <div
                v-if="blogs.length > 0"
                class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
                <article
                    v-for="blog in blogs"
                    :key="blog.id"
                    class="group flex flex-col overflow-hidden  border border-slate-200 bg-white transition-all duration-500 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-900/[0.04]"
                >
                    <!-- Image -->
                    <div class="relative aspect-[4/3] overflow-hidden bg-slate-100">
                        <img
                            v-if="blog.featuredImage"
                            :src="blog.featuredImage"
                            :alt="blog.title"
                            class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.025]"
                        />

                        <div
                            v-else
                            class="flex h-full w-full items-center justify-center"
                        >
                            <FileText class="h-10 w-10 text-slate-300" />
                        </div>

                        <!-- Status -->
                        <div class="absolute left-4 top-4">
                            <button
                                type="button"
                                @click="togglePublished(blog)"
                                class="inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-bold text-slate-700 shadow-sm backdrop-blur transition-all hover:scale-105 active:scale-95"
                                :title="`Click to ${blog.published ? 'unpublish' : 'publish'}`"
                            >
                                <span
                                    :class="[
                                        'h-1.5 w-1.5 rounded-full',
                                        blog.published
                                            ? 'bg-teal-500'
                                            : 'bg-slate-300',
                                    ]"
                                />

                                {{ blog.published ? "Published" : "Draft" }}
                            </button>
                        </div>

                        <!-- View & Edit -->
                        <div class="absolute right-4 top-4 flex gap-2">
                            <NuxtLink
                                :to="`/blog/${blog.slug}`"
                                target="_blank"
                                class="flex h-9 w-9 items-center justify-center bg-white/95 text-slate-700 opacity-0 shadow-sm backdrop-blur transition-all duration-300 hover:bg-slate-950 hover:text-white group-hover:opacity-100"
                                title="View live article"
                            >
                                <ArrowUpRight class="h-4 w-4" />
                            </NuxtLink>

                            <button
                                type="button"
                                aria-label="Edit article"
                                class="flex h-9 w-9 items-center justify-center bg-white/95 text-slate-700 opacity-0 shadow-sm backdrop-blur transition-all duration-300 hover:bg-slate-950 hover:text-white group-hover:opacity-100"
                                @click="openEdit(blog)"
                            >
                                <Edit2 class="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    <!-- Content -->
                    <div class="flex flex-1 flex-col p-6">
                        <div class="mb-3 flex items-center justify-between gap-4">
                            <span
                                class="text-[10px] font-bold uppercase tracking-[0.16em] text-teal-600"
                            >
                                {{ blog.category?.name || "Uncategorized" }}
                            </span>

                            <span class="text-xs text-slate-400">
                                {{
                                    blog.createdAt
                                        ? format(
                                              parseISO(blog.createdAt),
                                              "MMM d, yyyy",
                                          )
                                        : "—"
                                }}
                            </span>
                        </div>

                        <h2
                            class="line-clamp-2 text-xl font-bold leading-tight tracking-tight text-slate-950 transition-colors duration-300 group-hover:text-teal-600"
                        >
                            {{ blog.title }}
                        </h2>

                        <p
                            class="mt-3 line-clamp-3 text-sm leading-6 text-slate-500"
                        >
                            {{ blog.excerpt || "No summary available." }}
                        </p>

                        <div
                            class="mt-6 flex items-center justify-between border-t border-slate-100 pt-5"
                        >
                            <button
                                type="button"
                                class="group/link inline-flex items-center gap-2 text-xs font-bold text-slate-900 transition-colors hover:text-teal-600"
                                @click="openEdit(blog)"
                            >
                                Edit article

                                <ArrowUpRight
                                    class="h-3.5 w-3.5 transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                                />
                            </button>

                            <button
                                type="button"
                                aria-label="Delete article"
                                class="flex h-9 w-9 items-center justify-center  text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
                                @click="handleDelete(blog.id)"
                            >
                                <Trash2 class="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </article>
            </div>

            <!-- Empty -->
            <div
                v-else
                class=" border border-slate-200 bg-white px-6 py-24 text-center"
            >
                <div
                    class="mx-auto mb-6 flex h-14 w-14 items-center justify-center  bg-slate-50"
                >
                    <FileText class="h-6 w-6 text-slate-400" />
                </div>

                <h3 class="text-xl font-bold tracking-tight text-slate-900">
                    No articles found
                </h3>

                <p class="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                    Try adjusting your search or create a new article.
                </p>
            </div>

            <!-- Pagination -->
            <div
                v-if="meta.totalPages > 1"
                class="flex flex-col gap-4 border-t border-slate-200 bg-slate-50/50 px-5 py-5 sm:flex-row sm:items-center sm:justify-between"
            >
                <p class="text-xs text-slate-500">
                    Showing page
                    <strong class="font-semibold text-slate-900">
                        {{ meta.page }}
                    </strong>
                    of
                    <strong class="font-semibold text-slate-900">
                        {{ meta.totalPages }}
                    </strong>
                    · {{ meta.total }} articles
                </p>

                <div class="flex items-center">
                    <button
                        type="button"
                        :disabled="page === 1"
                        aria-label="Previous page"
                        class="flex h-9 w-9 items-center justify-center border border-slate-200 bg-white text-slate-600 transition-colors hover:border-slate-900 hover:bg-slate-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                        @click="page--"
                    >
                        <ChevronLeft class="h-4 w-4" />
                    </button>

                    <div
                        class="flex h-9 items-center border-y border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700"
                    >
                        {{ meta.page }}
                    </div>

                    <button
                        type="button"
                        :disabled="page >= meta.totalPages"
                        aria-label="Next page"
                        class="flex h-9 w-9 items-center justify-center border border-slate-200 bg-white text-slate-600 transition-colors hover:border-slate-900 hover:bg-slate-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                        @click="page++"
                    >
                        <ChevronRight class="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>

        <!-- Slideover -->
        <UiSlideover
            :show="isSlideoverOpen"
            :title="editingBlog ? 'Update Article' : 'Create Article'"
            @close="closeSlideover"
        >
            <form
                id="blog-article-form"
                class="space-y-8 p-1"
                @submit.prevent="handleSave"
            >
                <!-- Featured image -->
                <div class="space-y-3">
                    <div>
                        <label class="text-sm font-bold text-slate-900">
                            Cover image
                        </label>

                        <p class="mt-1 text-xs text-slate-500">
                            Use a strong image that represents the article.
                        </p>
                    </div>

                    <div
                        v-if="form.featuredImage"
                        class="group/preview relative aspect-video overflow-hidden  border border-slate-200 bg-slate-100"
                    >
                        <img
                            :src="form.featuredImage"
                            alt=""
                            class="h-full w-full object-cover"
                        />

                        <div
                            class="absolute inset-0 flex items-center justify-center bg-slate-950/40 opacity-0 transition-opacity duration-300 group-hover/preview:opacity-100"
                        >
                            <button
                                type="button"
                                class="flex h-10 w-10 items-center justify-center  bg-white text-red-500 shadow-xl transition-colors hover:bg-red-500 hover:text-white"
                                @click="form.featuredImage = ''"
                            >
                                <Trash2 class="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    <UiMediaUpload
                        v-else
                        entity-type="BLOG"
                        label="Upload cover image"
                        @uploaded="(data) => (form.featuredImage = data.url)"
                    />
                </div>

                <!-- Title -->
                <div class="space-y-2">
                    <label class="text-sm font-bold text-slate-900">
                        Title
                    </label>

                    <input
                        v-model="form.title"
                        type="text"
                        required
                        placeholder="Give your article a clear title"
                        class="w-full  border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
                        @input="updateSlug"
                    />
                </div>

                <!-- Slug -->
                <div class="space-y-2">
                    <label class="text-sm font-bold text-slate-900">
                        URL slug
                    </label>

                    <input
                        v-model="form.slug"
                        type="text"
                        required
                        placeholder="article-url"
                        class="w-full  border border-slate-200 bg-white px-4 py-3.5 font-mono text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
                    />
                </div>

                <!-- Category -->
                <div class="space-y-2">
                    <label class="text-sm font-bold text-slate-900">
                        Category
                    </label>

                    <select
                        v-model="form.categoryId"
                        class="w-full  border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition-all focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
                    >
                        <option
                            v-for="cat in categories"
                            :key="cat.id"
                            :value="cat.id"
                        >
                            {{ cat.name }}
                        </option>
                    </select>
                </div>

                <!-- Excerpt -->
                <div class="space-y-2">
                    <label class="text-sm font-bold text-slate-900">
                        Short description
                    </label>

                    <textarea
                        v-model="form.excerpt"
                        rows="3"
                        placeholder="A short summary of the article..."
                        class="w-full resize-none  border border-slate-200 bg-white px-4 py-3.5 text-sm leading-6 text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
                    />
                </div>

                <!-- Content -->
                <div class="space-y-2">
                    <label class="text-sm font-bold text-slate-900">
                        Article content
                    </label>

                    <textarea
                        v-model="form.content"
                        rows="12"
                        required
                        placeholder="Write your article..."
                        class="w-full resize-none  border border-slate-200 bg-white px-4 py-3.5 text-sm leading-6 text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
                    />
                </div>

                <!-- Published -->
                <div
                    class="flex items-center justify-between  border border-slate-200 bg-slate-50 p-5"
                >
                    <div>
                        <div class="text-sm font-bold text-slate-900">
                            Publish article
                        </div>

                        <p class="mt-1 text-xs leading-5 text-slate-500">
                            Published articles are visible on DailyBookings.
                        </p>
                    </div>

                    <input
                        v-model="form.published"
                        type="checkbox"
                        class="h-5 w-5 rounded border-slate-300 text-teal-500 focus:ring-teal-500"
                    />
                </div>
            </form>

            <template #footer>
                <div class="flex gap-3 border-t border-slate-100 p-6">
                    <UiButton
                        label="Cancel"
                        type="secondary"
                        class="flex-1"
                        :disabled="isSaving"
                        @click="closeSlideover"
                    />

                    <button
                        type="submit"
                        form="blog-article-form"
                        :disabled="isSaving"
                        class="flex h-11 flex-1 items-center justify-center  bg-slate-950 px-5 text-sm font-bold text-white transition-colors hover:bg-teal-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {{
                            isSaving
                                ? "Saving..."
                                : editingBlog
                                  ? "Save changes"
                                  : "Publish article"
                        }}
                    </button>
                </div>
            </template>
        </UiSlideover>
    </div>
</template>
