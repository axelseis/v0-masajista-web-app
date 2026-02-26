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
 * which 1-hour slots (9:00-20:00 Mon-Fri) are free.
 */
export async function getAvailableSlots(
  dateStr: string,
  durationMinutes: number
): Promise<TimeSlot[]> {
  const { calendar, calendarId } = getCalendarClient()

  const date = new Date(dateStr + "T00:00:00+01:00") // Europe/Madrid approx
  const dayOfWeek = date.getUTCDay()

  // Only Mon-Fri (1-5)
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return []
  }

  const timeMin = new Date(dateStr + "T09:00:00+01:00").toISOString()
  const timeMax = new Date(dateStr + "T20:00:00+01:00").toISOString()

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

  // Generate all possible slots from 9:00 to 20:00 - durationMinutes
  const slots: TimeSlot[] = []
  const startHour = 9
  const endHour = 20

  for (let hour = startHour; hour < endHour; hour++) {
    const slotStart = new Date(dateStr + `T${String(hour).padStart(2, "0")}:00:00+01:00`)
    const slotEnd = new Date(slotStart.getTime() + durationMinutes * 60 * 1000)

    // Don't create slots that go past closing time
    const closingTime = new Date(dateStr + `T${String(endHour).padStart(2, "0")}:00:00+01:00`)
    if (slotEnd > closingTime) continue

    // Check if this slot overlaps with any busy period
    const isOverlapping = busyPeriods.some((busy) => {
      const busyStart = new Date(busy.start!)
      const busyEnd = new Date(busy.end!)
      return slotStart < busyEnd && slotEnd > busyStart
    })

    slots.push({
      time: `${String(hour).padStart(2, "0")}:00`,
      available: !isOverlapping,
    })
  }

  return slots
}

export interface BookingData {
  service: string
  serviceTitle: string
  date: string // YYYY-MM-DD
  time: string // HH:MM
  duration: number
  name: string
  phone: string
  email: string
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
  const endDate = new Date(startDate.getTime() + data.duration * 60 * 1000)

  const endTime = endDate.toISOString()

  const event = await calendar.events.insert({
    calendarId,
    requestBody: {
      summary: `Masaje: ${data.serviceTitle} - ${data.name}`,
      description: [
        `Cliente: ${data.name}`,
        `Teléfono: ${data.phone}`,
        `Email: ${data.email}`,
        data.notes ? `Notas: ${data.notes}` : "",
        "",
        `Servicio: ${data.serviceTitle}`,
        `Duración: ${data.duration} min`,
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
