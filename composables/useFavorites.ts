export const useFavorites = () => {
  const { user } = useAuth()
  const favorites = useState<any[]>('favorites', () => [])
  const loading = ref(false)

  const fetchFavorites = async () => {
    if (!user.value) return
    loading.value = true
    try {
      const res = await $fetch<any>('/api/favorites')
      favorites.value = res.data
    } catch (err) {
      console.error('Failed to fetch favorites:', err)
    } finally {
      loading.value = false
    }
  }

  const toggleFavorite = async (venueId: string) => {
    if (!user.value) {
      return navigateTo('/auth/login')
    }

    try {
      const res = await $fetch<any>('/api/favorites', {
        method: 'POST',
        body: { venueId }
      })

      if (res.removed) {
        favorites.value = favorites.value.filter(f => (f.id || f.venueId) !== venueId)
      } else {
        // Refresh to get full venue data if needed, or just push a partial
        await fetchFavorites()
      }
      return res
    } catch (err) {
      console.error('Failed to toggle favorite:', err)
      throw err
    }
  }

  const isFavorite = (venueId: string) => {
    return favorites.value.some(f => (f.id || f.venueId) === venueId)
  }

  return {
    favorites,
    loading,
    fetchFavorites,
    toggleFavorite,
    isFavorite
  }
}
