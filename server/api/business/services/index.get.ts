import { PrismaClient } from '@prisma/client'
import { isBusinessOwner } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const prisma = new PrismaClient()
  const user = await isBusinessOwner(event)

  const services = await prisma.service.findMany({
    where: user.role === 'PLATFORM_ADMIN' ? {} : {
      category: {
        venue: {
          business: {
            ownerId: user.id
          }
        }
      }
    },
    include: {
      category: {
        include: {
          venue: {
            select: {
              name: true,
              id: true
            }
          }
        }
      }
    },
    orderBy: { name: 'asc' }
  })

  return services
})
