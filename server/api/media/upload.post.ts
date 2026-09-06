import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server'
import { PrismaClient } from '@prisma/client'
import { MediaEntityType } from '@prisma/client'

export default defineEventHandler(async (event) => {
  const prisma = new PrismaClient()
  const user = await serverSupabaseUser(event)
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const formData = await readMultipartFormData(event)
  if (!formData) {
    throw createError({ statusCode: 400, statusMessage: 'No form data provided' })
  }

  const venueId = formData.find(f => f.name === 'venueId')?.data.toString()
  const entityType = formData.find(f => f.name === 'entityType')?.data.toString() as MediaEntityType
  const category = formData.find(f => f.name === 'category')?.data.toString()
  const file = formData.find(f => f.name === 'file')

  if (!venueId || !entityType || !file) {
    throw createError({ statusCode: 400, statusMessage: 'Missing required fields: venueId, entityType, or file' })
  }

  // Validate owner
  const venue = await prisma.venue.findUnique({
    where: { id: venueId },
    include: { business: true }
  })

  if (!venue) {
    throw createError({ statusCode: 404, statusMessage: 'Venue not found' })
  }

  if (venue.business.ownerId !== user.id) {
    throw createError({ statusCode: 403, statusMessage: 'You do not have permission to upload for this venue' })
  }

  const supabase = await serverSupabaseClient(event)

  // Create filename: venues/{venueId}/{entityType}/{timestamp}-{filename}
  const timestamp = Date.now()
  const fileName = `${timestamp}-${file.filename}`
  const filePath = `venues/${venueId}/${entityType.toLowerCase()}/${fileName}`

  // Upload to Supabase Storage
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('media')
    .upload(filePath, file.data, {
      contentType: file.type,
      upsert: false
    })

  if (uploadError) {
    throw createError({ statusCode: 500, statusMessage: `Upload failed: ${uploadError.message}` })
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('media')
    .getPublicUrl(filePath)

  // Save to Prisma
  const media = await prisma.media.create({
    data: {
      venueId,
      entityType,
      url: publicUrl,
      category,
      type: file.type?.startsWith('video') ? 'video' : 'image',
      alt: file.filename
    }
  })

  return media
})
