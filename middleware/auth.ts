export default defineNuxtRouteMiddleware(async (to) => {
  const user = useSupabaseUser()
  const { dbUser, fetchDbUser, syncUser } = useAuth()

  // 1. If no Supabase user, redirect to login
  if (!user.value) {
    return navigateTo({
      path: '/auth/login',
      query: { redirect: to.fullPath }
    })
  }

  // 2. Try to get DB user
  if (!dbUser.value) {
    await fetchDbUser()
  }

  // 3. If still no dbUser but we have a Supabase user, try to sync
  // This handles the edge case where the user is authenticated in Supabase
  // but their record was missing or the server-side /api/me failed.
  if (!dbUser.value && user.value) {
    console.log('Middleware: dbUser missing, attempting sync for', user.value.email)
    await syncUser(user.value)
  }

  // 4. Final check: if still no dbUser, redirect to login
  if (!dbUser.value) {
    console.warn('Middleware: Access denied, no DB user found after sync attempt.')
    return navigateTo('/auth/login')
  }

  const role = dbUser.value.role

  // 5. Redirect from generic dashboard to role-specific one
  if (to.path === '/dashboard' || to.path === '/dashboard/') {
    if (role === 'PLATFORM_ADMIN') return navigateTo('/admin')
    if (role === 'BUSINESS_OWNER') return navigateTo('/business')
  }

  // 6. Protect Admin routes
  if (to.path.startsWith('/admin') && role !== 'PLATFORM_ADMIN') {
    return navigateTo(getHomeDashboardPath(role))
  }

  // 7. Protect Business routes
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
