import { prisma } from './prisma'
import { addMinutes, format, parse, isWithinInterval, startOfDay, endOfDay, isBefore } from 'date-fns'

interface Slot {
  startTime: string
  endTime: string
}

export async function calculateAvailableSlots(
  venueId: string,
  serviceIds: string[],
  employeeId: string | null | undefined,
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

  if (services.length === 0) return []

  const totalDuration = services.reduce((acc, s) => acc + s.durationMinutes, 0)
  const totalBuffer = services.reduce((acc, s) => acc + s.bufferMinutes, 0)
  const totalNeeded = totalDuration + totalBuffer

  // 2. Get Venue Working Hours for the day
  // getDay() returns 0 for Sunday, 1 for Monday, etc.
  const dayOfWeek = date.getDay()
  const venueSchedule = venue.schedules.find((s) => s.day === dayOfWeek)

  if (!venueSchedule || venueSchedule.closed || !venueSchedule.opens || !venueSchedule.closes) {
    return []
  }

  // 3. Get Employees who can perform THESE services
  let employeesToQuery: string[] = []
  if (employeeId) {
    employeesToQuery = [employeeId]
  } else {
    // If no employee specified, we check all employees who perform ANY of these services
    // For simplicity, we assume one employee does all services in this booking
    // or we check if there's at least one employee who can do all of them.
    const employees = await prisma.employee.findMany({
      where: {
        venueId,
        services: {
          some: {
            id: { in: serviceIds }
          }
        }
      },
      select: { id: true }
    })
    employeesToQuery = employees.map((e) => e.id)
  }

  if (employeesToQuery.length === 0) return []

  // 4. Generate Potential Slots (e.g., every 15 minutes)
  const slots: Slot[] = []
  const timeFormat = 'HH:mm'
  const start = parse(venueSchedule.opens, timeFormat, date)
  const end = parse(venueSchedule.closes, timeFormat, date)

  // 5. Fetch all relevant bookings once for performance
  const bookings = await prisma.booking.findMany({
    where: {
      venueId,
      date: {
        gte: startOfDay(date),
        lte: endOfDay(date),
      },
      status: { in: ['PENDING', 'CONFIRMED'] },
    },
    include: {
      services: {
        select: { employeeId: true }
      }
    }
  })

  // 6. Fetch employee schedules once
  const employeeSchedules = await prisma.employeeSchedule.findMany({
    where: {
      employeeId: { in: employeesToQuery },
      day: dayOfWeek,
      isWorking: true
    }
  })

  let current = start
  while (addMinutes(current, totalNeeded) <= end) {
    const slotStartStr = format(current, timeFormat)
    const slotEndStr = format(addMinutes(current, totalDuration), timeFormat)
    const fullEnd = addMinutes(current, totalNeeded)

    // Check if any employee who can do these services is free
    let employeeAvailable = false

    for (const empId of employeesToQuery) {
      const empSchedule = employeeSchedules.find(s => s.employeeId === empId)
      if (!empSchedule || !empSchedule.startTime || !empSchedule.endTime) continue

      const empStart = parse(empSchedule.startTime, timeFormat, date)
      const empEnd = parse(empSchedule.endTime, timeFormat, date)

      // Slot must fit within employee working hours
      if (current < empStart || fullEnd > empEnd) continue

      // Check for overlapping bookings for this specific employee
      const hasOverlap = bookings.some(b => {
        const isAssignedToThisBooking = b.services.some(s => s.employeeId === empId)
        if (!isAssignedToThisBooking) return false

        const bStart = parse(b.startTime, timeFormat, date)
        const bEnd = parse(b.endTime, timeFormat, date)

        // Overlap logic: (start1 < end2) && (end1 > start2)
        // We include buffer in the check if we want to be strict
        return (current < bEnd && fullEnd > bStart)
      })

      if (!hasOverlap) {
        employeeAvailable = true
        break
      }
    }

    if (employeeAvailable) {
      slots.push({ startTime: slotStartStr, endTime: slotEndStr })
    }

    current = addMinutes(current, 15) // Step by 15 mins
  }

  return slots
}
