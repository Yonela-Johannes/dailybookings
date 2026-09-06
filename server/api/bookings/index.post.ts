import { serverSupabaseClient } from '#supabase/server'
import { Database } from '~/types/supabase'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { serviceId, customerName, customerEmail, date, startTime, endTime, notes, slug } = body

  if (!serviceId || !customerName || !customerEmail || !date || !startTime || !endTime || !slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields: serviceId, customerName, customerEmail, date, startTime, endTime, slug',
    })
  }

  const client = await serverSupabaseClient<Database>(event)

  // 1. Fetch business (profile) by slug to get the user_id
  const { data: profile, error: profileError } = await client
    .from('profiles')
    .select('id')
    .eq('slug', slug)
    .single()

  if (profileError || !profile) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Business not found',
    })
  }

  // 2. Create new booking
  // We set status to 'confirmed' as requested
  const { data: booking, error: bookingError } = await client
    .from('bookings')
    .insert({
      user_id: profile.id,
      service_id: serviceId,
      customer_name: customerName,
      customer_email: customerEmail,
      date,
      start_time: startTime,
      end_time: endTime,
      notes: notes || null,
      status: 'confirmed'
    })
    .select()
    .single()

  if (bookingError) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error creating booking: ' + bookingError.message,
    })
  }

  return booking
})
