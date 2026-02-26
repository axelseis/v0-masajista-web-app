export interface Topping {
  id: string
  title: string
  duration: number
  price: number
}

export const toppings: Topping[] = [
  { id: "pies", title: "Masaje de pies", duration: 15, price: 12 },
  { id: "manos-brazos", title: "Masaje de manos y brazos", duration: 15, price: 12 },
  { id: "cuello-cervicales", title: "Masaje de cuello y cervicales", duration: 15, price: 12 },
  { id: "espalda", title: "Masaje de espalda", duration: 15, price: 12 },
  { id: "craneal-facial", title: "Masaje craneal y facial", duration: 15, price: 12 },
]
export interface Service {
  id: string
  title: string
  shortDescription: string
  description: string
  durations: { minutes: number; price: number }[]
}

export const services: Service[] = [
  {
    id: "californiano",
    title: "Masaje Californiano",
    shortDescription:
      "Técnica fluida y envolvente para integrar cuerpo y mente.",
    description:
      "Una técnica fluida y envolvente que busca la integración del cuerpo y la mente. Con movimientos largos y profundos, este masaje induce un estado de relajación total, reconectando con la respiración y liberando bloqueos emocionales.",
    durations: [
      { minutes: 60, price: 50 },
      { minutes: 75, price: 60 },
      { minutes: 90, price: 70 },
    ],
  },
  {
    id: "californiano-4-manos",
    title: "Masaje Californiano a 4 Manos",
    shortDescription:
      "La misma experiencia del Masaje Californiano llevada a otro nivel con dos terapeutas en perfecta sincronía.",
    description:
      "El Masaje Californiano a 4 Manos ofrece la misma experiencia profunda, envolvente y consciente del Masaje Californiano, llevada a otro nivel gracias al trabajo simultáneo de dos terapeutas en perfecta sincronía.\n\nBasado en movimientos largos y fluidos, contacto envolvente y escucha corporal profunda, este masaje invita a soltar tensiones, abandonar el control y entrar en un estado de descanso muy profundo.\n\nAl ser realizado por dos terapeutas a la vez:\n- El sistema nervioso se relaja más rápidamente\n- La mente se rinde con mayor facilidad\n- La sensación de sostén, presencia y continuidad se intensifica\n\nEl cuerpo recibe estímulos simultáneos y armonizados, lo que favorece una integración global, una mayor desconexión mental y una experiencia sensorial más envolvente.\n\nDuración recomendada: 1h30\n\nReserva: este masaje debe reservarse con al menos una semana de antelación, para poder coordinar a ambos terapeutas.",
    durations: [
      { minutes: 60, price: 100 },
      { minutes: 75, price: 120 },
      { minutes: 90, price: 140 },
    ],
  },
  {
    id: "deep-tissue",
    title: "Masaje Deep Tissue",
    shortDescription:
      "Libera tensiones crónicas trabajando las capas más profundas.",
    description:
      "Enfocado en liberar tensiones crónicas y trabajar las capas más profundas de la musculatura. Ideal para contracturas persistentes, este tratamiento combina presión firme y técnicas específicas para devolver movilidad y alivio duradero.",
    durations: [
      { minutes: 60, price: 50 },
      { minutes: 75, price: 60 },
      { minutes: 90, price: 70 },
    ],
  },
  {
    id: "descontracturante",
    title: "Masaje Descontracturante",
    shortDescription:
      "Libera contracturas y tensiones musculares con técnicas específicas.",
    description:
      "Un masaje profundo y preciso, pensado para liberar tensiones acumuladas, disolver contracturas y recuperar la movilidad natural del cuerpo.\n\nIntegra presiones, amasamientos, fricciones, movilizaciones, estiramientos y otras técnicas de quiromasaje, adaptando la intensidad según tus necesidades y el estado de tus músculos.\n\nEs ideal si sientes rigidez en cuello, hombros, espalda, piernas o brazos debido al estrés, malas posturas o sobrecarga física.\n\nBeneficios:\n• Alivio del dolor muscular y de las contracturas\n• Mejora de la circulación y oxigenación\n• Sensación de ligereza, vitalidad y bienestar\n\nDuración recomendada: 1h / 1h15 / 1h30, según las zonas a tratar, la intensidad del cuadro y la agudeza de los síntomas. En algunos casos, pueden ser necesarias varias sesiones para una mejora duradera.",
    durations: [
      { minutes: 60, price: 50 },
      { minutes: 75, price: 60 },
      { minutes: 90, price: 70 },
    ],
  },
  {
    id: "neurosedante",
    title: "Masaje Neurosedante",
    shortDescription:
      "Calma el sistema nervioso y reduce el estrés profundamente.",
    description:
      "Orientado a calmar el sistema nervioso y reducir el estrés. A través de toques suaves y rítmicos, este masaje actúa directamente sobre el sistema nervioso central, induciendo un profundo estado de calma y bienestar.",
    durations: [
      { minutes: 60, price: 45 },
      { minutes: 75, price: 55 },
      { minutes: 90, price: 65 },
    ],
  },
  {
    id: "acompanamiento",
    title: "Acompañamiento Corporal",
    shortDescription:
      "Una sesión totalmente personalizada que combina Californiano, Deep Tissue y Quiromasaje.",
    description:
      "Una sesión de masaje terapéutico totalmente personalizada que combina lo mejor del Masaje Californiano, del Deep Tissue y del Quiromasaje, con estiramientos y movilizaciones, para adaptarse a las necesidades específicas de cada persona: desde liberar tensiones hasta inducir un estado de calma profunda.\n\nBeneficios:\n• Tratamiento adaptado a cada cuerpo\n• Recuperación física y emocional\n• Mayor conciencia corporal y conexión interior\n\nDuración recomendada: 1h30",
    durations: [
      { minutes: 60, price: 55 },
      { minutes: 75, price: 65 },
      { minutes: 90, price: 75 },
    ],
  },
]
