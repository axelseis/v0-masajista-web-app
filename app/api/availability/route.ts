import { NextRequest, NextResponse } from "next/server"
import { getAvailableSlots } from "@/lib/google-calendar"
import { services, getBookingAdvanceDays } from "@/lib/services"

function getDaysDiff(a: Date, b: Date): number {
  const d1 = new Date(a.getFullYear(), a.getMonth(), a.getDate())
  const d2 = new Date(b.getFullYear(), b.getMonth(), b.getDate())
  return Math.floor((d1.getTime() - d2.getTime()) / (24 * 60 * 60 * 1000))
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get("date")
    const duration = searchParams.get("duration")
    const serviceId = searchParams.get("serviceId")

    if (!date || !duration) {
      return NextResponse.json(
        { error: "Se requieren los parámetros date y duration." },
        { status: 400 }
      )
    }

    // Validate date format YYYY-MM-DD
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json(
        { error: "Formato de fecha inválido. Usa YYYY-MM-DD." },
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

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const requestedDate = new Date(date + "T00:00:00")

    if (requestedDate < today) {
      return NextResponse.json(
        { error: "No se puede reservar en fechas pasadas." },
        { status: 400 }
      )
    }

    const service = serviceId ? services.find((s) => s.id === serviceId) : undefined
    const advanceDays = service ? getBookingAdvanceDays(service) : 0
    if (getDaysDiff(requestedDate, today) < advanceDays) {
      return NextResponse.json(
        { error: "Esta fecha no cumple la antelación mínima de reserva para este servicio." },
        { status: 400 }
      )
    }

    const slots = await getAvailableSlots(date, durationMinutes)

    return NextResponse.json({ slots })
  } catch (error) {
    console.error("Error fetching availability:", error)
    return NextResponse.json(
      { error: "Error al consultar la disponibilidad. Por favor, inténtalo más tarde." },
      { status: 500 }
    )
  }
}
