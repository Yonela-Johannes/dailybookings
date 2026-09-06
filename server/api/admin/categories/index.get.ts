import { isPlatformAdmin } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  await isPlatformAdmin(event)

  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: {
          venues: true
        }
      }
    },
    orderBy: { name: 'asc' }
  })

  return categories
})
