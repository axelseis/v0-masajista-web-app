"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { services } from "@/lib/services"

export function Services() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="servicios" className="bg-background px-6 py-24 md:py-32">
      <div className="mx-auto max-w-4xl">
        <p className="mb-3 text-sm uppercase tracking-[0.3em] text-muted-foreground">
          Servicios
        </p>
        <h2 className="font-serif text-4xl font-light text-foreground md:text-5xl lg:text-6xl">
          <span className="text-balance">Tratamientos para tu bienestar</span>
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
          Cada sesión es un viaje único, adaptado a lo que tu cuerpo pide en ese momento. Descubre las técnicas que ofrezco para ayudarte a soltar, respirar y reconectarte.
        </p>

        {/* Service accordion */}
        <div className="mt-16 divide-y divide-border">
          {services.map((service, index) => {
            const isOpen = openIndex === index
            return (
              <div key={service.title} className="group">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between py-6 text-left transition-colors"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-baseline gap-6">
                    <span className="font-serif text-sm text-muted-foreground">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-serif text-2xl font-normal text-foreground transition-colors group-hover:text-primary md:text-3xl">
                      {service.title}
                    </h3>
                  </div>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr] pb-6 opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="flex flex-col gap-4 pl-12 md:flex-row md:items-start md:justify-between md:pl-14">
                      <p className="max-w-lg text-base leading-relaxed text-muted-foreground">
                        {service.description}
                      </p>
                      <span className="shrink-0 rounded-sm bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground">
                        {service.durations
                          .map((d) =>
                            d.minutes === 60
                              ? "1 h"
                              : d.minutes === 75
                                ? "1 h 15 min"
                                : d.minutes === 90
                                  ? "1 h 30 min"
                                  : `${d.minutes} min`
                          )
                          .join(" / ")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
