import { prisma } from '~/server/utils/prisma'
import { serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  const user = await serverSupabaseUser(event)

  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Slug is required' })
  }

  try {
    const community = await prisma.community.findUnique({
      where: { slug },
      include: {
        venues: {
          where: { status: 'ACTIVE' },
          include: {
            category: true,
            address: true,
            media: {
              where: { featured: true },
              take: 1
            }
          }
        },
        members: user ? {
          where: { id: user.id },
          select: { id: true }
        } : false,
        _count: {
          select: { venues: true, members: true }
        }
      }
    })

    if (!community || community.status !== 'ACTIVE') {
      throw createError({ statusCode: 404, statusMessage: 'Community not found' })
    }

    return {
      ...community,
      isMember: community.members?.length > 0
    }
  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
