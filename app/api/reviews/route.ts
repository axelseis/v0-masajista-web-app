import { NextResponse } from "next/server"
import { getGoogleReviews } from "@/lib/google-places"

export const revalidate = 86400 // 24 horas

export async function GET() {
  try {
    const reviews = await getGoogleReviews({
      minStars: 5,
      maxReviews: 3,
    })
    return NextResponse.json({ reviews })
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return NextResponse.json(
      { error: "Error al cargar las reseñas", reviews: [] },
      { status: 500 }
    )
  }
}
