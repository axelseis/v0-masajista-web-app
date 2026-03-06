export const settings = {
  contact: {
    address: "Carrer de Emilia Pardo Bazán, 5",
    addressSub: "08030, Sant Andreu, Barcelona",
    phone: "695544840",
  },
  calendar: {
    timezone: "Europe/Madrid",
    openingHour: 9,
    closingHour: 22,
    lastSlotStartHour: 20,
    slotIntervalMinutes: 15,
    eventBufferMinutes: 30,
    minAdvanceHoursForToday: 4,
    reminders: {
      emailMinutes: 60,
      popupMinutes: 30,
    },
  },
  booking: {
    minDurationMinutes: 30,
    maxDurationMinutes: 240,
    defaultAdvanceDays: 0,
  },
  reviews: {
    minStars: 5,
    maxReviews: 3,
  },
} as const

export type Locale = "es" | "en" | "fr"

/** Formats a time range for display (e.g. "9:00–20:00" or "9h00–20h00" for French). */
export function formatHoursRange(
  startHour: number,
  endHour: number,
  locale: Locale
): string {
  const fmt = (h: number) =>
    locale === "fr" ? `${h}h00` : `${h}:00`
  return `${fmt(startHour)}–${fmt(endHour)}`
}
