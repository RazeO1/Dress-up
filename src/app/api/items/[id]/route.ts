import { NextRequest, NextResponse } from "next/server"
import { createClient as createSupabaseServerClient } from "@/lib/supabase/server"
import { z } from "zod"

const updateItemSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  category: z.enum(["tops", "bottoms", "dresses", "outerwear", "shoes", "accessories"]).optional(),
  color: z.string().optional().nullable(),
  color_hex: z.string().optional().nullable(),
  pattern: z.string().optional().nullable(),
  season: z.array(z.enum(["spring", "summer", "fall", "winter", "all-season"])).optional(),
  occasion: z.array(z.string()).optional(),
  image_url: z.string().url().optional(),
  thumbnail_url: z.string().url().optional().nullable(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data, error } = await supabase
      .from("items")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single()

    if (error || !data) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error("GET /api/items/[id] error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const parsed = updateItemSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from("items")
      .update(parsed.data)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single()

    if (error) throw error
    if (!data) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error("PATCH /api/items/[id] error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the item to find the image path for storage deletion
    const { data: item } = await supabase
      .from("items")
      .select("image_url")
      .eq("id", id)
      .eq("user_id", user.id)
      .single()

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    // Delete from database
    const { error } = await supabase
      .from("items")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id)

    if (error) throw error

    // Try to delete image from storage (best-effort)
    try {
      if (item.image_url) {
        const url = new URL(item.image_url)
        const pathParts = url.pathname.split("/")
        const fileName = pathParts[pathParts.length - 1]
        if (fileName) {
          await supabase.storage
            .from("wardrobe-images")
            .remove([`${user.id}/${fileName}`])
        }
      }
    } catch {
      // Ignore storage deletion errors
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE /api/items/[id] error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
