import { prisma } from '~/server/utils/prisma'
import { isPlatformAdmin } from '~/server/utils/auth'
import { z } from 'zod'

const updateBlogSchema = z.object({
  title: z.string().min(5).optional(),
  slug: z.string().min(2).optional(),
  content: z.string().min(10).optional(),
  excerpt: z.string().optional(),
  featuredImage: z.string().url().optional(),
  categoryId: z.string().uuid().optional(),
  published: z.boolean().optional()
})

export default defineEventHandler(async (event) => {
  await isPlatformAdmin(event)
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  try {
    const data = updateBlogSchema.parse(body)
    const blog = await prisma.blog.update({
      where: { id },
      data,
      include: { category: true }
    })
    return blog
  } catch (error: any) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Validation failed',
      data: error.errors
    })
  }
})
