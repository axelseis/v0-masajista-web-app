import { NextRequest, NextResponse } from "next/server"
import { getAvailableSlots } from "@/lib/google-calendar"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get("date")
    const duration = searchParams.get("duration")

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

    // Check date is not in the past
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const requestedDate = new Date(date + "T00:00:00")
    if (requestedDate < today) {
      return NextResponse.json(
        { error: "No se puede reservar en fechas pasadas." },
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
