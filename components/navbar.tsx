"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, X, Instagram, Globe } from "lucide-react"
import { useLanguage, LOCALES, type Locale } from "@/lib/i18n"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const isHome = pathname === "/"
  const getHref = (hash: string) => (isHome ? hash : `/${hash}`)
  const { locale, setLocale, t } = useLanguage()

  const navLinks = [
    { label: t.nav.home, href: "#inicio" },
    { label: t.nav.services, href: "#servicios" },
    { label: t.nav.about, href: "#sobre-mi" },
    { label: t.nav.contact, href: "#contacto" },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href={getHref("#inicio")} className="flex items-center gap-3">
          <Image src="/blau_logo.svg" alt="" width={36} height={16} className="h-4 w-auto" aria-hidden />
          <Image src="/text_blau.svg" alt="Sylvie Le Roux" width={140} height={42} className="h-6 w-auto" />
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={getHref(link.href)}
              className="text-sm tracking-wide text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="https://www.instagram.com/sylvie.leroux.masaje/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t.nav.instagramLabel}
            className="text-muted-foreground transition-colors hover:text-primary"
          >
            <Instagram className="h-5 w-5" />
          </Link>
          <Link
            href="/reservas"
            className="rounded-sm bg-primary px-5 py-2 text-sm font-medium tracking-wide text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {t.nav.book}
          </Link>
          <LanguageSelector locale={locale} setLocale={setLocale} />
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-foreground md:hidden"
          aria-label={isOpen ? t.nav.closeMenu : t.nav.openMenu}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {isOpen && (
        <div className="border-t border-border bg-background px-6 py-6 md:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={getHref(link.href)}
                onClick={() => setIsOpen(false)}
                className="text-base tracking-wide text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-4 flex items-center gap-4">
              <Link
                href="https://www.instagram.com/sylvie.leroux.masaje/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t.nav.instagramLabel}
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="/reservas"
                onClick={() => setIsOpen(false)}
                className="rounded-sm bg-primary px-5 py-2 text-sm font-medium tracking-wide text-primary-foreground transition-colors hover:bg-primary/90"
              >
                {t.nav.book}
              </Link>
              <LanguageSelector locale={locale} setLocale={setLocale} />
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

function LanguageSelector({
  locale,
  setLocale,
}: {
  locale: Locale
  setLocale: (l: Locale) => void
}) {
  return (
    <div className="flex items-center gap-1.5">
      <Globe className="h-3.5 w-3.5 text-muted-foreground" />
      <div className="flex items-center">
        {LOCALES.map((l, i) => (
          <span key={l} className="flex items-center">
            {i > 0 && (
              <span className="mx-0.5 text-[10px] text-muted-foreground/40">
                /
              </span>
            )}
            <button
              onClick={() => setLocale(l)}
              className={`px-1 py-0.5 text-[11px] uppercase tracking-wider transition-colors ${
                locale === l
                  ? "text-foreground font-semibold"
                  : "text-muted-foreground/50 hover:text-muted-foreground"
              }`}
            >
              {l}
            </button>
          </span>
        ))}
      </div>
    </div>
  )
}
