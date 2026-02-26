import { Quote } from "lucide-react"

const testimonials = [
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

export function Testimonials() {
  return (
    <section className="bg-background px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-muted-foreground">
            Testimonios
          </p>
          <h2 className="font-serif text-4xl font-light text-foreground md:text-5xl">
            <span className="text-balance">Lo que dicen quienes confían en mí</span>
          </h2>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="flex flex-col rounded-sm border border-border bg-card p-8"
            >
              <Quote className="mb-4 h-6 w-6 text-primary/40" />
              <p className="flex-1 text-base leading-relaxed text-muted-foreground italic">
                {`"${t.text}"`}
              </p>
              <div className="mt-6 border-t border-border pt-4">
                <p className="font-serif text-lg font-medium text-foreground">{t.name}</p>
                <p className="text-sm text-muted-foreground">{t.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
