import type { Database } from '~/types/supabase';

export function useAuth() {
  const client = useSupabaseClient<Database>();
  const user = useSupabaseUser();

  const syncUser = async (supabaseUser: any) => {
    if (!supabaseUser) return;

    try {
      await $fetch('/api/auth/sync', {
        method: 'POST',
        body: {
          id: supabaseUser.id,
          email: supabaseUser.email,
          fullName: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name,
          avatarUrl: supabaseUser.user_metadata?.avatar_url,
          role: supabaseUser.user_metadata?.role
        }
      });
    } catch (err) {
      console.error('Failed to sync user to local database:', err);
    }
  };

  const login = async (credentials: { email: string; password: string }) => {
    const response = await client.auth.signInWithPassword(credentials);
    if (!response.error && response.data?.user) {
      await syncUser(response.data.user);
    }
    return response;
  };

  const register = async (credentials: { email: string; password: string; options?: any }) => {
    const response = await client.auth.signUp(credentials);
    if (!response.error && response.data?.user) {
      // Note: if email confirmation is enabled, user might be null or unauthenticated initially
      // but Supabase usually returns the user object here.
      await syncUser(response.data.user);
    }
    return response;
  };

  const logout = async () => {
    return await client.auth.signOut();
  };

  return {
    user,
    isAuthenticated: computed(() => !!user.value),
    login,
    register,
    logout,
    syncUser
  };
}
