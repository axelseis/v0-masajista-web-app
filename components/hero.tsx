import Image from "next/image"
import Link from "next/link"

export function Hero() {
  return (
    <section id="inicio" className="relative min-h-screen">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-massage.jpg"
          alt="Espacio de masaje sereno y acogedor"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-foreground/50" />
      </div>

      {/* Content */}
      <div className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <p className="mb-4 text-sm uppercase tracking-[0.3em] text-secondary/80">
          Terapias Corporales en Barcelona
        </p>
        <h1 className="font-serif text-5xl font-light leading-tight text-secondary md:text-7xl lg:text-8xl">
          <span className="text-balance">Reconecta con</span>
          <br />
          <span className="italic text-balance">tu cuerpo</span>
        </h1>
        <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-secondary/80 md:text-lg">
          Un espacio para soltar tensiones, restaurar la calma y reencontrarte contigo misma.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Link
            href="#servicios"
            className="rounded-sm bg-primary px-8 py-3 text-sm font-medium uppercase tracking-widest text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Descubrir Servicios
          </Link>
          <Link
            href="https://wa.me/34695544840"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-sm border border-secondary/40 px-8 py-3 text-sm font-medium uppercase tracking-widest text-secondary transition-colors hover:bg-secondary/10"
          >
            Reservar Cita
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs uppercase tracking-widest text-secondary/60">Scroll</span>
          <div className="h-12 w-px bg-secondary/30" />
        </div>
      </div>
    </section>
  )
}
