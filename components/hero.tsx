"use client"

import Link from "next/link"
import { ChevronDown } from "lucide-react"
import { useLanguage } from "@/locale/i18n"

export function Hero() {
  const { t } = useLanguage()

  return (
    <section id="inicio" className="relative min-h-screen">
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/hero2.png')",
          backgroundAttachment: "fixed",
        }}
        role="img"
        aria-label={t.hero.imageAlt}
      />
      <div className="absolute inset-0 bg-foreground/50" />

      <div className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-24 pb-28 text-center">
        <p className="mb-4 text-sm uppercase tracking-[0.3em] text-secondary/80">
          {t.hero.subtitle}
        </p>
        <h1 className="font-serif text-5xl font-light leading-tight text-secondary md:text-7xl lg:text-8xl">
          <span className="text-balance">{t.hero.title1}</span>
          <br />
          <span className="italic text-balance">{t.hero.title2}</span>
        </h1>
        <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-secondary/80 md:text-lg">
          {t.hero.description}
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Link
            href="#servicios"
            className="rounded-sm bg-primary px-8 py-3 text-sm font-medium uppercase tracking-widest text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {t.hero.discoverServices}
          </Link>
          <Link
            href="/reservas"
            className="rounded-sm border border-secondary/40 px-8 py-3 text-sm font-medium uppercase tracking-widest text-secondary transition-colors hover:bg-secondary/10"
          >
            {t.hero.bookAppointment}
          </Link>
        </div>
      </div>

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs uppercase tracking-widest text-secondary/60">{t.hero.scroll}</span>
          <div className="flex flex-col items-center gap-0.5">
            <div className="h-12 w-px bg-secondary/30" />
            <ChevronDown className="h-4 w-4 -mt-3 -mb-1 text-secondary/60" strokeWidth={1.5} />
          </div>
        </div>
      </div>
    </section>
  )
}
