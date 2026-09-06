import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server'
import { PrismaClient } from '@prisma/client'

export default defineEventHandler(async (event) => {
  const prisma = new PrismaClient()
  const user = await serverSupabaseUser(event)
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const query = getQuery(event)
  const id = query.id as string

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing media id' })
  }

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
})
