"use client"

import { useState, useCallback, useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { services, toppings, type Service } from "@/lib/services"
import type { TimeSlot } from "@/lib/google-calendar"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock,
  CalendarDays,
  User,
  Loader2,
  Hand,
  Brain,
  Waves,
  Heart,
  Users2,
  Activity,
  Plus,
  Minus,
} from "lucide-react"
import { es } from "date-fns/locale"
import Link from "next/link"
import { cn } from "@/lib/utils"

const serviceIcons: Record<string, React.ElementType> = {
  californiano: Waves,
  "californiano-4-manos": Users2,
  "deep-tissue": Hand,
  descontracturante: Activity,
  neurosedante: Brain,
  acompanamiento: Heart,
}

function formatDuration(minutes: number): string {
  if (minutes === 60) return "1 h"
  if (minutes === 75) return "1 h 15 min"
  if (minutes === 90) return "1 h 30 min"
  return `${minutes} min`
}

function toLocalDateString(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

function formatTotalDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (m === 0) return `${h} h`
  return `${h} h ${m} min`
}

const steps = [
  { id: 1, label: "Masaje", icon: Hand },
  { id: 2, label: "Duración", icon: Clock },
  { id: 3, label: "Fecha", icon: CalendarDays },
  { id: 4, label: "Datos", icon: User },
]

interface FormData {
  name: string
  phone: string
  email: string
  notes: string
}

interface BookingResult {
  service: string
  date: string
  time: string
  duration: number
  price: number
  name: string
}

type DurationOption = { minutes: number; price: number }

export function BookingStepper() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedDuration, setSelectedDuration] = useState<DurationOption | null>(null)
  const [selectedToppings, setSelectedToppings] = useState<Record<string, number>>({})
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [slots, setSlots] = useState<TimeSlot[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [bookingResult, setBookingResult] = useState<BookingResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    email: "",
    notes: "",
  })
  const [calendarMonth, setCalendarMonth] = useState<Date>(() => new Date())
  const [availableDays, setAvailableDays] = useState<Record<string, boolean>>({})
  const [, setLoadingMonthAvailability] = useState(false)

  const fetchSlots = useCallback(
    async (date: Date, duration: number) => {
      setLoadingSlots(true)
      setError(null)
      try {
        const dateStr = toLocalDateString(date)
        const res = await fetch(
          `/api/availability?date=${dateStr}&duration=${duration}`
        )
        const data = await res.json()
        if (res.ok) {
          setSlots(data.slots)
        } else {
          setError(data.error || "Error al cargar disponibilidad.")
          setSlots([])
        }
      } catch {
        setError("Error de conexión. Inténtalo de nuevo.")
        setSlots([])
      } finally {
        setLoadingSlots(false)
      }
    },
    []
  )

  const fetchMonthAvailability = useCallback(
    async (month: Date, duration: number) => {
      setLoadingMonthAvailability(true)
      try {
        const monthStr = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, "0")}`
        const res = await fetch(
          `/api/availability/month?month=${monthStr}&duration=${duration}`
        )
        const data = await res.json()
        if (res.ok) {
          setAvailableDays(data.days)
        } else {
          setAvailableDays({})
        }
      } catch {
        setAvailableDays({})
      } finally {
        setLoadingMonthAvailability(false)
      }
    },
    []
  )

  const totalDuration =
    (selectedDuration?.minutes ?? 0) +
    toppings.reduce(
      (sum, t) => sum + (selectedToppings[t.id] ?? 0) * t.duration,
      0
    )
  const totalPrice =
    (selectedDuration?.price ?? 0) +
    toppings.reduce(
      (sum, t) => sum + (selectedToppings[t.id] ?? 0) * t.price,
      0
    )

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    setSelectedTime(null)
  }

  useEffect(() => {
    if (currentStep === 3 && selectedDate && totalDuration > 0) {
      fetchSlots(selectedDate, totalDuration)
    }
  }, [currentStep, selectedDate, totalDuration, fetchSlots])

  useEffect(() => {
    if (currentStep === 3 && totalDuration > 0) {
      fetchMonthAvailability(calendarMonth, totalDuration)
    }
  }, [currentStep, calendarMonth, totalDuration, fetchMonthAvailability])

  const handleSubmit = async () => {
    if (!selectedService || !selectedDuration || !selectedDate || !selectedTime) return

    setSubmitting(true)
    setError(null)

    const toppingsPayload = toppings
      .filter((t) => (selectedToppings[t.id] ?? 0) > 0)
      .map((t) => ({ id: t.id, quantity: selectedToppings[t.id] ?? 0 }))

    try {
      const dateStr = toLocalDateString(selectedDate)
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: selectedService.id,
          duration: totalDuration,
          baseDuration: selectedDuration.minutes,
          toppings: toppingsPayload,
          date: dateStr,
          time: selectedTime,
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          notes: formData.notes || undefined,
        }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setBookingResult(data.booking)
        setCurrentStep(5) // Success step
      } else {
        setError(data.error || "Error al crear la reserva.")
      }
    } catch {
      setError("Error de conexión. Inténtalo de nuevo.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleReset = () => {
    setCurrentStep(1)
    setSelectedService(null)
    setSelectedDuration(null)
    setSelectedToppings({})
    setSelectedDate(undefined)
    setSelectedTime(null)
    setSlots([])
    setBookingResult(null)
    setError(null)
    setFormData({ name: "", phone: "", email: "", notes: "" })
    setCalendarMonth(new Date())
    setAvailableDays({})
  }

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service)
    setSelectedDuration(null)
  }

  const setToppingQuantity = (toppingId: string, delta: number) => {
    setSelectedToppings((prev) => {
      const current = prev[toppingId] ?? 0
      const next = Math.max(0, current + delta)
      if (next === 0) {
        const rest = { ...prev }
        delete rest[toppingId]
        return rest
      }
      return { ...prev, [toppingId]: next }
    })
  }

  const isFormValid =
    formData.name.trim().length >= 2 &&
    formData.phone.trim().length >= 6 &&
    (formData.email.trim() === "" ||
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))

  const disabledDays = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (date < today) return true
    const dateStr = toLocalDateString(date)
    if (availableDays[dateStr] === false) return true
    return false
  }

  // Success state
  if (currentStep === 5 && bookingResult) {
    return (
      <div className="flex flex-col items-center gap-8 py-12 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <Check className="h-10 w-10 text-primary" />
        </div>
        <div>
          <h2 className="font-serif text-3xl font-light text-foreground md:text-4xl">
            Reserva confirmada
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            Hemos registrado tu cita correctamente. Te esperamos.
          </p>
        </div>
        <div className="w-full max-w-sm rounded-lg border border-border bg-card p-6">
          <dl className="flex flex-col gap-4 text-left text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Servicio</dt>
              <dd className="font-medium text-foreground">
                {bookingResult.service}
              </dd>
            </div>
            <div className="h-px bg-border" />
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Fecha</dt>
              <dd className="font-medium text-foreground">
                {new Date(bookingResult.date + "T12:00:00").toLocaleDateString(
                  "es-ES",
                  {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  }
                )}
              </dd>
            </div>
            <div className="h-px bg-border" />
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Hora</dt>
              <dd className="font-medium text-foreground">
                {bookingResult.time}h
              </dd>
            </div>
            <div className="h-px bg-border" />
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Duración</dt>
              <dd className="font-medium text-foreground">
                {bookingResult.duration} min
              </dd>
            </div>
            {bookingResult.price != null && (
              <>
                <div className="h-px bg-border" />
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Precio total</dt>
                  <dd className="font-medium text-foreground">
                    {bookingResult.price} €
                  </dd>
                </div>
              </>
            )}
          </dl>
        </div>
        <p className="max-w-sm text-xs leading-relaxed text-muted-foreground">
          Recuerda: se requiere avisar con más de 12 horas de antelación para
          cancelaciones.
        </p>
        <div className="flex gap-4">
          <Button variant="outline" onClick={handleReset}>
            Nueva reserva
          </Button>
          <Button asChild>
            <Link href="/">Volver al inicio</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-10">
      {/* Stepper indicator */}
      <nav aria-label="Progreso de reserva" className="mx-auto w-full max-w-lg">
        <ol className="flex items-center justify-between">
          {steps.map((step, index) => {
            const isActive = currentStep === step.id
            const isCompleted = currentStep > step.id
            const StepIcon = step.icon
            return (
              <li key={step.id} className="flex flex-1 items-center">
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300",
                      isCompleted
                        ? "border-primary bg-primary text-primary-foreground"
                        : isActive
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-background text-muted-foreground"
                    )}
                  >
                    {isCompleted ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <StepIcon className="h-4 w-4" />
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-xs font-medium transition-colors",
                      isActive || isCompleted
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "mb-6 h-px flex-1 transition-colors",
                      currentStep > step.id ? "bg-primary" : "bg-border"
                    )}
                  />
                )}
              </li>
            )
          })}
        </ol>
      </nav>

      {/* Error message */}
      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-center text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Step 1: Masaje - solo selección de servicio */}
      {currentStep === 1 && (
        <div className="flex flex-col gap-6">
          <div className="text-center">
            <h2 className="font-serif text-2xl font-light text-foreground md:text-3xl">
              <span className="text-balance">
                {"¿Qué tratamiento necesitas?"}
              </span>
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Selecciona el tipo de masaje para tu sesión
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {services.map((service) => {
              const Icon = serviceIcons[service.id] || Hand
              const isSelected = selectedService?.id === service.id
              const minPrice = service.durations[0]?.price
              return (
                <button
                  key={service.id}
                  onClick={() => handleServiceSelect(service)}
                  className={cn(
                    "group flex cursor-pointer flex-col gap-4 rounded-lg border-2 p-6 text-left transition-all duration-200",
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card hover:border-primary/40 hover:bg-card"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full transition-colors",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    {minPrice != null && (
                      <span
                        className={cn(
                          "rounded-sm px-2.5 py-1 text-xs font-medium",
                          isSelected
                            ? "bg-primary/10 text-primary"
                            : "bg-secondary text-muted-foreground"
                        )}
                      >
                        Desde {minPrice} €
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-medium text-foreground">
                      {service.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {service.shortDescription}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
          <div className="flex justify-end">
            <Button
              onClick={() => setCurrentStep(2)}
              disabled={!selectedService}
              className="gap-2"
            >
              Continuar
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Duración + toppings */}
      {currentStep === 2 && (
        <div className="flex flex-col gap-6">
          <div className="text-center">
            <h2 className="font-serif text-2xl font-light text-foreground md:text-3xl">
              <span className="text-balance">
                Duración y toppings
              </span>
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {selectedService?.title}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium text-foreground">
              Selecciona la duración del masaje
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedService?.durations.map((d) => {
                const isSelected =
                  selectedDuration?.minutes === d.minutes &&
                  selectedDuration?.price === d.price
                return (
                  <button
                    key={d.minutes}
                    type="button"
                    onClick={() => setSelectedDuration(d)}
                    className={cn(
                      "cursor-pointer rounded-lg border-2 px-4 py-3 text-center text-sm font-medium transition-all duration-200",
                      isSelected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-foreground hover:border-primary/40"
                    )}
                  >
                    {formatDuration(d.minutes)} — {d.price} €
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium text-foreground">
              Completa tu experiencia eligiendo uno o más toppings:
            </p>
            <div className="flex flex-col gap-3">
              {toppings.map((topping) => {
                const qty = selectedToppings[topping.id] ?? 0
                return (
                  <div
                    key={topping.id}
                    className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3"
                  >
                    <div>
                      <p className="font-medium text-foreground">
                        {topping.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {topping.duration} min — +{topping.price} €
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setToppingQuantity(topping.id, -1)}
                        disabled={qty === 0}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="min-w-8 text-center text-sm font-medium">
                        {qty}
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setToppingQuantity(topping.id, 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {selectedDuration && (
            <div className="rounded-lg border-2 border-primary/20 bg-primary/5 px-4 py-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Duración total: {formatTotalDuration(totalDuration)}
                  </p>
                  <p className="text-lg font-semibold text-primary">
                    {totalPrice} €
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(1)}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Atrás
            </Button>
            <Button
              onClick={() => setCurrentStep(3)}
              disabled={!selectedDuration}
              className="gap-2"
            >
              Elegir fecha
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Fecha + hora combinados */}
      {currentStep === 3 && (
        <div className="flex flex-col gap-6">
          <div className="text-center">
            <h2 className="font-serif text-2xl font-light text-foreground md:text-3xl">
              <span className="text-balance">
                ¿Qué día y hora te va bien?
              </span>
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Disponible de lunes a domingo, 9:00–20:00 — {selectedService?.title}
            </p>
          </div>

          <div className="flex flex-wrap gap-6">
            <div className="min-w-0 flex-0 basis-[270px]">
              <p className="mb-3 text-sm font-medium text-foreground">
                Selecciona la fecha
              </p>
              <div className="rounded-lg border border-border bg-card p-2">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  disabled={disabledDays}
                  month={calendarMonth}
                  onMonthChange={setCalendarMonth}
                  locale={es}
                  className="text-foreground"
                />
              </div>
            </div>
            <div className="min-w-0 flex-1 basis-[280px]">
              <p className="mb-3 text-sm font-medium text-foreground">
                Horarios disponibles
              </p>
              {!selectedDate ? (
                <div className="flex h-[280px] items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
                  Elige una fecha para ver los horarios
                </div>
              ) : loadingSlots ? (
                <div className="flex h-[280px] flex-col items-center justify-center gap-4 rounded-lg border border-border">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">
                    Consultando disponibilidad...
                  </p>
                </div>
              ) : slots.length > 0 ? (
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {slots.map((slot) => (
                    <button
                      key={slot.time}
                      onClick={() =>
                        slot.available && setSelectedTime(slot.time)
                      }
                      disabled={!slot.available}
                      className={cn(
                        "rounded-lg border-2 px-3 py-2.5 text-center text-sm font-medium transition-all duration-200",
                        !slot.available
                          ? "cursor-not-allowed border-border bg-muted text-muted-foreground line-through opacity-50"
                          : selectedTime === slot.time
                            ? "cursor-pointer border-primary bg-primary text-primary-foreground"
                            : "cursor-pointer border-border bg-card text-foreground hover:border-primary/40"
                      )}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex h-[280px] items-center justify-center rounded-lg border border-border text-center text-sm text-muted-foreground">
                  No hay horarios disponibles para este día. Prueba otra fecha.
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => {
                setCurrentStep(2)
                setSelectedDate(undefined)
                setSelectedTime(null)
                setSlots([])
              }}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Atrás
            </Button>
            <Button
              onClick={() => setCurrentStep(4)}
              disabled={!selectedTime}
              className="gap-2"
            >
              Ir a datos
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: Client details */}
      {currentStep === 4 && (
        <div className="flex flex-col gap-6">
          <div className="text-center">
            <h2 className="font-serif text-2xl font-light text-foreground md:text-3xl">
              <span className="text-balance">Tus datos de contacto</span>
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Para confirmar tu reserva y poder contactarte
            </p>
          </div>

          {/* Booking summary */}
          <div className="mx-auto w-full max-w-md rounded-lg border border-border bg-secondary/30 p-4">
            <div className="flex flex-col gap-2 text-sm text-foreground">
              <div className="flex flex-wrap items-center justify-center gap-2">
                <span className="font-medium">{selectedService?.title}</span>
                <span className="text-muted-foreground">·</span>
                <span>
                  {selectedDate?.toLocaleDateString("es-ES", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                  })}
                </span>
                <span className="text-muted-foreground">·</span>
                <span>{selectedTime}h</span>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 text-muted-foreground">
                <span>{formatTotalDuration(totalDuration)}</span>
                <span>·</span>
                <span className="font-medium text-foreground">{totalPrice} €</span>
                {Object.keys(selectedToppings).length > 0 && (
                  <>
                    <span>·</span>
                    <span>
                      {Object.entries(selectedToppings)
                        .filter(([, q]) => q > 0)
                        .map(
                          ([id, q]) =>
                            `${toppings.find((t) => t.id === id)?.title} x${q}`
                        )
                        .join(", ")}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSubmit()
            }}
            className="mx-auto flex w-full max-w-md flex-col gap-5"
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">
                Nombre completo <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Tu nombre"
                required
                minLength={2}
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="phone">
                Teléfono <span className="text-destructive">*</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+34 612 345 678"
                required
                minLength={6}
                value={formData.phone}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, phone: e.target.value }))
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">
                Email (opcional)
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="notes">Notas (opcional)</Label>
              <Textarea
                id="notes"
                placeholder="Cuéntame si hay algo que deba saber: lesiones, alergias, zona de molestia..."
                rows={3}
                value={formData.notes}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, notes: e.target.value }))
                }
              />
            </div>

            <div className="flex justify-between pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(3)}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Atrás
              </Button>
              <Button
                type="submit"
                disabled={!isFormValid || submitting}
                className="gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Confirmando...
                  </>
                ) : (
                  <>
                    Confirmar reserva
                    <Check className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </form>

          <p className="mx-auto max-w-md text-center text-xs text-muted-foreground">
            Al confirmar, aceptas nuestra política de cancelación: se requiere
            aviso con más de 12 horas de antelación.
          </p>
        </div>
      )}
    </div>
  )
}
