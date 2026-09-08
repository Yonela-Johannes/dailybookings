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

      // On client, ensure we pass the token if cookies are being unreliable
      const headers: Record<string, string> = {};
      if (import.meta.client) {
        const { data: { session } } = await client.auth.getSession();
        if (session?.access_token) {
          headers['Authorization'] = `Bearer ${session.access_token}`;
        }
      }

      console.log(`fetchDbUser: calling /api/me... Client: ${import.meta.client}`);
      const data = await fetcher("/api/me", {
        headers,
        // Ensure we don't cache 401s
        key: `me-${Date.now()}`
      } as any);
      dbUser.value = data;
      return data;
    } catch (err: any) {
      console.warn(`fetchDbUser failed: ${err.statusCode} ${err.statusMessage}`);

      // If we are on the client and getting 401, we might need to force a session refresh
      if (import.meta.client && err.statusCode === 401) {
        console.log("401 detected on client, attempting to refresh session...");
        await client.auth.getSession();
      }

      if (err.statusCode === 404 && user.value) {
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

      const headers: Record<string, string> = {};
      if (import.meta.client) {
        const { data: { session } } = await client.auth.getSession();
        if (session?.access_token) {
          headers['Authorization'] = `Bearer ${session.access_token}`;
        }
      }

      const data = await fetcher("/api/auth/sync", {
        method: "POST",
        headers,
        body: {
          id,
          email: supabaseUser.email,
          fullName:
            supabaseUser.user_metadata?.full_name ||
            supabaseUser.user_metadata?.name ||
            (supabaseUser.user_metadata?.first_name ? `${supabaseUser.user_metadata.first_name} ${supabaseUser.user_metadata.last_name || ''}` : null),
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
