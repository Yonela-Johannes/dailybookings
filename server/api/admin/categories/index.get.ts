import { PrismaClient } from '@prisma/client'
import { isPlatformAdmin } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const prisma = new PrismaClient()
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
