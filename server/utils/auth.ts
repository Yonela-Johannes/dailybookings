import { H3Event } from 'h3'
import { serverSupabaseUser } from '#supabase/server'
import { prisma } from './prisma'
import { UserRole } from '@prisma/client'

export const requireAuth = async (event: H3Event) => {
  const user = await serverSupabaseUser(event)
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id }
  })

  if (!dbUser) {
    throw createError({
      statusCode: 404,
      statusMessage: 'User not found'
    })
  }

  return dbUser
}

export const requireRole = async (event: H3Event, roles: UserRole[]) => {
  const user = await requireAuth(event)

  if (!roles.includes(user.role)) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden: Insufficient permissions'
    })
  }

  return user
}

export const isBusinessOwner = async (event: H3Event) => {
  return await requireRole(event, [UserRole.BUSINESS_OWNER, UserRole.PLATFORM_ADMIN])
}

export const isPlatformAdmin = async (event: H3Event) => {
  return await requireRole(event, [UserRole.PLATFORM_ADMIN])
}
