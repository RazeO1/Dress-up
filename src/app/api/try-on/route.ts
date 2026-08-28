import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const snapshotSchema = z.object({
  body_photo_url: z.string().url(),
  composite_image_url: z.string().url(),
  items_used: z.array(z.string().uuid()).default([]),
  adjustments: z.object({
    position: z.object({ x: z.number(), y: z.number() }),
    scale: z.number(),
    rotation: z.number(),
    opacity: z.number(),
    blendMode: z.enum(["normal", "multiply", "overlay"]),
  }).default({ position: { x: 50, y: 50 }, scale: 1, rotation: 0, opacity: 1, blendMode: "normal" }),
});

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = snapshotSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("try_on_snapshots")
    .insert({ ...parsed.data, user_id: user.id })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}
