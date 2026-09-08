import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const communities = await prisma.community.findMany({
      where: { status: 'ACTIVE' },
      include: {
        _count: {
          select: { venues: true, members: true }
        }
      },
      orderBy: { name: 'asc' }
    })

    return communities
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch communities'
    })
  }
})
