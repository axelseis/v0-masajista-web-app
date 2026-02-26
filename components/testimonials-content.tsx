"use client"

import { Quote } from "lucide-react"
import { useLanguage } from "@/lib/i18n"

interface Testimonial {
  text: string
  name: string
  detail: string
}

export function TestimonialsContent({
  testimonials,
}: {
  testimonials: Testimonial[]
}) {
  const { t } = useLanguage()

  return (
    <section className="bg-background px-6 py-24 md:py-32 relative">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-muted-foreground">
            {t.testimonials.label}
          </p>
          <h2 className="font-serif text-4xl font-light text-foreground md:text-5xl">
            <span className="text-balance">{t.testimonials.title}</span>
          </h2>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={`${testimonial.name}-${testimonial.text.slice(0, 30)}`}
              className="flex flex-col rounded-sm border border-border bg-card p-8"
            >
              <Quote className="mb-4 h-6 w-6 text-primary/40" />
              <p className="flex-1 text-base leading-relaxed text-muted-foreground italic">
                {`"${testimonial.text}"`}
              </p>
              <div className="mt-6 border-t border-border pt-4">
                <p className="font-serif text-lg font-medium text-foreground">
                  {testimonial.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {testimonial.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
