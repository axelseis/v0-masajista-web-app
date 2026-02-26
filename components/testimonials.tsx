import { getGoogleReviews } from "@/lib/google-places"
import { TestimonialsContent } from "./testimonials-content"

const FALLBACK_TESTIMONIALS = [
  {
    text: "Salí de la sesión con una sensación de ligereza que no sentía hacía meses. Sylvie tiene unas manos mágicas y una capacidad increíble para escuchar lo que tu cuerpo necesita.",
    name: "Laura M.",
    detail: "Masaje Californiano",
  },
  {
    text: "Llevaba años con una contractura crónica en la espalda. Después de varias sesiones de Deep Tissue con Sylvie, por fin siento alivio real. Muy recomendable.",
    name: "Carlos R.",
    detail: "Deep Tissue",
  },
  {
    text: "El masaje neurosedante fue una experiencia transformadora. Me ayudó a desconectar por completo del estrés diario. Ahora es mi ritual mensual imprescindible.",
    name: "Ana P.",
    detail: "Masaje Neurosedante",
  },
]

export async function Testimonials() {
  const googleReviews = await getGoogleReviews({ minStars: 5, maxReviews: 3 })
  const testimonials =
    googleReviews.length >= 1
      ? googleReviews.map((r) => ({
          text: r.text,
          name: r.name,
          detail: r.detail ?? "Google",
        }))
      : FALLBACK_TESTIMONIALS

  return <TestimonialsContent testimonials={testimonials} />
}
