import { prisma } from '~/server/utils/prisma'
import { isBusinessOwner } from '~/server/utils/auth'
import { z } from 'zod'

const scheduleSchema = z.object({
  day: z.number().int().min(0).max(6),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/).nullable(),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/).nullable(),
  isWorking: z.boolean().default(true)
})

const teamActionSchema = z.discriminatedUnion('action', [
  z.object({
    action: z.literal('create'),
    venueId: z.string().uuid(),
    data: z.object({
      name: z.string().min(2),
      title: z.string().optional(),
      bio: z.string().optional(),
      imageUrl: z.string().url().optional(),
      schedules: z.array(scheduleSchema).optional(),
      serviceIds: z.array(z.string().uuid()).optional()
    })
  }),
  z.object({
    action: z.literal('update'),
    id: z.string().uuid(),
    data: z.object({
      name: z.string().min(2).optional(),
      title: z.string().optional(),
      bio: z.string().optional(),
      imageUrl: z.string().url().optional(),
      schedules: z.array(scheduleSchema).optional()
    })
  }),
  z.object({
    action: z.literal('delete'),
    id: z.string().uuid()
  })
])

export default defineEventHandler(async (event) => {
  const user = await isBusinessOwner(event)
  const body = await readBody(event)

  try {
    const payload = teamActionSchema.parse(body)

    if (payload.action === 'create') {
      const venue = await prisma.venue.findUnique({
        where: { id: payload.venueId },
        include: { business: true }
      })

      if (!venue || (user.role !== 'PLATFORM_ADMIN' && venue.business.ownerId !== user.id)) {
        throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
      }

      const { schedules, serviceIds, ...employeeData } = payload.data

      return await prisma.employee.create({
        data: {
          ...employeeData,
          venueId: payload.venueId,
          schedules: schedules ? {
            create: schedules
          } : undefined,
          services: serviceIds ? {
            connect: serviceIds.map(id => ({ id }))
          } : undefined
        },
        include: {
          schedules: true,
          services: true
        }
      })
    }

    if (payload.action === 'update') {
      const employee = await prisma.employee.findUnique({
        where: { id: payload.id },
        include: { venue: { include: { business: true } } }
      })

      if (!employee || (user.role !== 'PLATFORM_ADMIN' && employee.venue.business.ownerId !== user.id)) {
        throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
      }

      const { schedules, serviceIds, ...employeeData } = payload.data

      return await prisma.$transaction(async (tx) => {
        if (schedules) {
          // Simplest way to update schedules: delete all and recreate
          await tx.employeeSchedule.deleteMany({
            where: { employeeId: payload.id }
          })
          await tx.employeeSchedule.createMany({
            data: schedules.map(s => ({ ...s, employeeId: payload.id }))
          })
        }

        return await tx.employee.update({
          where: { id: payload.id },
          data: {
            ...employeeData,
            services: serviceIds ? {
              set: serviceIds.map(id => ({ id }))
            } : undefined
          },
          include: {
            schedules: true,
            services: true
          }
        })
      })
    }

    if (payload.action === 'delete') {
      const employee = await prisma.employee.findUnique({
        where: { id: payload.id },
        include: { venue: { include: { business: true } } }
      })

      if (!employee || (user.role !== 'PLATFORM_ADMIN' && employee.venue.business.ownerId !== user.id)) {
        throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
      }

      return await prisma.employee.delete({
        where: { id: payload.id }
      })
    }

  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({
      statusCode: 400,
      statusMessage: error.message || 'Team operation failed',
      data: error.errors
    })
  }
})
