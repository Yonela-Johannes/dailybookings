import { prisma } from './prisma'
import { addMinutes, format, parse, isWithinInterval, startOfDay, endOfDay } from 'date-fns'

interface Slot {
  startTime: string
  endTime: string
}

export async function calculateAvailableSlots(
  venueId: string,
  serviceIds: string[],
  employeeId: string | null,
  date: Date
) {
  const venue = await prisma.venue.findUnique({
    where: { id: venueId },
    include: {
      schedules: true,
      bookingConfig: true,
    },
  })

  if (!venue) throw new Error('Venue not found')

  // 1. Get total duration and buffer
  const services = await prisma.service.findMany({
    where: { id: { in: serviceIds } },
  })

  const totalDuration = services.reduce((acc, s) => acc + s.durationMinutes, 0)
  const totalBuffer = services.reduce((acc, s) => acc + s.bufferMinutes, 0)
  const totalNeeded = totalDuration + totalBuffer

  // 2. Get Venue Working Hours for the day
  const dayOfWeek = date.getDay()
  const venueSchedule = venue.schedules.find((s) => s.day === dayOfWeek)

  if (!venueSchedule || venueSchedule.closed || !venueSchedule.opens || !venueSchedule.closes) {
    return []
  }

  // 3. Get Employee Schedule if employee specified
  let employeesToQuery = []
  if (employeeId) {
    employeesToQuery = [employeeId]
  } else {
    // If no employee specified, we check all employees who perform these services
    const employees = await prisma.employee.findMany({
      where: {
        venueId,
        services: { some: { id: { in: serviceIds } } },
      },
    })
    employeesToQuery = employees.map((e) => e.id)
  }

  if (employeesToQuery.length === 0) return []

  // 4. Get Existing Bookings for the day
  const bookings = await prisma.booking.findMany({
    where: {
      venueId,
      date: {
        gte: startOfDay(date),
        lte: endOfDay(date),
      },
      status: { in: ['PENDING', 'CONFIRMED'] },
    },
  })

  // 5. Generate Potential Slots (e.g., every 15 minutes)
  const slots: Slot[] = []
  const start = parse(venueSchedule.opens, 'HH:mm', date)
  const end = parse(venueSchedule.closes, 'HH:mm', date)

  let current = start
  while (addMinutes(current, totalNeeded) <= end) {
    const slotStart = format(current, 'HH:mm')
    const slotEnd = format(addMinutes(current, totalDuration), 'HH:mm') // End time is without buffer for the customer
    const fullEnd = addMinutes(current, totalNeeded)

    // Check if any employee is free for this slot
    let employeeAvailable = false

    for (const empId of employeesToQuery) {
      // Check employee schedule
      const empSchedule = await prisma.employeeSchedule.findFirst({
        where: { employeeId: empId, day: dayOfWeek, isWorking: true },
      })

      if (!empSchedule || !empSchedule.startTime || !empSchedule.endTime) continue

      const empStart = parse(empSchedule.startTime, 'HH:mm', date)
      const empEnd = parse(empSchedule.endTime, 'HH:mm', date)

      if (current < empStart || fullEnd > empEnd) continue

      // Check existing bookings for this employee
      const empBookings = bookings.filter((b) => b.employeeId === empId)
      const isOverlapping = empBookings.some((b) => {
        const bStart = parse(b.startTime, 'HH:mm', date)
        const bEnd = parse(b.endTime, 'HH:mm', date)
        // Check overlap (ignoring buffer for now, or include it if we store it)
        // Realistically we should store the duration including buffer in the booking or check service buffers
        return (current < bEnd && fullEnd > bStart)
      })

      if (!isOverlapping) {
        employeeAvailable = true
        break
      }
    }

    if (employeeAvailable) {
      slots.push({ startTime: slotStart, endTime: slotEnd })
    }

    current = addMinutes(current, 15) // Step by 15 mins
  }

  return slots
}
