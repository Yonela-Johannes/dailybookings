import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {

  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Slug is required'
    })
  }

  try {
    const blog = await prisma.blog.findUnique({
      where: { slug },
      include: {
        category: true
      }
    })

    if (!blog || !blog.published) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Blog post not found'
      })
    }

    return blog
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message
    })
  }
})
