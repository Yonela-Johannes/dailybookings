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

  // 2. We have a Supabase user. Ensure dbUser is populated from the DB.
  // We force a fetch if dbUser is missing to ensure we have latest roles.
  if (!dbUser.value) {
    console.log(`Middleware: Fetching DB user for ${user.value.email}...`)
    await fetchDbUser()
  }

  // 3. If fetchDbUser failed (404) but we have a Supabase session, sync them.
  if (!dbUser.value && user.value) {
    console.log('Middleware: dbUser not found, triggering sync...')
    const synced = await syncUser(user.value)
    if (!synced && !import.meta.server) {
      console.error('Middleware: Sync failed on client.')
      return navigateTo('/auth/login')
    }
  }

  // 4. Final check: if still no dbUser, something is wrong.
  if (!dbUser.value) {
    if (import.meta.server) return
    return navigateTo('/auth/login')
  }

  const role = dbUser.value.role
  console.log(`Middleware: User ${dbUser.value.email} has role ${role}. Navigating to ${to.path}`)

  // 5. Automatic role-based dashboard redirection
  if (to.path === '/dashboard' || to.path === '/dashboard/') {
    if (role === 'PLATFORM_ADMIN') return navigateTo('/admin')
    if (role === 'BUSINESS_OWNER') return navigateTo('/business')
  }

  // 6. Access Control
  if (to.path.startsWith('/admin') && role !== 'PLATFORM_ADMIN') {
    console.warn(`Middleware: Denied access to ${to.path} for role ${role}`)
    return navigateTo(getHomeDashboardPath(role))
  }

  if (to.path.startsWith('/business') && role !== 'BUSINESS_OWNER' && role !== 'PLATFORM_ADMIN') {
    console.warn(`Middleware: Denied access to ${to.path} for role ${role}`)
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
