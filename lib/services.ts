export interface Service {
  id: string
  title: string
  shortDescription: string
  description: string
  duration: number // minutes
  durationLabel: string
}

export const services: Service[] = [
  {
    id: "californiano",
    title: "Masaje Californiano",
    shortDescription:
      "Técnica fluida y envolvente para integrar cuerpo y mente.",
    description:
      "Una técnica fluida y envolvente que busca la integración del cuerpo y la mente. Con movimientos largos y profundos, este masaje induce un estado de relajación total, reconectando con la respiración y liberando bloqueos emocionales.",
    duration: 60,
    durationLabel: "60 / 90 min",
  },
  {
    id: "deep-tissue",
    title: "Masaje Deep Tissue",
    shortDescription:
      "Libera tensiones crónicas trabajando las capas más profundas.",
    description:
      "Enfocado en liberar tensiones crónicas y trabajar las capas más profundas de la musculatura. Ideal para contracturas persistentes, este tratamiento combina presión firme y técnicas específicas para devolver movilidad y alivio duradero.",
    duration: 60,
    durationLabel: "60 / 90 min",
  },
  {
    id: "neurosedante",
    title: "Masaje Neurosedante",
    shortDescription:
      "Calma el sistema nervioso y reduce el estrés profundamente.",
    description:
      "Orientado a calmar el sistema nervioso y reducir el estrés. A través de toques suaves y rítmicos, este masaje actúa directamente sobre el sistema nervioso central, induciendo un profundo estado de calma y bienestar.",
    duration: 60,
    durationLabel: "60 min",
  },
  {
    id: "acompanamiento",
    title: "Acompañamiento Corporal",
    shortDescription:
      "Sesiones personalizadas para reconectar con tu cuerpo.",
    description:
      "Sesiones personalizadas para reconectar con el cuerpo y dejar ir tensiones acumuladas. Un espacio seguro donde escuchar lo que tu cuerpo necesita, combinando diferentes técnicas según el momento y las necesidades de cada persona.",
    duration: 75,
    durationLabel: "75 min",
  },
]
