import { PrismaClient } from '@prisma/client'

export default defineEventHandler(async (event) => {
  const prisma = new PrismaClient()
  const query = getQuery(event)
  const { q, loc } = query

  if (!q && !loc) {
    return {
      venues: [],
      services: [],
      categories: []
    }
  }

  const searchStr = q ? String(q) : ''
  const locationStr = loc ? String(loc) : ''

  try {
    const [venues, services, categories] = await Promise.all([
      prisma.venue.findMany({
        where: {
          status: 'active',
          deletedAt: null,
          AND: [
            searchStr ? {
              OR: [
                { name: { contains: searchStr, mode: 'insensitive' } },
                { description: { contains: searchStr, mode: 'insensitive' } }
              ]
            } : {},
            locationStr ? {
              address: {
                OR: [
                  { city: { contains: locationStr, mode: 'insensitive' } },
                  { suburb: { contains: locationStr, mode: 'insensitive' } }
                ]
              }
            } : {}
          ]
        },
        include: {
          category: true,
          media: { where: { featured: true } },
          address: true
        },
        take: 10
      }),
      prisma.service.findMany({
        where: {
          OR: [
            { name: { contains: searchStr, mode: 'insensitive' } },
            { description: { contains: searchStr, mode: 'insensitive' } }
          ]
        },
        include: {
          category: {
            include: {
              venue: {
                include: {
                  address: true
                }
              }
            }
          }
        },
        take: 10
      }),
      prisma.category.findMany({
        where: {
          name: { contains: searchStr, mode: 'insensitive' }
        },
        take: 5
      })
    ])

    return {
      venues,
      services,
      categories
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message
    })
  }
})
