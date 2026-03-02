import { google } from "googleapis"

const SCOPES = ["https://www.googleapis.com/auth/calendar"]

function getCalendarClient() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  const key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n")
  const calendarId = process.env.GOOGLE_CALENDAR_ID

  if (!email || !key || !calendarId) {
    throw new Error(
      "Missing Google Calendar environment variables. Please configure GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, and GOOGLE_CALENDAR_ID."
    )
  }

  const subject = process.env.GOOGLE_WORKSPACE_USER_EMAIL
  
  if (!subject) {
    throw new Error("GOOGLE_WORKSPACE_USER_EMAIL is required for domain-wide delegation.")
  }

  const auth = new google.auth.JWT({
    email,
    key: key,
    scopes: SCOPES,
    subject,  // ← impersona a este usuario de Workspace
  })

  const calendar = google.calendar({ version: "v3", auth })

  return { calendar, calendarId }
}

export interface TimeSlot {
  time: string // "09:00"
  available: boolean
}

/**
 * Generates available time slots for a given date.
 * Queries Google Calendar freebusy to find busy periods, then returns
 * which slots (9:00-20:00, lunes a domingo) are free.
 */
export async function getAvailableSlots(
  dateStr: string,
  durationMinutes: number
): Promise<TimeSlot[]> {
  const { calendar, calendarId } = getCalendarClient()

  const timeMin = new Date(dateStr + "T09:00:00+01:00").toISOString()
  const timeMax = new Date(dateStr + "T22:00:00+01:00").toISOString()

  const freeBusyResponse = await calendar.freebusy.query({
    requestBody: {
      timeMin,
      timeMax,
      timeZone: "Europe/Madrid",
      items: [{ id: calendarId }],
    },
  })

  const busyPeriods =
    freeBusyResponse.data.calendars?.[calendarId]?.busy || []

  // Minimum start time: for today, slots must be at least 4 hours from now (Europe/Madrid)
  let minSlotStart: Date | null = null
  const now = new Date()
  const madridParts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Madrid",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
    .formatToParts(now)
    .reduce((acc, p) => ({ ...acc, [p.type]: p.value }), {} as Record<string, string>)
  const madridDateStr = `${madridParts.year}-${madridParts.month}-${madridParts.day}`
  if (dateStr === madridDateStr) {
    const h = parseInt(madridParts.hour, 10)
    const m = parseInt(madridParts.minute, 10)
    const minStart = new Date(dateStr + `T${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00+01:00`)
    minSlotStart = new Date(minStart.getTime() + 4 * 60 * 60 * 1000) // +4 hours
  }

  // Slots cada 15 min de 9:00 a 20:00 (última reserva empieza a las 20h)
  const slots: TimeSlot[] = []
  const startMinutes = 9 * 60 // 9:00
  const endMinutes = 20 * 60 + 15 // último slot 20:00
  const closingHour = 22

  for (let totalMins = startMinutes; totalMins < endMinutes; totalMins += 15) {
    const h = Math.floor(totalMins / 60)
    const m = totalMins % 60
    const timeStr = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`
    const slotStart = new Date(dateStr + `T${timeStr}:00+01:00`)
    const slotEnd = new Date(slotStart.getTime() + durationMinutes * 60 * 1000)

    const closingTime = new Date(dateStr + `T${String(closingHour).padStart(2, "0")}:00:00+01:00`)
    if (slotEnd > closingTime) continue

    const tooSoon = minSlotStart && slotStart < minSlotStart

    const isOverlapping = busyPeriods.some((busy) => {
      const busyStart = new Date(busy.start!)
      const busyEnd = new Date(busy.end!)
      return slotStart < busyEnd && slotEnd > busyStart
    })

    slots.push({
      time: timeStr,
      available: !tooSoon && !isOverlapping,
    })
  }

  return slots
}

/**
 * Returns which days in a month have at least one available slot.
 * Single freebusy query for the entire month.
 */
export async function getAvailableDaysForMonth(
  monthStr: string, // YYYY-MM
  durationMinutes: number
): Promise<Record<string, boolean>> {
  const { calendar, calendarId } = getCalendarClient()

  const [year, month] = monthStr.split("-").map(Number)
  const lastDay = new Date(year, month, 0)

  const timeMin = new Date(
    `${year}-${String(month).padStart(2, "0")}-01T09:00:00+01:00`
  ).toISOString()
  const timeMax = new Date(
    `${year}-${String(month).padStart(2, "0")}-${String(lastDay.getDate()).padStart(2, "0")}T22:00:00+01:00`
  ).toISOString()

  const freeBusyResponse = await calendar.freebusy.query({
    requestBody: {
      timeMin,
      timeMax,
      timeZone: "Europe/Madrid",
      items: [{ id: calendarId }],
    },
  })

  const busyPeriods =
    freeBusyResponse.data.calendars?.[calendarId]?.busy || []

  const now = new Date()
  const madridParts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Madrid",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
    .formatToParts(now)
    .reduce((acc, p) => ({ ...acc, [p.type]: p.value }), {} as Record<string, string>)
  const madridDateStr = `${madridParts.year}-${madridParts.month}-${madridParts.day}`

  const result: Record<string, boolean> = {}
  const startMinutes = 9 * 60
  const endMinutes = 20 * 60 + 15
  const closingHour = 22

  for (let d = 1; d <= lastDay.getDate(); d++) {
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`

    let minSlotStart: Date | null = null
    if (dateStr === madridDateStr) {
      const h = parseInt(madridParts.hour, 10)
      const m = parseInt(madridParts.minute, 10)
      const minStart = new Date(
        dateStr + `T${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00+01:00`
      )
      minSlotStart = new Date(minStart.getTime() + 4 * 60 * 60 * 1000) // +4 hours
    }

    let hasSlot = false
    for (let totalMins = startMinutes; totalMins < endMinutes && !hasSlot; totalMins += 15) {
      const h = Math.floor(totalMins / 60)
      const m = totalMins % 60
      const slotStart = new Date(
        dateStr + `T${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00+01:00`
      )
      const slotEnd = new Date(slotStart.getTime() + durationMinutes * 60 * 1000)

      const closingTime = new Date(
        dateStr + `T${String(closingHour).padStart(2, "0")}:00:00+01:00`
      )
      if (slotEnd > closingTime) continue

      const tooSoon = minSlotStart && slotStart < minSlotStart
      if (tooSoon) continue

      const isOverlapping = busyPeriods.some((busy) => {
        const busyStart = new Date(busy.start!)
        const busyEnd = new Date(busy.end!)
        return slotStart < busyEnd && slotEnd > busyStart
      })

      if (!isOverlapping) {
        hasSlot = true
      }
    }
    result[dateStr] = hasSlot
  }

  return result
}

export interface BookingData {
  service: string
  serviceTitle: string
  date: string // YYYY-MM-DD
  time: string // HH:MM
  duration: number
  totalPrice?: number
  toppingsInfo?: string[]
  name: string
  phone: string
  email?: string
  notes?: string
}

/**
 * Creates a calendar event for a booking.
 * Returns the created event ID.
 */
export async function createBookingEvent(
  data: BookingData
): Promise<string> {
  const { calendar, calendarId } = getCalendarClient()

  const startDateTime = `${data.date}T${data.time}:00`
  const startDate = new Date(startDateTime + "+01:00")
  const eventDurationMinutes = data.duration + 15 // masaje + 15 min para vestuario, etc.
  const endDate = new Date(startDate.getTime() + eventDurationMinutes * 60 * 1000)

  const endTime = endDate.toISOString()

  const hasEmail = !!data.email?.trim()
  const attendees = hasEmail
    ? [{ email: data.email!.trim(), displayName: data.name }]
    : undefined

  const event = await calendar.events.insert({
    calendarId,
    ...(attendees && { sendUpdates: "all" as const }),
    requestBody: {
      summary: `Masaje: ${data.serviceTitle} - ${data.name}`,
      ...(attendees && { attendees }),
      description: [
        `Cliente: ${data.name}`,
        `Teléfono: ${data.phone}`,
        data.email?.trim() ? `Email: ${data.email}` : "",
        data.notes ? `Notas: ${data.notes}` : "",
        "",
        `Servicio: ${data.serviceTitle}`,
        `Duración: ${data.duration} min`,
        data.totalPrice != null ? `Precio: ${data.totalPrice} €` : "",
        data.toppingsInfo?.length
          ? `Toppings: ${data.toppingsInfo.join(", ")}`
          : "",
      ]
        .filter(Boolean)
        .join("\n"),
      start: {
        dateTime: startDate.toISOString(),
        timeZone: "Europe/Madrid",
      },
      end: {
        dateTime: endTime,
        timeZone: "Europe/Madrid",
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 60 },
          { method: "popup", minutes: 30 },
        ],
      },
    },
  })

  return event.data.id || ""
}
