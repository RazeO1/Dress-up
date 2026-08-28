import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const itemSchema = z.object({
  name: z.string().min(1).max(100),
  category: z.enum(["tops", "bottoms", "shoes", "accessories", "outerwear", "dresses"]),
  color: z.string().optional().nullable(),
  color_hex: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional().nullable(),
  pattern: z.string().optional().nullable(),
  season: z.array(z.enum(["spring", "summer", "fall", "winter"])).default([]),
  occasion: z.array(z.enum(["casual", "formal", "work", "party", "sports", "lounge"])).default([]),
  image_url: z.string().url(),
  thumbnail_url: z.string().url().optional().nullable(),
  metadata: z.record(z.unknown()).default({}),
});

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const search = searchParams.get("search");

  let query = supabase
    .from("items")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (category && category !== "all") {
    query = query.eq("category", category);
  }

  if (search) {
    query = query.ilike("name", `%${search}%`);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = itemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("items")
    .insert({ ...parsed.data, user_id: user.id })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}
