<script setup lang="ts">
import {
  Plus,
  Edit2,
  Trash2,
  FileText,
} from 'lucide-vue-next'
import { format, parseISO } from 'date-fns'

definePageMeta({
  layout: 'admin',
  middleware: 'auth',
})

const {
  data: blogResponse,
  pending,
  refresh,
} = await useFetch('/api/admin/blog')

const { data: categoriesResponse } = await useFetch('/api/blog/categories')

const blogs = computed(() => blogResponse.value?.data || [])

const meta = computed(() => {
  return (
    blogResponse.value?.meta || {
      total: 0,
      page: 1,
      totalPages: 1,
    }
  )
})

const categories = computed(() => categoriesResponse.value || [])

const isSlideoverOpen = ref(false)
const isSaving = ref(false)
const editingBlog = ref<any>(null)

const form = ref({
  title: '',
  slug: '',
  content: '',
  excerpt: '',
  featuredImage: '',
  categoryId: '',
  published: false,
})

const openCreate = () => {
  editingBlog.value = null

  form.value = {
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    featuredImage: '',
    categoryId: categories.value[0]?.id || '',
    published: false,
  }

  isSlideoverOpen.value = true
}

const openEdit = (blog: any) => {
  editingBlog.value = blog

  form.value = {
    title: blog.title,
    slug: blog.slug,
    content: blog.content,
    excerpt: blog.excerpt || '',
    featuredImage: blog.featuredImage || '',
    categoryId: blog.categoryId || '',
    published: blog.published,
  }

  isSlideoverOpen.value = true
}

const closeSlideover = () => {
  if (isSaving.value) return

  isSlideoverOpen.value = false
}

const handleSave = async () => {
  if (isSaving.value) return

  isSaving.value = true

  try {
    if (editingBlog.value) {
      await $fetch(`/api/admin/blog/${editingBlog.value.id}`, {
        method: 'PATCH',
        body: form.value,
      })
    } else {
      await $fetch('/api/admin/blog', {
        method: 'POST',
        body: form.value,
      })
    }

    await refresh()

    isSlideoverOpen.value = false
  } catch (error) {
    console.error('Failed to save blog', error)
  } finally {
    isSaving.value = false
  }
}

const handleDelete = async (id: string) => {
  const confirmed = window.confirm(
    'Are you sure you want to delete this article?',
  )

  if (!confirmed) return

  try {
    await $fetch(`/api/admin/blog/${id}`, {
      method: 'DELETE',
    })

    await refresh()
  } catch (error) {
    console.error('Failed to delete blog', error)
  }
}

const updateSlug = () => {
  if (editingBlog.value) return

  form.value.slug = form.value.title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
</script>

<template>
  <div class="space-y-8">
    <!-- Header -->
    <div
      class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
    >
      <div>
        <h1
          class="text-3xl font-extrabold uppercase italic tracking-tight text-white"
        >
          Editorial Journal
        </h1>

        <p
          class="text-[10px] font-bold uppercase tracking-widest text-slate-500"
        >
          Marketplace Stories & Guides
        </p>
      </div>

      <button
        type="button"
        class="flex items-center gap-2 rounded-xl bg-teal-500 px-6 py-2.5 text-xs font-black uppercase tracking-widest text-slate-950 shadow-lg shadow-teal-500/20 transition-all hover:bg-teal-400"
        @click="openCreate"
      >
        <Plus class="h-5 w-5" />

        New Article
      </button>
    </div>

    <!-- Loading -->
    <div
      v-if="pending"
      class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
    >
      <div
        v-for="i in 3"
        :key="i"
        class="h-96 animate-pulse rounded-[32px] bg-slate-900"
      />
    </div>

    <!-- Empty -->
    <div
      v-else-if="blogs.length === 0"
      class="rounded-[32px] border border-slate-800 bg-slate-900/40 p-20 text-center"
    >
      <FileText class="mx-auto mb-4 h-16 w-16 text-slate-800" />

      <h3 class="text-xl font-bold text-white">
        No articles found
      </h3>

      <p class="text-slate-500">
        Start writing your first story to inspire the community.
      </p>
    </div>

    <!-- Blog Grid -->
    <div
      v-else
      class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
    >
      <article
        v-for="blog in blogs"
        :key="blog.id"
        class="group flex flex-col overflow-hidden rounded-[32px] border border-slate-800 bg-slate-900/40 transition-all duration-500 hover:border-teal-500/30"
      >
        <!-- Image -->
        <div class="relative aspect-video overflow-hidden bg-slate-800">
          <img
            v-if="blog.featuredImage"
            :src="blog.featuredImage"
            :alt="blog.title"
            class="h-full w-full object-cover opacity-60 transition-opacity duration-700 group-hover:opacity-100"
          />

          <div
            v-else
            class="flex h-full w-full items-center justify-center text-slate-700"
          >
            <FileText class="h-12 w-12" />
          </div>

          <div class="absolute left-4 top-4">
            <span
              :class="[
                'rounded-full border px-3 py-1 text-[9px] font-black uppercase tracking-widest',
                blog.published
                  ? 'border-teal-500/20 bg-teal-500/10 text-teal-500'
                  : 'border-slate-700 bg-slate-800 text-slate-500',
              ]"
            >
              {{ blog.published ? 'Published' : 'Draft' }}
            </span>
          </div>
        </div>

        <!-- Content -->
        <div class="flex flex-1 flex-col p-8">
          <div
            class="mb-2 text-[9px] font-black uppercase tracking-widest text-teal-500"
          >
            {{ blog.category?.name || 'Uncategorized' }}
          </div>

          <h2
            class="mb-4 line-clamp-2 text-xl font-bold leading-tight tracking-tight text-white"
          >
            {{ blog.title }}
          </h2>

          <p
            class="mb-8 line-clamp-2 text-sm font-medium text-slate-500"
          >
            {{ blog.excerpt || 'No summary available.' }}
          </p>

          <div
            class="mt-auto flex items-center justify-between border-t border-slate-800 pt-8"
          >
            <div
              class="text-[10px] font-black uppercase tracking-widest text-slate-600"
            >
              {{
                blog.createdAt
                  ? format(parseISO(blog.createdAt), 'MMM d, yyyy')
                  : '—'
              }}
            </div>

            <div class="flex items-center gap-2">
              <button
                type="button"
                class="rounded-xl border border-slate-700 bg-slate-800 p-2.5 text-slate-400 transition-all hover:text-white"
                @click="openEdit(blog)"
              >
                <Edit2 class="h-4 w-4" />
              </button>

              <button
                type="button"
                class="rounded-xl border border-slate-700 bg-slate-800 p-2.5 text-slate-400 transition-all hover:text-red-400"
                @click="handleDelete(blog.id)"
              >
                <Trash2 class="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </article>
    </div>

    <!-- Slideover -->
    <UiSlideover
      :open="isSlideoverOpen"
      :title="editingBlog ? 'Update Article' : 'Create Article'"
      @close="closeSlideover"
    >
      <!--
        IMPORTANT:
        The default content and #footer slot are siblings.

        #footer must NOT be nested inside the form.
      -->
      <form
        id="blog-article-form"
        class="space-y-8 p-1"
        @submit.prevent="handleSave"
      >
        <div class="space-y-6">
          <!-- Featured Image -->
          <div class="space-y-2">
            <label
              class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400"
            >
              Featured Image URL
            </label>

            <input
              v-model="form.featuredImage"
              type="url"
              placeholder="https://example.com/image.jpg"
              class="w-full rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 text-sm font-bold outline-none"
            />
          </div>

          <!-- Title -->
          <div class="space-y-2">
            <label
              class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400"
            >
              Title
            </label>

            <input
              v-model="form.title"
              type="text"
              required
              class="w-full rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 text-sm font-bold outline-none"
              @input="updateSlug"
            />
          </div>

          <!-- Slug -->
          <div class="space-y-2">
            <label
              class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400"
            >
              Slug
            </label>

            <input
              v-model="form.slug"
              type="text"
              required
              class="w-full rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 font-mono text-sm font-bold outline-none"
            />
          </div>

          <!-- Category -->
          <div class="space-y-2">
            <label
              class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400"
            >
              Category
            </label>

            <select
              v-model="form.categoryId"
              class="w-full rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 text-sm font-bold outline-none"
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
            <label
              class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400"
            >
              Excerpt (Summary)
            </label>

            <textarea
              v-model="form.excerpt"
              rows="3"
              class="w-full resize-none rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 text-sm font-bold outline-none"
            />
          </div>

          <!-- Content -->
          <div class="space-y-2">
            <label
              class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400"
            >
              Full Content (Markdown)
            </label>

            <textarea
              v-model="form.content"
              rows="10"
              required
              class="w-full resize-none rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 text-sm font-bold outline-none"
            />
          </div>

          <!-- Published -->
          <div
            class="flex items-center justify-between rounded-2xl bg-slate-50 p-5"
          >
            <div>
              <div class="text-sm font-black text-slate-900">
                Published Status
              </div>

              <p
                class="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-500"
              >
                Visibility on the public site
              </p>
            </div>

            <input
              v-model="form.published"
              type="checkbox"
              class="h-6 w-6 rounded-lg border-slate-300 text-teal-500 focus:ring-teal-500"
            />
          </div>
        </div>
      </form>

      <!-- MUST be direct child of UiSlideover -->
      <template #footer>
        <div class="flex gap-4 border-t border-slate-100 p-8">
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
            class="flex flex-1 items-center justify-center rounded-xl bg-teal-500 px-5 py-3 text-sm font-black text-slate-950 transition-colors hover:bg-teal-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {{
              isSaving
                ? 'Processing...'
                : editingBlog
                  ? 'Update'
                  : 'Publish'
            }}
          </button>
        </div>
      </template>
    </UiSlideover>
  </div>
</template>
