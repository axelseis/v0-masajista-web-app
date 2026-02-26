/**
 * Google Places API (New) - Obtiene reseñas de Google Maps/Business
 * https://developers.google.com/maps/documentation/places/web-service/place-details
 *
 * Requiere: Places API (New) habilitada + API Key en GOOGLE_PLACES_API_KEY
 * Place ID en GOOGLE_PLACE_ID (de tu ficha de Google Business)
 */

import { unstable_cache } from "next/cache"

const PLACES_API_BASE = "https://places.googleapis.com/v1"

export interface GoogleReview {
  text: string
  name: string
  rating: number
  detail?: string
}

async function fetchGoogleReviewsUncached(options: {
  placeId: string
  apiKey: string
  minStars: number
  maxReviews: number
}): Promise<GoogleReview[]> {
  const { placeId, apiKey, minStars, maxReviews } = options
  try {
    const res = await fetch(
      `${PLACES_API_BASE}/places/${placeId}?languageCode=es`,
      {
        headers: {
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": "reviews,rating,userRatingCount",
        },
        next: { revalidate: 86400 }, // 24h - las reseñas no cambian tan a menudo
      }
    )

    if (!res.ok) {
      const text = await res.text()
      console.error("Places API error:", res.status, text)
      return []
    }

    const data = (await res.json()) as {
      reviews?: Array<{
        text?: { text?: string }
        originalText?: { text?: string }
        rating?: number
        authorAttribution?: { displayName?: string }
        relativePublishTimeDescription?: string
        publishTime?: string
      }>
    }

    const rawReviews = data.reviews ?? []

    const reviews: GoogleReview[] = rawReviews
      .filter((r) => (r.rating ?? 0) >= minStars)
      .sort((a, b) => {
        const timeA = a.publishTime ? new Date(a.publishTime).getTime() : 0
        const timeB = b.publishTime ? new Date(b.publishTime).getTime() : 0
        return timeB - timeA // más recientes primero
      })
      .slice(0, maxReviews)
      .map((r) => {
        const text = r.text?.text ?? r.originalText?.text ?? ""
        const nameRaw = r.authorAttribution?.displayName ?? "Cliente"
        // Anonimizar: "Juan García" -> "Juan G."
        const parts = nameRaw.trim().split(/\s+/)
        const name =
          parts.length > 1
            ? `${parts[0]} ${(parts[parts.length - 1]?.[0] ?? "")}.`
            : `${nameRaw[0] ?? "C"}.`

        return {
          text,
          name,
          rating: r.rating ?? 5,
          detail: r.relativePublishTimeDescription
            ? `Google · ${r.relativePublishTimeDescription}`
            : "Google",
        }
      })

    return reviews
  } catch (err) {
    console.error("Error fetching Google reviews:", err)
    return []
  }
}

export async function getGoogleReviews(options?: {
  placeId?: string
  minStars?: number
  maxReviews?: number
}): Promise<GoogleReview[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  const placeId = options?.placeId ?? process.env.GOOGLE_PLACE_ID
  const minStars = options?.minStars ?? 5
  const maxReviews = options?.maxReviews ?? 5

  if (!apiKey || !placeId) {
    return []
  }

  const cached = unstable_cache(
    () => fetchGoogleReviewsUncached({ placeId, apiKey, minStars, maxReviews }),
    [`google-reviews-${placeId}`],
    { revalidate: 86400 }
  )

  return cached()
}
