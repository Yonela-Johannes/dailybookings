import { serverSupabaseClient } from '#supabase/server'
import { Database } from '~/types/supabase'
import { addMinutes, format, parse, isAfter, isBefore, isEqual } from 'date-fns'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { date, serviceId, slug } = query as { date: string; serviceId: string; slug: string }

  if (!date || !serviceId || !slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required parameters: date, serviceId, slug',
    })
  }

  const client = await serverSupabaseClient<Database>(event)

  // 1. Fetch profile by slug
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

  // 2. Fetch service
  const { data: service, error: serviceError } = await client
    .from('services')
    .select('duration')
    .eq('id', serviceId)
    .single()

  if (serviceError || !service) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Service not found',
    })
  }

  // 3. Fetch existing bookings for that date
  const { data: bookings, error: bookingsError } = await client
    .from('bookings')
    .select('start_time, end_time')
    .eq('user_id', profile.id)
    .eq('date', date)
    .neq('status', 'cancelled')

  if (bookingsError) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error fetching bookings',
    })
  }

  // 4. Generate available slots
  // Assuming business hours are 9 AM to 5 PM
  const slots = []
  const businessStart = '09:00'
  const businessEnd = '17:00'

  const timeFormat = 'HH:mm'
  const referenceDate = new Date(2000, 0, 1) // Any reference date for time calculations

  const startDateTime = parse(businessStart, timeFormat, referenceDate)
  const endDateTime = parse(businessEnd, timeFormat, referenceDate)

  let currentSlotStart = startDateTime

  while (isBefore(addMinutes(currentSlotStart, service.duration), endDateTime) || isEqual(addMinutes(currentSlotStart, service.duration), endDateTime)) {
    const slotEnd = addMinutes(currentSlotStart, service.duration)

    const startTimeStr = format(currentSlotStart, timeFormat)
    const endTimeStr = format(slotEnd, timeFormat)

    // Check for overlap with existing bookings
    const isOverlapping = bookings?.some(booking => {
      // Handle potential HH:mm:ss format from Supabase
      const bStartStr = booking.start_time.substring(0, 5)
      const bEndStr = booking.end_time.substring(0, 5)

      const bStart = parse(bStartStr, timeFormat, referenceDate)
      const bEnd = parse(bEndStr, timeFormat, referenceDate)

      // Overlap logic: (currentStart < bEnd) && (slotEnd > bStart)
      return isBefore(currentSlotStart, bEnd) && isAfter(slotEnd, bStart)
    })

    if (!isOverlapping) {
      slots.push({
        startTime: startTimeStr,
        endTime: endTimeStr,
      })
    }

    // Advance by 30 minutes for the next potential start time
    currentSlotStart = addMinutes(currentSlotStart, 30)
  }

  return slots
})
