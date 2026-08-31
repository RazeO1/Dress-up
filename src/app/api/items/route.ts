import { NextRequest, NextResponse } from "next/server"
import { createClient as createSupabaseServerClient } from "@/lib/supabase/server"
import { z } from "zod"

const createItemSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  category: z.enum(["tops", "bottoms", "dresses", "outerwear", "shoes", "accessories"]),
  color: z.string().optional().nullable(),
  color_hex: z.string().optional().nullable(),
  pattern: z.string().optional().nullable(),
  season: z.array(z.enum(["spring", "summer", "fall", "winter", "all-season"])).default([]),
  occasion: z.array(z.string()).default([]),
  image_url: z.string().url(),
  thumbnail_url: z.string().url().optional().nullable(),
})

export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")

    let query = supabase
      .from("items")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (category && category !== "all") {
      query = query.eq("category", category)
    }

    const { data, error } = await query
    if (error) throw error

    return NextResponse.json({ data: data ?? [] })
  } catch (error) {
    console.error("GET /api/items error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const parsed = createItemSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from("items")
      .insert([{ ...parsed.data, user_id: user.id }])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ data })
  } catch (error) {
    console.error("POST /api/items error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
