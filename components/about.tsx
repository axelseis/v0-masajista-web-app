"use client"

import Image from "next/image"
import { useLanguage } from "@/lib/i18n"

export function About() {
  const { t } = useLanguage()

  return (
    <section id="sobre-mi" className="bg-secondary px-6 py-24 md:py-32 relative">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-20">
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src="/images/about.jpg"
              alt={t.about.imageAlt}
              fill
              className="object-cover"
            />
          </div>

          <div>
            <p className="mb-3 text-sm uppercase tracking-[0.3em] text-muted-foreground">
              {t.about.label}
            </p>
            <h2 className="font-serif text-4xl font-light text-foreground md:text-5xl">
              <span className="text-balance">Sylvie Le Roux</span>
            </h2>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>{t.about.bio1}</p>
              <p>{t.about.bio2}</p>
              <p>{t.about.bio3}</p>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-6">
              <div>
                <p className="font-serif text-3xl font-light text-primary">+500</p>
                <p className="mt-1 text-sm text-muted-foreground">{t.about.sessions}</p>
              </div>
              <div>
                <p className="font-serif text-3xl font-light text-primary">4</p>
                <p className="mt-1 text-sm text-muted-foreground">{t.about.techniques}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
