import { prisma } from '~/server/utils/prisma'
import { isPlatformAdmin } from '~/server/utils/auth'
import { z } from 'zod'

const verifySchema = z.object({
  verified: z.boolean().optional(),
  status: z.enum(['ACTIVE', 'SUSPENDED', 'DRAFT']).optional(),
  communityId: z.string().uuid().optional().nullable()
})

export default defineEventHandler(async (event) => {

  await isPlatformAdmin(event)
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  try {
    const { verified, status, communityId } = verifySchema.parse(body)

    // Check if we are updating the Business verification or Venue status
    // The prompt says "Verify/Suspend venues", but Business model has "verified" field.
    // Venue has "status". I'll handle both.

    const venue = await prisma.venue.findUnique({
      where: { id },
      include: { business: true }
    })

    if (!venue) {
      throw createError({ statusCode: 404, statusMessage: 'Venue not found' })
    }

    const updatedVenue = await prisma.venue.update({
      where: { id },
      data: {
        status: status,
        communityId: communityId,
        business: verified !== undefined ? {
          update: {
            verified: verified
          }
        } : undefined
      },
      include: {
        business: true
      }
    })

    return updatedVenue
  } catch (error: any) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Validation failed',
      data: error.errors
    })
  }
})
