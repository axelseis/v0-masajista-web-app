import { NextRequest, NextResponse } from "next/server"
import { getAvailableDaysForMonth } from "@/lib/google-calendar"
import { services, getBookingAdvanceDays } from "@/lib/services"

function getDaysDiff(a: Date, b: Date): number {
  const d1 = new Date(a.getFullYear(), a.getMonth(), a.getDate())
  const d2 = new Date(b.getFullYear(), b.getMonth(), b.getDate())
  return Math.floor((d1.getTime() - d2.getTime()) / (24 * 60 * 60 * 1000))
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const month = searchParams.get("month")
    const duration = searchParams.get("duration")
    const serviceId = searchParams.get("serviceId")

    if (!month || !duration) {
      return NextResponse.json(
        { error: "Se requieren los parámetros month y duration." },
        { status: 400 }
      )
    }

    // Validate month format YYYY-MM
    if (!/^\d{4}-\d{2}$/.test(month)) {
      return NextResponse.json(
        { error: "Formato de mes inválido. Usa YYYY-MM." },
        { status: 400 }
      )
    }

    const durationMinutes = parseInt(duration, 10)
    if (isNaN(durationMinutes) || durationMinutes < 30 || durationMinutes > 180) {
      return NextResponse.json(
        { error: "Duración inválida." },
        { status: 400 }
      )
    }

    const days = await getAvailableDaysForMonth(month, durationMinutes)

    const service = serviceId ? services.find((s) => s.id === serviceId) : undefined
    const advanceDays = service ? getBookingAdvanceDays(service) : 0

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const filteredDays: Record<string, boolean> = {}
    for (const [dateStr, available] of Object.entries(days)) {
      const d = new Date(dateStr + "T00:00:00")
      const tooSoon = advanceDays > 0 && getDaysDiff(d, today) < advanceDays
      filteredDays[dateStr] = available && !tooSoon
    }

    return NextResponse.json({ days: filteredDays })
  } catch (error) {
    console.error("Error fetching month availability:", error)
    return NextResponse.json(
      { error: "Error al consultar la disponibilidad. Por favor, inténtalo más tarde." },
      { status: 500 }
    )
  }
}
