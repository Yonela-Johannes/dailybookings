import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server'
import { prisma } from '~/server/utils/prisma'
import { z } from 'zod'

const querySchema = z.object({
  id: z.string().uuid()
})

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const query = getQuery(event)

  try {
    const { id } = querySchema.parse(query)

    const media = await prisma.media.findUnique({
      where: { id },
      include: {
        venue: {
          include: {
            business: true
          }
        }
      }
    })

  if (!media) {
    throw createError({ statusCode: 404, statusMessage: 'Media not found' })
  }

  if (media.venue.business.ownerId !== user.id) {
    throw createError({ statusCode: 403, statusMessage: 'You do not have permission to delete this media' })
  }

  const supabase = await serverSupabaseClient(event)

  // Extract path from URL
  // Example: https://.../storage/v1/object/public/media/venues/id/type/file.jpg
  // Path should be venues/id/type/file.jpg
  const urlParts = media.url.split('/storage/v1/object/public/media/')
  const filePath = urlParts[1]

  if (filePath) {
    const { error: deleteError } = await supabase.storage
      .from('media')
      .remove([filePath])

    if (deleteError) {
      console.error('Failed to delete from storage:', deleteError)
      // We continue to delete from DB even if storage fails?
      // Maybe not, to avoid orphaned files or broken links.
      // But if the file is already gone, we should still clean up the DB.
    }
  }

    await prisma.media.delete({
      where: { id }
    })

    return { success: true }
  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({
      statusCode: 400,
      statusMessage: error.message || 'Failed to delete media',
      data: error.errors
    })
  }
})
