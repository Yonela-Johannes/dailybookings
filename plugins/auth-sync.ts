export default defineNuxtPlugin((nuxtApp) => {
  const user = useSupabaseUser();
  const { syncUser, dbUser, isSyncing } = useAuth();

  // Watch Supabase user changes on the client only
  if (import.meta.client) {
    watch(
      user,
      async (newUser) => {
        // If we have a session but no local DB user, sync it.
        if (newUser && !dbUser.value && !isSyncing.value) {
          await syncUser(newUser);
        }
      },
      { immediate: true },
    );
  }
});
