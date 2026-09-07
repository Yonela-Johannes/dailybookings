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
    const { page, limit, venueId } = querySchema.parse(query)
    const skip = (page - 1) * limit

    const where = {...(venueId && { venueId }),
      ...(user.role !== 'PLATFORM_ADMIN' && {
        venue: {
          business: {
            ownerId: user.id
          }
        }
      })
    }

    const [total, employees] = await Promise.all([
      prisma.employee.count({ where }),
      prisma.employee.findMany({
        where,
        include: {
          venue: {
            select: {
              id: true,
              name: true
            }
          },
          services: true,
          schedules: true,
          _count: {
            select: {
              reviews: true
            }
          }
        },
        orderBy: { name: 'asc' },
        skip,
        take: limit
      })
    ])

    // Clean decimals
    const employeesClean = employees.map(e => ({
      ...e,
      services: e.services.map(s => ({
        ...s,
        price: Number(s.price)
      }))
    }))

    return {
      data: employeesClean,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }
  } catch (error: any) {
    throw createError({
      statusCode: 400,
      statusMessage: error.message
    })
  }
})
