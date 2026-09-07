import { prisma } from '~/server/utils/prisma'
import { isPlatformAdmin } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  await isPlatformAdmin(event)
  const id = getRouterParam(event, 'id')

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      user: {
        include: {
          profile: true
        }
      },
      venue: {
        include: {
          address: true,
          contact: true
        }
      },
      services: {
        include: {
          service: true,
          employee: true
        }
      },
      payment: true
    }
  })

  if (!booking) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Booking not found'
    })
  }

  return {
    ...booking,
    priceTotal: Number(booking.priceTotal),
    services: booking.services.map(s => ({
      ...s,
      price: Number(s.price)
    })),
    payment: booking.payment ? {
      ...booking.payment,
      amount: Number(booking.payment.amount)
    } : null
  }
})
