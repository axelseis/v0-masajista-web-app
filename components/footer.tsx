import Link from "next/link"
import { Instagram } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-background px-6 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 md:flex-row md:justify-between">
        <div className="text-center md:text-left">
          <Link href="#inicio" className="font-serif text-xl font-semibold tracking-tight text-foreground">
            Sylvie Le Roux
          </Link>
          <p className="mt-1 text-sm text-muted-foreground">
            Terapias corporales en Barcelona
          </p>
        </div>

        <div className="flex items-center gap-6">
          <Link
            href="#servicios"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Servicios
          </Link>
          <Link
            href="#sobre-mi"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Sobre mí
          </Link>
          <Link
            href="#contacto"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Contacto
          </Link>
          <Link
            href="https://www.instagram.com/sylvie.leroux.masaje/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram de Sylvie Le Roux"
            className="text-muted-foreground transition-colors hover:text-primary"
          >
            <Instagram className="h-5 w-5" />
          </Link>
        </div>

        <p className="text-xs text-muted-foreground">
          {"© 2026 Sylvie Le Roux. Todos los derechos reservados."}
        </p>
      </div>
    </footer>
  )
}
