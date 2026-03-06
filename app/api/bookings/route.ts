import { NextResponse } from "next/server"
import { z } from "zod"
import { createBookingEvent, getAvailableSlots } from "@/lib/google-calendar"
import { services, getBookingAdvanceDays } from "@/lib/services"
import { settings } from "@/lib/settings"

const toppingItemSchema = z.object({
  id: z.string(),
  quantity: z.number().int().min(0),
})

const bookingSchema = z.object({
  serviceId: z.string().min(1),
  duration: z
    .number()
    .min(settings.booking.minDurationMinutes)
    .max(settings.booking.maxDurationMinutes),
  baseDuration: z.number().optional(),
  toppings: z.array(toppingItemSchema).optional().default([]),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres."),
  phone: z.string().min(6, "El teléfono debe tener al menos 6 dígitos."),
  email: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.trim() === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
      "Email inválido."
    )
    .default(""),
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

    const baseDuration = data.baseDuration ?? data.duration
    const validBaseDuration = service.durations.some((d) => d.minutes === baseDuration)
    if (!validBaseDuration) {
      return NextResponse.json(
        { error: "Duración base no válida para este servicio." },
        { status: 400 }
      )
    }

    const baseOption = service.durations.find((d) => d.minutes === baseDuration)!
    let totalPrice = baseOption.price
    const toppingsInfo: string[] = []

    const advanceDays = getBookingAdvanceDays(service)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const [y, m, d] = data.date.split("-").map(Number)
    const requestedDate = new Date(y, m - 1, d)
    const daysDiff = Math.floor(
      (requestedDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000)
    )
    if (daysDiff < advanceDays) {
      return NextResponse.json(
        {
          error:
            "Esta fecha no cumple la antelación mínima de reserva para este servicio.",
        },
        { status: 400 }
      )
    }

    for (const t of data.toppings ?? []) {
      const topping = service.toppings.find((top) => top.id === t.id)
      if (topping && t.quantity > 0) {
        totalPrice += topping.price * t.quantity
        toppingsInfo.push(`${topping.title} x${t.quantity}`)
      }
    }

    // Verify the slot is still available (prevent double booking)
    const slots = await getAvailableSlots(data.date, data.duration)
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
      duration: data.duration,
      totalPrice,
      toppingsInfo: toppingsInfo.length > 0 ? toppingsInfo : undefined,
      name: data.name,
      phone: data.phone,
      email: data.email?.trim() || undefined,
      notes: data.notes,
    })

    return NextResponse.json({
      success: true,
      eventId,
      message: "Reserva confirmada correctamente.",
      booking: {
        serviceId: data.serviceId,
        service: service.title,
        date: data.date,
        time: data.time,
        duration: data.duration,
        price: totalPrice,
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
