import { prisma } from '~/server/utils/prisma'
import { isBusinessOwner } from '~/server/utils/auth'
import { z } from 'zod'

const querySchema = z.object({
  page: z.string().optional().transform(v => parseInt(v || '1')),
  limit: z.string().optional().transform(v => parseInt(v || '20')),
  venueId: z.string().uuid().optional()
})

export default defineEventHandler(async (event) => {
  const user = await isBusinessOwner(event)
  const query = getQuery(event)

  try {
    const { venueId } = querySchema.parse(query)

    const categories = await prisma.serviceCategory.findMany({
      where: {
        ...(venueId && { venueId }),
        venue: user.role === 'PLATFORM_ADMIN' ? {} : {
          business: {
            ownerId: user.id
          }
        }
      },
      include: {
        services: {
          where: { deletedAt: null },
          orderBy: { name: 'asc' }
        },
        venue: {
          select: {
            name: true,
            id: true
          }
        }
      },
      orderBy: { name: 'asc' }
    })

    return {
      data: categories
    }
  } catch (error: any) {
    throw createError({
      statusCode: 400,
      statusMessage: error.message
    })
  }
})
