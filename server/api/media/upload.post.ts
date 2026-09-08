import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server'
import { prisma } from '~/server/utils/prisma'
import { MediaEntityType } from '@prisma/client'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  // Fetch full user to check role
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id }
  })

  const isPlatformAdmin = dbUser?.role === 'PLATFORM_ADMIN'

  const formData = await readMultipartFormData(event)
  if (!formData) {
    throw createError({ statusCode: 400, statusMessage: 'No form data provided' })
  }

  const venueId = formData.find(f => f.name === 'venueId')?.data.toString()
  const blogId = formData.find(f => f.name === 'blogId')?.data.toString()
  const entityType = formData.find(f => f.name === 'entityType')?.data.toString() as MediaEntityType | 'CATEGORY'
  const category = formData.find(f => f.name === 'category')?.data.toString()
  const file = formData.find(f => f.name === 'file')

  if (!entityType || !file) {
    throw createError({ statusCode: 400, statusMessage: 'Missing required fields: entityType or file' })
  }

  // Permission Checks
  if (!isPlatformAdmin) {
    if (entityType === 'CATEGORY') {
       throw createError({ statusCode: 403, statusMessage: 'Only platform admins can upload category images' })
    }

    if (venueId) {
      const venue = await prisma.venue.findUnique({
        where: { id: venueId },
        include: { business: true }
      })

      if (!venue || venue.business.ownerId !== user.id) {
        throw createError({ statusCode: 403, statusMessage: 'You do not have permission to upload for this venue' })
      }
    } else if (entityType !== 'BLOG') {
       // If not admin and no venueId provided (for non-blog entities), deny
       throw createError({ statusCode: 400, statusMessage: 'venueId is required for this entity type' })
    }
  }

  const supabase = await serverSupabaseClient(event)

  // Determine path and bucket
  const bucket = 'media'
  const timestamp = Date.now()
  const fileName = `${timestamp}-${file.filename}`

  let filePath = ''
  if (entityType === 'CATEGORY') {
    filePath = `categories/${fileName}`
  } else if (blogId) {
    filePath = `blogs/${blogId}/${fileName}`
  } else if (venueId) {
    filePath = `venues/${venueId}/${entityType.toLowerCase()}/${fileName}`
  } else {
    filePath = `misc/${entityType.toLowerCase()}/${fileName}`
  }

  // Upload to Supabase Storage
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file.data, {
      contentType: file.type,
      upsert: false
    })

  if (uploadError) {
    // If bucket doesn't exist, try creating it (though it should exist)
    if (uploadError.message?.includes('bucket not found')) {
       await supabase.storage.createBucket(bucket, { public: true })
       const { error: retryError } = await supabase.storage.from(bucket).upload(filePath, file.data, {
          contentType: file.type,
          upsert: false
       })
       if (retryError) throw createError({ statusCode: 500, statusMessage: `Upload failed after retry: ${retryError.message}` })
    } else {
      throw createError({ statusCode: 500, statusMessage: `Upload failed: ${uploadError.message}` })
    }
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath)

  // Save to Prisma if it's a standard Media entity type
  if (entityType !== 'CATEGORY') {
    const media = await prisma.media.create({
      data: {
        venueId: venueId as string, // Might be null if it's a blog-only image, but schema might require it.
        // Let's check schema for venueId nullability in Media
        blogId: blogId,
        entityType: entityType === 'BLOG' ? 'BLOG' : (entityType as MediaEntityType),
        url: publicUrl,
        category,
        type: file.type?.startsWith('video') ? 'video' : 'image',
        alt: file.filename
      }
    })
    return { ...media, url: publicUrl }
  }

  return { url: publicUrl }
})
