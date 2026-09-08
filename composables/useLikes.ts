export const useLikes = () => {
  const { user } = useAuth()
  const likes = useState<any[]>('user-likes', () => [])
  const loading = ref(false)

  const fetchLikes = async () => {
    if (!user.value) return
    loading.value = true
    try {
      const res = await $fetch<any>('/api/likes')
      likes.value = res.data
    } catch (err) {
      console.error('Failed to fetch likes:', err)
    } finally {
      loading.value = false
    }
  }

  const toggleLike = async (venueId: string) => {
    if (!user.value) {
      return navigateTo('/auth/login')
    }

    try {
      const res = await $fetch<any>('/api/likes', {
        method: 'POST',
        body: { venueId }
      })

      if (!res.liked) {
        likes.value = likes.value.filter(l => (l.id || l.venueId) !== venueId)
      } else {
        await fetchLikes()
      }
      return res
    } catch (err) {
      console.error('Failed to toggle like:', err)
      throw err
    }
  }

  const isLiked = (venueId: string) => {
    return likes.value.some(l => (l.id || l.venueId) === venueId)
  }

  return {
    likes,
    loading,
    fetchLikes,
    toggleLike,
    isLiked
  }
}
