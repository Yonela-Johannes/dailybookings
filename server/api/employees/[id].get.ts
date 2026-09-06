import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {

  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Employee ID is required'
    })
  }

  try {
    const employee = await prisma.employee.findUnique({
      where: { id },
      include: {
        venue: {
          include: {
            address: true,
            contact: true
          }
        },
        services: {
          include: {
            category: true
          }
        },
        schedules: true,
        availabilities: true
      }
    })

    if (!employee || employee.deletedAt) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Employee not found'
      })
    }

    return employee
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message
    })
  }
})
