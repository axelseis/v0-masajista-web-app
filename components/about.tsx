import Image from "next/image"

export function About() {
  return (
    <section id="sobre-mi" className="bg-secondary px-6 py-24 md:py-32 relative">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-20">
          {/* Image */}
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src="/images/about.jpg"
              alt="Terapia de masaje profesional"
              fill
              className="object-cover"
            />
          </div>

          {/* Content */}
          <div>
            <p className="mb-3 text-sm uppercase tracking-[0.3em] text-muted-foreground">
              Sobre mí
            </p>
            <h2 className="font-serif text-4xl font-light text-foreground md:text-5xl">
              <span className="text-balance">Sylvie Le Roux</span>
            </h2>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                Soy Sylvie, masajista profesional especializada en terapias corporales enfocadas en la reconexión y el bienestar. Mi trabajo se basa en la escucha del cuerpo y la adaptación de cada sesión a las necesidades únicas de cada persona.
              </p>
              <p>
                Creo firmemente que el cuerpo guarda memorias y tensiones que, con el toque adecuado, podemos liberar. Cada sesión es un espacio seguro donde puedes soltar, respirar y reencontrarte contigo misma.
              </p>
              <p>
                Formada en diversas técnicas de masaje terapéutico y relajante, ofrezco mis servicios en el barrio de Sant Andreu, Barcelona, en un espacio pensado para la calma y la desconexión.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-6">
              <div>
                <p className="font-serif text-3xl font-light text-primary">+500</p>
                <p className="mt-1 text-sm text-muted-foreground">Sesiones realizadas</p>
              </div>
              <div>
                <p className="font-serif text-3xl font-light text-primary">4</p>
                <p className="mt-1 text-sm text-muted-foreground">Técnicas especializadas</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
