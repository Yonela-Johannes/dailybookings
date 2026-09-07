import { prisma } from '~/server/utils/prisma'
import { isPlatformAdmin } from '~/server/utils/auth'
import { z } from 'zod'

const createBlogSchema = z.object({
  title: z.string().min(5),
  slug: z.string().min(2),
  content: z.string().min(10),
  excerpt: z.string().optional(),
  featuredImage: z.string().url().optional(),
  categoryId: z.string().uuid(),
  published: z.boolean().default(false)
})

export default defineEventHandler(async (event) => {
  await isPlatformAdmin(event)
  const body = await readBody(event)

  try {
    const data = createBlogSchema.parse(body)
    const blog = await prisma.blog.create({
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
