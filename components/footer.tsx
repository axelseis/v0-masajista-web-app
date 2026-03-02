"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Instagram } from "lucide-react"
import { useLanguage } from "@/locale/i18n"

export function Footer() {
  const { t } = useLanguage()
  const pathname = usePathname()
  const isHome = pathname === "/"
  const getHref = (hash: string) => (isHome ? hash : `/${hash}`)

  return (
    <footer className="border-t border-border bg-background px-6 py-12 relative">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 md:flex-row md:justify-between">
        <div className="text-center md:text-left">
          <Link href={getHref("#inicio")} className="flex flex-col items-center">
            <Image src="/blau_logo.svg" alt="Sylvie Le Roux" width={36} height={16} className="h-8 w-auto" aria-hidden />
            <Image src="/text_blau.svg" alt="Masaje" width={36} height={16} className="mt-5 h-8 w-auto" aria-hidden />
          </Link>
        </div>

        <div className="flex items-center gap-6">
          <Link
            href={getHref("#servicios")}
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {t.nav.services}
          </Link>
          <Link
            href={getHref("#sobre-mi")}
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {t.nav.about}
          </Link>
          <Link
            href={getHref("#contacto")}
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {t.nav.contact}
          </Link>
          <Link
            href="https://www.instagram.com/sylvie.leroux.masaje/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t.nav.instagramLabel}
            className="text-muted-foreground transition-colors hover:text-primary"
          >
            <Instagram className="h-5 w-5" />
          </Link>
        </div>

        <p className="text-xs text-muted-foreground">
          {t.footer.copyright}
        </p>
      </div>
    </footer>
  )
}
