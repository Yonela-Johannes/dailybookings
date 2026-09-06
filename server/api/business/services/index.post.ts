import { prisma } from '~/server/utils/prisma'
import { isBusinessOwner } from '~/server/utils/auth'
import { z } from 'zod'

const serviceActionSchema = z.discriminatedUnion('action', [
  z.object({
    action: z.literal('createService'),
    data: z.object({
      serviceCategoryId: z.string().uuid(),
      name: z.string().min(2),
      description: z.string().optional(),
      durationMinutes: z.number().int().min(1),
      bufferMinutes: z.number().int().min(0).default(0),
      price: z.number().min(0),
      priceIsFrom: z.boolean().default(false),
      popular: z.boolean().default(false)
    })
  }),
  z.object({
    action: z.literal('updateService'),
    id: z.string().uuid(),
    data: z.object({
      name: z.string().min(2).optional(),
      description: z.string().optional(),
      durationMinutes: z.number().int().min(1).optional(),
      bufferMinutes: z.number().int().min(0).optional(),
      price: z.number().min(0).optional(),
      priceIsFrom: z.boolean().optional(),
      popular: z.boolean().optional(),
      serviceCategoryId: z.string().uuid().optional()
    })
  }),
  z.object({
    action: z.literal('deleteService'),
    id: z.string().uuid()
  }),
  z.object({
    action: z.literal('createCategory'),
    data: z.object({
      venueId: z.string().uuid(),
      name: z.string().min(2)
    })
  }),
  z.object({
    action: z.literal('updateCategory'),
    id: z.string().uuid(),
    data: z.object({
      name: z.string().min(2)
    })
  }),
  z.object({
    action: z.literal('deleteCategory'),
    id: z.string().uuid()
  })
])

export default defineEventHandler(async (event) => {

  const user = await isBusinessOwner(event)
  const body = await readBody(event)

  try {
    const payload = serviceActionSchema.parse(body)

    // Ownership checks
    if (payload.action === 'createService') {
      const cat = await prisma.serviceCategory.findUnique({
        where: { id: payload.data.serviceCategoryId },
        include: { venue: { include: { business: true } } }
      })
      if (!cat || (user.role !== 'PLATFORM_ADMIN' && cat.venue.business.ownerId !== user.id)) {
        throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
      }
      return await prisma.service.create({ data: payload.data })
    }

    if (payload.action === 'updateService') {
      const service = await prisma.service.findUnique({
        where: { id: payload.id },
        include: { category: { include: { venue: { include: { business: true } } } } }
      })
      if (!service || (user.role !== 'PLATFORM_ADMIN' && service.category.venue.business.ownerId !== user.id)) {
        throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
      }
      return await prisma.service.update({
        where: { id: payload.id },
        data: payload.data
      })
    }

    if (payload.action === 'deleteService') {
      const service = await prisma.service.findUnique({
        where: { id: payload.id },
        include: { category: { include: { venue: { include: { business: true } } } } }
      })
      if (!service || (user.role !== 'PLATFORM_ADMIN' && service.category.venue.business.ownerId !== user.id)) {
        throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
      }
      return await prisma.service.delete({ where: { id: payload.id } })
    }

    if (payload.action === 'createCategory') {
      const venue = await prisma.venue.findUnique({
        where: { id: payload.data.venueId },
        include: { business: true }
      })
      if (!venue || (user.role !== 'PLATFORM_ADMIN' && venue.business.ownerId !== user.id)) {
        throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
      }
      return await prisma.serviceCategory.create({ data: payload.data })
    }

    if (payload.action === 'updateCategory') {
      const cat = await prisma.serviceCategory.findUnique({
        where: { id: payload.id },
        include: { venue: { include: { business: true } } }
      })
      if (!cat || (user.role !== 'PLATFORM_ADMIN' && cat.venue.business.ownerId !== user.id)) {
        throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
      }
      return await prisma.serviceCategory.update({
        where: { id: payload.id },
        data: payload.data
      })
    }

    if (payload.action === 'deleteCategory') {
      const cat = await prisma.serviceCategory.findUnique({
        where: { id: payload.id },
        include: { venue: { include: { business: true } } }
      })
      if (!cat || (user.role !== 'PLATFORM_ADMIN' && cat.venue.business.ownerId !== user.id)) {
        throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
      }
      return await prisma.serviceCategory.delete({ where: { id: payload.id } })
    }

  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({
      statusCode: 400,
      statusMessage: 'Operation failed',
      data: error.errors || error.message
    })
  }
})
