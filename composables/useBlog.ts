export function useBlogs(query?: { page?: number; limit?: number; category?: string }) {
  return useAsyncData('blogs', () => $fetch('/api/blog', { params: query }));
}

export function useBlog(slug: string) {
  return useAsyncData(`blog-${slug}`, () => $fetch(`/api/blog/${slug}`));
}
