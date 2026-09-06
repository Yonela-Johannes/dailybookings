import type { Database } from '~/types/supabase';

export function useAuth() {
  const client = useSupabaseClient<Database>();
  const user = useSupabaseUser();

  const login = async (credentials: { email: string; password: string }) => {
    return await client.auth.signInWithPassword(credentials);
  };

  const register = async (credentials: { email: string; password: string; options?: any }) => {
    const { data, error } = await client.auth.signUp(credentials);

    if (!error && data?.user) {
      // Sync user profile with our backend after successful signup
      await $fetch('/api/auth/sync', {
        method: 'POST',
        body: {
          userId: data.user.id,
          email: data.user.email
        }
      });
    }

    return { data, error };
  };

  const logout = async () => {
    return await client.auth.signOut();
  };

  return {
    user,
    isAuthenticated: computed(() => !!user.value),
    login,
    register,
    logout
  };
}
