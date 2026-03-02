import { es } from "./es"
import { en } from "./en"
import { fr } from "./fr"

export const translations = {
  es,
  en,
  fr,
} as const

export type Translations = (typeof translations)["es"]
