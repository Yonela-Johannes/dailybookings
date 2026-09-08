export default defineNuxtRouteMiddleware(async (to) => {
  const user = useSupabaseUser()
  const { dbUser, fetchDbUser, syncUser } = useAuth()

  // 1. If no Supabase user, redirect to login
  if (!user.value) {
    if (to.path !== '/auth/login' && to.path !== '/auth/register') {
      return navigateTo({
        path: '/auth/login',
        query: { redirect: to.fullPath }
      })
    }
    return
  }

  // 2. We have a Supabase user. Ensure dbUser is populated.
  if (!dbUser.value) {
    await fetchDbUser()
  }

  // 3. If fetchDbUser failed but we still have a Supabase user, try sync.
  if (!dbUser.value && user.value) {
    console.log('Middleware: dbUser missing, attempting sync in flight...')
    const synced = await syncUser(user.value)
    if (!synced && !import.meta.server) {
      // If sync failed on client, something is wrong with the session/db
      return navigateTo('/auth/login')
    }
  }

  // 4. On server, if we still don't have a dbUser, allow SSR to continue
  // rather than redirect loop, as long as we have a Supabase session.
  // The client will handle final redirection if dbUser remains null.
  if (!dbUser.value) {
    if (import.meta.server) return
    return navigateTo('/auth/login')
  }

  const role = dbUser.value.role

  // 5. Automatic role-based dashboard redirection
  if (to.path === '/dashboard' || to.path === '/dashboard/') {
    if (role === 'PLATFORM_ADMIN') return navigateTo('/admin')
    if (role === 'BUSINESS_OWNER') return navigateTo('/business')
  }

  // 6. Access Control
  if (to.path.startsWith('/admin') && role !== 'PLATFORM_ADMIN') {
    return navigateTo(getHomeDashboardPath(role))
  }

  if (to.path.startsWith('/business') && role !== 'BUSINESS_OWNER' && role !== 'PLATFORM_ADMIN') {
    return navigateTo(getHomeDashboardPath(role))
  }
})

function getHomeDashboardPath(role: string) {
  switch (role) {
    case 'PLATFORM_ADMIN': return '/admin'
    case 'BUSINESS_OWNER': return '/business'
    default: return '/dashboard'
  }
}
