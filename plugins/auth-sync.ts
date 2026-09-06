export default defineNuxtPlugin(() => {
  const user = useSupabaseUser()
  const { syncUser } = useAuth()

  watch(user, async (newUser) => {
    if (newUser) {
      await syncUser(newUser)
    }
  }, { immediate: true })
})
