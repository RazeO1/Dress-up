import { NextRequest, NextResponse } from "next/server"
import { createClient as createSupabaseServerClient } from "@/lib/supabase/server"
import { removeBackground } from "@/lib/clipdrop"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 })
    }

    // Read the file as a buffer
    const arrayBuffer = await file.arrayBuffer()
    const imageBuffer = Buffer.from(arrayBuffer)

    // Process with Clipdrop (remove background)
    let processedBuffer: Buffer
    try {
      processedBuffer = await removeBackground(imageBuffer)
    } catch (clipdropError) {
      // If Clipdrop fails, fall back to original image
      console.error("Clipdrop processing failed, using original image:", clipdropError)
      processedBuffer = imageBuffer
    }

    // Upload to Supabase Storage
    const fileId = crypto.randomUUID()
    const fileName = `${fileId}.png`
    const filePath = `${user.id}/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from("wardrobe-images")
      .upload(filePath, processedBuffer, {
        contentType: "image/png",
        upsert: false,
      })

    if (uploadError) {
      return NextResponse.json({ error: "Failed to upload image" }, { status: 500 })
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("wardrobe-images")
      .getPublicUrl(filePath)

    return NextResponse.json({
      imageUrl: urlData.publicUrl,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
