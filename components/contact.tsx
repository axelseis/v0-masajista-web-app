"use client"

import { MapPin, Clock, Phone, Instagram } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/locale/i18n"
import { settings } from "@/lib/settings"

export function Contact() {
  const { t } = useLanguage()
  const whatsappHref = `https://wa.me/${settings.contact.phone.replace(/\D/g, "")}`

  const details = [
    {
      icon: MapPin,
      label: t.contact.location,
      value: settings.contact.address,
      sub: settings.contact.addressSub,
    },
    {
      icon: Clock,
      label: t.contact.schedule,
      value: t.contact.scheduleValue,
      sub: t.contact.scheduleSub,
    },
    {
      icon: Phone,
      label: t.contact.bookings,
      value: "WhatsApp",
      sub: t.contact.bookingsSub,
      href: whatsappHref,
    },
    {
      icon: Instagram,
      label: "Instagram",
      value: "@sylvie.leroux.masaje",
      sub: t.contact.instagramSub,
      href: "https://www.instagram.com/sylvie.leroux.masaje/",
    },
  ]

  return (
    <section id="contacto" className="bg-secondary px-6 py-24 md:py-32 relative">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 md:grid-cols-2 md:gap-20">
          <div>
            <p className="mb-3 text-sm uppercase tracking-[0.3em] text-muted-foreground">
              {t.contact.label}
            </p>
            <h2 className="font-serif text-4xl font-light text-foreground md:text-5xl">
              <span className="text-balance">{t.contact.title}</span>
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
              {t.contact.description}
            </p>

            <div className="mt-10 space-y-8">
              {details.map((d) => (
                <div key={d.label} className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-primary/10">
                    <d.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">
                      {d.label}
                    </p>
                    {d.href ? (
                      <Link
                        href={d.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-serif text-lg text-foreground underline decoration-primary/30 underline-offset-4 transition-colors hover:text-primary"
                      >
                        {d.value}
                      </Link>
                    ) : (
                      <p className="font-serif text-lg text-foreground">{d.value}</p>
                    )}
                    <p className="text-sm text-muted-foreground">{d.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-sm">
            <iframe
              title={t.contact.mapTitle}
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2982.748!2d2.1751327!3d41.4115539!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12a4a31f7661c309%3A0x53c0f732d39b3f97!2sMasaje+Californiano+y+Deep+Tissue!5e0!3m2!1sen!2ses!4v1700000000000"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "400px" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="aspect-square md:aspect-auto"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
