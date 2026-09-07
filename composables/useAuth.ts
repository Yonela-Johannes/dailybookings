import type { Database } from "~/types/supabase";
import type { UserRole } from "@prisma/client";

export function useAuth() {
  const client = useSupabaseClient<Database>();
  const user = useSupabaseUser();
  const dbUser = useState<any>("dbUser", () => null);
  const isSyncing = useState<boolean>("isSyncing", () => false);

  const fetchDbUser = async () => {
    if (!user.value) {
      dbUser.value = null;
      return null;
    }

    try {
      const fetcher = import.meta.server ? useRequestFetch() : $fetch;
      const data = await fetcher("/api/me");
      dbUser.value = data;
      return data;
    } catch (err: any) {
      if (err.statusCode === 404 && user.value) {
        // User exists in Supabase but not in our DB, try to sync
        return await syncUser(user.value);
      }

      if (err.statusCode !== 401) {
        console.error("Failed to fetch DB user:", err);
      }
      return null;
    }
  };

  const syncUser = async (supabaseUser: any) => {
    const id = supabaseUser?.id ?? supabaseUser?.sub;
    if (!id || isSyncing.value) return dbUser.value;

    isSyncing.value = true;
    try {
      const fetcher = import.meta.server ? useRequestFetch() : $fetch;
      const data = await fetcher("/api/auth/sync", {
        method: "POST",
        body: {
          id,
          email: supabaseUser.email,
          fullName:
            supabaseUser.user_metadata?.full_name ||
            supabaseUser.user_metadata?.name ||
            supabaseUser.user_metadata?.first_name ? `${supabaseUser.user_metadata.first_name} ${supabaseUser.user_metadata.last_name || ''}` : null,
          avatarUrl: supabaseUser.user_metadata?.avatar_url,
          role: supabaseUser.user_metadata?.role,
        },
      });
      dbUser.value = data;
      return data;
    } catch (err) {
      console.error("Failed to sync user to local database:", err);
      return null;
    } finally {
      isSyncing.value = false;
    }
  };

  const login = async (credentials: { email: string; password: string }) => {
    const response = await client.auth.signInWithPassword(credentials);
    if (!response.error && response.data?.user) {
      await syncUser(response.data.user);
    }
    return response;
  };

  const register = async (credentials: {
    email: string;
    password: string;
    options?: any;
  }) => {
    const response = await client.auth.signUp(credentials);
    if (!response.error && response.data?.user) {
      await syncUser(response.data.user);
    }
    return response;
  };

  const logout = async () => {
    const response = await client.auth.signOut();
    dbUser.value = null;
    return response;
  };

  const role = computed(() => dbUser.value?.role as UserRole | undefined);

  return {
    user,
    dbUser,
    role,
    isSyncing,
    isAuthenticated: computed(() => !!user.value),
    login,
    register,
    logout,
    syncUser,
    fetchDbUser,
  };
}
