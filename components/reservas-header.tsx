"use client"

import { useLanguage } from "@/locale/i18n"

export function ReservasHeader() {
  const { t } = useLanguage()

  return (
    <div className="mb-12 text-center">
      <p className="mb-3 text-sm uppercase tracking-[0.3em] text-muted-foreground">
        {t.reservas.label}
      </p>
      <h1 className="font-serif text-4xl font-light text-foreground md:text-5xl lg:text-6xl">
        <span className="text-balance">{t.reservas.title}</span>
      </h1>
      <p className="mt-4 text-base leading-relaxed text-muted-foreground">
        {t.reservas.description}
      </p>
    </div>
  )
}
