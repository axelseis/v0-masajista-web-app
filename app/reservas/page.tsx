import { BookingStepper } from "@/components/booking-stepper"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ReservasHeader } from "@/components/reservas-header"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Reservar cita | Sylvie Le Roux Masaje",
  description:
    "Reserva tu sesión de masaje terapéutico en Barcelona. Elige el tratamiento, fecha y hora que mejor te convenga.",
}

export default async function ReservasPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>
}) {
  const params = await searchParams
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background px-6 pb-24 pt-32 md:pt-40">
        <div className="mx-auto max-w-3xl">
          <ReservasHeader />
          <BookingStepper initialServiceId={params?.service} />
        </div>
      </main>
      <Footer />
    </>
  )
}
