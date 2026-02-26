import { BookingStepper } from "@/components/booking-stepper"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Reservar cita | Sylvie Le Roux Masaje",
  description:
    "Reserva tu sesión de masaje terapéutico en Barcelona. Elige el tratamiento, fecha y hora que mejor te convenga.",
}

export default function ReservasPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background px-6 pb-24 pt-32 md:pt-40">
        <div className="mx-auto max-w-3xl">
          <div className="mb-12 text-center">
            <p className="mb-3 text-sm uppercase tracking-[0.3em] text-muted-foreground">
              Reservas
            </p>
            <h1 className="font-serif text-4xl font-light text-foreground md:text-5xl lg:text-6xl">
              <span className="text-balance">Reserva tu sesión</span>
            </h1>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Selecciona el tratamiento, elige el día y la hora, y completa tus
              datos para confirmar tu cita.
            </p>
          </div>
          <BookingStepper />
        </div>
      </main>
      <Footer />
    </>
  )
}
