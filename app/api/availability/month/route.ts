import { NextRequest, NextResponse } from "next/server"
import { getAvailableDaysForMonth } from "@/lib/google-calendar"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const month = searchParams.get("month")
    const duration = searchParams.get("duration")

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

    return NextResponse.json({ days })
  } catch (error) {
    console.error("Error fetching month availability:", error)
    return NextResponse.json(
      { error: "Error al consultar la disponibilidad. Por favor, inténtalo más tarde." },
      { status: 500 }
    )
  }
}
