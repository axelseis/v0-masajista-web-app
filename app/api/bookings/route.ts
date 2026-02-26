import { NextResponse } from "next/server"
import { z } from "zod"
import { createBookingEvent, getAvailableSlots } from "@/lib/google-calendar"
import { services } from "@/lib/services"

const bookingSchema = z.object({
  serviceId: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres."),
  phone: z.string().min(6, "El teléfono debe tener al menos 6 dígitos."),
  email: z.string().email("Email inválido."),
  notes: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = bookingSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos.", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const data = parsed.data

    // Find the service
    const service = services.find((s) => s.id === data.serviceId)
    if (!service) {
      return NextResponse.json(
        { error: "Servicio no encontrado." },
        { status: 400 }
      )
    }

    // Verify the slot is still available (prevent double booking)
    const slots = await getAvailableSlots(data.date, service.duration)
    const selectedSlot = slots.find((s) => s.time === data.time)

    if (!selectedSlot || !selectedSlot.available) {
      return NextResponse.json(
        { error: "Lo sentimos, esta hora ya no está disponible. Por favor, selecciona otra." },
        { status: 409 }
      )
    }

    // Create the booking event
    const eventId = await createBookingEvent({
      service: data.serviceId,
      serviceTitle: service.title,
      date: data.date,
      time: data.time,
      duration: service.duration,
      name: data.name,
      phone: data.phone,
      email: data.email,
      notes: data.notes,
    })

    return NextResponse.json({
      success: true,
      eventId,
      message: "Reserva confirmada correctamente.",
      booking: {
        service: service.title,
        date: data.date,
        time: data.time,
        duration: service.duration,
        name: data.name,
      },
    })
  } catch (error) {
    console.error("Error creating booking:", error)
    return NextResponse.json(
      { error: "Error al crear la reserva. Por favor, inténtalo más tarde." },
      { status: 500 }
    )
  }
}
