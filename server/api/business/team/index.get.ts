import { PrismaClient } from '@prisma/client'
import { isBusinessOwner } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const prisma = new PrismaClient()
  const user = await isBusinessOwner(event)

  const employees = await prisma.employee.findMany({
    where: user.role === 'PLATFORM_ADMIN' ? {} : {
      venue: {
        business: {
          ownerId: user.id
        }
      }
    },
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
          bookings: true
        }
      }
    },
    orderBy: { name: 'asc' }
  })

  return employees
})
