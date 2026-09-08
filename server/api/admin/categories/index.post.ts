import { isPlatformAdmin } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'
import { z } from 'zod'

const createCategorySchema = z.object({
  name: z.string().min(2).max(50),
  slug: z.string().min(2).max(50).regex(/^[a-z0-9-]+$/, 'Slug must be alphanumeric with hyphens'),
  description: z.string().optional().nullable().transform(v => !v || v === '' ? null : v),
  imageUrl: z.string().optional().nullable().transform(v => !v || v === '' ? null : v),
  icon: z.string().optional().nullable().transform(v => !v || v === '' ? null : v),
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE')
})

export default defineEventHandler(async (event) => {
  await isPlatformAdmin(event)
  const body = await readBody(event)

  try {
    const data = createCategorySchema.parse(body)

    const category = await prisma.category.create({
      data
    })

    return category
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Validation failed',
        data: error.errors
      })
    }
    throw error
  }
})
