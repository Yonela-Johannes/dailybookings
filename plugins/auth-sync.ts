export default defineNuxtPlugin((nuxtApp) => {
  const user = useSupabaseUser();
  const { syncUser, fetchDbUser, dbUser, isSyncing } = useAuth();

  // Watch Supabase user changes on the client
  if (import.meta.client) {
    watch(
      user,
      async (newUser) => {
        if (newUser && !dbUser.value && !isSyncing.value) {
          await syncUser(newUser);
        }
      },
      { immediate: true },
    );
  }

  // On server, if we have a user but no dbUser, fetch it
  if (import.meta.server && user.value && !dbUser.value) {
    nuxtApp.hook('app:created', async () => {
      await fetchDbUser();
    });
  }
});
